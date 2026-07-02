# Mini Ticketbox - Implementation Plan

## 1. Muc tieu

Xay dung ung dung fullstack dat ve concert gioi han 500 ve, chiu tai cao khi 5.000 user cung truy cap va tranh ve trong cung thoi diem.

Stack de xuat:

- Frontend: Next.js, TypeScript, Tailwind CSS, React Query, Socket.IO client.
- Backend: NestJS, TypeScript, PostgreSQL, Prisma, Socket.IO gateway.
- Infrastructure: Docker, Docker Compose, Redis, PostgreSQL.
- Testing: Jest, Supertest, k6.
- Architecture: Layered Architecture theo tung module.
- Naming convention: tat ca file/folder tu tao moi dung kebab-case.

## 2. Kien truc tong quan

He thong gom 4 khoi chinh:

- `web`: Next.js app cho user va admin.
- `api`: NestJS backend API.
- `postgres`: database luu ve, hold, order, payment.
- `redis`: cache realtime, distributed lock, rate limit, queue support neu can.
- `auth`: JWT login/register de user co danh tinh khi dat ve.

Luong chinh:

1. User vao trang su kien.
2. Frontend nhan so ve con lai qua API va realtime event.
3. User chon loai ve va bam giu ve.
4. Backend dung transaction + row lock/advisory lock de tao hold trong 5 phut.
5. Frontend hien countdown dua tren `expiresAt` tu server.
6. User thanh toan gia lap.
7. Backend chuyen hold thanh order sold.
8. Backend broadcast inventory moi cho tat ca client.
9. Hold het han duoc release bang scheduled job.

## 3. Monorepo Structure

```txt
mini-ticketbox/
  apps/
    api/
      src/
        app.module.ts
        main.ts
        common/
          decorators/
          filters/
          guards/
          interceptors/
          pipes/
          utils/
        config/
        database/
        modules/
          ticket/
          reservation/
          payment/
          order/
          realtime/
          admin/
          health/
      test/
      prisma/
        schema.prisma
        seed.ts
    web/
      app/
      components/
      features/
        event/
        booking/
        admin/
      lib/
      hooks/
      types/
  packages/
    shared/
      src/
        dto/
        constants/
        types/
  docker/
  docker-compose.yml
  plan.md
  README.md
```

Quy uoc file:

- Dung kebab-case: `ticket-type.entity.ts`, `create-reservation.dto.ts`, `reservation-service.spec.ts`.
- Class NestJS van dung PascalCase: `ReservationService`, `TicketRepository`.
- DTO, entity, repository, service tach ro theo layer.

## 4. Layered Architecture

Ap dung trong moi backend module:

```txt
module/
  controllers/      -> HTTP boundary, validate request, return response
  gateways/         -> WebSocket boundary neu co
  services/         -> business use cases
  repositories/     -> database access
  dto/              -> request/response schema
  entities/         -> domain model hoac prisma mapping helpers
  constants/
  tests/
```

Dependency direction:

- Controller chi goi Service.
- Service goi Repository, Event Publisher, Clock, Transaction Manager.
- Repository chi noi voi Prisma/PostgreSQL.
- Khong dat business rule vao Controller.
- Khong dat HTTP concept vao Repository.

## 5. Database Design

Bang chinh:

### `ticket_types`

- `id`
- `name`
- `price`
- `total_quantity`
- `sold_quantity`
- `held_quantity`
- `created_at`
- `updated_at`

Dung aggregated inventory de tranh tao san 500 row neu bai toan la ve theo loai. Neu can chon ghe cu the, bo sung bang `tickets`.

### `reservations`

- `id`
- `ticket_type_id`
- `user_id`
- `quantity`
- `status`: `holding`, `paid`, `expired`, `cancelled`
- `expires_at`
- `created_at`
- `updated_at`

### `orders`

- `id`
- `reservation_id`
- `user_id`
- `total_amount`
- `status`: `paid`, `failed`, `cancelled`
- `created_at`

### `payments`

- `id`
- `order_id`
- `reservation_id`
- `provider`
- `status`: `success`, `failed`
- `idempotency_key`
- `created_at`

Index de xuat:

- `reservations(status, expires_at)`
- `reservations(user_id, status)`
- `payments(idempotency_key)` unique
- `orders(reservation_id)` unique

## 6. Concurrency Strategy

Muc tieu: khong over-selling khi nhieu request cung giu ve.

Chien luoc chinh:

1. Tat ca thao tac giu ve chay trong PostgreSQL transaction.
2. Lock row `ticket_types` bang `SELECT ... FOR UPDATE` hoac Prisma raw query trong transaction.
3. Kiem tra `available = total_quantity - sold_quantity - held_quantity`.
4. Neu du ve:
   - Tang `held_quantity`.
   - Tao reservation `holding`.
   - Commit transaction.
5. Neu khong du ve:
   - Rollback.
   - Tra loi `409 Conflict`.

Pseudo flow:

```txt
begin transaction
  ticket_type = select ticket_type where id = ? for update
  available = total_quantity - sold_quantity - held_quantity
  if available < quantity -> throw sold_out
  update ticket_type set held_quantity = held_quantity + quantity
  insert reservation status=holding expires_at=now()+5 minutes
commit
```

Thanh toan:

```txt
begin transaction
  reservation = select reservation where id = ? for update
  if reservation.status != holding -> reject
  if reservation.expires_at < now -> expire and release
  update reservation status=paid
  update ticket_type held_quantity -= quantity, sold_quantity += quantity
  create order/payment
commit
```

Release hold het han:

```txt
begin transaction
  find expired holding reservations for update skip locked
  update reservation status=expired
  decrement held_quantity by grouped quantity
commit
```

Can co:

- Idempotency key cho payment API.
- Rate limit theo IP/user.
- Disable double-submit o frontend.
- `FOR UPDATE SKIP LOCKED` cho cron release de nhieu worker khong dap nhau.

## 7. Backend API Scope

### Ticket module

Endpoints:

- `GET /ticket-types`
- `GET /ticket-types/:id`

Responsibilities:

- Tra danh sach loai ve.
- Tinh `availableQuantity`.
- Khong expose field noi bo neu khong can.

### Reservation module

Endpoints:

- `POST /reservations`
- `GET /reservations/:id`
- `DELETE /reservations/:id`

DTO:

- `create-reservation.dto.ts`
  - `ticketTypeId`: UUID
  - `quantity`: number, min 1, max config
  - `userId`: string hoac lay tu auth mock

Responsibilities:

- Giu ve 5 phut.
- Tra `reservationId`, `expiresAt`, `serverTime`.
- Huy hold thu cong neu user thoat.
- Validate reservation ownership neu co auth.

### Auth module

Endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Responsibilities:

- Tao user bang email, ho ten, password.
- Hash password bang `scrypt` hoac bcrypt.
- Tra JWT access token cho frontend.
- Frontend luu auth state bang Redux Toolkit va localStorage.

### Payment module

Endpoints:

- `POST /payments/simulate-success`

DTO:

- `reservationId`
- `idempotencyKey`

Responsibilities:

- Gia lap payment success.
- Chuyen reservation sang paid.
- Tao order va payment.
- Tra order summary.

### Admin module

Endpoints:

- `GET /admin/stats`
- `GET /admin/active-reservations`

Stats:

- Total tickets.
- Sold tickets.
- Held tickets.
- Available tickets.
- Revenue.
- Active holds with remaining time.

### Realtime module

Socket events:

- Server emits `inventory.updated`.
- Server emits `admin.stats.updated`.
- Client can subscribe to event room.

Payload:

```ts
{
  ticketTypes: Array<{
    id: string;
    name: string;
    availableQuantity: number;
    soldQuantity: number;
    heldQuantity: number;
  }>;
  serverTime: string;
}
```

## 8. Frontend Scope

Frontend styling:

- Dung Tailwind CSS cho toan bo UI web.
- Uu tien utility classes truc tiep trong component.
- Dung `@layer components` va `@apply` cho nhung pattern lap lai nhu button, card, table, hero section.
- Khong viet CSS thu cong dai dong ngoai nhung rule nen tang, background image, hoac pseudo element that su can.
- Giao dien can co loading state, disabled state, sold out state, countdown state va error state.
- State global dung Redux Toolkit, truoc mat luu auth user/token.
- Tach component dung chung nhu `Button`, `TextInput`, `SiteHeader`, `StatusPill`, `AppShell`.

### Routes

- `/`: event home.
- `/ticket-types/[ticket-type-id]`: ticket type detail + seat map.
- `/booking`: booking page.
- `/booking/[reservation-id]`: checkout/countdown page.
- `/admin`: admin dashboard.

### Event Home

Requirements:

- Hien thi thong tin concert.
- Hien thi so ve con lai realtime.
- Khi socket mat ket noi, fallback polling moi 5-10 giay.
- Trang thai loading, stale data, reconnecting.

### Booking Page

Requirements:

- Danh sach loai ve.
- Click vao hang ve de vao trang chi tiet hang ve va chon ghe.
- Quantity selector.
- Nut chon ve co loading state.
- Disable spam click khi dang request.
- Neu het ve, hien sold out state.
- Neu server tra 409, refresh inventory va hien thong bao nhe.

### Ticket Type Detail / Seat Map

Requirements:

- Hien thi thong tin hang ve, gia ve, so ghe con trong.
- Hien thi seat map theo row/seat number.
- Cho phep chon 1 hoac nhieu ghe, toi da 10 ghe moi reservation.
- Co chon nhanh 1/2/4/6/10 ghe con trong dau tien.
- Ghe `HELD`/`SOLD` bi disable.
- Khi submit, frontend goi `POST /reservations/seats`.
- Neu server tra `409 SEAT_UNAVAILABLE`, refresh seat map va hien thong bao.
- Countdown tiep tuc o `/booking/[reservation-id]`, hien danh sach ma ghe da giu.

### Checkout Page

Requirements:

- Countdown tinh tu `expiresAt - serverTime`.
- Khong tin clock client tuyet doi.
- Nut thanh toan co loading state va idempotency key.
- Neu countdown het, goi refresh reservation va dieu huong ve booking.

### Admin Dashboard

Requirements:

- Sold tickets.
- Revenue.
- Held tickets.
- Available tickets.
- Active reservations table.
- Realtime update.

UX khi tai cao:

- Optimistic UI chi dung cho loading, khong tru ve ao neu chua co response.
- Disable button trong luc request.
- Toast/message ngan gon cho loi 409/429/500.
- Retry co gioi han cho request doc.
- Khong auto retry voi request tao reservation/payment neu khong co idempotency.

## 9. Module 1 - Foundation va Core Reservation

Day la module nen lam dau tien.

### Muc tieu Module 1

Hoan thanh nen tang backend, database, Docker, va luong giu ve an toan concurrency.

### Deliverables

- Monorepo setup.
- Docker Compose cho PostgreSQL, Redis, API, Web.
- NestJS API skeleton.
- Prisma schema + migration + seed 500 ve.
- Ticket module.
- Reservation module.
- Global validation va error handling.
- Unit test cho core reservation.
- Integration test concurrency co the chay local.

### Checklist Module 1

1. Khoi tao workspace
   - Tao `apps/api`.
   - Tao `apps/web`.
   - Tao `packages/shared`.
   - Cau hinh TypeScript, ESLint, Prettier.

2. Docker
   - `docker-compose.yml` gom `postgres`, `redis`.
   - Environment:
     - `DATABASE_URL`
     - `REDIS_URL`
     - `RESERVATION_TTL_SECONDS=300`

3. Database
   - Tao Prisma schema.
   - Tao migration.
   - Seed:
     - VIP: 100 ve.
     - Standard: 300 ve.
     - Economy: 100 ve.

4. NestJS common layer
   - `global-exception.filter.ts`
   - `validation.pipe.ts`
   - `request-id.middleware.ts`
   - response error format thong nhat.

5. Ticket module
   - Repository doc ticket types.
   - Service tinh available quantity.
   - Controller `GET /ticket-types`.

6. Reservation module
   - DTO validation.
   - Repository transaction.
   - Service hold ticket bang row lock.
   - Controller `POST /reservations`.
   - Controller `GET /reservations/:id`.

7. Release expired holds
   - Cron job moi 10-30 giay.
   - Dung `FOR UPDATE SKIP LOCKED`.
   - Test logic release.

8. Tests
   - Unit test:
     - hold thanh cong.
     - hold khi khong du ve.
     - expired hold duoc release.
   - Integration/concurrency test:
     - 1.000 request dong thoi tranh 500 ve.
     - Assert `sold + held <= total`.
     - Assert khong co quantity am.

### Acceptance Criteria Module 1

- Chay `docker compose up` khoi dong duoc postgres/redis.
- Chay API duoc.
- `GET /ticket-types` tra dung inventory.
- `POST /reservations` giu ve va tra `expiresAt`.
- Sau 5 phut hoac khi trigger cron, hold het han duoc release.
- Concurrency test khong bao gio over-sell.
- Code tach layer ro rang.

## 10. Module 2 - Payment va Order

Muc tieu:

- Hoan thanh thanh toan gia lap va chuyen reservation sang sold.

Checklist:

- Tao order module.
- Tao payment module.
- Them idempotency key.
- Payment success transaction:
  - Lock reservation.
  - Check status va expiresAt.
  - Update reservation paid.
  - Update ticket inventory.
  - Create order/payment.
- Test double payment same idempotency key.
- Test payment sau khi expired.
- Test nhieu payment dong thoi cho cung reservation.

Acceptance:

- Payment thanh cong chi tinh tien mot lan.
- `sold_quantity` tang dung.
- `held_quantity` giam dung.
- Expired reservation khong thanh toan duoc.

## 11. Module 3 - Realtime va Admin

Muc tieu:

- Dong bo inventory realtime va dashboard admin.

Checklist:

- Tao realtime gateway.
- Emit event sau hold/payment/release.
- Admin stats endpoint.
- Active reservations endpoint.
- Cache stats bang Redis neu can.
- Socket reconnect strategy.

Acceptance:

- Nhieu tab cung thay inventory update.
- Admin thay held/sold/revenue gan realtime.
- Khi socket disconnect, frontend fallback polling.

## 12. Module 4 - Frontend User Flow

Muc tieu:

- Hoan thanh giao dien user dat ve.

Checklist:

- Setup Next.js app router.
- Tao API client.
- Tao socket client.
- Event home realtime inventory.
- Booking page.
- Checkout countdown page.
- Payment success page.
- Error/loading/empty states.
- Login/register pages dung JWT auth.
- Header hien user dang nhap va logout.
- Admin UI yeu cau dang nhap truoc khi xem dashboard.

Acceptance:

- User giu ve duoc.
- Countdown dong bo theo server.
- Het gio thi ve duoc nha.
- Button khong spam duoc khi request dang pending.

## 13. Module 5 - Admin UI va Polish

Muc tieu:

- Dashboard don gian nhung du thong tin cham bai.

Checklist:

- Stats cards.
- Active holds table.
- Revenue format.
- Realtime updates.
- Responsive layout.
- Basic auth mock cho admin neu can.

Acceptance:

- Admin xem duoc sold, held, available, revenue.
- Admin xem duoc danh sach hold chua thanh toan.

## 14. Module 6 - Load Test va Hardening

Muc tieu:

- Chung minh he thong chiu duoc tinh huong 5.000 user tranh 500 ve.

Checklist:

- Viet k6 script:
  - Ramp 5.000 virtual users.
  - Goi `POST /reservations`.
  - Random ticket type.
- Metrics:
  - Error rate.
  - p95 latency.
  - So reservation tao thanh cong.
  - Assert khong vuot inventory.
- Them rate limit:
  - Theo IP.
  - Theo user/session.
- Them request logging.
- Them health check.

Acceptance:

- Khong over-selling.
- API loi het ve tra 409 ro rang.
- Khong co inventory am.
- Co bao cao load test ngan gon.

## 15. Error Handling Standard

Response loi de xuat:

```json
{
  "statusCode": 409,
  "code": "TICKET_SOLD_OUT",
  "message": "Not enough tickets available",
  "requestId": "req_...",
  "timestamp": "2026-06-30T00:00:00.000Z"
}
```

Ma loi:

- `VALIDATION_ERROR`
- `TICKET_SOLD_OUT`
- `RESERVATION_NOT_FOUND`
- `RESERVATION_EXPIRED`
- `RESERVATION_ALREADY_PAID`
- `PAYMENT_ALREADY_PROCESSED`
- `RATE_LIMITED`
- `INTERNAL_SERVER_ERROR`

## 16. Data Validation

Backend:

- Dung `class-validator` va `class-transformer`.
- Bat global validation pipe:
  - whitelist.
  - forbidNonWhitelisted.
  - transform.

Frontend:

- Dung zod hoac shared DTO schema neu muon.
- Validate quantity truoc khi submit.
- Khong tin frontend cho business rule.

## 17. Security va Reliability Add-ons

Nen them de ghi diem:

- Idempotency key cho payment.
- Request ID middleware.
- Rate limiting.
- Helmet.
- CORS config ro rang.
- Structured logging voi pino.
- Health endpoint.
- Graceful shutdown.
- Database transaction timeout.
- Redis-backed throttling neu chay nhieu instance.

## 18. Test Plan

Backend unit tests:

- Reservation service hold.
- Reservation service release.
- Payment service success.
- Payment idempotency.

Backend integration tests:

- API validation.
- Reservation concurrency.
- Payment concurrency.
- Cron release expired reservations.

Frontend tests:

- Booking button disabled while loading.
- Countdown uses server time.
- Sold out state.
- Payment success/failure state.

Load tests:

- k6 reservation burst.
- k6 payment burst optional.

## 19. Definition of Done

Du an duoc xem la hoan thanh khi:

- User co the xem ve realtime.
- User co the giu ve 5 phut.
- User co the thanh toan gia lap.
- Admin xem duoc sold, revenue, active holds.
- Het gio hold thi ve quay lai kho.
- Concurrency test chung minh khong over-selling.
- Code theo layered architecture.
- Co Docker setup de reviewer chay nhanh.
- Co README huong dan run/test/load test.

## 20. Thu tu thuc hien de xuat

1. Module 1: Foundation va Core Reservation.
2. Module 2: Payment va Order.
3. Module 3: Realtime va Admin API.
4. Module 4: Frontend User Flow.
5. Module 5: Admin UI va Polish.
6. Module 6: Load Test va Hardening.

Neu thoi gian han che, uu tien:

1. Concurrency-safe reservation.
2. Payment idempotency.
3. Countdown va loading UX.
4. Admin stats.
5. k6 proof khong over-selling.
