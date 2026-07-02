import { StatusPill } from '../../../components/status-pill';
import { formatNumber } from '../../../lib/format';
import type { EventInventoryStats } from '../types';

type EventHeroProps = {
  stats: EventInventoryStats;
};

export function EventHero({ stats }: EventHeroProps) {
  const hasTickets = stats.available > 0;

  return (
    <section className="event-hero">
      <div className="event-hero-backdrop" />
      <div className="event-hero-content">
        <div className="event-copy">
          <StatusPill tone={hasTickets ? 'success' : 'danger'}>
            {hasTickets ? 'Đang mở bán' : 'Hết vé'}
          </StatusPill>
          <h1>Concert Night 2026</h1>
          <p className="event-subtitle">
            Sân khấu concert giới hạn 500 vé. Giữ chỗ an toàn trong 5 phút để hoàn thành thanh toán.
          </p>
        </div>

        <div className="inventory-strip" aria-live="polite">
          <InventoryStat label="Vé còn lại" value={stats.available} />
          <InventoryStat label="Đang khóa giữ" value={stats.held} />
          <InventoryStat label="Đã thanh toán" value={stats.sold} />
        </div>
      </div>
    </section>
  );
}

function InventoryStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{formatNumber(value)}</strong>
    </div>
  );
}
