'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loadPurchaseHistory, resetPurchaseHistory } from '../store/history-slice';
import type { PurchaseHistorySummary } from '../types';

export function usePurchaseHistory() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const history = useAppSelector((state) => state.history);

  const summary = useMemo<PurchaseHistorySummary>(
    () =>
      history.items.reduce(
        (totals, item) => ({
          totalTickets: totals.totalTickets + item.quantity,
          totalSpent: totals.totalSpent + Number(item.totalAmount),
        }),
        { totalTickets: 0, totalSpent: 0 },
      ),
    [history.items],
  );

  useEffect(() => {
    if (!accessToken) {
      dispatch(resetPurchaseHistory());
      return;
    }

    void dispatch(loadPurchaseHistory({ token: accessToken }));
  }, [accessToken, dispatch]);

  function refreshHistory() {
    if (!accessToken) {
      return;
    }

    void dispatch(loadPurchaseHistory({ token: accessToken, isRefresh: true }));
  }

  return {
    ...history,
    accessToken,
    authUser,
    refreshHistory,
    summary,
  };
}
