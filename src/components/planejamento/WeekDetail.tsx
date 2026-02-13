import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Eye, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import {
  EciPlan,
  statusLabels,
  criticidadeColors,
  criticidadeLabels,
} from "@/data/planejamentoMockData";

interface WeekDetailProps {
  week: number;
  data: EciPlan[];
}

export function WeekDetail({ week, data }: WeekDetailProps) {
  const items = useMemo(() => {
    return data
      .filter((eci) => eci.weeks[week] && eci.weeks[week] !== "empty")
      .map((eci) => ({
        ...eci,
        status: eci.weeks[week],
        resolved: eci.resolved?.[week] ?? false,
      }));
  }, [week, data]);

  const statusBadgeVariant = (s: string) => {
    if (s === "failure") return "destructive" as const;
    if (s === "pending") return "outline" as const;
    return "default" as const;
  };

  const statusBadgeClass = (s: string) => {
    if (s === "done") return "bg-success text-success-foreground";
    if (s === "planned") return "bg-info text-info-foreground";
    return "";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Detalhamento — Semana {week}</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.eciId}
                  className={cn(
                    "rounded-lg border p-4 text-sm space-y-2",
                    item.status === "done" && "border-success/40 bg-success/5",
                    item.status === "planned" && "border-info/40 bg-info/5",
                    item.status === "pending" && "border-warning/40 bg-warning/5",
                    item.status === "failure" && "border-destructive/40 bg-destructive/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{item.eciId} — {item.eciName}</p>
                      <p className="text-xs text-muted-foreground">{item.area}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] border", criticidadeColors[item.criticidade])}
                    >
                      {criticidadeLabels[item.criticidade]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={statusBadgeVariant(item.status)}
                      className={cn("text-[10px]", statusBadgeClass(item.status))}
                    >
                      {statusLabels[item.status]}
                    </Badge>

                    {(item.status === "failure" || item.status === "pending") && (
                      <div className="flex items-center gap-1 text-xs">
                        <AlertTriangle className="w-3 h-3 text-warning" />
                        <span className="text-muted-foreground">
                          Resolvido?{" "}
                          {item.resolved ? (
                            <span className="text-success font-medium inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Sim
                            </span>
                          ) : (
                            <span className="text-destructive font-medium inline-flex items-center gap-0.5">
                              <XCircle className="w-3 h-3" /> Não
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2">
                    <Eye className="w-3.5 h-3.5 mr-1" /> Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma inspeção nesta semana.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
