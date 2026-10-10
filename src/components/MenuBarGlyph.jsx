// Compact menu-bar glyphs; search and controls use the project's macOS assets.
const MenuBarGlyph = ({ kind }) => kind === 'coding' ? (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
    <rect x="1.5" y="9" width="3.5" height="6" rx="1" />
    <rect x="7.25" y="5.5" width="3.5" height="9.5" rx="1" />
    <rect x="13" y="2" width="3.5" height="13" rx="1" />
  </svg>
) : <img src={kind === 'controls' ? '/icons/mode.svg' : '/icons/search.svg'} width="16" height="16" alt="" aria-hidden="true" />;

export default MenuBarGlyph;
