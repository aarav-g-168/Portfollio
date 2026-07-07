const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        return (
            <secion
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={"absolute"}>
                    <Component {...props} />
            </secion>
        );
    };

    wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return wrapped;
}

export default WindowWrapper