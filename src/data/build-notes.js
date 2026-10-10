// Portfolio copy lives here. Add or update notes without changing the window UI.
export const buildNotes = [
  {
    id: 'welcome', title: 'A few notes from the workbench.', category: 'Desk notes', pinned: true,
    summary: 'The thinking behind the interfaces, workflows, and small details.',
    intro: 'A place for short notes from the things I build. Each one looks at a problem, an approach, and a useful principle to carry into the next project.',
    sections: [
      { heading: 'Small details, real work', text: 'A contest countdown, an organizer dashboard, a window that remembers where it belongs. The interesting part is often the detail between the bigger features.' },
      { heading: 'Inside this notebook', text: 'Browse notes on Contest Manager, HackGrid, iOS Fusion, and this desktop. Use the search field to find a topic, or pin a note to keep it close.' },
    ],
    takeaway: 'Good software makes the next step clear.',
    tags: ['Interfaces', 'Engineering', 'Work in progress'],
  },
  {
    id: 'desktop-windows', title: 'A desktop is more than a collection of cards.', category: 'Interface',
    summary: 'Giving a portfolio the behavior of a small operating system.',
    intro: 'A desktop interface creates an expectation: windows should behave like windows. The visual metaphor works best when the interactions follow through.',
    sections: [
      { heading: 'The problem', text: 'Projects, contact details, and experience all need to stay easy to reach while several windows can be open at once.' },
      { heading: 'The approach', text: 'A shared Zustand store coordinates opening, focus, minimizing, and maximizing. GSAP handles dragging and dock transitions. Spotlight provides another route to the same content.' },
      { heading: 'A detail that matters', text: 'Dragging changes a window’s transform. Maximizing clears that offset, then restoring brings the saved position back. Sizing returns to CSS rules so the window can adapt to the viewport.' },
    ],
    takeaway: 'A familiar interface earns its familiarity through behavior.',
    tags: ['React', 'Zustand', 'GSAP', 'Interaction'],
  },
  {
    id: 'contest-time', title: 'One contest. Many time zones.', category: 'Engineering', projectId: 5,
    summary: 'Keeping contest discovery and countdowns in the same frame of reference.',
    intro: 'Contest Manager brings schedules from multiple programming platforms into one dashboard. A start time needs to make sense wherever someone is preparing to compete.',
    sections: [
      { heading: 'The problem', text: 'Contest platforms publish separate schedules. Discovering the next contest and understanding when it starts should be a single, straightforward task.' },
      { heading: 'The approach', text: 'Server-side fetching brings CLIST data together. Filtering narrows the schedule to a useful time window, while countdown timers and timezone-aware formatting help visitors interpret the results.' },
      { heading: 'The principle', text: 'Keep the event’s instant separate from its display format. A timezone changes how a start time is shown; it should never change when the event happens.' },
    ],
    takeaway: 'Store a consistent instant. Present a useful local time.',
    tags: ['Next.js', 'TypeScript', 'APIs', 'Scheduling'],
  },
  {
    id: 'hackgrid-workflow', title: 'An auction needs a clear next step.', category: 'Engineering', projectId: 7,
    summary: 'Connecting teams, problem allocation, settlements, and judging.',
    intro: 'HackGrid brings an auction-based hackathon into one workflow, from team registration through the final evaluation.',
    sections: [
      { heading: 'The problem', text: 'Team management, auction settlements, and judging are connected stages. An organizer and a judge need different views of that shared information.' },
      { heading: 'The approach', text: 'Dedicated organizer and judge interfaces bring team search, problem-statement allocation, settlement tracking, and structured evaluation into the same platform.' },
      { heading: 'The principle', text: 'Design around the task someone is completing. A useful dashboard makes the current state and the next action easy to understand.' },
    ],
    takeaway: 'Organize the interface around the workflow.',
    tags: ['React', 'Prisma', 'PostgreSQL', 'Product design'],
  },
  {
    id: 'fusion-interface', title: 'An event website should help you show up.', category: 'Interface', projectId: 6,
    summary: 'Balancing an immersive introduction with practical event information.',
    intro: 'The iOS Fusion 8.0 website pairs a custom CSS-built MacBook experience with the information visitors need to understand and join the event.',
    sections: [
      { heading: 'The problem', text: 'An event has a personality, but visitors also need to find its timeline, tracks, speakers, and registration details quickly.' },
      { heading: 'The approach', text: 'The landing experience introduces the event visually. Dedicated sections hold workshops, Appathon tracks, speakers, partners, and FAQs.' },
      { heading: 'The principle', text: 'Let the expressive parts invite exploration, then give essential information a predictable home.' },
    ],
    takeaway: 'Make the experience memorable and the information easy to find.',
    tags: ['CSS', 'Web design', 'Events', 'Navigation'],
  },
  {
    id: 'spotify-idea', title: 'A soundtrack for the desktop.', category: 'On the shelf', archived: true,
    summary: 'A parked idea for the Spotify notch.',
    intro: 'The notch already has a home in this portfolio. Connecting it to Spotify is a future addition; the player currently shows an honest, disconnected state.',
    sections: [
      { heading: 'The idea', text: 'Show the current track and album artwork in a compact player that expands from the menu bar.' },
      { heading: 'Before it ships', text: 'Decide how account connection should work, keep credentials on the server, and handle idle playback, expired sessions, and unavailable data gracefully.' },
    ],
    takeaway: 'A little personality, with a useful fallback.',
    tags: ['Idea', 'Spotify', 'Future addition'],
  },
  {
    id: 'long-form-idea', title: 'Longer stories, someday.', category: 'On the shelf', archived: true,
    summary: 'Room for deeper write-ups when there is a story worth sharing.',
    intro: 'For now, short build notes are a useful way to share the thinking behind a project. Longer articles can grow from them over time.',
    sections: [
      { heading: 'The idea', text: 'Turn a focused build note into a deeper walkthrough, with code, screenshots, tradeoffs, and a concrete example.' },
      { heading: 'A useful starting point', text: 'Contest scheduling and desktop window behavior are two topics with enough detail for a future walkthrough.' },
    ],
    takeaway: 'Start with a clear observation. Let the story grow from there.',
    tags: ['Idea', 'Writing', 'Future addition'],
  },
];

export const noteSearchText = (note) => [note.title, note.summary, note.intro, ...note.tags,
  ...note.sections.flatMap((section) => [section.heading, section.text]), note.takeaway].join(' ').toLowerCase();
