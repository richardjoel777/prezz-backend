/*
  Warnings:

  - Added the required column `owner_id` to the `Channel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
