"use client";

import { UserButton } from "@clerk/nextjs";
import { ChevronRight, Search, Plus, Bell } from "lucide-react";
import React from "react";

export function Topbar() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-white/5 bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
           <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
             <span>Projects</span>
             <ChevronRight className="h-3 w-3" />
             <span className="text-white font-bold">Personal</span>
           </div>
        </div>
      </div>
      <div className="flex items-center gap-x-3 lg:gap-x-4">
         <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
            <Search className="h-4 w-4" />
         </button>
         <button className="p-1.5 text-zinc-500 hover:text-white transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
         </button>
         <div className="h-4 w-px bg-white/10" />
         {mounted ? (
           <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-7 w-7 rounded-lg",
                },
              }}
            />
         ) : (
           <div className="h-7 w-7 rounded-lg bg-white/5 animate-pulse" />
         )}
      </div>
    </div>
  );
}
