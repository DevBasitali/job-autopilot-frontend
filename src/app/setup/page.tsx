"use client";

import { useEffect, useState } from "react";
import { getSessions, startSession, finishSession } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetupPage() {
  const [sessions, setSessions] = useState<{ indeed: boolean; linkedin: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const [activeLogin, setActiveLogin] = useState<string | null>(null);

  const handleStartSession = async (platform: string) => {
    setActiveLogin(platform);
    try {
      // This call will block until finishSession is called
      await startSession(platform);
      await fetchSessions();
    } catch (err) {
      console.error(err);
      alert(`Failed to start session for ${platform}`);
    } finally {
      setActiveLogin(null);
    }
  };

  const handleFinishSession = async () => {
    try {
      await finishSession();
      // The startSession call above will now resolve and refresh the session status
    } catch (err) {
      console.error(err);
      alert("Failed to finish session.");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Setup</h1>
          <p className="text-muted-foreground">Manage your authenticated browser sessions.</p>
        </div>
        <Button onClick={fetchSessions} disabled={loading || activeLogin !== null} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {activeLogin && (
        <Card className="mb-8 border-primary/50 bg-primary/10 shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Waiting for {activeLogin} Login...
            </CardTitle>
            <CardDescription className="text-base">
              A Chrome browser window has popped up. Please log into your account there. 
              Once you have successfully logged in and can see your dashboard, click the button below to save the session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleFinishSession} className="w-full text-lg h-14">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              I'm Done Logging In - Save Session & Close Browser
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className={`border-border/50 bg-card/50 ${activeLogin ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Indeed Session</CardTitle>
              {loading ? (
                <Badge variant="outline" className="text-muted-foreground">Checking...</Badge>
              ) : sessions?.indeed ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Missing</Badge>
              )}
            </div>
            <CardDescription className="mb-4">Authentication state for Indeed.com</CardDescription>
            <Button onClick={() => handleStartSession('indeed')} variant={sessions?.indeed ? "outline" : "default"} className="w-full">
              {sessions?.indeed ? "Re-Authenticate Indeed" : "Launch Indeed Login"}
            </Button>
          </CardHeader>
        </Card>
        
        <Card className={`border-border/50 bg-card/50 ${activeLogin ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>LinkedIn Session</CardTitle>
              {loading ? (
                <Badge variant="outline" className="text-muted-foreground">Checking...</Badge>
              ) : sessions?.linkedin ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Missing</Badge>
              )}
            </div>
            <CardDescription className="mb-4">Authentication state for LinkedIn.com</CardDescription>
            <Button onClick={() => handleStartSession('linkedin')} variant={sessions?.linkedin ? "outline" : "default"} className="w-full">
              {sessions?.linkedin ? "Re-Authenticate LinkedIn" : "Launch LinkedIn Login"}
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
