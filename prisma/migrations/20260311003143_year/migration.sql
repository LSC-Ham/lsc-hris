/*
  Warnings:

  - You are about to drop the `year_level` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "checklists" DROP CONSTRAINT "checklists_year_level_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_year_level_id_fkey";

-- DropForeignKey
ALTER TABLE "year_level" DROP CONSTRAINT "year_level_acad_level_id_fkey";

-- DropTable
DROP TABLE "year_level";

-- CreateTable
CREATE TABLE "years" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "acad_level_id" UUID NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "years_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "years_year_key" ON "years"("year");

-- CreateIndex
CREATE UNIQUE INDEX "years_order_key" ON "years"("order");

-- AddForeignKey
ALTER TABLE "years" ADD CONSTRAINT "years_acad_level_id_fkey" FOREIGN KEY ("acad_level_id") REFERENCES "acad_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
