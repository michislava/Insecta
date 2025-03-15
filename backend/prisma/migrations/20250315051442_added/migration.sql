/*
  Warnings:

  - You are about to drop the column `class` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Card` table. All the data in the column will be lost.
  - Added the required column `animalClass` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latinName` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnimalClass" AS ENUM ('INSECTA', 'ARACHNIDA', 'CHILOPODA', 'DIPLOPODA');

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "class",
ADD COLUMN     "animalClass" "AnimalClass" NOT NULL,
ADD COLUMN     "latinName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "location",
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

-- DropEnum
DROP TYPE "Class";
