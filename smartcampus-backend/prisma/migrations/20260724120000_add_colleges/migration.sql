-- CreateEnum
CREATE TYPE "CollegeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "status" "CollegeStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "subscriptionStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colleges_name_key" ON "colleges"("name");
CREATE UNIQUE INDEX "colleges_code_key" ON "colleges"("code");
CREATE UNIQUE INDEX "colleges_email_key" ON "colleges"("email");
CREATE INDEX "colleges_status_idx" ON "colleges"("status");
CREATE INDEX "colleges_subscriptionPlan_idx" ON "colleges"("subscriptionPlan");
CREATE INDEX "colleges_subscriptionEnd_idx" ON "colleges"("subscriptionEnd");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "users"
  ADD CONSTRAINT "users_collegeId_fkey"
  FOREIGN KEY ("collegeId") REFERENCES "colleges"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
