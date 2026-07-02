import Link from 'next/link';

export function HistoryLoginRequired() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#090a0f] px-4 py-16 text-slate-100">
      <div className="pointer-events-none absolute left-[5%] top-[10%] -z-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-[90px]" />
      <section className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#12141c]/70 p-8 text-center shadow-2xl backdrop-blur-md">
        <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Tài khoản</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Đăng nhập để xem lịch sử</h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400">
          Lịch sử mua vé chỉ hiển thị cho tài khoản đã đăng nhập. Vui lòng đăng nhập hoặc tạo tài
          khoản mới.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition hover:scale-[1.02] hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98]"
          href="/login"
        >
          Đăng nhập ngay
        </Link>
      </section>
    </main>
  );
}
