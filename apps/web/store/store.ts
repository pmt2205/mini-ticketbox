import { configureStore } from '@reduxjs/toolkit';
import { adminReducer } from '../features/admin/store/admin-slice';
import { authReducer } from '../features/auth/store/auth-slice';
import { bookingReducer } from '../features/booking/store/booking-slice';
import { eventReducer } from '../features/event/store/event-slice';
import { historyReducer } from '../features/history/store/history-slice';
import { ticketTypeReducer } from '../features/ticket-type/store/ticket-type-slice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    booking: bookingReducer,
    event: eventReducer,
    history: historyReducer,
    ticketType: ticketTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
