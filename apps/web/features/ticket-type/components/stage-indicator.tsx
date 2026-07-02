export function StageIndicator() {
  return (
    <div className="relative mt-8 flex flex-col items-center">
      <div className="h-2.5 w-[85%] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_25px_rgba(99,102,241,0.8)]" />
      <span className="mt-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
        Sân khấu chính
      </span>
    </div>
  );
}
