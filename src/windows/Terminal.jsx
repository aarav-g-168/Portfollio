import WindowWrapper from '../hoc/WindowWrapper'
import WindowControls from '../components/WindowControls'
import { techStack } from '../constants'
import { Check } from 'react-feather'

const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls windowKey="terminal" />
        <h2>Tech Stack</h2>
      </div>

      <div className="techstack">
        <p>
          <span className="font-bold">@aarav %</span>
          {' '}show tech stack
        </p>

        <div className="label">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        <ul className="content">
          {techStack.map(({category, items}) => (
            <li key={category}>
              <Check className="check" size={20} aria-hidden="true" />
              <h3>{category}</h3>

              <ul>{items.map((item, i) => (
                <li key={i}>{item}{i < items.length - 1 ? "," : ""}</li>
              ))}
              </ul>

            </li>
          ))}
        </ul>

        <div className="footnote">
          <p>
            <Check size={20} /> {techStack.length} of {techStack.length} categories loaded
          </p>

          <p className="text-black">
            Always learning. Always building.
          </p>

        </div>
      </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow
