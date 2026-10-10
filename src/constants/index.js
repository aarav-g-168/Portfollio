const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 5,
    name: "Experience",
    type: "experience",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

// Experience details displayed in the Mac-style Experience window.
export const experiences = [
  {
    id: "experience-1",
    role: "Full Stack Developer Intern",
    organization: "Solder Labs",
    type: "Internship",
    dates: "Sept 2026 – Present",
    location: "Hybrid",
    highlights: [
      "Contributing to the development of MediOS, a hospital operating system integrating patient records, scheduling, billing, staff management, and communication workflows into a unified platform.",
      "Collaborating across frontend and backend teams to support feature development, integration, debugging, and coordination of the product for upcoming client deployment.",
    ],
    skills: [
      "Next.js", "React", "TypeScript", "Express", "PostgreSQL",
      "Prisma", "Drizzle ORM", "Neon", "REST APIs", "Git",
    ],
    link: "",
    placeholder: false,
  },
  {
    id: "experience-2",
    role: "Core Member",
    organization: "Advanced Developer’s Group",
    type: "Leadership",
    dates: "Feb 2025 – Present",
    location: "Vellore Institute of Technology",
    highlights: [
      "Selected as a Core Member in the Web Development domain of Advanced Developer’s Club (ADG), collaborating with senior developers on full-stack projects and scalable web applications using modern development practices.",
      "Contributed to the development of responsive web solutions using React, Next.js, TypeScript, and Firebase while working on API integration, UI optimization, debugging, Git-based collaboration, and deployment workflows.",
    ],
    skills: [
      "Next.js", "React", "TypeScript", "Python", "Tailwind CSS",
      "Firebase", "Firebase Auth", "Firebase Database", "Google OAuth",
      "Chakra UI", "Framer Motion", "Git",
    ],
    link: "",
    placeholder: false,
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio",
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Build Notes",
    icon: "build-notes.svg",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery",
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills",
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash",
    name: "Archive",
    icon: "trash.png",
    canOpen: true,
  },
];

const techStack = [
  {
    category: "Languages",
    items: ["Java", "C++", "Python", "JavaScript", "TypeScript"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js"],
  },
  {
    category: "Databases & BaaS",
    items: ["MongoDB", "Firebase"],
  },
  {
    category: "Libraries & Tools",
    items: ["Zustand", "GSAP", "Vite"],
  },
  {
    category: "Developer Tools",
    items: ["Git", "GitHub", "VS Code", "Postman"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/aarav-g-168",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://www.linkedin.com/in/aaravgupta168/",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#4bcb63",
    link: "https://x.com/aarav_g_168",
  },
  {
    id: 4,
    text: "Instagram",
    icon: "/icons/instagram.png",
    bg: "#ff866b",
    link: "https://www.instagram.com/aarav_g_168/",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Personal",
    category: "personal",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "Social",
    category: "social",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  {
    id: 1,
    img: "/images/aarav.jpeg",
    name: "Aarav",
    category: "personal",
  },
  {
    id: 5,
    img: "/images/formal.jpeg",
    name: "Formal portrait",
    category: "personal",
  },
  {
    id: 6,
    img: "/images/poc.jpeg",
    name: "Event-POC",
    category: "personal",
  },
  {
    id: 7,
    img: "/images/sharktech.jpeg",
    name: "SharkTech-OC",
    category: "social",
  },
  {
    id: 8,
    img: "/images/riviera.jpeg",
    name: "Riviera-Events Committee",
    category: "social",
  },
  {
    id: 9,
    img: "/images/iosfusion.jpeg",
    name: "iOS Fusion-OC",
    category: "social",
  },
  {
    id: 10,
    img: "/images/guest.jpeg",
    name: "iOS Fusion-Guest Speaker",
    category: "social",
  },
  {
    id: 11,
    img: "/images/speaker.jpeg",
    name: "SharkTech-Guest Speaker",
    category: "social",
  },
];

export {
  navLinks,
  navIcons,
  dockApps,
  techStack,
  socials,
  photosLinks,
  gallery,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1 — Contest Manager
    {
      id: 5,
      name: "Contest Manager",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5",
      windowPosition: "top-[5vh] left-5",

      children: [
        {
          id: 1,
          name: "Contest Manager.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",

          description: [
            "A full-stack competitive programming contest aggregator that brings upcoming contests from multiple platforms into a single dashboard.",
            "Integrated the CLIST API to centralize contest discovery across platforms such as Codeforces, CodeChef, LeetCode, and others.",
            "Implemented server-side fetching and optimized filtering to display contests within a defined time window, with real-time countdown timers and timezone-aware scheduling.",
            "Built with Next.js, TypeScript, Express, PostgreSQL, and Drizzle ORM, with Firebase Authentication for secure user login and personalized contest tracking."
          ],
        },

        {
          id: 2,
          name: "contest-manager.vercel.app",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://contest-manager.vercel.app/",
          position: "top-10 right-20",
        },

        {
          id: 4,
          name: "contest-manager.png",
          icon: "/images/image1.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/image1.png",
        },

        {
          id: 5,
          name: "GitHub",
          icon: "/images/github.png",
          kind: "file",
          fileType: "url",
          href: "https://github.com/aarav-g-168/ContestManager",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 2 — iOS Fusion 8.0

    {
      id: 6,
      name: "iOS Fusion 8.0",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-52 right-80",
      windowPosition: "top-[20vh] left-7",

      children: [
        {
          id: 1,
          name: "iOS Fusion 8.0.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",

          description: [
            "A modern event website built for iOS Fusion 8.0, the flagship event of the Advanced Developer Group (ADG) held during VIT's Gravitas technical fest.",
            "Designed to showcase the event, workshops, Appathon, speakers, partners, timeline, and registration experience through an immersive and interactive interface.",
            "Features a custom CSS-built MacBook experience on the landing page, along with dedicated sections for the event timeline, competition tracks, partners, and FAQs.",
            "The event focuses on iOS development and Machine Learning, with tracks spanning HealthTech, AgriTech, Smart Mobility, Green AI & Sustainability, FinTech, and Open Innovation."
          ],
        },

        {
          id: 2,
          name: "ios-fusion-2025.vercel.app",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://ios-fusion-2025.vercel.app/",
          position: "top-20 left-20",
        },

        {
          id: 4,
          name: "ios-fusion.png",
          icon: "/images/image2.png",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/image2.png",
        },

        {
          id: 5,
          name: "GitHub",
          icon: "/images/github.png",
          kind: "file",
          fileType: "url",
          href: "https://github.com/ADG-VITV/IOS-Fusion-2025",
          position: "top-60 right-80",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 7,
      name: "HackGrid 26'",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[33vh] left-7",
      children: [
        {
          id: 1,
          name: "HackGrid 26' Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Full-stack platform built to digitize and manage an auction-based hackathon from team registration to final judging.",
            "Centralizes team management, problem-statement allocation, auction settlements, and judging into a single workflow.",
            "Includes dedicated organizer and judge interfaces with team search, settlement tracking, and structured project evaluation.",
            "Built with Next.js, TypeScript, React, Tailwind CSS, Prisma, Neon PostgreSQL, Firebase Authentication, REST APIs, and Git."
          ],
        },
        {
          id: 2,
          name: "HackGrid live",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://www.adgvit.com/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "HackGrid.png",
          icon: "/images/HackGrid.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/HackGrid.png",
        },
        {
          id: 5,
          name: "GitHub",
          icon: "/images/github.png",
          kind: "file",
          fileType: "url",
          href: "https://github.com/ADG-VITV/HackGrid",
          position: "top-60 right-20",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "aarav.jpeg",
      icon: "/images/aarav.jpeg",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/aarav.jpeg",
    },
    {
      id: 2,
      name: "formal.jpeg",
      icon: "/images/formal.jpeg",
      kind: "file",
      fileType: "img",
      position: "top-28 right-72",
      imageUrl: "/images/formal.jpeg",
    },
    {
      id: 3,
      name: "poc.jpeg",
      icon: "/images/poc.jpeg",
      kind: "file",
      fileType: "img",
      position: "top-52 left-80",
      imageUrl: "/images/poc.jpeg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Meet the Developer Behind the Code",
      image: "/images/aarav.jpeg",
      description: [
        "Hey! I’m Aarav 👋, a web developer who enjoys building sleek, interactive websites that actually work well.",
        "I specialize in JavaScript, React, and Next.js—and I love making things feel smooth, fast, and just a little bit delightful.",
        "I’m big on clean UI, good UX, and writing code that doesn’t need a search party to debug.",
        "Outside of dev work, you'll find me tweaking layouts at 2AM, sipping overpriced coffee, or impulse-buying gadgets I absolutely convinced myself I needed 😅",
      ],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      href: "/resume.pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Archive",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [],
};

export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  trash: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  coding: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  experience: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
  imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null, maximized: false, originalStyle: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
