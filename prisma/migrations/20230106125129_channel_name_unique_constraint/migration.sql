/*
  Warnings:

  - A unique constraint covering the columns `[name,organization_id]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_organization_id_key" ON "Channel"("name", "organization_id");
