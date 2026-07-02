import { AppShell } from '../components/app-shell';
import { EventBookingBoard } from '../features/event/event-booking-board';

export default function HomePage() {
  return (
    <AppShell>
      <EventBookingBoard />
    </AppShell>
  );
}
