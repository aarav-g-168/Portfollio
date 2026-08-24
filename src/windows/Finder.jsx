import { Search } from 'lucide-react'
import WindowControls from '../components/WindowControls'
import WindowWrapper from '../hoc/WindowWrapper'
import useLocationStore from '../store/location'
import { locations } from '../constants/index'
import clsx from 'clsx'

const Finder = () => {

  const { activeLocation, setActiveLocation } = useLocationStore();

  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id} onClick={() => setActiveLocation(item)} className={clsx(item.id === activeLocation.id ? "active" : "not-active")}>
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <div id="window-header">
        <WindowControls windowKey="finder" />
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("Work", locations.work.children)}
        </div>
      </div>

      
    </>
  )
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;