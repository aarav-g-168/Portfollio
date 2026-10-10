import { ArrowLeft } from 'lucide-react'
import WindowControls from '../components/WindowControls'
import WindowWrapper from '../hoc/WindowWrapper'
import useLocationStore from '../store/location'
import { locations } from '../constants/index'
import clsx from 'clsx'
import useWindowStore from '../store/window'

const Finder = () => {

  const { openWindow } = useWindowStore();

  const { activeLocation, setActiveLocation } = useLocationStore();

  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => item.type === 'trash' ? openWindow('trash') : setActiveLocation(item)}
              aria-current={item.id === activeLocation.id ? 'page' : undefined} className={clsx(item.id === activeLocation.id ? "active" : "not-active")}>
            <img src={item.icon} className="w-4" alt="" />
            <p className="text-sm font-medium truncate">{item.name}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  const openItem = (item) => {
    if (item.fileType === 'pdf') return openWindow("resume");
    if (item.kind === 'folder') return setActiveLocation(item);
    if (['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, '_blank', 'noopener,noreferrer');
    openWindow(`${item.fileType}${item.kind}`, item);
  };

  return (
    <>
      <div id="window-header">
        <WindowControls windowKey="finder" />
        <h2>{activeLocation.name}</h2>
        <button type="button" className="finder-back" aria-label="Back to all projects" disabled={activeLocation.id === locations.work.id}
          onClick={() => setActiveLocation(locations.work)}><ArrowLeft size={17} aria-hidden="true" /></button>
      </div>

      <div className="finder-layout">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("Projects", locations.work.children)}
        </div>

        <ul className="content">
          {activeLocation?.children.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => openItem(item)}>
              <img src={item.icon} alt="" />
              <p>{item.name}</p>
              </button>
            </li>
          ))}
        </ul>

      </div>
    </>
  )
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
