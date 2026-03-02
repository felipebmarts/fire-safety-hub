import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { eciCatalog, criticidadeColors, criticidadeLabels, type Criticidade } from "@/data/planejamentoMockData";
import { useToast } from "@/hooks/use-toast";

interface EciRecord {
  eciId: string;
  eciName: string;
  eciType: string;
  area: string;
  criticidade: Criticidade;
  tempoMedio: number;
  localizacao?: string;
  fabricante?: string;
  modelo?: string;
  capacidade?: string;
  dataValidade?: string;
  observacoes?: string;
}

const eciTypes = [
  "Extintor",
  "Hidrante",
  "Container",
  "Bomba de Incêndio",
  "Chuveiro Lava-Olhos",
  "Alarme de Incêndio",
  "Detector de Fumaça",
  "Sprinkler",
  "Porta Corta-Fogo",
  "Iluminação de Emergência",
];

const areas = [
  "Bloco A",
  "Bloco B",
  "Laboratório",
  "Pátio",
  "Galpão",
  "Doca",
  "Refeitório",
  "Casa Máq.",
  "Recepção",
  "Almoxarifado",
];

const emptyForm: Omit<EciRecord, "eciId"> = {
  eciName: "",
  eciType: "",
  area: "",
  criticidade: "media",
  tempoMedio: 0.5,
  localizacao: "",
  fabricante: "",
  modelo: "",
  capacidade: "",
  dataValidade: "",
  observacoes: "",
};

const CadastroEci = () => {
  const { toast } = useToast();
  const [ecis, setEcis] = useState<EciRecord[]>(
    eciCatalog.map((e) => ({ ...e, localizacao: "", fabricante: "", modelo: "", capacidade: "", dataValidade: "", observacoes: "" }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState<EciRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<EciRecord | null>(null);
  const [editingEci, setEditingEci] = useState<EciRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [filterCriticidade, setFilterCriticidade] = useState("all");

  const filteredEcis = ecis.filter((eci) => {
    const matchSearch =
      searchTerm === "" ||
      eci.eciId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eci.eciName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || eci.eciType === filterType;
    const matchArea = filterArea === "all" || eci.area === filterArea;
    const matchCrit = filterCriticidade === "all" || eci.criticidade === filterCriticidade;
    return matchSearch && matchType && matchArea && matchCrit;
  });

  const generateId = (type: string) => {
    const prefix = type.substring(0, 3).toUpperCase();
    const existing = ecis.filter((e) => e.eciId.startsWith(prefix));
    const nextNum = existing.length + 1;
    return `${prefix}-${String(nextNum).padStart(3, "0")}`;
  };

  const openNewModal = () => {
    setEditingEci(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (eci: EciRecord) => {
    setEditingEci(eci);
    setForm({
      eciName: eci.eciName,
      eciType: eci.eciType,
      area: eci.area,
      criticidade: eci.criticidade,
      tempoMedio: eci.tempoMedio,
      localizacao: eci.localizacao || "",
      fabricante: eci.fabricante || "",
      modelo: eci.modelo || "",
      capacidade: eci.capacidade || "",
      dataValidade: eci.dataValidade || "",
      observacoes: eci.observacoes || "",
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.eciName.trim() || !form.eciType || !form.area) {
      toast({ title: "Preencha os campos obrigatórios", description: "Nome, Tipo e Área são obrigatórios.", variant: "destructive" });
      return;
    }

    if (editingEci) {
      setEcis((prev) =>
        prev.map((e) => (e.eciId === editingEci.eciId ? { ...e, ...form } : e))
      );
      toast({ title: "ECI atualizado", description: `${editingEci.eciId} foi atualizado com sucesso.` });
    } else {
      const newId = generateId(form.eciType);
      setEcis((prev) => [...prev, { ...form, eciId: newId }]);
      toast({ title: "ECI cadastrado", description: `${newId} — ${form.eciName} cadastrado com sucesso.` });
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingEci(null);
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    setEcis((prev) => prev.filter((e) => e.eciId !== deleteModal.eciId));
    toast({ title: "ECI removido", description: `${deleteModal.eciId} foi removido.` });
    setDeleteModal(null);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">Cadastro de ECI</h1>
          <Button onClick={openNewModal} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Novo ECI
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por TAG ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {eciTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Áreas</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCriticidade} onValueChange={setFilterCriticidade}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Criticidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">{filteredEcis.length}</strong> ECIs encontrados</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            Alta: {filteredEcis.filter((e) => e.criticidade === "alta").length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            Média: {filteredEcis.filter((e) => e.criticidade === "media").length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
            Baixa: {filteredEcis.filter((e) => e.criticidade === "baixa").length}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">TAG</TableHead>
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Área</TableHead>
                <TableHead className="font-semibold">Criticidade</TableHead>
                <TableHead className="font-semibold">Tempo Médio</TableHead>
                <TableHead className="font-semibold text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEcis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhum ECI encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEcis.map((eci) => (
                  <TableRow key={eci.eciId} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-semibold text-primary">{eci.eciId}</TableCell>
                    <TableCell className="font-medium">{eci.eciName}</TableCell>
                    <TableCell>{eci.eciType}</TableCell>
                    <TableCell>{eci.area}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={criticidadeColors[eci.criticidade]}>
                        {criticidadeLabels[eci.criticidade]}
                      </Badge>
                    </TableCell>
                    <TableCell>{eci.tempoMedio}h</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewModal(eci)} title="Ver detalhes">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(eci)} title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteModal(eci)} title="Excluir" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Cadastro/Edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEci ? "Editar ECI" : "Cadastrar Novo ECI"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nome do ECI *</Label>
              <Input
                placeholder="Ex: Extintor PQS 6kg"
                value={form.eciName}
                onChange={(e) => setForm({ ...form, eciName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de ECI *</Label>
              <Select value={form.eciType} onValueChange={(v) => setForm({ ...form, eciType: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {eciTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Área *</Label>
              <Select value={form.area} onValueChange={(v) => setForm({ ...form, area: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione a área" /></SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Criticidade *</Label>
              <Select value={form.criticidade} onValueChange={(v) => setForm({ ...form, criticidade: v as Criticidade })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tempo Médio de Inspeção (h)</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={form.tempoMedio}
                onChange={(e) => setForm({ ...form, tempoMedio: parseFloat(e.target.value) || 0.5 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <Input
                placeholder="Ex: 2º andar, sala 201"
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fabricante</Label>
              <Input
                placeholder="Ex: Kidde"
                value={form.fabricante}
                onChange={(e) => setForm({ ...form, fabricante: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Input
                placeholder="Ex: ABC-123"
                value={form.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidade</Label>
              <Input
                placeholder="Ex: 6kg, 10L"
                value={form.capacidade}
                onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Validade</Label>
              <Input
                type="date"
                value={form.dataValidade}
                onChange={(e) => setForm({ ...form, dataValidade: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Observações</Label>
              <Textarea
                placeholder="Informações adicionais sobre o equipamento..."
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              {editingEci ? "Salvar Alterações" : "Cadastrar ECI"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar */}
      <Dialog open={!!viewModal} onOpenChange={() => setViewModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do ECI</DialogTitle>
          </DialogHeader>
          {viewModal && (
            <div className="grid grid-cols-2 gap-3 py-4 text-sm">
              <div><span className="text-muted-foreground">TAG:</span> <strong className="text-primary font-mono">{viewModal.eciId}</strong></div>
              <div><span className="text-muted-foreground">Nome:</span> <strong>{viewModal.eciName}</strong></div>
              <div><span className="text-muted-foreground">Tipo:</span> {viewModal.eciType}</div>
              <div><span className="text-muted-foreground">Área:</span> {viewModal.area}</div>
              <div><span className="text-muted-foreground">Criticidade:</span> <Badge variant="outline" className={criticidadeColors[viewModal.criticidade]}>{criticidadeLabels[viewModal.criticidade]}</Badge></div>
              <div><span className="text-muted-foreground">Tempo Médio:</span> {viewModal.tempoMedio}h</div>
              {viewModal.localizacao && <div className="col-span-2"><span className="text-muted-foreground">Localização:</span> {viewModal.localizacao}</div>}
              {viewModal.fabricante && <div><span className="text-muted-foreground">Fabricante:</span> {viewModal.fabricante}</div>}
              {viewModal.modelo && <div><span className="text-muted-foreground">Modelo:</span> {viewModal.modelo}</div>}
              {viewModal.capacidade && <div><span className="text-muted-foreground">Capacidade:</span> {viewModal.capacidade}</div>}
              {viewModal.dataValidade && <div><span className="text-muted-foreground">Validade:</span> {viewModal.dataValidade}</div>}
              {viewModal.observacoes && <div className="col-span-2"><span className="text-muted-foreground">Observações:</span> {viewModal.observacoes}</div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModal(null)}>Fechar</Button>
            <Button onClick={() => { if (viewModal) { openEditModal(viewModal); setViewModal(null); } }} className="bg-primary hover:bg-primary/90">
              <Pencil className="w-4 h-4 mr-1" /> Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Exclusão */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Tem certeza que deseja excluir o ECI <strong className="text-foreground">{deleteModal?.eciId} — {deleteModal?.eciName}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CadastroEci;
