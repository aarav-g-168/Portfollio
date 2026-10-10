import useWindowStore from '../store/window';
import { useRef, useLayoutEffect, useEffect } from 'react';
import { Draggable } from 'gsap/Draggable';
import { animateWindowTransition } from '../lib/window-motion';

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, finishWindowTransition, windows } = useWindowStore();
        const { isOpen, zIndex, maximized, genieAnimating, transition } = windows[windowKey];
        const ref = useRef(null);
        const draggableRef = useRef(null);
        const motionRef = useRef(null);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el || !transition) return;
            motionRef.current = animateWindowTransition(el, windowKey, transition.type, () => {
                finishWindowTransition(windowKey, transition.id);
            });
        }, [transition, finishWindowTransition]);

        useLayoutEffect(() => () => motionRef.current?.cancel(), []);

        // Manage draggable lifecycle based on maximized state
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (!isOpen || genieAnimating || maximized) {
                // Kill draggable when maximized
                if (draggableRef.current) {
                    draggableRef.current.kill();
                    draggableRef.current = null;
                }
            } else {
                // Create draggable when not maximized
                if (!draggableRef.current) {
                    const [instance] = Draggable.create(el, {
                        trigger: el.querySelector('[id="window-header"]') || el,
                        bounds: 'main',
                        onPress: () => focusWindow(windowKey),
                    });
                    draggableRef.current = instance;
                }
            }

            return () => {
                if (draggableRef.current) {
                    draggableRef.current.kill();
                    draggableRef.current = null;
                }
            };
        }, [isOpen, genieAnimating, maximized, focusWindow]);

        return (
            <section
                id={windowKey}
                hidden={!isOpen}
                data-animating={genieAnimating || undefined}
                data-maximized={maximized || undefined}
                ref={ref}
                onPointerDownCapture={(event) => {
                    if (!event.target.closest('#window-controls')) focusWindow(windowKey);
                }}
                style={{ zIndex, display: isOpen ? 'block' : 'none' }}
                className="absolute">
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
};

export default WindowWrapper
