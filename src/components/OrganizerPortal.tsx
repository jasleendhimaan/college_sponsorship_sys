import React from 'react';
import { CampusEvent, SponsorshipApplication } from '../types';

interface OrganizerPortalProps {
  events: CampusEvent[];
  applications: SponsorshipApplication[];
  onOpenCreateEvent: () => void;
  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;
  onOpenEventDetail: (event: CampusEvent) => void;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({
  events,
  applications,
  onOpenCreateEvent,
  onApproveApplication,
  onRejectApplication,
  onOpenEventDetail
}) => {
  const pendingApps = applications.filter((app) => app.status === 'Pending').slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Hero / Quick Actions */}
      <section className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#0040e0]/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Welcome back, John!</h2>
            <p className="text-slate-600 text-sm max-w-xl">
              You have <span className="font-bold text-[#0040e0]">3 active events</span> and{' '}
              <span className="font-bold text-[#00677f]">
                {applications.filter((a) => a.status === 'Pending').length} pending applications
              </span>{' '}
              that require your attention today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center gap-2 bg-[#0040e0] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#2e5bff] hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Create New Event
            </button>
            <button className="flex items-center gap-2 border border-[#0040e0] text-[#0040e0] px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95">
              <span className="material-symbols-outlined">package_2</span>
              Manage Packages
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* My Active Events (2/3 width) */}
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">My Active Events</h3>
            <button className="text-[#0040e0] font-bold text-xs flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => onOpenEventDetail(event)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 relative overflow-hidden bg-slate-800">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-xs">
                      {event.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0040e0] transition-colors">
                      {event.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">calendar_month</span>
                        <span>{event.dateRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-500">Sponsorship Goal Met</span>
                    <span className="text-[#0040e0]">{event.sponsorshipGoalMet}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0040e0] h-full rounded-full transition-all duration-700"
                      style={{ width: `${event.sponsorshipGoalMet}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Applications (1/3 width) */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Latest Applications</h3>
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-xs">
            {pendingApps.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No pending applications currently requiring review.
              </div>
            ) : (
              pendingApps.map((app) => (
                <div key={app.id} className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0040e0] flex items-center justify-center font-bold text-xs shrink-0">
                    <span className="material-symbols-outlined text-xl">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{app.sponsorName}</p>
                    <p className="text-xs text-slate-500 mb-3 truncate">
                      {app.packageTier} (₹{app.amount.toLocaleString('en-IN')})
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveApplication(app.id)}
                        className="flex-1 py-1.5 bg-[#0040e0] text-white rounded-lg text-xs font-bold hover:bg-[#2e5bff] transition-colors shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectApplication(app.id)}
                        className="flex-1 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Bento Statistics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mb-2">Total Revenue</span>
          <span className="text-3xl font-extrabold text-[#0040e0]">₹124,500</span>
          <div className="mt-4 flex items-center text-emerald-600 gap-1 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            12% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mb-2">Active Sponsors</span>
          <span className="text-3xl font-extrabold text-slate-900">42</span>
          <div className="mt-4 flex items-center text-emerald-600 gap-1 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">person_add</span>
            5 new this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mb-2">Avg. Conversion</span>
          <span className="text-3xl font-extrabold text-slate-900">68%</span>
          <div className="mt-4 flex items-center text-amber-600 gap-1 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">equalizer</span>
            Stable performance
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mb-2">Engagement Score</span>
          <span className="text-3xl font-extrabold text-slate-900">9.2</span>
          <div className="mt-4 flex items-center text-emerald-600 gap-1 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">star</span>
            Excellent feedback
          </div>
        </div>
      </section>
    </div>
  );
};
