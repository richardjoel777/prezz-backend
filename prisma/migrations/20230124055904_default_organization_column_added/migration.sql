/*
  Warnings:

  - A unique constraint covering the columns `[default_organization_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "default_organization_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_default_organization_id_key" ON "User"("default_organization_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_default_organization_id_fkey" FOREIGN KEY ("default_organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
