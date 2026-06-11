export const ITALY_PEOPLE_COUNT = 58_000_000;
export const ITALY_CARS_COUNT = 41_000_000;
export const DATASET_FORMAT = "vehicles-dataset-v1";
export const BYTES_PER_OWNER_ID = 4;
export const DEFAULT_DATASET_PATH = "datasets/italian-market-vehicles.dataset.bin";

export type DatasetHeader = {
    format: typeof DATASET_FORMAT;
    peopleCount: number;
    carsCount: number;
    bytesPerOwnerId: typeof BYTES_PER_OWNER_ID;
    ownerStrategy: "round-robin";
    createdAt: string;
};

export function ownerIdForCar(carId: number, peopleCount: number): number {
    return ((carId - 1) % peopleCount) + 1;
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("it-IT").format(value);
}

export function formatDuration(ms: number): string {
    const seconds = ms / 1_000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (days >= 1) return `${days.toFixed(2)} giorni`;
    if (hours >= 1) return `${hours.toFixed(2)} ore`;
    if (minutes >= 1) return `${minutes.toFixed(2)} minuti`;
    if (seconds >= 1) return `${seconds.toFixed(2)} secondi`;
    return `${ms.toFixed(2)} ms`;
}
