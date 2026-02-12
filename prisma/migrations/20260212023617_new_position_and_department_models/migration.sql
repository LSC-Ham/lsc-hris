-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "departments_id" UUID NOT NULL,

    CONSTRAINT "employees_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "position" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "positions_id" UUID NOT NULL,

    CONSTRAINT "employees_positions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees_departments" ADD CONSTRAINT "employees_departments_id_fkey" FOREIGN KEY ("id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_departments" ADD CONSTRAINT "employees_departments_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_id_fkey" FOREIGN KEY ("id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_positions_id_fkey" FOREIGN KEY ("positions_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
