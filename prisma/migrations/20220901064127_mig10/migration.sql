/*
  Warnings:

  - You are about to drop the column `cssBadgeClasse` on the `orderState` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orderState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cssBadgeClass" TEXT
);
INSERT INTO "new_orderState" ("id", "name") SELECT "id", "name" FROM "orderState";
DROP TABLE "orderState";
ALTER TABLE "new_orderState" RENAME TO "orderState";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
