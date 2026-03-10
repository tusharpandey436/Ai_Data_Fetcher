import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProcessingStepProps {
  title: string;
  value: string;
  completed: boolean;
  delay: number;
}

export function ProcessingStep({ title, value, completed, delay }: ProcessingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</h4>
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-accent"
          >
            <Check size={14} />
          </motion.div>
        )}
      </div>
      <p className="text-sm text-foreground font-body">{value}</p>
      {completed && (
        <div className="mt-3 h-[1px] bg-accent animate-underline-draw" />
      )}
    </motion.div>
  );
}
