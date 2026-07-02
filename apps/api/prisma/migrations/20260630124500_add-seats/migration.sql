CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HELD', 'SOLD');

CREATE TABLE "seats" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "ticket_type_id" UUID NOT NULL,
  "reservation_id" UUID,
  "code" TEXT NOT NULL,
  "row_label" TEXT NOT NULL,
  "seat_number" INTEGER NOT NULL,
  "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seats_code_key" ON "seats"("code");
CREATE UNIQUE INDEX "seats_ticket_type_id_row_label_seat_number_key" ON "seats"("ticket_type_id", "row_label", "seat_number");
CREATE INDEX "seats_ticket_type_id_status_idx" ON "seats"("ticket_type_id", "status");
CREATE INDEX "seats_reservation_id_idx" ON "seats"("reservation_id");

ALTER TABLE "seats"
ADD CONSTRAINT "seats_ticket_type_id_fkey"
FOREIGN KEY ("ticket_type_id")
REFERENCES "ticket_types"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "seats"
ADD CONSTRAINT "seats_reservation_id_fkey"
FOREIGN KEY ("reservation_id")
REFERENCES "reservations"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
