import { Search } from 'lucide-react'
import WindowControls from '../components/WindowControls'
import WindowWrapper from '../hoc/WindowWrapper'
import useLocationStore from '../store/location'
import { locations } from '../constants/index'

const Finder = () => {

  const { activeLocation, setActiveLocation } = useLocationStore();

  return (
    <>
        <div id="window-header">
            <WindowControls windowKey="finder" />
            <Search className="icon" />
        </div>

        <div className="bg-white flex h-full">
          <div className="sidebar">

            <div>
              <h3>Favorites</h3>
              <ul>
                {Object.values(locations).map((item) => (
                  <li key={item.id} onClick={() => setActiveLocation(item)}>
                    <img src={item.icon} className="w-4" alt={item.name} />
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Work</h3>
              <ul>
                {Object.values(locations).map((item) => (
                  <li key={item.id} onClick={() => setActiveLocation(item)}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
    </>
  )
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;