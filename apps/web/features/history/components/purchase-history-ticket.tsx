import { StatusPill } from '../../../components/status-pill';
import { formatCurrency } from '../../../lib/format';
import type { PurchaseHistoryItem } from '../../../types/ticket';

type PurchaseHistoryTicketProps = {
  item: PurchaseHistoryItem;
};

export function PurchaseHistoryTicket({ item }: PurchaseHistoryTicketProps) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12141c]/60 shadow-lg backdrop-blur-sm transition hover:border-white/20 md:flex-row">
      <div className="flex-1 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
              Vé concert
            </span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{item.ticketTypeName}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              Thanh toán lúc: {new Date(item.paidAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-xs sm:grid-cols-3">
          <TicketInfo label="Người nhận" value={item.customerName ?? '-'} />
          <TicketInfo label="Số điện thoại" value={item.customerPhone ?? '-'} />
          <TicketInfo label="Số lượng" value={`${item.quantity} vé`} highlight />
        </div>

        {item.seats.length ? <SeatList seats={item.seats} /> : null}
      </div>

      <TicketSeparator />
      <TicketStub item={item} />
    </article>
  );
}

function TicketInfo({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
      <span className="mb-0.5 block font-semibold text-slate-400">{label}</span>
      <strong className={`font-extrabold ${highlight ? 'text-indigo-300' : 'text-white'}`}>{value}</strong>
    </div>
  );
}

function SeatList({
  seats,
}: {
  seats: PurchaseHistoryItem['seats'];
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Vị trí ghế:
      </span>
      {seats.map((seat) => (
        <span
          className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-extrabold text-cyan-300"
          key={seat.id}
        >
          {seat.code}
        </span>
      ))}
    </div>
  );
}

function TicketSeparator() {
  return (
    <div className="relative hidden flex-col items-center justify-between py-4 md:flex">
      <div className="absolute -top-2 h-4 w-4 rounded-full border-b border-white/10 bg-[#090a0f]" />
      <div className="h-full w-px border-l border-dashed border-white/10" />
      <div className="absolute -bottom-2 h-4 w-4 rounded-full border-t border-white/10 bg-[#090a0f]" />
    </div>
  );
}

function TicketStub({ item }: { item: PurchaseHistoryItem }) {
  return (
    <div className="flex w-full flex-col items-center justify-between bg-slate-950/30 p-5 text-center max-md:border-t max-md:border-white/5 md:w-56 md:items-stretch md:p-6 md:text-left">
      <div className="w-full">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tổng thanh toán</span>
        <strong className="mt-1 block text-2xl font-black tracking-tight text-emerald-400">
          {formatCurrency(item.totalAmount)}
        </strong>
        <div className="mt-3 flex justify-center md:justify-start">
          <StatusPill tone="success">Đã thanh toán</StatusPill>
        </div>
      </div>

      <TicketBarcode paymentId={item.paymentId} />
    </div>
  );
}

function TicketBarcode({ paymentId }: { paymentId: string }) {
  const bars = [1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2];

  return (
    <div className="mt-5 w-full">
      <div className="flex h-7 w-full items-end justify-between gap-[1.5px] overflow-hidden opacity-35">
        {bars.map((width, index) => (
          <span className="h-full rounded-[1px] bg-white" key={`${width}-${index}`} style={{ width: `${width}px` }} />
        ))}
      </div>
      <span className="mt-1.5 block text-center text-[8px] font-black uppercase tracking-[0.25em] text-slate-500">
        #{paymentId.substring(0, 12).toUpperCase()}
      </span>
    </div>
  );
}
