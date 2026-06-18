import { parse } from "csv-parse/sync";
import { AirportUseCases } from "./use-cases";
import { ConflictError } from "../errors";
import { AirportInput } from "../types";

// Seeds the in-memory store from the public OpenFlights airport dataset.
// The store lives inside the server process (see store.ts), so this is invoked
// at startup from index.ts rather than as a standalone script.
const AIRPORTS_URL =
    "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";

// OpenFlights null marker for a missing field (a literal backslash + N).
const NULL_MARKER = "\\N";

// Column positions in airports.dat (no header row; fields are positional).
// Full layout: 0 AirportID, 1 Name, 2 City, 3 Country, 4 IATA, 5 ICAO,
// 6 Lat, 7 Lon, 8 Altitude, 9 UTCOffset, 10 DST, 11 TzDatabaseName, 12 Type, 13 Source.
const COL = { name: 1, city: 2, country: 3, iata: 4, timezone: 11 } as const;

export interface ImportSummary {
    imported: number; // newly created airports
    updated: number; // existing airports refreshed
    skipped: number; // rows without a usable IATA code (no primary key)
    failed: number; // rows that threw an unexpected error
}

// Treat the OpenFlights null marker (and blanks) as "no value".
function clean(field: string | undefined): string {
    const value = (field ?? "").trim();
    return value === NULL_MARKER ? "" : value;
}

export async function importAirports(uc: AirportUseCases): Promise<ImportSummary> {
    const res = await fetch(AIRPORTS_URL);
    if (!res.ok) {
        throw new Error(`Failed to download airports.dat: ${res.status} ${res.statusText}`);
    }
    const csv = (await res.text()).replaceAll("\N", "");

    // No header row; quoted fields may contain commas. relax_* keeps the odd
    // malformed line from aborting the whole parse.
    const rows: string[][] = parse(csv, {
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: false,
    });

    const summary: ImportSummary = { imported: 0, updated: 0, skipped: 0, failed: 0 };

    for (const row of rows) {
        const code = clean(row[COL.iata]);
        // IATA code is the store's primary key; a row without one cannot be stored.
        if (!code) {
            console.log("SKIPPED:", row)
            summary.skipped++;
            continue;
        }

        const input: AirportInput = {
            code,
            name: clean(row[COL.name]),
            city: clean(row[COL.city]),
            country: clean(row[COL.country]),
            timezone: clean(row[COL.timezone]),
        };

        // Upsert so the job is idempotent and tolerant of duplicate IATA codes
        // within the file (last one wins).
        try {
            if (input.country === "Italy") {
                await uc.create.execute({ context: {}, data: input });
                summary.imported++;
            }
        } catch (err) {
            if (err instanceof ConflictError) {
                await uc.update.execute({ context: {}, data: { code, airport: input } });
                summary.updated++;
            } else {
                summary.failed++;
                console.error(`Failed to import airport "${code}":`, err);
            }
        }
    }

    console.log(
        `Airport import complete: ${summary.imported} imported, ${summary.updated} updated, ` +
        `${summary.skipped} skipped, ${summary.failed} failed.`
    );
    return summary;
}
