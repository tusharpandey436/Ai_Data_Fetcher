import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RunQueryButton } from "@/components/RunQueryButton";
import { ProcessingStep } from "@/components/ProcessingStep";
import { DataTable } from "@/components/DataTable";

const API_BASE = "http://127.0.0.1:8000";

interface AgentResult {
  report_name: string;
  total_records: number;
  records: Record<string, unknown>[];
}

interface QueryResponse {
  status: string;
  query: string;
  agent_result: AgentResult;
}

const QueryWorkspace = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<{ understanding: string; dataset: string; processing: string } | null>(null);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    setSteps(null);
    setResult(null);
    setError(null);

    // Show processing steps with staged delays
    setTimeout(() => {
      setSteps({ understanding: query, dataset: "Detecting...", processing: "Analyzing query..." });
    }, 300);

    try {
      const res = await fetch(`${API_BASE}/agent/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data: QueryResponse = await res.json();

      setSteps({
        understanding: data.query,
        dataset: data.agent_result.report_name,
        processing: `Found ${data.agent_result.total_records} records`,
      });

      setTimeout(() => {
        setResult(data.agent_result);
        setIsProcessing(false);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to backend");
      setIsProcessing(false);
    }
  };

  const columns = result?.records?.[0] ? Object.keys(result.records[0]) : [];

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Query Workspace</h1>
      <p className="text-sm text-muted-foreground mb-8">Ask questions about your data in natural language</p>

      {/* Query Input */}
      <div className="card-surface p-6 mb-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try: "Show transactions above 10000"'
          rows={3}
          className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleRunQuery();
            }
          }}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground">Press Enter to run · Shift+Enter for new line</span>
          <RunQueryButton isProcessing={isProcessing} onClick={handleRunQuery} disabled={!query.trim()} />
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card-surface p-4 mb-6 border border-destructive/30 text-destructive text-sm font-body"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Steps */}
      <AnimatePresence>
        {steps && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ProcessingStep
              title="Query Understanding"
              value={steps.understanding}
              completed={!isProcessing}
              delay={0}
            />
            <ProcessingStep
              title="Dataset Selected"
              value={steps.dataset}
              completed={!isProcessing}
              delay={0.15}
            />
            <ProcessingStep
              title="Processing Steps"
              value={steps.processing}
              completed={!isProcessing}
              delay={0.3}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Results Table */}
      <AnimatePresence>
        {result && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Generated Report
                <span className="ml-2 text-muted-foreground font-normal">
                  ({result.total_records} records)
                </span>
              </h2>
            </div>
            <DataTable columns={columns} rows={result.records} />
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!steps && !result && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse-glow" />
            </div>
            <p className="text-muted-foreground text-sm">Enter a query to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryWorkspace;
