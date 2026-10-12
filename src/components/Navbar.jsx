import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import GuidedTour from './GuidedTour';
import DesktopWidgets from './DesktopWidgets';
import { navLinks } from "../constants";
import MenuBarGlyph from "./MenuBarGlyph";
import useWindowStore from "../store/window";
import SpotifyNotch from "./SpotifyNotch";
import ControlCenter from "./ControlCenter";
import Spotlight from "./Spotlight";
import useMusicStore from '../store/music';

const Navbar = ({ guideOpen, onGuideChange }) => {
  const appleRef = useRef(null);
  const { openWindow } = useWindowStore();
  const [now, setNow] = useState(() => new Date());
  const [openPanel, setOpenPanel] = useState(null);
  const refreshMusic = useMusicStore((state) => state.refresh);

  useEffect(() => {
    const dismiss = (event) => { if (!appleRef.current?.contains(event.target)) appleRef.current?.removeAttribute('open'); };
    const escape = (event) => { if (event.key === 'Escape' && appleRef.current?.open) { appleRef.current.removeAttribute('open'); appleRef.current.querySelector('summary')?.focus(); } };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, []);
  const setTourPanel = useCallback((panel) => setOpenPanel(panel), []);
  const finishTour = () => {
    onGuideChange(null);
    setOpenPanel(null);
  };

  useEffect(() => {
    const refreshWhenVisible = () => { if (!document.hidden) void refreshMusic(); };
    refreshWhenVisible();
    const timer = setInterval(refreshWhenVisible, 15000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refreshWhenVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refreshWhenVisible); window.removeEventListener('focus', refreshWhenVisible); };
  }, [refreshMusic]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onGuideChange(null);
        setOpenPanel((current) => current === 'spotlight' ? null : 'spotlight');
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [onGuideChange]);

  return (
    <nav id="desktop-navbar" aria-label="Desktop menu bar">
      {/* left */}
      <div className="menu-left">
        <div className="menu-brand">
          <details ref={appleRef} className="apple-menu"><summary aria-label="Apple menu" title="Portfolio guide & shortcuts"><img
            src="/images/logo.svg"
            alt=""
            className="w-4 h-4"
          /></summary><div className="apple-menu-panel"><button type="button" onClick={() => { appleRef.current.removeAttribute('open'); setOpenPanel(null); onGuideChange('tour'); }}>Guided tour <span>Replay</span></button></div></details>
          <p>
            Aarav's Portfolio
          </p>
        </div>

        <ul className="menu-links">
          {navLinks.map(({ id, name, type }) => (
            <li
              key={id}
              className="text-sm"
            >
              <button type="button" onClick={() => openWindow(type)}
                className="menu-link">
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <SpotifyNotch expanded={openPanel === "spotify"}
        onToggle={() => setOpenPanel((current) => current === "spotify" ? null : "spotify")}
        onClose={() => { if (!guideOpen) setOpenPanel((current) => current === "spotify" ? null : current); }} />

      {/* right */}
      <div className="menu-right">
        <div className="menu-tools" role="group" aria-label="Portfolio utilities">
          <button type="button" className="menu-tool" aria-label="Competitive Programming" aria-controls="coding" title="Competitive Programming" onClick={() => { setOpenPanel(null); openWindow('coding'); }}><MenuBarGlyph kind="coding" /></button>
          <button type="button" className={`menu-tool${openPanel === 'spotlight' ? ' active' : ''}`} aria-label="Open Spotlight" title="Spotlight (Ctrl / ⌘ K)" aria-haspopup="dialog" aria-expanded={openPanel === 'spotlight'} aria-controls="portfolio-spotlight" onClick={() => setOpenPanel((current) => current === 'spotlight' ? null : 'spotlight')}><MenuBarGlyph kind="search" /></button>
          <ControlCenter expanded={openPanel === "controls"}
            onToggle={() => setOpenPanel((current) => current === "controls" ? null : "controls")}
            onClose={() => { if (!guideOpen) setOpenPanel((current) => current === "controls" ? null : current); }}
            onOpenMusic={() => setOpenPanel("spotify")} />
        </div>

        <button type="button" className="date-trigger" aria-label="Open date and widgets" aria-expanded={openPanel === 'widgets'} aria-controls="desktop-widgets" onClick={() => setOpenPanel((current) => current === 'widgets' ? null : 'widgets')}><time dateTime={now.toISOString()} aria-label={dayjs(now).format("dddd D MMMM, h:mm A")}>
          <span className="menu-date">{dayjs(now).format("ddd D MMM")}</span><span className="menu-clock">{dayjs(now).format("h:mm A")}</span>
        </time></button>
      </div>
      {openPanel === 'spotlight' && <Spotlight onClose={() => { if (!guideOpen) setOpenPanel(null); }} />}
      {openPanel === 'widgets' && <DesktopWidgets now={now} onClose={() => { if (!guideOpen) setOpenPanel(null); }} onOpen={(key) => { setOpenPanel(null); openWindow(key); }} />}
      {guideOpen && <GuidedTour mode={guideOpen} onStart={() => onGuideChange('tour')} onClose={finishTour} onPanel={setTourPanel} />}
    </nav>
  );
};

export default Navbar;
