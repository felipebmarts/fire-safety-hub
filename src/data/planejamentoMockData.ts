export type CellStatus = "empty" | "planned" | "done" | "pending" | "failure";
export type Criticidade = "alta" | "media" | "baixa";

export interface EciPlan {
  eciId: string;
  eciName: string;
  eciType: string;
  area: string;
  criticidade: Criticidade;
  tempoMedio: number; // hours
  weeks: Record<number, CellStatus>;
  resolved?: Record<number, boolean>;
}

export const eciCatalog: Omit<EciPlan, "weeks" | "resolved">[] = [
  { eciId: "EXT-001", eciName: "Extintor PQS 6kg", eciType: "Extintor", area: "Bloco A", criticidade: "alta", tempoMedio: 0.5 },
  { eciId: "EXT-002", eciName: "Extintor CO2 4kg", eciType: "Extintor", area: "Laboratório", criticidade: "media", tempoMedio: 0.5 },
  { eciId: "HID-001", eciName: "Hidrante Tipo II", eciType: "Hidrante", area: "Pátio", criticidade: "alta", tempoMedio: 1.2 },
  { eciId: "HID-002", eciName: "Hidrante Tipo I", eciType: "Hidrante", area: "Galpão", criticidade: "media", tempoMedio: 1.0 },
  { eciId: "CNT-001", eciName: "Container Espuma", eciType: "Container", area: "Doca", criticidade: "baixa", tempoMedio: 0.8 },
  { eciId: "BMB-001", eciName: "Bomba Jockey", eciType: "Bomba de Incêndio", area: "Casa Máq.", criticidade: "alta", tempoMedio: 2.0 },
  { eciId: "CHV-001", eciName: "Chuveiro Lava-Olhos", eciType: "Chuveiro Lava-Olhos", area: "Laboratório", criticidade: "media", tempoMedio: 0.3 },
  { eciId: "ALR-001", eciName: "Alarme Central", eciType: "Alarme de Incêndio", area: "Recepção", criticidade: "alta", tempoMedio: 0.8 },
  { eciId: "EXT-003", eciName: "Extintor AP 10L", eciType: "Extintor", area: "Refeitório", criticidade: "baixa", tempoMedio: 0.5 },
  { eciId: "ALR-002", eciName: "Alarme Acionador", eciType: "Alarme de Incêndio", area: "Bloco B", criticidade: "media", tempoMedio: 0.6 },
  { eciId: "EXT-004", eciName: "Extintor PQS 12kg", eciType: "Extintor", area: "Galpão", criticidade: "alta", tempoMedio: 0.7 },
  { eciId: "HID-003", eciName: "Hidrante Tipo III", eciType: "Hidrante", area: "Bloco A", criticidade: "media", tempoMedio: 1.5 },
];

export function generateMockData(): EciPlan[] {
  return eciCatalog.map((eci) => {
    const weeks: Record<number, CellStatus> = {};
    const resolved: Record<number, boolean> = {};
    for (let w = 1; w <= 52; w++) {
      const rand = Math.random();
      if (rand < 0.12) { weeks[w] = "done"; }
      else if (rand < 0.20) { weeks[w] = "planned"; }
      else if (rand < 0.25) { weeks[w] = "pending"; resolved[w] = Math.random() > 0.5; }
      else if (rand < 0.28) { weeks[w] = "failure"; resolved[w] = Math.random() > 0.7; }
    }
    return { ...eci, weeks, resolved };
  });
}

export const statusLabels: Record<CellStatus, string> = {
  empty: "Sem inspeção",
  planned: "Planejada",
  done: "Conforme",
  pending: "Pendente",
  failure: "Com falha",
};

export const statusColors: Record<CellStatus, string> = {
  empty: "bg-muted/40",
  planned: "bg-info/50",
  done: "bg-success/70",
  pending: "bg-warning/60",
  failure: "bg-destructive/70",
};

export const criticidadeColors: Record<Criticidade, string> = {
  baixa: "bg-success/20 text-success border-success/30",
  media: "bg-warning/20 text-warning-foreground border-warning/30",
  alta: "bg-destructive/20 text-destructive border-destructive/30",
};

export const criticidadeLabels: Record<Criticidade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};
