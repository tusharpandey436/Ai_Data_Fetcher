import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, RefreshCw } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

const SystemLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      // Changed from /health to the actual logs endpoint we created
      const res = await fetch(`${API_BASE}/system/logs`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      
      const data = await res.json();
      setLogs(data.logs || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      // Don't overwrite existing logs on a temporary network blip
      if (logs.length === 0) {
        setLogs([`[ERROR] Failed to connect to log stream: ${err.message}`]);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Set up polling interval (every 3 seconds)
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(fetchLogs, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Auto-scroll to bottom logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-2 md:p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">System Logs</h1>
          <p className="text-sm text-muted-foreground">Real-time backend activity and debug logs</p>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-all flex items-center gap-2 ${
                isAutoRefresh ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-muted border-border text-muted-foreground'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isAutoRefresh ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`} />
            {isAutoRefresh ? "Auto-refresh On" : "Auto-refresh Paused"}
          </button>
          <button 
            onClick={fetchLogs}
            className="p-1.5 hover:bg-muted rounded-md border border-border transition-colors"
          >
            <RefreshCw size={14} className={error ? "text-destructive" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 p-4 mb-4 border border-destructive/20 text-destructive text-xs rounded-lg flex items-center gap-2">
          <span className="font-bold">CONNECTION ERROR:</span> {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0c0c] rounded-xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} /> agent.log
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground italic">UTF-8</span>
        </div>

        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          className="p-6 h-[550px] overflow-y-auto font-mono text-[13px] leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
        >
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground/40 italic">
              Initializing log stream...
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={`flex gap-4 py-0.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${getLogColor(log)}`}>
                <span className="text-muted-foreground/30 select-none w-6 text-right shrink-0">{i + 1}</span>
                <span className="break-all">{log}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

function getLogColor(log: string): string {
  const upperLog = log.toUpperCase();
  if (upperLog.includes("ERROR") || upperLog.includes("FAILED") || upperLog.includes("500")) return "text-red-400";
  if (upperLog.includes("WARN")) return "text-yellow-400";
  if (upperLog.includes("INFO") || upperLog.includes("SUCCESS")) return "text-emerald-400";
  if (upperLog.includes("DEBUG")) return "text-blue-400";
  return "text-gray-400";
}

export default SystemLogs;