import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { navLinks } from "../constants";
import MenuBarGlyph from "./MenuBarGlyph";
import useWindowStore from "../store/window";
import SpotifyNotch from "./SpotifyNotch";
import ControlCenter from "./ControlCenter";
import Spotlight from "./Spotlight";
import useMusicStore from '../store/music';

const Navbar = () => {
  const { openWindow } = useWindowStore();
  const [now, setNow] = useState(() => new Date());
  const [openPanel, setOpenPanel] = useState(null);
  const refreshMusic = useMusicStore((state) => state.refresh);

  useEffect(() => {
    const refreshWhenVisible = () => { if (!document.hidden) void refreshMusic(); };
    refreshWhenVisible();
    const timer = setInterval(refreshWhenVisible, 30000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refreshWhenVisible); };
  }, [refreshMusic]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpenPanel((current) => current === 'spotlight' ? null : 'spotlight');
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <nav id="desktop-navbar" aria-label="Desktop menu bar">
      {/* left */}
      <div className="menu-left">
        <div className="menu-brand">
          <img
            src="/images/logo.svg"
            alt="logo"
            className="w-4 h-4"
          />
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
        onClose={() => setOpenPanel((current) => current === "spotify" ? null : current)} />

      {/* right */}
      <div className="menu-right">
        <div className="menu-tools" role="group" aria-label="Portfolio utilities">
          <button type="button" className="menu-tool" aria-label="Competitive Programming" aria-controls="coding" title="Competitive Programming" onClick={() => { setOpenPanel(null); openWindow('coding'); }}><MenuBarGlyph kind="coding" /></button>
          <button type="button" className={`menu-tool${openPanel === 'spotlight' ? ' active' : ''}`} aria-label="Open Spotlight" title="Spotlight (Ctrl / ⌘ K)" aria-haspopup="dialog" aria-expanded={openPanel === 'spotlight'} aria-controls="portfolio-spotlight" onClick={() => setOpenPanel((current) => current === 'spotlight' ? null : 'spotlight')}><MenuBarGlyph kind="search" /></button>
          <ControlCenter expanded={openPanel === "controls"}
            onToggle={() => setOpenPanel((current) => current === "controls" ? null : "controls")}
            onClose={() => setOpenPanel((current) => current === "controls" ? null : current)}
            onOpenMusic={() => setOpenPanel("spotify")} />
        </div>

        <time dateTime={now.toISOString()} aria-label={dayjs(now).format("dddd D MMMM, h:mm A")}>
          <span className="menu-date">{dayjs(now).format("ddd D MMM")}</span><span className="menu-clock">{dayjs(now).format("h:mm A")}</span>
        </time>
      </div>
      {openPanel === 'spotlight' && <Spotlight onClose={() => setOpenPanel(null)} />}
    </nav>
  );
};

export default Navbar;
