/*
  Warnings:

  - You are about to drop the `employees_divisions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees_divisions" DROP CONSTRAINT "employees_divisions_divisions_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_divisions" DROP CONSTRAINT "employees_divisions_employees_id_fkey";

-- AlterTable
ALTER TABLE "divisions" ALTER COLUMN "id" DROP DEFAULT;

-- DropTable
DROP TABLE "employees_divisions";

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_id_fkey" FOREIGN KEY ("id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
