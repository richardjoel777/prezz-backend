/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelRolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelConfig" DROP CONSTRAINT "ChannelConfig_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelMember" DROP CONSTRAINT "ChannelMember_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelMember" DROP CONSTRAINT "ChannelMember_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRole" DROP CONSTRAINT "ChannelRole_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRolePermission" DROP CONSTRAINT "ChannelRolePermission_channel_role_id_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRolePermission" DROP CONSTRAINT "ChannelRolePermission_permission_id_fkey";

-- AlterTable
ALTER TABLE "EmailOTP" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '10 minutes';

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "ChannelConfig";

-- DropTable
DROP TABLE "ChannelMember";

-- DropTable
DROP TABLE "ChannelRole";

-- DropTable
DROP TABLE "ChannelRolePermission";

-- DropTable
DROP TABLE "Permission";

-- DropEnum
DROP TYPE "ChannelType";

-- DropEnum
DROP TYPE "ReplyMode";
