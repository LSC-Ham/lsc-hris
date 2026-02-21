/*
  Warnings:

  - A unique constraint covering the columns `[users_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employees_id]` on the table `personal_information` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employees_id` to the `personal_information` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_id_fkey";

-- DropForeignKey
ALTER TABLE "personal_information" DROP CONSTRAINT "personal_information_id_fkey";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "users_id" UUID,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "personal_information" ADD COLUMN     "employees_id" UUID NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "employees_users_id_key" ON "employees"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_information_employees_id_key" ON "personal_information"("employees_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personal_information" ADD CONSTRAINT "personal_information_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
