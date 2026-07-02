'use client';

import { useEffect, useRef } from 'react';
import { getRealtimeSocket, type InventoryUpdatedEvent } from '../lib/realtime-client';

type UseInventoryRealtimeOptions = {
  enabled?: boolean;
  fallbackMs?: number;
  onFallbackRefresh: () => void;
  onInventoryUpdated: (payload: InventoryUpdatedEvent) => void;
};

export function useInventoryRealtime({
  enabled = true,
  fallbackMs = 10000,
  onFallbackRefresh,
  onInventoryUpdated,
}: UseInventoryRealtimeOptions) {
  const fallbackRefreshRef = useRef(onFallbackRefresh);
  const inventoryUpdatedRef = useRef(onInventoryUpdated);

  useEffect(() => {
    fallbackRefreshRef.current = onFallbackRefresh;
    inventoryUpdatedRef.current = onInventoryUpdated;
  }, [onFallbackRefresh, onInventoryUpdated]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = getRealtimeSocket();
    let fallbackInterval: number | null = null;

    const stopFallback = () => {
      if (fallbackInterval) {
        window.clearInterval(fallbackInterval);
        fallbackInterval = null;
      }
    };

    const startFallback = () => {
      if (!fallbackInterval) {
        fallbackInterval = Number(window.setInterval(() => {
          fallbackRefreshRef.current();
        }, fallbackMs));
      }
    };

    const handleInventoryUpdated = (payload: InventoryUpdatedEvent) => {
      inventoryUpdatedRef.current(payload);
    };

    socket.on('connect', stopFallback);
    socket.on('disconnect', startFallback);
    socket.on('inventory.updated', handleInventoryUpdated);

    if (socket.connected) {
      stopFallback();
    } else {
      startFallback();
    }

    return () => {
      socket.off('connect', stopFallback);
      socket.off('disconnect', startFallback);
      socket.off('inventory.updated', handleInventoryUpdated);
      stopFallback();
    };
  }, [enabled, fallbackMs]);
}
