import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      data-letter=""
      className={className}
      style={{
        fontVariationSettings: `'wght' ${baseWeight}`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

// GSAP component for hover
const setupTextHover = (container, type) => {
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const letters = container.querySelectorAll("[data-letter]");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`,
    });
  };

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2) / 10000);

      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, base, 0.3));
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    return () => {
      subtitleCleanup?.();
      titleCleanup?.();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef} aria-label="Hey, I'm Aarav! Welcome to my">
        <span aria-hidden="true">
        {renderText(
          "Hey, I'm Aarav! Welcome to my",
          "font-georama",
          100
        )}
        </span>
      </p>

      <h1 ref={titleRef} className="mt-7" aria-label="Portfolio">
        <span aria-hidden="true">
        {renderText("Portfolio", "italic font-georama")}
        </span>
      </h1>

      <div className="small-screen">
        <p>Open an app below to explore.</p>
      </div>
    </section>
  );
};

export default Welcome;
