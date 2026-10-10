import { useEffect, useRef, useState } from "react";
import { Heart, Mail, Search } from "lucide-react";
import WindowWrapper from "../hoc/WindowWrapper";
import WindowControls from "../components/WindowControls";
import { gallery, photosLinks } from "../constants/index";
import useWindowStore from '../store/window';

const Photos = () => {
    const { openWindow } = useWindowStore();
    const [section, setSection] = useState("Personal");
    const [query, setQuery] = useState("");
    const searchRef = useRef(null);
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("portfolio-photo-favorites") || "[]");
            return Array.isArray(saved) ? saved : [];
        } catch { return []; }
    });
    useEffect(() => {
        try {
            localStorage.setItem("portfolio-photo-favorites", JSON.stringify(favorites));
        } catch { /* Favorites still work when browser storage is unavailable. */ }
    }, [favorites]);
    const activeCategory = photosLinks.find((link) => link.title === section)?.category;
    const visiblePhotos = gallery.filter((photo) => {
        const inSection = section === "Favorites"
            ? favorites.includes(photo.id)
            : photo.category === activeCategory;
        return inSection && photo.name
            .toLowerCase().includes(query.trim().toLowerCase());
    });
    const toggleFavorite = (id) => setFavorites((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

    return (
        <div id="window-content">
            <div id="window-header">
                <WindowControls windowKey="photos" />
                <h2 className="photos-window-title">Photos</h2>
                <div className="photos-actions">
                    <button type="button" aria-label="Open contact" onClick={() => openWindow("contact")}>
                        <Mail className="icon" />
                    </button>
                    <button type="button" aria-label="Search photos" onClick={() => searchRef.current?.focus()}>
                        <Search className="icon" />
                    </button>
                </div>
            </div>
            <div className="photos-layout">
                <nav className="sidebar" aria-label="Photo collections">
                    <h2>Photos</h2>
                    <ul>
                        {photosLinks.map(({ id, icon, title }) => (
                            <li key={id}>
                                <button type="button" aria-current={section === title ? "page" : undefined}
                                    className={section === title ? "active" : ""}
                                    onClick={() => setSection(title)}>
                                    <img src={icon} alt="" />
                                    <span>{title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="gallery">
                    <div className="gallery-toolbar">
                        <div>
                            <h2>{section}</h2>
                            <p>{visiblePhotos.length} {visiblePhotos.length === 1 ? "photo" : "photos"}</p>
                        </div>
                        <label className="gallery-search">
                            <Search size={16} aria-hidden="true" />
                            <input ref={searchRef} type="search" aria-label="Search photos" placeholder="Search photos..."
                                value={query} onChange={(event) => setQuery(event.target.value)} />
                        </label>
                    </div>
                    {visiblePhotos.length ? (
                        <ul>
                            {visiblePhotos.map(({ id, img, name }) => (
                                <li key={id}>
                                    <button type="button" className="photo-preview" aria-label={`Open ${name}`}
                                        onClick={() => openWindow("imgfile", {
                                            id, name, icon: img, kind: "file",
                                            fileType: "img", imageUrl: img,
                                        })}>
                                        <span className="photo-frame">
                                            <img src={img} alt={name} draggable={false} loading="lazy" />
                                        </span>
                                        <span className="photo-caption">{name}</span>
                                    </button>
                                    <button type="button" className="favorite-button"
                                        aria-label={`${favorites.includes(id) ? "Remove" : "Add"} ${name} ${favorites.includes(id) ? "from" : "to"} favorites`}
                                        aria-pressed={favorites.includes(id)} onClick={() => toggleFavorite(id)}>
                                        <Heart size={16} fill={favorites.includes(id) ? "currentColor" : "none"} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="py-10 text-center text-sm text-gray-500" role="status">
                            {query ? "No photos match your search." : section === "Favorites"
                                ? "No favorites yet. Click a photo's heart to add it here."
                                : `No photos in ${section} yet.`}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PhotosWindow = WindowWrapper(Photos, "photos");
export default PhotosWindow;
