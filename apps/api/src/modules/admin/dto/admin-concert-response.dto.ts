export type AdminConcertResponseDto = {
  name: string;
  venue: string;
  totalCapacity: number;
  holdTtlSeconds: number;
  status: 'ACTIVE' | 'SOLD_OUT';
};
