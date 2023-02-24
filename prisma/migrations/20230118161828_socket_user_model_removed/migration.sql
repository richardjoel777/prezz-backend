/*
  Warnings:

  - You are about to drop the `SocketUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocketUser" DROP CONSTRAINT "SocketUser_user_id_fkey";

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- DropTable
DROP TABLE "SocketUser";
