import { formatCountdown } from '../../../lib/format';

type CountdownSurfaceProps = {
  isExpired: boolean;
  isPaid: boolean;
  remainingSeconds: number;
};

export function CountdownSurface({ isExpired, isPaid, remainingSeconds }: CountdownSurfaceProps) {
  return (
    <div
      aria-live="polite"
      className="countdown-surface relative my-7 overflow-hidden rounded-xl border border-white/5 bg-slate-950/80 p-6 text-center shadow-lg"
    >
      <span>Thời gian thanh toán còn lại</span>
      <strong
        className={`mt-3 block text-6xl font-black tracking-tight tabular-nums sm:text-7xl ${
          isExpired || isPaid
            ? 'text-rose-500 opacity-40'
            : 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'
        }`}
        style={{
          textShadow: isExpired || isPaid ? 'none' : '0 0 20px rgba(99, 102, 241, 0.45)',
        }}
      >
        {isPaid ? '00:00' : formatCountdown(isExpired ? 0 : remainingSeconds)}
      </strong>
    </div>
  );
}
