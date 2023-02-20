/*
  Warnings:

  - You are about to drop the `MobileOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MobileOTP";

-- CreateTable
CREATE TABLE "EmailOTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '10 minutes',

    CONSTRAINT "EmailOTP_pkey" PRIMARY KEY ("id")
);
