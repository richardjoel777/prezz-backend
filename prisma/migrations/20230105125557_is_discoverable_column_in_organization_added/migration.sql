/*
  Warnings:

  - Added the required column `is_discoverable` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "is_discoverable" BOOLEAN NOT NULL;
