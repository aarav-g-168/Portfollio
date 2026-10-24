import { experiences } from '../constants/index.js';

// Portfolio copy is independent of the published MacFolio window.
const highlights = {
  'experience-1': [
    'Contribute to MediOS, a hospital operating system covering patient records, scheduling, billing, staff management, and communication.',
    'Work with frontend and backend teams on features, integration, debugging, and preparation for client deployment.',
  ],
  'experience-2': [
    'Core member of ADG’s Web Development team at VIT Vellore, collaborating on full stack web applications.',
    'Build responsive interfaces with React, Next.js, TypeScript, and Firebase; contribute to API integration, UI improvements, debugging, and deployment.',
  ],
};

export const portfolioExperiences = experiences.map((entry) => ({
  ...entry,
  highlights: highlights[entry.id] || entry.highlights,
}));
