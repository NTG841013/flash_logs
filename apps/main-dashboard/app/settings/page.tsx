"use client";

import React from "react";
import { UserProfile, UserButton, OrganizationProfile } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, CreditCard, User, Building } from "lucide-react";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold font-satoshi tracking-tight text-white flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Settings
          </h2>
          <p className="text-zinc-500 mt-1">
            Manage your account, organization, and billing preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10 p-1 h-12">
          <TabsTrigger value="profile" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Building className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="border-none p-0 outline-none">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            <UserProfile 
              appearance={{
                baseTheme: dark,
                elements: {
                  card: "bg-transparent shadow-none border-none w-full",
                  navbar: "hidden",
                  scrollBox: "bg-transparent",
                  pageScrollBox: "p-8",
                  rootBox: "w-full"
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="organization" className="border-none p-0 outline-none">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            <OrganizationProfile 
              appearance={{
                baseTheme: dark,
                elements: {
                  card: "bg-transparent shadow-none border-none w-full",
                  navbar: "hidden",
                  scrollBox: "bg-transparent",
                  pageScrollBox: "p-8",
                  rootBox: "w-full"
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 outline-none">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-sm">
             {/* Clerk Pricing Table / Billing Portal Integration */}
             <div className="space-y-4">
               <h3 className="text-xl font-bold text-white font-satoshi">Subscription & Usage</h3>
               <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
                 You are currently on the <span className="text-primary font-bold">Pro Plan</span>. 
                 Manage your subscription, view invoices, and update payment methods.
               </p>
               
               <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Keys</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white font-satoshi">3</span>
                      <span className="text-zinc-500 mb-1">/ 10</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-primary h-full w-[30%]" />
                    </div>
                 </div>
                 
                 <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Monthly Ingestion</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-white font-satoshi">1.2M</span>
                      <span className="text-zinc-500 mb-1">/ 10M</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-primary h-full w-[12%]" />
                    </div>
                 </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-white/5">
                 {/* Placeholder for Clerk Billing Link/Pricing Table */}
                 <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                   Manage Subscription
                 </button>
               </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
