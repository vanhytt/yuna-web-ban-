"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in";
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 700,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px", // triggers slightly before coming into view
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getVariantClasses = () => {
    switch (variant) {
      case "fade":
        return isVisible ? "opacity-100" : "opacity-0";
      case "fade-up":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
      case "fade-down":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8";
      case "fade-left":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8";
      case "fade-right":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8";
      case "zoom-in":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";
      default:
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
    }
  };

  const delayStr = delay > 0 ? `${delay}ms` : "0ms";
  const durationStr = `${duration}ms`;

  return (
    <div
      ref={ref}
      className={`transition-all ease-[cubic-bezier(0.25,1,0.5,1)] ${getVariantClasses()} ${className}`}
      style={{
        transitionDelay: delayStr,
        transitionDuration: durationStr,
      }}
    >
      {children}
    </div>
  );
}