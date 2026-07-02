const SKELETON_ROWS = [1, 2, 3, 4, 5];

export function SeatMapSkeleton() {
  return (
    <div className="grid gap-3">
      {SKELETON_ROWS.map((row) => (
        <div className="h-11 animate-pulse rounded-lg border border-white/[0.02] bg-white/5" key={row} />
      ))}
    </div>
  );
}
