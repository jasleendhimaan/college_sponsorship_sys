import React, { useState } from 'react';
import { AppView } from '../types';
import { LOGO_URL, ADMIN_AVATAR, ORGANIZER_AVATAR } from '../data/initialData';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  pendingApplicationsCount: number;
  onOpenCreateEvent?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  userRole?: 'admin' | 'organizer' | 'sponsor';
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  pendingApplicationsCount,
  onOpenCreateEvent,
  isAuthenticated = false,
  userEmail = '',
  userRole = 'sponsor',
  onLogin,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const viewTitles: Record<AppView, string> = {
    landing: ' ',
    admin: 'Admin Dashboard',
    organizer: 'Organizer Portal',
    sponsor: 'Sponsor Portal'
  };

  const getAvatar = () => {
    if (currentView === 'admin') return ADMIN_AVATAR;
    if (currentView === 'organizer') return ORGANIZER_AVATAR;
    return undefined;
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Brand & View Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewChange('landing')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <img
              src={LOGO_URL}
              alt="PCTE Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-100 shadow-xs"
            />
            <span className="font-extrabold text-xl text-[#0040e0] tracking-tight">PCTE</span>
          </button>

          <span className="text-slate-300 font-light text-lg hidden sm:inline">|</span>

          {/* Current View Indicator */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm sm:text-base">
              {viewTitles[currentView]}
            </span>
          </div>
        </div>

        {/* View Switcher / Role Selector Tabs */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => onViewChange('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'landing'
                ? 'bg-white text-[#0040e0] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Public Site
          </button>
          <button
            onClick={() => onViewChange('admin')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'admin'
                ? 'bg-[#0040e0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onViewChange('organizer')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'organizer'
                ? 'bg-[#0040e0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Organizer Portal
          </button>
          <button
            onClick={() => onViewChange('sponsor')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentView === 'sponsor'
                ? 'bg-[#0040e0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sponsor Portal
          </button>
        </div>

        {/* Mobile View Switcher Dropdown */}
        <div className="flex lg:hidden items-center">
          <select
            value={currentView}
            onChange={(e) => onViewChange(e.target.value as AppView)}
            className="text-xs font-bold text-[#0040e0] bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 focus:ring-0"
          >
            <option value="landing">🌐 Landing</option>
            <option value="admin">📊 Admin</option>
            <option value="organizer">🏫 Organizer</option>
            <option value="sponsor">🤝 Sponsor</option>
          </select>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative text-slate-700"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {pendingApplicationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] bg-blue-50 text-[#0040e0] px-2 py-0.5 rounded font-bold">
                    {pendingApplicationsCount} Action Required
                  </span>
                </div>
                <div className="mt-2 space-y-2.5 max-h-60 overflow-y-auto">
                  <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="font-semibold text-slate-900">Google Cloud applied for Tech Innovators</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Titanium Package (₹25,000) pending approval.</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-900">NextGen Kinetics proposal received</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Platinum tier for Engineering Symposium.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Event CTA for Organizer view */}
          {currentView === 'organizer' && onOpenCreateEvent && (
            <button
              onClick={onOpenCreateEvent}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#0040e0] text-white rounded-xl shadow-xs hover:bg-[#2e5bff] transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Event
            </button>
          )}

          {/* Authentication */}
          {!isAuthenticated ? (
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-xl bg-[#0040e0] text-white text-sm font-bold hover:bg-[#2e5bff] transition-colors"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full border-2 border-blue-200 hover:border-[#0040e0] transition-colors focus:ring-2 focus:ring-[#0040e0]/20 bg-[#0040e0] text-white flex items-center justify-center font-bold text-xs"
                title={userEmail}
              >
                {(userEmail?.[0] || 'U').toUpperCase()}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-xs z-50">
                  <div className="p-2 border-b border-slate-100 mb-2">
                    <p className="font-bold text-slate-900 capitalize">{userRole} account</p>
                    <p className="text-slate-500 text-[11px] truncate">{userEmail}</p>
                  </div>

                  <div className="space-y-1">
                    {userRole === 'admin' && (
                      <button onClick={() => { onViewChange('admin'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium">
                        <span className="material-symbols-outlined text-base">dashboard</span>
                        Admin Dashboard
                      </button>
                    )}
                    {(userRole === 'admin' || userRole === 'organizer') && (
                      <button onClick={() => { onViewChange('organizer'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium">
                        <span className="material-symbols-outlined text-base">school</span>
                        Organizer Portal
                      </button>
                    )}
                    <button onClick={() => { onViewChange('sponsor'); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium">
                      <span className="material-symbols-outlined text-base">payments</span>
                      Sponsor Portal
                    </button>
                    <button onClick={() => { onLogout?.(); setShowProfileMenu(false); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-base">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
