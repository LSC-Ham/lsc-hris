-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT DEFAULT 'user',
    "profile_picture" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "password_changed" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biography" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "users_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "biography_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

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
CREATE TABLE "departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "position" TEXT NOT NULL,
    "departments_id" UUID,
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
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "status" TEXT,
    "start_at" TIMESTAMP(6),
    "end_at" TIMESTAMP(6),

    CONSTRAINT "employees_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "id_number" TEXT NOT NULL,
    "hired_at" TIMESTAMP(6),
    "remarks" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "divisions_id" UUID,
    "departments_id" UUID,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_govIDs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employees_id" UUID NOT NULL,
    "id_label" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "employees_govIDs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_information" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middlename" TEXT,
    "extension" TEXT,
    "birthdate" TIMESTAMP(6),
    "birthplace" TEXT,
    "sex" TEXT NOT NULL,
    "civil_status" TEXT NOT NULL,
    "telephone_no" TEXT,
    "mobile_no" TEXT,
    "email" TEXT,
    "nationality" TEXT NOT NULL,
    "height" TEXT,
    "weight" TEXT,
    "blood_type" TEXT,

    CONSTRAINT "personal_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "address_type" TEXT NOT NULL,
    "region" TEXT,
    "province" TEXT,
    "city" TEXT,
    "barangay" TEXT,
    "house_no" TEXT,
    "street" TEXT,
    "subdivision" TEXT,
    "zip_code" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_background" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "relation_type" TEXT NOT NULL,
    "surname" TEXT,
    "firstname" TEXT,
    "middlename" TEXT,
    "extension" TEXT,
    "occupation" TEXT,
    "employer" TEXT,
    "occupation_address" TEXT,
    "contact_no" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "family_background_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibility" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "qualification" TEXT,
    "rating" TEXT,
    "date_examination" TIMESTAMP(3),
    "place_examination" TEXT,
    "id_number" TEXT,
    "date_validity" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "eligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educational_background" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "level" TEXT,
    "school" TEXT,
    "degree" TEXT,
    "date_from" TIMESTAMP(3),
    "date_to" TIMESTAMP(3),
    "units_earned" TEXT,
    "year_graduated" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "educational_background_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "biography_id" UUID NOT NULL,
    "date_from" TIMESTAMP(3),
    "date_to" TIMESTAMP(3),
    "position_title" TEXT,
    "company" TEXT,
    "monthly_salary" DECIMAL(10,2),
    "appointment_status" TEXT,
    "gov_service" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "biography_users_id_key" ON "biography"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_division_key" ON "divisions"("division");

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_key" ON "departments"("department");

-- CreateIndex
CREATE UNIQUE INDEX "positions_position_key" ON "positions"("position");

-- CreateIndex
CREATE UNIQUE INDEX "employees_biography_id_key" ON "employees"("biography_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_id_number_key" ON "employees"("id_number");

-- CreateIndex
CREATE UNIQUE INDEX "personal_information_biography_id_key" ON "personal_information"("biography_id");

-- AddForeignKey
ALTER TABLE "biography" ADD CONSTRAINT "biography_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees_positions" ADD CONSTRAINT "employees_positions_positions_id_fkey" FOREIGN KEY ("positions_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_divisions_id_fkey" FOREIGN KEY ("divisions_id") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departments_id_fkey" FOREIGN KEY ("departments_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees_govIDs" ADD CONSTRAINT "employees_govIDs_employees_id_fkey" FOREIGN KEY ("employees_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "personal_information" ADD CONSTRAINT "personal_information_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_background" ADD CONSTRAINT "family_background_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eligibility" ADD CONSTRAINT "eligibility_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "educational_background" ADD CONSTRAINT "educational_background_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_biography_id_fkey" FOREIGN KEY ("biography_id") REFERENCES "biography"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
