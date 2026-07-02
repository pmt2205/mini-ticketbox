import type { PurchaseHistoryItem } from '../../../types/ticket';
import { PurchaseHistoryTicket } from './purchase-history-ticket';

type PurchaseHistoryListProps = {
  items: PurchaseHistoryItem[];
};

export function PurchaseHistoryList({ items }: PurchaseHistoryListProps) {
  return (
    <div className="mt-6 grid gap-5">
      {items.map((item) => (
        <PurchaseHistoryTicket item={item} key={item.paymentId} />
      ))}
    </div>
  );
}
