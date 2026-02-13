import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const failures = [
  { tag: "EXT-0042", tipo: "Extintor", descricao: "Pressão abaixo do mínimo", data: "05/04/2026", area: "Bloco A" },
  { tag: "HID-0018", tipo: "Hidrante", descricao: "Vazamento na conexão", data: "04/04/2026", area: "Bloco C" },
  { tag: "ALR-0007", tipo: "Alarme de Incêndio", descricao: "Sensor inoperante", data: "03/04/2026", area: "Bloco B" },
  { tag: "EXT-0091", tipo: "Extintor", descricao: "Validade vencida", data: "02/04/2026", area: "Bloco D" },
  { tag: "BOM-0005", tipo: "Bomba de Incêndio", descricao: "Falha no acionamento", data: "01/04/2026", area: "Bloco A" },
];

export function RecentFailuresTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-card rounded-xl p-6 shadow-sm border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-card-foreground">
          Falhas Recentes
        </h3>
        <Button variant="outline" size="sm">Ver todas</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">TAG</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tipo de ECI</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Descrição</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Data</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Área</th>
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {failures.map((f) => (
              <tr key={f.tag} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2 font-mono font-medium text-card-foreground">{f.tag}</td>
                <td className="py-3 px-2 text-card-foreground">{f.tipo}</td>
                <td className="py-3 px-2 text-muted-foreground">{f.descricao}</td>
                <td className="py-3 px-2 text-muted-foreground">{f.data}</td>
                <td className="py-3 px-2 text-card-foreground">{f.area}</td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20">
                    Com falhas
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
