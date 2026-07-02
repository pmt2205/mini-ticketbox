import { Button } from '../../../components/ui/button';
import type { AuthUser } from '../../../types/auth';

type HistoryHeaderProps = {
  authUser: AuthUser;
  refreshing: boolean;
  onRefresh: () => void;
};

export function HistoryHeader({ authUser, refreshing, onRefresh }: HistoryHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Lịch sử mua vé</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Lịch sử đặt vé</h1>
        <p className="mt-1 text-sm font-medium text-slate-400">
          Tài khoản: <span className="font-semibold text-indigo-300">{authUser.fullName}</span>
        </p>
      </div>
      <Button variant="secondary" disabled={refreshing} onClick={onRefresh}>
        {refreshing ? 'Đang làm mới...' : 'Làm mới'}
      </Button>
    </div>
  );
}
