import { useEffect, useRef } from "react";
import { ChevronUp, Music2, Play, SkipBack, SkipForward } from "lucide-react";

const SpotifyNotch = ({ expanded, onToggle, onClose }) => {
  const notchRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!expanded) return;
    const handlePointerDown = (event) => {
      if (!notchRef.current?.contains(event.target)) onClose();
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

  return (
    <div ref={notchRef} className={`spotify-notch${expanded ? " is-expanded" : ""}`}>
      <button ref={triggerRef} type="button" className="notch-trigger"
        aria-expanded={expanded} aria-controls="spotify-notch-panel"
        aria-label={expanded ? "Collapse Spotify notch" : "Open Spotify notch"}
        onClick={onToggle}>
        <span className="notch-service"><Music2 size={15} aria-hidden="true" /><span>Spotify</span></span>
        {expanded ? <ChevronUp size={15} aria-hidden="true" /> : (
          <span className="notch-wave" aria-hidden="true"><i /><i /><i /><i /></span>
        )}
      </button>
      <section id="spotify-notch-panel" className="notch-panel" aria-label="Spotify player" hidden={!expanded}>
        <div className="notch-track">
          <div className="notch-artwork"><Music2 size={29} strokeWidth={1.5} aria-hidden="true" /></div>
          <div className="notch-track-copy">
            <span className="notch-eyebrow">YOUR DESKTOP SOUNDTRACK</span>
            <h2>Nothing playing. Yet.</h2>
            <p>A little space for your favorite music.</p>
          </div>
        </div>
        <div className="notch-transport" aria-label="Playback unavailable until Spotify is connected">
          <button type="button" disabled aria-label="Previous track"><SkipBack size={17} fill="currentColor" /></button>
          <button type="button" disabled className="notch-play" aria-label="Play"><Play size={18} fill="currentColor" /></button>
          <button type="button" disabled aria-label="Next track"><SkipForward size={17} fill="currentColor" /></button>
        </div>
        <div className="notch-footer"><span className="notch-status"><i aria-hidden="true" /> Not connected</span><span className="notch-soon">Spotify · Coming soon</span></div>
      </section>
    </div>
  );
};

export default SpotifyNotch;
