-- CreateTable
CREATE TABLE "divisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "division" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_divisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "divisions_id" UUID NOT NULL,

    CONSTRAINT "employees_divisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisions_division_key" ON "divisions"("division");

-- CreateIndex
CREATE UNIQUE INDEX "employees_divisions_employees_id_divisions_id_key" ON "employees_divisions"("employees_id", "divisions_id");

-- AddForeignKey
ALTER TABLE "employees_divisions" ADD CONSTRAINT "employees_divisions_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_divisions" ADD CONSTRAINT "employees_divisions_divisions_id_fkey" FOREIGN KEY ("divisions_id") REFERENCES "divisions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
