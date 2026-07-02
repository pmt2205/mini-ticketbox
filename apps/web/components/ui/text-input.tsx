import type { InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export function TextInput({ label, error, className = '', ...props }: TextInputProps) {
  return (
    <label className="grid gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      <span>{label}</span>
      <input
        className={`min-h-12 rounded-lg border border-white/10 bg-[#0d0e12]/80 px-3 text-sm font-medium text-white placeholder-slate-400/60 outline-none transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-bold text-rose-400 lowercase tracking-normal">{error}</span> : null}
    </label>
  );
}
