import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  eciCatalog,
  criticidadeColors,
  criticidadeLabels,
} from "@/data/planejamentoMockData";

interface CadastrarInspecaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CadastrarInspecaoModal({ open, onOpenChange }: CadastrarInspecaoModalProps) {
  const [selectedEciId, setSelectedEciId] = useState("");
  const [eciSearchOpen, setEciSearchOpen] = useState(false);
  const [semana, setSemana] = useState("");
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("08:00");
  const [tempoEstimado, setTempoEstimado] = useState("1");
  const [observacoes, setObservacoes] = useState("");

  const selectedEci = useMemo(
    () => eciCatalog.find((e) => e.eciId === selectedEciId),
    [selectedEciId]
  );

  const resetForm = () => {
    setSelectedEciId("");
    setSemana("");
    setDia("");
    setHorario("08:00");
    setTempoEstimado("1");
    setObservacoes("");
  };

  const handleSave = () => {
    // Mock save
    onOpenChange(false);
    resetForm();
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Inspeção</DialogTitle>
          <DialogDescription>
            Planeje uma nova inspeção selecionando o ECI e a semana desejada.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* ECI Search */}
          <div>
            <Label className="text-sm font-medium">Pesquisar ECI</Label>
            <Popover open={eciSearchOpen} onOpenChange={setEciSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between mt-1 font-normal"
                >
                  {selectedEci
                    ? `${selectedEci.eciId} — ${selectedEci.eciName}`
                    : "Selecionar ECI..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-50" align="start">
                <Command>
                  <CommandInput placeholder="Buscar por TAG ou nome..." />
                  <CommandList>
                    <CommandEmpty>Nenhum ECI encontrado.</CommandEmpty>
                    <CommandGroup>
                      {eciCatalog.map((eci) => (
                        <CommandItem
                          key={eci.eciId}
                          value={`${eci.eciId} ${eci.eciName}`}
                          onSelect={() => {
                            setSelectedEciId(eci.eciId);
                            setEciSearchOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedEciId === eci.eciId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="text-muted-foreground mr-1">{eci.eciId}</span>
                          {eci.eciName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Auto-filled fields */}
          {selectedEci && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Input value={selectedEci.eciType} readOnly className="bg-muted/40 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Área</Label>
                <Input value={selectedEci.area} readOnly className="bg-muted/40 text-sm" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Criticidade</Label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={cn("text-xs border", criticidadeColors[selectedEci.criticidade])}
                  >
                    {criticidadeLabels[selectedEci.criticidade]}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tempo médio</Label>
                <Input value={`${selectedEci.tempoMedio}h`} readOnly className="bg-muted/40 text-sm" />
              </div>
            </div>
          )}

          {/* Semana */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Semana</Label>
              <Select value={semana} onValueChange={setSemana}>
                <SelectTrigger><SelectValue placeholder="S1...S52" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {Array.from({ length: 52 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>S{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dia (1–7)</Label>
              <Select value={dia} onValueChange={setDia}>
                <SelectTrigger><SelectValue placeholder="Dia" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <SelectItem key={d} value={String(d)}>Dia {d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Horário e Tempo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Horário Previsto</Label>
              <Input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
            </div>
            <div>
              <Label>Tempo Estimado (horas)</Label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={tempoEstimado}
                onChange={(e) => setTempoEstimado(e.target.value)}
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label>Observações</Label>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Notas adicionais..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Salvar Planejamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
