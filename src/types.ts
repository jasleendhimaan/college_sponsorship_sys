export type AppView =
  | 'landing'
  | 'admin'
  | 'organizer'
  | 'sponsor';

export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Business'
  | 'Innovation';

export interface SponsorshipTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  slotsAvailable: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  college: string;
  location: string;
  dateRange: string;
  expectedReach: string;

  sponsorshipGoalMet: number;

  status:
    | 'Ongoing'
    | 'Preparation'
    | 'Completed'
    | 'Upcoming';

  image: string;
  slotsRemaining: string;
  description: string;

  tiers: SponsorshipTier[];

  confirmedSponsorsCount: number;
}


/* =====================================================
   EVENT STALL
   ===================================================== */

export interface EventStall {
  id: string;

  // Event this stall belongs to
  eventId: string;

  // Actual stall identifier
  // Example: A-01, A-02, FOOD-01
  stallId: string;

  // Display name shown to sponsor
  stallName: string;

  // Controls the order in which stalls appear
  sortOrder: number;

  // True when another sponsor has already reserved it
  reserved?: boolean;
}


/* =====================================================
   APPLICATION STATUS
   ===================================================== */

export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Paid';


/* =====================================================
   SPONSORSHIP APPLICATION
   ===================================================== */

export interface SponsorshipApplication {
  id: string;

  sponsorName: string;

  sponsorInitials: string;

  eventName: string;

  eventId: string;

  packageTier: string;

  amount: number;

  status: ApplicationStatus;

  dateApplied: string;

  avatarBg?: string;

  contactEmail?: string;

  /*
   * ===================================================
   * STALL INFORMATION
   * ===================================================
   *
   * These values come from the selected event stall.
   *
   * Example:
   *
   * stallId   = "A-05"
   * stallName = "Stall A-05"
   */

  stallId?: string;

  stallName?: string;
}


/* =====================================================
   MILESTONE
   ===================================================== */

export interface Milestone {
  id: string;

  title: string;

  description: string;

  icon: string;

  iconColor: string;
}


/* =====================================================
   REVENUE METRICS
   ===================================================== */

export interface RevenueMetric {
  totalRevenue: number;

  activeEventsCount: number;

  ongoingTodayCount: number;

  pendingSponsorshipsCount: number;

  totalSponsorsCount: number;

  newSponsorsThisWeek: number;
}

export interface EventStall {
  id: string;
  eventId: string;
  stallId: string;
  stallName: string;
  sortOrder: number;
  reserved?: boolean;
}