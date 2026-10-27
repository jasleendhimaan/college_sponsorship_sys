import React from 'react';
import {
  CampusEvent,
  SponsorshipApplication,
  Milestone,
} from '../types';

interface PortalTabContentProps {
  activeTab: string;
  currentView: 'admin' | 'organizer' | 'sponsor';

  events: CampusEvent[];
  applications: SponsorshipApplication[];
  milestones: Milestone[];

  onOpenCreateEvent: () => void;
  onOpenEventDetail: (event: CampusEvent) => void;
  onOpenSponsor: (event: CampusEvent) => void;

  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;

  onDownloadReport: () => void;
}

export const PortalTabContent: React.FC<
  PortalTabContentProps
> = ({
  activeTab,
  currentView,
  events,
  applications,
  milestones,
  onOpenCreateEvent,
  onOpenEventDetail,
  onOpenSponsor,
  onApproveApplication,
  onRejectApplication,
  onDownloadReport,
}) => {
  /* ==================================================
     EVENTS
  ================================================== */

  if (activeTab === 'events') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Events
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage campus events and sponsorship opportunities.
            </p>
          </div>

          {(currentView === 'admin' ||
            currentView === 'organizer') && (
            <button
              onClick={onOpenCreateEvent}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-[#0040e0]
                text-white
                px-5
                py-3
                rounded-xl
                font-bold
                text-sm
                hover:bg-[#2e5bff]
                transition
              "
            >
              <span className="material-symbols-outlined">
                add_circle
              </span>

              Create Event
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">
              event_busy
            </span>

            <h3 className="mt-4 font-bold text-slate-800">
              No events found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              There are currently no campus events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-lg
                  transition
                "
              >
                <div className="h-44 bg-slate-200 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-slate-400">
                        event
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0040e0] bg-blue-50 px-2 py-1 rounded">
                      {event.category}
                    </span>

                    <span className="text-[10px] font-bold text-emerald-600">
                      {event.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-3">
                    {event.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        school
                      </span>

                      {event.college}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        calendar_month
                      </span>

                      {event.dateRange}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">
                        location_on
                      </span>

                      {event.location}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Sponsorship Progress</span>

                      <span className="text-[#0040e0]">
                        {event.sponsorshipGoalMet}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0040e0] rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            event.sponsorshipGoalMet
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() =>
                        onOpenEventDetail(event)
                      }
                      className="
                        flex-1
                        border
                        border-slate-200
                        rounded-xl
                        py-2.5
                        text-xs
                        font-bold
                        text-slate-700
                        hover:bg-slate-50
                      "
                    >
                      View Details
                    </button>

                    {currentView === 'sponsor' && (
                      <button
                        onClick={() =>
                          onOpenSponsor(event)
                        }
                        className="
                          flex-1
                          bg-[#0040e0]
                          text-white
                          rounded-xl
                          py-2.5
                          text-xs
                          font-bold
                          hover:bg-[#2e5bff]
                        "
                      >
                        Sponsor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ==================================================
     APPLICATIONS
  ================================================== */

  if (activeTab === 'applications') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Applications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review and manage sponsorship applications.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300">
                assignment
              </span>

              <p className="mt-4 text-sm text-slate-500">
                No sponsorship applications found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Sponsor
                    </th>

                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Event
                    </th>

                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Package
                    </th>

                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-[10px] uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-slate-900">
                          {app.sponsorName}
                        </div>

                        <div className="text-xs text-slate-500">
                          {app.contactEmail}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {app.eventName}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {app.packageTier}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        ₹{app.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : app.status === 'Rejected'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }
                          `}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {app.status === 'Pending' &&
                          currentView !== 'sponsor' && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  onApproveApplication(
                                    app.id
                                  )
                                }
                                className="px-3 py-2 rounded-lg bg-[#0040e0] text-white text-xs font-bold"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  onRejectApplication(
                                    app.id
                                  )
                                }
                                className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ==================================================
     SPONSORSHIPS
  ================================================== */

  if (activeTab === 'sponsorships') {
    const totalValue = applications.reduce(
      (sum, app) => sum + Number(app.amount || 0),
      0
    );

    const approvedValue = applications
      .filter((app) => app.status === 'Approved')
      .reduce(
        (sum, app) => sum + Number(app.amount || 0),
        0
      );

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Sponsorships
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Overview of sponsorship activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Total Applications
            </p>

            <p className="text-3xl font-extrabold mt-2">
              {applications.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Total Value
            </p>

            <p className="text-3xl font-extrabold mt-2">
              ₹{totalValue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Approved Value
            </p>

            <p className="text-3xl font-extrabold mt-2 text-emerald-600">
              ₹{approvedValue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-5">
            Sponsorship Activity
          </h2>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-sm text-slate-500">
                No sponsorship activity yet.
              </p>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between border border-slate-100 rounded-xl p-4"
                >
                  <div>
                    <p className="font-bold text-sm">
                      {app.sponsorName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {app.eventName} • {app.packageTier}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹{app.amount.toLocaleString('en-IN')}
                    </p>

                    <p className="text-xs text-slate-500">
                      {app.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ==================================================
     ORGANIZERS
  ================================================== */

  if (activeTab === 'organizers') {
    const organizerEvents = events.length;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Organizers
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Organizer activity and event management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Active Events
            </p>

            <p className="text-3xl font-extrabold mt-2">
              {organizerEvents}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Applications
            </p>

            <p className="text-3xl font-extrabold mt-2">
              {applications.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase text-slate-500">
              Pending Reviews
            </p>

            <p className="text-3xl font-extrabold mt-2 text-amber-600">
              {
                applications.filter(
                  (a) => a.status === 'Pending'
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-lg">
              Organizer Events
            </h2>

            {(currentView === 'admin' ||
              currentView === 'organizer') && (
              <button
                onClick={onOpenCreateEvent}
                className="bg-[#0040e0] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Create Event
              </button>
            )}
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  onOpenEventDetail(event)
                }
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-xl
                  border
                  border-slate-100
                  hover:bg-slate-50
                  text-left
                "
              >
                <div>
                  <p className="font-bold text-sm">
                    {event.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    {event.college}
                  </p>
                </div>

                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ==================================================
     SPONSORS
  ================================================== */

  if (activeTab === 'sponsors') {
    const sponsors = Array.from(
      new Map(
        applications.map((app) => [
          app.sponsorName,
          app,
        ])
      ).values()
    );

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Sponsors
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Sponsors participating in campus events.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {sponsors.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300">
                business
              </span>

              <p className="mt-4 text-sm text-slate-500">
                No sponsors found yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sponsors.map((app) => (
                <div
                  key={app.id}
                  className="p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0040e0] flex items-center justify-center font-bold">
                      {app.sponsorInitials}
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        {app.sponsorName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {app.contactEmail}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sm">
                      ₹{app.amount.toLocaleString('en-IN')}
                    </p>

                    <p className="text-xs text-slate-500">
                      {app.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ==================================================
     REPORTS
  ================================================== */

  if (activeTab === 'reports') {
    const total = applications.reduce(
      (sum, app) => sum + Number(app.amount || 0),
      0
    );

    const approved = applications.filter(
      (app) => app.status === 'Approved'
    ).length;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Reports
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Sponsorship performance and activity reports.
            </p>
          </div>

          <button
            onClick={onDownloadReport}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-[#0040e0]
              text-white
              px-5
              py-3
              rounded-xl
              text-sm
              font-bold
            "
          >
            <span className="material-symbols-outlined">
              download
            </span>

            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs uppercase font-bold text-slate-500">
              Total Sponsorship Value
            </p>

            <p className="text-3xl font-extrabold mt-2">
              ₹{total.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs uppercase font-bold text-slate-500">
              Applications
            </p>

            <p className="text-3xl font-extrabold mt-2">
              {applications.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-xs uppercase font-bold text-slate-500">
              Approved
            </p>

            <p className="text-3xl font-extrabold mt-2 text-emerald-600">
              {approved}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
          <h2 className="font-bold text-lg mb-5">
            Report Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Campus Events
              </span>

              <span className="font-bold">
                {events.length}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Total Applications
              </span>

              <span className="font-bold">
                {applications.length}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Pending
              </span>

              <span className="font-bold text-amber-600">
                {
                  applications.filter(
                    (a) => a.status === 'Pending'
                  ).length
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Approved
              </span>

              <span className="font-bold text-emerald-600">
                {approved}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================================================
     SETTINGS
  ================================================== */

  if (activeTab === 'settings') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your portal preferences.
          </p>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg">
              Portal Settings
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current portal
            </p>

            <div className="mt-4 bg-blue-50 text-[#0040e0] px-4 py-3 rounded-xl font-bold text-sm">
              {currentView === 'admin'
                ? 'Administrator'
                : currentView === 'organizer'
                ? 'Organizer'
                : 'Sponsor'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg">
              Notifications
            </h2>

            <label className="flex items-center justify-between mt-5">
              <div>
                <p className="font-semibold text-sm">
                  Application notifications
                </p>

                <p className="text-xs text-slate-500">
                  Receive updates about sponsorship applications.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-[#0040e0]"
              />
            </label>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-bold text-lg">
              Security
            </h2>

            <button
              type="button"
              className="mt-4 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};