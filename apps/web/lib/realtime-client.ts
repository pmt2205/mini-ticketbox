'use client';

import { io, type Socket } from 'socket.io-client';
import type { TicketType } from '../types/ticket';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';

export type InventoryUpdatedEvent = {
  ticketTypes: TicketType[];
  serverTime: string;
};

type ServerToClientEvents = {
  'inventory.updated': (payload: InventoryUpdatedEvent) => void;
};

let socket: Socket<ServerToClientEvents> | null = null;

export function getRealtimeSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      transports: ['websocket', 'polling'],
    });
  }

  return socket;
}
