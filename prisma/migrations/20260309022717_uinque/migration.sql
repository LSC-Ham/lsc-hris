/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `acad_level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `acad_years` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `semesters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `year_level` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "acad_level_order_key" ON "acad_level"("order");

-- CreateIndex
CREATE UNIQUE INDEX "acad_years_order_key" ON "acad_years"("order");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_order_key" ON "semesters"("order");

-- CreateIndex
CREATE UNIQUE INDEX "year_level_order_key" ON "year_level"("order");
