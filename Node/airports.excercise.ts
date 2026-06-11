// Airports list
// Basic airport info

// for each airport we have
// future flights list (source, destination, dateTimeDeparture, dateTimeLanding)

// Definire typing
// Dato un range orario di arrivo, 
// trovare tutti gli aereoporti 
// che atterrano in quella destinazione 
// in quella fascia oraria

// Dato un aereoporto
// Dire se è possibile raggiungere una destinazione
// 1. Diretta

// 2. Indiretta ovvero se è possibile 
// raggiungere un aereoporto 
// che a sua volta ha voli 
// che possono raggiungere la destinazione (HARD)

export type AirportCode =
    | "FCO"
    | "LIN"
    | "MXP"
    | "NAP"
    | "TRN"
    | "VCE"
    | "BLQ"
    | "PMO"
    | "CTA"
    | "CAG"
    | "CDG"
    | "AMS";

export interface Flight {
    id: number;
    source: AirportCode;
    destination: AirportCode;
    dateTimeDeparture: string;
    dateTimeLanding: string;
    airline: string;
    flightNumber: string;
}

export interface Airport {
    code: AirportCode;
    name: string;
    city: string;
    country: string;
    timezone: string;
    futureFlights: Flight[];
}

export const flights: Flight[] = [
    {
        id: 1,
        source: "FCO",
        destination: "LIN",
        dateTimeDeparture: "2026-06-10T06:45:00+02:00",
        dateTimeLanding: "2026-06-10T07:55:00+02:00",
        airline: "ITA Airways",
        flightNumber: "AZ2010",
    },
    {
        id: 2,
        source: "FCO",
        destination: "CDG",
        dateTimeDeparture: "2026-06-10T09:30:00+02:00",
        dateTimeLanding: "2026-06-10T11:40:00+02:00",
        airline: "Air France",
        flightNumber: "AF1205",
    },
    {
        id: 3,
        source: "FCO",
        destination: "PMO",
        dateTimeDeparture: "2026-06-10T14:15:00+02:00",
        dateTimeLanding: "2026-06-10T15:20:00+02:00",
        airline: "ITA Airways",
        flightNumber: "AZ1795",
    },
    {
        id: 4,
        source: "LIN",
        destination: "NAP",
        dateTimeDeparture: "2026-06-10T08:40:00+02:00",
        dateTimeLanding: "2026-06-10T10:00:00+02:00",
        airline: "ITA Airways",
        flightNumber: "AZ1285",
    },
    {
        id: 5,
        source: "LIN",
        destination: "AMS",
        dateTimeDeparture: "2026-06-10T12:20:00+02:00",
        dateTimeLanding: "2026-06-10T14:15:00+02:00",
        airline: "KLM",
        flightNumber: "KL1614",
    },
    {
        id: 6,
        source: "MXP",
        destination: "VCE",
        dateTimeDeparture: "2026-06-10T07:30:00+02:00",
        dateTimeLanding: "2026-06-10T08:35:00+02:00",
        airline: "EasyJet",
        flightNumber: "U22801",
    },
    {
        id: 7,
        source: "MXP",
        destination: "CTA",
        dateTimeDeparture: "2026-06-10T16:00:00+02:00",
        dateTimeLanding: "2026-06-10T17:55:00+02:00",
        airline: "Ryanair",
        flightNumber: "FR5518",
    },
    {
        id: 8,
        source: "NAP",
        destination: "CAG",
        dateTimeDeparture: "2026-06-10T11:10:00+02:00",
        dateTimeLanding: "2026-06-10T12:25:00+02:00",
        airline: "Volotea",
        flightNumber: "V71724",
    },
    {
        id: 9,
        source: "NAP",
        destination: "AMS",
        dateTimeDeparture: "2026-06-10T17:30:00+02:00",
        dateTimeLanding: "2026-06-10T20:05:00+02:00",
        airline: "Transavia",
        flightNumber: "HV6412",
    },
    {
        id: 10,
        source: "TRN",
        destination: "FCO",
        dateTimeDeparture: "2026-06-10T06:50:00+02:00",
        dateTimeLanding: "2026-06-10T08:05:00+02:00",
        airline: "ITA Airways",
        flightNumber: "AZ1428",
    },
    {
        id: 11,
        source: "VCE",
        destination: "BLQ",
        dateTimeDeparture: "2026-06-10T09:15:00+02:00",
        dateTimeLanding: "2026-06-10T10:05:00+02:00",
        airline: "SkyAlps",
        flightNumber: "BQ1950",
    },
    {
        id: 12,
        source: "VCE",
        destination: "CDG",
        dateTimeDeparture: "2026-06-10T13:10:00+02:00",
        dateTimeLanding: "2026-06-10T15:05:00+02:00",
        airline: "Air France",
        flightNumber: "AF1727",
    },
    {
        id: 13,
        source: "BLQ",
        destination: "MXP",
        dateTimeDeparture: "2026-06-10T10:50:00+02:00",
        dateTimeLanding: "2026-06-10T11:45:00+02:00",
        airline: "Neos",
        flightNumber: "NO901",
    },
    {
        id: 14,
        source: "BLQ",
        destination: "PMO",
        dateTimeDeparture: "2026-06-10T18:20:00+02:00",
        dateTimeLanding: "2026-06-10T19:45:00+02:00",
        airline: "Ryanair",
        flightNumber: "FR3925",
    },
    {
        id: 15,
        source: "PMO",
        destination: "CTA",
        dateTimeDeparture: "2026-06-10T16:00:00+02:00",
        dateTimeLanding: "2026-06-10T16:45:00+02:00",
        airline: "Aeroitalia",
        flightNumber: "XZ2712",
    },
    {
        id: 16,
        source: "CTA",
        destination: "FCO",
        dateTimeDeparture: "2026-06-10T18:35:00+02:00",
        dateTimeLanding: "2026-06-10T20:00:00+02:00",
        airline: "ITA Airways",
        flightNumber: "AZ1752",
    },
    {
        id: 17,
        source: "CAG",
        destination: "TRN",
        dateTimeDeparture: "2026-06-10T13:25:00+02:00",
        dateTimeLanding: "2026-06-10T14:50:00+02:00",
        airline: "Volotea",
        flightNumber: "V71472",
    },
    {
        id: 18,
        source: "CDG",
        destination: "AMS",
        dateTimeDeparture: "2026-06-10T12:30:00+02:00",
        dateTimeLanding: "2026-06-10T13:45:00+02:00",
        airline: "Air France",
        flightNumber: "AF1640",
    },
    {
        id: 19,
        source: "AMS",
        destination: "MXP",
        dateTimeDeparture: "2026-06-10T15:00:00+02:00",
        dateTimeLanding: "2026-06-10T16:40:00+02:00",
        airline: "KLM",
        flightNumber: "KL1623",
    },
    {
        id: 20,
        source: "AMS",
        destination: "VCE",
        dateTimeDeparture: "2026-06-10T21:00:00+02:00",
        dateTimeLanding: "2026-06-10T22:45:00+02:00",
        airline: "KLM",
        flightNumber: "KL1635",
    },
];

export const airports: Airport[] = [
    {
        code: "FCO",
        name: "Aeroporto di Roma Fiumicino Leonardo da Vinci",
        city: "Roma",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "FCO"),
    },
    {
        code: "LIN",
        name: "Aeroporto di Milano Linate Enrico Forlanini",
        city: "Milano",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "LIN"),
    },
    {
        code: "MXP",
        name: "Aeroporto di Milano Malpensa",
        city: "Milano",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "MXP"),
    },
    {
        code: "NAP",
        name: "Aeroporto di Napoli Capodichino",
        city: "Napoli",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "NAP"),
    },
    {
        code: "TRN",
        name: "Aeroporto di Torino Caselle",
        city: "Torino",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "TRN"),
    },
    {
        code: "VCE",
        name: "Aeroporto di Venezia Marco Polo",
        city: "Venezia",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "VCE"),
    },
    {
        code: "BLQ",
        name: "Aeroporto di Bologna Guglielmo Marconi",
        city: "Bologna",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "BLQ"),
    },
    {
        code: "PMO",
        name: "Aeroporto di Palermo Falcone Borsellino",
        city: "Palermo",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "PMO"),
    },
    {
        code: "CTA",
        name: "Aeroporto di Catania Fontanarossa",
        city: "Catania",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "CTA"),
    },
    {
        code: "CAG",
        name: "Aeroporto di Cagliari Elmas",
        city: "Cagliari",
        country: "Italia",
        timezone: "Europe/Rome",
        futureFlights: flights.filter((flight) => flight.source === "CAG"),
    },
    {
        code: "CDG",
        name: "Aeroporto di Parigi Charles de Gaulle",
        city: "Parigi",
        country: "Francia",
        timezone: "Europe/Paris",
        futureFlights: flights.filter((flight) => flight.source === "CDG"),
    },
    {
        code: "AMS",
        name: "Aeroporto di Amsterdam Schiphol",
        city: "Amsterdam",
        country: "Paesi Bassi",
        timezone: "Europe/Amsterdam",
        futureFlights: flights.filter((flight) => flight.source === "AMS"),
    },
];



// ADJ list

// Ai: [A1, A2 ... ]

// string -> string[]

type AdjacencyList = Map<string, string[]>;

function buildAdjacencyList(airports: Airport[], flights: Flight[]) {
    const airportTravelGraph: AdjacencyList = new Map();
    for (const airport of airports) {
        airportTravelGraph.set(
            airport.code,
            airport.futureFlights.map(flight => flight.destination)
        )
    }

    return airportTravelGraph;
}

const adjList = buildAdjacencyList(
    airports,
    flights,
);

// Dato un aereoporto dire se è possibile raggiungere una destinazione diretta


function hasDestination(dep: string, dest: string) {
    return adjList.get(dep)?.includes(dest) ?? false;
}

console.log(
    hasDestination('FCO', 'LIN')
);

// Per ogni aereoporto, filtro gli aeroporti che atterranno all'aereoporto DEST

const DEST = 'AMS';

// console.log(
//     airports
//         .filter(airport => hasDestination(airport.code, DEST))
//         .map(airport => airport.code)
// );

function pathExists(source: string, destination: string, visited: Set<string>) {
    visited.add(source);
    console.log(source);

    if (source === destination) {
        return true;
    }

    let found = false;

    for (const adjactent of (adjList.get(source) ?? [])) {
        if (!visited.has(adjactent)) {
            found = found || pathExists(adjactent, destination, visited);
        }
    }

    return found;
}

console.log(
    pathExists('FCO', 'VCE', new Set())
)
