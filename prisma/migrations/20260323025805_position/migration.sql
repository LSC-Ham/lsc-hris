-- DropIndex
DROP INDEX "positions_position_key";

-- AlterTable
ALTER TABLE "positions" ALTER COLUMN "position" DROP NOT NULL;
