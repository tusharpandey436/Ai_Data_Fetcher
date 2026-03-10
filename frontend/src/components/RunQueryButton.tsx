import { motion } from "framer-motion";

interface RunQueryButtonProps {
  isProcessing: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RunQueryButton({ isProcessing, onClick, disabled }: RunQueryButtonProps) {
  return (
    <motion.button
      whileTap={!isProcessing ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`
        relative h-11 px-8 rounded-lg font-semibold text-sm overflow-hidden transition-all duration-300
        ${isProcessing
          ? "border border-primary text-primary bg-transparent"
          : "bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40"
        }
      `}
    >
      {isProcessing && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="scan-animation absolute inset-y-0 w-1/3" />
        </div>
      )}
      <span className="relative z-10">
        {isProcessing ? "Processing..." : "Run Query"}
      </span>
    </motion.button>
  );
}
