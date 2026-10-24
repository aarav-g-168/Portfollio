import { techStack } from '../constants/index.js';

// Keep the new portfolio's skill additions independent of the published desktop.
export const portfolioSkills = techStack.map((group) => group.category === 'Frontend'
  ? { ...group, items: [...group.items.slice(0, 2), 'React Native', ...group.items.slice(2)] }
  : group);
