import { useEffect, useState } from "react";
import { ReportRow } from "@/components/ReportRow";
import { motion, AnimatePresence } from "motion/react";

const API_BASE = "http://127.0.0.1:8000";

interface Report {
  report_name: string;
  total_records: number;
  records: Record<string, unknown>[];
  created_at?: string;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/reports/`);
        if (!res.ok) throw new Error(`Server Error: ${res.status}`);
        
        const data = await res.json();
        
        // Ensure data is an array. If backend returns a single object, wrap it.
        const list = Array.isArray(data) ? data : (data ? [data] : []);
        
        // Filter out any null values or objects missing names
        const validReports = list.filter((r: any) => r && (r.report_name || r.name));
        setReports(validReports);
      } catch (err) {
        console.error("Failed to load reports:", err);
        setError(err instanceof Error ? err.message : "Connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = (report: Report, format: "json" | "csv") => {
    let content: string;
    let mimeType: string;

    if (format === "json") {
      content = JSON.stringify(report, null, 2);
      mimeType = "application/json";
    } else {
      const records = report.records || [];
      const cols = records[0] ? Object.keys(records[0]) : [];
      const rows = records.map((r) => cols.map((c) => {
        const val = r[c];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? "");
      }).join(","));
      content = [cols.join(","), ...rows].join("\n");
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Sanitize filename: replace spaces/special chars with underscores
    const safeName = (report.report_name || "report").replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${safeName}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Reports Vault</h1>
        <p className="text-muted-foreground">Historical analysis results and generated data exports.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground text-sm py-10">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Synchronizing report archive...
        </div>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <AnimatePresence>
        {!loading && !error && reports.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-16 border-2 border-dashed border-border rounded-3xl text-center bg-muted/5"
          >
            <p className="text-muted-foreground">No reports found in the archive.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Run a query in the workspace to generate your first report.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reports.map((report, i) => (
          <ReportRow
            key={report.report_name + i}
            name={report.report_name.replace(/_/g, " ")} // Prettier display
            date={report.created_at || "Recent"}
            recordCount={report.total_records || (report.records?.length ?? 0)}
            onDownload={(format) => handleDownload(report, format)}
            delay={i * 0.05}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;