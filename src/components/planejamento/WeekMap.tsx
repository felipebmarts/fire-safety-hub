import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EciPlan,
  CellStatus,
  statusColors,
  statusLabels,
  criticidadeColors,
  criticidadeLabels,
} from "@/data/planejamentoMockData";

interface WeekMapProps {
  data: EciPlan[];
  year: string;
  selectedWeek: number | null;
  onSelectWeek: (week: number) => void;
}

const statusLegend: { status: CellStatus; color: string; label: string }[] = [
  { status: "empty", color: "bg-muted", label: "Sem inspeção" },
  { status: "planned", color: "bg-info", label: "Planejada" },
  { status: "pending", color: "bg-warning", label: "Pendente" },
  { status: "failure", color: "bg-destructive", label: "Com falha" },
  { status: "done", color: "bg-success", label: "Conforme" },
];

const critLegend = [
  { label: "Baixa", color: "bg-success" },
  { label: "Média", color: "bg-warning" },
  { label: "Alta", color: "bg-destructive" },
];

export function WeekMap({ data, year, selectedWeek, onSelectWeek }: WeekMapProps) {
  const weeks = useMemo(() => Array.from({ length: 52 }, (_, i) => i + 1), []);

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base">Mapa de 52 Semanas — {year}</CardTitle>
          <div className="flex flex-wrap gap-6">
            {/* Status legend */}
            <div className="flex flex-wrap gap-3">
              <span className="text-xs font-medium text-muted-foreground mr-1">Status:</span>
              {statusLegend.map((item) => (
                <div key={item.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("w-3 h-3 rounded-sm", item.color)} />
                  {item.label}
                </div>
              ))}
            </div>
            {/* Criticidade legend */}
            <div className="flex flex-wrap gap-3">
              <span className="text-xs font-medium text-muted-foreground mr-1">Criticidade:</span>
              {critLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("w-3 h-3 rounded-full", item.color)} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
        <table className="w-max min-w-full text-sm border-collapse">
          <thead className="sticky top-0 z-20 bg-card">
            <tr className="border-b">
              <th className="sticky left-0 z-30 bg-card px-3 py-2.5 text-left font-semibold text-muted-foreground min-w-[200px]">
                ECI
              </th>
              <th className="sticky left-[200px] z-30 bg-card px-2 py-2.5 text-center font-semibold text-muted-foreground min-w-[90px]">
                Criticidade
              </th>
              <th className="sticky left-[290px] z-30 bg-card px-2 py-2.5 text-center font-semibold text-muted-foreground min-w-[70px]">
                T. Médio
              </th>
              {weeks.map((w) => (
                <th
                  key={w}
                  className={cn(
                    "px-0 py-2.5 text-center font-medium cursor-pointer transition-colors min-w-[36px] hover:text-primary",
                    selectedWeek === w ? "text-primary font-bold bg-primary/5" : "text-muted-foreground"
                  )}
                  onClick={() => onSelectWeek(w)}
                >
                  S{w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((eci) => (
              <tr key={eci.eciId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-foreground whitespace-nowrap">
                  <span className="text-muted-foreground text-xs mr-1.5">{eci.eciId}</span>
                  <span className="text-sm">{eci.eciName}</span>
                </td>
                <td className="sticky left-[200px] z-10 bg-card px-2 py-2 text-center">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] font-semibold border", criticidadeColors[eci.criticidade])}
                  >
                    {criticidadeLabels[eci.criticidade]}
                  </Badge>
                </td>
                <td className="sticky left-[290px] z-10 bg-card px-2 py-2 text-center text-xs text-muted-foreground">
                  {eci.tempoMedio}h
                </td>
                {weeks.map((w) => {
                  const status: CellStatus = eci.weeks[w] || "empty";
                  return (
                    <td key={w} className="px-0.5 py-1">
                      <div
                        onClick={() => onSelectWeek(w)}
                        title={`${eci.eciId} — S${w}: ${statusLabels[status]}`}
                        className={cn(
                          "w-7 h-7 rounded-sm cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-primary/40 mx-auto",
                          statusColors[status],
                          selectedWeek === w && "ring-2 ring-primary/60"
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
