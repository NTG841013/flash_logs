"use client";

import { Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const plans = [
  {
    name: "Hacker",
    price: "$0",
    description: "Perfect for side projects and individual developers.",
    features: [
      "1M logs / month",
      "3 days retention",
      "Real-time streaming",
      "Basic alerts (webhooks)",
      "1 project",
      "Standard support",
    ],
    buttonText: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams that need more visibility.",
    features: [
      "10M logs / month",
      "30 days retention",
      "Advanced search queries",
      "Smart alerts (Slack/Discord)",
      "5 projects",
      "Priority support",
    ],
    buttonText: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "High-volume logging with custom requirements.",
    features: [
      "Unlimited logs",
      "Custom retention",
      "SSO & SAML",
      "Dedicated infrastructure",
      "Unlimited projects",
      "24/7 Premium support",
    ],
    buttonText: "Contact Us",
    popular: false,
  },
];

export function LandingPricing() {
  const { isSignedIn } = useAuth();
  
  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Simple, <span className="gradient-text">transparent pricing.</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your scale. No hidden fees, no complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-10 rounded-[2.5rem] transition-all duration-500 border ${
                plan.popular 
                ? "bg-primary/5 border-primary/30 scale-105 z-10 shadow-[0_0_80px_rgba(59,130,246,0.15)] ring-1 ring-primary/20" 
                : "glass border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground text-lg">/mo</span>}
                </div>
                <p className="mt-6 text-base text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>
              
              <ul className="space-y-5 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-base text-muted-foreground">
                    <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.name === "Enterprise" ? "mailto:sales@flashlogs.com" : (isSignedIn ? "/dashboard" : "/sign-up")}>
                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className={`w-full rounded-full h-14 text-lg font-semibold transition-all duration-300 ${
                    plan.popular ? "glow-primary hover:scale-105" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
