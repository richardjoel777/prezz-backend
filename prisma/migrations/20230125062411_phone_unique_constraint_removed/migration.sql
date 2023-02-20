-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';
