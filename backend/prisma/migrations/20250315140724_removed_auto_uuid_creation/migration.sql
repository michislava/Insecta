/*
  Warnings:

  - A unique constraint covering the columns `[latinName]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Animal_latinName_key" ON "Animal"("latinName");
