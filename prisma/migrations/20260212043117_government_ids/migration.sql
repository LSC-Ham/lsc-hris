-- CreateTable
CREATE TABLE "employees_govIDs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "id_label" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,

    CONSTRAINT "employees_govIDs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees_govIDs" ADD CONSTRAINT "employees_govIDs_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
