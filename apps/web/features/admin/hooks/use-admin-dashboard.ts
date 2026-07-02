'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInventoryRealtime } from '../../../hooks/use-inventory-realtime';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  cancelAdminHold,
  clearAdminData,
  loadAdminDashboard,
  setAdminTab,
  type AdminTab,
} from '../store/admin-slice';

export function useAdminDashboard() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const adminState = useAppSelector((state) => state.admin);
  const [now, setNow] = useState(() => Date.now());

  const activeHoldQuantity = useMemo(
    () =>
      adminState.activeReservations.reduce(
        (total, reservation) => total + reservation.quantity,
        0,
      ),
    [adminState.activeReservations],
  );

  function loadData(isRefresh = false) {
    if (!accessToken || authUser?.role !== 'ADMIN') {
      dispatch(clearAdminData());
      return;
    }

    void dispatch(loadAdminDashboard({ token: accessToken, isRefresh }));
  }

  async function cancelReservation(id: string) {
    if (!accessToken || authUser?.role !== 'ADMIN') {
      return;
    }

    try {
      await dispatch(cancelAdminHold({ id, token: accessToken })).unwrap();
      loadData(true);
    } catch {
      // Error text is stored in the admin slice.
    }
  }

  function selectTab(tab: AdminTab) {
    dispatch(setAdminTab(tab));
  }

  useEffect(() => {
    loadData();
  }, [accessToken, authUser?.role]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useInventoryRealtime({
    enabled: Boolean(accessToken && authUser?.role === 'ADMIN'),
    onFallbackRefresh: () => {
      if (accessToken && authUser?.role === 'ADMIN') {
        loadData(true);
      }
    },
    onInventoryUpdated: () => {
      if (accessToken && authUser?.role === 'ADMIN') {
        loadData(true);
      }
    },
  });

  return {
    ...adminState,
    activeHoldQuantity,
    authUser,
    cancelReservation,
    now,
    selectTab,
  };
}
