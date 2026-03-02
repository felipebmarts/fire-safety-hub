import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Eye, MapPin, Building2 } from "lucide-react";

interface Area {
  id: string;
  nome: string;
  codigo: string;
  tipo: string;
  responsavel: string;
  totalEcis: number;
  status: "Ativa" | "Inativa";
  descricao: string;
}

const mockAreas: Area[] = [
  { id: "1", nome: "Bloco A - Térreo", codigo: "BL-A-T", tipo: "Edificação", responsavel: "Carlos Silva", totalEcis: 12, status: "Ativa", descricao: "Área do térreo do Bloco A, incluindo recepção e salas comerciais." },
  { id: "2", nome: "Bloco A - 1º Andar", codigo: "BL-A-1", tipo: "Edificação", responsavel: "Carlos Silva", totalEcis: 8, status: "Ativa", descricao: "Primeiro andar do Bloco A com escritórios administrativos." },
  { id: "3", nome: "Bloco B - Térreo", codigo: "BL-B-T", tipo: "Edificação", responsavel: "Ana Souza", totalEcis: 15, status: "Ativa", descricao: "Área do térreo do Bloco B, estoque e logística." },
  { id: "4", nome: "Estacionamento", codigo: "EST-01", tipo: "Área Externa", responsavel: "Pedro Lima", totalEcis: 6, status: "Ativa", descricao: "Estacionamento coberto com 200 vagas." },
  { id: "5", nome: "Subestação Elétrica", codigo: "SUB-01", tipo: "Utilidades", responsavel: "João Santos", totalEcis: 4, status: "Ativa", descricao: "Subestação elétrica principal do complexo." },
  { id: "6", nome: "Depósito Norte", codigo: "DEP-N", tipo: "Armazenamento", responsavel: "Maria Costa", totalEcis: 10, status: "Inativa", descricao: "Depósito desativado para reforma." },
  { id: "7", nome: "Bloco C - Produção", codigo: "BL-C-P", tipo: "Industrial", responsavel: "Roberto Alves", totalEcis: 20, status: "Ativa", descricao: "Área de produção principal." },
  { id: "8", nome: "Refeitório", codigo: "REF-01", tipo: "Edificação", responsavel: "Ana Souza", totalEcis: 5, status: "Ativa", descricao: "Refeitório com capacidade para 300 pessoas." },
];

const tipoOptions = ["Edificação", "Área Externa", "Utilidades", "Armazenamento", "Industrial"];

export default function Areas() {
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState<Area | null>(null);
  const [deleteModal, setDeleteModal] = useState<Area | null>(null);
  const [editArea, setEditArea] = useState<Area | null>(null);
  const [form, setForm] = useState({ nome: "", codigo: "", tipo: "", responsavel: "", descricao: "", status: "Ativa" as "Ativa" | "Inativa" });

  const filtered = areas.filter((a) => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || a.codigo.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "all" || a.tipo === filterTipo;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const openNew = () => {
    setEditArea(null);
    setForm({ nome: "", codigo: "", tipo: "", responsavel: "", descricao: "", status: "Ativa" });
    setModalOpen(true);
  };

  const openEdit = (a: Area) => {
    setEditArea(a);
    setForm({ nome: a.nome, codigo: a.codigo, tipo: a.tipo, responsavel: a.responsavel, descricao: a.descricao, status: a.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.codigo || !form.tipo) return;
    if (editArea) {
      setAreas((prev) => prev.map((a) => (a.id === editArea.id ? { ...a, ...form } : a)));
    } else {
      const newArea: Area = { id: Date.now().toString(), ...form, totalEcis: 0 };
      setAreas((prev) => [...prev, newArea]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteModal) {
      setAreas((prev) => prev.filter((a) => a.id !== deleteModal.id));
      setDeleteModal(null);
    }
  };

  const ativas = areas.filter((a) => a.status === "Ativa").length;
  const totalEcis = areas.reduce((acc, a) => acc + a.totalEcis, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Áreas</h1>
            <p className="text-sm text-muted-foreground">Gerencie as áreas de inspeção do sistema</p>
          </div>
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Nova Área
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{areas.length}</p>
                <p className="text-xs text-muted-foreground">Total de Áreas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[hsl(var(--success))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ativas}</p>
                <p className="text-xs text-muted-foreground">Áreas Ativas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--info))]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[hsl(var(--info))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalEcis}</p>
                <p className="text-xs text-muted-foreground">ECIs Vinculados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou código..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {tipoOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Inativa">Inativa</SelectItem>
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-center">ECIs</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{a.codigo}</TableCell>
                    <TableCell className="font-medium">{a.nome}</TableCell>
                    <TableCell><Badge variant="outline">{a.tipo}</Badge></TableCell>
                    <TableCell>{a.responsavel}</TableCell>
                    <TableCell className="text-center">{a.totalEcis}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={a.status === "Ativa" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground"}>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewModal(a)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteModal(a)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma área encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editArea ? "Editar Área" : "Nova Área"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div><Label>Código *</Label><Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{tipoOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Responsável</Label><Input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} /></div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Ativa" | "Inativa" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Inativa">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewModal} onOpenChange={() => setViewModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhes da Área</DialogTitle></DialogHeader>
          {viewModal && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Código:</span> <span className="font-semibold">{viewModal.codigo}</span></div>
                <div><span className="text-muted-foreground">Nome:</span> <span className="font-semibold">{viewModal.nome}</span></div>
                <div><span className="text-muted-foreground">Tipo:</span> <span className="font-semibold">{viewModal.tipo}</span></div>
                <div><span className="text-muted-foreground">Responsável:</span> <span className="font-semibold">{viewModal.responsavel}</span></div>
                <div><span className="text-muted-foreground">ECIs Vinculados:</span> <span className="font-semibold">{viewModal.totalEcis}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge className={viewModal.status === "Ativa" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground"}>{viewModal.status}</Badge></div>
              </div>
              <div><span className="text-muted-foreground">Descrição:</span><p className="mt-1">{viewModal.descricao}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Excluir Área</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja excluir <strong>{deleteModal?.nome}</strong>? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
