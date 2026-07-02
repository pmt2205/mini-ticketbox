'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../features/auth/store/auth-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function SiteHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  function handleLogout() {
    setDropdownOpen(false);
    dispatch(logout());
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-white/[0.06] bg-[#090a0f]/75 px-4 text-white backdrop-blur-md md:px-8">
      <Link className="flex items-center gap-2.5 transition hover:opacity-90" href={isAdmin ? '/admin' : '/'}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <span className="text-xs font-black text-white">TB</span>
        </div>
        <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-lg font-black tracking-tight text-transparent">
          Mini Ticketbox
        </span>
      </Link>

      <nav className="flex items-center gap-3" aria-label="Main navigation">
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Live Async
        </div>

        {isAdmin ? (
          <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300">
            Bảng điều khiển
          </span>
        ) : (
          <Link
            className="min-w-16 rounded-lg px-3 py-2 text-center text-xs font-bold text-slate-300 transition hover:bg-white/[0.04] hover:text-white md:min-w-20"
            href="/"
          >
            Đặt vé
          </Link>
        )}

        <div className="mx-1 h-4 w-px bg-white/10" />

        {user ? (
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2.5 rounded-full border border-white/5 bg-white/[0.02] p-1.5 pr-3 text-left transition duration-200 hover:border-white/10 hover:bg-white/[0.06]"
              onClick={() => setDropdownOpen((prev) => !prev)}
              type="button"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-extrabold text-white">
                {user.fullName.trim().charAt(0).toUpperCase()}
              </div>
              <span className="hidden max-w-40 truncate text-xs font-extrabold text-slate-200 md:inline">
                {user.fullName}
              </span>
              <svg
                className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-full z-30 mt-2.5 w-52 origin-top-right rounded-xl border border-white/10 bg-[#0c0d12]/95 p-1.5 shadow-2xl backdrop-blur-md">
                <div className="px-3 py-2">
                  <p className="truncate text-xs font-bold text-white">{user.fullName}</p>
                  <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                  {isAdmin ? (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Admin
                    </p>
                  ) : null}
                </div>
                <div className="my-1.5 h-px bg-white/5" />

                {!isAdmin ? (
                  <Link
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                    href="/history"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Lịch sử mua vé
                  </Link>
                ) : null}

                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                  type="button"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="ml-1 flex items-center gap-2">
            <Link
              className="rounded-lg px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
              href="/login"
            >
              Đăng nhập
            </Link>
            <Link
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/20 active:scale-95"
              href="/register"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
