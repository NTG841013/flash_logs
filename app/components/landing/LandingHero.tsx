"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function LandingHero() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-secondary/15 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: "2s" }} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v1.0 is now live: High-performance log ingestion
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-foreground mb-8 max-w-5xl mx-auto leading-[1.05]">
            Set up monitoring in{" "}
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">under a minute.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            The high-performance logging platform for developers who want to ship fast. 
            Ingest millions of logs with zero configuration and sub-50ms search.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg w-full glow-primary hover:scale-105 transition-all duration-300">
                {isSignedIn ? "Go to Dashboard" : "Start Monitoring Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-white/10 w-full sm:w-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <Play className="mr-2 h-5 w-5 fill-current" />
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
