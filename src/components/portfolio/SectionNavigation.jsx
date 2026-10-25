import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const sections = [['selected-work','Projects'],['journey','Experience'],['toolbench','Skills'],['connect','Contact']];
export default function SectionNavigation({ scrollRef }) {
  const [active,setActive] = useState('intro');
  const { scrollYProgress } = useScroll({container:scrollRef});
  const progress = useSpring(scrollYProgress,{stiffness:180,damping:30});
  useEffect(() => {
    const scroller=scrollRef.current;
    const update=() => {
      const threshold=scroller.clientHeight*.45;
      const candidates=['intro',...sections.map(([id])=>id)];
      const current=candidates.filter((id) => document.getElementById(id)?.getBoundingClientRect().top<=threshold).at(-1) || 'intro';
      setActive((previous) => previous===current ? previous : current);
    };
    let frame=0;
    const schedule=() => { cancelAnimationFrame(frame); frame=requestAnimationFrame(update); };
    scroller.addEventListener('scroll',schedule,{passive:true}); update();
    return () => { scroller.removeEventListener('scroll',schedule); cancelAnimationFrame(frame); };
  },[scrollRef]);
  return <><motion.div className="folio-reading-progress" style={{scaleX:progress}} aria-hidden="true" /><AnimatePresence>{active!=='intro' && <motion.nav className="folio-floating-nav" aria-label="Quick section navigation" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}} transition={{duration:.2}}>{sections.map(([id,label]) => <a key={id} href={`#${id}`} aria-current={active===id ? 'location' : undefined}>{label}</a>)}<a href="/resume" target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={13} /></a></motion.nav>}</AnimatePresence></>;
}
