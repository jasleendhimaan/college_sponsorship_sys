import React, { useEffect, useState } from 'react';
import { CampusEvent } from '../types';

interface SponsorModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;

  onSubmitSponsorship: (
    eventId: string,
    sponsorName: string,
    amount: number,
    email: string
  ) => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({
  event,
  isOpen,
  onClose,
  onSubmitSponsorship,
}) => {
  const [sponsorName, setSponsorName] =
    useState('TechCorp Global');

  const [email, setEmail] =
    useState('sponsorships@techcorp.com');

  const [amount, setAmount] =
    useState<string>('10000');

  useEffect(() => {
    if (event) {
      setAmount('10000');
      setSponsorName('TechCorp Global');
      setEmail('sponsorships@techcorp.com');
    }
  }, [event]);

  if (!isOpen || !event) {
    return null;
  }

  const numericAmount =
    Number(amount) || 0;

  const isValidAmount =
    numericAmount >= 10000;

  const handleSubmit = () => {
    if (!sponsorName.trim()) {
      alert('Please enter company / sponsor name.');
      return;
    }

    if (!email.trim()) {
      alert('Please enter contact email.');
      return;
    }

    if (!numericAmount || numericAmount < 10000) {
      alert(
        'Minimum sponsorship amount is ₹10,000.'
      );
      return;
    }

    onSubmitSponsorship(
      event.id,
      sponsorName.trim(),
      numericAmount,
      email.trim()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-slate-200">

          <div className="flex items-start justify-between">

            <div>

              <span className="inline-flex px-3 py-1 rounded-full border border-cyan-300 bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-wider">
                {event.category}
              </span>

              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Sponsor {event.title}
              </h2>

              <p className="text-sm text-slate-500">
                {event.college} • {event.dateRange}
              </p>

            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                close
              </span>
            </button>

          </div>

        </div>


        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* SPONSORSHIP AMOUNT */}
          <div>

            <div className="flex items-center justify-between mb-3">

              <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide">
                Sponsorship Amount *
              </label>

              <span className="text-sm font-bold text-emerald-600">
                Minimum ₹10,000
              </span>

            </div>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">
                ₹
              </span>

              <input
                type="number"
                min="10000"
                step="1000"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter sponsorship amount"
                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-[#0040e0] focus:ring-2 focus:ring-blue-100 outline-none text-xl font-bold"
              />

            </div>

            <p className="text-sm text-slate-500 mt-2">
              Enter ₹10,000 or any higher amount of your choice.
            </p>

            {amount &&
              numericAmount < 10000 && (
                <p className="text-sm text-red-600 font-semibold mt-2">
                  Sponsorship amount must be at least ₹10,000.
                </p>
              )}

          </div>


          {/* SPONSOR DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">
                Company / Sponsor Name *
              </label>

              <input
                type="text"
                value={sponsorName}
                onChange={(e) =>
                  setSponsorName(e.target.value)
                }
                placeholder="Enter company name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0040e0] focus:ring-2 focus:ring-blue-100 outline-none"
              />

            </div>


            <div>

              <label className="block text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">
                Contact Email *
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0040e0] focus:ring-2 focus:ring-blue-100 outline-none"
              />

            </div>

          </div>


          {/* PAYMENT SUMMARY */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-slate-500">
                  Sponsorship
                </p>

                <p className="text-3xl font-extrabold text-slate-900">
                  ₹
                  {numericAmount.toLocaleString(
                    'en-IN'
                  )}
                </p>

              </div>

              <div className="text-right">

                <span className="inline-flex px-3 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold">
                  Minimum ₹10,000
                </span>

                <p className="text-sm text-slate-500 mt-2">
                  Amount selected by sponsor
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* FOOTER */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            className="px-5 py-3 text-slate-600 font-bold hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValidAmount}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isValidAmount
                ? 'bg-[#0040e0] text-white hover:bg-[#2e5bff] shadow-md'
                : 'bg-slate-300 text-white cursor-not-allowed'
            }`}
          >

            <span className="material-symbols-outlined">
              handshake
            </span>

            Submit Sponsorship Proposal

          </button>

        </div>

      </div>

    </div>
  );
};