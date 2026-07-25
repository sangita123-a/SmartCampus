-- Migrate Role enum and extend users table for authentication

-- Create new enum
CREATE TYPE "Role_new" AS ENUM (
  'SUPER_ADMIN',
  'COLLEGE_ADMIN',
  'FACULTY',
  'STUDENT',
  'PARENT',
  'LIBRARIAN',
  'ACCOUNTANT'
);

-- Drop default before type change
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- Map legacy roles → new roles
ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "Role_new"
  USING (
    CASE "role"::text
      WHEN 'ADMIN' THEN 'SUPER_ADMIN'::"Role_new"
      WHEN 'STAFF' THEN 'ACCOUNTANT'::"Role_new"
      WHEN 'FACULTY' THEN 'FACULTY'::"Role_new"
      WHEN 'STUDENT' THEN 'STUDENT'::"Role_new"
      ELSE 'STUDENT'::"Role_new"
    END
  );

DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT'::"Role";

-- Auth fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "refreshToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "collegeId" TEXT;

CREATE INDEX IF NOT EXISTS "users_collegeId_idx" ON "users"("collegeId");
CREATE INDEX IF NOT EXISTS "users_refreshToken_idx" ON "users"("refreshToken");
