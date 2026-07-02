import type { ReactNode } from 'react';

type StatusPillProps = {
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
  children: ReactNode;
};

export function StatusPill({ tone = 'neutral', children }: StatusPillProps) {
  const toneStyle = {
    success: {
      wrapper: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    },
    warning: {
      wrapper: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    },
    danger: {
      wrapper: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]',
    },
    neutral: {
      wrapper: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
      dot: 'bg-slate-400',
    },
  }[tone];

  return (
    <span
      className={`inline-flex min-h-7 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider leading-none transition-all duration-300 ${toneStyle.wrapper}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneStyle.dot}`} />
      {children}
    </span>
  );
}
