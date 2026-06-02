import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Autopilot",
  description: "Apply to 100 jobs while you sleep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col`}>
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
            <Link href="/" className="flex items-center gap-2 mr-6 font-semibold text-lg tracking-tight hover:text-primary transition-colors">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Job Autopilot</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Dashboard
              </Link>
              <Link href="/applications" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Logs
              </Link>
              <Link href="/setup" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Setup
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
