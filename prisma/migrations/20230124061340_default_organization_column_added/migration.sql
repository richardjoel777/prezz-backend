-- DropIndex
DROP INDEX "User_default_organization_id_key";

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';
