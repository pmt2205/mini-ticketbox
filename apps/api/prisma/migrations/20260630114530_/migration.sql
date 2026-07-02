-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ticket_types" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;
