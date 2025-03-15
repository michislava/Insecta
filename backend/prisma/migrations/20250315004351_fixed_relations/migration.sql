/*
  Warnings:

  - Added the required column `discovererId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "discovererId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_discovererId_fkey" FOREIGN KEY ("discovererId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
