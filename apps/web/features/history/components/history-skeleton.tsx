const SKELETON_ITEMS = [1, 2, 3];

export function HistorySkeleton() {
  return (
    <div className="mt-6 grid gap-4">
      {SKELETON_ITEMS.map((item) => (
        <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-[#12141c]/40" key={item} />
      ))}
    </div>
  );
}
