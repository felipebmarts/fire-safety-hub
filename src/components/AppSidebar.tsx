import { useLocation, Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  CalendarClock,
  PackagePlus,
  MapPin,
  ClipboardCheck,
  FileBarChart2,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import safeinspLogo from "@/assets/safeinsp-logo.png";

const menuItems = [
  { title: "Homepage", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Planejamento", url: "/planejamento", icon: CalendarClock },
  { title: "Cadastro de ECI", url: "/cadastro-eci", icon: PackagePlus },
  { title: "Áreas", url: "/areas", icon: MapPin },
  { title: "Inspeções", url: "/inspecoes", icon: ClipboardCheck },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart2 },
  { title: "Usuários", url: "/usuarios", icon: Users },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sidebar-gradient fixed left-0 top-0 bottom-0 flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header with logo and toggle */}
      <div className="flex items-center justify-between px-4 py-6">
        {!collapsed && (
          <img src={safeinspLogo} alt="SafeInsp" className="h-8 object-contain" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sidebar-foreground hover:bg-white/10 transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              title={item.title}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-sidebar-foreground shadow-sm backdrop-blur-sm"
                  : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-6">
        <button
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground transition-all duration-200 w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
