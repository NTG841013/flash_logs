"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Integrations", href: "#integrations" },
    { name: "Pricing", href: "#pricing" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Status", href: "#" },
    { name: "Security", href: "#" },
  ],
};

export function LandingFooter() {
  const { isSignedIn } = useAuth();

  return (
    <footer className="bg-background border-t border-white/5 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="mb-24 p-8 md:p-16 rounded-3xl glass border border-white/10 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/10 blur-[120px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6 relative">
            Ready to <span className="gradient-text">supercharge</span> your logs?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 relative">
            Join 1,000+ developers who monitor their applications with Flash Logs.
            Start your free 14-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full px-10">
                {isSignedIn ? "Go to Dashboard" : "Get Started for Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-10">
              Contact Sales
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-shadow">
                <span className="font-bold text-white text-xl">F</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Flash <span className="text-primary">Logs</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-8 text-base leading-relaxed">
              High-performance monitoring for modern development teams. 
              Built on ClickHouse and NATS for ultimate speed and scale.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Flash Logs Inc. All rights reserved. Built with ❤️ for developers.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
