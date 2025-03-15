/*
  Warnings:

  - You are about to drop the column `picture` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.
  - Added the required column `pictureUrl` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "picture",
ADD COLUMN     "pictureUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "picture",
ADD COLUMN     "pictureUrl" TEXT;
