CREATE TYPE "OrderStatus" AS ENUM ('PAID', 'FAILED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED');

CREATE TABLE "orders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "reservation_id" UUID NOT NULL,
  "user_id" TEXT NOT NULL,
  "total_amount" DECIMAL(12,2) NOT NULL,
  "status" "OrderStatus" NOT NULL DEFAULT 'PAID',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "order_id" UUID,
  "reservation_id" UUID NOT NULL,
  "provider" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "orders_reservation_id_key" ON "orders"("reservation_id");
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");
CREATE INDEX "payments_reservation_id_idx" ON "payments"("reservation_id");

ALTER TABLE "orders"
ADD CONSTRAINT "orders_reservation_id_fkey"
FOREIGN KEY ("reservation_id")
REFERENCES "reservations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "payments"
ADD CONSTRAINT "payments_order_id_fkey"
FOREIGN KEY ("order_id")
REFERENCES "orders"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "payments"
ADD CONSTRAINT "payments_reservation_id_fkey"
FOREIGN KEY ("reservation_id")
REFERENCES "reservations"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
