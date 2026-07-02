export function HistoryEmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#12141c]/40 p-10 text-center shadow-lg">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-500">
        ?
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-400">
        Chưa có vé nào đã thanh toán trong lịch sử.
      </p>
    </div>
  );
}
