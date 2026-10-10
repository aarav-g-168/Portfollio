import { useRef, useEffect } from 'react';
import { ArrowUpRight, Lightbulb } from 'lucide-react';
import { locations } from '../constants';
import useLocationStore from '../store/location';
import useWindowStore from '../store/window';

const NoteReader = ({ note, children }) => {
  const readerRef = useRef(null);
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();
  const project = locations.work.children.find((entry) => entry.id === note.projectId);
  const wordCount = [note.intro, ...note.sections.map((section) => section.text)].join(' ').split(/\s+/).length;
  useEffect(() => { readerRef.current?.scrollTo({ top: 0 }); }, [note.id]);

  return <div className="note-reader" ref={readerRef}>
    <article>
      <div className="note-metadata"><span>{note.category}</span><span>{Math.max(1, Math.ceil(wordCount / 180))} min read</span></div>
      <h3>{note.title}</h3><p className="note-lead">{note.intro}</p>
      {note.sections.map((section) => <section key={section.heading}><h4>{section.heading}</h4><p>{section.text}</p></section>)}
      <blockquote><Lightbulb size={18} aria-hidden="true" /><p>{note.takeaway}</p></blockquote>
      <ul className="note-tags" aria-label="Topics">{note.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
      {project && <button type="button" className="note-project-link" onClick={() => { setActiveLocation(project); openWindow('finder'); }}>Explore {project.name}<ArrowUpRight size={15} aria-hidden="true" /></button>}
      {children}
    </article>
  </div>;
};

export default NoteReader;
