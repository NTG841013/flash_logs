"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Lock, Key, Clipboard, Trash2, Loader2, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type KeyRow = {
  id: string;
  name: string;
  scope: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
  status: "Active" | "Revoked";
};

const statusStyles: Record<string, string> = {
  Active: "text-emerald-500",
  Revoked: "text-zinc-500",
};

export default function ApiKeysPage() {
    const { getToken, isLoaded, userId } = useAuth();
    const [keys, setKeys] = React.useState<KeyRow[]>([]);
  const [selected, setSelected] = React.useState<KeyRow | null>(null);
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [generatedSecret, setGeneratedSecret] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState("");
  const [newScope, setNewScope] = React.useState("Full Access");
  const [newExpiry, setNewExpiry] = React.useState("Never");

  const [isCreating, setIsCreating] = React.useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  const refreshKeys = async () => {
    if (!userId) {
      console.warn("[DEBUG] refreshKeys skipped: No userId");
      return;
    }
    setIsLoadingKeys(true);
    const fetchUrl = `${apiBaseUrl}/api-keys`;
    console.log(`[DEBUG] Fetching API keys from: ${fetchUrl}`);
    console.log(`[DEBUG] NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    
    try {
      const token = await getToken();
      const res = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "cache-control": "no-cache",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch API keys");
      const data = await res.json();
      
      const mappedKeys = data.map((k: any) => ({
        ...k,
        status: k.revokedAt ? "Revoked" : "Active",
      }));
      
      setKeys(mappedKeys);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoadingKeys(false);
    }
  };

  React.useEffect(() => {
    if (isLoaded && userId) {
      refreshKeys();
    }
  }, [isLoaded, userId]);

  const createKey = async () => {
    if (!userId) return;
    setIsCreating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${apiBaseUrl}/api-keys/generate-secret-key`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newName || "New Key",
          scope: newScope,
          expiresAt: newExpiry,
        }),
      });
      
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to create key");
        return;
      }
      
      const data = await res.json();
      setGeneratedSecret(data.key);
      setRevealOpen(true);
      setGenerateOpen(false);
      setNewName("");
      setNewScope("Full Access");
      setNewExpiry("Never");
      
      await refreshKeys();
      toast.success("API Key generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create key");
    } finally {
      setIsCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    if (!userId) return;
    try {
      const token = await getToken();
      const res = await fetch(`${apiBaseUrl}/api-keys/revoke`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) throw new Error("Failed to revoke key");
      
      await refreshKeys();
      toast.success("API Key revoked");
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke key");
    }
  };

  const copyGeneratedSecret = () => {
    if (!generatedSecret) return;
    navigator.clipboard.writeText(generatedSecret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const activeCount = React.useMemo(
    () => keys.filter((k) => k.status === "Active").length,
    [keys]
  );

  const limitReached = activeCount >= 5;

  if (!isLoaded) return <div className="p-8 text-zinc-400 font-satoshi">Loading auth...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-satoshi text-white tracking-tight">API Keys</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">
            Manage and secure your project access credentials.
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-xl px-6 h-11 font-bold font-satoshi shadow-lg transition-all"
              onClick={() => setGenerateOpen(true)}
              disabled={limitReached}
            >
              <Plus className="h-5 w-5 mr-2" />
              Generate New Key
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6} className="bg-zinc-900 border-white/10">
            {limitReached
              ? "Limit reached: 5 active keys per user"
              : "Create a new API key"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Info Card */}
      <div className="glass p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-satoshi uppercase tracking-widest">API Key Security</h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Your API keys are sensitive credentials. Treat them like passwords
              — never share them publicly or commit them to version control.
              You will only see your key once upon creation for your security.
            </p>
          </div>
        </div>
      </div>

      {/* Keys Table Section */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Credentials</h3>
          <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {activeCount}/5 Active
          </span>
        </div>

        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-full border border-white/5">
              <Key className="h-8 w-8 text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-300 font-satoshi">No API keys yet</p>
              <p className="text-xs text-zinc-500 max-w-[200px]">Generate your first key to start ingesting logs.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {isLoadingKeys && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow
                    key={k.id}
                    className="group cursor-pointer"
                    onClick={() => setSelected(k)}
                  >
                    <TableCell className="font-bold font-satoshi text-white">{k.name}</TableCell>
                    <TableCell>
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/5 text-zinc-400">
                         {k.scope}
                       </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-zinc-500">
                      {new Date(k.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-zinc-500">
                      {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", k.status === "Active" ? "bg-emerald-500" : "bg-zinc-500")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-tight", statusStyles[k.status])}>
                          {k.status}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {k.status === "Active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            revokeKey(k.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Usage Guide */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-white font-satoshi uppercase tracking-widest">Ingestion Guide</h2>
        <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Example Request</span>
          </div>
          <div className="p-5 bg-black/40">
            <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
              {`curl -X POST https://api.flashlogs.com/v1/ingest \\
  -H "Authorization: Bearer OML_KEY_SECRET" \\
  -d '{ 
    "message": "User authenticated", 
    "level": "info",
    "service": "auth-service"
  }'`}
            </pre>
          </div>
        </div>
      </div>

      {/* Generate Modal */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new set of credentials to interact with our API.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Friendly Name</label>
              <Input
                placeholder="e.g. Production Backend"
                className="h-11 rounded-xl"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Scope</label>
                <Select value={newScope} onValueChange={setNewScope}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Access">Full Access</SelectItem>
                    <SelectItem value="Read Only">Read Only</SelectItem>
                    <SelectItem value="Write Only">Write Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Expiry</label>
                <Select value={newExpiry} onValueChange={setNewExpiry}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="30 Days">30 Days</SelectItem>
                    <SelectItem value="90 Days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="rounded-xl font-bold font-satoshi"
              onClick={() => setGenerateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl font-bold font-satoshi px-8"
              onClick={createKey}
              disabled={isCreating || !newName}
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secret Reveal Modal */}
      <Dialog open={revealOpen} onOpenChange={(open) => {
        if (!open) {
          setRevealOpen(false);
          setGeneratedSecret(null);
        }
      }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Secure Secret Key</DialogTitle>
            <DialogDescription>
              Copy this key now. It will not be shown again for security reasons.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl relative group">
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Private Key</div>
              <div className="flex items-center justify-between gap-4">
                <code className="text-sm font-mono text-white break-all flex-1">
                  {generatedSecret}
                </code>
                <Button
                  size="sm"
                  variant="secondary"
                  className={cn(
                    "rounded-xl font-bold transition-all",
                    copied && "bg-emerald-500 text-white hover:bg-emerald-600"
                  )}
                  onClick={copyGeneratedSecret}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
              <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-500 leading-relaxed">
                Flash Logs does not store your raw secret keys. If you lose this key, you must revoke it and generate a new one.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full rounded-xl font-bold h-11"
              onClick={() => setRevealOpen(false)}
            >
              I've secured the key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Overlay */}
      {selected && !revealOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-white/10 p-8 shadow-2xl animate-in slide-in-from-right duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white font-satoshi">Key Details</h3>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="rounded-full"
                  onClick={() => setSelected(null)}
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </Button>
              </div>

              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</label>
                  <p className="text-lg font-bold text-white font-satoshi">{selected.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scope</label>
                    <p className="text-sm font-medium text-zinc-300">{selected.scope}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</label>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", selected.status === "Active" ? "bg-emerald-500" : "bg-zinc-500")} />
                      <p className={cn("text-sm font-bold uppercase", statusStyles[selected.status])}>{selected.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Created At</span>
                    <span className="text-xs font-mono text-zinc-300">{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Last Used</span>
                    <span className="text-xs font-mono text-zinc-300">{selected.lastUsedAt ? new Date(selected.lastUsedAt).toLocaleString() : "Never"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Expires At</span>
                    <span className="text-xs font-mono text-zinc-300">{selected.expiresAt ? new Date(selected.expiresAt).toLocaleString() : "Never"}</span>
                  </div>
                </div>
              </div>

              {selected.status === "Active" && (
                <div className="mt-auto pt-8">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold"
                    onClick={() => revokeKey(selected.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke Key
                  </Button>
                  <p className="text-[10px] text-zinc-500 text-center mt-4 leading-relaxed">
                    Revoking this key will immediately disable all services using it. This action cannot be undone.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
