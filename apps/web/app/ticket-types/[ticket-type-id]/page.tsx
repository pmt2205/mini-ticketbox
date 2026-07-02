import { AppShell } from '../../../components/app-shell';
import { TicketTypeSeatMap } from '../../../features/ticket-type/ticket-type-seat-map';

type PageProps = {
  params: Promise<{
    'ticket-type-id': string;
  }>;
};

export default async function TicketTypePage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <AppShell>
      <TicketTypeSeatMap ticketTypeId={resolvedParams['ticket-type-id']} />
    </AppShell>
  );
}
