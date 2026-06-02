"use client";

import { useState } from "react";
import { parseResume, findJobs, applyToJob } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Search, CheckCircle2, Play, AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [parsing, setParsing] = useState(false);
  
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("Remote");
  const [minScore, setMinScore] = useState(90);
  
  const [searching, setSearching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setParsing(true);
    try {
      const data = await parseResume(file);
      setProfile(data);
    } catch (err) {
      console.error(err);
      alert("Failed to parse resume.");
    } finally {
      setParsing(false);
    }
  };

  const handleSearch = async () => {
    if (!profile || !jobTitle) return;
    setSearching(true);
    setJobs([]);
    try {
      const results = await findJobs({
        profile,
        job_title: jobTitle,
        location,
        min_score: minScore
      });
      setJobs(results);
    } catch (err) {
      console.error(err);
      alert("Failed to search for jobs.");
    } finally {
      setSearching(false);
    }
  };

  const handleApply = async (job: any) => {
    const jobId = `${job.company}-${job.title}`;
    setApplyingJobId(jobId);
    
    // Alert user that they need to watch the terminal
    alert("Application process started! PLEASE CHECK THE BACKEND TERMINAL for CAPTCHAs and confirmation prompts.");
    
    try {
      const result = await applyToJob({
        job,
        profile,
        platform: job.platform
      });
      
      if (result.status === "applied") {
        alert("Successfully applied!");
      } else {
        alert(`Application finished with status: ${result.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply.");
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Autopilot Dashboard</h1>
        <p className="text-muted-foreground">Upload, search, and deploy the application bot.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Resume Upload */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
              <CardTitle>Resume Parser</CardTitle>
            </div>
            <CardDescription>Upload your PDF resume to extract structured data via Ollama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer file:text-primary file:font-medium"
              />
              <Button onClick={handleUpload} disabled={!file || parsing} className="min-w-[120px]">
                {parsing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                {parsing ? "Parsing..." : "Extract Data"}
              </Button>
            </div>
            
            {profile && (
              <div className="mt-4 p-4 rounded-lg bg-background border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-primary flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Profile Extracted
                  </h4>
                  <Badge variant="outline">{profile.experience_years} YOE</Badge>
                </div>
                <p className="text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{profile.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {profile.skills?.slice(0, 10).map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                  ))}
                  {profile.skills?.length > 10 && <Badge variant="secondary" className="text-[10px]">+{profile.skills.length - 10} more</Badge>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Job Preferences */}
        <Card className={`border-border/50 bg-card/50 transition-opacity duration-300 ${!profile ? 'opacity-50 pointer-events-none' : ''}`}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">2</span>
              <CardTitle>Search Parameters</CardTitle>
            </div>
            <CardDescription>Configure scraper targets and AI matching threshold.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Target Role</label>
                <Input 
                  placeholder="e.g. Frontend Developer" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <Input 
                  placeholder="e.g. Remote, New York" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-muted-foreground">Min Match Score: {minScore}%</label>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={minScore} 
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-primary" 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSearch} disabled={searching || !jobTitle} className="w-full">
              {searching ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Scraping & Scoring...</>
              ) : (
                <><Search className="h-4 w-4 mr-2" /> Find Matching Jobs</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Step 3: Results Table */}
      {jobs.length > 0 && (
        <Card className="border-border/50 bg-card/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">3</span>
              <CardTitle>AI Screened Opportunities</CardTitle>
            </div>
            <CardDescription>Found {jobs.length} jobs scoring {minScore}% or higher against your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Score</TableHead>
                    <TableHead className="w-1/3">Job Details</TableHead>
                    <TableHead>Why it matches</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job, idx) => {
                    const jid = `${job.company}-${job.title}`;
                    const isApplying = applyingJobId === jid;
                    const isOtherApplying = applyingJobId !== null && !isApplying;

                    return (
                      <TableRow key={idx} className="hover:bg-muted/30 group transition-colors">
                        <TableCell>
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/10">
                            <span className="text-lg font-bold text-primary">{job.match?.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company} • {job.platform}</p>
                          <p className="text-xs text-muted-foreground/60 mt-1 truncate max-w-xs">{job.location}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs italic text-muted-foreground mb-2 line-clamp-2">{job.match?.reason}</p>
                          <div className="flex flex-wrap gap-1">
                            {job.match?.matching_skills?.slice(0, 3).map((s: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-[9px] bg-green-500/5 border-green-500/20 text-green-600">{s}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          <Button 
                            size="sm" 
                            onClick={() => handleApply(job)}
                            disabled={isApplying || isOtherApplying}
                            className={`transition-all ${isApplying ? 'bg-primary' : 'bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground'}`}
                          >
                            {isApplying ? (
                              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Working...</>
                            ) : (
                              <><Play className="h-3 w-3 mr-1" /> Apply Bot</>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center p-3 text-sm rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600/90">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p>Warning: When you click "Apply Bot", you must monitor the backend Python terminal. The bot will pause and ask you to solve CAPTCHAs and explicitly confirm before final submission.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
