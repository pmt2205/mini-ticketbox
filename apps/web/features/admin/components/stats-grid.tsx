import type { AdminStats } from '../../../types/ticket';
import { formatCurrency, formatNumber } from '../../../lib/format';

type StatsGridProps = {
  stats: AdminStats | null;
  activeHoldQuantity: number;
};

export function StatsGrid({ stats, activeHoldQuantity }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141c]/50 p-5 shadow-lg transition-all duration-300 hover:border-indigo-500/30">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tổng số vé</span>
            <strong className="mt-2 block text-3xl font-bold text-white">{formatNumber(stats?.totalTickets ?? 0)}</strong>
          </div>
          <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141c]/50 p-5 shadow-lg transition-all duration-300 hover:border-indigo-500/30">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vé đã bán</span>
            <strong className="mt-2 block text-3xl font-bold text-indigo-400">{formatNumber(stats?.soldTickets ?? 0)}</strong>
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141c]/50 p-5 shadow-lg transition-all duration-300 hover:border-amber-500/30">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vé đang khóa giữ</span>
            <strong className="mt-2 block text-3xl font-bold text-amber-400">{formatNumber(activeHoldQuantity)}</strong>
          </div>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141c]/50 p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/30">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vé còn trống</span>
            <strong className="mt-2 block text-3xl font-bold text-emerald-400">{formatNumber(stats?.availableTickets ?? 0)}</strong>
          </div>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="col-span-1 sm:col-span-2 relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">Doanh thu đã thanh toán</span>
            <strong className="mt-2 block text-3xl font-bold text-white">{formatCurrency(stats?.revenue ?? 0)}</strong>
          </div>
          <div className="rounded-lg bg-indigo-500/20 border border-indigo-500/30 p-2.5 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="col-span-1 sm:col-span-2 relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">Lượt giữ vé đang chờ</span>
            <strong className="mt-2 block text-3xl font-bold text-white">{formatNumber(stats?.activeReservationCount ?? 0)}</strong>
          </div>
          <div className="rounded-lg bg-amber-500/20 border border-amber-500/30 p-2.5 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
