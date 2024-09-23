-- DropIndex
DROP INDEX "User_privyId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "privyId" DROP NOT NULL;
