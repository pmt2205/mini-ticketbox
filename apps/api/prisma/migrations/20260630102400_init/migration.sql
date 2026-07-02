CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "ReservationStatus" AS ENUM ('HOLDING', 'PAID', 'EXPIRED', 'CANCELLED');

CREATE TABLE "ticket_types" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "price" DECIMAL(12, 2) NOT NULL,
  "total_quantity" INTEGER NOT NULL,
  "sold_quantity" INTEGER NOT NULL DEFAULT 0,
  "held_quantity" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ticket_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reservations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ticket_type_id" UUID NOT NULL,
  "user_id" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'HOLDING',
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ticket_types_name_key" ON "ticket_types"("name");
CREATE INDEX "reservations_status_expires_at_idx" ON "reservations"("status", "expires_at");
CREATE INDEX "reservations_user_id_status_idx" ON "reservations"("user_id", "status");

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_ticket_type_id_fkey"
FOREIGN KEY ("ticket_type_id")
REFERENCES "ticket_types"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
