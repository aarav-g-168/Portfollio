import { useState } from 'react';
import { Archive as ArchiveIcon, ArrowUpLeft, FileText, Lightbulb, Search, X } from 'lucide-react';
import WindowControls from '../components/WindowControls';
import WindowWrapper from '../hoc/WindowWrapper';
import NoteReader from '../components/NoteReader';
import { buildNotes, noteSearchText } from '../data/build-notes';
import useNotesStore from '../store/notes';
import useWindowStore from '../store/window';

const Archive = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('spotify-idea');
  const [feedback, setFeedback] = useState('');
  const { preferences, setArchived } = useNotesStore();
  const { openWindow } = useWindowStore();
  const archived = buildNotes.filter((note) => preferences[note.id]?.archived ?? note.archived);
  const visible = archived.filter((note) => (filter === 'all' || note.category === 'On the shelf') && noteSearchText(note).includes(query.trim().toLowerCase()));
  const selected = visible.find((note) => note.id === selectedId) ?? visible[0];

  return <div className="archive-window">
    <div id="window-header"><WindowControls windowKey="trash" /><h2><ArchiveIcon size={16} aria-hidden="true" />Archive</h2><span className="archive-header-count">{archived.length} {archived.length === 1 ? 'item' : 'items'}</span></div>
    <div className="archive-layout"><section className="archive-browser" aria-label="Archived notes">
      <div className="archive-intro"><span className="archive-emblem"><ArchiveIcon size={23} /></span><h3>On the shelf.</h3><p>Ideas and notes worth keeping.<br />Ready whenever the time is right.</p></div>
      <div className="notes-search"><Search size={15} aria-hidden="true" /><input type="search" aria-label="Search Archive" placeholder="Search Archive" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear archive search" onClick={() => setQuery('')}><X size={13} /></button>}</div>
      <div className="archive-filters" aria-label="Archive filters"><button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All items</button><button type="button" aria-pressed={filter === 'ideas'} onClick={() => setFilter('ideas')}>Parked ideas</button></div>
      <div className="archive-items">{visible.map((note) => <button type="button" key={note.id} className={selected?.id === note.id ? 'selected' : ''} aria-current={selected?.id === note.id ? 'true' : undefined} onClick={() => { setSelectedId(note.id); setFeedback(''); }}>
        <span className="archive-file-icon">{note.category === 'On the shelf' ? <Lightbulb size={21} /> : <FileText size={21} />}</span><span><strong>{note.title}</strong><small>{note.category === 'On the shelf' ? 'Parked idea' : 'Build note'} · Read & restore</small></span>
      </button>)}</div>
      {!visible.length && <div className="notebook-empty"><ArchiveIcon size={26} /><strong>{archived.length ? 'No matching items' : 'A clean shelf.'}</strong><p>{archived.length ? 'Try another search or view all items.' : 'Notes you archive will appear here. Nothing is permanently deleted.'}</p><button type="button" onClick={() => { if (archived.length) { setQuery(''); setFilter('all'); } else openWindow('safari'); }}>{archived.length ? 'Show all items' : 'Open Build Notes'}</button></div>}
    </section>
    <section className="archive-preview" aria-label="Archive preview">{selected ? <><NoteReader note={selected} /><div className="archive-restore"><p>Keep this thought close again.</p><button type="button" onClick={() => { setArchived(selected.id, false); setFeedback('Restored to Build Notes.'); }}><ArrowUpLeft size={16} />Restore to Build Notes</button></div></> : <div className="notebook-empty"><FileText size={34} /><strong>Select a thought to revisit.</strong><p>Archived notes stay available for later.</p></div>}</section>
    </div><div className="notebook-status" role="status">{feedback ? <>{feedback}<button type="button" onClick={() => openWindow('safari')}>Open Build Notes</button></> : 'A personal shelf in this browser. Nothing is permanently deleted.'}</div>
  </div>;
};

const ArchiveWindow = WindowWrapper(Archive, 'trash');
export default ArchiveWindow;
