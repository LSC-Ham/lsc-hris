-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "ranks_id" UUID;

-- CreateTable
CREATE TABLE "ranks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rank" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "ranks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ranks_rank_key" ON "ranks"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "ranks_order_key" ON "ranks"("order");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_ranks_id_fkey" FOREIGN KEY ("ranks_id") REFERENCES "ranks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
