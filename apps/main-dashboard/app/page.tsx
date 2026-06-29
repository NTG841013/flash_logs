"use client";

import { Activity, Zap, Shield, Clock, BarChart3, PieChart, LayoutGrid, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const stats = [
    { name: "Logs (24h)", value: "0", icon: Activity },
    { name: "Error Rate", value: "0.0%", icon: Zap },
    { name: "Ingest Rate", value: "0/s", icon: Zap, live: true },
    { name: "Active Alerts", value: "0", icon: Shield },
    { name: "Avg Latency", value: "29ms", icon: Clock, live: true },
    { name: "Queue Backlog", value: "0 jobs", icon: LayoutGrid, live: true },
  ];

  const healthServices = [
    { name: "Ingest Service", status: "Healthy" },
    { name: "Alerting Service", status: "Healthy" },
    { name: "Database", status: "Healthy" },
    { name: "Public API", status: "Healthy" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold font-satoshi text-white tracking-tight">Overview</h1>
        <p className="text-zinc-500 text-xs mt-1 font-medium">High-level metrics and activity across your logs and alerts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.name} className="relative group overflow-hidden bg-card p-4 rounded-xl border border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.name}</p>
              {stat.live && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </div>
            <div className="relative">
              <p className="text-2xl font-bold text-white tracking-tight font-satoshi">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-card rounded-xl border border-white/10 flex flex-col min-h-[300px] shadow-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Logs Over Time (12h)</h3>
          </div>
          <div className="flex-1 flex flex-col justify-end p-6">
             <div className="w-full h-1 rounded-full bg-white/5 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-2/3 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-card rounded-xl border border-white/10 flex flex-col min-h-[300px] shadow-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Error Trend (12h)</h3>
          </div>
          <div className="flex-1 flex flex-col justify-end p-6">
             <div className="w-full h-1 rounded-full bg-white/5 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-rose-500 rounded-full opacity-50 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-card rounded-xl border border-white/10 flex flex-col min-h-[300px] shadow-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Top Sources</h3>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p className="text-zinc-500 text-[11px] font-medium">Enough data not available yet!</p>
          </div>
        </div>
      </div>

      {/* Activity and Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-card rounded-xl border border-white/10 flex flex-col shadow-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Top Activity</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/10">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500 text-xs font-medium">
                    Enough data not available yet!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-card rounded-xl border border-white/10 flex flex-col shadow-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">System Health</h3>
          </div>
          <div className="p-4 space-y-4">
            {healthServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-400">{service.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[11px] font-bold text-white">Healthy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
