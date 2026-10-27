import React, { useMemo, useState } from 'react';

export interface Stall {
  id: string;
  label: string;
  area: 'Main Stage' | 'Canteen Lawn' | 'MT Block Lawn';
  row: number;
  col: number;
  width?: number;
  height?: number;
}

interface StallSelectorProps {
  stalls: Stall[];
  reservedStallIds: string[];
  selectedStallId: string | null;
  onSelectStall: (stall: Stall) => void;
  disabled?: boolean;
}

/*
 * Layout extracted from:
 * Stalls Layout 2026(2).xlsx
 *
 * The row/column values preserve the approximate position
 * of the stalls in the Excel sheet.
 */

export const EXCEL_STALL_LAYOUT: Stall[] = [
  // =====================================================
  // MAIN STAGE
  // =====================================================

  ...Array.from({ length: 17 }, (_, i) => ({
    id: String(40 + i),
    label: String(40 + i),
    area: 'Main Stage' as const,
    row: 1,
    col: i + 4,
  })),

  ...Array.from({ length: 10 }, (_, i) => ({
    id: String(39 - i),
    label: String(39 - i),
    area: 'Main Stage' as const,
    row: i + 2,
    col: 3,
  })),

  ...Array.from({ length: 25 }, (_, i) => ({
    id: String(57 + i),
    label: String(57 + i),
    area: 'Main Stage' as const,
    row: i + 2,
    col: 22,
  })),

  ...Array.from({ length: 14 }, (_, i) => ({
    id: String(14 - i),
    label: String(14 - i),
    area: 'Main Stage' as const,
    row: 29,
    col: i + 5,
  })),

  ...Array.from({ length: 16 }, (_, i) => ({
    id: String(30 - i),
    label: String(30 - i),
    area: 'Main Stage' as const,
    row: i + 17,
    col: 3,
  })),

  ...Array.from({ length: 25 }, (_, i) => ({
    id: String(25 + i),
    label: String(25 + i),
    area: 'Main Stage' as const,
    row: i + 3,
    col: 22,
  })),

  // =====================================================
  // CANTEEN LAWN
  // =====================================================

  {
    id: '89',
    label: '89',
    area: 'Canteen Lawn',
    row: 1,
    col: 4,
  },
  {
    id: '90',
    label: '90',
    area: 'Canteen Lawn',
    row: 1,
    col: 6,
  },
  {
    id: '88',
    label: '88',
    area: 'Canteen Lawn',
    row: 2,
    col: 3,
  },
  {
    id: '91',
    label: '91',
    area: 'Canteen Lawn',
    row: 2,
    col: 8,
  },
  {
    id: '87',
    label: '87',
    area: 'Canteen Lawn',
    row: 4,
    col: 3,
  },
  {
    id: '86',
    label: '86',
    area: 'Canteen Lawn',
    row: 6,
    col: 3,
  },
  {
    id: '85',
    label: '85',
    area: 'Canteen Lawn',
    row: 8,
    col: 3,
  },
  {
    id: '84',
    label: '84',
    area: 'Canteen Lawn',
    row: 10,
    col: 4,
  },
  {
    id: '83A',
    label: '83 A',
    area: 'Canteen Lawn',
    row: 10,
    col: 7,
  },
  {
    id: '83B',
    label: '83 B',
    area: 'Canteen Lawn',
    row: 10,
    col: 6,
  },
  {
    id: '82',
    label: '82',
    area: 'Canteen Lawn',
    row: 9,
    col: 8,
  },

  // =====================================================
  // MT BLOCK LAWN
  // =====================================================

  ...Array.from({ length: 10 }, (_, i) => ({
    id: String(111 - i),
    label: String(111 - i),
    area: 'MT Block Lawn' as const,
    row: 1,
    col: i + 4,
  })),

  ...Array.from({ length: 10 }, (_, i) => ({
    id: String(112 + i),
    label: String(112 + i),
    area: 'MT Block Lawn' as const,
    row: i + 2,
    col: 3,
  })),

  ...Array.from({ length: 10 }, (_, i) => ({
    id: String(101 - i),
    label: String(101 - i),
    area: 'MT Block Lawn' as const,
    row: i + 2,
    col: 14,
  })),
];

export const StallSelector: React.FC<StallSelectorProps> = ({
  stalls,
  reservedStallIds,
  selectedStallId,
  onSelectStall,
  disabled = false,
}) => {
  const [area, setArea] =
    useState<Stall['area']>('Main Stage');

  const areaStalls = useMemo(
    () =>
      stalls.filter(
        (stall) => stall.area === area
      ),
    [stalls, area]
  );

  const reserved = new Set(
    reservedStallIds.map(String)
  );

  const maxRow = Math.max(
    ...areaStalls.map((s) => s.row),
    1
  );

  const maxCol = Math.max(
    ...areaStalls.map((s) => s.col),
    10
  );

  return (
    <div className="space-y-5">

      {/* AREA SELECTOR */}

      <div className="flex flex-wrap gap-2">

        {(
          [
            'Main Stage',
            'Canteen Lawn',
            'MT Block Lawn',
          ] as Stall['area'][]
        ).map((item) => (

          <button
            key={item}
            type="button"
            onClick={() => setArea(item)}
            className={`
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-bold
              border
              transition-all
              ${
                area === item
                  ? 'bg-[#0040e0] text-white border-[#0040e0]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#0040e0]'
              }
            `}
          >
            {item}
          </button>

        ))}

      </div>

      {/* LEGEND */}

      <div className="flex flex-wrap gap-5 text-xs font-semibold">

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-blue-600" />
          Selected
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-100 border border-red-400" />
          Reserved
        </div>

      </div>

      {/* MAP */}

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-auto">

        <div
          className="relative min-w-[850px]"
          style={{
            height: `${Math.max(450, maxRow * 48)}px`,
          }}
        >

          {/* STAGE */}

          {area === 'Main Stage' && (
            <div
              className="
                absolute
                left-[38%]
                top-[18%]
                w-[25%]
                h-16
                rounded-xl
                bg-slate-800
                text-white
                flex
                items-center
                justify-center
                font-extrabold
                tracking-wide
              "
            >
              MAIN STAGE
            </div>
          )}

          {/* ENTRY */}

          <div
            className="
              absolute
              bottom-3
              left-1/2
              -translate-x-1/2
              px-5
              py-2
              rounded-full
              bg-slate-200
              text-slate-600
              text-xs
              font-bold
            "
          >
            ENTRY
          </div>

          {/* STALLS */}

          {areaStalls.map((stall) => {

            const isReserved =
              reserved.has(String(stall.id));

            const isSelected =
              selectedStallId === stall.id;

            return (
              <button
                key={`${area}-${stall.id}`}
                type="button"
                disabled={
                  disabled ||
                  isReserved
                }
                onClick={() =>
                  onSelectStall(stall)
                }
                className={`
                  absolute
                  w-12
                  h-10
                  rounded-lg
                  border-2
                  text-xs
                  font-extrabold
                  transition-all
                  ${
                    isReserved
                      ? `
                        bg-red-100
                        border-red-400
                        text-red-600
                        cursor-not-allowed
                      `
                      : isSelected
                      ? `
                        bg-[#0040e0]
                        border-[#0040e0]
                        text-white
                        scale-110
                        shadow-lg
                        z-20
                      `
                      : `
                        bg-emerald-50
                        border-emerald-400
                        text-emerald-700
                        hover:bg-emerald-100
                        hover:scale-105
                      `
                  }
                `}
                style={{
                  left: `${stall.col * 52}px`,
                  top: `${stall.row * 42}px`,
                }}
                title={
                  isReserved
                    ? `Stall ${stall.label} is already reserved`
                    : `Select Stall ${stall.label}`
                }
              >
                {stall.label}
              </button>
            );
          })}

        </div>

      </div>

      {/* SELECTED STALL */}

      {selectedStallId && (

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Selected Stall
          </p>

          <p className="text-xl font-extrabold text-blue-900 mt-1">
            Stall {selectedStallId}
          </p>

          <p className="text-sm text-blue-700 mt-1">
            {area}
          </p>

        </div>

      )}

    </div>
  );
};