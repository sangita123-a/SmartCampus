-- CreateEnum
CREATE TYPE "FacultyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'VISITING');

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "qualification" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "designation" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "salary" DECIMAL(12,2),
    "bloodGroup" "BloodGroup" NOT NULL DEFAULT 'UNKNOWN',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pincode" TEXT,
    "profileImage" TEXT,
    "status" "FacultyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculty_facultyId_key" ON "faculty"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_userId_key" ON "faculty"("userId");

-- CreateIndex
CREATE INDEX "faculty_collegeId_idx" ON "faculty"("collegeId");

-- CreateIndex
CREATE INDEX "faculty_departmentId_idx" ON "faculty"("departmentId");

-- CreateIndex
CREATE INDEX "faculty_status_idx" ON "faculty"("status");

-- CreateIndex
CREATE INDEX "faculty_designation_idx" ON "faculty"("designation");

-- CreateIndex
CREATE INDEX "faculty_firstName_idx" ON "faculty"("firstName");

-- CreateIndex
CREATE INDEX "faculty_lastName_idx" ON "faculty"("lastName");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_collegeId_email_key" ON "faculty"("collegeId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_collegeId_employeeId_key" ON "faculty"("collegeId", "employeeId");

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
