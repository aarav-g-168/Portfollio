import { Search } from 'lucide-react'
import WindowControls from '../components/WindowControls'
import WindowWrapper from '../hoc/WindowWrapper'

const Finder = () => {
  return (
    <>
        <div id="window-header">
            <WindowControls windowKey="finder" />
            <Search className="icon" />
        </div>
    </>
  )
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;