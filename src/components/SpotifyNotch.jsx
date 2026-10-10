import { useEffect, useRef } from "react";
import { ArrowUpRight, ChevronUp, Music2, RefreshCw } from "lucide-react";
import useMusicStore from '../store/music';

const SpotifyNotch = ({ expanded, onToggle, onClose }) => {
  const notchRef = useRef(null);
  const triggerRef = useRef(null);
  const { activity, refreshing, refresh } = useMusicStore();
  const { status, track, stale, profileUrl } = activity;
  const playing = status === 'playing' && !stale;
  const emptyCopy = {
    loading: ['Finding the soundtrack…', 'Checking in with Last.fm.', 'Connecting'],
    unconfigured: ['Soundtrack coming soon.', 'A little space for Aarav’s favorite music.', 'Not connected'],
    idle: ['Nothing playing right now.', 'Your next listen will appear here.', 'Waiting for a listen'],
    unavailable: ['Music is temporarily unavailable.', 'Try refreshing in a moment.', 'Connection unavailable'],
  }[status] || ['', '', ''];
  const statusLabel = track ? (stale ? 'Update unavailable' : playing ? 'Listening now' : 'Recently played') : emptyCopy[2];

  useEffect(() => {
    if (!expanded) return;
    void refresh();
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
  }, [expanded, onClose, refresh]);

  return (
    <div ref={notchRef} className={`spotify-notch${expanded ? " is-expanded" : ""}`}>
      <button ref={triggerRef} type="button" className="notch-trigger"
        aria-expanded={expanded} aria-controls="spotify-notch-panel"
        aria-label={expanded ? "Collapse Spotify notch" : "Open Spotify notch"}
        onClick={onToggle}>
        <span className="notch-service"><Music2 size={15} aria-hidden="true" /><span>Spotify</span></span>
        {expanded ? <ChevronUp size={15} aria-hidden="true" /> : (
          <span className={`notch-wave${playing ? ' is-playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
        )}
      </button>
      <section id="spotify-notch-panel" className="notch-panel" aria-label="Aarav’s listening activity" hidden={!expanded}>
        <div className="notch-track">
          <div className="notch-artwork">
            <Music2 size={29} strokeWidth={1.5} aria-hidden="true" />
            {track?.imageUrl && <img key={track.imageUrl} src={track.imageUrl} alt="" referrerPolicy="no-referrer"
              onError={(event) => { event.currentTarget.hidden = true; }} />}
          </div>
          <div className="notch-track-copy">
            <span className="notch-eyebrow">{track ? (stale ? 'LAST KNOWN TRACK' : playing ? 'AARAV’S LISTENING NOW' : 'LAST PLAYED') : 'AARAV’S SOUNDTRACK'}</span>
            <h2 title={track?.title}>{track?.title || emptyCopy[0]}</h2>
            <p title={track?.artist}>{track?.artist || emptyCopy[1]}</p>
          </div>
        </div>
        <div className="notch-actions">
          {track?.spotifyUrl && <a className="notch-listen" href={track.spotifyUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`Find ${track.title} by ${track.artist} on Spotify`} title="Find on Spotify"><ArrowUpRight size={20} aria-hidden="true" /></a>}
          <button type="button" className="notch-refresh" onClick={() => void refresh()} disabled={refreshing}
            aria-label={refreshing ? 'Refreshing listening activity' : 'Refresh listening activity'} title="Refresh listening activity">
            <RefreshCw size={15} className={refreshing ? 'is-refreshing' : ''} aria-hidden="true" />
          </button>
        </div>
        <div className="notch-footer">
          <span className={`notch-status${playing ? ' is-playing' : ''}`} role="status" aria-live="polite"><i aria-hidden="true" />{statusLabel}</span>
          {profileUrl ? <a className="notch-source" href={profileUrl} target="_blank" rel="noopener noreferrer">via Last.fm <ArrowUpRight size={11} aria-hidden="true" /></a>
            : <span className="notch-source">Spotify · via Last.fm</span>}
        </div>
      </section>
    </div>
  );
};

export default SpotifyNotch;
