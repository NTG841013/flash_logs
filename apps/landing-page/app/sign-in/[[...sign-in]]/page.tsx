import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background overflow-hidden relative">
      {/* Background Glows for Auth Pages */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Left Panel - Information (Large screens only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-card/20 backdrop-blur-xl border-r border-white/5 relative overflow-hidden">
        {/* Panel Internal Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full opacity-50" />
        
        <div className="max-w-md relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center transition-transform group-hover:scale-110">
              <div className="w-4 h-4 bg-black rounded-sm" />
            </div>
            <span className="font-satoshi text-xl font-bold tracking-tight text-white">
              Flash Logs
            </span>
          </Link>

          <h1 className="font-satoshi text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Monitor your infrastructure <br />
            <span className="gradient-text">in real-time.</span>
          </h1>

          <ul className="space-y-6 text-zinc-400 text-lg">
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
              <span>Zero-latency log ingestion and processing.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
              <span>Advanced search and filtering with full JSON support.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)] shrink-0" />
              <span>Smart alerts via webhooks and integrations.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm" />
              </div>
              <span className="font-satoshi text-xl font-bold tracking-tight text-white">
                Flash Logs
              </span>
            </Link>
          </div>
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "bg-transparent border-none shadow-none p-0",
                headerTitle: "text-white font-satoshi text-2xl",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton: "bg-white/10 border-white/20 hover:bg-white/15 text-white transition-all duration-200",
                socialButtonsBlockButtonText: "text-white font-medium",
                socialButtonsProviderIcon: "invert brightness-200 contrast-200",
                dividerLine: "bg-zinc-800",
                dividerText: "text-zinc-500",
                formFieldLabel: "text-zinc-400",
                formFieldInput: "bg-zinc-900 border-zinc-800 text-white focus:ring-white focus:border-white",
                formButtonPrimary: "bg-white text-black hover:bg-zinc-200",
                footerActionText: "text-zinc-500",
                footerActionLink: "text-white hover:text-zinc-300",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-zinc-400",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
