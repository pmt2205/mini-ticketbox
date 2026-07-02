import { formatCurrency } from '../../../lib/format';
import type { PurchaseHistorySummary } from '../types';

type HistorySummaryProps = {
  summary: PurchaseHistorySummary;
};

export function HistorySummary({ summary }: HistorySummaryProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <SummaryCard label="Tổng số vé đã mua" value={`${summary.totalTickets} vé`} tone="indigo" />
      <SummaryCard label="Tổng tiền tích lũy" value={formatCurrency(summary.totalSpent)} tone="emerald" />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'indigo' | 'emerald';
}) {
  const valueClass = tone === 'indigo' ? 'text-indigo-400' : 'text-emerald-400';

  return (
    <div className="rounded-xl border border-white/5 bg-[#12141c]/40 p-4 shadow-md">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <strong className={`mt-2 block text-3xl font-black ${valueClass}`}>{value}</strong>
    </div>
  );
}
