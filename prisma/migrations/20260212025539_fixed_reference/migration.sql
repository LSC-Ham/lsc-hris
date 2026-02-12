-- DropForeignKey
ALTER TABLE "employees_departments" DROP CONSTRAINT "employees_departments_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_positions" DROP CONSTRAINT "employees_positions_id_fkey";

-- AddForeignKey
ALTER TABLE "employees_departments" ADD CONSTRAINT "employees_departments_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
