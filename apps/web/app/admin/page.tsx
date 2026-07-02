import { AppShell } from '../../components/app-shell';
import { AdminDashboard } from '../../features/admin/admin-dashboard';

export default function AdminPage() {
  return (
    <AppShell>
      <AdminDashboard />
    </AppShell>
  );
}
