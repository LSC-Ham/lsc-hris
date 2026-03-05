-- AlterTable
ALTER TABLE "positions" ADD COLUMN     "departments_id" UUID;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
