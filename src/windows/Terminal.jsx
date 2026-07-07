import WindowWrapper from '../hoc/WindowWrapper'

const Terminal = () => {
  return (
    <>
      <div className="techstack">
        <p>
          <span className="font-bold">@aarav %</span>
          show tech stack
        </p>
      </div>
      
      <div id="window-header">
        <p>Window Controls</p>
        <h2>Tech Stack</h2>
      </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow