-- CreateTable
CREATE TABLE "MobileOTP" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '10 minutes',

    CONSTRAINT "MobileOTP_pkey" PRIMARY KEY ("id")
);
