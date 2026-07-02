'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useInventoryRealtime } from '../../../hooks/use-inventory-realtime';
import type { InventoryUpdatedEvent } from '../../../lib/realtime-client';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { Seat } from '../../../types/ticket';
import {
  closeCustomerModal,
  holdTicketTypeSeats,
  hydrateCustomerForm,
  loadTicketTypeDetail,
  openCustomerModal,
  resetTicketTypeState,
  setTicketTypeError,
  toggleSeatSelection,
  updateCustomerField,
} from '../store/ticket-type-slice';
import type { CustomerForm, SeatRow } from '../types';
import type { FormEvent } from 'react';

export function useTicketTypeSeatMap(ticketTypeId: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const ticketTypeState = useAppSelector((state) => state.ticketType);
  const [guestUserId] = useState(getGuestUserId);

  const selectedSeats = useMemo(() => {
    if (!ticketTypeState.ticketType) {
      return [];
    }

    const selected = new Set(ticketTypeState.selectedSeatIds);
    return ticketTypeState.ticketType.seats.filter((seat) => selected.has(seat.id));
  }, [ticketTypeState.selectedSeatIds, ticketTypeState.ticketType]);

  const rows = useMemo<SeatRow[]>(() => {
    const grouped = new Map<string, Seat[]>();

    for (const seat of ticketTypeState.ticketType?.seats ?? []) {
      grouped.set(seat.rowLabel, [...(grouped.get(seat.rowLabel) ?? []), seat]);
    }

    return [...grouped.entries()].map(([rowLabel, seats]) => ({
      rowLabel,
      seats: seats.sort((a, b) => a.seatNumber - b.seatNumber),
    }));
  }, [ticketTypeState.ticketType]);

  const totalAmount = selectedSeats.reduce(
    (total) => total + Number(ticketTypeState.ticketType?.price ?? 0),
    0,
  );

  useEffect(() => {
    void dispatch(loadTicketTypeDetail({ ticketTypeId }));

    return () => {
      dispatch(resetTicketTypeState());
    };
  }, [dispatch, ticketTypeId]);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    dispatch(hydrateCustomerForm({ name: authUser.fullName, email: authUser.email }));
  }, [authUser, dispatch]);

  useInventoryRealtime({
    onFallbackRefresh: () => void dispatch(loadTicketTypeDetail({ ticketTypeId, isRefresh: true })),
    onInventoryUpdated: (payload: InventoryUpdatedEvent) => {
      if (payload.ticketTypes.some((ticket) => ticket.id === ticketTypeId)) {
        void dispatch(loadTicketTypeDetail({ ticketTypeId, isRefresh: true }));
      }
    },
  });

  function toggleSeat(seatId: string) {
    dispatch(toggleSeatSelection(seatId));
  }

  function openCustomerInfo() {
    dispatch(
      openCustomerModal({
        name: authUser?.fullName ?? ticketTypeState.customerForm.name,
        email: authUser?.email ?? ticketTypeState.customerForm.email,
      }),
    );
  }

  function closeCustomerInfo() {
    dispatch(closeCustomerModal());
  }

  function updateCustomer(field: keyof CustomerForm, value: string) {
    dispatch(updateCustomerField({ field, value }));
  }

  async function submitCustomerForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { customerForm, selectedSeatIds, ticketType } = ticketTypeState;

    if (!ticketType || selectedSeatIds.length === 0) {
      return;
    }

    if (!customerForm.name.trim() || !customerForm.email.trim() || !customerForm.phone.trim()) {
      dispatch(setTicketTypeError('Vui lòng nhập đủ tên, email và số điện thoại.'));
      return;
    }

    try {
      const reservation = await dispatch(
        holdTicketTypeSeats({
          ticketTypeId: ticketType.id,
          userId: authUser?.id ?? guestUserId,
          customer: customerForm,
          seatIds: selectedSeatIds,
        }),
      ).unwrap();

      router.push(`/booking/${reservation.id}`);
    } catch {
      void dispatch(loadTicketTypeDetail({ ticketTypeId, isRefresh: true }));
    }
  }

  return {
    ...ticketTypeState,
    authUser,
    closeCustomerInfo,
    openCustomerInfo,
    rows,
    selectedSeats,
    submitCustomerForm,
    toggleSeat,
    totalAmount,
    updateCustomer,
  };
}

function getGuestUserId() {
  if (typeof window === 'undefined') {
    return 'guest';
  }

  const existing = window.localStorage.getItem('mini-ticketbox-user-id');
  if (existing) {
    return existing;
  }

  const generated = `guest-${crypto.randomUUID()}`;
  window.localStorage.setItem('mini-ticketbox-user-id', generated);
  return generated;
}
