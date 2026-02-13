import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const teamData = [
  { nome: "Carlos Silva", inspecoes: 64, horas: 28, conformidade: 97, falhasDetectadas: 2 },
  { nome: "Ana Oliveira", inspecoes: 58, horas: 24, conformidade: 96, falhasDetectadas: 3 },
  { nome: "Pedro Santos", inspecoes: 52, horas: 22, conformidade: 92, falhasDetectadas: 1 },
  { nome: "Mariana Costa", inspecoes: 48, horas: 18, conformidade: 88, falhasDetectadas: 2 },
  { nome: "Rafael Lima", inspecoes: 45, horas: 16, conformidade: 84, falhasDetectadas: 1 },
  { nome: "Juliana Rocha", inspecoes: 41, horas: 14, conformidade: 80, falhasDetectadas: 0 },
];

const getConformidadeBadge = (valor: number) => {
  if (valor > 95)
    return (
      <Badge className="bg-success/10 text-success border-0 hover:bg-success/20">
        {valor}%
      </Badge>
    );
  if (valor >= 85)
    return (
      <Badge className="bg-warning/10 text-warning border-0 hover:bg-warning/20">
        {valor}%
      </Badge>
    );
  return (
    <Badge className="bg-destructive/10 text-destructive border-0 hover:bg-destructive/20">
      {valor}%
    </Badge>
  );
};

const chartData = teamData.map((d) => ({
  nome: d.nome.split(" ")[0],
  inspecoes: d.inspecoes,
  horas: d.horas,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export function TeamPerformance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Performance da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mini chart */}
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="nome" fontSize={12} stroke="hsl(220, 10%, 50%)" />
                <YAxis fontSize={12} stroke="hsl(220, 10%, 50%)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) =>
                    value === "inspecoes" ? "Inspeções" : "Horas"
                  }
                />
                <Bar
                  dataKey="inspecoes"
                  name="inspecoes"
                  fill="hsl(210, 80%, 55%)"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="horas"
                  name="horas"
                  fill="hsl(145, 65%, 42%)"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead className="text-center">Inspeções</TableHead>
                <TableHead className="text-center">Horas Exec.</TableHead>
                <TableHead className="text-center">Conformidade</TableHead>
                <TableHead className="text-center">Falhas Detectadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.map((p) => (
                <TableRow key={p.nome}>
                  <TableCell className="font-medium text-foreground">{p.nome}</TableCell>
                  <TableCell className="text-center">{p.inspecoes}</TableCell>
                  <TableCell className="text-center">{p.horas}h</TableCell>
                  <TableCell className="text-center">
                    {getConformidadeBadge(p.conformidade)}
                  </TableCell>
                  <TableCell className="text-center">{p.falhasDetectadas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
