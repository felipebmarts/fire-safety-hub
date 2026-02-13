import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  delay?: number;
  children?: React.ReactNode;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  delay = 0,
  children,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-xl p-5 shadow-sm border border-border card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {children}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
    </motion.div>
  );
}
