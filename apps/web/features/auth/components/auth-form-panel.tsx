'use client';

import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { TextInput } from '../../../components/ui/text-input';
import type { AuthFormMode, AuthFormValues } from '../types';
import type { FormEvent } from 'react';

type AuthFormPanelProps = {
  authError: string | null;
  formError: string | null;
  isLoading: boolean;
  mode: AuthFormMode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateField: <Field extends keyof AuthFormValues>(
    field: Field,
    value: AuthFormValues[Field],
  ) => void;
  values: AuthFormValues;
};

export function AuthFormPanel({
  authError,
  formError,
  isLoading,
  mode,
  onSubmit,
  onUpdateField,
  values,
}: AuthFormPanelProps) {
  const isRegister = mode === 'register';

  return (
    <section className="w-[min(450px,100%)] rounded-xl border border-white/10 bg-[#12141c]/70 p-8 shadow-2xl backdrop-blur-md">
      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
        Tài khoản
      </p>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white">
        {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
      </h1>

      <form className="grid gap-5" onSubmit={onSubmit}>
        {isRegister ? (
          <TextInput
            autoComplete="name"
            label="Họ tên"
            placeholder="Nhập họ và tên của bạn"
            value={values.fullName}
            onChange={(event) => onUpdateField('fullName', event.target.value)}
          />
        ) : null}
        <TextInput
          autoComplete="email"
          label="Email"
          type="email"
          placeholder="example@domain.com"
          value={values.email}
          onChange={(event) => onUpdateField('email', event.target.value)}
        />
        <TextInput
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          value={values.password}
          onChange={(event) => onUpdateField('password', event.target.value)}
        />

        {formError || authError ? (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-300">
            {formError ?? authError}
          </div>
        ) : null}

        <Button disabled={isLoading} type="submit" variant="primary">
          {isLoading ? 'Đang xử lý' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </Button>
      </form>

      <p className="mt-6 text-xs font-semibold text-slate-400">
        {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
        <Link
          className="font-bold text-indigo-400 underline underline-offset-4 transition-colors hover:text-indigo-300"
          href={isRegister ? '/login' : '/register'}
        >
          {isRegister ? 'Đăng nhập' : 'Đăng ký'}
        </Link>
      </p>
    </section>
  );
}
