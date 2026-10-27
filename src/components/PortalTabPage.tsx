import React from 'react';

import type {
  AppView,
  CampusEvent,
  Milestone,
  SponsorshipApplication,
} from '../types';

interface PortalTabPageProps {
  currentView: AppView;
  activeTab: string;

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

const formatCurrency = (value: number) =>
  `₹${value.toLocaleString('en-IN')}`;

export const PortalTabPage: React.FC<PortalTabPageProps> = ({
  currentView,
  activeTab,
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
  const pendingApplications = applications.filter(
    (app) => app.status === 'Pending',
  );

  /*
   * =====================================================
   * DASHBOARD
   * =====================================================
   */

  if (activeTab === 'dashboard') {
    return null;
  }

  /*
   * =====================================================
   * EVENTS
   * =====================================================
   */

  if (activeTab === 'events') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Events
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Browse and manage campus events.
            </p>
          </div>

          {(currentView === 'admin' ||
            currentView === 'organizer') && (
            <button
              type="button"
              onClick={onOpenCreateEvent}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#0040e0]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                hover:bg-[#2e5bff]
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
          <EmptyState
            icon="event_busy"
            title="No events found"
            description="There are currently no campus events available."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  hover:shadow-md
                  transition-shadow
                "
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="h-44 bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-[#0040e0]">
                      event
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0040e0]">
                      {event.category}
                    </span>

                    <span className="text-[10px] font-semibold text-slate-500">
                      {event.status}
                    </span>
                  </div>

                  <h2 className="font-extrabold text-lg text-slate-900">
                    {event.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {event.college}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-base">
                        calendar_today
                      </span>
                      {event.dateRange}
                    </div>

                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-base">
                        location_on
                      </span>
                      {event.location}
                    </div>

                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-base">
                        groups
                      </span>
                      {event.expectedReach}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenEventDetail(event)
                      }
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-[#0040e0]
                        py-2.5
                        text-xs
                        font-bold
                        text-[#0040e0]
                        hover:bg-blue-50
                      "
                    >
                      View Details
                    </button>

                    {currentView === 'sponsor' && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenSponsor(event)
                        }
                        className="
                          flex-1
                          rounded-xl
                          bg-[#0040e0]
                          py-2.5
                          text-xs
                          font-bold
                          text-white
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

  /*
   * =====================================================
   * SPONSORSHIPS
   * =====================================================
   */

  if (activeTab === 'sponsorships') {
    return (
      <PageContainer
        title={
          currentView === 'sponsor'
            ? 'My Sponsorships'
            : 'Sponsorships'
        }
        subtitle="Track sponsorship activity and commitments."
      >
        {applications.length === 0 ? (
          <EmptyState
            icon="payments"
            title="No sponsorships yet"
            description="Sponsorship records will appear here."
          />
        ) : (
          <ApplicationTable
            applications={applications}
          />
        )}
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * APPLICATIONS
   * =====================================================
   */

  if (activeTab === 'applications') {
    return (
      <PageContainer
        title={
          currentView === 'sponsor'
            ? 'My Applications'
            : 'Applications'
        }
        subtitle="Review and manage sponsorship applications."
      >
        {applications.length === 0 ? (
          <EmptyState
            icon="assignment_turned_in"
            title="No applications"
            description="There are no sponsorship applications to display."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold text-slate-500">
                    Sponsor
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-slate-500">
                    Event
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-slate-500">
                    Package
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-slate-500">
                    Status
                  </th>

                  {(currentView === 'admin' ||
                    currentView === 'organizer') && (
                    <th className="px-5 py-4 text-xs font-bold text-slate-500 text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm text-slate-900">
                        {app.sponsorName}
                      </div>

                      <div className="text-xs text-slate-400">
                        {app.contactEmail}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.eventName}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.packageTier}
                    </td>

                    <td className="px-5 py-4 font-bold text-sm text-slate-900">
                      {formatCurrency(app.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {(currentView === 'admin' ||
                      currentView === 'organizer') && (
                      <td className="px-5 py-4 text-right">
                        {app.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onApproveApplication(
                                  app.id,
                                )
                              }
                              className="
                                rounded-lg
                                bg-emerald-600
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-white
                                hover:bg-emerald-700
                              "
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onRejectApplication(
                                  app.id,
                                )
                              }
                              className="
                                rounded-lg
                                bg-rose-600
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-white
                                hover:bg-rose-700
                              "
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Completed
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * ORGANIZERS
   * =====================================================
   */

  if (activeTab === 'organizers') {
    return (
      <PageContainer
        title="Organizers"
        subtitle="Manage campus event organizers."
      >
        <EmptyState
          icon="group"
          title="Organizer management"
          description="Organizer records can be managed from this section."
        />
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * SPONSORS
   * =====================================================
   */

  if (activeTab === 'sponsors') {
    return (
      <PageContainer
        title="Sponsors"
        subtitle="View corporate sponsors and sponsorship activity."
      >
        {applications.length === 0 ? (
          <EmptyState
            icon="business"
            title="No sponsors found"
            description="Sponsors will appear here once sponsorship applications are submitted."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from(
              new Map(
                applications.map((app) => [
                  app.sponsorName,
                  app,
                ]),
              ).values(),
            ).map((app) => (
              <div
                key={app.sponsorName}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-extrabold text-[#0040e0]">
                    {app.sponsorInitials}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {app.sponsorName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {app.contactEmail || 'No email'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 text-sm text-slate-600">
                  Latest package:{' '}
                  <strong>{app.packageTier}</strong>
                </div>

                <div className="mt-1 text-sm text-slate-600">
                  Amount:{' '}
                  <strong>
                    {formatCurrency(app.amount)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * MILESTONES
   * =====================================================
   */

  if (activeTab === 'milestones') {
    return (
      <PageContainer
        title="Milestones"
        subtitle="Track important sponsorship and event milestones."
      >
        {milestones.length === 0 ? (
          <EmptyState
            icon="flag"
            title="No milestones"
            description="There are currently no milestones to display."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined ${milestone.iconColor}`}
                    >
                      {milestone.icon || 'flag'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {milestone.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * REPORTS
   * =====================================================
   */

  if (activeTab === 'reports') {
    const totalAmount = applications.reduce(
      (sum, app) => sum + app.amount,
      0,
    );

    return (
      <PageContainer
        title="Reports"
        subtitle="Review sponsorship performance and download reports."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            title="Total Events"
            value={String(events.length)}
            icon="event"
          />

          <MetricCard
            title="Applications"
            value={String(applications.length)}
            icon="assignment"
          />

          <MetricCard
            title="Sponsorship Value"
            value={formatCurrency(totalAmount)}
            icon="payments"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-lg text-slate-900">
            Sponsorship Report
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Generate your current sponsorship performance report.
          </p>

          <button
            type="button"
            onClick={onDownloadReport}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#0040e0]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              hover:bg-[#2e5bff]
            "
          >
            <span className="material-symbols-outlined">
              download
            </span>

            Download Report
          </button>
        </div>
      </PageContainer>
    );
  }

  /*
   * =====================================================
   * SETTINGS
   * =====================================================
   */

  if (activeTab === 'settings') {
    return (
      <PageContainer
        title="Settings"
        subtitle="Manage your portal preferences."
      >
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0040e0] text-2xl">
                settings
              </span>
            </div>

            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Portal Settings
              </h2>

              <p className="text-sm text-slate-500">
                Current portal:{' '}
                <strong className="capitalize">
                  {currentView}
                </strong>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm text-slate-600">
              Your authentication and account information are managed through Supabase.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Page"
      subtitle="Select an option from the sidebar."
    >
      <EmptyState
        icon="dashboard"
        title="Select a menu item"
        description="Choose a section from the sidebar to continue."
      />
    </PageContainer>
  );
};

/* ========================================================
   SMALL REUSABLE UI
======================================================== */

const PageContainer: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          {title}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
};

const EmptyState: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <span className="material-symbols-outlined text-5xl text-slate-300">
        {icon}
      </span>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: string;
}> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>

        <span className="material-symbols-outlined text-[#0040e0]">
          {icon}
        </span>
      </div>

      <div className="mt-4 text-3xl font-extrabold text-slate-900">
        {value}
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  const classes =
    status === 'Approved'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'Rejected'
        ? 'bg-rose-50 text-rose-700'
        : status === 'Paid'
          ? 'bg-blue-50 text-blue-700'
          : 'bg-amber-50 text-amber-700';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${classes}`}
    >
      {status}
    </span>
  );
};

const ApplicationTable: React.FC<{
  applications: SponsorshipApplication[];
}> = ({ applications }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-4 text-xs font-bold text-slate-500">
              Sponsor
            </th>

            <th className="px-5 py-4 text-xs font-bold text-slate-500">
              Event
            </th>

            <th className="px-5 py-4 text-xs font-bold text-slate-500">
              Package
            </th>

            <th className="px-5 py-4 text-xs font-bold text-slate-500">
              Amount
            </th>

            <th className="px-5 py-4 text-xs font-bold text-slate-500">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="font-bold text-sm text-slate-900">
                  {app.sponsorName}
                </div>

                <div className="text-xs text-slate-400">
                  {app.contactEmail}
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {app.eventName}
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">
                {app.packageTier}
              </td>

              <td className="px-5 py-4 font-bold text-sm text-slate-900">
                {formatCurrency(app.amount)}
              </td>

              <td className="px-5 py-4">
                <StatusBadge status={app.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};