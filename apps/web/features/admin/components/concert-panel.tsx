import { StatusPill } from '../../../components/status-pill';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { AdminConcert, AdminStats } from '../../../types/ticket';

type ConcertPanelProps = {
  concert: AdminConcert | null;
  loading: boolean;
  stats: AdminStats | null;
};

export function ConcertPanel({ concert, loading, stats }: ConcertPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="table-header mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-white tracking-tight">Thông tin chi tiết concert</h2>
        <StatusPill tone={concert?.status === 'ACTIVE' ? 'success' : 'danger'}>
          {concert?.status === 'ACTIVE' ? 'Đang hoạt động' : 'Hết vé / Tắt'}
        </StatusPill>
      </div>
      {loading ? (
        <div className="py-8 text-center text-sm font-semibold text-slate-400">Đang tải thông tin concert...</div>
      ) : (
        <dl className="grid gap-4 md:grid-cols-2">
          <InfoItem label="Tên sự kiện" value={concert?.name ?? '-'} />
          <InfoItem label="Địa điểm tổ chức" value={concert?.venue ?? '-'} />
          <InfoItem label="Sức chứa giới hạn" value={formatNumber(concert?.totalCapacity ?? 0)} />
          <InfoItem label="Thời gian giữ vé tạm thời" value={`${concert?.holdTtlSeconds ?? 0} giây`} />
          <InfoItem label="Vé đã bán thành công" value={formatNumber(stats?.soldTickets ?? 0)} />
          <InfoItem label="Doanh thu thực tế" value={formatCurrency(stats?.revenue ?? 0)} />
        </dl>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 transition-all duration-200 hover:border-white/10">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-2 text-lg font-black text-white">{value}</dd>
    </div>
  );
}
