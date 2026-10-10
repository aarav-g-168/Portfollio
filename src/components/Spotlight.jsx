import { useEffect, useRef, useState } from 'react';
import { Archive, ArrowDown, ArrowUp, BriefcaseBusiness, FileText, Folder, Image, Mail, NotebookPen, Search, Terminal, Trophy, X } from 'lucide-react';
import { searchSpotlight } from '../lib/spotlight';
import useWindowStore from '../store/window';
import useLocationStore from '../store/location';

const icons = { folder: Folder, mail: Mail, briefcase: BriefcaseBusiness, file: FileText, terminal: Terminal, trophy: Trophy, image: Image, notes: NotebookPen, archive: Archive };

const Spotlight = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const listRef = useRef(null);
  const results = searchSpotlight(query);
  const index = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();

  useEffect(() => {
    const previous = document.activeElement;
    inputRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [index, query]);

  const openResult = (result) => {
    if (!result) return;
    if (result.project) setActiveLocation(result.project);
    openWindow(result.windowKey, result.data ?? null);
    onClose();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(results.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length : 0);
    }
    if (event.key === 'Enter' && event.target === inputRef.current) { event.preventDefault(); openResult(results[index]); }
    if (event.key === 'Tab') {
      event.preventDefault();
      if (document.activeElement === inputRef.current) closeRef.current?.focus();
      else inputRef.current?.focus();
    }
  };

  return (
    <div className="spotlight-backdrop" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section id="portfolio-spotlight" className="spotlight" role="dialog" aria-modal="true" aria-label="Portfolio Spotlight" onKeyDown={onKeyDown}>
        <div className="spotlight-input-row">
          <Search size={25} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            placeholder="Search Aarav’s portfolio" aria-label="Search portfolio" role="combobox"
            aria-expanded="true" aria-autocomplete="list" aria-controls="spotlight-results"
            aria-activedescendant={results[index] ? `spotlight-${results[index].id}` : undefined} autoComplete="off" />
          <button ref={closeRef} type="button" aria-label="Close Spotlight" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="spotlight-results-header"><span>{query.trim() ? 'Search results' : 'Quick access'}</span><span>{results.length} {results.length === 1 ? 'result' : 'results'}</span></div>
        <ul ref={listRef} id="spotlight-results" role="listbox" aria-label="Portfolio results" className="spotlight-results">
          {results.map((result, resultIndex) => {
            const Icon = icons[result.icon];
            return <li key={result.id} role="presentation"><button type="button" role="option" tabIndex={-1}
              id={`spotlight-${result.id}`} aria-selected={index === resultIndex} className={index === resultIndex ? 'selected' : ''}
              onPointerMove={() => setActiveIndex(resultIndex)} onClick={() => openResult(result)}>
              <span className={`spotlight-result-icon ${result.icon}`}><Icon size={20} aria-hidden="true" /></span>
              <span className="spotlight-result-copy"><strong>{result.title}</strong><small>{result.subtitle}</small></span>
              <span className="spotlight-result-kind">{result.category}</span>
            </button></li>;
          })}
        </ul>
        {!results.length && <div className="spotlight-empty" role="status"><Search size={28} /><p>No results for “{query}”</p><span>Try a project, technology, or “resume”.</span></div>}
        <div className="spotlight-footer"><span><kbd><ArrowUp size={11} /><ArrowDown size={11} /></kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>esc</kbd> Close</span></div>
      </section>
    </div>
  );
};

export default Spotlight;
