/*
  Warnings:

  - You are about to drop the column `montly_salary` on the `work_experience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "work_experience" DROP COLUMN "montly_salary",
ADD COLUMN     "monthly_salary" DECIMAL(10,2);
