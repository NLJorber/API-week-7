"use client";
import { useEffect, useRef } from "react";

// Floating sparkle overlay to mimic the static landing page background
export default function Sparkles({ stars = 160, rainbowStars = 60 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rainbowColors = [
      "rgba(255,59,48,0.9)",
      "rgba(255,149,0,0.9)",
      "rgba(255,204,0,0.9)",
      "rgba(52,199,89,0.9)",
      "rgba(0,199,190,0.9)",
      "rgba(90,200,245,0.9)",
      "rgba(175,82,222,0.9)",
      "rgba(255,105,180,0.9)",
    ];

    function makeStar(className, color) {
      const star = document.createElement("div");
      star.className = className;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s, ${Math.random() * 5}s`;
      if (color) {
        star.style.boxShadow = `0 0 5px ${color}, 0 -5px 0 -1px ${color}, 0 5px 0 -1px ${color}, -5px 0 0 -1px ${color}, 5px 0 0 -1px ${color}`;
      }
      return star;
    }

    const created = [];
    for (let i = 0; i < stars; i++) {
      const star = makeStar("star");
      created.push(star);
      container.appendChild(star);
    }
    for (let i = 0; i < rainbowStars; i++) {
      const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      const star = makeStar("star rainbow", color);
      created.push(star);
      container.appendChild(star);
    }

    return () => created.forEach((node) => node.remove());
  }, [stars, rainbowStars]);

  return <div id="sparkles" ref={containerRef} aria-hidden="true" className="sparkles" />;
}
