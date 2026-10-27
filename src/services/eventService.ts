import { supabase } from '../lib/supabase';
import { CampusEvent } from '../types';

type CreateEventInput = Omit<
  CampusEvent,
  'id' | 'sponsorshipGoalMet' | 'confirmedSponsorsCount'
>;

export const createEvent = async (
  event: CreateEventInput
): Promise<CampusEvent> => {

  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title: event.title,
        category: event.category,
        college: event.college,
        location: event.location,
        date_range: event.dateRange,
        expected_reach: event.expectedReach,
        status: event.status,
        image: event.image,
        slots_remaining: event.slotsRemaining,
        description: event.description,
        tiers: event.tiers,
        sponsorship_goal_met: 0,
        confirmed_sponsors_count: 0
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase create event error:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    college: data.college,
    location: data.location,
    dateRange: data.date_range,
    expectedReach: data.expected_reach,
    status: data.status,
    image: data.image,
    slotsRemaining: data.slots_remaining,
    description: data.description,
    tiers: data.tiers,
    sponsorshipGoalMet: data.sponsorship_goal_met,
    confirmedSponsorsCount: data.confirmed_sponsors_count
  };
};