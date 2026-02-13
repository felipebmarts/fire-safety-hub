import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { generateMockData } from "@/data/planejamentoMockData";
import { WeekMap } from "@/components/planejamento/WeekMap";
import { WeekDetail } from "@/components/planejamento/WeekDetail";
import { CadastrarInspecaoModal } from "@/components/planejamento/CadastrarInspecaoModal";

const Planejamento = () => {
  const [year, setYear] = useState("2025");
  const [areaFilter, setAreaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allData = useMemo(() => generateMockData(), []);

  const filteredData = useMemo(() => {
    return allData.filter((eci) => {
      if (areaFilter !== "all" && eci.area.toLowerCase() !== areaFilter) return false;
      if (typeFilter !== "all" && eci.eciType.toLowerCase().replace(/ /g, "-") !== typeFilter) return false;
      if (statusFilter !== "all") {
        const hasStatus = Object.values(eci.weeks).some((s) => s === statusFilter);
        if (!hasStatus) return false;
      }
      return true;
    });
  }, [allData, areaFilter, typeFilter, statusFilter]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Topbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-foreground">Planejamento Anual</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["2025", "2026", "2027"].map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Área" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Áreas</SelectItem>
                <SelectItem value="bloco a">Bloco A</SelectItem>
                <SelectItem value="bloco b">Bloco B</SelectItem>
                <SelectItem value="laboratório">Laboratório</SelectItem>
                <SelectItem value="pátio">Pátio</SelectItem>
                <SelectItem value="galpão">Galpão</SelectItem>
                <SelectItem value="doca">Doca</SelectItem>
                <SelectItem value="refeitório">Refeitório</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tipo de ECI" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="extintor">Extintor</SelectItem>
                <SelectItem value="hidrante">Hidrante</SelectItem>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="bomba-de-incêndio">Bomba de Incêndio</SelectItem>
                <SelectItem value="chuveiro-lava-olhos">Chuveiro Lava-Olhos</SelectItem>
                <SelectItem value="alarme-de-incêndio">Alarme de Incêndio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="planned">Planejada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failure">Com falha</SelectItem>
                <SelectItem value="done">Conforme</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" /> Cadastrar Inspeção
            </Button>
          </div>
        </div>

        {/* Map */}
        <WeekMap
          data={filteredData}
          year={year}
          selectedWeek={selectedWeek}
          onSelectWeek={setSelectedWeek}
        />

        {/* Week Detail */}
        {selectedWeek && (
          <div className="mt-4 flex-shrink-0">
            <WeekDetail week={selectedWeek} data={filteredData} />
          </div>
        )}
      </div>

      <CadastrarInspecaoModal open={modalOpen} onOpenChange={setModalOpen} />
    </DashboardLayout>
  );
};

export default Planejamento;
