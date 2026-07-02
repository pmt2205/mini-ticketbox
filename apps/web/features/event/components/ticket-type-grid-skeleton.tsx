const SKELETON_ITEMS = [1, 2, 3];

export function TicketTypeGridSkeleton() {
  return (
    <div className="ticket-grid">
      {SKELETON_ITEMS.map((item) => (
        <div className="ticket-card ticket-card-loading flex flex-col justify-between gap-6 p-6" key={item}>
          <div className="space-y-3">
            <div className="h-6 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-1/3 rounded bg-white/5" />
          </div>
          <div className="h-2 w-full rounded bg-white/5" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-white/5" />
            <div className="h-10 rounded bg-white/5" />
            <div className="h-10 rounded bg-white/5" />
          </div>
          <div className="flex gap-2">
            <div className="h-11 w-1/3 rounded bg-white/5" />
            <div className="h-11 w-2/3 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
