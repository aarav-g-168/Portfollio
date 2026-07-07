import useWindowStore from '../store/window';
import { useRef } from 'react';

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex } = windows[windowKey];
        const ref = useRef(null);

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={"absolute"}>
                    <Component {...props} />
            </section>
        );
    };

    wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return wrapped;
}

export default WindowWrapper