import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { open, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import {
    BYTES_PER_OWNER_ID,
    DATASET_FORMAT,
    DEFAULT_DATASET_PATH,
    type DatasetHeader,
    formatDuration,
    formatNumber,
} from "./vehicles.dataset.ts";

const datasetPath = resolve(process.env.DATASET_PATH ?? DEFAULT_DATASET_PATH);

async function readHeader(path: string): Promise<{ header: DatasetHeader; dataStart: number }> {
    const file = await open(path, "r");

    try {
        const buffer = Buffer.alloc(4096);
        const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
        const newlineIndex = buffer.subarray(0, bytesRead).indexOf("\n");

        if (newlineIndex === -1) {
            throw new Error("Dataset header line not found");
        }

        const header = JSON.parse(buffer.subarray(0, newlineIndex).toString("utf8")) as DatasetHeader;

        if (header.format !== DATASET_FORMAT) {
            throw new Error(`Unsupported dataset format: ${header.format}`);
        }

        if (header.bytesPerOwnerId !== BYTES_PER_OWNER_ID) {
            throw new Error(`Unsupported owner id size: ${header.bytesPerOwnerId}`);
        }

        return {
            header,
            dataStart: newlineIndex + 1,
        };
    } finally {
        await file.close();
    }
}

async function runEfficientAssignmentFromDataset(path: string): Promise<void> {
    const { header, dataStart } = await readHeader(path);
    const fileSize = (await stat(path)).size;
    const expectedSize = dataStart + header.carsCount * BYTES_PER_OWNER_ID;

    assert.equal(
        fileSize,
        expectedSize,
        `Dataset size mismatch. Expected ${expectedSize} bytes, got ${fileSize} bytes.`
    );

    const start = performance.now();
    const carsPerOwner = new Uint32Array(header.peopleCount + 1);
    let processedCars = 0;
    let leftover = Buffer.alloc(0);

    for await (const chunk of createReadStream(path, { start: dataStart })) {
        const data = leftover.length > 0 ? Buffer.concat([leftover, chunk]) : chunk;
        const readableBytes = data.length - (data.length % BYTES_PER_OWNER_ID);

        for (let offset = 0; offset < readableBytes; offset += BYTES_PER_OWNER_ID) {
            const ownerId = data.readUInt32LE(offset);

            if (ownerId < 1 || ownerId > header.peopleCount) {
                throw new Error(`Invalid owner id ${ownerId} at car index ${processedCars + 1}`);
            }

            carsPerOwner[ownerId]++;
            processedCars++;
        }

        leftover = data.subarray(readableBytes);
    }

    assert.equal(leftover.length, 0, "Dataset ended with incomplete owner id bytes");
    assert.equal(processedCars, header.carsCount);

    let ownersWithCars = 0;
    for (let ownerId = 1; ownerId < carsPerOwner.length; ownerId++) {
        if (carsPerOwner[ownerId] > 0) {
            ownersWithCars++;
        }
    }

    const elapsedMs = performance.now() - start;

    console.log(`
Efficient dataset execution:
- dataset: ${path}
- people: ${formatNumber(header.peopleCount)}
- cars: ${formatNumber(header.carsCount)}
- owners with cars: ${formatNumber(ownersWithCars)}
- elapsed: ${formatDuration(elapsedMs)}
`);
}

await runEfficientAssignmentFromDataset(datasetPath);
