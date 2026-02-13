/*
  Warnings:

  - You are about to drop the `employees_departments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[divisions_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departments_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departments_id` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisions_id` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "divisions" DROP CONSTRAINT "divisions_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_departments" DROP CONSTRAINT "employees_departments_departments_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_departments" DROP CONSTRAINT "employees_departments_employees_id_fkey";

-- AlterTable
ALTER TABLE "divisions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "departments_id" UUID NOT NULL,
ADD COLUMN     "divisions_id" UUID NOT NULL;

-- DropTable
DROP TABLE "employees_departments";

-- CreateIndex
CREATE UNIQUE INDEX "employees_divisions_id_key" ON "employees"("divisions_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_departments_id_key" ON "employees"("departments_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_divisions_id_fkey" FOREIGN KEY ("divisions_id") REFERENCES "divisions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
