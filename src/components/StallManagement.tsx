import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

interface StallManagementProps {
  events?: any[];
  eventStalls?: Record<string, unknown[]>;
  onRefresh?: () => void | Promise<void>;
}

interface Stall {
  id: string;
  event_id: string;
  stall_name: string;
  row_number?: number | null;
  column_number?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  width?: number | null;
  height?: number | null;
  status: 'available' | 'reserved';
  sponsor_id?: string | null;
  sponsor_name?: string | null;
  sponsor_email?: string | null;
  reserved_at?: string | null;
}

export const StallManagement: React.FC<StallManagementProps> = ({
  events = [],
}) => {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /*
   * --------------------------------------------------
   * LOAD EVENTS
   * --------------------------------------------------
   */

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(String(events[0].id));
    }
  }, [events, selectedEventId]);

  /*
   * --------------------------------------------------
   * LOAD STALLS
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!selectedEventId) {
      setStalls([]);
      return;
    }

    loadStalls(selectedEventId);
  }, [selectedEventId]);

  const loadStalls = async (eventId: string) => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      console.log(
        'Loading stalls for event:',
        eventId
      );

      /*
       * We use a LEFT JOIN style query through
       * Supabase relationships if available.
       *
       * If your table does not have relationships,
       * the fallback query below still works.
       */

      const {
        data,
        error: stallError,
      } = await supabase
        .from('event_stalls')
        .select('*')
        .eq('event_id', eventId)
        .order('stall_name', {
          ascending: true,
        });

      if (stallError) {
        console.error(
          'Error loading stalls:',
          stallError
        );

        setError(
          `Could not load stalls: ${stallError.message}`
        );

        setStalls([]);
        return;
      }

      const formattedStalls: Stall[] = (
        data || []
      ).map((stall: any) => ({
        id: String(stall.id),

        event_id: String(
          stall.event_id
        ),

        stall_name:
          stall.stall_name ??
          stall.name ??
          `Stall ${stall.id}`,

        row_number:
          stall.row_number ??
          null,

        column_number:
          stall.column_number ??
          null,

        position_x:
          stall.position_x ??
          null,

        position_y:
          stall.position_y ??
          null,

        width:
          stall.width ??
          null,

        height:
          stall.height ??
          null,

        status:
          stall.status === 'reserved'
            ? 'reserved'
            : 'available',

        sponsor_id:
          stall.sponsor_id ??
          null,

        sponsor_name:
          stall.sponsor_name ??
          null,

        sponsor_email:
          stall.sponsor_email ??
          null,

        reserved_at:
          stall.reserved_at ??
          null,
      }));

      setStalls(formattedStalls);

    } catch (err: any) {
      console.error(
        'Unexpected stall loading error:',
        err
      );

      setError(
        err?.message ??
        'Unable to load stalls.'
      );

      setStalls([]);

    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * RESERVE STALL
   * --------------------------------------------------
   */

  const reserveStall = async (
    stall: Stall
  ) => {
    try {
      setError('');
      setMessage('');

      /*
       * Double check current database state
       * before attempting reservation.
       */

      const {
        data: currentStall,
        error: checkError,
      } = await supabase
        .from('event_stalls')
        .select('*')
        .eq('id', stall.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (
        currentStall?.status ===
        'reserved'
      ) {
        setError(
          'This stall has already been reserved.'
        );

        await loadStalls(
          selectedEventId
        );

        return;
      }

      /*
       * Admin reservation.
       *
       * Since this page is intended for admin
       * stall management, we reserve the stall
       * without assigning a sponsor.
       */

      const {
        error: updateError,
      } = await supabase
        .from('event_stalls')
        .update({
          status: 'reserved',
          reserved_at:
            new Date().toISOString(),
        })
        .eq('id', stall.id)
        .eq(
          'status',
          'available'
        );

      if (updateError) {
        throw updateError;
      }

      setMessage(
        `${stall.stall_name} has been reserved.`
      );

      setSelectedStall(null);

      await loadStalls(
        selectedEventId
      );

    } catch (err: any) {
      console.error(
        'Reserve stall error:',
        err
      );

      setError(
        err?.message ??
        'Unable to reserve stall.'
      );
    }
  };

  /*
   * --------------------------------------------------
   * RELEASE STALL
   * --------------------------------------------------
   */

  const releaseStall = async (
    stall: Stall
  ) => {
    try {
      setError('');
      setMessage('');

      const confirmed =
        window.confirm(
          `Release ${stall.stall_name}?`
        );

      if (!confirmed) {
        return;
      }

      const {
        error: updateError,
      } = await supabase
        .from('event_stalls')
        .update({
          status: 'available',
          sponsor_id: null,
          sponsor_name: null,
          sponsor_email: null,
          reserved_at: null,
        })
        .eq(
          'id',
          stall.id
        );

      if (updateError) {
        throw updateError;
      }

      setMessage(
        `${stall.stall_name} is now available.`
      );

      setSelectedStall(null);

      await loadStalls(
        selectedEventId
      );

    } catch (err: any) {
      console.error(
        'Release stall error:',
        err
      );

      setError(
        err?.message ??
        'Unable to release stall.'
      );
    }
  };

  /*
   * --------------------------------------------------
   * STATISTICS
   * --------------------------------------------------
   */

  const totalStalls =
    stalls.length;

  const reservedStalls =
    stalls.filter(
      (stall) =>
        stall.status ===
        'reserved'
    ).length;

  const availableStalls =
    stalls.filter(
      (stall) =>
        stall.status ===
        'available'
    ).length;

  /*
   * --------------------------------------------------
   * GRID ORGANIZATION
   * --------------------------------------------------
   */

  const gridStalls = useMemo(() => {
    return [...stalls].sort(
      (a, b) =>
        String(
          a.stall_name
        ).localeCompare(
          String(
            b.stall_name
          ),
          undefined,
          {
            numeric: true,
          }
        )
    );
  }, [stalls]);

  /*
   * --------------------------------------------------
   * NO EVENTS
   * --------------------------------------------------
   */

  if (
    events.length === 0
  ) {
    return (
      <div className="p-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-slate-300">
            event_busy
          </span>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            No Events Available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create an event first before managing stalls.
          </p>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * MAIN UI
   * --------------------------------------------------
   */

  return (
    <div className="p-6 md:p-8 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700">
                map
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Stall Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage event stalls and reservations
              </p>
            </div>

          </div>
        </div>

        {/* EVENT SELECTOR */}

        <div className="flex items-center gap-3">

          <label className="text-sm font-semibold text-slate-600">
            Event
          </label>

          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(
                e.target.value
              );
              setSelectedStall(null);
              setMessage('');
              setError('');
            }}
            className="min-w-[260px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >

            {events.map(
              (event: any) => (
                <option
                  key={event.id}
                  value={String(
                    event.id
                  )}
                >
                  {event.title}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ALERTS */}

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">

          <span className="material-symbols-outlined">
            check_circle
          </span>

          {message}

        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

          <span className="material-symbols-outlined">
            error
          </span>

          {error}

        </div>
      )}

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Stalls
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalStalls}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-600">
                grid_view
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available
              </p>

              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {availableStalls}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600">
                event_available
              </span>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reserved
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {reservedStalls}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600">
                event_busy
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* LEGEND */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600">

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-emerald-500" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-500" />
            Reserved
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-600" />
            Selected
          </div>

        </div>

      </div>

      {/* STALL AREA */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Stall Layout
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Click a stall to view or manage it.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadStalls(
                  selectedEventId
                )
              }
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >

              <span className="material-symbols-outlined text-lg">
                refresh
              </span>

              Refresh

            </button>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="p-16 text-center">

            <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
              progress_activity
            </span>

            <p className="mt-3 text-sm text-slate-500">
              Loading stalls...
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          stalls.length === 0 && (
            <div className="p-16 text-center">

              <span className="material-symbols-outlined text-5xl text-slate-300">
                grid_off
              </span>

              <h3 className="mt-4 text-lg font-bold text-slate-700">
                No stalls found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No stalls have been created for this event yet.
              </p>

            </div>
          )}

        {/* STALL GRID */}

        {!loading &&
          stalls.length > 0 && (

            <div className="p-6">

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

                {gridStalls.map(
                  (stall) => {

                    const isSelected =
                      selectedStall?.id ===
                      stall.id;

                    const isReserved =
                      stall.status ===
                      'reserved';

                    return (
                      <button
                        key={stall.id}
                        type="button"
                        onClick={() =>
                          setSelectedStall(
                            stall
                          )
                        }
                        className={`
                          relative
                          min-h-[120px]
                          rounded-2xl
                          border-2
                          p-4
                          text-left
                          transition-all
                          ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100 scale-[1.02]'
                              : isReserved
                              ? 'border-red-200 bg-red-50 hover:border-red-400'
                              : 'border-emerald-200 bg-emerald-50 hover:border-emerald-500 hover:shadow-md'
                          }
                        `}
                      >

                        <div className="flex items-start justify-between gap-2">

                          <span
                            className={`
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                              ${
                                isReserved
                                  ? 'text-red-600'
                                  : 'text-emerald-600'
                              }
                            `}
                          >
                            Stall
                          </span>

                          <span className="material-symbols-outlined text-xl">
                            {isReserved
                              ? 'lock'
                              : 'storefront'}
                          </span>

                        </div>

                        <p className="mt-3 text-lg font-extrabold text-slate-900">
                          {stall.stall_name}
                        </p>

                        <p
                          className={`
                            mt-2
                            text-xs
                            font-bold
                            ${
                              isReserved
                                ? 'text-red-600'
                                : 'text-emerald-600'
                            }
                          `}
                        >
                          {isReserved
                            ? 'RESERVED'
                            : 'AVAILABLE'}
                        </p>

                        {stall.sponsor_name && (
                          <p className="mt-2 text-xs text-slate-600 truncate">
                            {stall.sponsor_name}
                          </p>
                        )}

                      </button>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </div>

      {/* SELECTED STALL DETAILS */}

      {selectedStall && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Stall
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {selectedStall.stall_name}
              </h2>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedStall(null)
              }
              className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>

          </div>

          <div className="p-6">

            {selectedStall.status ===
              'available' ? (

              <div>

                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-5">

                  <div className="flex items-center gap-3">

                    <span className="material-symbols-outlined text-emerald-600">
                      check_circle
                    </span>

                    <div>
                      <p className="font-bold text-emerald-800">
                        Stall Available
                      </p>

                      <p className="text-sm text-emerald-700 mt-1">
                        This stall is currently available for reservation.
                      </p>
                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    reserveStall(
                      selectedStall
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
                >

                  <span className="material-symbols-outlined">
                    lock
                  </span>

                  Reserve Stall

                </button>

              </div>

            ) : (

              <div>

                <div className="rounded-xl bg-red-50 border border-red-200 p-5 mb-5">

                  <div className="flex items-start gap-3">

                    <span className="material-symbols-outlined text-red-600">
                      lock
                    </span>

                    <div className="min-w-0">

                      <p className="font-bold text-red-800">
                        Stall Reserved
                      </p>

                      {selectedStall.sponsor_name && (
                        <p className="text-sm text-red-700 mt-2">
                          Sponsor:{' '}
                          <strong>
                            {
                              selectedStall.sponsor_name
                            }
                          </strong>
                        </p>
                      )}

                      {selectedStall.sponsor_email && (
                        <p className="text-sm text-red-700 mt-1">
                          Email:{' '}
                          {
                            selectedStall.sponsor_email
                          }
                        </p>
                      )}

                      {selectedStall.reserved_at && (
                        <p className="text-xs text-red-600 mt-2">
                          Reserved:{' '}
                          {new Date(
                            selectedStall.reserved_at
                          ).toLocaleString()}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    releaseStall(
                      selectedStall
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-6 py-3 font-bold text-red-600 hover:bg-red-50 transition-colors"
                >

                  <span className="material-symbols-outlined">
                    lock_open
                  </span>

                  Release Stall

                </button>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default StallManagement;