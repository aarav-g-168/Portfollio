import { locations } from '../constants/index.js';

const editorial = {
  5: {
    slug: 'contest-manager', category: 'FULL STACK / WEB APPLICATION', title: 'Competitive programming contest dashboard',
    stack: ['Next.js', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle ORM'], accent: '#c5d3f2',
    brief: 'Upcoming contests, countdowns, and personalized tracking in one dashboard.',
    description: [
      'A full stack dashboard for discovering and tracking upcoming competitive programming contests across multiple platforms.',
      'Integrated the CLIST API to collect contest schedules from Codeforces, CodeChef, LeetCode, and other platforms.',
      'Implemented server-side fetching and time-window filtering, with live countdowns and timezone-aware scheduling.',
      'Used Next.js and TypeScript for the interface, Express for the backend, PostgreSQL with Drizzle ORM for persistence, and Firebase Authentication for user accounts and personalized tracking.',
    ],
    features: ['CLIST API integration', 'Timezone-aware countdowns', 'Authenticated contest tracking'],
    nodes: [
      { label: 'CLIST API', caption: 'Contest source', detail: 'Upcoming competitive programming contests are collected through the CLIST API.' },
      { label: 'Server fetching', caption: 'Next.js · Express', detail: 'Server-side fetching and filtering keep contest data organized within the selected time window.' },
      { label: 'PostgreSQL', caption: 'Drizzle ORM', detail: 'The backend uses PostgreSQL with Drizzle ORM for data persistence.' },
      { label: 'Dashboard', caption: 'Next.js · TypeScript', detail: 'The interface brings contests together with countdowns and timezone-aware scheduling. Firebase Authentication supports personalized tracking.' },
    ],
  },
  6: {
    slug: 'ios-fusion', category: 'FRONTEND / EVENT WEBSITE', title: 'Event website for iOS Fusion 8.0',
    stack: ['React', 'Interactive UI', 'Responsive design'], accent: '#cfbff5',
    brief: 'An interactive website covering event information, workshops, speakers, and registration.',
    description: [
      'An event website for iOS Fusion 8.0, organized by ADG during VIT’s Gravitas technical fest.',
      'Organized workshops, Appathon information, speakers, partners, and registration into dedicated sections.',
      'Built a custom CSS MacBook interaction for the landing page, alongside the event timeline, competition tracks, and FAQs.',
      'Presented the event’s iOS development and machine learning tracks, including HealthTech, AgriTech, Smart Mobility, sustainability, FinTech, and Open Innovation.',
    ],
    features: ['CSS MacBook experience', 'Event discovery and timeline', 'Workshops, speakers and tracks'],
    nodes: [
      { label: 'Discover', caption: 'Event landing', detail: 'A custom CSS-built MacBook introduces the event through an interactive landing experience.' },
      { label: 'Explore', caption: 'Workshops · Appathon', detail: 'Dedicated sections introduce the workshops, Appathon and competition tracks.' },
      { label: 'Plan', caption: 'Timeline · Speakers', detail: 'Visitors can explore the event timeline, speakers, partners and frequently asked questions.' },
      { label: 'Register', caption: 'Event registration', detail: 'Registration links give visitors a direct next step after reviewing event details.' },
    ],
  },
  7: {
    slug: 'hackgrid', category: 'FULL STACK / PLATFORM', title: 'Hackathon operations and judging',
    stack: ['Next.js', 'Prisma', 'Neon', 'Firebase'], accent: '#c7d5bd',
    brief: 'Team management, auction settlements, and project evaluation for an auction-based hackathon.',
    description: [
      'A full stack platform for managing an auction-based hackathon, from team registration to project evaluation.',
      'Combined team management, problem-statement allocation, auction settlements, and judging in a shared workflow.',
      'Built organizer and judge interfaces with team search, settlement tracking, and structured project evaluation.',
      'Implemented the application with Next.js, TypeScript, React, Tailwind CSS, Prisma, Neon PostgreSQL, Firebase Authentication, and REST APIs.',
    ],
    features: ['Team and auction management', 'Organizer and judge interfaces', 'Structured project evaluation'],
    nodes: [
      { label: 'Organizers & judges', caption: 'Next.js · React', detail: 'Dedicated interfaces provide team search, auction settlement tracking and project evaluation.' },
      { label: 'REST APIs', caption: 'Application workflows', detail: 'Backend workflows coordinate team management, problem allocation, auction settlements and judging.' },
      { label: 'Prisma', caption: 'Data access', detail: 'Prisma connects application workflows to the database through a typed data layer.' },
      { label: 'Neon PostgreSQL', caption: 'Persistence', detail: 'Neon PostgreSQL persists platform data. Firebase Authentication handles authentication alongside the application.' },
    ],
  },
};

export const portfolioProjects = [locations.work.children[2], ...locations.work.children.slice(0, 2)].map((project) => ({
  ...project, ...editorial[project.id],
  image: `/preview/${editorial[project.id].slug}-960.webp`,
  imageSet: [480,960,1440].map((width) => `/preview/${editorial[project.id].slug}-${width}.webp ${width}w`).join(', '),
  links: project.children.filter((item) => item.fileType === 'url'),
}));

export const portfolioHome = import.meta.env.DEV ? '/preview' : '/';
export const projectPath = (project) => `${import.meta.env.DEV ? '/preview' : ''}/projects/${project.slug}/`;
