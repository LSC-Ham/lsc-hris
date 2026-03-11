/*
  Warnings:

  - You are about to drop the column `is_active` on the `acad_years` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `semesters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "acad_years" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "semesters" DROP COLUMN "is_active";
