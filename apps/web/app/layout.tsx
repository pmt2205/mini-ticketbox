import type { ReactNode } from 'react';
import { ReduxProvider } from '../store/redux-provider';
import './globals.css';

export const metadata = {
  title: 'Mini Ticketbox',
  description: 'Concert ticket reservation demo',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
