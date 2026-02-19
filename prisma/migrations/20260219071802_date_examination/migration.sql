/*
  Warnings:

  - The `date_examination` column on the `eligibility` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "eligibility" DROP COLUMN "date_examination",
ADD COLUMN     "date_examination" TIMESTAMP(3);
