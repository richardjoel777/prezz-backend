/*
  Warnings:

  - A unique constraint covering the columns `[socket_id]` on the table `SocketUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- CreateIndex
CREATE UNIQUE INDEX "SocketUser_socket_id_key" ON "SocketUser"("socket_id");
