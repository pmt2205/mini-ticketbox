import Link from 'next/link';
import { StatusPill } from '../../../components/status-pill';
import { formatCurrency } from '../../../lib/format';
import type { TicketTypeDetail } from '../../../types/ticket';

type SeatMapHeaderProps = {
  ticketType: TicketTypeDetail | null;
};

export function SeatMapHeader({ ticketType }: SeatMapHeaderProps) {
  return (
    <>
      <Link
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 transition-colors hover:text-indigo-300"
        href="/"
      >
        <span aria-hidden="true">{"<"}</span>
        Quay lại danh sách vé
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Sơ đồ ghế
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {ticketType?.name ?? 'Đang tải hạng vé'}
          </h1>
          {ticketType ? (
            <p className="mt-2 text-lg font-black text-indigo-400">{formatCurrency(ticketType.price)}</p>
          ) : null}
        </div>

        {ticketType ? (
          <StatusPill tone={ticketType.availableQuantity > 0 ? 'success' : 'danger'}>
            {ticketType.availableQuantity} ghế còn trống
          </StatusPill>
        ) : null}
      </div>
    </>
  );
}
