import Link from 'next/link';
import { StatusPill } from '../../../components/status-pill';
import { formatCurrency } from '../../../lib/format';
import type { TicketType } from '../../../types/ticket';

type TicketTypeCardProps = {
  ticketType: TicketType;
};

export function TicketTypeCard({ ticketType }: TicketTypeCardProps) {
  const isSoldOut = ticketType.availableQuantity <= 0;
  const availablePercent = Math.max(
    0,
    Math.min(100, (ticketType.availableQuantity / ticketType.totalQuantity) * 100),
  );

  return (
    <article className="ticket-card">
      <div className="ticket-card-header">
        <div>
          <h3>{ticketType.name}</h3>
          <p>{formatCurrency(ticketType.price)}</p>
        </div>
        <StatusPill tone={isSoldOut ? 'danger' : 'success'}>
          {isSoldOut ? 'Hết vé' : `${ticketType.availableQuantity} vé`}
        </StatusPill>
      </div>

      <div className="ticket-meter" aria-hidden="true">
        <span style={{ width: `${availablePercent}%` }} />
      </div>

      <dl className="ticket-stats">
        <TicketStat label="Tổng số" value={ticketType.totalQuantity} />
        <TicketStat label="Đang giữ" value={ticketType.heldQuantity} />
        <TicketStat label="Đã bán" value={ticketType.soldQuantity} />
      </dl>

      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition-all duration-200 hover:scale-[1.02] hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98]"
        href={`/ticket-types/${ticketType.id}`}
      >
        Xem sơ đồ ghế
      </Link>
    </article>
  );
}

function TicketStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
