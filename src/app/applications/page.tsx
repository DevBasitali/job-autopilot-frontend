"use client";

import { useEffect, useState } from "react";
import { getApplications } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type ApplicationLog = {
  job_title: string;
  company: string;
  platform: string;
  status: string;
  timestamp: string;
};

export default function ApplicationsPage() {
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getApplications();
      // Sort by newest first
      data.sort((a: ApplicationLog, b: ApplicationLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch application logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Applied</Badge>;
      case "skipped":
      case "manual_submit_needed":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">Pending / Skipped</Badge>;
      case "failed_to_load":
      default:
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Failed</Badge>;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Application Logs</h1>
          <p className="text-muted-foreground">Track your automated job application history.</p>
        </div>
        <Button onClick={fetchLogs} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border border-border/50 bg-card/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Loading logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                  No applications found. Go to the dashboard to start applying!
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, i) => (
                <TableRow key={i} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{log.job_title}</TableCell>
                  <TableCell>{log.company}</TableCell>
                  <TableCell className="capitalize">{log.platform}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(log.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
