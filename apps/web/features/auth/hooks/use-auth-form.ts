'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { login, register } from '../store/auth-slice';
import type { AuthFormMode, AuthFormValues } from '../types';
import type { FormEvent } from 'react';

export function useAuthForm(mode: AuthFormMode) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const authUser = useAppSelector((state) => state.auth.user);
  const [values, setValues] = useState<AuthFormValues>({
    fullName: '',
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const isRegister = mode === 'register';
  const isLoading = authStatus === 'loading';

  useEffect(() => {
    if (authUser) {
      router.push(authUser.role === 'ADMIN' ? '/admin' : '/');
    }
  }, [authUser, router]);

  function updateField<Field extends keyof AuthFormValues>(
    field: Field,
    value: AuthFormValues[Field],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (isRegister && values.fullName.trim().length < 2) {
      setFormError('Vui lòng nhập họ tên.');
      return;
    }

    if (values.password.length < 8) {
      setFormError('Mật khẩu cần tối thiểu 8 ký tự.');
      return;
    }

    const result = isRegister
      ? await dispatch(register({ ...values }))
      : await dispatch(login({ email: values.email, password: values.password }));

    if (login.fulfilled.match(result) || register.fulfilled.match(result)) {
      router.push(result.payload.user.role === 'ADMIN' ? '/admin' : '/');
    }
  }

  return {
    authError,
    formError,
    isLoading,
    isRegister,
    submit,
    updateField,
    values,
  };
}
