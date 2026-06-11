import { once } from "node:events";
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import {
    BYTES_PER_OWNER_ID,
    DATASET_FORMAT,
    DEFAULT_DATASET_PATH,
    ITALY_CARS_COUNT,
    ITALY_PEOPLE_COUNT,
    type DatasetHeader,
    formatDuration,
    formatNumber,
    ownerIdForCar,
} from "./vehicles.dataset.ts";

const peopleCount = Number(process.env.PEOPLE_COUNT ?? ITALY_PEOPLE_COUNT);
const carsCount = Number(process.env.CARS_COUNT ?? ITALY_CARS_COUNT);
const datasetPath = resolve(process.env.DATASET_PATH ?? DEFAULT_DATASET_PATH);
const chunkCars = Number(process.env.CHUNK_CARS ?? 1_000_000);
const force = process.env.FORCE_DATASET_WRITE === "1";

if (!Number.isInteger(peopleCount) || peopleCount <= 0) {
    throw new Error("PEOPLE_COUNT must be a positive integer");
}

if (!Number.isInteger(carsCount) || carsCount <= 0) {
    throw new Error("CARS_COUNT must be a positive integer");
}

if (!Number.isInteger(chunkCars) || chunkCars <= 0) {
    throw new Error("CHUNK_CARS must be a positive integer");
}

if (peopleCount > 0xffffffff) {
    throw new Error("peopleCount is too large for UInt32 owner ids");
}

if (existsSync(datasetPath) && !force) {
    const existingSizeMb = statSync(datasetPath).size / 1024 / 1024;
    throw new Error(
        `Dataset already exists at ${datasetPath} (${existingSizeMb.toFixed(2)} MB). ` +
        "Set FORCE_DATASET_WRITE=1 to overwrite it."
    );
}

mkdirSync(dirname(datasetPath), { recursive: true });

const header: DatasetHeader = {
    format: DATASET_FORMAT,
    peopleCount,
    carsCount,
    bytesPerOwnerId: BYTES_PER_OWNER_ID,
    ownerStrategy: "round-robin",
    createdAt: new Date().toISOString(),
};

const start = performance.now();
const stream = createWriteStream(datasetPath);

stream.write(`${JSON.stringify(header)}\n`);

for (let firstCarId = 1; firstCarId <= carsCount; firstCarId += chunkCars) {
    const carsInChunk = Math.min(chunkCars, carsCount - firstCarId + 1);
    const chunk = Buffer.allocUnsafe(carsInChunk * BYTES_PER_OWNER_ID);

    for (let offset = 0; offset < carsInChunk; offset++) {
        const carId = firstCarId + offset;
        const ownerId = ownerIdForCar(carId, peopleCount);
        chunk.writeUInt32LE(ownerId, offset * BYTES_PER_OWNER_ID);
    }

    if (!stream.write(chunk)) {
        await once(stream, "drain");
    }

    const carsWritten = firstCarId + carsInChunk - 1;
    if (carsWritten % 5_000_000 === 0 || carsWritten === carsCount) {
        console.log(`Written ${formatNumber(carsWritten)} / ${formatNumber(carsCount)} cars`);
    }
}

stream.end();
await once(stream, "finish");

const elapsedMs = performance.now() - start;
const sizeMb = statSync(datasetPath).size / 1024 / 1024;

console.log(`
Dataset created:
- path: ${datasetPath}
- people: ${formatNumber(peopleCount)}
- cars: ${formatNumber(carsCount)}
- size: ${sizeMb.toFixed(2)} MB
- elapsed: ${formatDuration(elapsedMs)}
`);
