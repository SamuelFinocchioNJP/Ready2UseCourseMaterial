Refactor this codebase according to the following specifications:

1. Airport CRUD
2. Flight CRUD

Data must be stored in memory only. Do not use an RDBMS, Redis, or any other external persistence layer.

I want two controllers:
- one for airports
- one for flights

They must be placed in separate files.

In `main`, import the controllers and instantiate Express.

Here are the data types:

```ts
type AirportCode = string;

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
```