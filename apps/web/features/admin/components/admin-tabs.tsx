import type { ReactNode } from 'react';
import type { AdminTab } from '../store/admin-slice';

type AdminTabConfig = {
  label: string;
  icon: (className?: string) => ReactNode;
};

export const adminTabConfig: Record<AdminTab, AdminTabConfig> = {
  overview: {
    label: 'Tổng quan',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  holds: {
    label: 'Giữ vé',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  users: {
    label: 'Người dùng',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  buyers: {
    label: 'Khách mua',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  tickets: {
    label: 'Quản lý vé',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M15 5v14M5 5h14a2 2 0 012 2v3a2 2 0 110 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 110-4V7a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  concert: {
    label: 'Concert',
    icon: (className) => (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zM9 10l12-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

type AdminTabsProps = {
  activeTab: AdminTab;
  counts: Partial<Record<AdminTab, number>>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectTab: (tab: AdminTab) => void;
};

export function AdminTabs({
  activeTab,
  counts,
  mobileOpen,
  onCloseMobile,
  onSelectTab,
}: AdminTabsProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          aria-label="Đóng menu admin"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          type="button"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-white/5 bg-[#0b0c10]/95 p-5 text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 space-y-1">
          {(Object.keys(adminTabConfig) as AdminTab[]).map((tabId) => {
            const config = adminTabConfig[tabId];
            const isActive = activeTab === tabId;
            const count = counts[tabId];

            return (
              <button
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                }`}
                key={tabId}
                type="button"
                onClick={() => onSelectTab(tabId)}
              >
                <span className="flex items-center gap-3">
                  {config.icon(`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`)}
                  <span>{config.label}</span>
                </span>
                {count ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{count}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
