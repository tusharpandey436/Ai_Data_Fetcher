import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accentCyan?: boolean;
  delay?: number;
}

export function StatusCard({ title, value, icon, accentCyan, delay = 0 }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`card-surface p-6 cursor-default transition-shadow duration-300 ${
        accentCyan ? "glow-border-cyan" : "hover:glow-border-indigo"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 font-body">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${accentCyan ? "text-accent bg-accent/10" : "text-primary bg-primary/10"}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
