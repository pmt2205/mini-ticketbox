import { StatusPill } from '../../../components/status-pill';
import { formatCurrency, formatNumber } from '../../../lib/format';
import type { AdminTicketDetail } from '../../../types/ticket';
import { EmptyRow } from './utils';

type TicketManagementProps = {
  loading: boolean;
  tickets: AdminTicketDetail[];
};

export function TicketManagement({ loading, tickets }: TicketManagementProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="table-header mb-5 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <h2 className="text-xl font-bold text-white tracking-tight">Chi tiết số lượng vé & doanh thu</h2>
        <StatusPill tone="neutral">{formatNumber(tickets.length)} hạng vé</StatusPill>
      </div>
      <div className="table-scroll overflow-x-auto rounded-xl border border-white/5 bg-slate-950/40">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Hạng vé</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Đơn giá</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Tổng số vé</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Còn trống</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Đang giữ</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Đã bán</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Số lượt giữ</th>
              <th className="border-b border-white/5 px-4 py-4 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-950/60">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyRow colSpan={8} text="Đang tải thông tin vé chi tiết..." />
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-white">{ticket.name}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-medium text-indigo-400">{formatCurrency(ticket.price)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{formatNumber(ticket.totalQuantity)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-emerald-400">{formatNumber(ticket.seatStatusCounts.available)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-amber-400">{formatNumber(ticket.seatStatusCounts.held)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-indigo-400">{formatNumber(ticket.seatStatusCounts.sold)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-normal text-slate-300">{formatNumber(ticket.activeReservationCount)}</td>
                  <td className="border-b border-white/5 px-4 py-4 text-sm font-semibold text-white">{formatCurrency(ticket.revenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TicketSummaryTable({ loading, tickets }: TicketManagementProps) {
  return <TicketManagement loading={loading} tickets={tickets} />;
}
