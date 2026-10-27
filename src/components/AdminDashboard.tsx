import React, { useState } from 'react';
import { SponsorshipApplication, Milestone } from '../types';

interface AdminDashboardProps {
  applications: SponsorshipApplication[];
  milestones: Milestone[];
  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;
  onOpenCreateEvent: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  milestones,
  onApproveApplication,
  onRejectApplication,
  onOpenCreateEvent
}) => {
  const [chartRange, setChartRange] = useState<'6m' | 'yearly'>('yearly');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuAppId, setActiveMenuAppId] = useState<string | null>(null);

  // Filter applications for table
  const filteredApps = applications.filter((app) =>
    app.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Banner Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-xs text-slate-500">Overview of system revenue, campus events, and sponsor approvals</p>
        </div>
        <button
          onClick={onOpenCreateEvent}
          className="flex items-center gap-2 bg-[#0040e0] text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#2e5bff] shadow-sm transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Create New Campus Event
        </button>
      </div>

      {/* Summary Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Total Revenue</span>
            <span className="material-symbols-outlined text-[#00677f] bg-cyan-50 p-2 rounded-xl">payments</span>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">₹124,000</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-emerald-600 text-xs font-bold">+12.5%</span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Active Events</span>
            <span className="material-symbols-outlined text-[#0040e0] bg-blue-50 p-2 rounded-xl">event_available</span>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">48</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#0040e0] text-xs font-bold">6 ongoing</span>
              <span className="text-slate-500 text-xs">today</span>
            </div>
          </div>
        </div>

        {/* Pending Sponsorships */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Pending Sponsorships</span>
            <span className="material-symbols-outlined text-[#993100] bg-orange-50 p-2 rounded-xl">pending_actions</span>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {applications.filter((a) => a.status === 'Pending').length}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#993100] text-xs font-bold">Action required</span>
              <span className="text-slate-500 text-xs">soon</span>
            </div>
          </div>
        </div>

        {/* Total Sponsors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Total Sponsors</span>
            <span className="material-symbols-outlined text-[#00677f] bg-cyan-50 p-2 rounded-xl">corporate_fare</span>
          </div>
          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-slate-900">156</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#00677f] text-xs font-bold">+4 new</span>
              <span className="text-slate-500 text-xs">this week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Milestones Row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Monthly Sponsorship Revenue</h3>
              <p className="text-xs text-slate-500">Revenue trajectory across campus events</p>
            </div>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setChartRange('6m')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  chartRange === '6m' ? 'bg-[#0040e0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                6 Months
              </button>
              <button
                onClick={() => setChartRange('yearly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  chartRange === 'yearly' ? 'bg-[#0040e0] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 px-2 pt-4">
            {[
              { month: 'Jan', val: 45, label: '₹45K' },
              { month: 'Feb', val: 60, label: '₹60K' },
              { month: 'Mar', val: 55, label: '₹55K' },
              { month: 'Apr', val: 80, label: '₹80K' },
              { month: 'May', val: 70, label: '₹70K' },
              { month: 'Jun', val: 95, label: '₹95K' },
              { month: 'Jul', val: 65, label: '₹65K' }
            ].map((bar, idx) => (
              <div key={idx} className="group relative flex flex-col items-center flex-1 h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none z-10">
                  {bar.label}
                </div>
                <div
                  className="w-full bg-blue-100 group-hover:bg-[#0040e0] rounded-t-xl transition-all duration-300"
                  style={{ height: `${bar.val}%` }}
                />
                <span className="mt-3 text-xs font-semibold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-4">
              Upcoming Milestones
            </h3>
            <div className="space-y-4">
              {milestones.map((m) => (
                <div key={m.id} className="flex gap-4 items-start p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined ${m.iconColor}`}>{m.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{m.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 border border-[#0040e0] text-[#0040e0] font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors">
            View All Schedule
          </button>
        </div>
      </section>

      {/* Recent Requests Table */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Recent Requests</h3>
            <p className="text-xs text-slate-500">Applications submitted by corporate sponsors</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-[#0040e0] focus:bg-white w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Sponsor Name</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0040e0] flex items-center justify-center font-bold text-xs">
                        {app.sponsorInitials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{app.sponsorName}</span>
                        <span className="text-[10px] text-slate-400">{app.packageTier}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{app.eventName}</td>
                  <td className="px-6 py-4 font-bold font-code text-slate-900">₹{app.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'Approved'
                          ? 'status-approved'
                          : app.status === 'Rejected'
                          ? 'status-rejected'
                          : app.status === 'Paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'status-pending'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    {app.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onApproveApplication(app.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectApplication(app.id)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-lg font-bold text-[10px] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
