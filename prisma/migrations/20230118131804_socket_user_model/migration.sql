-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SocketUser" (
    "id" TEXT NOT NULL,
    "socket_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocketUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocketUser_user_id_key" ON "SocketUser"("user_id");

-- AddForeignKey
ALTER TABLE "SocketUser" ADD CONSTRAINT "SocketUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
