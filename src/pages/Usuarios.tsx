import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Eye, Users, Shield, UserCheck } from "lucide-react";

type Perfil = "Administrador" | "Gestor" | "Inspetor" | "Visualizador";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  area: string;
  status: "Ativo" | "Inativo";
  ultimoAcesso: string;
}

const mockUsuarios: Usuario[] = [
  { id: "1", nome: "Carlos Silva", email: "carlos.silva@empresa.com", perfil: "Administrador", area: "Todas", status: "Ativo", ultimoAcesso: "2025-03-01" },
  { id: "2", nome: "Ana Souza", email: "ana.souza@empresa.com", perfil: "Gestor", area: "Bloco A / Bloco B", status: "Ativo", ultimoAcesso: "2025-03-01" },
  { id: "3", nome: "Pedro Lima", email: "pedro.lima@empresa.com", perfil: "Inspetor", area: "Bloco A", status: "Ativo", ultimoAcesso: "2025-02-28" },
  { id: "4", nome: "Roberto Alves", email: "roberto.alves@empresa.com", perfil: "Inspetor", area: "Bloco C", status: "Ativo", ultimoAcesso: "2025-02-27" },
  { id: "5", nome: "Maria Costa", email: "maria.costa@empresa.com", perfil: "Inspetor", area: "Estacionamento / Refeitório", status: "Ativo", ultimoAcesso: "2025-02-25" },
  { id: "6", nome: "João Santos", email: "joao.santos@empresa.com", perfil: "Inspetor", area: "Subestação / Estacionamento", status: "Inativo", ultimoAcesso: "2025-01-15" },
  { id: "7", nome: "Fernanda Dias", email: "fernanda.dias@empresa.com", perfil: "Visualizador", area: "Todas", status: "Ativo", ultimoAcesso: "2025-02-20" },
  { id: "8", nome: "Lucas Mendes", email: "lucas.mendes@empresa.com", perfil: "Gestor", area: "Bloco C", status: "Ativo", ultimoAcesso: "2025-03-01" },
];

const perfilColors: Record<Perfil, string> = {
  Administrador: "bg-primary text-primary-foreground",
  Gestor: "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))]",
  Inspetor: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
  Visualizador: "bg-muted text-muted-foreground",
};

const perfilOptions: Perfil[] = ["Administrador", "Gestor", "Inspetor", "Visualizador"];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [search, setSearch] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<Usuario | null>(null);
  const [deleteUser, setDeleteUser] = useState<Usuario | null>(null);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", perfil: "" as Perfil, area: "", status: "Ativo" as "Ativo" | "Inativo" });

  const filtered = usuarios.filter((u) => {
    const matchSearch = u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchPerfil = filterPerfil === "all" || u.perfil === filterPerfil;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchPerfil && matchStatus;
  });

  const openNew = () => {
    setEditUser(null);
    setForm({ nome: "", email: "", perfil: "" as Perfil, area: "", status: "Ativo" });
    setModalOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditUser(u);
    setForm({ nome: u.nome, email: u.email, perfil: u.perfil, area: u.area, status: u.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.email || !form.perfil) return;
    if (editUser) {
      setUsuarios((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...form } : u)));
    } else {
      setUsuarios((prev) => [...prev, { id: Date.now().toString(), ...form, ultimoAcesso: "—" }]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteUser) {
      setUsuarios((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    }
  };

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const ativos = usuarios.filter((u) => u.status === "Ativo").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
            <p className="text-sm text-muted-foreground">Gerencie os usuários e permissões do sistema</p>
          </div>
          <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-foreground">{usuarios.length}</p><p className="text-xs text-muted-foreground">Total de Usuários</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--success))]/10 flex items-center justify-center"><UserCheck className="w-5 h-5 text-[hsl(var(--success))]" /></div>
              <div><p className="text-2xl font-bold text-foreground">{ativos}</p><p className="text-xs text-muted-foreground">Ativos</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--info))]/10 flex items-center justify-center"><Shield className="w-5 h-5 text-[hsl(var(--info))]" /></div>
              <div><p className="text-2xl font-bold text-foreground">{usuarios.filter((u) => u.perfil === "Administrador").length}</p><p className="text-xs text-muted-foreground">Administradores</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterPerfil} onValueChange={setFilterPerfil}>
                <SelectTrigger className="w-[170px]"><SelectValue placeholder="Perfil" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Perfis</SelectItem>
                  {perfilOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
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
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials(u.nome)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge className={perfilColors[u.perfil]}>{u.perfil}</Badge></TableCell>
                    <TableCell className="text-sm">{u.area}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={u.status === "Ativo" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground"}>{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.ultimoAcesso !== "—" ? new Date(u.ultimoAcesso).toLocaleDateString("pt-BR") : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewUser(u)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteUser(u)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nome *</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div><Label>E-mail *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Perfil *</Label>
                <Select value={form.perfil} onValueChange={(v) => setForm({ ...form, perfil: v as Perfil })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{perfilOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Área</Label><Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Ex: Bloco A" /></div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Ativo" | "Inativo" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalhes do Usuário</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-4 mb-2">
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials(viewUser.nome)}</AvatarFallback></Avatar>
                <div><p className="font-semibold text-lg">{viewUser.nome}</p><p className="text-muted-foreground">{viewUser.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Perfil:</span> <Badge className={perfilColors[viewUser.perfil]}>{viewUser.perfil}</Badge></div>
                <div><span className="text-muted-foreground">Área:</span> <span className="font-semibold">{viewUser.area}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge className={viewUser.status === "Ativo" ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]" : "bg-muted text-muted-foreground"}>{viewUser.status}</Badge></div>
                <div><span className="text-muted-foreground">Último Acesso:</span> <span className="font-semibold">{viewUser.ultimoAcesso !== "—" ? new Date(viewUser.ultimoAcesso).toLocaleDateString("pt-BR") : "—"}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Excluir Usuário</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja excluir <strong>{deleteUser?.nome}</strong>? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
