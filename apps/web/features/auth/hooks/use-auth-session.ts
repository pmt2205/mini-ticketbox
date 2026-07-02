'use client';

import { useAppSelector } from '../../../store/hooks';

export function useAuthSession() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const status = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.user);

  return {
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isLoading: status === 'idle' || status === 'loading',
    status,
    user,
  };
}
