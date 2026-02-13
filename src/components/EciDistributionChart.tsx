import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Extintores", value: 145 },
  { name: "Hidrantes", value: 62 },
  { name: "Container", value: 30 },
  { name: "Bomba de Incêndio", value: 18 },
  { name: "Chuveiro Lava-olhos", value: 25 },
  { name: "Alarme de Incêndio", value: 38 },
];

const COLORS = [
  "hsl(0,78%,52%)",
  "hsl(210,80%,55%)",
  "hsl(40,95%,55%)",
  "hsl(145,65%,42%)",
  "hsl(270,60%,55%)",
  "hsl(25,90%,50%)",
];

const total = data.reduce((s, d) => s + d.value, 0);

export function EciDistributionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <h3 className="text-base font-semibold text-card-foreground mb-4">
        Distribuição de ECIs
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-[200px] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(220,15%,90%)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-card-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-card-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-muted-foreground">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
