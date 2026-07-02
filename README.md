# Mini Ticketbox

Tác giả: Phạm Mạnh Tường

Mini Ticketbox là ứng dụng fullstack đặt vé concert giới hạn 500 vé. Dự án mô phỏng luồng người dùng xem sự kiện, chọn ghế, giữ vé trong thời gian ngắn, thanh toán giả lập và theo dõi tình trạng vé theo thời gian gần thực.

## Công nghệ sử dụng

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit, Socket.IO client.
- Backend: NestJS, TypeScript, Prisma.
- Database và hạ tầng: PostgreSQL, Redis, Docker Compose.
- Realtime: Socket.IO.
- Auth: JWT, phân quyền user/admin.
- Test: Jest, Supertest.

## Tính năng chính

- Xem sự kiện và số lượng vé còn lại.
- Chọn hạng vé, xem sơ đồ ghế và giữ nhiều ghế cùng lúc.
- Countdown giữ vé dựa trên thời gian từ server.
- Thanh toán giả lập thành công/thất bại.
- Lịch sử mua vé cho người dùng đã đăng nhập.
- Dashboard admin với thống kê vé, doanh thu, lượt giữ đang hoạt động, danh sách người dùng và giao dịch.
- Cập nhật tồn kho qua realtime, có fallback polling khi socket mất kết nối.
- Backend xử lý giữ vé bằng transaction và lock để tránh over-selling.

## Kiến trúc tổng quan

Repository dùng mô hình monorepo:

```txt
apps/
  api/     NestJS API, Prisma, module backend
  web/     Next.js frontend
packages/
  shared/  Hằng số và type dùng chung
```

Backend được tách theo layered architecture:

- Controller xử lý HTTP boundary.
- Service chứa nghiệp vụ.
- Repository làm việc với database và transaction.
- Common layer xử lý validation, exception format, request id.

Frontend được chia theo feature:

- `event`: trang sự kiện và danh sách hạng vé.
- `ticket-type`: chi tiết hạng vé và sơ đồ ghế.
- `booking`: checkout, countdown và thanh toán giả lập.
- `history`: lịch sử mua vé.
- `auth`: đăng nhập, đăng ký, quản lý phiên.
- `admin`: dashboard quản trị, có `components/`, `hooks/`, `store/` riêng.

## Luồng đặt vé

1. Người dùng mở trang sự kiện.
2. Frontend lấy tồn kho ban đầu từ API và lắng nghe realtime update.
3. Người dùng chọn hạng vé và ghế.
4. Backend tạo reservation trong transaction, lock tồn kho để tránh bán vượt số lượng.
5. Người dùng có một khoảng thời gian để thanh toán.
6. Nếu thanh toán thành công, vé chuyển sang trạng thái đã bán.
7. Nếu hết hạn hoặc hủy, vé được trả lại hệ thống.

## Chạy local

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo file môi trường

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

PowerShell:

```powershell
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
```

### 3. Chạy PostgreSQL và Redis

```bash
docker compose up -d postgres redis
```

### 4. Chạy migration và seed

```bash
npm run db:migrate
npm run db:seed
```

Seed tạo 500 vé và sơ đồ ghế tương ứng cho VIP, Standard, Economy.

### 5. Chạy backend

```bash
npm run dev:api
```

API mặc định chạy tại:

```txt
http://localhost:3001
```

Swagger:

```txt
http://localhost:3001/docs
```

### 6. Chạy frontend

```bash
npm run dev:web
```

Frontend mặc định chạy tại:

```txt
http://localhost:3000
```

Các route chính:

- `/`: trang sự kiện.
- `/ticket-types/[ticket-type-id]`: chọn ghế theo hạng vé.
- `/booking/[reservation-id]`: checkout và countdown.
- `/history`: lịch sử mua vé.
- `/login`: đăng nhập.
- `/register`: đăng ký.
- `/admin`: dashboard admin.

Nếu API không chạy ở `http://localhost:3001`, cấu hình biến môi trường cho web:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Build và test

Build toàn bộ workspace:

```bash
npm run build
```

Build riêng frontend:

```bash
npm run build --workspace @mini-ticketbox/web
```

Chạy test backend:

```bash
npm run test
```

Chạy test concurrency reservation:

```bash
npm run test:concurrency
```

## Docker Compose

Chỉ chạy database:

```bash
docker compose up -d postgres redis
```

Chạy cả app bằng profile `app`:

```bash
docker compose --profile app up --build
```

Nếu database mới, chạy migration và seed trong container API:

```bash
docker compose --profile app exec api npm run db:migrate
docker compose --profile app exec api npm run db:seed
```
