-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_departments_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_divisions_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_positions" DROP CONSTRAINT "employees_positions_positions_id_fkey";

-- AlterTable
ALTER TABLE "acad_years" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "student_type" TEXT;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_positions_id_fkey" FOREIGN KEY ("positions_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_divisions_id_fkey" FOREIGN KEY ("divisions_id") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
