/**
 * Central portfolio data — built from Benita Samson's Founder Portfolio PDF
 * (Benita_Samson_Founder_Portfolio_Revised.pdf).
 * Every fact on the site comes from this file.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Benita Samson',
  displayName: 'Benita Samson',
  firstName: 'BENITA',
  seriesTag: 'FOUNDER & CEO',
  /** Studio card shown at the very start of the opening sequence. */
  originalLabel: 'CONNECTING DOTS WORLDWIDE',
  role: 'Founder & CEO · Connecting Dots Worldwide',
  tagline: ['Founder & CEO', 'Connecting Dots Worldwide', 'Career HQ'],
  intro:
    'After nearly a decade in Australian banking (NAB & CBA), Benita Samson walked away from conventional comfort to build Connecting Dots Worldwide, co-found Career HQ, and grow Career with Beni to 50,000+ followers.',
  quote: 'Success is not just about what is achieved. It is about having the courage to create what does not yet exist.',
  location: 'Madurai, India · Registered in Australia',
  email: 'beni@careerhq.in',
  phone: '8124810001',
  links: {
    portfolio: 'https://benitasamson.com',
    careerhq: 'https://www.careerhq.in',
    instagram: 'https://www.instagram.com/careerwithbeni/',
    linkedin: 'https://www.careerhq.in',
    github: 'https://www.careerhq.in',
  },
  resumePdf: '/assets/Benita_Samson_Founder_Portfolio.pdf',
  bannerVideo: '/assets/video/banner-video-2.mp4',
  openingImage: '/assets/images/benita.png',
  portrait: {
    src: '/assets/images/benita.png',
    srcSet: '/assets/images/benita.png',
    alt: 'Portrait of Benita Samson',
  },
  interests: [
    'Education & Global Admissions',
    'Digital Media & Storytelling',
    'Industry & Career Ecosystems',
    'Social Impact (The Blind Spot)',
  ],
};

export const education = [
  {
    school: 'National Australia Bank (NAB)',
    place: 'Australia',
    degree: 'Banking & Financial Services Career',
    period: 'Nearly a decade in banking',
    score: '~10 Years',
  },
  {
    school: 'Commonwealth Bank of Australia (CBA)',
    place: 'Australia',
    degree: 'Final chapter in Australian banking before entrepreneurship',
    period: 'Final 6 months',
    score: '6 Months',
  },
];

export const experience = [
  {
    company: 'Connecting Dots Worldwide',
    role: 'Founder & CEO',
    place: 'Australia (Registered 2025) & India',
    period: '2025 – Present',
    points: [
      'Registered Connecting Dots Worldwide in Australia in 2025 as the parent company identity, with its India business developing under the same identity.',
      'Building a multi-venture ecosystem connecting education, industry, knowledge, digital learning, media, and social impact.',
      'Developing upcoming initiatives including Industry Connect, A T O M – The Journal Collection, DNA – Digital Network and Advancement, HQ International, and The Blind Spot.',
    ],
  },
  {
    company: 'Career HQ',
    role: 'Co-Founder & CEO (with Gandhi)',
    place: 'Madurai, India',
    period: 'October 2025 – Present',
    points: [
      'Introduced to Gandhi (PickMyAdmission & CareerBee Overseas Education) at Bharath University and partnered at an education expo before uniting under one shared brand.',
      'Created the Career HQ logo on 15 October 2025, bringing together Indian admissions, international education, MBBS admissions, training & placement, education loans, and scholarship support.',
      'Built an 8-member founding and core team (Benita Samson, Gandhi, Vino, Manimalan, Sajitha, Ashwini, Malathi, Agalya) with a vision to grow to 15.',
    ],
  },
  {
    company: 'Hope Education & Migration',
    role: 'Franchise Founder',
    place: 'Madurai, India',
    period: 'February 2025',
    points: [
      'Walked away from an established banking career in Australia, sold her home and cars, and brought the Hope Education & Migration franchise to Madurai, India.',
      'Spent the first six months exploring the Indian education market, meeting counsellors, understanding admissions, and laying the groundwork with a founding team of four.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  externalUrl?: string;
  externalLabel?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'career-hq',
    title: 'Career HQ',
    year: 'Oct 2025',
    genre: 'Education • Global Admissions • Placements',
    logline:
      'Co-founded with Gandhi on 15 October 2025 — connecting students with Indian and international education, MBBS, training, loans and scholarships.',
    stack: ['Study in India', 'Study Abroad', 'Training & Placement', 'MBBS Admissions', 'Education Loan Support', 'Scholarship Support'],
    build: [
      'Born from a meeting with Gandhi at Bharath University and a shared education expo collaboration, uniting Hope Education & Migration with PickMyAdmission and CareerBee Overseas Education.',
      'Expanded within its first year across Indian admissions, overseas education, medical admissions, career placement, and student financial guidance.',
    ],
    features: [
      'Study in India — University admissions & domestic guidance',
      'Study Abroad — International education & overseas admissions',
      'Training & Placement — Professional development & employment',
      'MBBS Admissions — Medical admissions in India & abroad',
      'Education Loan & Scholarship Support — Financial guidance',
    ],
    metrics: [
      { value: '6', label: 'core service areas' },
      { value: '15 Oct', label: '2025 brand launch' },
      { value: '8 → 15', label: 'team growth roadmap' },
      { value: 'India+', label: 'global education reach' },
    ],
    externalUrl: 'https://www.careerhq.in',
    externalLabel: 'Visit careerhq.in',
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'career-with-beni',
    title: 'Career with Beni',
    year: 'Feb 2026',
    genre: 'Personal Brand • Instagram • Media',
    logline:
      'Launched on 12 February 2026 — Benita’s Instagram personal brand built to share knowledge, inspire individuals, and build meaningful connections.',
    stack: ['Instagram Reels', '120+ Videos', '50,000+ Followers', 'Mic & Mentors', 'TRP Show'],
    build: [
      'Reached the 50,000+ follower milestone within approximately six months through consistent content creation and digital engagement.',
      'Expanding into upcoming YouTube ventures: Mic & Mentors (interviewing founders, CEOs & industry experts) and TRP – The Reality Project (a documentary show within the channel).',
    ],
    features: [
      '50,000+ organic Instagram followers in ~6 months',
      '120+ published educational & career videos',
      'Mic & Mentors — Upcoming YouTube interview channel',
      'TRP – The Reality Project — Documentary show inside Mic & Mentors',
    ],
    metrics: [
      { value: '50,000+', label: 'Instagram followers' },
      { value: '120+', label: 'videos published' },
      { value: '~6 Mo', label: 'to 50K milestone' },
      { value: '12 Feb', label: '2026 launch date' },
    ],
    externalUrl: 'https://www.instagram.com/careerwithbeni/',
    externalLabel: 'Open @careerwithbeni',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'connecting-dots',
    title: 'Connecting Dots Worldwide',
    year: '2025 – Upcoming',
    genre: 'Parent Company • Ecosystem • Social Impact',
    logline:
      'Registered in Australia in 2025 — the parent ecosystem connecting Career HQ, Industry Connect, A T O M, DNA, HQ International, and The Blind Spot.',
    stack: ['Career HQ', 'Industry Connect', 'A T O M', 'DNA', 'HQ International', 'The Blind Spot'],
    build: [
      'Established as the parent company identity in Australia in 2025 while building its India operations under the same banner.',
      'Structured as a multi-vertical ecosystem spanning education, industry connections, journal publishing, digital learning, media, and non-profit social impact.',
    ],
    features: [
      'Industry Connect — Connecting professionals, industries & opportunities',
      'A T O M – The Journal Collection — Publishing venture by Benita Samson',
      'DNA – Digital Network and Advancement — Online digital learning platform',
      'HQ International — International education initiative',
      'The Blind Spot — Non-profit social-impact & inclusion initiative',
    ],
    metrics: [
      { value: '6', label: 'ecosystem initiatives' },
      { value: '2025', label: 'registered in Australia' },
      { value: '8', label: 'current team members' },
      { value: '15', label: 'team growth target' },
    ],
    externalUrl: 'https://benitasamson.com',
    externalLabel: 'benitasamson.com',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'career-with-beni',
    title: '50,000+ Followers',
    org: 'Career with Beni',
    detail: 'Launched 12 February 2026 on Instagram and published 120+ videos within approximately six months.',
    laurel: 'Digital Milestone',
    link: 'https://www.instagram.com/careerwithbeni/',
  },
  {
    id: 'career-hq',
    title: 'Co-Founder & CEO',
    org: 'Career HQ',
    detail: 'Created on 15 October 2025 with Gandhi, uniting Indian admissions, global study, MBBS, placements, loans & scholarships.',
    laurel: 'Shared Brand',
    link: 'https://www.careerhq.in',
  },
  {
    id: 'connecting-dots',
    title: 'Founder & CEO',
    org: 'Connecting Dots Worldwide',
    detail: 'Parent company registered in Australia in 2025, scaling a portfolio across education, media, publishing & social impact.',
    laurel: 'Parent Ecosystem',
  },
  {
    id: 'courage-to-begin',
    title: '~10 Years Banking',
    org: 'NAB & CBA · Australia',
    detail: 'Walked away from an established banking career, sold home and cars in Australia, and launched in Madurai in Feb 2025.',
    laurel: 'The Leap',
  },
  {
    id: 'team-vision',
    title: '8 → 15 Team',
    org: 'Leadership & Core Team',
    detail: 'Benita Samson, Gandhi, Vino, Manimalan, Sajitha, Ashwini, Malathi & Agalya — eight today, fifteen in the vision.',
    laurel: 'The People',
  },
];

export type Certification = { issuer: string; name: string; link: string; status?: string };

export const certifications: Certification[] = [
  { issuer: 'Existing Business', name: 'Career HQ — Admissions, MBBS, Placements, Loans & Scholarships', link: 'https://www.careerhq.in' },
  { issuer: 'Instagram Brand', name: 'Career with Beni — 50,000+ Followers & 120+ Videos', link: 'https://www.instagram.com/careerwithbeni/' },
  { issuer: 'Upcoming YouTube', name: 'Mic & Mentors — Interviews with Founders, CEOs & Experts', link: '#instagram' },
  { issuer: 'Show on Mic & Mentors', name: 'TRP – The Reality Project — Stories of Everyday Professions', link: '#instagram' },
  { issuer: 'Upcoming Initiative', name: 'Industry Connect — Connecting Professionals, Industries & Opportunities', link: '#contact' },
  { issuer: 'Upcoming Venture', name: 'A T O M – The Journal Collection by Benita Samson', link: '#contact' },
  { issuer: 'Upcoming Platform', name: 'DNA – Digital Network and Advancement (Online Learning)', link: '#contact' },
  { issuer: 'Upcoming Initiative', name: 'HQ International — International Education Initiative', link: '#contact' },
  { issuer: 'Non-Profit Initiative', name: 'The Blind Spot — Community Welfare, Inclusion & Awareness', link: '#contact' },
];

export const teamMembers = [
  { name: 'Benita Samson', role: 'Founder & CEO' },
  { name: 'Gandhi', role: 'Founder & CEO' },
  { name: 'Vino', role: 'Team Member' },
  { name: 'Manimalan', role: 'Team Member' },
  { name: 'Sajitha', role: 'Team Member' },
  { name: 'Ashwini', role: 'Team Member' },
  { name: 'Malathi', role: 'Team Member' },
  { name: 'Agalya', role: 'Team Member' },
];

export const archiveChapters = [
  { title: 'Australia & banking career', detail: 'Professional portraits and selected memories from her banking years at NAB and CBA.' },
  { title: 'The entrepreneurial decision', detail: 'Personal photographs from her Australia chapter and move to India.' },
  { title: 'Hope Education & Migration', detail: 'Office photographs and early business memories in Madurai.' },
  { title: 'Education Expo', detail: 'Event photographs from Courtyard by Marriott, Madurai.' },
  { title: 'Bharath University & Career HQ', detail: 'Photographs from the introduction to Gandhi, expo and shared business journey.' },
  { title: 'Career with Beni', detail: 'Content creation, Instagram milestones and behind-the-scenes moments.' },
  { title: 'A T O M & personal milestones', detail: 'Journal photographs, celebrations and meaningful moments.' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'career-hq',
    title: 'Career HQ Pillars',
    subtitle: 'Six core areas of work',
    skills: [
      { name: 'Study in India', mono: 'IN', note: 'Core' },
      { name: 'Study Abroad', mono: 'AB' },
      { name: 'Training & Placement', mono: 'TP' },
      { name: 'MBBS Admissions', mono: 'MB' },
      { name: 'Education Loans', mono: 'EL' },
      { name: 'Scholarships', mono: 'SC' },
    ],
  },
  {
    id: 'media',
    title: 'Media & Digital',
    subtitle: 'Storytelling & community',
    skills: [
      { name: 'Career with Beni', mono: 'CB' },
      { name: 'Mic & Mentors', mono: 'MM' },
      { name: 'TRP – The Reality Project', mono: 'TR' },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Connecting Dots',
    subtitle: 'Upcoming ventures & impact',
    skills: [
      { name: 'Industry Connect', mono: 'IC' },
      { name: 'A T O M Journal', mono: 'AT' },
      { name: 'DNA Digital Learning', mono: 'DN' },
      { name: 'HQ International', mono: 'HQ' },
      { name: 'The Blind Spot', mono: 'BS' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  'Study in India': ['Career HQ', 'PickMyAdmission roots'],
  'Study Abroad': ['Career HQ', 'Hope Education & Migration', 'CareerBee Overseas Education'],
  'Career with Beni': ['50,000+ Instagram followers', '120+ videos published'],
  'Mic & Mentors': ['Upcoming YouTube interview channel'],
  'TRP – The Reality Project': ['Upcoming show within Mic & Mentors'],
  'The Blind Spot': ['Upcoming non-profit social-impact initiative'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Courage to Begin Again',
    period: 'Australia → Feb 2025',
    synopsis: 'Nearly a decade in banking at NAB and CBA before selling home and cars to start fresh in Madurai.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Australian Banking Years',
        description: 'Built a successful career over nearly a decade with National Australia Bank (NAB) and final six months at Commonwealth Bank of Australia (CBA).',
        tags: ['NAB', 'CBA', 'Australia'],
        runtime: '~10 Years',
        palette: amber,
      },
      {
        code: 'S01 E02',
        title: 'Madurai Chapter',
        description: 'Brought the Hope Education & Migration franchise to Madurai in February 2025 with a founding team of four.',
        tags: ['Madurai', 'Team of 4'],
        runtime: 'Feb 2025',
        palette: crimson,
      },
    ],
  },
  {
    number: 2,
    title: 'The Birth of Career HQ',
    period: 'Oct 2025',
    synopsis: 'Meeting Gandhi at Bharath University and uniting complementary businesses under one shared brand.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Two Journeys · One Brand',
        description: 'Created the Career HQ logo on 15 October 2025, combining international education with Indian admissions expertise.',
        tags: ['Bharath University', 'Education Expo'],
        runtime: '15 Oct 2025',
        palette: violet,
      },
    ],
  },
  {
    number: 3,
    title: 'Career with Beni & Media',
    period: 'Feb 2026 – Present',
    synopsis: 'Growing an Instagram community to 50,000+ followers and preparing Mic & Mentors + TRP.',
    episodes: [
      {
        code: 'S03 E01',
        title: '50,000+ Milestone',
        description: 'Launched on 12 February 2026 and reached 50,000+ followers with 120+ videos published in roughly six months.',
        tags: ['Instagram', '120+ Videos'],
        runtime: '12 Feb 2026',
        palette: ocean,
      },
    ],
  },
  {
    number: 4,
    title: 'Connecting Dots Worldwide',
    period: '2025 – Vision Ahead',
    synopsis: 'Parent company registered in Australia in 2025, expanding across education, publishing, media and social impact.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'Eight Today · Fifteen Ahead',
        description: 'Scaling Career HQ alongside Industry Connect, A T O M, DNA, HQ International, and The Blind Spot.',
        tags: ['Australia & India', 'Ecosystem'],
        runtime: 'Team 8 → 15',
        palette: jade,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'The Leap', title: 'NAB & CBA', detail: 'Left ~10 years in Australian banking to start anew', palette: amber },
  { label: 'Feb 2025', title: 'Madurai Move', detail: 'Launched Hope Education & Migration with team of 4', palette: crimson },
  { label: '15 Oct 2025', title: 'Career HQ', detail: 'United journeys with Gandhi into one shared brand', palette: ocean },
  { label: '6 Pillars', title: 'Admissions+', detail: 'India, Abroad, MBBS, Placements, Loans & Scholarships', palette: violet },
  { label: '12 Feb 2026', title: '50,000+ IG', detail: 'Career with Beni • 120+ videos in ~6 months', palette: jade },
  { label: 'YouTube', title: 'Mic & Mentors', detail: 'Upcoming channel with founders, CEOs & experts', palette: amber },
  { label: 'Channel Show', title: 'TRP Reality', detail: 'Documentary stories of everyday professions', palette: crimson },
  { label: 'Parent Co.', title: 'Connecting Dots', detail: 'Registered in Australia in 2025 • Growing in India', palette: ocean },
  { label: 'Upcoming', title: 'A T O M & DNA', detail: 'The Journal Collection & Digital Network Platform', palette: jade },
  { label: 'Non-Profit', title: 'The Blind Spot', detail: 'Community welfare, inclusion & positive social impact', palette: violet },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'The Courage to Begin Again',
    title: 'Banking → Founder',
    lines: [
      'Nearly a decade at National Australia Bank (NAB) & CBA in Australia',
      'Sold home and cars and brought Hope Education & Migration to Madurai in Feb 2025',
    ],
    chips: ['Australia', 'Madurai', 'Team of 4'],
  },
  {
    kicker: 'Two Journeys · One Shared Brand',
    title: 'Career HQ',
    lines: [
      'Co-founded with Gandhi after meeting at Bharath University — Logo created 15 October 2025',
      'Study in India · Study Abroad · Training & Placement · MBBS · Loans · Scholarships',
    ],
    chips: ['Study in India', 'Study Abroad', 'MBBS', 'Placements', 'Loans', 'Scholarships'],
  },
  {
    kicker: 'Personal Brand Milestone',
    title: '50,000+ Followers',
    lines: [
      'Career with Beni launched on Instagram on 12 February 2026',
      '120+ videos published within approximately six months',
    ],
  },
  {
    kicker: 'Media & Content Ventures',
    title: 'Mic & Mentors',
    lines: [
      'Upcoming YouTube channel featuring founders, CEOs & industry experts',
      'Includes TRP – The Reality Project: documentary stories of everyday professions',
    ],
  },
  {
    kicker: 'The Wider Ecosystem',
    title: 'Connecting Dots',
    lines: [
      'Registered in Australia in 2025 · Building India operations under one parent identity',
      'Career HQ · Industry Connect · A T O M · DNA · HQ International · The Blind Spot',
    ],
  },
  {
    kicker: 'Leadership & Tribute',
    title: '8 Today · 15 Ahead',
    lines: [
      'Benita Samson & Gandhi leading Vino, Manimalan, Sajitha, Ashwini, Malathi & Agalya',
      'Happy Birthday, Benita — The Journey Continues',
    ],
  },
];

export type ProfileId = 'benita' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'benita',
    name: 'Benita',
    blurb: 'The full founder journey, in order',
    color: '#e5132b',
    order: ['about', /* 'journey', */ 'originals', 'picks', /* 'skills', */ 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Partners',
    blurb: 'Dossier, ventures & leadership first',
    color: '#4cc9ff',
    order: ['story', 'moments', /* 'skills', */ 'originals', 'about', /* 'journey', */ 'picks'],
  },
  {
    id: 'developer',
    name: 'Students',
    blurb: 'Career HQ, services & milestones first',
    color: '#46e3a8',
    order: ['originals', /* 'skills', 'journey', */ 'moments', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Media',
    blurb: 'Career with Beni, Mic & Mentors & highlights',
    color: '#ffb547',
    order: [/* 'journey', */ 'picks', 'originals', 'moments', 'about', /* 'skills', */ 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'Story', card: 'Founder Story', meta: 'The Woman Beyond the Vision', palette: violet },
  journey: { nav: 'Journey', card: 'Her Journey', meta: `${seasons.length} Chapters`, palette: amber },
  originals: { nav: 'Ventures', card: 'Ventures', meta: `${projects.length} Flagship Pillars`, palette: crimson },
  picks: { nav: 'Milestones', card: 'Top 10 Milestones', meta: '10 Defining Chapters', palette: jade },
  skills: { nav: 'Pillars', card: 'Focus Areas', meta: `${skillCategories.length} Domains`, palette: ocean },
  moments: { nav: 'Ecosystem', card: 'Ecosystem & Team', meta: `8 → 15 Team • 9 Initiatives`, palette: crimson },
  story: { nav: 'Dossier', card: 'The Full Story', meta: 'Founder Profile & Tribute PDF', palette: violet },
};

export type VideoReel = {
  id: string;
  episode: string;
  title: string;
  meta: string;
  kind?: 'video' | 'image';
  videoUrl: string;
  posterUrl: string;
  previewUrl: string;
  palette: Palette;
};

const REEL_1 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385103/Learn_what_lasts_not_what_is_popular_BENITA.mp4';
const REEL_2 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385103/benita_2_secret_AI_tool.mp4';
const REEL_3 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385115/ranking_for_common_study_method_BENITA.mp4';
const REEL_4 = 'https://res.cloudinary.com/dq5bryk8r/video/upload/v1794385124/Benita_If_you_don_t_want_your_son_to_struggle_in_future_teach_these_things.mp4';

const makeReel = (
  index: number,
  videoUrl: string,
  title: string,
  meta: string,
  palette: Palette,
): VideoReel => ({
  id: `reel-${index}`,
  episode: `Episode ${String(index).padStart(2, '0')}`,
  title,
  meta,
  videoUrl,
  posterUrl: videoUrl
    .replace('/video/upload/', '/video/upload/so_1,f_jpg,q_auto,w_720/')
    .replace(/\.mp4$/, '.jpg'),
  previewUrl: videoUrl.replace('/video/upload/', '/video/upload/q_auto,w_480/'),
  palette,
});

export const videoReels: VideoReel[] = [
  makeReel(1, REEL_1, 'Learn What Lasts', 'Reel • 9:16 Vertical', violet),
  makeReel(2, REEL_2, 'Secret AI Tool', 'Reel • AI Showcase', crimson),
  makeReel(3, REEL_3, 'Study Method Ranking', 'Reel • Retention Cut', amber),
  makeReel(4, REEL_4, 'Future-Ready Skills', 'Reel • Storytelling', ocean),
  makeReel(5, REEL_1, 'What Lasts — Cut II', 'Edit • Pacing & Sound', jade),
  makeReel(6, REEL_2, 'AI Tool — Cut II', 'Edit • Motion & Hook', crimson),
  makeReel(7, REEL_3, 'Study Ranking — Cut II', 'Edit • Captions & Flow', violet),
  makeReel(8, REEL_4, 'Future Skills — Cut II', 'Edit • Full Production', amber),
];

const makeFrame = (
  index: number,
  imageUrl: string,
  title: string,
  meta: string,
  palette: Palette,
): VideoReel => ({
  id: `archive-${index}`,
  episode: `Frame ${String(index).padStart(2, '0')}`,
  title,
  meta,
  kind: 'image',
  videoUrl: imageUrl,
  posterUrl: imageUrl,
  previewUrl: imageUrl,
  palette,
});

export const archiveMedia: VideoReel[] = [
  makeFrame(1, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03841.jpg', 'The Journey in Frames', 'Portrait Archive · 01', crimson),
  makeFrame(2, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03843.jpg', 'Founder Moments', 'Portrait Archive · 02', violet),
  makeFrame(3, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459419/DSC03861.jpg', 'Behind the Vision', 'Portrait Archive · 03', amber),
  makeFrame(4, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459418/DSC03852.jpg', 'Milestone Frames', 'Portrait Archive · 04', ocean),
  makeFrame(5, 'https://res.cloudinary.com/dq5bryk8r/image/upload/v1794459418/DSC03850.jpg', 'Beyond the Familiar', 'Portrait Archive · 05', jade),
  { ...makeReel(6, REEL_4, 'Future-Ready Skills', 'Video Reel · 06', ocean), id: 'archive-6', kind: 'video' },
  { ...makeReel(7, REEL_3, 'Study Method Ranking', 'Video Reel · 07', amber), id: 'archive-7', kind: 'video' },
  { ...makeReel(8, REEL_1, 'Learn What Lasts', 'Video Reel · 08', violet), id: 'archive-8', kind: 'video' },
];
