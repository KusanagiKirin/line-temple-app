-- CreateTable
CREATE TABLE "Temple" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL DEFAULT '大阪府',
    "city" TEXT NOT NULL,
    "address" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "phone" TEXT,
    "googleMapUrl" TEXT,
    "receptionType" TEXT NOT NULL DEFAULT 'none',
    "receptionNote" TEXT,
    "hasGoshuin" BOOLEAN NOT NULL DEFAULT false,
    "goshuinNote" TEXT,
    "goshuinImages" TEXT,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "parkingNote" TEXT,
    "hasOmamori" BOOLEAN NOT NULL DEFAULT false,
    "receptionHours" TEXT,
    "receptionHoursNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
