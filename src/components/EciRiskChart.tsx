import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const eciRiskData = [
  { tipo: "Bomba de Incêndio", total: 18, falhas: 3, taxa: 16.7 },
  { tipo: "Container", total: 22, falhas: 2, taxa: 9.1 },
  { tipo: "Alarme de Incêndio", total: 30, falhas: 2, taxa: 6.7 },
  { tipo: "Chuveiro Lava-Olhos", total: 25, falhas: 1, taxa: 4.0 },
  { tipo: "Hidrantes", total: 45, falhas: 1, taxa: 2.2 },
  { tipo: "Extintores", total: 212, falhas: 0, taxa: 0.0 },
].sort((a, b) => b.taxa - a.taxa);

const getBarColor = (taxa: number) => {
  if (taxa > 7) return "hsl(0, 84%, 50%)";
  if (taxa > 3) return "hsl(40, 95%, 55%)";
  return "hsl(145, 65%, 42%)";
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{d.tipo}</p>
      <p className="text-muted-foreground">Total: {d.total}</p>
      <p className="text-muted-foreground">Com falha: {d.falhas}</p>
      <p className="font-medium" style={{ color: getBarColor(d.taxa) }}>
        Taxa: {d.taxa.toFixed(1)}%
      </p>
    </div>
  );
};

export function EciRiskChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Risco por Tipo de ECI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eciRiskData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${v}%`}
                  fontSize={12}
                  stroke="hsl(220, 10%, 50%)"
                />
                <YAxis
                  type="category"
                  dataKey="tipo"
                  fontSize={12}
                  stroke="hsl(220, 10%, 50%)"
                  width={95}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="taxa" radius={[0, 4, 4, 0]} barSize={24}>
                  {eciRiskData.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.taxa)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground justify-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-success" /> Até 3%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-warning" /> 3% a 7%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Acima de 7%
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
