/*
  Warnings:

  - You are about to drop the column `positions_id` on the `employees_positions` table. All the data in the column will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `positions` to the `employees_positions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "employees_positions" DROP CONSTRAINT "employees_positions_positions_id_fkey";

-- DropForeignKey
ALTER TABLE "positions" DROP CONSTRAINT "positions_departments_id_fkey";

-- AlterTable
ALTER TABLE "employees_positions" DROP COLUMN "positions_id",
ADD COLUMN     "positions" TEXT NOT NULL;

-- DropTable
DROP TABLE "positions";
