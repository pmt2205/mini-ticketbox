'use client';

import { CheckoutActions } from './components/checkout-actions';
import { CheckoutStatus } from './components/checkout-status';
import { CountdownSurface } from './components/countdown-surface';
import { PaymentModal } from './components/payment-modal';
import { ReservationSummary } from './components/reservation-summary';
import { useReservationCheckout } from './hooks/use-reservation-checkout';

type ReservationCheckoutProps = {
  reservationId: string;
};

export function ReservationCheckout({ reservationId }: ReservationCheckoutProps) {
  const checkout = useReservationCheckout(reservationId);

  return (
    <main className="checkout-page relative min-h-[calc(100vh-64px)] px-4 py-16">
      <div className="pointer-events-none absolute left-[5%] top-[10%] -z-10 h-80 w-80 rounded-full bg-indigo-600/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[5%] -z-10 h-80 w-80 rounded-full bg-cyan-600/10 blur-[90px]" />

      <section className="checkout-panel w-full max-w-xl rounded-2xl border border-white/10 bg-[#12141c]/70 p-8 shadow-2xl backdrop-blur-md">
        <CheckoutStatus
          displayStatusText={checkout.displayStatusText}
          errorMessage={checkout.errorMessage}
          isExpired={checkout.isExpired}
          loading={checkout.loading}
          pageTitle={checkout.pageTitle}
          paymentMessage={checkout.paymentMessage}
          statusTone={checkout.statusTone}
        />

        <CountdownSurface
          isExpired={checkout.isExpired}
          isPaid={checkout.isPaid}
          remainingSeconds={checkout.remainingSeconds}
        />

        <ReservationSummary
          reservation={checkout.reservation}
          selectedTicketType={checkout.selectedTicketType}
          totalAmount={checkout.totalAmount}
        />

        <CheckoutActions
          canPay={checkout.canPay}
          cancelling={checkout.cancelling}
          isExpired={checkout.isExpired}
          isPaid={checkout.isPaid}
          paying={checkout.paying}
          reservationExists={Boolean(checkout.reservation)}
          onCancel={() => void checkout.cancelReservation()}
          onOpenPayment={checkout.openPayment}
        />
      </section>

      <PaymentModal
        authUser={checkout.authUser}
        open={checkout.paymentModalOpen}
        paying={checkout.paying}
        paymentResult={checkout.paymentResult}
        reservation={checkout.reservation}
        selectedTicketType={checkout.selectedTicketType}
        totalAmount={checkout.totalAmount}
        onClose={checkout.closePayment}
        onSimulatePayment={checkout.simulatePayment}
      />
    </main>
  );
}
