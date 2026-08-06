import useWindowStore from '../store/window';

// macOS-style traffic-light buttons. `windowKey` ties the controls to a specific
// window in the store, so the same component works for any window that uses WindowWrapper.
const WindowControls = ({ windowKey }) => {
    const { closeWindow, minimizeWindow, toggleMaximize, windows } = useWindowStore();
    const windowState = windows[windowKey];

    const stop = (e) => {
        // prevent drag from picking up clicks on the controls
        e.stopPropagation();
    };

    const handleClose = (e) => {
        stop(e);
        if (!windowState?.isOpen) return;
        closeWindow(windowKey);
    };

    const handleMinimize = (e) => {
        stop(e);
        if (!windowState?.isOpen) return;
        minimizeWindow(windowKey);
    };

    const handleMaximize = (e) => {
        stop(e);
        if (!windowState?.isOpen) return;
        toggleMaximize(windowKey);
    };

    // On macOS the green button shows "+" when windowed, and "⤢" (two arrows) when maximized
    const isMaximized = windowState?.maximized;

    // Inline SVG icons — match macOS traffic-light glyphs
    const CloseIcon = () => (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="control-icon">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );

    const MinimizeIcon = () => (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="control-icon">
            <path d="M3 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );

    const MaximizeIcon = () => (
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="control-icon">
            {!isMaximized ? (
                // Plus when windowed
                <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
                // Double arrows when maximized (restore)
                <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3H7V7M9 9H5V5"/>
                    <path d="M9 3V7H5M3 9H7V5"/>
                </g>
            )}
        </svg>
    );

    return (
        <div id="window-controls" onMouseDown={stop} onPointerDown={stop}>
            <button
                type="button"
                aria-label="Close window"
                className="close"
                onClick={handleClose}
            >
                <CloseIcon />
           </button>
            <button
                type="button"
                aria-label="Minimize window"
                className="minimize"
                onClick={handleMinimize}
            >
                <MinimizeIcon />
           </button>
            <button
                type="button"
                aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
                className="maximize"
                onClick={handleMaximize}
            >
                <MaximizeIcon />
           </button>
       </div>
    );
};

export default WindowControls;