import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type StallLocation =
  | 'Main Stage'
  | 'Canteen Lawn'
  | 'MT Block Lawn';

type Stall = {
  number: string;
  location: StallLocation;
};

type StallReservation = {
  id: string;
  event_id: string;
  stall_number: string;
  location: StallLocation;
  sponsor_id: string;
  sponsor_name: string | null;
  sponsor_email: string | null;
  status: 'reserved' | 'cancelled';
  reserved_at: string;
};

interface StallMapProps {
  eventId: string;
  onReservationComplete?: (reservation: StallReservation) => void;
}

const STALLS: Stall[] = [
  // =====================================================
  // MAIN STAGE
  // =====================================================

  ...Array.from({ length: 81 }, (_, index) => ({
    number: String(index + 1),
    location: 'Main Stage' as StallLocation,
  })),

  // =====================================================
  // CANTEEN LAWN
  // =====================================================

  {
    number: '82',
    location: 'Canteen Lawn',
  },
  {
    number: '83A',
    location: 'Canteen Lawn',
  },
  {
    number: '83B',
    location: 'Canteen Lawn',
  },
  {
    number: '84',
    location: 'Canteen Lawn',
  },
  {
    number: '85',
    location: 'Canteen Lawn',
  },
  {
    number: '86',
    location: 'Canteen Lawn',
  },
  {
    number: '87',
    location: 'Canteen Lawn',
  },
  {
    number: '88',
    location: 'Canteen Lawn',
  },
  {
    number: '89',
    location: 'Canteen Lawn',
  },
  {
    number: '90',
    location: 'Canteen Lawn',
  },
  {
    number: '91',
    location: 'Canteen Lawn',
  },

  // =====================================================
  // MT BLOCK LAWN
  // =====================================================

  ...Array.from({ length: 30 }, (_, index) => ({
    number: String(index + 92),
    location: 'MT Block Lawn' as StallLocation,
  })),
];

const LOCATION_INFO: Record<
  StallLocation,
  {
    title: string;
    description: string;
  }
> = {
  'Main Stage': {
    title: 'Main Stage',
    description:
      'Stalls surrounding the main stage and Koshish Ground entrance.',
  },

  'Canteen Lawn': {
    title: 'Canteen Lawn',
    description:
      'Stalls located around the canteen lawn and shed area.',
  },

  'MT Block Lawn': {
    title: 'MT Block Lawn',
    description:
      'Stalls located around the MT Block and informal stage.',
  },
};

const LOCATIONS: StallLocation[] = [
  'Main Stage',
  'Canteen Lawn',
  'MT Block Lawn',
];

export const StallMap: React.FC<StallMapProps> = ({
  eventId,
  onReservationComplete,
}) => {
  const { user } = useAuth();

  const [selectedLocation, setSelectedLocation] =
    useState<StallLocation>('Main Stage');

  const [selectedStall, setSelectedStall] =
    useState<Stall | null>(null);

  const [reservations, setReservations] =
    useState<StallReservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [reserving, setReserving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  // =====================================================
  // LOAD RESERVATIONS
  // =====================================================

  const loadReservations = async () => {
    if (!eventId) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const {
        data,
        error: reservationError,
      } = await supabase
        .from('stall_reservations')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'reserved');

      if (reservationError) {
        console.error(
          'Error loading stall reservations:',
          reservationError
        );

        setError(
          reservationError.message ||
            'Unable to load stall reservations.'
        );

        setReservations([]);
        return;
      }

      setReservations(
        (data ?? []) as StallReservation[]
      );
    } catch (err: any) {
      console.error(
        'Unexpected reservation loading error:',
        err
      );

      setError(
        err?.message ||
          'Unable to load stall reservations.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadReservations();

    setSelectedStall(null);
    setSuccess('');
    setError('');
  }, [eventId]);

  // =====================================================
  // REAL-TIME RESERVATION UPDATES
  // =====================================================

  useEffect(() => {
    if (!eventId) return;

    const channel =
      supabase
        .channel(
          `stall-reservations-${eventId}`
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stall_reservations',
            filter: `event_id=eq.${eventId}`,
          },
          () => {
            loadReservations();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  // =====================================================
  // CURRENT LOCATION STALLS
  // =====================================================

  const locationStalls = useMemo(() => {
    return STALLS.filter(
      (stall) =>
        stall.location === selectedLocation
    );
  }, [selectedLocation]);

  // =====================================================
  // RESERVED STALL SET
  // =====================================================

  const reservedStalls = useMemo(() => {
    return new Set(
      reservations.map(
        (reservation) =>
          `${reservation.location}-${reservation.stall_number}`
      )
    );
  }, [reservations]);

  // =====================================================
  // CHECK WHETHER STALL IS RESERVED
  // =====================================================

  const isReserved = (stall: Stall) => {
    return reservedStalls.has(
      `${stall.location}-${stall.number}`
    );
  };

  // =====================================================
  // SELECT STALL
  // =====================================================

  const handleSelectStall = (stall: Stall) => {
    setError('');
    setSuccess('');

    if (isReserved(stall)) {
      return;
    }

    setSelectedStall(
      (previous) =>
        previous?.number === stall.number &&
        previous?.location === stall.location
          ? null
          : stall
    );
  };

  // =====================================================
  // RESERVE STALL
  // =====================================================

  const handleReserveStall = async () => {
    if (!selectedStall) {
      setError('Please select a stall first.');
      return;
    }

    if (!user) {
      setError(
        'You must be logged in to reserve a stall.'
      );
      return;
    }

    if (isReserved(selectedStall)) {
      setError(
        'This stall has already been reserved by another sponsor.'
      );

      setSelectedStall(null);

      await loadReservations();

      return;
    }

    try {
      setReserving(true);
      setError('');
      setSuccess('');

      const sponsorName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Sponsor';

      const sponsorEmail =
        user.email || '';

      const {
        data,
        error: reservationError,
      } = await supabase
        .from('stall_reservations')
        .insert({
          event_id: eventId,

          stall_number:
            selectedStall.number,

          location:
            selectedStall.location,

          sponsor_id:
            user.id,

          sponsor_name:
            sponsorName,

          sponsor_email:
            sponsorEmail,

          status:
            'reserved',
        })
        .select()
        .single();

      // =================================================
      // DOUBLE BOOKING PROTECTION
      // =================================================

      if (reservationError) {
        console.error(
          'Stall reservation failed:',
          reservationError
        );

        /*
         * PostgreSQL unique constraint violation.
         *
         * This happens if another sponsor reserved
         * the same stall before this request completed.
         */
        if (
          reservationError.code ===
          '23505'
        ) {
          setError(
            'Sorry, this stall was just reserved by another sponsor. Please choose another stall.'
          );

          setSelectedStall(null);

          await loadReservations();

          return;
        }

        setError(
          reservationError.message ||
            'Unable to reserve this stall.'
        );

        return;
      }

      if (!data) {
        setError(
          'The reservation was not returned by Supabase.'
        );

        return;
      }

      const reservation =
        data as StallReservation;

      // =================================================
      // UPDATE LOCAL STATE
      // =================================================

      setReservations(
        (previous) => [
          ...previous,
          reservation,
        ]
      );

      setSuccess(
        `Stall ${selectedStall.number} has been successfully reserved.`
      );

      setSelectedStall(null);

      if (onReservationComplete) {
        onReservationComplete(
          reservation
        );
      }
    } catch (err: any) {
      console.error(
        'Unexpected stall reservation error:',
        err
      );

      setError(
        err?.message ||
          'Unable to reserve the stall.'
      );
    } finally {
      setReserving(false);
    }
  };

  // =====================================================
  // CANCEL MY RESERVATION
  // =====================================================

  const handleCancelReservation = async (
    reservation: StallReservation
  ) => {
    if (!user) {
      return;
    }

    const confirmed =
      window.confirm(
        `Cancel your reservation for Stall ${reservation.stall_number}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setSuccess('');

      const {
        error: cancelError,
      } = await supabase
        .from('stall_reservations')
        .update({
          status: 'cancelled',
          cancelled_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          reservation.id
        )
        .eq(
          'sponsor_id',
          user.id
        );

      if (cancelError) {
        console.error(
          'Cancel reservation failed:',
          cancelError
        );

        setError(
          cancelError.message ||
            'Unable to cancel reservation.'
        );

        return;
      }

      setReservations(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              reservation.id
          )
      );

      setSuccess(
        `Stall ${reservation.stall_number} is now available again.`
      );
    } catch (err: any) {
      console.error(
        'Unexpected cancellation error:',
        err
      );

      setError(
        err?.message ||
          'Unable to cancel reservation.'
      );
    }
  };

  // =====================================================
  // MY RESERVATIONS
  // =====================================================

  const myReservations =
    reservations.filter(
      (reservation) =>
        reservation.sponsor_id ===
        user?.id
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Select Your Stall
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose an available stall for this
              event. Once reserved, another sponsor
              cannot select the same stall.
            </p>
          </div>

          {/* LEGEND */}

          <div className="flex flex-wrap gap-4 text-sm">

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-emerald-500" />
              <span>Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-blue-600" />
              <span>Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded bg-red-500" />
              <span>Reserved</span>
            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          LOCATION TABS
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">

          {LOCATIONS.map(
            (location) => (
              <button
                key={location}
                type="button"
                onClick={() => {
                  setSelectedLocation(
                    location
                  );

                  setSelectedStall(
                    null
                  );

                  setError('');
                  setSuccess('');
                }}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  selectedLocation ===
                  location
                    ? 'bg-[#0040e0] text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {LOCATION_INFO[location].title}
              </button>
            )
          )}

        </div>

      </div>

      {/* =================================================
          LOCATION DESCRIPTION
      ================================================= */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="font-bold text-blue-950">
          {
            LOCATION_INFO[
              selectedLocation
            ].title
          }
        </h3>

        <p className="mt-1 text-sm text-blue-700">
          {
            LOCATION_INFO[
              selectedLocation
            ].description
          }
        </p>

      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {/* =================================================
          STALL MAP
      ================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {
                LOCATION_INFO[
                  selectedLocation
                ].title
              }{' '}
              Stall Map
            </h3>

            <p className="text-sm text-slate-500">
              {locationStalls.length}{' '}
              stalls
            </p>
          </div>

          {loading && (
            <span className="text-sm font-semibold text-slate-500">
              Loading reservations...
            </span>
          )}

        </div>

        {/* =================================================
            MAIN STAGE MAP
        ================================================= */}

        {selectedLocation ===
          'Main Stage' && (
          <div className="space-y-8">

            {/* TOP STALLS */}

            <div>

              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Stall Row
              </p>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12">

                {Array.from(
                  {
                    length: 17,
                  },
                  (_, index) =>
                    String(
                      40 + index
                    )
                ).map(
                  (number) => {
                    const stall =
                      STALLS.find(
                        (item) =>
                          item.location ===
                            'Main Stage' &&
                          item.number ===
                            number
                      );

                    if (!stall) {
                      return null;
                    }

                    return (
                      <StallButton
                        key={number}
                        stall={stall}
                        reserved={isReserved(
                          stall
                        )}
                        selected={
                          selectedStall?.number ===
                            stall.number &&
                          selectedStall?.location ===
                            stall.location
                        }
                        onClick={() =>
                          handleSelectStall(
                            stall
                          )
                        }
                      />
                    );
                  }
                )}

              </div>
            </div>

            {/* STAGE */}

            <div className="flex justify-center">

              <div className="w-full max-w-md rounded-2xl border-4 border-slate-300 bg-slate-100 px-8 py-8 text-center">

                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Main Stage
                </div>

                <div className="mt-2 text-xl font-black text-slate-700">
                  STAGE
                </div>

              </div>

            </div>

            {/* LEFT / RIGHT STALLS */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">

              {[
                ...Array.from(
                  {
                    length: 23,
                  },
                  (_, index) =>
                    String(
                      17 + index
                    )
                ),
                ...Array.from(
                  {
                    length: 25,
                  },
                  (_, index) =>
                    String(
                      57 + index
                    )
                ),
              ].map(
                (number) => {
                  const stall =
                    STALLS.find(
                      (item) =>
                        item.location ===
                          'Main Stage' &&
                        item.number ===
                          number
                    );

                  if (!stall) {
                    return null;
                  }

                  return (
                    <StallButton
                      key={number}
                      stall={stall}
                      reserved={isReserved(
                        stall
                      )}
                      selected={
                        selectedStall?.number ===
                          stall.number &&
                        selectedStall?.location ===
                          stall.location
                      }
                      onClick={() =>
                        handleSelectStall(
                          stall
                        )
                      }
                    />
                  );
                }
              )}

            </div>

            {/* LOWER ROW */}

            <div>

              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                Lower Stall Row
              </p>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12">

                {Array.from(
                  {
                    length: 16,
                  },
                  (_, index) =>
                    String(
                      16 - index
                    )
                ).map(
                  (number) => {
                    const stall =
                      STALLS.find(
                        (item) =>
                          item.location ===
                            'Main Stage' &&
                          item.number ===
                            number
                      );

                    if (!stall) {
                      return null;
                    }

                    return (
                      <StallButton
                        key={number}
                        stall={stall}
                        reserved={isReserved(
                          stall
                        )}
                        selected={
                          selectedStall?.number ===
                            stall.number &&
                          selectedStall?.location ===
                            stall.location
                        }
                        onClick={() =>
                          handleSelectStall(
                            stall
                          )
                        }
                      />
                    );
                  }
                )}

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            CANTEEN LAWN MAP
        ================================================= */}

        {selectedLocation ===
          'Canteen Lawn' && (
          <div className="mx-auto max-w-3xl">

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {[
                '89',
                '90',
                '88',
                '91',
                '87',
                '86',
                '85',
                '82',
                '84',
                '83A',
                '83B',
              ].map(
                (number) => {
                  const stall =
                    STALLS.find(
                      (item) =>
                        item.location ===
                          'Canteen Lawn' &&
                        item.number ===
                          number
                    );

                  if (!stall) {
                    return null;
                  }

                  return (
                    <StallButton
                      key={number}
                      stall={stall}
                      reserved={isReserved(
                        stall
                      )}
                      selected={
                        selectedStall?.number ===
                          stall.number &&
                        selectedStall?.location ===
                          stall.location
                      }
                      onClick={() =>
                        handleSelectStall(
                          stall
                        )
                      }
                    />
                  );
                }
              )}

            </div>

            <div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">

              <p className="font-bold text-slate-600">
                SHED
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Way for Entry
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            MT BLOCK LAWN MAP
        ================================================= */}

        {selectedLocation ===
          'MT Block Lawn' && (
          <div className="space-y-6">

            {/* TOP ROW */}

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">

              {Array.from(
                {
                  length: 10,
                },
                (_, index) =>
                  String(
                    111 - index
                  )
              ).map(
                (number) => {
                  const stall =
                    STALLS.find(
                      (item) =>
                        item.location ===
                          'MT Block Lawn' &&
                        item.number ===
                          number
                    );

                  if (!stall) {
                    return null;
                  }

                  return (
                    <StallButton
                      key={number}
                      stall={stall}
                      reserved={isReserved(
                        stall
                      )}
                      selected={
                        selectedStall?.number ===
                          stall.number &&
                        selectedStall?.location ===
                          stall.location
                      }
                      onClick={() =>
                        handleSelectStall(
                          stall
                        )
                      }
                    />
                  );
                }
              )}

            </div>

            {/* CENTER */}

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">

                {Array.from(
                  {
                    length: 10,
                  },
                  (_, index) =>
                    String(
                      112 + index
                    )
                ).map(
                  (number) => {
                    const stall =
                      STALLS.find(
                        (item) =>
                          item.location ===
                            'MT Block Lawn' &&
                          item.number ===
                            number
                      );

                    if (!stall) {
                      return null;
                    }

                    return (
                      <StallButton
                        key={number}
                        stall={stall}
                        reserved={isReserved(
                          stall
                        )}
                        selected={
                          selectedStall?.number ===
                            stall.number &&
                          selectedStall?.location ===
                            stall.location
                        }
                        onClick={() =>
                          handleSelectStall(
                            stall
                          )
                        }
                      />
                    );
                  }
                )}

              </div>

              <div className="space-y-2">

                {Array.from(
                  {
                    length: 10,
                  },
                  (_, index) =>
                    String(
                      101 - index
                    )
                ).map(
                  (number) => {
                    const stall =
                      STALLS.find(
                        (item) =>
                          item.location ===
                            'MT Block Lawn' &&
                          item.number ===
                            number
                      );

                    if (!stall) {
                      return null;
                    }

                    return (
                      <StallButton
                        key={number}
                        stall={stall}
                        reserved={isReserved(
                          stall
                        )}
                        selected={
                          selectedStall?.number ===
                            stall.number &&
                          selectedStall?.location ===
                            stall.location
                        }
                        onClick={() =>
                          handleSelectStall(
                            stall
                          )
                        }
                      />
                    );
                  }
                )}

              </div>

            </div>

            {/* LOWER ROW */}

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">

              {Array.from(
                {
                  length: 10,
                },
                (_, index) =>
                  String(
                    92 + index
                  )
              ).map(
                (number) => {
                  const stall =
                    STALLS.find(
                      (item) =>
                        item.location ===
                          'MT Block Lawn' &&
                        item.number ===
                          number
                    );

                  if (!stall) {
                    return null;
                  }

                  return (
                    <StallButton
                      key={number}
                      stall={stall}
                      reserved={isReserved(
                        stall
                      )}
                      selected={
                        selectedStall?.number ===
                          stall.number &&
                        selectedStall?.location ===
                          stall.location
                      }
                      onClick={() =>
                        handleSelectStall(
                          stall
                        )
                      }
                    />
                  );
                }
              )}

            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">

              <p className="font-bold text-slate-700">
                MT BLOCK
              </p>

              <p className="mt-1 text-xs text-slate-500">
                INFORMAL STAGE
              </p>

            </div>

          </div>
        )}

      </div>

      {/* =================================================
          SELECTED STALL
      ================================================= */}

      {selectedStall && (
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Selected Stall
              </p>

              <h3 className="mt-1 text-2xl font-black text-blue-950">
                Stall{' '}
                {selectedStall.number}
              </h3>

              <p className="mt-1 text-sm text-blue-700">
                {
                  selectedStall.location
                }
              </p>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setSelectedStall(
                    null
                  )
                }
                disabled={reserving}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleReserveStall
                }
                disabled={reserving}
                className="rounded-xl bg-[#0040e0] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0034ba] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reserving
                  ? 'Reserving...'
                  : 'Reserve This Stall'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          MY RESERVATIONS
      ================================================= */}

      {myReservations.length >
        0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4">

            <h3 className="text-lg font-bold text-slate-900">
              My Reserved Stalls
            </h3>

            <p className="text-sm text-slate-500">
              Stalls currently reserved by
              your account.
            </p>

          </div>

          <div className="space-y-3">

            {myReservations.map(
              (reservation) => (
                <div
                  key={
                    reservation.id
                  }
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p className="font-bold text-slate-900">
                      Stall{' '}
                      {
                        reservation.stall_number
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        reservation.location
                      }
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCancelReservation(
                        reservation
                      )
                    }
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Cancel Reservation
                  </button>

                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
};

// =======================================================
// STALL BUTTON
// =======================================================

interface StallButtonProps {
  stall: Stall;
  reserved: boolean;
  selected: boolean;
  onClick: () => void;
}

const StallButton: React.FC<
  StallButtonProps
> = ({
  stall,
  reserved,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={reserved}
      title={
        reserved
          ? `Stall ${stall.number} is already reserved`
          : `Select Stall ${stall.number}`
      }
      className={`
        relative
        min-h-[58px]
        rounded-xl
        border-2
        px-2
        py-3
        text-center
        transition-all
        duration-200

        ${
          reserved
            ? 'cursor-not-allowed border-red-300 bg-red-500 text-white opacity-90'
            : selected
            ? 'border-blue-700 bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 scale-[1.02]'
            : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-md'
        }
      `}
    >

      <div className="text-[10px] font-bold uppercase opacity-80">
        Stall
      </div>

      <div className="text-lg font-black">
        {stall.number}
      </div>

      {reserved && (
        <div className="mt-0.5 text-[9px] font-bold uppercase">
          Reserved
        </div>
      )}

      {selected && !reserved && (
        <div className="mt-0.5 text-[9px] font-bold uppercase">
          Selected
        </div>
      )}

    </button>
  );
};

export default StallMap;