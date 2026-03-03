-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_departments_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_divisions_id_fkey";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "departments_id" DROP NOT NULL,
ALTER COLUMN "divisions_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_divisions_id_fkey" FOREIGN KEY ("divisions_id") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
