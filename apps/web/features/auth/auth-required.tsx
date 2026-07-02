'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useAuthSession } from './hooks/use-auth-session';

export function AuthRequired({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuthSession();

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-64px)] place-items-center px-5 py-16 bg-[#090a0f]">
        <div className="rounded-xl border border-white/10 bg-[#12141c]/60 p-7 text-sm font-bold text-slate-300 shadow-2xl backdrop-blur-md animate-pulse">
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-[calc(100vh-64px)] place-items-center px-5 py-16 bg-[#090a0f]">
        <section className="w-[min(450px,100%)] rounded-xl border border-white/10 bg-[#12141c]/70 p-8 shadow-2xl backdrop-blur-md">
          <p className="mb-2 text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase">Cần xác thực</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white">Cần đăng nhập</h1>
          <p className="mb-6 text-sm font-medium text-slate-400">
            Vui lòng đăng nhập để xem khu vực quản trị này.
          </p>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/15 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            href="/login"
          >
            Đăng nhập
          </Link>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
