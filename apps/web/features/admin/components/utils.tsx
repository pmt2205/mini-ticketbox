export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td className="py-8 text-center text-sm font-semibold text-slate-400" colSpan={colSpan}>
        {text}
      </td>
    </tr>
  );
}

export function renderSeats(seats: Array<{ id: string; code: string }>) {
  if (seats.length === 0) {
    return <span className="text-slate-500">Theo số lượng</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {seats.map((seat) => (
        <span
          className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300"
          key={seat.id}
        >
          {seat.code}
        </span>
      ))}
    </div>
  );
}
