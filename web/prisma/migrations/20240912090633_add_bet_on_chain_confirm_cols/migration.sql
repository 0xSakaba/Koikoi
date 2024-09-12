/*
  Warnings:

  - Added the required column `option` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "option" TEXT NOT NULL,
ADD COLUMN     "signedBlock" TEXT;
