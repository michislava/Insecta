/*
  Warnings:

  - Added the required column `latinName` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "latinName" TEXT NOT NULL;
