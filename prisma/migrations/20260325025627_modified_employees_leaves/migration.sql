/*
  Warnings:

  - You are about to drop the column `date_from` on the `employees_leaves` table. All the data in the column will be lost.
  - You are about to drop the column `date_to` on the `employees_leaves` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees_leaves" DROP COLUMN "date_from",
DROP COLUMN "date_to",
ADD COLUMN     "date" TIMESTAMP(6),
ADD COLUMN     "time_from" TIMESTAMP(6),
ADD COLUMN     "time_to" TIMESTAMP(6);
