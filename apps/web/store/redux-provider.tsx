'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { loadStoredSession } from '../features/auth/store/auth-slice';
import { store } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void store.dispatch(loadStoredSession());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
