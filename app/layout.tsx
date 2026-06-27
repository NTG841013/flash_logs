import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { dark } from "@clerk/ui/themes";
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
  weight: "700",
});

export const metadata: Metadata = {
  title: "Flash Logs | High Performance Logging",
  description: "Set up in under a minute. High performance logging for modern applications.",
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
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          ui={ui}
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "#030712", // Matching hsl(228 84% 5%)
              colorPrimary: "#3b82f6",
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
