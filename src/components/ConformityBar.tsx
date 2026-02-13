import { motion } from "framer-motion";

interface ConformityBarProps {
  percentage: number;
}

export function ConformityBar({ percentage }: ConformityBarProps) {
  const getColor = () => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 70) return "bg-warning";
    return "bg-destructive";
  };

  const getTextColor = () => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="mt-2">
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
      <p className={`text-xs font-semibold mt-1 ${getTextColor()}`}>
        {percentage}% conforme
      </p>
    </div>
  );
}
