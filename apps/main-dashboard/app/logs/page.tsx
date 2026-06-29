"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  timestamp?: string;
  level?: "info" | "warn" | "error" | "debug";
  message?: string;
  service?: string;
  [key: string]: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const projectId = "default"; // Temporary default
    const streamUrl = process.env.NEXT_PUBLIC_LOG_STREAM_URL || "http://localhost:8080/api/v1";
    const eventSource = new EventSource(`${streamUrl}/logs/stream/${projectId}`);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'heartbeat') return;

      setLogs((prev) => [data, ...prev].slice(0, 100));
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-satoshi text-white">Live Logs</h1>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-zinc-400 font-mono">
            {isConnected ? 'LIVE' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="glass p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-xl border border-white/10 shadow-sm">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <div className="h-12 w-12 text-blue-500 animate-pulse flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">No logs flowing yet</h2>
            <p className="text-zinc-400 max-w-sm mx-auto">
              Integrate our SDK or use the API to start seeing your application logs in real-time.
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
            View Setup Guide
          </button>
        </div>
      ) : (
        <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Timestamp</th>
                  <th className="p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Level</th>
                  <th className="p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Service</th>
                  <th className="p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-xs text-zinc-500 font-mono whitespace-nowrap">
                      {log.timestamp || new Date().toISOString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                        log.level === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        log.level === 'warn' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        log.level === 'debug' ? 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {log.level || 'info'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-zinc-400 font-mono whitespace-nowrap">
                      {log.service || 'unknown'}
                    </td>
                    <td className="p-4 text-xs text-zinc-300 font-mono">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
