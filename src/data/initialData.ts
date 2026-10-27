import { CampusEvent, SponsorshipApplication, Milestone } from '../types';

export const LOGO_URL = '/pcte-logo.png';

export const ADMIN_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfNE_2Ub7HJQ92ru-zuJpEGwzHLZPlOJfGGhHo8hVA0I-kNbt2NhOHTTkQra6n-ODeMHXhL1c0MGeVpCyuVTOe96gODj17njnvvlSa0QEkPSDgWBB6CsgJ2U9gWI2pix7yTj_sX_8XV0PDYf764t7GfeunsEGMe35_NHEOLtivL01uJo4YkPNTogwC5dmgXOJ2IPSM9XUAKg5SvU3lVgB75IUChFI-pgzN7Q6kD13jHVYakNZZDTa9AKjwOmZArOFbRSHYD4eYKKmm';

export const ORGANIZER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN93eNOqJpsXyP4RaoAGUxQ07IWWgqs965Eb4EGbBcc3rb-0VWPaxHzE0H_bZ5BPsVg8YvB9O3vlEdmoJa4AlmL-3xYiOSTB8YXv83_oIVdsj-DnzKYVG5lsV6RBvLklwvzRAzht9X0bbuAcpA2JazlBn-TJ8HQdtGgAi4TcSOJlvKsoHTO6GPwR9WZRkSm64mlUNzs7It7mENKcsOH2s3X_n1Xt95YFTNtgeY5JUkrbFcALOlF7U6sZXIqS04GigAEW7c_seRK0IK';

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'Tech Innovators 2024',
    category: 'Technical',
    college: 'PCTE Group of Institutes, Ludhiana',
    location: 'Main Engineering Hall',
    dateRange: 'Oct 15 - 17, 2024',
    expectedReach: '25,000+ Students',
    sponsorshipGoalMet: 82,
    status: 'Ongoing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ89Viybw1f0sVW_1TpqUVvESiMhfmXRNu8oKVoJN4XZHpvEYI7jg5lsqSk1iSQxIMNngTjfphNufgzIJN3PB6h1DuPwEWe0jI7Gfz67sKI-kJWfDn_J_Bc3uZwGOJynUxNNPlkedVGGWMTZVZfKLjFy6G4FDKLA4pJLsiJbM-GA3-SnRzGXJgms_iRvM_SCz55qGN5MGzVZAxpWfvSxhUpYdcfIybbVU5kbBJJL469CuvxVt8h3scmAVkEZMIYjpAkGWrP9-4Q2Qr',
    slotsRemaining: '2 Slots Remaining',
    description: 'Premier national collegiate technology symposium featuring hackathons, AI expos, robotics wars, and keynotes by tech industry visionaries.',
    confirmedSponsorsCount: 18,
    tiers: [
      { id: 't1', name: 'Title Sponsor', price: 25000, perks: ['Main Stage Naming Rights', 'Prime Booth Space (30x30)', 'Keynote Address Slot', 'Logo on All Merchandise'], slotsAvailable: 1 },
      { id: 't2', name: 'Platinum', price: 15000, perks: ['Keynote Speaker Slot', 'VIP Lounge Branding', 'Dedicated Recruitment Desk', 'Social Media Campaign'], slotsAvailable: 2 },
      { id: 't3', name: 'Gold', price: 8500, perks: ['Standard Exhibition Stall', 'Logo on Website & Banners', 'Resume Database Access'], slotsAvailable: 4 },
      { id: 't4', name: 'Silver', price: 5000, perks: ['Logo on Event Website', 'Marketing Collateral Distribution'], slotsAvailable: 6 }
    ]
  },
  {
    id: 'evt-2',
    title: 'TechnoPulse 2024',
    category: 'Cultural',
    college: 'PCTE Campus, Ludhiana',
    location: 'Open Air Amphitheater',
    dateRange: 'Oct 12 - 15, 2024',
    expectedReach: '35,000+ Students',
    sponsorshipGoalMet: 70,
    status: 'Ongoing',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0tXRvoXyv9p_Yv-kva-3hAS-jESGEUH4i8LPDcdP9S8hfPoyd7Dp0LESCIAFjkoeKvTaFCAburGak5I2HgO-FkFpq8F2M7IXWXKADFjN4drwQQbThg9PzHhuLUydVAV8v_3J49ndiImy_b81HeXXWgY7LJxVoRvA9xNi6FCMg11K4HN0kJL98fZlreLAvcrRrnQ4WqCVJ8y8LAlbFZEZ5ZGu6O5cP2t0zo2b95UlCI0oJMPRapSeUplpeng59fdL64kpu712t892c',
    slotsRemaining: '4 Slots Remaining',
    description: 'Annual inter-college cultural extravaganza bringing together musicians, dance crews, fashion designers, and visual artists.',
    confirmedSponsorsCount: 12,
    tiers: [
      { id: 't1', name: 'Title Sponsor', price: 30000, perks: ['Main Stage Title Rights', 'VIP Lounge Access', 'Product Launch Activation'], slotsAvailable: 1 },
      { id: 't2', name: 'Gold', price: 12000, perks: ['Co-sponsor Branding', 'Product Sampling Kiosk', 'Passes for Employees'], slotsAvailable: 3 }
    ]
  },
  {
    id: 'evt-3',
    title: 'FutureStack Summit',
    category: 'Technical',
    college: 'Berkeley Innovation Lab',
    location: 'Tech Quad Auditorium',
    dateRange: 'Nov 02 - 04, 2024',
    expectedReach: '20,000+ Students',
    sponsorshipGoalMet: 60,
    status: 'Preparation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt61diLuub7pedfp4E20KwftqRdngXY9rvXAFv7-aQR84xLBmPibLbc-AcM-UGmyESk_ZF_wB-3g5qSWPVWAs1zTDB4xA4iUMYufixDLMn613EdkKnWh5sLlYZogoc7FEp1Yn2u4IY9v8bSUmTkFXDORyLVT8AuSoP3psC2xEtUVEcl4gbsB-yjzWLtQKnNUld43Jyux9nTcKy9MBPlEmQzmJK1zQcsN56L5nfUpcllLi31F8LqP6YOUUP7s2852lF-pjspHOw6is2',
    slotsRemaining: '2 Slots Remaining',
    description: 'Deep-tech conference exploring Quantum Computing, Generative AI, Cloud Native architectures, and student startup pitching sessions.',
    confirmedSponsorsCount: 8,
    tiers: [
      { id: 't1', name: 'Platinum', price: 20000, perks: ['Hackathon Track Title', 'Direct Talent Scouting', 'Keynote Slot'], slotsAvailable: 2 },
      { id: 't2', name: 'Silver', price: 6000, perks: ['Booths in Main Hall', 'App Banner Highlights'], slotsAvailable: 5 }
    ]
  },
  {
    id: 'evt-4',
    title: 'Varsity Elite 2024',
    category: 'Sports',
    college: 'IIT Delhi Sports Complex',
    location: 'Main Stadium Quad',
    dateRange: 'Dec 15 - 20, 2024',
    expectedReach: '50,000+ Audience',
    sponsorshipGoalMet: 40,
    status: 'Preparation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnJ-HZ3xxBzrmEVVpG2x8yWt9ZXHpmz7iKqZZpq_oR2tmFuTyO8g3Hai88XkaRCExhY4l0qVUXRBiHhepuCFktyZmWtQYXaIoZWFXPtguNfC3bZe6609dLXUGXOH956qRv5zpN1wqK55TNGEIpNzeHwmCP6pLQaU6jzWUsgmEjPuQKDQ-YAxM5Ztesu-PILz5N7xp_YYo4z8dMZDTABAf8kudOqneRMLeC-7srBnzTaY4ubDnjSgWBTG6OZIwu82tWFmds53Sox4lJ',
    slotsRemaining: 'Exclusive Title Available',
    description: 'Multi-sport inter-university olympiad spanning athletics, basketball, football, esports, and swimming championships.',
    confirmedSponsorsCount: 28,
    tiers: [
      { id: 't1', name: 'Title Sponsor', price: 40000, perks: ['Jersey Branding across Teams', 'Live Stream Watermark', 'Main Arena Signage'], slotsAvailable: 1 },
      { id: 't2', name: 'Gold', price: 15000, perks: ['Field Perimeter Boards', 'Award Ceremony Presenter'], slotsAvailable: 4 }
    ]
  },
  {
    id: 'evt-5',
    title: 'Business Leadership Gala',
    category: 'Business',
    college: 'Grand University Plaza',
    location: 'Grand Ballroom',
    dateRange: 'Nov 04, 2024',
    expectedReach: '5,000+ Leaders',
    sponsorshipGoalMet: 45,
    status: 'Preparation',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOPGHQesJr2PFIUjlQPagFwZv_NoW3uiO1ygfMXpwgxizG-AcWS-SFXXaASAx0t2rSLTaQ2-qjmQjtm-DuzAJO_tJyE2zLKXSpAuOW_f9vIGtciYl4P5k29mU5pGoasLYa8Vz9sXa0NZ1ztTukhzg49oLuo-CNXrAq8eDrjYhlwLYUOFPbdnMgFLujaEiZYBk9Eaih3JrO567GIM0qioz8uzG2IFuEdCDDjQ-8mrU9DQovyCF-0dptmV6pPERHpATJXVBRxk5m-i28',
    slotsRemaining: '3 Slots Remaining',
    description: 'High-level networking gala bringing together alumni CEOs, corporate venture capital firms, student founders, and university leadership.',
    confirmedSponsorsCount: 14,
    tiers: [
      { id: 't1', name: 'Platinum', price: 18000, perks: ['VIP Table Host', 'Opening Address', 'Exclusive Cocktail Hour Branding'], slotsAvailable: 2 },
      { id: 't2', name: 'Silver', price: 8500, perks: ['Logo on Gala Menu & Screens', '2 VIP Dinner Passes'], slotsAvailable: 3 }
    ]
  }
];

export const INITIAL_APPLICATIONS: SponsorshipApplication[] = [
  {
    id: 'app-1',
    sponsorName: 'NextGen Kinetics',
    sponsorInitials: 'NK',
    eventName: 'Engineering Symposium',
    eventId: 'evt-1',
    packageTier: 'Platinum',
    amount: 15000,
    status: 'Pending',
    dateApplied: 'Jul 20, 2024',
    avatarBg: 'bg-indigo-100 text-indigo-700',
    contactEmail: 'partnerships@nextgenkinetics.com'
  },
  {
    id: 'app-2',
    sponsorName: 'Blue Mountain Tech',
    sponsorInitials: 'BM',
    eventName: 'Career Fair 2024',
    eventId: 'evt-5',
    packageTier: 'Gold',
    amount: 8500,
    status: 'Pending',
    dateApplied: 'Jul 19, 2024',
    avatarBg: 'bg-cyan-100 text-cyan-700',
    contactEmail: 'events@bluemountain.io'
  },
  {
    id: 'app-3',
    sponsorName: 'Apex Pharmaceuticals',
    sponsorInitials: 'AP',
    eventName: 'Health & Wellness Week',
    eventId: 'evt-4',
    packageTier: 'Platinum',
    amount: 22000,
    status: 'Pending',
    dateApplied: 'Jul 18, 2024',
    avatarBg: 'bg-orange-100 text-orange-700',
    contactEmail: 'sponsorship@apexpharma.com'
  },
  {
    id: 'app-4',
    sponsorName: 'Global Solutions Ltd',
    sponsorInitials: 'GS',
    eventName: 'Innovation Challenge',
    eventId: 'evt-3',
    packageTier: 'Silver',
    amount: 5000,
    status: 'Pending',
    dateApplied: 'Jul 17, 2024',
    avatarBg: 'bg-blue-100 text-blue-700',
    contactEmail: 'outreach@globalsolutions.com'
  },
  {
    id: 'app-5',
    sponsorName: 'Google Cloud',
    sponsorInitials: 'GC',
    eventName: 'Tech Innovators 2024',
    eventId: 'evt-1',
    packageTier: 'Titanium Package',
    amount: 25000,
    status: 'Pending',
    dateApplied: 'Jul 15, 2024',
    avatarBg: 'bg-blue-100 text-blue-800',
    contactEmail: 'edu-sponsors@google.com'
  },
  {
    id: 'app-6',
    sponsorName: 'JP Morgan Chase',
    sponsorInitials: 'JPM',
    eventName: 'Business Leadership Gala',
    eventId: 'evt-5',
    packageTier: 'Silver Package',
    amount: 8500,
    status: 'Pending',
    dateApplied: 'Jul 14, 2024',
    avatarBg: 'bg-slate-100 text-slate-800',
    contactEmail: 'campus-relations@jpmorgan.com'
  },
  {
    id: 'app-7',
    sponsorName: 'Amazon Robotics',
    sponsorInitials: 'AR',
    eventName: 'Tech Innovators 2024',
    eventId: 'evt-1',
    packageTier: 'Workshop Sponsor',
    amount: 12000,
    status: 'Pending',
    dateApplied: 'Jul 12, 2024',
    avatarBg: 'bg-amber-100 text-amber-800',
    contactEmail: 'university@amazonrobotics.com'
  },
  {
    id: 'app-8',
    sponsorName: 'Vortex AI Summit (Sponsor)',
    sponsorInitials: 'VA',
    eventName: 'Vortex AI Summit',
    eventId: 'evt-3',
    packageTier: 'Platinum',
    amount: 12500,
    status: 'Approved',
    dateApplied: 'Oct 12, 2023',
    avatarBg: 'bg-purple-100 text-purple-700',
    contactEmail: 'ai@vortex.org'
  },
  {
    id: 'app-9',
    sponsorName: 'Pratibimb Cultural',
    sponsorInitials: 'PC',
    eventName: 'Pratibimb Cultural',
    eventId: 'evt-2',
    packageTier: 'Gold',
    amount: 5000,
    status: 'Pending',
    dateApplied: 'Nov 05, 2023',
    avatarBg: 'bg-amber-100 text-amber-700',
    contactEmail: 'sponsorship@pratibimb.org'
  },
  {
    id: 'app-10',
    sponsorName: 'Udghosh Sports',
    sponsorInitials: 'US',
    eventName: 'Udghosh 2024',
    eventId: 'evt-4',
    packageTier: 'Platinum',
    amount: 15000,
    status: 'Paid',
    dateApplied: 'Oct 28, 2023',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    contactEmail: 'udghosh@iitk.ac.in'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    title: 'Tech Summit Launch',
    description: 'Final sponsor collateral due in 2 days.',
    icon: 'campaign',
    iconColor: 'text-[#0040e0]'
  },
  {
    id: 'm-2',
    title: 'Global Corp Renewal',
    description: 'Annual sponsorship contract pending signature.',
    icon: 'contract',
    iconColor: 'text-[#00677f]'
  },
  {
    id: 'm-3',
    title: 'Alumni Gala Dinner',
    description: 'Capacity reached. 25 sponsors confirmed.',
    icon: 'celebration',
    iconColor: 'text-[#993100]'
  }
];
