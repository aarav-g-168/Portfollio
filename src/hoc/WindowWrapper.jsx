import { useGSAP } from '@gsap/react';
import useWindowStore from '../store/window';
import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

const WindowWrapper = (Component, windowKey) => {
    const wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore();
        const { isOpen, zIndex, maximized, genieAnimating } = windows[windowKey];
        const ref = useRef(null);
        const draggableRef = useRef(null);
        const genieJustCompleted = useRef(false);

        useGSAP(() => {
            const el = ref.current;
            if (!el || !isOpen || genieAnimating) return;

            // Skip opening animation if genie effect just completed
            if (genieJustCompleted.current) {
                genieJustCompleted.current = false;
                el.style.display = 'block';
                return;
            }

            el.style.display = 'block';

            // opening animation
            gsap.fromTo(el, { opacity: 0, scale: 0.8, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' });
        }, [isOpen, genieAnimating]);

        // Track when genie animation completes so we can skip next opening animation
        useEffect(() => {
            if (!genieAnimating && isOpen) {
                // genieAnimating went from true -> false while window is open
                // This means genie effect just completed
                genieJustCompleted.current = true;
            }
        }, [genieAnimating, isOpen]);

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