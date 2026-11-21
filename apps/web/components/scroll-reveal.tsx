"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal-section, .reveal-mascot";

type RevealWindow = Window & { __uxkbRevealTimer?: number };

/**
 * Global scroll-reveal controller.
 *
 * The `.reveal-armed` class is added pre-paint by an inline script in the root
 * layout, so hidden states never flash. This component only reveals elements;
 * if it fails to mount, the inline script removes the armed class after a short
 * timeout and all content stays visible.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const win = window as RevealWindow;

    if (win.__uxkbRevealTimer) {
      window.clearTimeout(win.__uxkbRevealTimer);
      win.__uxkbRevealTimer = undefined;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    const showAll = () => {
      root.classList.remove("reveal-armed");
      targets.forEach((el) => el.classList.add("is-visible"));
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches || typeof IntersectionObserver === "undefined") {
      showAll();
    } else {
      // Do not hide content by default; only enhance with reveal when JS runs.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );

      const viewport = window.innerHeight || 0;

      targets.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        // Content already on screen at load gets its entrance immediately.
        if (rect.top < viewport * 0.92) {
          el.classList.add("is-visible");
          return;
        }
        observer.observe(el);
      });

      const onMotionChange = (event: MediaQueryListEvent) => {
        if (event.matches) showAll();
      };
      motionQuery.addEventListener("change", onMotionChange);

      return () => {
        observer.disconnect();
        motionQuery.removeEventListener("change", onMotionChange);
      };
    }
  }, []);

  return null;
}
