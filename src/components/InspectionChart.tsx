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
  { name: "Sem 1", realizadas: 45, pendencias: 8, falhas: 3 },
  { name: "Sem 2", realizadas: 52, pendencias: 5, falhas: 2 },
  { name: "Sem 3", realizadas: 38, pendencias: 7, falhas: 4 },
  { name: "Sem 4", realizadas: 60, pendencias: 3, falhas: 1 },
];

export function InspectionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <h3 className="text-base font-semibold text-card-foreground mb-4">
        Relação das Inspeções (por semana)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220,10%,50%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(220,10%,50%)" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(220,15%,90%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Legend />
          <Bar dataKey="realizadas" name="Realizadas" fill="hsl(145,65%,42%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pendencias" name="Pendências" fill="hsl(40,95%,55%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="falhas" name="Falhas" fill="hsl(0,84%,50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
