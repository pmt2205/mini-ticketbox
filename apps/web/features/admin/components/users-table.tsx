import { StatusPill } from '../../../components/status-pill';
import { formatNumber } from '../../../lib/format';
import type { AdminUser } from '../../../types/ticket';
import { EmptyRow } from './utils';

type UsersTableProps = {
  loading: boolean;
  users: AdminUser[];
};

export function UsersTable({ loading, users }: UsersTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="table-header mb-5 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <h2 className="text-xl font-bold text-white tracking-tight">Quản lý người dùng hệ thống</h2>
        <StatusPill tone="neutral">{formatNumber(users.length)} tài khoản</StatusPill>
      </div>
      <div className="table-scroll overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
        <table className="w-full min-w-[620px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Họ tên</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Email</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Quyền hạn</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Ngày đăng ký</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyRow colSpan={4} text="Đang tải danh sách người dùng..." />
            ) : users.length === 0 ? (
              <EmptyRow colSpan={4} text="Chưa có người dùng nào đăng ký." />
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="border-b border-white/5 px-4 py-4 text-sm text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 font-semibold text-xs text-indigo-400 border border-indigo-500/20">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-100">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{user.email}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm">
                    <StatusPill tone={user.role === 'ADMIN' ? 'warning' : 'neutral'}>{user.role}</StatusPill>
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-400">
                    {new Date(user.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
