import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Sem 1", planejadas: 120, executadas: 104 },
  { name: "Sem 2", planejadas: 110, executadas: 98 },
  { name: "Sem 3", planejadas: 130, executadas: 125 },
  { name: "Sem 4", planejadas: 100, executadas: 88 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-card-foreground mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}h</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function HoursChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <h3 className="text-base font-semibold text-card-foreground mb-4">
        Horas Planejadas x Executadas (por semana)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={8} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220,10%,50%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,50%)" }} unit="h" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-sm font-medium">{value}</span>
            )}
          />
          <Bar
            dataKey="planejadas"
            name="🔵 Planejadas"
            fill="hsl(210,80%,55%)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="executadas"
            name="🟢 Executadas"
            fill="hsl(145,65%,42%)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
