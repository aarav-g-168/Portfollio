import { experiences, gallery, locations, techStack } from '../constants/index.js';

export const spotlightItems = [
  { id: 'app-projects', title: 'Projects', subtitle: 'Browse my work in Finder', category: 'Applications', icon: 'folder', windowKey: 'finder', keywords: 'projects portfolio work full stack frontend backend' },
  { id: 'app-contact', title: 'Contact', subtitle: 'Write a message or find me online', category: 'Applications', icon: 'mail', windowKey: 'contact', keywords: 'email hire hiring message connect collaboration' },
  { id: 'app-experience', title: 'Experience', subtitle: 'Internship & leadership', category: 'Applications', icon: 'briefcase', windowKey: 'experience', keywords: 'work job career internship leadership' },
  { id: 'app-coding', title: 'Competitive Programming', subtitle: 'CodeChef, Codeforces, LeetCode & GitHub', category: 'Applications', icon: 'trophy', windowKey: 'coding', keywords: 'dsa algorithms rating contest rank contribution github codechef codeforces leetcode' },
  { id: 'app-resume', title: 'Resume', subtitle: 'Open my résumé', category: 'Applications', icon: 'file', windowKey: 'resume', keywords: 'cv download pdf resume résumé' },
  { id: 'app-skills', title: 'Skills', subtitle: 'Explore my tech stack', category: 'Applications', icon: 'terminal', windowKey: 'terminal', keywords: 'technologies tools languages tech stack' },
  { id: 'app-gallery', title: 'Photos', subtitle: 'Personal & social moments', category: 'Applications', icon: 'image', windowKey: 'photos', keywords: 'gallery photos personal social pictures favorites' },
  { id: 'app-notes', title: 'Build Notes', subtitle: 'The thinking behind the builds', category: 'Applications', icon: 'notes', windowKey: 'safari', keywords: 'articles blog notebook notes writing engineering interface pinned' },
  { id: 'app-archive', title: 'Archive', subtitle: 'Parked ideas & saved notes', category: 'Applications', icon: 'archive', windowKey: 'trash', keywords: 'archive trash shelf restore ideas archived' },
  ...locations.work.children.map((project) => ({ id: `project-${project.id}`, title: project.name, subtitle: 'Open project folder', category: 'Projects', icon: 'folder', windowKey: 'finder', project,
    keywords: `project ${(project.children ?? []).flatMap((file) => file.description ?? []).join(' ')}` })),
  ...experiences.map((entry) => ({ id: entry.id, title: entry.organization, subtitle: `${entry.role} · ${entry.type}`, category: 'Experience', icon: 'briefcase', windowKey: 'experience', data: { entryId: entry.id }, keywords: `${entry.type} ${entry.skills.join(' ')} ${entry.highlights.join(' ')}` })),
  ...techStack.flatMap((group) => group.items.map((skill) => ({ id: `skill-${skill}`, title: skill, subtitle: `${group.category} · Tech stack`, category: 'Skills', icon: 'terminal', windowKey: 'terminal', keywords: `skills ${group.category} technology` }))),
  ...gallery.map((photo) => ({ id: `photo-${photo.id}`, title: photo.name, subtitle: `${photo.category === 'personal' ? 'Personal' : 'Social'} photo`, category: 'Photos', icon: 'image', windowKey: 'imgfile', data: { ...photo, imageUrl: photo.img }, keywords: `gallery photo ${photo.category}` })),
];

export function searchSpotlight(query) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    .filter((token) => !['show', 'me', 'my', 'the', 'find'].includes(token))
    .map((token) => token.replace(/s$/, ''));
  if (!tokens.length) return spotlightItems.slice(0, 7);
  return spotlightItems.map((item) => {
    const title = item.title.toLowerCase();
    const text = `${title} ${item.subtitle} ${item.category} ${item.keywords}`.toLowerCase();
    const score = tokens.every((token) => text.includes(token))
      ? tokens.reduce((sum, token) => sum + (title.startsWith(token) ? 12 : title.includes(token) ? 8 : 1), 0) : 0;
    return { ...item, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 9);
}
