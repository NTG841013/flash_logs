"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function LandingSetup() {
  const [copied, setCopied] = useState(false);
  const code = `npm install @flashlogs/next`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Decorative glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="h-3.5 w-3.5 rounded-full bg-red-500/30 border border-red-500/20"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-amber-500/30 border border-amber-500/20"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-500/30 border border-emerald-500/20"></div>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em] font-bold">
                Integration Guide
              </div>
              <div className="w-14"></div>
            </div>
            
            <div className="p-10 md:p-16 flex flex-col lg:row items-start gap-16">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Drop-in SDK for <span className="text-primary">any framework</span>
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                    Our lightweight SDK auto-configures itself to your environment. 
                    Just install and start streaming in seconds.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      1
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground font-semibold">Install the SDK</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Works with npm, pnpm, yarn, and bun.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground font-semibold">Add your API Key</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Grab your key from the dashboard and set it in your env.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground font-semibold">Real-time logs</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Logs start appearing in your dashboard instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-[480px]">
                <div className="bg-black/60 border border-white/10 rounded-2xl p-6 font-mono text-base relative group/code shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-4 text-emerald-400 mb-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-muted-foreground/50 select-none">$</span>
                    <span className="flex-1">{code}</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-8 top-10 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all border border-white/5 active:scale-95"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                  
                  <div className="mt-8 space-y-2 text-sm text-muted-foreground/40 leading-loose border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40"></span>
                      added 1 package from flashlogs
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40"></span>
                      verified build configuration
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500/60 font-semibold mt-4">
                      <Check className="h-4 w-4" />
                      ready for ingestion
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
