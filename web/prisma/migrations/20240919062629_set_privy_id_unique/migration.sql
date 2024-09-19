/*
  Warnings:

  - A unique constraint covering the columns `[privyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_privyId_key" ON "User"("privyId");
