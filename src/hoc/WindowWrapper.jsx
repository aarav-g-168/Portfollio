import { useGSAP } from '@gsap/react';
import useWindowStore from '../store/window';
import { useRef, useLayoutEffect, useEffect } from 'react';
import { Draggable } from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, maximized, genieAnimating } = windows[windowKey];
        const ref = useRef(null);
        const draggableRef = useRef(null);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen || genieAnimating) return;

            el.style.display = 'block';
        }, [isOpen, genieAnimating]);

        // Manage draggable lifecycle based on maximized state
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (maximized) {
                // Kill draggable when maximized
                if (draggableRef.current) {
                    draggableRef.current.kill();
                    draggableRef.current = null;
                }
            } else {
                // Create draggable when not maximized
                if (!draggableRef.current) {
                    const [instance] = Draggable.create(el, { onPress: () => focusWindow(windowKey) });
                    draggableRef.current = instance;
                }
            }

            return () => {
                if (draggableRef.current) {
                    draggableRef.current.kill();
                    draggableRef.current = null;
                }
            };
        }, [maximized, focusWindow, windowKey]);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            el.style.display = isOpen ? 'block' : 'none';
        }, [isOpen]);

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className="absolute">
                <Component {...props} />
            </section>
        );
    };

    wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return wrapped;
};

export default WindowWrapper