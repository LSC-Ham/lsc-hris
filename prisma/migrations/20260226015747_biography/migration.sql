/*
  Warnings:

  - You are about to drop the column `employees_id` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `employees_id` on the `educational_background` table. All the data in the column will be lost.
  - You are about to drop the column `employees_id` on the `eligibility` table. All the data in the column will be lost.
  - You are about to drop the column `users_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `employees_id` on the `family_background` table. All the data in the column will be lost.
  - You are about to drop the column `employees_id` on the `personal_information` table. All the data in the column will be lost.
  - You are about to drop the column `employees_id` on the `work_experience` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[biography_id]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[biography_id]` on the table `personal_information` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biography_id` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography_id` to the `educational_background` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography_id` to the `eligibility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography_id` to the `family_background` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography_id` to the `personal_information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `biography_id` to the `work_experience` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_employees_id_fkey";

-- DropForeignKey
ALTER TABLE "educational_background" DROP CONSTRAINT "educational_background_employees_id_fkey";

-- DropForeignKey
ALTER TABLE "eligibility" DROP CONSTRAINT "eligibility_employees_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_users_id_fkey";

-- DropForeignKey
ALTER TABLE "family_background" DROP CONSTRAINT "family_background_employees_id_fkey";

-- DropForeignKey
ALTER TABLE "personal_information" DROP CONSTRAINT "personal_information_employees_id_fkey";

-- DropForeignKey
ALTER TABLE "work_experience" DROP CONSTRAINT "work_experience_employees_id_fkey";

-- DropIndex
DROP INDEX "employees_users_id_key";

-- DropIndex
DROP INDEX "personal_information_employees_id_key";

-- AlterTable
ALTER TABLE "address" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "educational_background" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "eligibility" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "users_id",
ADD COLUMN     "biography_id" UUID;

-- AlterTable
ALTER TABLE "family_background" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "personal_information" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "work_experience" DROP COLUMN "employees_id",
ADD COLUMN     "biography_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "biography" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "users_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "biography_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "biography_users_id_key" ON "biography"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_biography_id_key" ON "employees"("biography_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_information_biography_id_key" ON "personal_information"("biography_id");

-- AddForeignKey
ALTER TABLE "biography" ADD CONSTRAINT "biography_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personal_information" ADD CONSTRAINT "personal_information_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_background" ADD CONSTRAINT "family_background_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eligibility" ADD CONSTRAINT "eligibility_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "educational_background" ADD CONSTRAINT "educational_background_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
