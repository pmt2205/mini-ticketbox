import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/15 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:border-white/15 hover:text-white hover:scale-[1.01] active:scale-[0.99]',
  ghost: 'border-transparent bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 active:scale-95',
};

export function Button({ className = '', variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-5 text-sm font-bold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none ${variantClass[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
