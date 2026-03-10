import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface ReportRowProps {
  name: string;
  date: string;
  recordCount: number;
  onDownload?: (format: "json" | "csv") => void;
  delay?: number;
}

export function ReportRow({ name, date, recordCount, onDownload, delay = 0 }: ReportRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card-surface p-5 flex items-center justify-between hover:glow-border-indigo transition-shadow duration-300"
    >
      <div className="flex-1">
        <h3 className="text-foreground font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {date} · {recordCount} records
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onDownload?.("json")}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download size={12} />
          JSON
        </button>
        <button
          onClick={() => onDownload?.("csv")}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download size={12} />
          CSV
        </button>
      </div>
    </motion.div>
  );
}
