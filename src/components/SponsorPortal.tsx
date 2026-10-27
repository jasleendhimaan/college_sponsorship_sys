import React from 'react';
import { CampusEvent, EventStall, SponsorshipApplication } from '../types';

interface SponsorPortalProps {
  events: CampusEvent[];
  mySponsorships: SponsorshipApplication[];
  eventStalls: Record<string, EventStall[]>;
  onOpenSponsor: (event: CampusEvent) => void;
  onOpenEventDetail: (event: CampusEvent) => void;
  onDownloadReport: () => void;
}

const formatInr = (value: number) =>
  `₹${Number(value ?? 0).toLocaleString('en-IN')}`;

export const SponsorPortal: React.FC<SponsorPortalProps> = ({
  events,
  mySponsorships,
  eventStalls,
  onOpenSponsor,
  onOpenEventDetail,
  onDownloadReport,
}) => {
  const totalCommitted = mySponsorships.reduce(
    (sum, app) => sum + Number(app.amount ?? 0),
    0,
  );

  const pendingCount = mySponsorships.filter(
    (app) => app.status === 'Pending',
  ).length;

  const featuredEvents = events.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      <section className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#0040e0]/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0040e0] mb-3">
              Sponsor Portal
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Your sponsorship pipeline
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Select a sponsorship package and reserve a specific event stall.
              Once a stall is reserved, another sponsor cannot request the same stall.
            </p>
          </div>
          <button
            onClick={onDownloadReport}
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-[#0040e0] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#2e5bff] hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">download</span>
            Download ROI Report
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Total Committed</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{formatInr(totalCommitted)}</h3>
          <p className="mt-3 text-xs text-emerald-600 font-bold">Across active campus events</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Pending Proposals</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{pendingCount}</h3>
          <p className="mt-3 text-xs text-amber-600 font-bold">Awaiting organizer review</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Featured Events</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{featuredEvents.length}</h3>
          <p className="mt-3 text-xs text-sky-600 font-bold">New opportunities to support</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Featured Campus Events</h3>
          <span className="text-xs text-slate-500 font-semibold">{events.length} live listings</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => {
            const stalls = eventStalls[String(event.id)] ?? [];
            const availableCount = stalls.filter((stall) => !stall.reserved).length;

            return (
              <div key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                <div className="h-40 relative overflow-hidden bg-slate-800">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-90" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                    {event.category}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{event.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{event.college} • {event.dateRange}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Goal Progress</span>
                      <span className="text-[#0040e0]">{event.sponsorshipGoalMet}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0040e0] h-full rounded-full transition-all duration-700" style={{ width: `${event.sponsorshipGoalMet}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs">Starting from</span>
                      <span className="font-extrabold text-[#0040e0]">
                        {event.tiers.length > 0 ? formatInr(event.tiers[0].price) : 'N/A'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-xs">Stalls available</span>
                      <span className={`font-extrabold ${availableCount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {availableCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => onOpenEventDetail(event)} className="flex-1 px-3 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenSponsor(event)}
                      disabled={availableCount === 0}
                      className="flex-1 px-3 py-2.5 bg-[#0040e0] text-white rounded-xl font-bold text-sm hover:bg-[#2e5bff] transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {availableCount === 0 ? 'No Stalls' : 'Sponsor & Select Stall'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">My Sponsorships</h3>
        </div>

        {mySponsorships.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">You have not submitted any sponsorship proposals yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">Event</th>
                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">Package</th>
                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">Requested Stall</th>
                  <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-right px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mySponsorships.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{app.eventName}</p>
                      <p className="text-xs text-slate-500">{app.sponsorName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded bg-blue-100 text-[#0040e0] text-[10px] font-bold">{app.packageTier.toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      {app.stallName ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold">
                          <span className="material-symbols-outlined text-sm">storefront</span>
                          {app.stallName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Not selected</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'Approved' || app.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-[#0040e0]">{formatInr(app.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default SponsorPortal;
