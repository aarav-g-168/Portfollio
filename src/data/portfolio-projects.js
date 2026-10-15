import { locations } from '../constants/index.js';

const editorial = {
  5: {
    slug: 'contest-manager', category: 'FULL STACK / PRODUCT', title: 'One place. Every contest.',
    stack: ['Next.js', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle ORM'], accent: '#c5d3f2',
    brief: 'Contest discovery without the tab hopping.',
    features: ['CLIST API integration', 'Timezone-aware countdowns', 'Authenticated contest tracking'],
    nodes: [
      { label: 'CLIST API', caption: 'Contest source', detail: 'Upcoming competitive programming contests are collected through the CLIST API.' },
      { label: 'Server fetching', caption: 'Next.js · Express', detail: 'Server-side fetching and filtering keep contest data organized within the selected time window.' },
      { label: 'PostgreSQL', caption: 'Drizzle ORM', detail: 'The backend uses PostgreSQL with Drizzle ORM for data persistence.' },
      { label: 'Dashboard', caption: 'Next.js · TypeScript', detail: 'The interface brings contests together with countdowns and timezone-aware scheduling. Firebase Authentication supports personalized tracking.' },
    ],
  },
  6: {
    slug: 'ios-fusion', category: 'CREATIVE DEVELOPMENT / EVENT', title: 'An event worth experiencing.',
    stack: ['React', 'Interactive UI', 'Responsive design'], accent: '#cfbff5',
    brief: 'An interactive home for iOS Fusion 8.0.',
    features: ['CSS MacBook experience', 'Event discovery and timeline', 'Workshops, speakers and tracks'],
    nodes: [
      { label: 'Discover', caption: 'Event landing', detail: 'A custom CSS-built MacBook introduces the event through an interactive landing experience.' },
      { label: 'Explore', caption: 'Workshops · Appathon', detail: 'Dedicated sections introduce the workshops, Appathon and competition tracks.' },
      { label: 'Plan', caption: 'Timeline · Speakers', detail: 'Visitors can explore the event timeline, speakers, partners and frequently asked questions.' },
      { label: 'Register', caption: 'Registration experience', detail: 'The event website guides visitors toward registration. This map describes the visitor journey rather than a backend architecture.' },
    ],
  },
  7: {
    slug: 'hackgrid', category: 'FULL STACK / PLATFORM', title: 'From auction to final verdict.',
    stack: ['Next.js', 'Prisma', 'Neon', 'Firebase'], accent: '#c7d5bd',
    brief: 'The workflow behind an auction-based hackathon.',
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
  description: project.children.find((item) => item.fileType === 'txt').description,
  image: `/preview/${editorial[project.id].slug}-960.webp`,
  imageSet: [480,960,1440].map((width) => `/preview/${editorial[project.id].slug}-${width}.webp ${width}w`).join(', '),
  links: project.children.filter((item) => item.fileType === 'url'),
}));

export const portfolioHome = import.meta.env.DEV ? '/preview' : '/';
export const projectPath = (project) => `${import.meta.env.DEV ? '/preview' : ''}/projects/${project.slug}/`;
