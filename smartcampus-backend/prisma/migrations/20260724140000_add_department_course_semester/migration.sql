-- CreateEnum

CREATE TYPE "AcademicStatus" AS ENUM ('ACTIVE', 'INACTIVE');



-- CreateEnum

CREATE TYPE "CourseType" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'CERTIFICATE', 'OTHER');



-- CreateTable

CREATE TABLE "departments" (

    "id" TEXT NOT NULL,

    "collegeId" TEXT NOT NULL,

    "name" TEXT NOT NULL,

    "code" TEXT NOT NULL,

    "description" TEXT,

    "status" "AcademicStatus" NOT NULL DEFAULT 'ACTIVE',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL,



    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")

);



-- CreateTable

CREATE TABLE "courses" (

    "id" TEXT NOT NULL,

    "departmentId" TEXT NOT NULL,

    "collegeId" TEXT NOT NULL,

    "name" TEXT NOT NULL,

    "code" TEXT NOT NULL,

    "duration" INTEGER NOT NULL,

    "courseType" "CourseType" NOT NULL DEFAULT 'UNDERGRADUATE',

    "description" TEXT,

    "status" "AcademicStatus" NOT NULL DEFAULT 'ACTIVE',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL,



    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")

);



-- CreateTable

CREATE TABLE "semesters" (

    "id" TEXT NOT NULL,

    "courseId" TEXT NOT NULL,

    "semesterNumber" INTEGER NOT NULL,

    "name" TEXT NOT NULL,

    "startDate" TIMESTAMP(3) NOT NULL,

    "endDate" TIMESTAMP(3) NOT NULL,

    "status" "AcademicStatus" NOT NULL DEFAULT 'ACTIVE',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3) NOT NULL,



    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")

);



-- CreateIndex

CREATE INDEX "departments_collegeId_idx" ON "departments"("collegeId");



-- CreateIndex

CREATE INDEX "departments_status_idx" ON "departments"("status");



-- CreateIndex

CREATE UNIQUE INDEX "departments_collegeId_name_key" ON "departments"("collegeId", "name");



-- CreateIndex

CREATE UNIQUE INDEX "departments_collegeId_code_key" ON "departments"("collegeId", "code");



-- CreateIndex

CREATE INDEX "courses_collegeId_idx" ON "courses"("collegeId");



-- CreateIndex

CREATE INDEX "courses_departmentId_idx" ON "courses"("departmentId");



-- CreateIndex

CREATE INDEX "courses_status_idx" ON "courses"("status");



-- CreateIndex

CREATE INDEX "courses_courseType_idx" ON "courses"("courseType");



-- CreateIndex

CREATE UNIQUE INDEX "courses_collegeId_code_key" ON "courses"("collegeId", "code");



-- CreateIndex

CREATE INDEX "semesters_courseId_idx" ON "semesters"("courseId");



-- CreateIndex

CREATE INDEX "semesters_status_idx" ON "semesters"("status");



-- CreateIndex

CREATE UNIQUE INDEX "semesters_courseId_semesterNumber_key" ON "semesters"("courseId", "semesterNumber");



-- AddForeignKey

ALTER TABLE "departments" ADD CONSTRAINT "departments_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- AddForeignKey

ALTER TABLE "courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- AddForeignKey

ALTER TABLE "courses" ADD CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- AddForeignKey

ALTER TABLE "semesters" ADD CONSTRAINT "semesters_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

