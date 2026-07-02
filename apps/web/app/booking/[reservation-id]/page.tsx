import { AppShell } from '../../../components/app-shell';
import { ReservationCheckout } from '../../../features/booking/reservation-checkout';

type PageProps = {
  params: Promise<{
    'reservation-id': string;
  }>;
};

export default async function ReservationPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <AppShell>
      <ReservationCheckout reservationId={resolvedParams['reservation-id']} />
    </AppShell>
  );
}
