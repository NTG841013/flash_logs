"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager at TechFlow",
    content: "Flash Logs transformed how we handle production debugging. The speed of ingestion is unmatched.",
    avatar: "https://avatar.vercel.sh/sarah"
  },
  {
    name: "James Wilson",
    role: "Founding Engineer at Pulse",
    content: "Finally, a logging platform that doesn't feel like a legacy tool from the 2000s. Clean and fast.",
    avatar: "https://avatar.vercel.sh/james"
  },
  {
    name: "Elena Rodriguez",
    role: "DevOps Lead at CloudScale",
    content: "The ClickHouse integration makes querying millions of logs feel like searching a small text file.",
    avatar: "https://avatar.vercel.sh/elena"
  },
  {
    name: "David Park",
    role: "CTO at Nexus",
    content: "Flash Logs saved us thousands in monthly cloud costs compared to our previous ELK stack.",
    avatar: "https://avatar.vercel.sh/david"
  },
  {
    name: "Lisa Miller",
    role: "Senior Developer at Orbit",
    content: "The DX is incredible. We were up and running in less than 5 minutes with the Node.js SDK.",
    avatar: "https://avatar.vercel.sh/lisa"
  },
  {
    name: "Marcus Thorne",
    role: "Software Architect at Velocity",
    content: "The real-time streaming via NATS is a game changer for our distributed microservices.",
    avatar: "https://avatar.vercel.sh/marcus"
  }
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="w-[350px] flex-shrink-0 p-6 rounded-2xl glass border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-white/5">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{testimonial.name}</h4>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed italic">
        "{testimonial.content}"
      </p>
    </div>
  );
}

function TestimonialRow({ 
  items, 
  direction = "left", 
  speed = 60 
}: { 
  items: typeof testimonials, 
  direction?: "left" | "right",
  speed?: number
}) {
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState(0);
  
  // Triple the items for a seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  useEffect(() => {
    if (!isHovered) {
      controls.start({
        x: direction === "left" ? "-33.333%" : "0%",
        transition: {
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls, direction, speed]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const offset = (x - 0.5) * 50; // Dynamic shift
    setMousePos(offset);
  };

  const initialX = direction === "left" ? "0%" : "-33.333%";

  return (
    <div 
      className="relative flex overflow-hidden py-4 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(0);
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        className="flex gap-6 px-3"
        animate={controls}
        initial={{ x: initialX }}
        style={{ 
          x: isHovered 
            ? `calc(${direction === "left" ? "-33.333%" : "0%"} + ${mousePos}px)` 
            : undefined 
        }}
      >
        {duplicatedItems.map((item, index) => (
          <TestimonialCard key={`${item.name}-${index}`} testimonial={item} />
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  // Split testimonials for two rows
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Built for <span className="gradient-text">reliability</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Flash Logs powers some of the most mission-critical applications. See what developers are saying.
        </p>
      </div>

      <div className="relative">
        {/* Row 1: Right to Left */}
        <TestimonialRow items={row1} direction="left" speed={60} />
        
        {/* Row 2: Left to Right */}
        <TestimonialRow items={row2} direction="right" speed={60} />

        {/* Masking gradients */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
