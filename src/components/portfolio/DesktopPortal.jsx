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
  render() { return this.state.failed ? <div className="folio-model-fallback"><img src="/preview/macfolio.webp" alt="MacFolio desktop preview" /><p>3D preview unavailable. You can still enter directly below.</p></div> : this.props.children; }
}

export default function DesktopPortal({ scrollRef }) {
  const desktop = useSyncExternalStore(subscribe,desktopSnapshot,() => false);
  const reduce = useReducedMotion();
  const stageRef = useRef(null), screenRect = useRef(null), progressRef = useRef(0), entering = useRef(false);
  const inView = useInView(stageRef,{ margin:'400px',once:true });
  const [progress,setProgress] = useState(0), [ready,setReady] = useState(false), [overlay,setOverlay] = useState(null);
  const interactive = desktop && !reduce;
  const loaded = useCallback(() => setReady(true),[]);
  const measured = useCallback((rect) => { screenRect.current = rect; },[]);
  const update = useCallback((value) => { if (entering.current) return; progressRef.current = Math.max(0,Math.min(1,value)); setProgress(progressRef.current); },[]);
  const remember = useCallback(() => { try { sessionStorage.setItem('portfolio-scroll',String(scrollRef.current.scrollTop)); } catch { /* Optional navigation memory. */ } },[scrollRef]);
  const go = useCallback(() => { remember(); window.history.pushState(null,'','/desktop?from=preview'); window.dispatchEvent(new PopStateEvent('popstate')); },[remember]);
  useEffect(() => { if (progress > .1) void import('../../App.jsx'); },[progress]);
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
  return <section className="folio-showroom" id="desktop-preview"><div className="folio-section"><div className="folio-section-label"><span>03</span><span>A LITTLE SIDE QUEST</span><span aria-hidden="true">↗</span></div><div className="folio-showroom-heading"><h2>There’s another<br /><em>side to this.</em></h2><p>Same developer. A different universe.<br />Step inside my macOS-inspired desktop.</p></div>
    {interactive ? <><div className="folio-model-stage" ref={stageRef} tabIndex={0} role="group" aria-label="Interactive MacFolio laptop. Scroll over the laptop or use up and down arrow keys to explore. Escape resets." onKeyDown={(event) => { if (['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Escape'].includes(event.key)) { event.preventDefault(); update(event.key==='Escape' ? 0 : progressRef.current+(['ArrowDown','ArrowRight'].includes(event.key) ? .25 : -.25)); } }}>
      {inView && <ModelBoundary><Suspense fallback={<div className="folio-model-loading">Setting the scene…</div>}><ModelViewer progress={progress} onReady={loaded} onScreenRect={measured} onArrive={arrive} /></Suspense></ModelBoundary>}
      <div className="folio-model-status"><Mouse size={15} />{ready ? progress>0 ? 'SCROLL FORWARD TO ENTER / BACKWARD TO REWIND' : 'SCROLL OVER THE LAPTOP TO STEP INSIDE' : 'LOADING YOUR SIDE QUEST'}</div>
    </div><div className="folio-portal-controls"><div><div className="folio-portal-progress" role="progressbar" aria-label="MacFolio entry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)}>{[0,1,2,3].map((i) => <span key={i} className={progress>(i/4) ? 'filled' : ''} />)}</div><button onClick={() => update(0)} aria-label="Reset laptop animation"><RotateCcw size={13} /> Reset</button></div><button onClick={go}>Enter directly <ArrowUpRight size={16} /></button><a href="#toolbench">Continue exploring <ArrowDown size={14} /></a></div></> : <div className="folio-mobile-desktop"><img src="/preview/macfolio.webp" alt="MacFolio with a menu bar, project folders and app dock" width="1280" height="720" loading="lazy" />{desktop ? <><p>Explore the desktop without the scroll animation.</p><button className="folio-portal-direct" onClick={go}>Enter MacFolio <ArrowUpRight size={16} /></button></> : <><p>A whole desktop, down to the little details. MacFolio is made for a larger screen; everything about my work is right here on this page.</p><span><Monitor size={15} /> BEST EXPLORED ON DESKTOP</span></>}</div>}
  </div>{overlay && createPortal(<motion.div className="folio-portal-overlay" style={{left:0,top:0,width:overlay.width,height:overlay.height}} initial={{ x:overlay.left,y:overlay.top,scaleX:1,scaleY:1 }} animate={{ x:0,y:0,scaleX:overlay.viewportWidth/overlay.width,scaleY:overlay.viewportHeight/overlay.height }} transition={{ duration:.65,ease:[.22,1,.36,1] }} onAnimationComplete={go}><img src="/preview/macfolio.webp" alt="Entering MacFolio" /></motion.div>,document.body)}</section>;
}
