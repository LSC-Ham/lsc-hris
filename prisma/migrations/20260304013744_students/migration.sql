/*
  Warnings:

  - Made the column `biography_id` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "biography_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "semesters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "semester" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acad_years" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_year" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "acad_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acad_level" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_level_code" TEXT NOT NULL,
    "acad_level_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "acad_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "year_level" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_level_id" UUID NOT NULL,
    "year_level" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "year_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_level_id" UUID NOT NULL,
    "section" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "id_number" TEXT NOT NULL,
    "semester_id" UUID,
    "acad_year_id" UUID,
    "acad_level_id" UUID,
    "course_id" UUID,
    "year_level_id" UUID,
    "sections_id" UUID,
    "scholarship_id" UUID,
    "discount" DECIMAL(10,2),
    "assessed_at" TIMESTAMP(3),
    "enrolled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_level_id" UUID NOT NULL,
    "scholarship" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department_id" UUID NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_year_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "year_level_id" UUID NOT NULL,
    "sections_id" UUID,
    "time" TEXT,
    "room" TEXT,
    "professor" TEXT,
    "subject_code" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "unit" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_subjects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "students_id" UUID NOT NULL,
    "checklists_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "student_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_installments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" TEXT,
    "id_number" TEXT,
    "semester_name" TEXT,
    "acad_year_name" TEXT,
    "label" TEXT,
    "amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "student_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" TEXT,
    "id_number" TEXT,
    "semester_name" TEXT,
    "acad_year_name" TEXT,
    "section_name" TEXT,
    "label" TEXT,
    "amount" DECIMAL(10,2),
    "or_number" TEXT,
    "payment_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "semesters_semester_key" ON "semesters"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "acad_years_acad_year_key" ON "acad_years"("acad_year");

-- CreateIndex
CREATE UNIQUE INDEX "acad_level_acad_level_code_key" ON "acad_level"("acad_level_code");

-- CreateIndex
CREATE UNIQUE INDEX "year_level_year_level_key" ON "year_level"("year_level");

-- CreateIndex
CREATE UNIQUE INDEX "sections_section_key" ON "sections"("section");

-- CreateIndex
CREATE UNIQUE INDEX "students_id_number_semester_id_acad_year_id_key" ON "students"("id_number", "semester_id", "acad_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- AddForeignKey
ALTER TABLE "year_level" ADD CONSTRAINT "year_level_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_acad_year_id_fkey" FOREIGN KEY ("acad_year_id") REFERENCES "acad_years"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "year_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_sections_id_fkey" FOREIGN KEY ("sections_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_acad_year_id_fkey" FOREIGN KEY ("acad_year_id") REFERENCES "acad_years"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "year_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_subjects" ADD CONSTRAINT "student_subjects_students_id_fkey" FOREIGN KEY ("students_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
