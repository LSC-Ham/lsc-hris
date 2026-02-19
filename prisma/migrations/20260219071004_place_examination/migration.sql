/*
  Warnings:

  - You are about to drop the column `plan_examination` on the `eligibility` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "eligibility" DROP COLUMN "plan_examination",
ADD COLUMN     "place_examination" TEXT;
