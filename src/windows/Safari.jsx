import { useRef, useState } from 'react';
import { Archive, ArrowLeft, ArrowUpRight, Folder, NotebookPen, Pin, Search, X } from 'lucide-react';
import WindowControls from '../components/WindowControls';
import WindowWrapper from '../hoc/WindowWrapper';
import NoteReader from '../components/NoteReader';
import { buildNotes, noteSearchText } from '../data/build-notes';
import useNotesStore from '../store/notes';
import useWindowStore from '../store/window';

const BuildNotes = () => {
  const [folder, setFolder] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('welcome');
  const [reading, setReading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const backRef = useRef(null);
  const listRef = useRef(null);
  const { preferences, togglePinned, setArchived } = useNotesStore();
  const { openWindow } = useWindowStore();
  const activeNotes = buildNotes.filter((note) => !(preferences[note.id]?.archived ?? note.archived));
  const isPinned = (note) => preferences[note.id]?.pinned ?? note.pinned;
  const visibleNotes = activeNotes.filter((note) => (folder !== 'pinned' || isPinned(note)) && noteSearchText(note).includes(query.trim().toLowerCase()))
    .sort((a, b) => Number(Boolean(isPinned(b))) - Number(Boolean(isPinned(a))));
  const selected = visibleNotes.find((note) => note.id === selectedId) ?? visibleNotes[0];
  const selectFolder = (id) => { setFolder(id); setReading(false); setFeedback(''); };

  return <div className={`notes-window${reading && selected ? ' is-reading' : ''}`}>
    <div id="window-header"><WindowControls windowKey="safari" /><h2><NotebookPen size={16} aria-hidden="true" />Build Notes</h2><div className="notes-toolbar">
      <button type="button" aria-label={selected && isPinned(selected) ? 'Unpin note' : 'Pin note'} aria-pressed={Boolean(selected && isPinned(selected))} disabled={!selected}
        onClick={() => { togglePinned(selected.id); setFeedback(isPinned(selected) ? 'Note unpinned.' : 'Note pinned.'); }}><Pin size={17} aria-hidden="true" /></button>
      <button type="button" aria-label="Move note to Archive" disabled={!selected} onClick={() => { setArchived(selected.id, true); setFeedback('Moved to Archive. You can restore it there.'); }}><Archive size={17} aria-hidden="true" /></button>
    </div></div>
    <div className="notes-layout">
      <aside className="notes-sidebar" aria-label="Notebook folders"><div className="notes-account"><span>AG</span><div><strong>Aarav’s notebook</strong><small>Ideas behind the builds</small></div></div>
        <h3>Notebook</h3>
        <button type="button" className={folder === 'all' ? 'selected' : ''} aria-current={folder === 'all' ? 'page' : undefined} onClick={() => selectFolder('all')}><Folder size={17} />All notes<span>{activeNotes.length}</span></button>
        <button type="button" className={folder === 'pinned' ? 'selected' : ''} aria-current={folder === 'pinned' ? 'page' : undefined} onClick={() => selectFolder('pinned')}><Pin size={17} />Pinned<span>{activeNotes.filter(isPinned).length}</span></button>
        <button type="button" onClick={() => openWindow('trash')}><Archive size={17} />Archive<ArrowUpRight size={13} className="notes-archive-arrow" /></button>
        <p className="notes-sidebar-caption">Small observations.<br />Useful details.</p>
      </aside>
      <section className="notes-list-pane" aria-label="Build notes list"><div className="notes-list-heading"><h3>{folder === 'pinned' ? 'Pinned' : 'All notes'}</h3><span>{visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}</span></div>
        <div className="notes-search"><Search size={15} aria-hidden="true" /><input type="search" aria-label="Search build notes" placeholder="Search notes" value={query} onChange={(event) => { setQuery(event.target.value); setReading(false); setFeedback(''); }} />{query && <button type="button" aria-label="Clear note search" onClick={() => { setQuery(''); setFeedback(''); }}><X size={13} /></button>}</div>
        <div className="notes-list" ref={listRef}>{visibleNotes.map((note) => <button type="button" key={note.id} className={selected?.id === note.id ? 'selected' : ''} aria-current={selected?.id === note.id ? 'true' : undefined} onClick={() => { setSelectedId(note.id); setReading(true); setFeedback(''); if (window.innerWidth <= 639) requestAnimationFrame(() => backRef.current?.focus()); }}>
          <strong>{note.title}</strong><p>{note.summary}</p><span>{isPinned(note) && <Pin size={11} aria-label="Pinned" />}{note.category}</span>
        </button>)}</div>
        {!visibleNotes.length && <div className="notebook-empty"><Search size={24} /><strong>{query ? 'No matching notes' : 'No notes here yet'}</strong><p>{query ? 'Try “windows”, “contest”, or “interface”.' : 'Browse all notes or restore one from Archive.'}</p><button type="button" onClick={() => { setQuery(''); selectFolder('all'); }}>Show all notes</button></div>}
        <div className="notes-list-footer">A notebook from the workbench.</div>
      </section>
      <div className="notes-reading-pane"><button ref={backRef} type="button" className="notes-back" onClick={() => { setReading(false); requestAnimationFrame(() => listRef.current?.querySelector('[aria-current="true"]')?.focus()); }}><ArrowLeft size={16} />Notes</button>
        {selected ? <NoteReader note={selected} /> : <div className="notebook-empty"><NotebookPen size={34} /><strong>A little room to think.</strong><p>{query ? 'Try another search to find a note.' : folder === 'pinned' ? 'Pin a note from All notes to keep it here.' : 'Your notes are safe in Archive.'}</p><button type="button" onClick={() => openWindow('trash')}>Open Archive</button></div>}
      </div>
    </div>
    <div className="notebook-status" role="status">{feedback || 'Pins and archive changes are saved in this browser.'}</div>
  </div>;
};

const BuildNotesWindow = WindowWrapper(BuildNotes, 'safari');
export default BuildNotesWindow;
