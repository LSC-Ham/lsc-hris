-- CreateTable
CREATE TABLE "leave_reset_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TIMESTAMP(6),
    "reset_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "leave_reset_logs_pkey" PRIMARY KEY ("id")
);
