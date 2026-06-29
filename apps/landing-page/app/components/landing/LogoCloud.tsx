"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

const logos = [
  { name: "Clerk", src: "/logos/clerk.svg", scale: 0.9, invert: true },
  { name: "Neon", src: "/logos/neon.svg", scale: 1, invert: true },
  { name: "Inngest", src: "/logos/inngest.svg", scale: 1.1, invert: true },
  { name: "Convex", src: "/logos/convex.svg", scale: 1, invert: true },
  { name: "Expo", src: "/logos/expo.svg", scale: 0.9, invert: true },
  { name: "Livekit", src: "/logos/livekit.svg", scale: 1.1, invert: true },
  { name: "Scalekit", src: "/logos/scalekit.svg", scale: 1, invert: true },
];

export function LogoCloud() {
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState(0);

  // Triple logos for an even smoother loop at any speed
  const duplicatedLogos = [...logos, ...logos, ...logos];

  useEffect(() => {
    if (!isHovered) {
      controls.start({
        x: "-33.333%",
        transition: {
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    // Calculate a small offset based on mouse position to give "move when you move cursor" effect
    // We'll map 0-1 mouse position to -20px to +20px shift
    const offset = (x - 0.5) * 40;
    setMousePos(offset);
  };

  return (
    <div className="py-12 border-y border-white/5 bg-white/2 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
          Trusted by the best modern dev teams
        </p>
        
        <div 
          className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setMousePos(0);
          }}
          onMouseMove={handleMouseMove}
        >
          <motion.div 
            className="flex items-center gap-x-16 px-8"
            animate={controls}
            initial={{ x: "0%" }}
            style={{ x: isHovered ? `calc(-33.333% + ${mousePos}px)` : undefined }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div 
                key={`${logo.name}-${index}`}
                className={`flex-shrink-0 flex items-center justify-center w-32 h-12 opacity-50 grayscale contrast-[1.2] hover:grayscale-0 hover:opacity-100 hover:brightness-100 transition-all duration-500 ${logo.invert ? 'brightness-0 invert' : 'brightness-[1.5]'}`}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={40}
                  className="max-h-6 w-auto object-contain"
                  style={{ transform: `scale(${logo.scale || 1})` }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
