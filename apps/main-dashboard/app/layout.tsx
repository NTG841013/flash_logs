import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: "./assets/fonts/Satoshi-Bold.otf",
  variable: "--font-satoshi",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "Flash Logs | Dashboard",
  description: "Manage your high-performance logging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="h-full bg-background">
        <ClerkProvider
          ui={ui}
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "var(--background)",
              colorPrimary: "var(--primary)",
              fontFamily: "var(--font-geist-sans)",
            },
            elements: {
              card: "bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl",
              popoverCard: "bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl",
              navbar: "bg-transparent",
              headerTitle: "font-satoshi font-bold text-white",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 transition-colors",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-medium rounded-lg",
              footer: "hidden",
              userButtonPopoverCard: "bg-card/95 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden p-1.5",
              userButtonPopoverActionButton: "hover:bg-white/5 transition-all duration-200 px-3 py-2 rounded-xl",
              userButtonPopoverActionButtonText: "text-zinc-200 font-satoshi font-medium text-[13px] ml-3",
              userButtonPopoverActionButtonIcon: "text-zinc-400 w-4 h-4 flex items-center justify-center shrink-0",
              userButtonPopoverFooter: "hidden",
              userButtonTrigger: "hover:scale-105 transition-transform duration-300 focus:outline-none",
              avatarBox: "h-9 w-9 rounded-xl border border-white/10 shadow-lg",
              userPreviewMainIdentifier: "text-white font-satoshi font-bold",
              userPreviewSecondaryIdentifier: "text-muted-foreground font-medium text-xs",
              userButtonPopoverActions: "gap-0.5",
              userButtonPopoverAction__signOut: "hidden",
              userButtonPopoverActionButton__signOut: "hidden",
              userButtonPopoverActionButtonIcon__signOut: "hidden",
              userButtonPopoverActionButtonText__signOut: "hidden",
              userButtonPopoverAction__manageAccount: "hidden",
              userButtonPopoverActionButton__manageAccount: "hidden",
              userButtonPopoverActionButtonIcon__manageAccount: "hidden",
              userButtonPopoverActionButtonText__manageAccount: "hidden",
              userButtonPopoverAction__manageOrg: "hidden",
              userButtonPopoverActionButton__manageOrg: "hidden",
            }
          }}
        >
          <TooltipProvider>
            <DashboardLayout>{children}</DashboardLayout>
            <Toaster position="top-right" expand={false} richColors theme="dark" />
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
