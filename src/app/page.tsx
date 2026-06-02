import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none blur-[100px] bg-gradient-to-b from-primary/50 to-transparent" />
      
      <div className="z-10 flex flex-col items-center max-w-3xl text-center px-4 mt-20">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Bot className="mr-2 h-4 w-4" />
          <span>AI-Powered Job Applications</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Apply to 100 jobs while you sleep
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Upload your resume. Tell us what you want. Our AI parses your skills, finds the best matches across Indeed and LinkedIn, and auto-fills applications for you.
        </p>
        
        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-base font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/setup">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium rounded-full">
              Setup Sessions
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4 mt-32 mb-20 z-10">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
          <p className="text-sm text-muted-foreground">Ollama AI scores jobs against your exact resume so you only apply to high-probability matches.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Automated Applying</h3>
          <p className="text-sm text-muted-foreground">Playwright takes over your browser, fills out tedious forms, and attaches your PDF resume.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Human in the Loop</h3>
          <p className="text-sm text-muted-foreground">Safely pause for CAPTCHAs and review every application before the final submit button is pressed.</p>
        </div>
      </div>
    </div>
  );
}
