import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CampusEvent, EventCategory } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (
    newEvent: Omit<
      CampusEvent,
      'id' | 'sponsorshipGoalMet' | 'confirmedSponsorsCount'
    >
  ) => Promise<void>;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [expectedReach, setExpectedReach] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!title.trim() || !college.trim()) {
      setError('Please enter the Event Title and Institution / College.');
      return;
    }

    try {
      setIsSubmitting(true);

      await onCreateEvent({
        title: title.trim(),
        category,
        college: college.trim(),
        location: location.trim() || college.trim(),
        dateRange: dateRange.trim() || 'Upcoming 2024',
        expectedReach: expectedReach.trim() || '15,000+ Students',
        status: 'Preparation',

        image:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',

        slotsRemaining: '4 Slots Remaining',

        description:
          description.trim() ||
          'Academic fest looking for strategic corporate sponsorship partners.',

        tiers: [
  {
    id: `tier-title-${Date.now()}`,
    name: 'Title Sponsor',
    price: 50000,
    perks: [
      'Main Banner Rights',
      'VIP Keynote',
      'Merchandise Logo',
      'Premium Branding',
      'Social Media Promotion'
    ],
    slotsAvailable: 1
  },
  {
    id: `tier-gold-${Date.now()}`,
    name: 'Gold Sponsor',
    price: 30000,
    perks: [
      'Stage Branding',
      'Event Banner Logo',
      'Social Media Promotion',
      'Certificate of Appreciation'
    ],
    slotsAvailable: 2
  },
  {
    id: `tier-silver-${Date.now()}`,
    name: 'Silver Sponsor',
    price: 15000,
    perks: [
      'Event Banner Logo',
      'Social Media Mention',
      'Certificate of Appreciation'
    ],
    slotsAvailable: 5
  },
  {
    id: `tier-bronze-${Date.now()}`,
    name: 'Bronze Sponsor',
    price: 5000,
    perks: [
      'Logo on Event Materials',
      'Social Media Mention'
    ],
    slotsAvailable: 10
  }
]
      });

      // Reset form after successful Supabase insert
      setTitle('');
      setCategory('Technical');
      setCollege('');
      setLocation('');
      setDateRange('');
      setExpectedReach('');
      setDescription('');
      setImageUrl('');

      onClose();

    } catch (err) {
      console.error('Create event error:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Create New Campus Event
            </h3>

            <p className="text-xs text-slate-500">
              Publish your event to attract corporate sponsors
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined">
              close
            </span>
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Event Title *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. AI & Robotics Hackfest 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0040e0] focus:border-transparent"
            />
          </div>

          {/* Category + Reach */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as EventCategory)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="Innovation">Innovation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Expected Reach
              </label>

              <input
                type="text"
                placeholder="e.g. 20,000+ Students"
                value={expectedReach}
                onChange={(e) =>
                  setExpectedReach(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

          </div>

          {/* College */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Institution / College *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. PCTE Group of Institutes"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Location + Date */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Venue / Hall
              </label>

              <input
                type="text"
                placeholder="e.g. Main Auditorium"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Date Range
              </label>

              <input
                type="text"
                placeholder="e.g. Nov 12 - 14, 2024"
                value={dateRange}
                onChange={(e) =>
                  setDateRange(e.target.value)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Description & Highlights
            </label>

            <textarea
              rows={3}
              placeholder="Briefly describe your event..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Cover Image URL
            </label>

            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0040e0] hover:bg-[#2e5bff] disabled:opacity-50 rounded-xl shadow-md flex items-center gap-2"
            >

              {isSubmitting ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-lg">
                    progress_activity
                  </span>
                  Publishing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    add_circle
                  </span>
                  Publish Event
                </>
              )}

            </button>

          </div>

        </form>
      </motion.div>
    </div>
  );
};