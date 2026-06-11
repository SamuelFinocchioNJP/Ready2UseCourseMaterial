import assert from "node:assert/strict";
import test from "node:test";
import { performance } from "node:perf_hooks";
import {
    assegnaVeicoliConMap,
    assegnaVeicoliNaive,
    type Automobilista,
    type AutomobilistaConVeicoli,
    type Veicolo,
} from "./vehicles.excercise.ts";

type Dataset = {
    automobilisti: Automobilista[];
    veicoli: Veicolo[];
};

const DEFAULT_AUTOMOBILISTI_COUNT = 50_000;
const DEFAULT_VEICOLI_COUNT = 100_000;
const ITALY_PEOPLE_COUNT = 58_000_000;
const ITALY_CARS_COUNT = 41_000_000;
const RUN_FULL_ITALY_MARKET_BENCHMARK = process.env.RUN_FULL_ITALY_MARKET_BENCHMARK === "1";
const RUN_FULL_ITALY_MARKET_NAIVE = process.env.RUN_FULL_ITALY_MARKET_NAIVE === "1";

function createLargeDataset(
    automobilistiCount = DEFAULT_AUTOMOBILISTI_COUNT,
    veicoliCount = DEFAULT_VEICOLI_COUNT
): Dataset {
    const automobilisti: Automobilista[] = [];
    for (let i = 1; i <= automobilistiCount; i++) {
        automobilisti.push({
            id: i,
            cf: `CF${i.toString().padStart(14, "0")}`,
            nome: `Automobilista ${i}`,
            eta: 18 + (i % 60),
        });
    }

    const veicoli: Veicolo[] = [];
    for (let i = 1; i <= veicoliCount; i++) {
        veicoli.push({
            id: i,
            targa: `AA${i.toString().padStart(5, "0")}`,
            modello: `Modello ${i}`,
            // Tutti i veicoli appartengono all'ultimo automobilista:
            // questo obbliga la soluzione naive a scorrere quasi tutta la lista ogni volta.
            idProprietario: automobilistiCount,
        });
    }

    return { automobilisti, veicoli };
}

function measure<T>(label: string, fn: () => T): { label: string; result: T; ms: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    return {
        label,
        result,
        ms: end - start,
    };
}

function countAssignedVehicles(result: AutomobilistaConVeicoli[]): number {
    return result.reduce((total, automobilista) => total + automobilista.veicoli.length, 0);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("it-IT").format(value);
}

function formatDuration(ms: number): string {
    const seconds = ms / 1_000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;

    if (years >= 1) return `${years.toFixed(2)} anni`;
    if (days >= 1) return `${days.toFixed(2)} giorni`;
    if (hours >= 1) return `${hours.toFixed(2)} ore`;
    if (minutes >= 1) return `${minutes.toFixed(2)} minuti`;
    if (seconds >= 1) return `${seconds.toFixed(2)} secondi`;
    return `${ms.toFixed(2)} ms`;
}

test("le due soluzioni producono lo stesso risultato", () => {
    const dataset = createLargeDataset(100, 500);

    const withMap = assegnaVeicoliConMap(dataset.automobilisti, dataset.veicoli);
    const naive = assegnaVeicoliNaive(dataset.automobilisti, dataset.veicoli);

    assert.deepEqual(naive, withMap);
    assert.equal(countAssignedVehicles(withMap), dataset.veicoli.length);
});

test("performance: Map vs nested loops su dataset grande", () => {
    const dataset = createLargeDataset();

    // Warm-up: aiuta V8 a ottimizzare le funzioni prima della misurazione vera.
    const warmupDataset = createLargeDataset(100, 100);
    assegnaVeicoliConMap(warmupDataset.automobilisti, warmupDataset.veicoli);
    assegnaVeicoliNaive(warmupDataset.automobilisti, warmupDataset.veicoli);

    const withMap = measure("Map", () => assegnaVeicoliConMap(dataset.automobilisti, dataset.veicoli));
    const naive = measure("Naive", () => assegnaVeicoliNaive(dataset.automobilisti, dataset.veicoli));

    assert.equal(countAssignedVehicles(withMap.result), dataset.veicoli.length);
    assert.equal(countAssignedVehicles(naive.result), dataset.veicoli.length);
    assert.deepEqual(naive.result, withMap.result);
    assert.ok(
        withMap.ms < naive.ms,
        `La soluzione con Map dovrebbe essere piu veloce: Map ${withMap.ms.toFixed(2)}ms, Naive ${naive.ms.toFixed(2)}ms`
    );

    const speedup = naive.ms / withMap.ms;
    console.log(`
Dataset:
- automobilisti: ${dataset.automobilisti.length}
- veicoli: ${dataset.veicoli.length}

Tempi:
- ${withMap.label}: ${withMap.ms.toFixed(2)} ms
- ${naive.label}: ${naive.ms.toFixed(2)} ms
- speedup Map vs Naive: ${speedup.toFixed(2)}x
`);
});

test("simulazione mercato italiano: stima con 58M persone e 41M auto", () => {
    const calibrationDataset = createLargeDataset(10_000, 20_000);

    const withMap = measure("Map calibration", () =>
        assegnaVeicoliConMap(calibrationDataset.automobilisti, calibrationDataset.veicoli)
    );
    const naive = measure("Naive calibration", () =>
        assegnaVeicoliNaive(calibrationDataset.automobilisti, calibrationDataset.veicoli)
    );

    assert.equal(countAssignedVehicles(withMap.result), calibrationDataset.veicoli.length);
    assert.equal(countAssignedVehicles(naive.result), calibrationDataset.veicoli.length);
    assert.deepEqual(naive.result, withMap.result);

    const calibrationMapOperations = calibrationDataset.automobilisti.length + calibrationDataset.veicoli.length;
    const italyMapOperations = ITALY_PEOPLE_COUNT + ITALY_CARS_COUNT;

    const calibrationNaiveComparisons = calibrationDataset.automobilisti.length * calibrationDataset.veicoli.length;
    const italyNaiveComparisons = ITALY_PEOPLE_COUNT * ITALY_CARS_COUNT;

    const estimatedMapMs = withMap.ms * (italyMapOperations / calibrationMapOperations);
    const estimatedNaiveMs = naive.ms * (italyNaiveComparisons / calibrationNaiveComparisons);

    assert.ok(estimatedMapMs < estimatedNaiveMs);

    console.log(`
Simulazione mercato italiano:
- persone: ${formatNumber(ITALY_PEOPLE_COUNT)}
- auto: ${formatNumber(ITALY_CARS_COUNT)}

Operazioni stimate:
- Map: ${formatNumber(italyMapOperations)} operazioni circa
- Naive: ${formatNumber(italyNaiveComparisons)} confronti circa

Stima tempi basata su dataset di calibrazione:
- Map: ${formatDuration(estimatedMapMs)}
- Naive: ${formatDuration(estimatedNaiveMs)}
- speedup stimato: ${(estimatedNaiveMs / estimatedMapMs).toFixed(2)}x
`);
});

if (RUN_FULL_ITALY_MARKET_BENCHMARK) {
    test("performance reale mercato italiano completo", { timeout: 0 }, () => {
        const dataset = createLargeDataset(ITALY_PEOPLE_COUNT, ITALY_CARS_COUNT);
        const withMap = measure("Map", () => assegnaVeicoliConMap(dataset.automobilisti, dataset.veicoli));

        assert.equal(countAssignedVehicles(withMap.result), dataset.veicoli.length);

        console.log(`
Mercato italiano completo:
- persone: ${formatNumber(dataset.automobilisti.length)}
- auto: ${formatNumber(dataset.veicoli.length)}
- Map: ${formatDuration(withMap.ms)}
`);

        if (!RUN_FULL_ITALY_MARKET_NAIVE) {
            console.log("Naive saltata: impostare RUN_FULL_ITALY_MARKET_NAIVE=1 per provarla comunque.");
            return;
        }

        const naive = measure("Naive", () => assegnaVeicoliNaive(dataset.automobilisti, dataset.veicoli));

        assert.equal(countAssignedVehicles(naive.result), dataset.veicoli.length);
        assert.deepEqual(naive.result, withMap.result);

        console.log(`
- Naive: ${formatDuration(naive.ms)}
- speedup Map vs Naive: ${(naive.ms / withMap.ms).toFixed(2)}x
`);
    });
} else {
    test.skip("performance reale mercato italiano completo", () => {
        console.log("Impostare RUN_FULL_ITALY_MARKET_BENCHMARK=1 per tentare il benchmark completo.");
    });
}
