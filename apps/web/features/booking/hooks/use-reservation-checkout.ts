'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  cancelBookingReservation,
  closePaymentModal,
  loadBookingReservation,
  openPaymentModal,
  resetBookingState,
  simulateBookingPayment,
} from '../store/booking-slice';
import type { PaymentMode } from '../types';

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

export function useReservationCheckout(reservationId: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const booking = useAppSelector((state) => state.booking);
  const [now, setNow] = useState(() => Date.now());

  const selectedTicketType = useMemo(() => {
    if (!booking.reservation || !booking.ticketTypes.length) {
      return null;
    }

    return (
      booking.ticketTypes.find((ticketType) => ticketType.id === booking.reservation?.ticketTypeId) ??
      null
    );
  }, [booking.reservation, booking.ticketTypes]);

  const totalAmount = useMemo(() => {
    if (!booking.reservation || !selectedTicketType) {
      return 0;
    }

    return Number(selectedTicketType.price) * booking.reservation.quantity;
  }, [booking.reservation, selectedTicketType]);

  const remainingSeconds = useMemo(() => {
    if (!booking.reservation) {
      return 0;
    }

    const serverSyncedNow = now + booking.serverOffsetMs;
    return Math.ceil((new Date(booking.reservation.expiresAt).getTime() - serverSyncedNow) / 1000);
  }, [booking.reservation, booking.serverOffsetMs, now]);

  const isExpired =
    remainingSeconds <= 0 ||
    booking.reservation?.status === 'EXPIRED' ||
    booking.reservation?.status === 'CANCELLED';
  const isPaid = booking.reservation?.status === 'PAID';
  const canPay = Boolean(booking.reservation) && !isExpired && !isPaid && !booking.paying;

  const statusTone = useMemo<StatusTone>(() => {
    if (!booking.reservation) return 'neutral';
    if (isPaid) return 'success';
    if (isExpired) return 'danger';
    return 'warning';
  }, [booking.reservation, isExpired, isPaid]);

  const displayStatusText = useMemo(() => {
    if (!booking.reservation) return 'Đang tải';
    if (isPaid) return 'Đã thanh toán';
    if (isExpired) return 'Hết hạn / Đã hủy';
    return 'Đang giữ chỗ';
  }, [booking.reservation, isExpired, isPaid]);

  const pageTitle = booking.loading
    ? 'Đang truy vấn thông tin...'
    : isPaid
      ? 'Đặt vé thành công'
      : isExpired
        ? 'Giao dịch hết hạn'
        : 'Chi tiết giữ chỗ';

  useEffect(() => {
    void dispatch(loadBookingReservation(reservationId));

    return () => {
      dispatch(resetBookingState());
    };
  }, [dispatch, reservationId]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  async function cancelReservation() {
    try {
      await dispatch(cancelBookingReservation(reservationId)).unwrap();
      router.push('/');
    } catch {
      // Error text is stored in the booking slice.
    }
  }

  function openPayment() {
    dispatch(openPaymentModal());
  }

  function closePayment() {
    dispatch(closePaymentModal());
  }

  function simulatePayment(mode: PaymentMode) {
    if (!booking.reservation || !canPay) {
      return;
    }

    void dispatch(simulateBookingPayment({ mode, reservation: booking.reservation }));
  }

  return {
    ...booking,
    authUser,
    canPay,
    closePayment,
    displayStatusText,
    isExpired,
    isPaid,
    openPayment,
    pageTitle,
    remainingSeconds,
    selectedTicketType,
    simulatePayment,
    statusTone,
    totalAmount,
    cancelReservation,
  };
}
