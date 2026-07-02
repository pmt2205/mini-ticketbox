'use client';

import { CustomerInfoModal } from './components/customer-info-modal';
import { SeatGrid } from './components/seat-grid';
import { SeatMapHeader } from './components/seat-map-header';
import { SeatMapSkeleton } from './components/seat-map-skeleton';
import { SelectedSeatsSidebar } from './components/selected-seats-sidebar';
import { StageIndicator } from './components/stage-indicator';
import { useTicketTypeSeatMap } from './hooks/use-ticket-type-seat-map';

type TicketTypeSeatMapProps = {
  ticketTypeId: string;
};

export function TicketTypeSeatMap({ ticketTypeId }: TicketTypeSeatMapProps) {
  const {
    authUser,
    closeCustomerInfo,
    customerForm,
    customerModalOpen,
    errorMessage,
    holding,
    loading,
    openCustomerInfo,
    rows,
    selectedSeatIds,
    selectedSeats,
    submitCustomerForm,
    ticketType,
    toggleSeat,
    totalAmount,
    updateCustomer,
  } = useTicketTypeSeatMap(ticketTypeId);

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#090a0f] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute left-[5%] top-[10%] -z-10 h-72 w-72 rounded-full bg-indigo-600/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[5%] -z-10 h-72 w-72 rounded-full bg-purple-600/10 blur-[80px]" />

      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-white/10 bg-[#12141c]/60 p-6 shadow-2xl backdrop-blur-md">
          <SeatMapHeader ticketType={ticketType} />

          {errorMessage ? <div className="alert alert-danger mt-6">{errorMessage}</div> : null}

          <StageIndicator />

          <div className="mt-10 overflow-x-auto pb-4">
            {loading ? (
              <SeatMapSkeleton />
            ) : (
              <SeatGrid
                holding={holding}
                rows={rows}
                selectedSeatIds={selectedSeatIds}
                onToggleSeat={toggleSeat}
              />
            )}
          </div>
        </div>

        <SelectedSeatsSidebar
          holding={holding}
          selectedSeatIds={selectedSeatIds}
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          onOpenCustomerInfo={openCustomerInfo}
        />
      </section>

      <CustomerInfoModal
        authUser={authUser}
        customerForm={customerForm}
        holding={holding}
        open={customerModalOpen}
        selectedSeatCount={selectedSeats.length}
        totalAmount={totalAmount}
        onClose={closeCustomerInfo}
        onSubmit={submitCustomerForm}
        onUpdateCustomer={updateCustomer}
      />
    </main>
  );
}
