/*
  Warnings:

  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_acad_level_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_acad_year_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_course_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_scholarship_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_sections_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_year_level_id_fkey";

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "student_payments" (
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

    CONSTRAINT "student_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_acad_year_id_fkey" FOREIGN KEY ("acad_year_id") REFERENCES "acad_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "year_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_sections_id_fkey" FOREIGN KEY ("sections_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
