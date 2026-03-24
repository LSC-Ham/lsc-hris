-- CreateTable
CREATE TABLE "employees_leaves" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "leave_type" TEXT NOT NULL,
    "date_from" TIMESTAMP(6),
    "date_to" TIMESTAMP(6),
    "status" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "employees_leaves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees_leaves" ADD CONSTRAINT "employees_leaves_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
