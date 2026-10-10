import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { navLinks, navIcons } from "../constants";
import useWindowStore from "../store/window";
import SpotifyNotch from "./SpotifyNotch";
import ControlCenter from "./ControlCenter";

const Navbar = () => {
  const { openWindow } = useWindowStore();
  const [now, setNow] = useState(() => new Date());
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
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
        <ul className="menu-status-icons" aria-label="System status">
          {navIcons.filter(({ id }) => id !== 4).map(({ id, img }) => (
            <li key={id}>
              <img
                src={img}
                alt={`icon-${id}`}
                className="w-4 h-4 opacity-90"
              />
            </li>
          ))}
        </ul>

        <ControlCenter expanded={openPanel === "controls"}
          onToggle={() => setOpenPanel((current) => current === "controls" ? null : "controls")}
          onClose={() => setOpenPanel((current) => current === "controls" ? null : current)}
          onOpenMusic={() => setOpenPanel("spotify")} />

        <time dateTime={now.toISOString()} aria-label={dayjs(now).format("dddd D MMMM, h:mm A")}>
          <span className="menu-date">{dayjs(now).format("ddd D MMM")} </span>{dayjs(now).format("h:mm A")}
        </time>
      </div>
    </nav>
  );
};

export default Navbar;
