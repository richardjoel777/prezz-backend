/*
  Warnings:

  - You are about to drop the `_OrganizationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_B_fkey";

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- DropTable
DROP TABLE "_OrganizationToUser";

-- CreateTable
CREATE TABLE "UserOrganizations" (
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOrganizations_pkey" PRIMARY KEY ("user_id","organization_id")
);

-- AddForeignKey
ALTER TABLE "UserOrganizations" ADD CONSTRAINT "UserOrganizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizations" ADD CONSTRAINT "UserOrganizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
