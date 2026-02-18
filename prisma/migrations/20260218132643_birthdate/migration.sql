/*
  Warnings:

  - The `birthdate` column on the `personal_information` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "personal_information" DROP COLUMN "birthdate",
ADD COLUMN     "birthdate" TIMESTAMP(6);
