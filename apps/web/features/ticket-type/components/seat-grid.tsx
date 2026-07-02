import type { SeatRow } from '../types';

type SeatGridProps = {
  holding: boolean;
  rows: SeatRow[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
};

export function SeatGrid({ holding, rows, selectedSeatIds, onToggleSeat }: SeatGridProps) {
  return (
    <div className="grid min-w-[620px] gap-3.5">
      {rows.map((row) => (
        <div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-4" key={row.rowLabel}>
          <span className="rounded-lg border border-white/5 bg-white/5 py-2.5 text-center text-sm font-black text-slate-400">
            {row.rowLabel}
          </span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] gap-2.5">
            {row.seats.map((seat) => {
              const selected = selectedSeatIds.includes(seat.id);
              const unavailable = seat.status !== 'AVAILABLE';

              return (
                <button
                  aria-pressed={selected}
                  className={[
                    'min-h-11 cursor-pointer rounded-lg border text-xs font-black transition-all duration-200',
                    selected
                      ? 'scale-[1.05] border-transparent bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                      : unavailable
                        ? 'cursor-not-allowed border-white/5 bg-slate-900/40 text-slate-600'
                        : 'border-white/10 bg-[#161824]/80 text-slate-300 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]',
                  ].join(' ')}
                  disabled={unavailable || holding}
                  key={seat.id}
                  type="button"
                  onClick={() => onToggleSeat(seat.id)}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
