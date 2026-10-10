import { useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import WindowWrapper from "../hoc/WindowWrapper";
import WindowControls from "../components/WindowControls";
import { experiences } from "../constants";

const Experience = () => {
    const [selectedId, setSelectedId] = useState(experiences[0]?.id);
    const selected = experiences.find((entry) => entry.id === selectedId) ?? experiences[0];

    return (
        <div className="experience-window">
            <div id="window-header">
                <WindowControls windowKey="experience" />
                <h2><BriefcaseBusiness size={16} aria-hidden="true" /> Experience</h2>
                <span className="experience-header-spacer" aria-hidden="true" />
            </div>
            <div className="experience-layout">
                <aside className="experience-sidebar" aria-label="Experience entries">
                    <div className="experience-sidebar-heading">
                        <h3>My journey</h3>
                        <span>{experiences.length} entries</span>
                    </div>
                    <ul>
                        {experiences.map((entry) => (
                            <li key={entry.id}>
                                <button type="button" className={selected?.id === entry.id ? "selected" : ""}
                                    aria-current={selected?.id === entry.id ? "true" : undefined}
                                    onClick={() => setSelectedId(entry.id)}>
                                    <span className="experience-entry-icon"><BriefcaseBusiness size={18} aria-hidden="true" /></span>
                                    <span className="experience-entry-copy">
                                        <span className="entry-organization">{entry.organization}</span>
                                        <span className="entry-role">{entry.role}</span>
                                        <span className="entry-dates">{entry.dates}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
                <div className="experience-detail">
                    {selected ? (
                        <article key={selected.id}>
                            <div className="experience-eyebrow">
                                <span>{selected.type}</span>
                                {selected.placeholder && <span className="placeholder-badge">Placeholder</span>}
                            </div>
                            <h3>{selected.role}</h3>
                            <p className="experience-organization">{selected.organization}</p>
                            <div className="experience-meta">
                                <span><CalendarDays size={15} aria-hidden="true" /> {selected.dates}</span>
                                {selected.location && <span><MapPin size={15} aria-hidden="true" /> {selected.location}</span>}
                            </div>
                            {selected.summary && <p className="experience-summary">{selected.summary}</p>}
                            {!!selected.highlights?.length && (
                                <section className="experience-highlights" aria-label="Role highlights">
                                    <h4>Highlights</h4>
                                    <ul>{selected.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul>
                                </section>
                            )}
                            {!!selected.skills?.length && (
                                <section className="experience-skills" aria-label="Skills used">
                                    <h4>Skills & tools</h4>
                                    <ul>{selected.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                                </section>
                            )}
                            {selected.link && <a className="experience-link" href={selected.link} target="_blank" rel="noopener noreferrer">
                                Visit organization <ArrowUpRight size={16} aria-hidden="true" />
                            </a>}
                        </article>
                    ) : <p className="experience-empty">No experience entries yet.</p>}
                </div>
            </div>
        </div>
    );
};

const ExperienceWindow = WindowWrapper(Experience, "experience");
export default ExperienceWindow;
