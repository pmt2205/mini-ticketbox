import { Button } from '../../../components/ui/button';
import { formatCurrency } from '../../../lib/format';
import type { Seat } from '../../../types/ticket';

type SelectedSeatsSidebarProps = {
  holding: boolean;
  selectedSeatIds: string[];
  selectedSeats: Seat[];
  totalAmount: number;
  onOpenCustomerInfo: () => void;
};

export function SelectedSeatsSidebar({
  holding,
  selectedSeatIds,
  selectedSeats,
  totalAmount,
  onOpenCustomerInfo,
}: SelectedSeatsSidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
      <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-400">Lựa chọn</p>
      <h2 className="text-2xl font-black tracking-tight text-white">Ghế đã chọn</h2>

      <div className="mt-5 min-h-[112px] rounded-xl border border-white/5 bg-slate-950/40 p-4">
        {selectedSeats.length === 0 ? (
          <p className="text-sm font-medium text-slate-500">Chưa chọn ghế nào.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-300"
                key={seat.id}
              >
                {seat.code}
              </span>
            ))}
          </div>
        )}
      </div>

      <dl className="mt-6 grid gap-4 border-t border-white/5 pt-5 text-sm">
        <SummaryRow label="Số ghế đã chọn" value={`${selectedSeats.length}`} />
        <SummaryRow label="Tạm tính" value={formatCurrency(totalAmount)} highlight />
      </dl>

      <Button
        className="mt-6 w-full shadow-lg shadow-indigo-600/15"
        disabled={selectedSeatIds.length === 0 || holding}
        onClick={onOpenCustomerInfo}
      >
        {holding ? 'Đang giữ ghế...' : 'Giữ ghế đã chọn'}
      </Button>

      <SeatLegend />
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <dt className="font-semibold text-slate-400">{label}</dt>
      <dd className={highlight ? 'text-lg font-black text-indigo-400' : 'text-base font-extrabold text-white'}>
        {value}
      </dd>
    </div>
  );
}

function SeatLegend() {
  return (
    <div className="mt-6 grid gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs font-medium text-slate-400">
      <LegendItem
        markerClassName="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
        label="Ghế đang chọn"
      />
      <LegendItem markerClassName="border border-white/10 bg-[#161824]/80" label="Ghế trống" />
      <LegendItem markerClassName="border border-white/5 bg-slate-900/40" label="Ghế đã giữ hoặc đã bán" />
      <div className="my-1.5 h-px bg-white/5" />
      <p className="text-[10px] font-bold leading-normal text-slate-500">Tối đa 10 ghế mỗi lượt giữ</p>
    </div>
  );
}

function LegendItem({ markerClassName, label }: { markerClassName: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-md ${markerClassName}`} />
      <span>{label}</span>
    </div>
  );
}
