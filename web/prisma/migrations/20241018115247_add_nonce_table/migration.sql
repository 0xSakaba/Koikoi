-- CreateTable
CREATE TABLE "LoginNonce" (
    "id" TEXT NOT NULL,
    "pubKey" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginNonce_pkey" PRIMARY KEY ("id")
);
