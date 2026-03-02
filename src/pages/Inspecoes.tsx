import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, ClipboardCheck, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type StatusInspecao = "Conforme" | "Com falha" | "Pendente" | "Planejada";

interface Inspecao {
  id: string;
  eciTag: string;
  eciNome: string;
  area: string;
  semana: number;
  data: string;
  inspetor: string;
  status: StatusInspecao;
  observacoes: string;
  resolvido?: boolean;
}

const mockInspecoes: Inspecao[] = [
  { id: "1", eciTag: "EXT-001", eciNome: "Extintor CO₂ 6kg", area: "Bloco A - Térreo", semana: 3, data: "2025-01-15", inspetor: "Carlos Silva", status: "Conforme", observacoes: "Dentro da validade, lacre intacto." },
  { id: "2", eciTag: "EXT-002", eciNome: "Extintor PQS 4kg", area: "Bloco B - Térreo", semana: 3, data: "2025-01-16", inspetor: "Ana Souza", status: "Com falha", observacoes: "Manômetro na faixa vermelha. Necessita recarga.", resolvido: false },
  { id: "3", eciTag: "HID-001", eciNome: "Hidrante Tipo II", area: "Bloco A - 1º Andar", semana: 4, data: "2025-01-22", inspetor: "Pedro Lima", status: "Conforme", observacoes: "Mangueira em bom estado, registro funcional." },
  { id: "4", eciTag: "ALA-001", eciNome: "Alarme Central", area: "Bloco A - Térreo", semana: 5, data: "2025-01-29", inspetor: "Carlos Silva", status: "Pendente", observacoes: "Aguardando acesso ao painel." },
  { id: "5", eciTag: "SPK-001", eciNome: "Sprinkler Zona 1", area: "Bloco C - Produção", semana: 5, data: "2025-01-30", inspetor: "Roberto Alves", status: "Planejada", observacoes: "" },
  { id: "6", eciTag: "EXT-003", eciNome: "Extintor AP 10L", area: "Estacionamento", semana: 2, data: "2025-01-10", inspetor: "João Santos", status: "Com falha", observacoes: "Extintor vencido. Providenciar troca.", resolvido: true },
  { id: "7", eciTag: "HID-002", eciNome: "Hidrante Tipo I", area: "Bloco B - Térreo", semana: 6, data: "2025-02-05", inspetor: "Ana Souza", status: "Conforme", observacoes: "OK." },
  { id: "8", eciTag: "ILM-001", eciNome: "Iluminação de Emergência", area: "Bloco A - Térreo", semana: 6, data: "2025-02-06", inspetor: "Pedro Lima", status: "Com falha", observacoes: "2 luminárias queimadas no corredor leste.", resolvido: false },
  { id: "9", eciTag: "SPK-002", eciNome: "Sprinkler Zona 2", area: "Bloco C - Produção", semana: 7, data: "2025-02-12", inspetor: "Roberto Alves", status: "Planejada", observacoes: "" },
  { id: "10", eciTag: "EXT-004", eciNome: "Extintor CO₂ 4kg", area: "Refeitório", semana: 4, data: "2025-01-23", inspetor: "Maria Costa", status: "Conforme", observacoes: "Tudo em ordem." },
];

const statusConfig: Record<StatusInspecao, { color: string; icon: React.ElementType }> = {
  Conforme: { color: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]", icon: CheckCircle2 },
  "Com falha": { color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
  Pendente: { color: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]", icon: Clock },
  Planejada: { color: "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))]", icon: ClipboardCheck },
};

export default function Inspecoes() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [viewInsp, setViewInsp] = useState<Inspecao | null>(null);

  const areas = [...new Set(mockInspecoes.map((i) => i.area))];

  const filtered = mockInspecoes.filter((i) => {
    const matchSearch = i.eciTag.toLowerCase().includes(search.toLowerCase()) || i.eciNome.toLowerCase().includes(search.toLowerCase()) || i.inspetor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    const matchArea = filterArea === "all" || i.area === filterArea;
    return matchSearch && matchStatus && matchArea;
  });

  const totalConformes = mockInspecoes.filter((i) => i.status === "Conforme").length;
  const totalFalhas = mockInspecoes.filter((i) => i.status === "Com falha").length;
  const totalPendentes = mockInspecoes.filter((i) => i.status === "Pendente").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inspeções</h1>
          <p className="text-sm text-muted-foreground">Acompanhe todas as inspeções realizadas e planejadas</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: mockInspecoes.length, icon: ClipboardCheck, cls: "bg-primary/10 text-primary" },
            { label: "Conformes", value: totalConformes, icon: CheckCircle2, cls: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" },
            { label: "Com Falha", value: totalFalhas, icon: AlertTriangle, cls: "bg-destructive/10 text-destructive" },
            { label: "Pendentes", value: totalPendentes, icon: Clock, cls: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" },
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por ECI, TAG ou inspetor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Área" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Com falha">Com falha</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Planejada">Planejada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TAG</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Semana</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Inspetor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Resolvido</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => {
                  const cfg = statusConfig[i.status];
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{i.eciTag}</TableCell>
                      <TableCell className="font-medium">{i.eciNome}</TableCell>
                      <TableCell className="text-sm">{i.area}</TableCell>
                      <TableCell className="text-sm">S{i.semana}</TableCell>
                      <TableCell className="text-sm">{new Date(i.data).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-sm">{i.inspetor}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cfg.color}><cfg.icon className="w-3 h-3 mr-1" />{i.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {i.status === "Com falha" ? (
                          <Badge variant={i.resolvido ? "outline" : "destructive"} className={i.resolvido ? "border-[hsl(var(--success))] text-[hsl(var(--success))]" : ""}>
                            {i.resolvido ? "Sim" : "Não"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setViewInsp(i)}><Eye className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Nenhuma inspeção encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!viewInsp} onOpenChange={() => setViewInsp(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhes da Inspeção</DialogTitle></DialogHeader>
          {viewInsp && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">TAG:</span> <span className="font-mono font-semibold text-primary">{viewInsp.eciTag}</span></div>
                <div><span className="text-muted-foreground">Equipamento:</span> <span className="font-semibold">{viewInsp.eciNome}</span></div>
                <div><span className="text-muted-foreground">Área:</span> <span className="font-semibold">{viewInsp.area}</span></div>
                <div><span className="text-muted-foreground">Semana:</span> <span className="font-semibold">S{viewInsp.semana}</span></div>
                <div><span className="text-muted-foreground">Data:</span> <span className="font-semibold">{new Date(viewInsp.data).toLocaleDateString("pt-BR")}</span></div>
                <div><span className="text-muted-foreground">Inspetor:</span> <span className="font-semibold">{viewInsp.inspetor}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge className={statusConfig[viewInsp.status].color}>{viewInsp.status}</Badge></div>
                {viewInsp.status === "Com falha" && (
                  <div><span className="text-muted-foreground">Resolvido:</span> <span className="font-semibold">{viewInsp.resolvido ? "Sim" : "Não"}</span></div>
                )}
              </div>
              {viewInsp.observacoes && <div><span className="text-muted-foreground">Observações:</span><p className="mt-1">{viewInsp.observacoes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
