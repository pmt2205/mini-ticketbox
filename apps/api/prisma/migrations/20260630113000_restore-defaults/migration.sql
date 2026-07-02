ALTER TABLE "ticket_types" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "reservations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
