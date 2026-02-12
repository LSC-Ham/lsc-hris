/*
  Warnings:

  - A unique constraint covering the columns `[department]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employees_id,departments_id]` on the table `employees_departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employees_id,positions_id]` on the table `employees_positions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position]` on the table `positions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "departments_department_key" ON "departments"("department");

-- CreateIndex
CREATE UNIQUE INDEX "employees_departments_employees_id_departments_id_key" ON "employees_departments"("employees_id", "departments_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_positions_employees_id_positions_id_key" ON "employees_positions"("employees_id", "positions_id");

-- CreateIndex
CREATE UNIQUE INDEX "positions_position_key" ON "positions"("position");
