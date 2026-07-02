'use client';

import { useEffect, useMemo } from 'react';
import { useInventoryRealtime } from '../../../hooks/use-inventory-realtime';
import type { InventoryUpdatedEvent } from '../../../lib/realtime-client';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { applyEventInventory, loadEventTicketTypes, resetEventInventory } from '../store/event-slice';
import type { EventInventoryStats } from '../types';

export function useEventBookingBoard() {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) => state.event);

  const totalStats = useMemo<EventInventoryStats>(
    () =>
      event.ticketTypes.reduce(
        (stats, ticket) => ({
          total: stats.total + ticket.totalQuantity,
          available: stats.available + ticket.availableQuantity,
          held: stats.held + ticket.heldQuantity,
          sold: stats.sold + ticket.soldQuantity,
        }),
        { total: 0, available: 0, held: 0, sold: 0 },
      ),
    [event.ticketTypes],
  );

  useEffect(() => {
    void dispatch(loadEventTicketTypes(false));

    return () => {
      dispatch(resetEventInventory());
    };
  }, [dispatch]);

  useInventoryRealtime({
    onFallbackRefresh: () => void dispatch(loadEventTicketTypes(true)),
    onInventoryUpdated: (payload: InventoryUpdatedEvent) => {
      dispatch(applyEventInventory(payload.ticketTypes));
    },
  });

  function refreshTicketTypes() {
    void dispatch(loadEventTicketTypes(true));
  }

  return {
    ...event,
    refreshTicketTypes,
    totalStats,
  };
}
