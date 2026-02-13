import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
type CellStatus = "empty" | "planned" | "done" | "pending" | "failure";

interface EciPlan {
  eciId: string;
  eciName: string;
  eciType: string;
  weeks: Record<number, CellStatus>;
}

interface PlanningDetail {
  day: string;
  time: string;
  duration: string;
  epis: string[];
  notes: string;
}

// Mock data
const epiOptions = ["Capacete", "Luvas", "Óculos", "Bota", "Protetor Auricular", "Máscara"];
const dayOptions = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const generateMockData = (): EciPlan[] => {
  const ecis = [
    { id: "EXT-001", name: "Extintor PQS 6kg - Bloco A", type: "Extintor" },
    { id: "EXT-002", name: "Extintor CO2 4kg - Lab", type: "Extintor" },
    { id: "HID-001", name: "Hidrante Tipo II - Pátio", type: "Hidrante" },
    { id: "HID-002", name: "Hidrante Tipo I - Galpão", type: "Hidrante" },
    { id: "CNT-001", name: "Container Espuma - Doca", type: "Container" },
    { id: "BMB-001", name: "Bomba Jockey - Casa Máq.", type: "Bomba de Incêndio" },
    { id: "CHV-001", name: "Chuveiro Lava-Olhos - Lab Q.", type: "Chuveiro Lava-Olhos" },
    { id: "ALR-001", name: "Alarme Central - Recepção", type: "Alarme de Incêndio" },
    { id: "EXT-003", name: "Extintor AP 10L - Refeitório", type: "Extintor" },
    { id: "ALR-002", name: "Alarme Acionador - Bloco B", type: "Alarme de Incêndio" },
  ];

  return ecis.map((eci) => {
    const weeks: Record<number, CellStatus> = {};
    // Generate sparse data
    for (let w = 1; w <= 52; w++) {
      const rand = Math.random();
      if (rand < 0.15) weeks[w] = "done";
      else if (rand < 0.22) weeks[w] = "planned";
      else if (rand < 0.26) weeks[w] = "pending";
      else if (rand < 0.28) weeks[w] = "failure";
    }
    return { eciId: eci.id, eciName: eci.name, eciType: eci.type, weeks };
  });
};

const weekDetails: Record<string, PlanningDetail[]> = {
  "EXT-001-3": [
    { day: "Segunda", time: "08:00", duration: "1h", epis: ["Capacete", "Luvas"], notes: "" },
  ],
  "HID-001-5": [
    { day: "Terça", time: "14:00", duration: "2h", epis: ["Luvas", "Bota"], notes: "Verificar pressão" },
  ],
};

const statusColors: Record<CellStatus, string> = {
  empty: "bg-muted/40",
  planned: "bg-info/60",
  done: "bg-success/70",
  pending: "bg-warning/60",
  failure: "bg-destructive/70",
};

const statusLabels: Record<CellStatus, string> = {
  empty: "Sem inspeções",
  planned: "Planejada",
  done: "100% Conforme",
  pending: "Com pendência",
  failure: "Com falhas",
};

const legendItems: { status: CellStatus; color: string; label: string }[] = [
  { status: "empty", color: "bg-muted", label: "Sem inspeções" },
  { status: "planned", color: "bg-info", label: "Planejada" },
  { status: "pending", color: "bg-warning", label: "Com pendência" },
  { status: "failure", color: "bg-destructive", label: "Com falhas" },
  { status: "done", color: "bg-success", label: "100% Conforme" },
];

const Planejamento = () => {
  const [year, setYear] = useState("2025");
  const [areaFilter, setAreaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [critFilter, setCritFilter] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedEci, setSelectedEci] = useState<EciPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal form state
  const [formDay, setFormDay] = useState("Segunda");
  const [formTime, setFormTime] = useState("08:00");
  const [formDuration, setFormDuration] = useState("1");
  const [formEpis, setFormEpis] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState("");

  const mockData = useMemo(() => generateMockData(), []);

  // Summary stats
  const stats = useMemo(() => {
    let planned = 0, done = 0, pending = 0;
    mockData.forEach((eci) => {
      Object.values(eci.weeks).forEach((s) => {
        if (s === "planned") planned++;
        if (s === "done") done++;
        if (s === "pending") pending++;
      });
    });
    const total = planned + done + pending;
    const rate = total > 0 ? Math.round((done / (done + planned + pending)) * 100) : 0;
    return { planned: total, done, pending, rate };
  }, [mockData]);

  const handleCellClick = (eci: EciPlan, week: number) => {
    setSelectedEci(eci);
    setSelectedWeek(week);
    setModalOpen(true);
    setFormDay("Segunda");
    setFormTime("08:00");
    setFormDuration("1");
    setFormEpis([]);
    setFormNotes("");
  };

  const toggleEpi = (epi: string) => {
    setFormEpis((prev) =>
      prev.includes(epi) ? prev.filter((e) => e !== epi) : [...prev, epi]
    );
  };

  // Week detail view
  const weekDetailData = useMemo(() => {
    if (selectedWeek === null) return null;
    const items: { eciId: string; eciName: string; status: CellStatus; day?: string; time?: string; duration?: string; epis?: string[] }[] = [];
    mockData.forEach((eci) => {
      const s = eci.weeks[selectedWeek];
      if (s && s !== "empty") {
        const detail = weekDetails[`${eci.eciId}-${selectedWeek}`];
        if (detail && detail.length > 0) {
          detail.forEach((d) => items.push({ eciId: eci.eciId, eciName: eci.eciName, status: s, ...d }));
        } else {
          items.push({ eciId: eci.eciId, eciName: eci.eciName, status: s });
        }
      }
    });
    return items;
  }, [selectedWeek, mockData]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planejamento Anual</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mapa de 52 semanas para gestão estratégica das inspeções
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["2025", "2026", "2027"].map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Áreas</SelectItem>
              <SelectItem value="bloco-a">Bloco A</SelectItem>
              <SelectItem value="lab">Laboratório</SelectItem>
              <SelectItem value="patio">Pátio</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo de ECI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="extintor">Extintor</SelectItem>
              <SelectItem value="hidrante">Hidrante</SelectItem>
              <SelectItem value="container">Container</SelectItem>
              <SelectItem value="bomba">Bomba de Incêndio</SelectItem>
              <SelectItem value="chuveiro">Chuveiro Lava-Olhos</SelectItem>
              <SelectItem value="alarme">Alarme de Incêndio</SelectItem>
            </SelectContent>
          </Select>
          <Select value={critFilter} onValueChange={setCritFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Criticidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Inspeções Planejadas", value: stats.planned, icon: CalendarCheck, color: "text-info" },
          { title: "Já Realizadas", value: stats.done, icon: CheckCircle2, color: "text-success" },
          { title: "Pendentes", value: stats.pending, icon: AlertTriangle, color: "text-warning" },
          { title: "Taxa de Cumprimento", value: `${stats.rate}%`, icon: Clock, color: "text-primary" },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("p-2.5 rounded-lg bg-muted/60")}>
                  <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={cn("w-3 h-3 rounded-full", item.color)} />
            {item.label}
          </div>
        ))}
      </div>

      {/* 52-Week Matrix */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Mapa de 52 Semanas — {year}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-max min-w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="sticky left-0 bg-card z-10 px-3 py-2 text-left font-medium text-muted-foreground min-w-[180px]">
                    ECI
                  </th>
                  {Array.from({ length: 52 }, (_, i) => (
                    <th
                      key={i}
                      className={cn(
                        "px-0 py-2 text-center font-medium cursor-pointer transition-colors min-w-[32px]",
                        selectedWeek === i + 1 ? "text-primary font-bold" : "text-muted-foreground"
                      )}
                      onClick={() => setSelectedWeek(i + 1)}
                    >
                      S{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockData.map((eci) => (
                  <tr key={eci.eciId} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="sticky left-0 bg-card z-10 px-3 py-1.5 font-medium text-foreground whitespace-nowrap">
                      <span className="text-muted-foreground mr-1">{eci.eciId}</span>
                      <span className="hidden xl:inline">— {eci.eciType}</span>
                    </td>
                    {Array.from({ length: 52 }, (_, i) => {
                      const week = i + 1;
                      const status: CellStatus = eci.weeks[week] || "empty";
                      return (
                        <td key={week} className="px-0.5 py-1">
                          <button
                            onClick={() => handleCellClick(eci, week)}
                            title={`${eci.eciId} — S${week}: ${statusLabels[status]}`}
                            className={cn(
                              "w-6 h-6 rounded-sm transition-all hover:scale-125 hover:ring-2 hover:ring-primary/40",
                              statusColors[status],
                              selectedWeek === week && "ring-2 ring-primary/60"
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Week Detail */}
      {selectedWeek && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Detalhamento — Semana {selectedWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weekDetailData && weekDetailData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {weekDetailData.map((item, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-lg border p-3 text-sm",
                        item.status === "done" && "border-success/40 bg-success/5",
                        item.status === "planned" && "border-info/40 bg-info/5",
                        item.status === "pending" && "border-warning/40 bg-warning/5",
                        item.status === "failure" && "border-destructive/40 bg-destructive/5"
                      )}
                    >
                      <p className="font-semibold text-foreground">{item.eciId}</p>
                      <p className="text-xs text-muted-foreground">{item.eciName}</p>
                      {item.day && (
                        <p className="text-xs mt-1">
                          {item.day} — {item.time} — {item.duration}
                          {item.epis && item.epis.length > 0 && (
                            <span className="ml-1">— EPI: {item.epis.join(", ")}</span>
                          )}
                        </p>
                      )}
                      <Badge
                        variant={item.status === "failure" ? "destructive" : item.status === "pending" ? "outline" : "default"}
                        className="mt-2 text-[10px]"
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma inspeção nesta semana.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Planning Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Planejamento de Inspeção</DialogTitle>
            <DialogDescription>
              {selectedEci?.eciId} — Semana {selectedWeek}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">ECI</Label>
              <Input value={selectedEci?.eciName || ""} readOnly className="bg-muted/40" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Dia da Semana</Label>
                <Select value={formDay} onValueChange={setFormDay}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Horário Previsto</Label>
                <Input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Tempo Estimado (horas)</Label>
              <Input type="number" min="0.5" step="0.5" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} />
            </div>
            <div>
              <Label>EPI Necessário</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {epiOptions.map((epi) => (
                  <label key={epi} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <Checkbox checked={formEpis.includes(epi)} onCheckedChange={() => toggleEpi(epi)} />
                    {epi}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Notas adicionais..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setModalOpen(false)}>Salvar Planejamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Planejamento;
