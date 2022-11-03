/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "setting_name_key" ON "setting"("name");
