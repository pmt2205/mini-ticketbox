import type { ReactNode } from 'react';
import { AdminRouteGuard } from './admin-route-guard';
import { SiteHeader } from './site-header';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090a0f] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow-1" aria-hidden="true" />
      <div className="ambient-glow-2" aria-hidden="true" />
      <div className="ambient-glow-3" aria-hidden="true" />

      <AdminRouteGuard />
      <SiteHeader />
      {children}
    </div>
  );
}
