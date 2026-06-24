-- CreateTable
CREATE TABLE "FlightDelay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "dateTimeDeparture" DATETIME NOT NULL,
    "dateTimeLanding" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FlightDelay_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlightReroute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "newDestination" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FlightReroute_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FlightReroute_newDestination_fkey" FOREIGN KEY ("newDestination") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FlightDelay_flightId_idx" ON "FlightDelay"("flightId");

-- CreateIndex
CREATE INDEX "FlightReroute_flightId_idx" ON "FlightReroute"("flightId");

-- CreateIndex
CREATE INDEX "FlightReroute_newDestination_idx" ON "FlightReroute"("newDestination");
