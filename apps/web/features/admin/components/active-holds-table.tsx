import { StatusPill } from '../../../components/status-pill';
import { Button } from '../../../components/ui/button';
import { formatCountdown, formatCurrency, formatNumber } from '../../../lib/format';
import type { AdminActiveReservation } from '../../../types/ticket';
import { EmptyRow, renderSeats } from './utils';

type ActiveHoldsTableProps = {
  activeReservations: AdminActiveReservation[];
  cancellingId: string | null;
  loading: boolean;
  now: number;
  onCancel: (id: string) => Promise<void>;
};

export function ActiveHoldsTable({
  activeReservations,
  cancellingId,
  loading,
  now,
  onCancel,
}: ActiveHoldsTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="table-header mb-5 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <h2 className="text-xl font-bold text-white tracking-tight">Vé đang bị khóa tạm thời</h2>
        <StatusPill tone={activeReservations.length > 0 ? 'warning' : 'neutral'}>
          {formatNumber(activeReservations.length)} lượt giữ
        </StatusPill>
      </div>
      <div className="table-scroll overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Khách hàng</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Hạng vé</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Ghế</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Số lượng</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Tạm tính</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Còn lại</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyRow colSpan={7} text="Đang tải danh sách lượt giữ..." />
            ) : activeReservations.length === 0 ? (
              <EmptyRow colSpan={7} text="Không có vé nào đang bị khóa giữ." />
            ) : (
              activeReservations.map((reservation) => {
                const remainingSeconds = Math.max(
                  0,
                  Math.floor((new Date(reservation.expiresAt).getTime() - now) / 1000),
                );

                return (
                  <tr key={reservation.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300">
                      <strong className="block text-white font-semibold">{reservation.customerName ?? 'Khách vãng lai'}</strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        {reservation.customerEmail ?? reservation.userId}
                      </span>
                      {reservation.customerPhone ? (
                        <span className="mt-1 block text-xs text-slate-500 font-normal">{reservation.customerPhone}</span>
                      ) : null}
                    </td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{reservation.ticketTypeName}</td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300 max-w-[220px]">{renderSeats(reservation.seats)}</td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{formatNumber(reservation.quantity)}</td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-indigo-400">{formatCurrency(reservation.totalAmount)}</td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300">
                      <StatusPill tone={remainingSeconds > 60 ? 'warning' : 'danger'}>
                        {formatCountdown(remainingSeconds)}
                      </StatusPill>
                    </td>
                    <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300">
                      <Button
                        className="min-h-9 px-3.5 text-xs bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 active:scale-95"
                        disabled={cancellingId === reservation.id}
                        type="button"
                        onClick={() => void onCancel(reservation.id)}
                      >
                        {cancellingId === reservation.id ? 'Đang hủy...' : 'Hủy lượt giữ'}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
