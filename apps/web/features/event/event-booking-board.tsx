'use client';

import { EventHero } from './components/event-hero';
import { EventSectionHeading } from './components/event-section-heading';
import { TicketTypeGrid } from './components/ticket-type-grid';
import { TicketTypeGridSkeleton } from './components/ticket-type-grid-skeleton';
import { useEventBookingBoard } from './hooks/use-event-booking-board';

export function EventBookingBoard() {
  const {
    errorMessage,
    loading,
    refreshing,
    refreshTicketTypes,
    ticketTypes,
    totalStats,
  } = useEventBookingBoard();

  return (
    <main className="relative min-h-[calc(100vh-64px)] pb-12">
      <EventHero stats={totalStats} />

      <section className="content-band">
        <EventSectionHeading refreshing={refreshing} onRefresh={refreshTicketTypes} />

        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null}

        {loading ? <TicketTypeGridSkeleton /> : <TicketTypeGrid ticketTypes={ticketTypes} />}
      </section>
    </main>
  );
}
