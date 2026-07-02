'use client';

import { HistoryEmptyState } from './components/history-empty-state';
import { HistoryHeader } from './components/history-header';
import { HistoryLoginRequired } from './components/history-login-required';
import { HistorySkeleton } from './components/history-skeleton';
import { HistorySummary } from './components/history-summary';
import { PurchaseHistoryList } from './components/purchase-history-list';
import { usePurchaseHistory } from './hooks/use-purchase-history';

export function PurchaseHistory() {
  const {
    accessToken,
    authUser,
    errorMessage,
    items,
    loading,
    refreshing,
    refreshHistory,
    summary,
  } = usePurchaseHistory();

  if (!authUser || !accessToken) {
    return <HistoryLoginRequired />;
  }

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#090a0f] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute left-[5%] top-[10%] -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[10%] -z-10 h-80 w-80 rounded-full bg-purple-600/10 blur-[90px]" />

      <section className="mx-auto w-full max-w-4xl">
        <HistoryHeader authUser={authUser} refreshing={refreshing} onRefresh={refreshHistory} />

        {errorMessage ? <div className="alert alert-danger mt-6">{errorMessage}</div> : null}

        {!loading && items.length > 0 ? <HistorySummary summary={summary} /> : null}

        {loading ? (
          <HistorySkeleton />
        ) : items.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <PurchaseHistoryList items={items} />
        )}
      </section>
    </main>
  );
}
