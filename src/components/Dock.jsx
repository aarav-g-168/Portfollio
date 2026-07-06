import { useRef } from "react";
import { dockApps } from "../constants";
import {Tooltip} from "react-tooltip";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Dock = () => {
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


    const toggleApp = (app) => {
        
    }

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
                        onClick={() => toggleApp(id, canOpen)}
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