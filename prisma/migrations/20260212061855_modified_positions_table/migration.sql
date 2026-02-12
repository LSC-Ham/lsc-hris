-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "hired_at" TIMESTAMP(6),
ADD COLUMN     "remarks" TEXT;

-- AlterTable
ALTER TABLE "employees_positions" ADD COLUMN     "description" TEXT,
ADD COLUMN     "end_at" TIMESTAMP(6),
ADD COLUMN     "start_at" TIMESTAMP(6),
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "personal_information" ALTER COLUMN "birthdate" DROP NOT NULL;
