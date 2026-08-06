import { useRef, useCallback } from "react";
import { dockApps } from "../constants";
import {Tooltip} from "react-tooltip";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useWindowStore from "../store/window";

const Dock = () => {
    const { openWindow, closeWindow, setGenieAnimating, windows } = useWindowStore();
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return () => {};

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcon = (mouseX) => {
            const { left } = dock.getBoundingClientRect();
            icons.forEach((icon) => {
                const { left: iconLeft, width} = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 3) / 10000);

                gsap.to(icon, {
                    duration: 0.2,
                    ease: "power1.out",
                    y: -15 * intensity,
                    scale: 1 + intensity * 0.25,
                });
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            const mouseX = e.clientX - left;
            animateIcon(mouseX);
        }

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            duration: 0.3,
            ease: "power1.out",
            y: 0,
            scale: 1,
        }));

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }
    }, []);

    // Genie effect animation for opening/closing windows
    const animateGenieEffect = useCallback(async (windowKey, isOpening) => {
        const dock = dockRef.current;
        const windowEl = document.getElementById(windowKey);
        const dockIcon = dock?.querySelector(`[aria-label="${dockApps.find(a => a.id === windowKey)?.name}"]`);

        if (!dock || !windowEl || !dockIcon) return;

        // Get positions
        const iconRect = dockIcon.getBoundingClientRect();
        const windowRect = windowEl.getBoundingClientRect();

        // Calculate start and end positions relative to viewport
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top + iconRect.height / 2;
        const windowCenterX = windowRect.left + windowRect.width / 2;
        const windowCenterY = windowRect.top + windowRect.height / 2;

        if (isOpening) {
            // FIRST: open window in store so element is mounted and visible
            openWindow(windowKey);

            // Wait for React to render the window (next frame)
            await new Promise(r => requestAnimationFrame(r));

            // NOW set animating state and run genie animation on visible element
            setGenieAnimating(windowKey, true);

            windowEl.style.transformOrigin = 'center center';

            // Set initial state at dock icon position
            gsap.set(windowEl, {
                x: iconCenterX - windowCenterX,
                y: iconCenterY - windowCenterY,
                scale: 0.1,
                rotation: 0,
                opacity: 0
            });

            // Animate to window position with genie effect
            await gsap.to(windowEl, {
                duration: 0.5,
                ease: "power3.inOut",
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                onComplete: () => {
                    windowEl.style.transformOrigin = '';
                }
            });

            // Genie animation complete - clear animating flag
            setGenieAnimating(windowKey, false);
        } else {
            // Closing: animate from window position to dock icon (genie effect)
            setGenieAnimating(windowKey, true);

            await gsap.to(windowEl, {
                duration: 0.4,
                ease: "power3.inOut",
                x: iconCenterX - windowCenterX,
                y: iconCenterY - windowCenterY,
                scale: 0.1,
                opacity: 0,
                rotation: 15,
                onComplete: () => {
                    windowEl.style.display = 'none';
                    windowEl.style.transformOrigin = '';
                    gsap.set(windowEl, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 });
                }
            });

            // Close window in store after animation
            closeWindow(windowKey);
            setGenieAnimating(windowKey, false);
        }
    }, [openWindow, closeWindow, setGenieAnimating]);

    const toggleApp = (windowKey) => {
        const window = windows[windowKey];

        if (!window) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }

        if (window.isOpen) {
            animateGenieEffect(windowKey, false);
        } else {
            animateGenieEffect(windowKey, true);
        }
    };

    return (
    <section id="dock">
        <div ref={dockRef} className="dock-container">
            {dockApps.map(({ id, name, icon, canOpen}) => (
                <div key={id} className="relative flex justify-center">
                    <button 
                        type="button"
                        className="dock-icon"
                        aria-label={name}
                        data-tooltip-id="dock-tooltip"
                        data-tooltip-content={name}
                        data-tooltip-delay-show={150}
                        disabled={!canOpen}
                        onClick={() => toggleApp(id)}
                    >
                        <img 
                        src={`images/${icon}`}
                        alt={name}
                        loading="lazy"
                        className={canOpen ? '' : "opacity-60"} />
                    </button>
                </div>
            ))}
            <Tooltip id="dock-tooltip" place="top" className="tooltip"/>
        </div>
    </section>
  );
};

export default Dock
