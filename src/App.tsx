import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Login from './auth/Login';
import { useAuth } from './context/AuthContext';
import { PortalTabContent } from './components/PortalTabContent';
import { StallManagement } from './components/StallManagement';

import type {
  AppView,
  CampusEvent,
  SponsorshipApplication,
  Milestone,
  SponsorshipTier,
  EventCategory,
  EventStall,
} from './types';

import { INITIAL_EVENTS } from './data/initialData';
import { supabase } from './lib/supabase';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { OrganizerPortal } from './components/OrganizerPortal';
import { SponsorPortal } from './components/SponsorPortal';
import { CreateEventModal } from './components/CreateEventModal';
import { SponsorModal } from './components/SponsorModal';
import { EventDetailModal } from './components/EventDetailModal';

import {
  ToastContainer,
  ToastMessage,
} from './components/Toast';

const PROTECTED_VIEWS: AppView[] = [
  'admin',
  'organizer',
  'sponsor',
];

export default function App() {
  // ==================================================
  // AUTHENTICATION
  // ==================================================

  const {
    user,
    role,
    loading: authLoading,
    signOut,
  } = useAuth();

  // ==================================================
  // VIEW STATE
  // ==================================================

  const [currentView, setCurrentView] =
    useState<AppView>('landing');

  const [activeTab, setActiveTab] =
    useState<string>('dashboard');

  const [showLogin, setShowLogin] =
    useState(false);

  // ==================================================
  // AUTHORIZATION
  // ==================================================

  const isAuthenticated = !!user;

  const isAdmin =
    role === 'admin';

  const isOrganizer =
    role === 'admin' ||
    role === 'organizer';

  const isSponsor =
    role === 'sponsor';

  const canCreateEvent =
    isAdmin ||
    role === 'organizer';

  const canManageApplications =
    isAdmin ||
    role === 'organizer';

  // ==================================================
  // AUTOMATIC PORTAL AFTER LOGIN
  // ==================================================

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !role
    ) {
      return;
    }

    console.log(
      'AUTHENTICATED USER:',
      user.email
    );

    console.log(
      'AUTHENTICATED ROLE:',
      role
    );

    if (role === 'admin') {
      setCurrentView('admin');
      setActiveTab('dashboard');
    }

    if (role === 'organizer') {
      setCurrentView('organizer');
      setActiveTab('dashboard');
    }

    if (role === 'sponsor') {
      setCurrentView('sponsor');
      setActiveTab('dashboard');
    }

    setShowLogin(false);
  }, [
    authLoading,
    user,
    role,
  ]);

  // ==================================================
  // DATA STATE
  // ==================================================

  const [events, setEvents] =
    useState<CampusEvent[]>([]);

  const [applications, setApplications] =
    useState<SponsorshipApplication[]>([]);

  /*
   * IMPORTANT
   *
   * Stalls are grouped by event ID:
   *
   * {
   *   "event-1": [stall1, stall2],
   *   "event-2": [stall1, stall2]
   * }
   */
  const [eventStalls, setEventStalls] =
    useState<Record<string, EventStall[]>>({});

  const [milestones, setMilestones] =
    useState<Milestone[]>([]);

  const [isLoadingEvents, setIsLoadingEvents] =
    useState(true);

  // ==================================================
  // MODAL STATE
  // ==================================================

  const [isCreateEventOpen, setIsCreateEventOpen] =
    useState(false);

  const [selectedSponsorEvent, setSelectedSponsorEvent] =
    useState<CampusEvent | null>(null);

  const [selectedDetailEvent, setSelectedDetailEvent] =
    useState<CampusEvent | null>(null);

  // ==================================================
  // TOAST STATE
  // ==================================================

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  // ==================================================
  // TOAST
  // ==================================================

  const addToast = useCallback(
    (
      type: ToastMessage['type'],
      title: string,
      description?: string,
    ) => {
      const id =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          description,
        },
      ]);

      window.setTimeout(() => {
        setToasts((prev) =>
          prev.filter(
            (toast) =>
              toast.id !== id
          )
        );
      }, 4000);
    },
    [],
  );

  const handleDismissToast =
    useCallback((id: string) => {
      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );
    }, []);

  // ==================================================
  // VIEW CHANGE
  // ==================================================

  const handleViewChange =
    useCallback(
      (view: AppView) => {

        if (
          !PROTECTED_VIEWS.includes(view)
        ) {
          setCurrentView(view);
          setActiveTab('dashboard');
          return;
        }

        if (!isAuthenticated) {
          setShowLogin(true);

          addToast(
            'warning',
            'Login Required',
            'Please log in to access this portal.'
          );

          return;
        }

        if (
          view === 'admin' &&
          !isAdmin
        ) {
          addToast(
            'error',
            'Access Denied',
            'Only administrators can access the administrator dashboard.'
          );

          return;
        }

        if (
          view === 'organizer' &&
          !isOrganizer
        ) {
          addToast(
            'error',
            'Access Denied',
            'Only administrators and organizers can access the organizer portal.'
          );

          return;
        }

        if (
          view === 'sponsor' &&
          !isSponsor
        ) {
          addToast(
            'error',
            'Access Denied',
            'Only registered sponsors can access the sponsor portal.'
          );

          return;
        }

        setCurrentView(view);
        setActiveTab('dashboard');
      },
      [
        addToast,
        isAdmin,
        isAuthenticated,
        isOrganizer,
        isSponsor,
      ],
    );

  // ==================================================
  // LOAD EVENTS
  // ==================================================

  const loadEvents = useCallback(
    async () => {

      setIsLoadingEvents(true);

      try {

        const [
          eventsResult,
          tiersResult,
        ] = await Promise.all([

          supabase
            .from('events')
            .select('*')
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

          supabase
            .from('sponsorship_tiers')
            .select('*'),

        ]);

        if (
          eventsResult.error
        ) {

          console.error(
            'Error loading events:',
            eventsResult.error
          );

          setEvents(
            INITIAL_EVENTS
          );

          return;
        }

        if (
          tiersResult.error
        ) {

          console.warn(
            'Error loading sponsorship tiers:',
            tiersResult.error
          );

        }

        const eventRows =
          eventsResult.data ?? [];

        const tierRows =
          tiersResult.data ?? [];

        if (
          eventRows.length === 0
        ) {

          setEvents(
            INITIAL_EVENTS
          );

          return;
        }

        const formattedEvents:
          CampusEvent[] =
          eventRows.map(
            (event: any) => {

              const eventTiers =
                tierRows
                  .filter(
                    (tier: any) =>
                      String(
                        tier.event_id
                      ) ===
                      String(
                        event.id
                      )
                  )
                  .map(
                    (
                      tier: any
                    ): SponsorshipTier => ({
                      id:
                        String(
                          tier.id
                        ),

                      name:
                        tier.name ??
                        '',

                      price:
                        Number(
                          tier.price ??
                          0
                        ),

                      perks:
                        Array.isArray(
                          tier.perks
                        )
                          ? tier.perks
                          : [],

                      slotsAvailable:
                        Number(
                          tier.slots_available ??
                          0
                        ),
                    })
                  );

              return {
                id:
                  String(
                    event.id
                  ),

                title:
                  event.title ??
                  '',

                category:
                  (
                    event.category ??
                    'Technical'
                  ) as EventCategory,

                college:
                  event.college ??
                  '',

                location:
                  event.location ??
                  event.college ??
                  '',

                dateRange:
                  event.date_range ??
                  'Upcoming Event',

                expectedReach:
                  event.expected_reach ??
                  '15,000+ Students',

                status:
                  event.status ??
                  'Preparation',

                image:
                  event.image ??
                  '',

                slotsRemaining:
                  event.slots_remaining ??
                  '4 Slots Remaining',

                description:
                  event.description ??
                  'Academic event looking for corporate sponsorship partners.',

                sponsorshipGoalMet:
                  Number(
                    event.sponsorship_goal_met ??
                    0
                  ),

                confirmedSponsorsCount:
                  Number(
                    event.confirmed_sponsors_count ??
                    0
                  ),

                tiers:
                  eventTiers,
              };
            }
          );

        setEvents(
          formattedEvents
        );

      } catch (error) {

        console.error(
          'Unexpected event loading error:',
          error
        );

        setEvents(
          INITIAL_EVENTS
        );

      } finally {

        setIsLoadingEvents(
          false
        );

      }
    },
    [],
  );

  // ==================================================
  // LOAD EVENT STALLS
  // ==================================================

  const loadEventStalls =
    useCallback(
      async () => {

        try {

          console.log(
            'Loading event stalls...'
          );

          const [
            stallsResult,
            reservationsResult,
          ] = await Promise.all([

            supabase
              .from('event_stalls')
              .select('*')
              .order(
                'sort_order',
                {
                  ascending: true,
                }
              ),

            supabase
              .from('stall_reservations')
              .select(
                'event_id, stall_id'
              ),

          ]);

          if (
            stallsResult.error
          ) {

            console.error(
              'Error loading event stalls:',
              stallsResult.error
            );

            setEventStalls(
              {}
            );

            return;
          }

          if (
            reservationsResult.error
          ) {

            console.error(
              'Error loading stall reservations:',
              reservationsResult.error
            );

            setEventStalls(
              {}
            );

            return;
          }

          const reservedKeys =
            new Set(
              (
                reservationsResult.data ??
                []
              ).map(
                (row: any) =>
                  `${String(
                    row.event_id
                  )}:${String(
                    row.stall_id
                  )}`
              )
            );

          const grouped:
            Record<
              string,
              EventStall[]
            > = {};

          for (
            const row of
            stallsResult.data ??
            []
          ) {

            const eventId =
              String(
                row.event_id
              );

            const stallId =
              String(
                row.stall_id
              );

            if (
              !grouped[eventId]
            ) {
              grouped[eventId] =
                [];
            }

            grouped[eventId].push({
              id:
                String(
                  row.id ??
                  `${eventId}-${stallId}`
                ),

              eventId,

              stallId,

              stallName:
                row.stall_name ??
                row.stall_id ??
                stallId,

              sortOrder:
                Number(
                  row.sort_order ??
                  0
                ),

              reserved:
                reservedKeys.has(
                  `${eventId}:${stallId}`
                ),
            });

          }

          setEventStalls(
            grouped
          );

          console.log(
            'Event stalls loaded:',
            grouped
          );

        } catch (error) {

          console.error(
            'Unexpected stall loading error:',
            error
          );

          setEventStalls(
            {}
          );

        }
      },
      [],
    );

  // ==================================================
  // LOAD MILESTONES
  // ==================================================

  const loadMilestones =
    useCallback(
      async () => {

        try {

          const {
            data,
            error,
          } = await supabase
            .from('milestones')
            .select('*')
            .order(
              'created_at',
              {
                ascending: true,
              }
            );

          if (error) {

            console.error(
              'Error loading milestones:',
              error
            );

            setMilestones(
              []
            );

            return;
          }

          setMilestones(
            (
              data ??
              []
            ).map(
              (
                milestone: any
              ): Milestone => ({
                id:
                  String(
                    milestone.id
                  ),

                title:
                  milestone.title ??
                  '',

                description:
                  milestone.description ??
                  '',

                icon:
                  milestone.icon ??
                  '',

                iconColor:
                  milestone.icon_color ??
                  '',
              })
            )
          );

        } catch (error) {

          console.error(
            'Unexpected milestone error:',
            error
          );

          setMilestones(
            []
          );

        }
      },
      [],
    );

  // ==================================================
  // LOAD APPLICATIONS
  // ==================================================

  const loadApplications =
    useCallback(
      async () => {

        try {

          const {
            data,
            error,
          } = await supabase
            .from(
              'sponsorship_applications'
            )
            .select('*');

          if (error) {

            console.error(
              'Error loading applications:',
              error
            );

            setApplications(
              []
            );

            return;
          }

          const formattedApplications:
            SponsorshipApplication[] =
            (
              data ??
              []
            ).map(
              (
                application: any
              ) => ({

                id:
                  String(
                    application.id
                  ),

                sponsorName:
                  application.sponsor_name ??
                  '',

                sponsorInitials:
                  application.sponsor_initials ??
                  'SP',

                eventName:
                  application.event_name ??
                  'Campus Event',

                eventId:
                  String(
                    application.event_id ??
                    ''
                  ),

                packageTier:
                  application.package_tier ??
                  '',

                amount:
                  Number(
                    application.amount ??
                    0
                  ),

                status:
                  application.status ??
                  'Pending',

                dateApplied:
                  application.date_applied ??
                  '',

                avatarBg:
                  application.avatar_bg,

                contactEmail:
                  application.contact_email ??
                  '',

                /*
                 * STALL DATA
                 */
                stallId:
                  application.stall_id
                    ? String(
                        application.stall_id
                      )
                    : undefined,

                stallName:
                  application.stall_name ??
                  undefined,

              })
            );

          setApplications(
            formattedApplications
          );

        } catch (error) {

          console.error(
            'Unexpected application error:',
            error
          );

          setApplications(
            []
          );

        }
      },
      [],
    );

  // ==================================================
  // LOAD ALL DATA
  // ==================================================

  useEffect(() => {

    if (
      authLoading
    ) {
      return;
    }

    void loadEvents();
    void loadMilestones();
    void loadEventStalls();

    if (
      isAuthenticated
    ) {
      void loadApplications();
    } else {
      setApplications(
        []
      );
    }

  }, [
    authLoading,
    isAuthenticated,
    loadEvents,
    loadMilestones,
    loadEventStalls,
    loadApplications,
  ]);

  // ==================================================
  // SECURITY CHECK
  // ==================================================

  useEffect(() => {

    if (
      !isAuthenticated &&
      currentView !== 'landing'
    ) {

      setCurrentView(
        'landing'
      );

      return;
    }

    if (
      currentView === 'admin' &&
      !isAdmin
    ) {

      setCurrentView(
        'landing'
      );

      return;
    }

    if (
      currentView === 'organizer' &&
      !isOrganizer
    ) {

      setCurrentView(
        'landing'
      );

      return;
    }

    if (
      currentView === 'sponsor' &&
      !isSponsor
    ) {

      setCurrentView(
        'landing'
      );

    }

  }, [
    currentView,
    isAdmin,
    isAuthenticated,
    isOrganizer,
    isSponsor,
  ]);

  // ==================================================
  // APPROVE APPLICATION
  // ==================================================

  const handleApproveApplication =
    async (
      appId: string
    ) => {

      if (
        !canManageApplications
      ) {

        addToast(
          'error',
          'Access Denied',
          'You are not authorized to approve sponsorship applications.'
        );

        return;
      }

      const target =
        applications.find(
          (app) =>
            app.id === appId
        );

      if (!target) {
        return;
      }

      try {

        const {
          error,
        } = await supabase
          .from(
            'sponsorship_applications'
          )
          .update({
            status:
              'Approved',
          })
          .eq(
            'id',
            appId
          );

        if (error) {
          throw error;
        }

        setApplications(
          (prev) =>
            prev.map(
              (app) =>
                app.id === appId
                  ? {
                      ...app,
                      status:
                        'Approved',
                    }
                  : app
            )
        );

        addToast(
          'success',
          'Application Approved',
          `Proposal from ${target.sponsorName} for ${target.eventName} has been approved.`
        );

      } catch (error: any) {

        console.error(
          'Approval failed:',
          error
        );

        addToast(
          'error',
          'Approval Failed',
          error?.message ??
          'Unable to approve application.'
        );

      }
    };

  // ==================================================
  // REJECT APPLICATION
  // ==================================================

  const handleRejectApplication =
    async (
      appId: string
    ) => {

      if (
        !canManageApplications
      ) {

        addToast(
          'error',
          'Access Denied',
          'You are not authorized to reject sponsorship applications.'
        );

        return;
      }

      const target =
        applications.find(
          (app) =>
            app.id === appId
        );

      if (!target) {
        return;
      }

      try {

        const {
          error,
        } = await supabase
          .from(
            'sponsorship_applications'
          )
          .update({
            status:
              'Rejected',
          })
          .eq(
            'id',
            appId
          );

        if (error) {
          throw error;
        }

        setApplications(
          (prev) =>
            prev.map(
              (app) =>
                app.id === appId
                  ? {
                      ...app,
                      status:
                        'Rejected',
                    }
                  : app
            )
        );

        addToast(
          'warning',
          'Application Declined',
          `Proposal from ${target.sponsorName} was declined.`
        );

      } catch (error: any) {

        console.error(
          'Rejection failed:',
          error
        );

        addToast(
          'error',
          'Rejection Failed',
          error?.message ??
          'Unable to reject application.'
        );

      }
    };

  // ==================================================
  // CREATE EVENT
  // ==================================================

  const handleCreateEvent =
    async (
      newEventData: Omit<
        CampusEvent,
        'id' |
        'sponsorshipGoalMet' |
        'confirmedSponsorsCount'
      >
    ) => {

      if (
        !isAuthenticated
      ) {

        addToast(
          'warning',
          'Login Required',
          'Please log in before creating an event.'
        );

        return;
      }

      if (
        !canCreateEvent
      ) {

        addToast(
          'error',
          'Access Denied',
          'Only administrators and organizers can create events.'
        );

        return;
      }

      try {

        const eventId =
          `evt-${Date.now()}`;

        const eventToInsert = {

          id:
            eventId,

          title:
            newEventData.title,

          category:
            newEventData.category,

          college:
            newEventData.college,

          location:
            newEventData.location,

          date_range:
            newEventData.dateRange,

          expected_reach:
            newEventData.expectedReach,

          status:
            newEventData.status,

          image:
            newEventData.image,

          slots_remaining:
            newEventData.slotsRemaining,

          description:
            newEventData.description,

          sponsorship_goal_met:
            0,

          confirmed_sponsors_count:
            0,

        };

        const {
          data:
            savedEventData,
          error:
            eventError,
        } = await supabase
          .from('events')
          .insert([
            eventToInsert,
          ])
          .select()
          .single();

        if (
          eventError
        ) {
          throw eventError;
        }

        const tiersToInsert =
          (
            newEventData.tiers ??
            []
          ).map(
            (tier) => ({
              id:
                tier.id ||
                `tier-${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`,

              event_id:
                savedEventData.id,

              name:
                tier.name,

              price:
                Number(
                  tier.price ??
                  0
                ),

              perks:
                tier.perks,

              slots_available:
                Number(
                  tier.slotsAvailable ??
                  0
                ),
            })
          );

        if (
          tiersToInsert.length > 0
        ) {

          const {
            error:
              tiersError,
          } = await supabase
            .from(
              'sponsorship_tiers'
            )
            .insert(
              tiersToInsert
            );

          if (
            tiersError
          ) {

            await supabase
              .from('events')
              .delete()
              .eq(
                'id',
                savedEventData.id
              );

            throw tiersError;
          }
        }

        const savedEvent:
          CampusEvent = {

          id:
            String(
              savedEventData.id
            ),

          title:
            savedEventData.title,

          category:
            savedEventData.category as EventCategory,

          college:
            savedEventData.college,

          location:
            savedEventData.location,

          dateRange:
            savedEventData.date_range,

          expectedReach:
            savedEventData.expected_reach,

          status:
            savedEventData.status,

          image:
            savedEventData.image,

          slotsRemaining:
            savedEventData.slots_remaining,

          description:
            savedEventData.description,

          sponsorshipGoalMet:
            Number(
              savedEventData.sponsorship_goal_met ??
              0
            ),

          confirmedSponsorsCount:
            Number(
              savedEventData.confirmed_sponsors_count ??
              0
            ),

          tiers:
            newEventData.tiers ??
            [],
        };

        setEvents(
          (prev) => [
            savedEvent,
            ...prev,
          ]
        );

        setIsCreateEventOpen(
          false
        );

        addToast(
          'success',
          'Campus Event Published!',
          `"${savedEvent.title}" and its sponsorship packages are now live.`
        );

      } catch (error: any) {

        console.error(
          'Event creation failed:',
          error
        );

        addToast(
          'error',
          'Event Creation Failed',
          error?.message ??
          'Unable to create the event.'
        );

      }
    };

  // ==================================================
  // SUBMIT SPONSORSHIP + RESERVE STALL
  // ==================================================

  const handleSubmitSponsorship = async (
  eventId: string,
  sponsorName: string,
  amount: number,
  email: string
) => {

  try {

    console.log(
      'Starting sponsorship submission...'
    );

    // ----------------------------------------------
    // VALIDATE AMOUNT
    // ----------------------------------------------

    if (amount < 10000) {

      addToast(
        'error',
        'Invalid Sponsorship Amount',
        'Minimum sponsorship amount is ₹10,000.'
      );

      return;
    }


    // ----------------------------------------------
    // FIND EVENT
    // ----------------------------------------------

    const event =
      events.find(
        (e) =>
          String(e.id) ===
          String(eventId)
      );


    if (!event) {

      addToast(
        'error',
        'Submission Failed',
        'The selected event could not be found.'
      );

      return;
    }


    // ----------------------------------------------
    // CREATE APPLICATION ID
    // ----------------------------------------------

    const applicationId =
      `app-${Date.now()}`;


    // ----------------------------------------------
    // CREATE DATE
    // ----------------------------------------------

    const dateApplied =
      new Date()
        .toLocaleDateString(
          'en-GB',
          {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }
        );


    // ----------------------------------------------
    // CREATE SPONSOR INITIALS
    // ----------------------------------------------

    const sponsorInitials =
      sponsorName
        .trim()
        .split(/\s+/)
        .map(
          (name) => name[0]
        )
        .join('')
        .slice(0, 3)
        .toUpperCase() ||
      'SP';


    // ----------------------------------------------
    // APPLICATION DATA
    // ----------------------------------------------

    const applicationToInsert = {

      id:
        applicationId,

      sponsor_name:
        sponsorName,

      sponsor_initials:
        sponsorInitials,

      event_name:
        event.title,

      event_id:
        event.id,

      package_tier:
        'Custom Sponsorship',

      amount:
        amount,

      status:
        'Pending',

      date_applied:
        dateApplied,

      contact_email:
        email,

    };


    console.log(
      'Sponsorship application being sent to Supabase:',
      applicationToInsert
    );


    // ----------------------------------------------
    // INSERT APPLICATION
    // ----------------------------------------------

    const {
      data: savedApplication,
      error: applicationError,
    } = await supabase
      .from('sponsorship_applications')
      .insert([
        applicationToInsert,
      ])
      .select()
      .single();


    // ----------------------------------------------
    // HANDLE INSERT ERROR
    // ----------------------------------------------

    if (applicationError) {

      console.error(
        'Sponsorship submission failed:',
        applicationError
      );

      addToast(
        'error',
        'Sponsorship Submission Failed',
        applicationError.message
      );

      return;
    }


    if (!savedApplication) {

      addToast(
        'error',
        'Submission Failed',
        'No application data was returned from Supabase.'
      );

      return;
    }


    // ----------------------------------------------
    // CREATE FRONTEND APPLICATION
    // ----------------------------------------------

    const newApp:
      SponsorshipApplication = {

      id:
        String(
          savedApplication.id
        ),

      sponsorName:
        savedApplication.sponsor_name ??
        sponsorName,

      sponsorInitials:
        savedApplication.sponsor_initials ??
        sponsorInitials,

      eventName:
        savedApplication.event_name ??
        event.title,

      eventId:
        String(
          savedApplication.event_id ??
          event.id
        ),

      packageTier:
        savedApplication.package_tier ??
        'Custom Sponsorship',

      amount:
        Number(
          savedApplication.amount ??
          amount
        ),

      status:
        savedApplication.status ??
        'Pending',

      dateApplied:
        savedApplication.date_applied ??
        dateApplied,

      avatarBg:
        savedApplication.avatar_bg,

      contactEmail:
        savedApplication.contact_email ??
        email,

    };


    // ----------------------------------------------
    // UPDATE APPLICATION STATE
    // ----------------------------------------------

    setApplications(
      (prev) => [
        newApp,
        ...prev,
      ]
    );


    addToast(
      'success',
      'Sponsorship Application Submitted',
      `Your sponsorship of ₹${amount.toLocaleString(
        'en-IN'
      )} has been submitted successfully.`
    );


    // Close modal
    setSelectedSponsorEvent(
      null
    );


    // Reload applications
    await loadApplications();


  } catch (error: any) {

    console.error(
      'Unexpected sponsorship submission error:',
      error
    );

    addToast(
      'error',
      'Submission Failed',
      error?.message ??
      'Unable to submit sponsorship application.'
    );

  }

};

  // ==================================================
  // DOWNLOAD REPORT
  // ==================================================

  const handleDownloadReport =
    () => {

      if (
        !isAuthenticated
      ) {

        addToast(
          'warning',
          'Login Required',
          'Please log in to download your sponsorship report.'
        );

        return;
      }

      addToast(
        'info',
        'Report Generated',
        'Sponsorship ROI impact report has been generated.'
      );

    };

  // ==================================================
  // OPEN CREATE EVENT
  // ==================================================

  const openCreateEvent =
    () => {

      if (
        !isAuthenticated
      ) {

        setShowLogin(
          true
        );

        return;
      }

      if (
        !canCreateEvent
      ) {

        addToast(
          'error',
          'Access Denied',
          'Only administrators and organizers can create events.'
        );

        return;
      }

      setIsCreateEventOpen(
        true
      );

    };

  // ==================================================
  // OPEN SPONSOR MODAL
  // ==================================================

  const openSponsor =
    (event: CampusEvent) => {

      if (
        !isAuthenticated
      ) {

        setShowLogin(
          true
        );

        return;
      }

      if (
        !isSponsor
      ) {

        addToast(
          'error',
          'Access Denied',
          'Only registered sponsors can submit sponsorship proposals.'
        );

        return;
      }

      setSelectedSponsorEvent(
        event
      );

    };

  // ==================================================
  // AVAILABLE STALLS FOR SELECTED EVENT
  // ==================================================

  const availableStalls =
    useMemo(
      () => {

        if (
          !selectedSponsorEvent
        ) {
          return [];
        }

        const stalls =
          eventStalls[
            String(
              selectedSponsorEvent.id
            )
          ] ??
          [];

        return stalls.filter(
          (stall) =>
            !stall.reserved
        );

      },
      [
        eventStalls,
        selectedSponsorEvent,
      ]
    );

  // ==================================================
  // PENDING APPLICATIONS
  // ==================================================

  const pendingAppsCount =
    useMemo(
      () =>
        applications.filter(
          (app) =>
            app.status ===
            'Pending'
        ).length,
      [
        applications,
      ]
    );

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout =
    async () => {

      try {

        await signOut();

      } catch (error) {

        console.error(
          'Logout failed:',
          error
        );

      }

      setCurrentView(
        'landing'
      );

      setActiveTab(
        'dashboard'
      );

      setShowLogin(
        false
      );

    };

  // ==================================================
  // AUTH LOADING
  // ==================================================

  if (
    authLoading
  ) {

    return (
      <div className="min-h-screen bg-[#fbf8ff] flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0040e0] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading Campus Bridge...
          </p>

        </div>

      </div>
    );
  }

  // ==================================================
  // LOGIN
  // ==================================================

  if (
    showLogin &&
    !user
  ) {

    return (
      <Login
        onSuccess={() => {
          setShowLogin(
            false
          );
        }}
        onClose={() => {
          setShowLogin(
            false
          );
        }}
      />
    );
  }

  // ==================================================
  // MAIN APP
  // ==================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#fbf8ff]
        text-[#191b24]
        selection:bg-[#2e5bff]
        selection:text-[#efefff]
      "
    >

      {/* ================================================= */}
      {/* TOASTS */}
      {/* ================================================= */}

      <ToastContainer
        toasts={
          toasts
        }
        onDismiss={
          handleDismissToast
        }
      />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      
      {currentView !== 'landing' && (
        <Header
          currentView={currentView}
          onViewChange={handleViewChange}
          pendingApplicationsCount={pendingAppsCount}
          onOpenCreateEvent={openCreateEvent}
          isAuthenticated={!!user}
          userEmail={user?.email ?? ''}
          userRole={role ?? undefined}
          onLogin={() => {
            setShowLogin(true);
          }}
          onLogout={handleLogout}
        />
      )}


      {/* ================================================= */}
      {/* SIDEBAR + MAIN */}
      {/* ================================================= */}

      <div className="flex">

        <Sidebar
          currentView={
            currentView
          }

          onViewChange={
            handleViewChange
          }

          activeTab={
            activeTab
          }

          setActiveTab={
            setActiveTab
          }

          userRole={
            role ??
            undefined
          }
        />

        <main
          className={`
            flex-1
            min-w-0
            ${
              currentView !==
              'landing'
                ? 'lg:pl-[260px] pb-24 lg:pb-12'
                : ''
            }
          `}
        >

          {/* ================================================= */}
          {/* LANDING */}
          {/* ================================================= */}

          {
            currentView ===
            'landing' && (

              <LandingPage
                events={
                  events
                }

                onViewChange={
                  handleViewChange
                }

                onOpenEventDetail={
                  (
                    event
                  ) => {
                    setSelectedDetailEvent(
                      event
                    );
                  }
                }

                onOpenSponsor={
                  openSponsor
                }

                onOpenCreateEvent={
                  openCreateEvent
                }
              />

            )
          }

          {/* ================================================== */}
          {/* ADMIN PORTAL */}
          {/* ================================================== */}

          {currentView === 'admin' && (

            <>

              {/* ================================================== */}
              {/* ADMIN DASHBOARD */}
              {/* ================================================== */}

              {activeTab === 'dashboard' && (
                <AdminDashboard
                  applications={applications}
                  milestones={milestones}
                  onApproveApplication={handleApproveApplication}
                  onRejectApplication={handleRejectApplication}
                  onOpenCreateEvent={() => {
                    setIsCreateEventOpen(true);
                  }}
                />
              )}

              {/* ================================================== */}
              {/* EVENTS */}
              {/* ================================================== */}

              {activeTab === 'events' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-900">
                        Events
                      </h1>

                      <p className="text-sm text-slate-500 mt-1">
                        Manage all campus events and sponsorship opportunities.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCreateEventOpen(true);
                      }}
                      className="
                        flex items-center justify-center gap-2
                        bg-[#0040e0]
                        text-white
                        px-5 py-3
                        rounded-xl
                        font-bold
                        text-sm
                        hover:bg-[#2e5bff]
                        transition-all
                      "
                    >
                      <span className="material-symbols-outlined">
                        add
                      </span>

                      Create Event
                    </button>

                  </div>

                  {events.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                      <span className="material-symbols-outlined text-5xl text-slate-300">
                        event_busy
                      </span>

                      <h2 className="text-xl font-bold text-slate-900 mt-4">
                        No Events Available
                      </h2>

                      <p className="text-sm text-slate-500 mt-2">
                        Create an event first to manage events and stalls.
                      </p>

                      <button
                        onClick={() => {
                          setIsCreateEventOpen(true);
                        }}
                        className="
                          mt-6
                          bg-[#0040e0]
                          text-white
                          px-5 py-3
                          rounded-xl
                          font-semibold
                        "
                      >
                        Create First Event
                      </button>

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
                            hover:shadow-md
                            transition-all
                          "
                        >

                          <div className="h-40 bg-slate-100 overflow-hidden">

                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-slate-300">
                                  event
                                </span>
                              </div>
                            )}

                          </div>

                          <div className="p-5">

                            <div className="flex items-start justify-between gap-3">

                              <h3 className="font-bold text-lg text-slate-900">
                                {event.title}
                              </h3>

                              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-50 text-[#0040e0]">
                                {event.status}
                              </span>

                            </div>

                            <div className="mt-4 space-y-2 text-sm text-slate-500">

                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                  location_on
                                </span>
                                {event.location}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                  calendar_month
                                </span>
                                {event.dateRange}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">
                                  groups
                                </span>
                                {event.expectedReach}
                              </div>

                            </div>

                            <button
                              onClick={() => {
                                setSelectedDetailEvent(event);
                              }}
                              className="
                                mt-5
                                w-full
                                border
                                border-[#0040e0]
                                text-[#0040e0]
                                py-2.5
                                rounded-xl
                                font-semibold
                                text-sm
                                hover:bg-blue-50
                              "
                            >
                              View Event
                            </button>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>
              )}

              {/* ================================================== */}
              {/* SPONSORSHIPS */}
              {/* ================================================== */}

              {activeTab === 'sponsorships' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">

                  <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Sponsorships
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      View and manage sponsorship applications and packages.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                    <div className="p-5 border-b border-slate-100">
                      <h2 className="font-bold text-lg text-slate-900">
                        Sponsorship Applications
                      </h2>
                    </div>

                    {applications.length === 0 ? (

                      <div className="p-12 text-center">

                        <span className="material-symbols-outlined text-5xl text-slate-300">
                          payments
                        </span>

                        <h3 className="font-bold text-lg mt-4">
                          No Sponsorships
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Sponsorship applications will appear here.
                        </p>

                      </div>

                    ) : (

                      <div className="overflow-x-auto">

                        <table className="w-full">

                          <thead className="bg-slate-50">

                            <tr>

                              <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                                Sponsor
                              </th>

                              <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                                Event
                              </th>

                              <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                                Package
                              </th>

                              <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                                Amount
                              </th>

                              <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                                Status
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {applications.map((application) => (

                              <tr
                                key={application.id}
                                className="border-t border-slate-100"
                              >

                                <td className="px-5 py-4 font-semibold text-slate-900">
                                  {application.sponsorName}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {application.eventName}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {application.packageTier}
                                </td>

                                <td className="px-5 py-4 font-semibold">
                                  ₹{application.amount.toLocaleString()}
                                </td>

                                <td className="px-5 py-4">

                                  <span
                                    className={`
                                      px-2.5
                                      py-1
                                      rounded-lg
                                      text-xs
                                      font-bold
                                      ${
                                        application.status === 'Approved'
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : application.status === 'Rejected'
                                          ? 'bg-red-50 text-red-700'
                                          : 'bg-amber-50 text-amber-700'
                                      }
                                    `}
                                  >
                                    {application.status}
                                  </span>

                                </td>

                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </div>

                </div>
              )}

              {/* ================================================== */}
              {/* APPLICATIONS */}
              {/* ================================================== */}

              {activeTab === 'applications' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">

                  <div className="mb-6">

                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Applications
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Review, approve and reject sponsor applications.
                    </p>

                  </div>

                  <div className="grid grid-cols-1 gap-4">

                    {applications.length === 0 ? (

                      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                        <span className="material-symbols-outlined text-5xl text-slate-300">
                          assignment
                        </span>

                        <h3 className="font-bold text-lg mt-4">
                          No Applications
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          New sponsorship applications will appear here.
                        </p>

                      </div>

                    ) : (

                      applications.map((application) => (

                        <div
                          key={application.id}
                          className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-5
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            justify-between
                            gap-5
                          "
                        >

                          <div>

                            <h3 className="font-bold text-lg text-slate-900">
                              {application.sponsorName}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {application.eventName}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">

                              <span>
                                Package: {application.packageTier}
                              </span>

                              <span>
                                Amount: ₹{application.amount.toLocaleString()}
                              </span>

                              <span>
                                Applied: {application.dateApplied}
                              </span>

                            </div>

                          </div>

                          <div className="flex items-center gap-2">

                            <span
                              className="
                                px-3
                                py-1.5
                                rounded-lg
                                bg-amber-50
                                text-amber-700
                                text-xs
                                font-bold
                              "
                            >
                              {application.status}
                            </span>

                            {application.status === 'Pending' && (

                              <>
                                <button
                                  onClick={() => {
                                    handleApproveApplication(
                                      application.id
                                    );
                                  }}
                                  className="
                                    px-4
                                    py-2
                                    bg-emerald-600
                                    text-white
                                    rounded-lg
                                    text-xs
                                    font-bold
                                    hover:bg-emerald-700
                                  "
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => {
                                    handleRejectApplication(
                                      application.id
                                    );
                                  }}
                                  className="
                                    px-4
                                    py-2
                                    bg-red-600
                                    text-white
                                    rounded-lg
                                    text-xs
                                    font-bold
                                    hover:bg-red-700
                                  "
                                >
                                  Reject
                                </button>
                              </>

                            )}

                          </div>

                        </div>

                      ))

                    )}

                  </div>

                </div>
              )}

              {/* ================================================== */}
              {/* REPORTS */}
              {/* ================================================== */}

              {activeTab === 'reports' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">

                  <div className="mb-6">

                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Reports
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      View sponsorship, event and application reports.
                    </p>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                      <span className="material-symbols-outlined text-[#0040e0] text-3xl">
                        payments
                      </span>

                      <h3 className="font-bold text-lg mt-4">
                        Sponsorship Revenue
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Total sponsorship applications:
                      </p>

                      <p className="text-3xl font-extrabold mt-3">
                        {applications.length}
                      </p>

                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                      <span className="material-symbols-outlined text-[#0040e0] text-3xl">
                        event
                      </span>

                      <h3 className="font-bold text-lg mt-4">
                        Total Events
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Events currently available:
                      </p>

                      <p className="text-3xl font-extrabold mt-3">
                        {events.length}
                      </p>

                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                      <span className="material-symbols-outlined text-[#0040e0] text-3xl">
                        pending_actions
                      </span>

                      <h3 className="font-bold text-lg mt-4">
                        Pending Applications
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Applications waiting for action:
                      </p>

                      <p className="text-3xl font-extrabold mt-3">
                        {pendingAppsCount}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleDownloadReport}
                    className="
                      mt-6
                      flex
                      items-center
                      gap-2
                      bg-[#0040e0]
                      text-white
                      px-5
                      py-3
                      rounded-xl
                      font-semibold
                      text-sm
                    "
                  >

                    <span className="material-symbols-outlined">
                      download
                    </span>

                    Download Report

                  </button>

                </div>
              )}

              {/* ================================================== */}
              {/* SETTINGS */}
              {/* ================================================== */}

              {activeTab === 'settings' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1000px] mx-auto">

                  <div className="mb-6">

                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Settings
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Manage portal settings and preferences.
                    </p>

                  </div>

                  <div className="space-y-5">

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                      <h2 className="font-bold text-lg">
                        Portal Settings
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Configure your sponsorship portal.
                      </p>

                      <div className="mt-5 space-y-4">

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                          <div>
                            <p className="font-semibold">
                              Email Notifications
                            </p>

                            <p className="text-xs text-slate-500">
                              Receive notifications for new applications.
                            </p>
                          </div>

                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5"
                          />

                        </div>

                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                          <div>
                            <p className="font-semibold">
                              Application Alerts
                            </p>

                            <p className="text-xs text-slate-500">
                              Show alerts for pending sponsor applications.
                            </p>
                          </div>

                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5"
                          />

                        </div>

                      </div>

                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">

                      <h2 className="font-bold text-lg">
                        System Information
                      </h2>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500">
                            Events
                          </p>
                          <p className="text-xl font-bold mt-1">
                            {events.length}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-500">
                            Applications
                          </p>
                          <p className="text-xl font-bold mt-1">
                            {applications.length}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ================================================== */}
              {/* STALL MANAGEMENT */}
              {/* ================================================== */}

              {activeTab === 'stall-management' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">

                  <div className="mb-6">

                    <h1 className="text-2xl font-extrabold text-slate-900">
                      Stall Management
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                      Select an event and manage the stalls available for sponsors.
                    </p>

                  </div>

                  {events.length === 0 ? (

                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

                      <span className="material-symbols-outlined text-5xl text-slate-300">
                        storefront
                      </span>

                      <h2 className="text-xl font-bold text-slate-900 mt-4">
                        No Events Available
                      </h2>

                      <p className="text-sm text-slate-500 mt-2">
                        Create an event first before managing stalls.
                      </p>

                      <button
                        onClick={() => {
                          setIsCreateEventOpen(true);
                        }}
                        className="
                          mt-6
                          bg-[#0040e0]
                          text-white
                          px-5 py-3
                          rounded-xl
                          font-semibold
                        "
                      >
                        Create Event
                      </button>

                    </div>

                  ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                      {events.map((event) => (

                        <div
                          key={event.id}
                          className="
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            p-6
                            shadow-sm
                          "
                        >

                          <div className="flex items-start justify-between">

                            <div>

                              <h3 className="font-bold text-lg text-slate-900">
                                {event.title}
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                {event.location}
                              </p>

                            </div>

                            <span className="material-symbols-outlined text-[#0040e0]">
                              storefront
                            </span>

                          </div>

                          <div className="mt-5 bg-blue-50 rounded-xl p-4">

                            <p className="text-xs font-bold uppercase text-blue-700">
                              Stall Management
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                              Manage stalls for this event.
                            </p>

                          </div>

                          <button
                            onClick={() => {
                              setSelectedDetailEvent(event);
                            }}
                            className="
                              mt-5
                              w-full
                              bg-[#0040e0]
                              text-white
                              py-2.5
                              rounded-xl
                              font-semibold
                              text-sm
                              hover:bg-[#2e5bff]
                            "
                          >
                            Open Event Stalls
                          </button>

                        </div>

                      ))}

                    </div>

                  )}

                </div>
              )}

            </>

          )}

          {/* ================================================== */}
          {/* ORGANIZER PORTAL */}
          {/* ================================================== */}

          {
            currentView ===
            'organizer' &&
            (
              role ===
              'admin' ||
              role ===
              'organizer'
            ) && (
              <>
                {
                  activeTab ===
                  'dashboard' && (

                    <OrganizerPortal
                      events={
                        events
                      }

                      applications={
                        applications
                      }

                      onOpenCreateEvent={
                        openCreateEvent
                      }

                      onApproveApplication={
                        handleApproveApplication
                      }

                      onRejectApplication={
                        handleRejectApplication
                      }

                      onOpenEventDetail={
                        (
                          event
                        ) =>
                          setSelectedDetailEvent(
                            event
                          )
                      }
                    />

                  )
                }

                {
                  activeTab !==
                  'dashboard' && activeTab !== 'stall-management' && (

                    <PortalTabContent
                      activeTab={
                        activeTab
                      }

                      currentView="organizer"

                      events={
                        events
                      }

                      applications={
                        applications
                      }

                      milestones={
                        milestones
                      }

                      onOpenCreateEvent={
                        openCreateEvent
                      }

                      onOpenEventDetail={
                        (
                          event
                        ) =>
                          setSelectedDetailEvent(
                            event
                          )
                      }

                      onOpenSponsor={
                        openSponsor
                      }

                      onApproveApplication={
                        handleApproveApplication
                      }

                      onRejectApplication={
                        handleRejectApplication
                      }

                      onDownloadReport={
                        handleDownloadReport
                      }
                    />

                  )
                }

                {activeTab === 'stall-management' && (
                  <StallManagement
                    eventStalls={eventStalls}
                    onRefresh={loadEventStalls}
                  />
                )}
                
              </>

            )
          }

          {/* ================================================= */}
          {/* SPONSOR */}
          {/* ================================================= */}

          {
            currentView ===
            'sponsor' &&
            role ===
            'sponsor' && (

              <>
                {
                  activeTab ===
                  'dashboard' && (

                    <SponsorPortal
                      events={
                        events
                      }

                      eventStalls={
                        eventStalls
                      }

                      mySponsorships={
                        applications
                      }

                      onOpenSponsor={
                        openSponsor
                      }

                      onOpenEventDetail={
                        (
                          event
                        ) =>
                          setSelectedDetailEvent(
                            event
                          )
                      }

                      onDownloadReport={
                        handleDownloadReport
                      }
                    />

                  )
                }

                {
                  activeTab !==
                  'dashboard' && (

                    <PortalTabContent
                      activeTab={
                        activeTab
                      }

                      currentView="sponsor"

                      events={
                        events
                      }

                      applications={
                        applications
                      }

                      milestones={
                        milestones
                      }

                      onOpenCreateEvent={
                        openCreateEvent
                      }

                      onOpenEventDetail={
                        (
                          event
                        ) =>
                          setSelectedDetailEvent(
                            event
                          )
                      }

                      onOpenSponsor={
                        openSponsor
                      }

                      onApproveApplication={
                        handleApproveApplication
                      }

                      onRejectApplication={
                        handleRejectApplication
                      }

                      onDownloadReport={
                        handleDownloadReport
                      }
                    />

                  )
                }
              </>

            )
          }

        </main>

      </div>

      {/* ================================================= */}
      {/* MOBILE NAV */}
      {/* ================================================= */}

      <MobileNav
        currentView={
          currentView
        }

        activeTab={
          activeTab
        }

        setActiveTab={
          setActiveTab
        }

        pendingCount={
          pendingAppsCount
        }
      />

      {/* ================================================= */}
      {/* CREATE EVENT MODAL */}
      {/* ================================================= */}

      <CreateEventModal
        isOpen={
          isCreateEventOpen &&
          canCreateEvent
        }

        onClose={() =>
          setIsCreateEventOpen(
            false
          )
        }

        onCreateEvent={
          handleCreateEvent
        }
      />

      {/* ================================================= */}
      {/* SPONSOR MODAL */}
      {/* ================================================= */}

      <SponsorModal
        event={
          selectedSponsorEvent
        }

        isOpen={
          !!selectedSponsorEvent &&
          isSponsor
        }

        onClose={() =>
          setSelectedSponsorEvent(
            null
          )
        }

        onSubmitSponsorship={
          handleSubmitSponsorship
        }
      />

      {/* ================================================= */}
      {/* EVENT DETAILS */}
      {/* ================================================= */}

      <EventDetailModal
        event={
          selectedDetailEvent
        }

        isOpen={
          !!selectedDetailEvent
        }

        onClose={() =>
          setSelectedDetailEvent(
            null
          )
        }

        onOpenSponsor={
          openSponsor
        }
      />

      {/* ================================================= */}
      {/* LOADING EVENTS */}
      {/* ================================================= */}

      {
        isLoadingEvents && (

          <div className="fixed bottom-20 right-4 lg:bottom-4 z-[60] px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-lg text-xs text-slate-500">
            Loading events...
          </div>

        )
      }

    </div>
  );
}