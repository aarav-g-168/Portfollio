import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Monitor, Mouse, RotateCcw } from 'lucide-react';

const ModelViewer = lazy(() => import('./ModelViewer'));
const query = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
const subscribe = (callback) => { const media = matchMedia(query); media.addEventListener('change',callback); return () => media.removeEventListener('change',callback); };
const desktopSnapshot = () => matchMedia(query).matches;

class ModelBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed:true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? <div className="folio-model-fallback"><img src="/preview/macfolio.webp" alt="MacFolio desktop preview" /><p>The 3D preview is unavailable. Select Enter MacFolio below to open the desktop.</p></div> : this.props.children; }
}

export default function DesktopPortal({ scrollRef }) {
  const desktop = useSyncExternalStore(subscribe,desktopSnapshot,() => false);
  const reduce = useReducedMotion();
  const showroomRef = useRef(null), stageRef = useRef(null), screenRect = useRef(null), interactionRect = useRef(null), progressRef = useRef(0), entering = useRef(false);
  const inView = useInView(showroomRef,{ margin:'400px',once:true });
  const [progress,setProgress] = useState(0), [ready,setReady] = useState(false), [failed,setFailed] = useState(false), [overlay,setOverlay] = useState(null);
  const interactive = desktop && !reduce;
  const loaded = useCallback(() => setReady(true),[]);
  const measured = useCallback((rect) => { screenRect.current = rect; },[]);
  const hitArea = useCallback((rect) => { interactionRect.current = rect; },[]);
  const update = useCallback((value) => { if (entering.current) return; progressRef.current = Math.max(0,Math.min(1,value)); setProgress(progressRef.current); },[]);
  const remember = useCallback(() => { try { sessionStorage.setItem('portfolio-scroll',String(scrollRef.current.scrollTop)); } catch { /* Optional navigation memory. */ } },[scrollRef]);
  const go = useCallback(() => { remember(); window.history.pushState(null,'','/desktop'); window.dispatchEvent(new PopStateEvent('popstate')); },[remember]);
  // Prefetch is optional: a transient chunk failure must not reject globally.
  useEffect(() => { if (progress > .1) void import('../../App.jsx').catch(() => {}); },[progress]);
  const arrive = useCallback(() => {
    if (progressRef.current < 1 || entering.current) return;
    const stage = stageRef.current.getBoundingClientRect(), rect = screenRect.current;
    if (!rect || rect.width <= 0 || rect.height <= 0) { go(); return; }
    entering.current = true;
    setOverlay({ left:stage.left+rect.left, top:stage.top+rect.top, width:rect.width,height:rect.height, viewportWidth:window.innerWidth,viewportHeight:window.innerHeight });
  },[go]);
  useEffect(() => {
    const stage = stageRef.current;
    if (!interactive || !stage || !ready) return;
    const wheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaY)<Math.abs(event.deltaX)) return;
      const area = interactionRect.current, bounds = stage.getBoundingClientRect();
      const x = event.clientX-bounds.left, y = event.clientY-bounds.top;
      if (!area || x<area.left || x>area.right || y<area.top || y>area.bottom) return;
      if (progressRef.current === 0 && event.deltaY<0) return;
      event.preventDefault();
      const pixels = event.deltaY*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? window.innerHeight : 1);
      update(progressRef.current+Math.max(-260,Math.min(260,pixels))/1000);
    };
    stage.addEventListener('wheel',wheel,{passive:false});
    return () => stage.removeEventListener('wheel',wheel);
  },[interactive,ready,update]);
  useEffect(() => {
    if (!overlay) return;
    const cancel = (event) => { if (event.key==='Escape') { entering.current=false; progressRef.current=0; setProgress(0); setOverlay(null); } };
    window.addEventListener('keydown',cancel);
    return () => window.removeEventListener('keydown',cancel);
  },[overlay]);
  return <section className="folio-showroom" id="desktop-preview" ref={showroomRef}><div className="folio-section"><div className="folio-section-label"><span>03</span><span>INTERACTIVE PORTFOLIO</span><span aria-hidden="true">↗</span></div><div className="folio-showroom-heading"><h2>Explore<br /><em>MacFolio.</em></h2><p>A macOS-inspired interface for my projects,<br />experience, and technical skills.</p></div>
    {interactive ? <><div className="folio-model-stage" ref={stageRef} tabIndex={0} role="group" aria-label="Interactive MacFolio laptop. Scroll over the laptop or use up and down arrow keys to explore. Escape resets." onKeyDown={(event) => { if (['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Escape'].includes(event.key)) { event.preventDefault(); update(event.key==='Escape' ? 0 : progressRef.current+(['ArrowDown','ArrowRight'].includes(event.key) ? .25 : -.25)); } }}>
      {inView && <ModelBoundary onFailure={() => setFailed(true)}><Suspense fallback={<div className="folio-model-loading">Loading MacFolio preview…</div>}><ModelViewer progress={progress} onReady={loaded} onScreenRect={measured} onInteractionRect={hitArea} onArrive={arrive} /></Suspense></ModelBoundary>}
      <div className="folio-model-status"><Mouse size={15} />{failed ? 'SELECT ENTER MACFOLIO BELOW' : ready ? progress>0 ? 'SCROLL FORWARD TO ENTER / BACKWARD TO REWIND' : 'SCROLL OVER THE LAPTOP TO ENTER MACFOLIO' : 'LOADING MACFOLIO PREVIEW'}</div>
    </div><div className="folio-portal-controls"><div><div className="folio-portal-progress" role="progressbar" aria-label="MacFolio entry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}>{[0,1,2,3].map((i) => <span key={i} className={progress>(i/4) ? 'filled' : ''} />)}</div><button onClick={() => update(0)} aria-label="Reset laptop animation"><RotateCcw size={13} /> Reset</button></div><button onClick={go}>Enter MacFolio <ArrowUpRight size={16} /></button><a href="#toolbench">Continue exploring <ArrowDown size={14} /></a></div></> : <div className="folio-mobile-desktop"><img src="/preview/macfolio.webp" alt="MacFolio with a menu bar, project folders and app dock" width="1280" height="720" loading="lazy" />{desktop ? <><p>Explore the desktop without the scroll animation.</p><button className="folio-portal-direct" onClick={go}>Enter MacFolio <ArrowUpRight size={16} /></button></> : <><p>MacFolio is designed for desktop. My projects, experience, skills, and contact details are available on this page.</p><span><Monitor size={15} /> DESKTOP EXPERIENCE</span></>}</div>}
  </div>{overlay && createPortal(<motion.div className="folio-portal-overlay" style={{left:0,top:0,width:overlay.width,height:overlay.height}} initial={{ x:overlay.left,y:overlay.top,scaleX:1,scaleY:1 }} animate={{ x:0,y:0,scaleX:overlay.viewportWidth/overlay.width,scaleY:overlay.viewportHeight/overlay.height }} transition={{ duration:.65,ease:[.22,1,.36,1] }} onAnimationComplete={go}><img src="/preview/macfolio.webp" alt="Entering MacFolio" /></motion.div>,document.body)}</section>;
}
