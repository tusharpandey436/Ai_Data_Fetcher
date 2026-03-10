import { useEffect, useState, useRef } from "react";
import { DatasetCard } from "@/components/DatasetCard";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileUp, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

interface Dataset {
  name: string;
  description: string;
  columns: string[];
  type: string;
}

const Datasets = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/datasets/`);
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      const fetchedList = data.datasets || (Array.isArray(data) ? data : []);
      setDatasets(fetchedList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({ type: 'error', msg: "Please upload a valid .csv file" });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE}/datasets/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      setUploadStatus({ type: 'success', msg: `${file.name} uploaded successfully!` });
      // Re-fetch the list to show the new file immediately
      fetchDatasets();
    } catch (err) {
      setUploadStatus({ 
        type: 'error', 
        msg: err instanceof Error ? err.message : "Failed to upload file" 
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Datasets</h1>
          <p className="text-muted-foreground">
            Browse and manage CSV files available for AI-powered analysis.
          </p>
        </div>

        {/* Upload Trigger */}
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      </header>

      {/* Upload Status Toast */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              uploadStatus.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            {uploadStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{uploadStatus.msg}</span>
            <button 
              onClick={() => setUploadStatus(null)}
              className="ml-auto text-xs underline opacity-70"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && datasets.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p className="animate-pulse font-mono text-sm">Synchronizing data vault...</p>
        </div>
      ) : error ? (
        <div className="m-8 p-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-2">Connection Error</h3>
          <p className="text-sm opacity-90 mb-4">{error}</p>
          <button 
            onClick={() => fetchDatasets()}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : datasets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-16 border-2 border-dashed border-border rounded-3xl text-center bg-muted/5 flex flex-col items-center"
        >
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FileUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Datasets Found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mb-6">
            Upload your first <code>.csv</code> file to start generating AI reports.
          </p>
          <button
            onClick={handleUploadClick}
            className="text-primary font-medium hover:underline flex items-center gap-2"
          >
            Upload a file now
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((ds, i) => (
            <DatasetCard
              key={ds.name || i}
              name={ds.name}
              description={ds.description}
              columns={ds.columns || []}
              type={ds.type || "csv"}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Datasets;