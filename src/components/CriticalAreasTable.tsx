import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const areasData = [
  { area: "Caldeiraria", totalEcis: 48, falhas: 7, taxa: 14.6 },
  { area: "Subestação Elétrica", totalEcis: 32, falhas: 4, taxa: 12.5 },
  { area: "Almoxarifado", totalEcis: 40, falhas: 4, taxa: 10.0 },
  { area: "Linha de Produção A", totalEcis: 56, falhas: 3, taxa: 5.4 },
  { area: "Refeitório", totalEcis: 24, falhas: 1, taxa: 4.2 },
  { area: "Expedição", totalEcis: 36, falhas: 1, taxa: 2.8 },
  { area: "Administrativo", totalEcis: 28, falhas: 0, taxa: 0.0 },
].sort((a, b) => b.taxa - a.taxa);

export function CriticalAreasTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Áreas Mais Críticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead className="text-center">Total ECIs</TableHead>
                <TableHead className="text-center">Total Falhas</TableHead>
                <TableHead className="text-center">Taxa de Falha</TableHead>
                <TableHead className="w-[140px]">Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areasData.map((item) => {
                const isCritical = item.taxa > 10;
                return (
                  <TableRow key={item.area}>
                    <TableCell
                      className={`font-medium ${isCritical ? "text-destructive" : "text-foreground"}`}
                    >
                      {item.area}
                    </TableCell>
                    <TableCell className="text-center">{item.totalEcis}</TableCell>
                    <TableCell className="text-center font-semibold">
                      <span className={isCritical ? "text-destructive" : ""}>
                        {item.falhas}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isCritical
                            ? "bg-destructive/10 text-destructive"
                            : item.taxa > 5
                              ? "bg-warning/10 text-warning"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {item.taxa.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCritical
                              ? "bg-destructive"
                              : item.taxa > 5
                                ? "bg-warning"
                                : "bg-success"
                          }`}
                          style={{ width: `${Math.min(item.taxa * 4, 100)}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
