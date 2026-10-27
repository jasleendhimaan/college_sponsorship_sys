import React from 'react';
import { CampusEvent, AppView } from '../types';
import { LOGO_URL } from '../data/initialData';

interface LandingPageProps {
  events: CampusEvent[];
  onViewChange: (view: AppView) => void;
  onOpenEventDetail: (event: CampusEvent) => void;
  onOpenSponsor: (event: CampusEvent) => void;
  onOpenCreateEvent: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  events,
  onViewChange,
  onOpenEventDetail,
  onOpenSponsor,
  onOpenCreateEvent,
}) => {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#191b24] selection:bg-[#2e5bff] selection:text-[#efefff] overflow-x-hidden">

      {/* Landing Navigation Header */}
      <nav className="sticky top-0 w-full z-50 bg-[#fbf8ff]/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
                src="/pcte-logo.png"
                alt="PCTE Logo"
                className="h-12 w-auto object-contain"
              />
            <span className="font-black text-2xl text-[#0040e0] tracking-tight">
              PCTE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-600">
            <a
              href="#how-it-works"
              className="hover:text-[#0040e0] transition-colors"
            >
              How it Works
            </a>

            <a
              href="#events"
              className="hover:text-[#0040e0] transition-colors"
            >
              Featured Events
            </a>

            <a
              href="#impact"
              className="hover:text-[#0040e0] transition-colors"
            >
              Impact & ROI
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('admin')}
              className="font-bold text-sm px-4 py-2 text-[#0040e0] hover:bg-blue-50 transition-colors rounded-lg"
            >
              Portal Login
            </button>

            <button
              onClick={() => onViewChange('organizer')}
              className="font-bold text-sm px-5 py-2 bg-[#0040e0] text-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#2e5bff] transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>

        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(0,64,224,0.06)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">

            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#b7eaff] text-[#001f28] rounded-full">
              <span className="material-symbols-outlined text-sm">
                verified
              </span>

              <span className="text-[11px] font-bold uppercase tracking-widest">
                Bridging Education & Industry
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#191b24] leading-tight tracking-tight">
              Bridging{' '}
              <span className="text-[#0040e0] italic">
                Colleges
              </span>{' '}
              and Corporate{' '}
              <span className="text-[#00677f]">
                Sponsors
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#434656] max-w-lg leading-relaxed">
              The enterprise-grade platform for campus event management.
              Transform your college fests into high-value corporate
              partnership opportunities with data-driven sponsorship workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">

              <button
                onClick={() => {
                  onViewChange('organizer');
                  onOpenCreateEvent();
                }}
                className="group flex items-center justify-center gap-2 font-bold text-base px-8 py-4 bg-[#0040e0] text-white rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all"
              >
                I am an Organizer

                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => onViewChange('sponsor')}
                className="group flex items-center justify-center gap-2 font-bold text-base px-8 py-4 border-2 border-[#0040e0] text-[#0040e0] rounded-xl hover:bg-blue-50 transition-all"
              >
                I am a Sponsor

                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
                  handshake
                </span>
              </button>

            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-slate-200/60">

              <div>
                <p className="text-2xl font-black text-[#191b24]">
                  500+
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Colleges Onboarded
                </p>
              </div>

              <div className="w-px h-10 bg-slate-200" />

              <div>
                <p className="text-2xl font-black text-[#191b24]">
                  ₹2M+
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Funds Raised
                </p>
              </div>

            </div>

          </div>


          {/* Abstract Hero Interactive Bento Card */}
          <div className="relative lg:h-[520px] flex items-center justify-center">

            <div className="relative w-full aspect-square max-w-[480px]">

              <div className="absolute inset-0 bg-[#0040e0]/5 rounded-[40px] rotate-3 -z-10" />

              <div className="absolute inset-0 bg-[#00677f]/5 rounded-[40px] -rotate-3 -z-10" />

              <div className="w-full h-full glass-card border border-slate-200/80 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between overflow-hidden">

                <div className="flex items-center justify-between mb-4">

                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>

                  <div className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
                    Admin Dashboard Preview
                  </div>

                </div>


                <div className="space-y-4">

                  <div className="h-24 w-full bg-blue-50 rounded-2xl flex items-center justify-center p-4 border border-blue-100">
                    <img
                      alt="PCTE Logo Icon"
                      className="h-16 w-16 object-contain"
                      src={LOGO_URL}
                    />
                  </div>


                  <div className="grid grid-cols-2 gap-3">

                    <div className="h-28 bg-cyan-50/80 rounded-2xl border border-cyan-200/60 p-4 flex flex-col justify-between">

                      <p className="text-[10px] font-bold text-cyan-800 uppercase">
                        Active Sponsors
                      </p>

                      <p className="text-2xl font-black text-cyan-900">
                        156
                      </p>

                      <span className="text-[10px] text-emerald-700 font-bold">
                        +12.5% vs last month
                      </span>

                    </div>


                    <div className="h-28 bg-orange-50/80 rounded-2xl border border-orange-200/60 p-4 flex flex-col justify-between">

                      <p className="text-[10px] font-bold text-orange-800 uppercase">
                        Total Revenue
                      </p>

                      <p className="text-2xl font-black text-orange-900">
                        ₹124,000
                      </p>

                      <span className="text-[10px] text-orange-700 font-bold">
                        48 Active Events
                      </span>

                    </div>

                  </div>


                  <div className="h-20 w-full bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 gap-4">

                    <div className="w-10 h-10 rounded-xl bg-[#0040e0] text-white flex items-center justify-center font-bold text-sm">
                      GC
                    </div>

                    <div className="flex-1 space-y-1">

                      <div className="flex items-center justify-between">

                        <p className="font-bold text-xs text-slate-900">
                          Google Cloud Sponsor Request
                        </p>

                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Approved
                        </span>

                      </div>

                      <p className="text-[11px] text-slate-500">
                        Tech Innovators 2024 • Titanium Package
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-slate-50 border-y border-slate-200/60"
      >

        <div className="max-w-[1440px] mx-auto px-6 text-center mb-12">

          <h2 className="text-3xl font-bold text-[#191b24] mb-3">
            Simplifying Sponsorship
          </h2>

          <p className="text-base text-[#434656] max-w-2xl mx-auto">
            Move away from chaotic email threads and messy spreadsheets.
            PCTE provides a structured pipeline for academic events to find
            their perfect corporate match.
          </p>

        </div>


        <div className="max-w-[1440px] mx-auto px-6 grid md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="group p-8 bg-white rounded-3xl border border-slate-200/80 hover:shadow-xl transition-all duration-300">

            <div className="w-14 h-14 bg-blue-50 text-[#0040e0] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                add_circle
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Create Event
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Define your event's scale, target demographic, and specific
              sponsorship tiers with our intuitive wizard.
            </p>

          </div>


          {/* Step 2 */}
          <div className="group p-8 bg-white rounded-3xl border border-slate-200/80 hover:shadow-xl transition-all duration-300">

            <div className="w-14 h-14 bg-cyan-50 text-[#00677f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                send
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Invite Sponsors
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Browse our network of corporate partners or invite your own
              with trackable, professional pitch decks.
            </p>

          </div>


          {/* Step 3 */}
          <div className="group p-8 bg-white rounded-3xl border border-slate-200/80 hover:shadow-xl transition-all duration-300">

            <div className="w-14 h-14 bg-orange-50 text-[#993100] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                trending_up
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Manage & Grow
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Track payments, deliverables, and sponsorship ROI in real-time.
              Build long-term relationships for future events.
            </p>

          </div>

        </div>

      </section>


      {/* Featured Event Spotlights */}
      <section id="events" className="py-20">

        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">

          <div>

            <h2 className="text-3xl font-bold text-[#191b24] mb-2">
              Upcoming Event Spotlights
            </h2>

            <p className="text-base text-slate-600">
              Premier fests looking for visionary corporate partners.
            </p>

          </div>


          <button
            onClick={() => onViewChange('sponsor')}
            className="flex items-center gap-2 font-bold text-sm text-[#0040e0] hover:underline"
          >
            View all events

            {/* FIXED: class → className */}
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>

          </button>

        </div>


        <div className="max-w-[1440px] mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.slice(0, 3).map((event) => (

            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >

              <div>

                <div className="h-48 relative overflow-hidden">

                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-xs font-bold text-[#0040e0]">
                    {event.category}
                  </div>

                </div>


                <div className="p-6 space-y-3">

                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">

                    <span className="material-symbols-outlined text-base">
                      calendar_today
                    </span>

                    <span>
                      {event.dateRange}
                    </span>

                  </div>


                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#0040e0] transition-colors">
                    {event.title}
                  </h4>


                  <p className="text-xs text-slate-500 flex items-center gap-1">

                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>

                    {event.college}

                  </p>


                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600">

                    <span className="font-semibold text-[#0040e0]">
                      {event.expectedReach}
                    </span>

                    <span className="font-bold text-slate-500">
                      {event.slotsRemaining}
                    </span>

                  </div>

                </div>

              </div>


              <div className="p-6 pt-0 border-t border-slate-100 mt-4">

                <button
                  onClick={() => onOpenEventDetail(event)}
                  className="w-full py-3 bg-slate-100 text-slate-800 font-bold text-sm rounded-xl hover:bg-[#0040e0] hover:text-white transition-all shadow-xs"
                >
                  View Sponsorship Deck
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Footer */}
      <footer className="bg-[#2e303a] text-slate-200 pt-16 pb-12">

        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <img
                alt="PCTE Footer Logo"
                className="h-9 w-9 object-contain bg-white rounded-lg p-1"
                src={LOGO_URL}
              />

              <span className="font-black text-2xl text-white tracking-tight">
                PCTE
              </span>

            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              The ultimate bridge between academic excellence and corporate
              vision. Empowering the next generation of campus event leaders.
            </p>

          </div>


          {/* Quick Links */}
          <div>

            <h5 className="font-bold text-sm text-white mb-4">
              Quick Links
            </h5>

            <ul className="space-y-2.5 text-xs text-slate-400">

              <li>
                <button
                  onClick={() => onViewChange('landing')}
                  className="hover:text-white"
                >
                  How it Works
                </button>
              </li>

              <li>
                <button
                  onClick={() => onViewChange('sponsor')}
                  className="hover:text-white"
                >
                  Featured Events
                </button>
              </li>

              <li>
                <button
                  onClick={() => onViewChange('organizer')}
                  className="hover:text-white"
                >
                  Organizer Portal
                </button>
              </li>

            </ul>

          </div>


          {/* Support */}
          <div>

            <h5 className="font-bold text-sm text-white mb-4">
              Support & Terms
            </h5>

            <ul className="space-y-2.5 text-xs text-slate-400">

              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>

            </ul>

          </div>


          {/* Newsletter */}
          <div>

            <h5 className="font-bold text-sm text-white mb-4">
              Join the Newsletter
            </h5>

            <p className="text-xs text-slate-400 mb-3">
              Stay updated with upcoming sponsorship opportunities.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >

              <input
                type="email"
                placeholder="Email address"
                className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:ring-[#0040e0]"
              />

              <button
                type="submit"
                className="px-3 py-2 bg-[#0040e0] text-white rounded-lg hover:bg-[#2e5bff]"
              >
                <span className="material-symbols-outlined text-sm">
                  send
                </span>
              </button>

            </form>

          </div>

        </div>


        <div className="max-w-[1440px] mx-auto px-6 mt-12 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
          © 2024 PCTE (Campus Bridge). All rights reserved. Designed for Academic Excellence.
        </div>

      </footer>

    </div>
  );
};