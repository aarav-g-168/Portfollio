import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Code2, FileText, LayoutGrid, Mail, Moon, Music2, Sun, Terminal } from "lucide-react";
import MenuBarGlyph from './MenuBarGlyph';
import useWindowStore from "../store/window";
import { socials } from "../constants";
import useMusicStore from '../store/music';

const ControlCenter = ({ expanded, onToggle, onClose, onOpenMusic }) => {
  const [focusMode, setFocusMode] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const { openWindow, minimizeWindow, windows } = useWindowStore();
  const github = socials.find((social) => social.text === "Github");
  const { activity } = useMusicStore();
  const musicLabel = activity.track ? `${activity.status === 'playing' && !activity.stale ? 'Listening now' : 'Last played'} · ${activity.track.artist}`
    : activity.status === 'unconfigured' ? 'Spotify · Not connected' : 'Spotify · Listening activity';

  useEffect(() => {
    document.documentElement.dataset.desktopFocus = String(focusMode);
    return () => { delete document.documentElement.dataset.desktopFocus; };
  }, [focusMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--wallpaper-dim", String(1 - brightness / 100));
    return () => document.documentElement.style.removeProperty("--wallpaper-dim");
  }, [brightness]);

  useEffect(() => {
    if (!expanded) return;
    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded, onClose]);

  const openApp = (key) => { openWindow(key); onClose(); };
  const showDesktop = () => {
    Object.entries(windows).forEach(([key, window]) => {
      if (window.isOpen) minimizeWindow(key);
    });
    setFocusMode(false);
    onClose();
  };

  return (
    <div ref={panelRef} className="control-center-anchor">
      <button ref={triggerRef} type="button" className={`menu-tool control-center-trigger${expanded ? " active" : ""}`}
        aria-label="Control Center" aria-expanded={expanded} aria-controls="portfolio-control-center" onClick={onToggle}>
        <MenuBarGlyph kind="controls" />
      </button>
      {expanded && (
        <section id="portfolio-control-center" className="control-center" aria-label="Portfolio Control Center">
          <div className="cc-heading">
            <img src="/images/aarav.jpeg" alt="" />
            <div><h2>Aarav’s desktop</h2><p>Make yourself at home.</p></div>
            <span className="cc-heading-dot" aria-hidden="true" />
          </div>

          <div className="cc-primary-grid">
            <button type="button" className={`cc-tile cc-focus${focusMode ? " enabled" : ""}`}
              aria-pressed={focusMode} onClick={() => setFocusMode((current) => !current)}>
              <span className="cc-icon"><Moon size={21} fill={focusMode ? "currentColor" : "none"} /></span>
              <span><strong>Focus</strong><small>{focusMode ? "Distractions hidden" : "A quieter desktop"}</small></span>
            </button>
            <button type="button" className="cc-tile" onClick={showDesktop}>
              <span className="cc-icon"><LayoutGrid size={21} /></span>
              <span><strong>Show desktop</strong><small>Minimize windows</small></span>
            </button>
          </div>

          <div className="cc-shortcuts" aria-label="Portfolio shortcuts">
            <button type="button" className="cc-tile" onClick={() => openApp("contact")}><Mail size={20} /><span>Contact</span></button>
            <button type="button" className="cc-tile" onClick={() => openApp("resume")}><FileText size={20} /><span>Resume</span></button>
            <button type="button" className="cc-tile" onClick={() => openApp("terminal")}><Terminal size={20} /><span>Skills</span></button>
          </div>

          <div className="cc-display cc-tile">
            <div><label htmlFor="wallpaper-brightness">Wallpaper</label><output htmlFor="wallpaper-brightness">{brightness}%</output></div>
            <div className="cc-slider-row"><Sun size={15} aria-hidden="true" /><input id="wallpaper-brightness" type="range"
              min="35" max="100" value={brightness} aria-label="Wallpaper brightness"
              onChange={(event) => setBrightness(Number(event.target.value))}
              style={{ "--range-progress": `${(brightness - 35) / 65 * 100}%` }} /><Sun size={22} aria-hidden="true" /></div>
          </div>

          <button type="button" className="cc-music cc-tile" onClick={onOpenMusic}>
            <span className="cc-music-art"><Music2 size={24} /></span>
            <span className="cc-music-copy"><strong title={activity.track?.title}>{activity.track?.title || 'Aarav’s soundtrack'}</strong><small title={musicLabel}>{musicLabel}</small></span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>

          <div className="cc-footer">
            <button type="button" onClick={() => openApp("experience")}><BriefcaseBusiness size={14} /> Experience</button>
            {github && <a href={github.link} target="_blank" rel="noopener noreferrer"><Code2 size={14} /> GitHub <ArrowUpRight size={12} /></a>}
          </div>
        </section>
      )}
    </div>
  );
};

export default ControlCenter;
