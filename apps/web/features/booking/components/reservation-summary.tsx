import { formatCurrency } from '../../../lib/format';
import type { Reservation, TicketType } from '../../../types/ticket';

type ReservationSummaryProps = {
  reservation: Reservation | null;
  selectedTicketType: TicketType | null;
  totalAmount: number;
};

export function ReservationSummary({
  reservation,
  selectedTicketType,
  totalAmount,
}: ReservationSummaryProps) {
  if (!reservation) {
    return null;
  }

  return (
    <>
      <div className="reservation-details grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-center">
          <span>Hạng vé</span>
          <strong className="mt-1 block truncate text-base font-extrabold text-white">
            {selectedTicketType?.name ?? 'Đang tải...'}
          </strong>
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-center">
          <span>Số lượng</span>
          <strong className="mt-1 block text-base font-extrabold text-indigo-400">
            {reservation.quantity} vé
          </strong>
        </div>
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-center">
          <span>Tổng tiền</span>
          <strong className="mt-1 block text-base font-extrabold text-white">
            {formatCurrency(totalAmount)}
          </strong>
        </div>
      </div>

      {reservation.seats?.length ? (
        <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/30 p-4">
          <span className="block text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            Mã ghế đã giữ
          </span>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {reservation.seats.map((seat) => (
              <span
                className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-extrabold text-cyan-300"
                key={seat.id}
              >
                {seat.code}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
