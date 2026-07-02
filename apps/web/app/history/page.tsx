import { AppShell } from '../../components/app-shell';
import { PurchaseHistory } from '../../features/history/purchase-history';

export default function HistoryPage() {
  return (
    <AppShell>
      <PurchaseHistory />
    </AppShell>
  );
}
