import React from 'react';
import { motion } from 'motion/react';
import { CampusEvent } from '../types';

interface EventDetailModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSponsor: (event: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onOpenSponsor
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Banner */}
        <div className="relative h-48 bg-slate-800 overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-md mb-1.5">
              {event.category}
            </span>
            <h2 className="text-2xl font-bold text-white leading-tight">{event.title}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {event.college} ({event.location})
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">{event.dateRange}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Reach</p>
              <p className="text-xs font-semibold text-[#0040e0] mt-0.5">{event.expectedReach}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Goal Progress</p>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">{event.sponsorshipGoalMet}% Funded</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">About Event</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{event.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Sponsorship Packages</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.tiers.map((tier) => (
                <div key={tier.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900 text-sm">{tier.name}</span>
                    <span className="font-code font-bold text-[#0040e0] text-sm">₹{tier.price.toLocaleString('en-IN')}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-600 text-xs">check_circle</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm text-[#00677f]">verified</span>
            <span>Verified Campus Bridge Sponsorship Partner</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSponsor(event);
              }}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0040e0] hover:bg-[#2e5bff] rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">handshake</span>
              Sponsor Event
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
