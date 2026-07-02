'use client';

import { useState } from 'react';
import { AuthRequired } from '../auth/auth-required';
import { ActiveHoldsTable } from './components/active-holds-table';
import { AdminTabs, adminTabConfig } from './components/admin-tabs';
import { BuyersTable } from './components/buyers-table';
import { ConcertPanel } from './components/concert-panel';
import { StatsGrid } from './components/stats-grid';
import { TicketManagement, TicketSummaryTable } from './components/ticket-management';
import { UsersTable } from './components/users-table';
import { useAdminDashboard } from './hooks/use-admin-dashboard';

export function AdminDashboard() {
  const {
    activeTab,
    activeReservations,
    activeHoldQuantity,
    authUser,
    cancellingId,
    cancelReservation,
    concert,
    error,
    loading,
    now,
    purchases,
    selectTab,
    stats,
    ticketDetails,
    users,
  } = useAdminDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthRequired>
      {authUser && authUser.role !== 'ADMIN' ? (
        <div className="grid min-h-[calc(100vh-64px)] place-items-center bg-[#090a0f] px-5 py-16">
          <section className="w-[min(480px,100%)] rounded-2xl border border-white/10 bg-[#12141c]/70 p-8 shadow-2xl backdrop-blur-md">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Chỉ dành cho admin
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white">
              Bạn không có quyền truy cập
            </h1>
            <p className="text-sm font-medium leading-relaxed text-slate-400">
              Hãy đăng nhập bằng tài khoản admin để xem khu vực quản trị.
            </p>
          </section>
        </div>
      ) : authUser ? (
        <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#090a0f] lg:flex-row">
          <div className="flex items-center justify-between border-b border-white/5 bg-[#0d0e12]/60 px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2">
              <button
                aria-label="Mở menu admin"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-white"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-sm font-extrabold text-white">Bảng quản trị</span>
            </div>
            <div className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase text-indigo-400">
              {adminTabConfig[activeTab].label}
            </div>
          </div>

          <AdminTabs
            activeTab={activeTab}
            counts={{
              buyers: purchases.length,
              holds: activeReservations.length,
              users: users.length,
            }}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            onSelectTab={(tab) => {
              selectTab(tab);
              setMobileMenuOpen(false);
            }}
          />

          <main className="min-w-0 flex-1 overflow-y-auto px-5 py-8 lg:px-8">
            <div className="mb-6 border-b border-white/5 pb-6">
              <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Bảng quản trị</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
                {adminTabConfig[activeTab].label}
              </h1>
            </div>

            {error ? <div className="alert alert-danger mb-6">{error}</div> : null}

            {activeTab === 'overview' ? (
              <>
                <StatsGrid stats={stats} activeHoldQuantity={activeHoldQuantity} />
                <TicketSummaryTable loading={loading} tickets={ticketDetails} />
              </>
            ) : null}

            {activeTab === 'holds' ? (
              <ActiveHoldsTable
                activeReservations={activeReservations}
                cancellingId={cancellingId}
                loading={loading}
                now={now}
                onCancel={cancelReservation}
              />
            ) : null}

            {activeTab === 'users' ? <UsersTable loading={loading} users={users} /> : null}
            {activeTab === 'buyers' ? <BuyersTable loading={loading} purchases={purchases} /> : null}
            {activeTab === 'tickets' ? <TicketManagement loading={loading} tickets={ticketDetails} /> : null}
            {activeTab === 'concert' ? <ConcertPanel concert={concert} loading={loading} stats={stats} /> : null}
          </main>
        </div>
      ) : null}
    </AuthRequired>
  );
}
