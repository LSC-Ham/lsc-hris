/*
  Warnings:

  - You are about to drop the column `year_level_id` on the `checklists` table. All the data in the column will be lost.
  - You are about to drop the column `year_level_id` on the `students` table. All the data in the column will be lost.
  - Added the required column `year_id` to the `checklists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year_id` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_year_level_id_fkey";

-- DropForeignKey
ALTER TABLE "sections" DROP CONSTRAINT "sections_acad_level_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_acad_year_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_year_level_id_fkey";

-- DropForeignKey
ALTER TABLE "years" DROP CONSTRAINT "years_acad_level_id_fkey";

-- AlterTable
ALTER TABLE "checklists" DROP COLUMN "year_level_id",
ADD COLUMN     "year_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "year_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "year_level_id",
ADD COLUMN     "year_id" UUID;

-- AddForeignKey
ALTER TABLE "years" ADD CONSTRAINT "years_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_acad_year_id_fkey" FOREIGN KEY ("acad_year_id") REFERENCES "acad_years"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
