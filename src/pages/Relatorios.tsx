import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart2, Download, FileText, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyData = [
  { mes: "Jan", conformes: 18, falhas: 4, pendentes: 2 },
  { mes: "Fev", conformes: 22, falhas: 3, pendentes: 1 },
  { mes: "Mar", conformes: 25, falhas: 5, pendentes: 3 },
  { mes: "Abr", conformes: 20, falhas: 2, pendentes: 2 },
  { mes: "Mai", conformes: 28, falhas: 6, pendentes: 1 },
  { mes: "Jun", conformes: 30, falhas: 3, pendentes: 2 },
];

const pieData = [
  { name: "Conforme", value: 143, color: "hsl(145, 65%, 42%)" },
  { name: "Com falha", value: 23, color: "hsl(0, 84%, 50%)" },
  { name: "Pendente", value: 11, color: "hsl(40, 95%, 55%)" },
  { name: "Planejada", value: 34, color: "hsl(210, 80%, 55%)" },
];

const topFalhas = [
  { eci: "EXT-002", nome: "Extintor PQS 4kg", area: "Bloco B", falhas: 4 },
  { eci: "ILM-001", nome: "Iluminação de Emergência", area: "Bloco A", falhas: 3 },
  { eci: "HID-003", nome: "Hidrante Tipo III", area: "Bloco C", falhas: 3 },
  { eci: "ALA-002", nome: "Alarme Setor B", area: "Bloco B", falhas: 2 },
  { eci: "SPK-001", nome: "Sprinkler Zona 1", area: "Bloco C", falhas: 2 },
];

const relatoriosGerados = [
  { id: "1", titulo: "Relatório Mensal - Janeiro 2025", tipo: "Mensal", geradoEm: "2025-02-01", formato: "PDF" },
  { id: "2", titulo: "Relatório Mensal - Fevereiro 2025", tipo: "Mensal", geradoEm: "2025-03-01", formato: "PDF" },
  { id: "3", titulo: "Relatório de Não Conformidades - Q1", tipo: "Trimestral", geradoEm: "2025-04-01", formato: "Excel" },
  { id: "4", titulo: "Inventário de ECIs - 2025", tipo: "Anual", geradoEm: "2025-01-15", formato: "PDF" },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("2025");
  const [tipoRelatorio, setTipoRelatorio] = useState("all");

  const totalInspecoes = pieData.reduce((a, b) => a + b.value, 0);
  const taxaConformidade = ((pieData[0].value / totalInspecoes) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Análises e relatórios de inspeções</p>
          </div>
          <div className="flex gap-3">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" /> Gerar Relatório
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Inspeções", value: totalInspecoes, icon: FileBarChart2, cls: "bg-primary/10 text-primary" },
            { label: "Taxa de Conformidade", value: `${taxaConformidade}%`, icon: TrendingUp, cls: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" },
            { label: "Não Conformidades", value: pieData[1].value, icon: AlertTriangle, cls: "bg-destructive/10 text-destructive" },
            { label: "Resolvidas", value: "87%", icon: CheckCircle2, cls: "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.cls}`}><s.icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Inspeções por Mês</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="conformes" name="Conformes" fill="hsl(145, 65%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="falhas" name="Falhas" fill="hsl(0, 84%, 50%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendentes" name="Pendentes" fill="hsl(40, 95%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Distribuição por Status</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Falhas + Relatórios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">ECIs com Mais Falhas</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TAG</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-center">Falhas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFalhas.map((f) => (
                    <TableRow key={f.eci}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{f.eci}</TableCell>
                      <TableCell className="font-medium">{f.nome}</TableCell>
                      <TableCell>{f.area}</TableCell>
                      <TableCell className="text-center"><Badge variant="destructive">{f.falhas}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Relatórios Gerados</CardTitle>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatoriosGerados
                    .filter((r) => tipoRelatorio === "all" || r.tipo === tipoRelatorio)
                    .map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-sm">{r.titulo}</TableCell>
                        <TableCell><Badge variant="outline">{r.tipo}</Badge></TableCell>
                        <TableCell>
                          <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />{r.formato}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
