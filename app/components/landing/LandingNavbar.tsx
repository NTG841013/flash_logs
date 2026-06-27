"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";

import { useAuth, UserButton } from "@clerk/nextjs";

export function LandingNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <span className="font-bold text-white text-xl">F</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground font-satoshi">
            Flash Logs
          </span>
        </Link>
        
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Integrations
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="rounded-full px-5">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
