import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanSearch, Braces, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import useHydrated from './useHydrated';

const steps = [
  { title:'Find the real problem.',label:'UNDERSTAND',icon:ScanSearch,text:'Start with the person using it. Map the essential actions, remove unnecessary steps, and decide what the application actually needs to do.',example:'Contest Manager brings fragmented contest schedules into a single dashboard.' },
  { title:'Make the pieces work together.',label:'BUILD',icon:Braces,text:'Connect the interface, APIs, authentication and data model. Keep the boundaries understandable so the experience can grow without becoming fragile.',example:'HackGrid connects organizer workflows, auction settlements and judging.' },
  { title:'Then sweat the details.',label:'REFINE',icon:SlidersHorizontal,text:'Check small screens, keyboard navigation, loading and error states. Give motion a purpose, and make the useful path easy to find.',example:'MacFolio pairs its desktop interactions with Spotlight search and an optional guided tour.' },
];
export default function BuildProcess() {
  const [active,setActive] = useState(0);
  const enhanced=useHydrated();
  const step = steps[active];
  return <div className="folio-process"><div className="folio-process-heading"><span className="folio-mono">FROM QUESTION TO SOMETHING USEFUL</span><h3>How I approach a build.</h3></div><div className="folio-process-tabs" aria-label="Explore my development approach">{steps.map((item,index) => { const Icon=item.icon; return <button key={item.label} aria-pressed={active===index} onClick={() => setActive(index)}><Icon size={20} /><span><small>0{index+1}</small>{item.label}</span><ArrowUpRight size={16} /></button>; })}</div><div className="folio-process-detail" aria-live="polite"><AnimatePresence mode="wait"><motion.div key={active} initial={enhanced ? {opacity:0,y:8} : false} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}><h4>{step.title}</h4><p>{step.text}</p><span>{step.example}</span></motion.div></AnimatePresence></div></div>;
}
