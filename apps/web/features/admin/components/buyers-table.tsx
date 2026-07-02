import { StatusPill } from '../../../components/status-pill';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { AdminPurchase } from '../../../types/ticket';
import { EmptyRow, renderSeats } from './utils';

type BuyersTableProps = {
  loading: boolean;
  purchases: AdminPurchase[];
};

export function BuyersTable({ loading, purchases }: BuyersTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="table-header mb-5 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <h2 className="text-xl font-bold text-white tracking-tight">Danh sách khách mua vé</h2>
        <StatusPill tone="success">{formatNumber(purchases.length)} giao dịch</StatusPill>
      </div>
      <div className="table-scroll overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Khách hàng</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Hạng vé</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Mã ghế</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Số lượng</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Thành tiền</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Ngày thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyRow colSpan={6} text="Đang tải danh sách khách mua..." />
            ) : purchases.length === 0 ? (
              <EmptyRow colSpan={6} text="Chưa có giao dịch mua vé nào thành công." />
            ) : (
              purchases.map((purchase) => (
                <tr key={purchase.paymentId} className="hover:bg-white/[0.01] transition-colors">
                  <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300">
                    <strong className="block text-white font-semibold">{purchase.customerName ?? purchase.userId}</strong>
                    <span className="mt-1 block text-xs text-slate-500">
                      {purchase.customerEmail ?? 'Không có email'}
                    </span>
                    {purchase.customerPhone ? (
                      <span className="mt-1 block text-xs text-slate-500 font-normal">{purchase.customerPhone}</span>
                    ) : null}
                  </td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{purchase.ticketTypeName}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm text-slate-300 max-w-[220px]">{renderSeats(purchase.seats)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{formatNumber(purchase.quantity)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-emerald-400">{formatCurrency(purchase.totalAmount)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-400">
                    {new Date(purchase.paidAt).toLocaleString('vi-VN')}
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
