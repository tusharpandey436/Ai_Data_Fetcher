import { motion } from "framer-motion";

interface DatasetCardProps {
  name: string;
  description: string;
  columns: string[];
  type: string;
  delay?: number;
}

export function DatasetCard({ name, description, columns, type, delay = 0 }: DatasetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="card-surface p-6 hover:glow-border-indigo transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-foreground font-semibold text-base">{name}</h3>
        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
          {type}
        </span>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-4">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {columns.map((col) => (
          <span
            key={col}
            className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground"
          >
            {col}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
