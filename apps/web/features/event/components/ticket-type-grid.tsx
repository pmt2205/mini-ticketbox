import type { TicketType } from '../../../types/ticket';
import { TicketTypeCard } from './ticket-type-card';

type TicketTypeGridProps = {
  ticketTypes: TicketType[];
};

export function TicketTypeGrid({ ticketTypes }: TicketTypeGridProps) {
  return (
    <div className="ticket-grid">
      {ticketTypes.map((ticketType) => (
        <TicketTypeCard key={ticketType.id} ticketType={ticketType} />
      ))}
    </div>
  );
}
