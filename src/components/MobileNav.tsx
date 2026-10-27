import React from 'react';
import { AppView } from '../types';

interface MobileNavProps {
  currentView: AppView;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  activeTab,
  setActiveTab,
  pendingCount
}) => {
  if (currentView === 'landing') return null;

  return (
    <nav className="fixed bottom-0 w-full z-50 lg:hidden bg-white border-t border-slate-200 shadow-lg flex justify-around items-center h-16 px-2">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'dashboard'
            ? 'bg-blue-50 text-[#0040e0] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="material-symbols-outlined text-xl">home</span>
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      <button
        onClick={() => setActiveTab('events')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'events'
            ? 'bg-blue-50 text-[#0040e0] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="material-symbols-outlined text-xl">event_note</span>
        <span className="text-[10px] font-semibold">Events</span>
      </button>

      <button
        onClick={() => setActiveTab('applications')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          activeTab === 'applications'
            ? 'bg-blue-50 text-[#0040e0] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="material-symbols-outlined text-xl">description</span>
        <span className="text-[10px] font-semibold">Apps</span>
        {pendingCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        )}
      </button>

      <button
        onClick={() => setActiveTab('sponsorships')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          activeTab === 'sponsorships'
            ? 'bg-blue-50 text-[#0040e0] font-bold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="material-symbols-outlined text-xl">payments</span>
        <span className="text-[10px] font-semibold">Sponsors</span>
      </button>
    </nav>
  );
};
