"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListTree, 
  Search,
  Bell, 
  Blocks, 
  Key, 
  Settings,
  HelpCircle,
  Zap,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useOrganization } from "@clerk/nextjs";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Live Logs", href: "/logs", icon: ListTree },
  { name: "Queries", href: "/queries", icon: Search },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Integrations", href: "/integrations", icon: Blocks },
  { name: "API Keys", href: "/api-keys", icon: Key },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex grow flex-col bg-sidebar border-r border-white/10" />;
  }

  return (
    <div className="flex grow flex-col gap-y-8 overflow-y-auto border-r border-white/10 bg-sidebar px-6 pb-6 pt-2">
      <div className="flex h-16 shrink-0 items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Zap className="h-6 w-6 text-primary fill-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold font-satoshi tracking-tight text-white leading-tight">Flash Logs</span>
          <span className="text-[10px] font-medium text-zinc-500 tracking-wider uppercase">Developer Console</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col mt-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-10">
          <li>
            <div className="text-[10px] font-bold leading-6 text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</div>
            <ul role="list" className="-mx-2 space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-primary/10 text-white border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent",
                      "group flex gap-x-4 rounded-xl p-3 text-sm font-semibold transition-all duration-200"
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300",
                        "h-5 w-5 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
             <div className="group relative flex items-center gap-x-4 rounded-2xl bg-white/5 p-4 border border-white/10 mb-6">
               <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-zinc-800 border border-white/10 text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                {(organization?.publicMetadata?.plan as string) || (user?.publicMetadata?.plan as string) || "Free"} Plan
               </div>
               {user?.imageUrl ? (
                 <img src={user.imageUrl} className="h-10 w-10 rounded-xl border border-white/10" alt="" />
               ) : (
                 <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                   {user?.firstName?.[0] || user?.username?.[0] || "U"}
                 </div>
               )}
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate font-satoshi">
                   {organization?.name || user?.fullName || user?.username || "Guest"}
                 </p>
                 <p className="text-xs text-zinc-500 truncate">
                   {user?.primaryEmailAddress?.emailAddress || "No email"}
                 </p>
               </div>
               <Settings className="h-4 w-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
             </div>
             <ul role="list" className="-mx-2 space-y-2 border-t border-white/10 pt-6">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-white/5 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                      "group flex gap-x-4 rounded-xl p-3 text-sm font-semibold transition-all duration-200"
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300",
                        "h-5 w-5 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
