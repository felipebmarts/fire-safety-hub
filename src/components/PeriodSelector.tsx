import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const weeks = [
  "Semana 01 a 07 de Abril",
  "Semana 08 a 14 de Abril",
  "Semana 15 a 21 de Abril",
  "Semana 22 a 28 de Abril",
];

export function PeriodSelector() {
  const [range, setRange] = useState([0, 3]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        <CalendarDays className="w-4 h-4" />
        <span className="text-sm font-medium">Período em análise (semanas)</span>
      </div>
      <div className="flex flex-col gap-1 min-w-[320px]">
        <Slider
          min={0}
          max={weeks.length - 1}
          step={1}
          value={range}
          onValueChange={(val) => setRange(val as number[])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{weeks[range[0]]?.replace("Semana ", "Sem. ")}</span>
          {range[0] !== range[1] && (
            <span>{weeks[range[1]]?.replace("Semana ", "Sem. ")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
