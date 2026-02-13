import {
  FireExtinguisher,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiCard } from "@/components/KpiCard";
import { ConformityBar } from "@/components/ConformityBar";
import { PeriodSelector } from "@/components/PeriodSelector";
import { InspectionChart } from "@/components/InspectionChart";
import { HoursChart } from "@/components/HoursChart";
import { EciDistributionChart } from "@/components/EciDistributionChart";
import { RecentFailuresTable } from "@/components/RecentFailuresTable";
import { CriticalAreasTable } from "@/components/CriticalAreasTable";
import { EciRiskChart } from "@/components/EciRiskChart";
import { TeamPerformance } from "@/components/TeamPerformance";

const Index = () => {
  const totalEcis = 352;
  const realizadas = 308;
  const pendencias = 21;
  const falhas = 9;
  const conformidade = Math.round((realizadas / totalEcis) * 100);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral das inspeções de ECIs
          </p>
        </div>
        <PeriodSelector />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard
          title="Total de ECIs"
          value={totalEcis}
          icon={FireExtinguisher}
          iconBgClass="bg-primary/10"
          iconColorClass="text-primary"
          delay={0}
        />
        <KpiCard
          title="Inspeções Realizadas"
          value={realizadas}
          icon={CheckCircle2}
          iconBgClass="bg-success/10"
          iconColorClass="text-success"
          delay={0.05}
        />
        <KpiCard
          title="Com Pendências"
          value={pendencias}
          icon={AlertTriangle}
          iconBgClass="bg-warning/10"
          iconColorClass="text-warning"
          delay={0.1}
        />
        <KpiCard
          title="Com Falhas"
          value={falhas}
          icon={XCircle}
          iconBgClass="bg-destructive/10"
          iconColorClass="text-destructive"
          delay={0.15}
        />
        <KpiCard
          title="Taxa de Conformidade"
          value={`${conformidade}%`}
          icon={ShieldCheck}
          iconBgClass="bg-success/10"
          iconColorClass="text-success"
          delay={0.2}
        >
          <ConformityBar percentage={conformidade} />
        </KpiCard>
        <KpiCard
          title="Horas Plan. x Exec."
          value="120h"
          subtitle="104h executadas"
          icon={Clock}
          iconBgClass="bg-info/10"
          iconColorClass="text-info"
          delay={0.25}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InspectionChart />
        <HoursChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EciDistributionChart />
        <RecentFailuresTable />
      </div>

      {/* Strategic Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CriticalAreasTable />
        <EciRiskChart />
      </div>
      <div className="mb-6">
        <TeamPerformance />
      </div>
    </DashboardLayout>
  );
};

export default Index;
