import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import WinWireLogo from '../../components/WinWireLogo';
import {
  LayoutDashboard, Users, FileText, Bot, CheckSquare, BarChart3,
  Settings, Bell, ChevronDown, Target, LogOut, User, Mail, DollarSign, 
  Brain, AlertTriangle, RefreshCw, Sparkles, Zap
} from 'lucide-react';

const activities = [
  { id: 1, message: "Reminder email sent to ABC Ltd.", time: "2 min ago", icon: Mail, color: "#003087" },
  { id: 2, message: "Payment received from XYZ Manufacturing ($85,000)", time: "18 min ago", icon: DollarSign, color: "#16a34a" },
  { id: 3, message: "AI flagged ABC Ltd. as critical risk (score: 95)", time: "34 min ago", icon: Brain, color: "#dc2626" },
  { id: 4, message: "Dataverse updated: 47 customer records synced", time: "1h 30m ago", icon: RefreshCw, color: "#8b5cf6" },
  { id: 5, message: "Escalation initiated for Northwind Logistics ($142.8K)", time: "2h ago", icon: AlertTriangle, color: "#f59e0b" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "collections", label: "Collections", icon: Target, path: "/collections" },
  { id: "customers", label: "Customers", icon: Users, path: "/customers" },
  { id: "invoices", label: "Invoices", icon: FileText, path: "/invoices" },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot, path: "/ai-assistant" },
  { id: "approvals", label: "Approvals", icon: CheckSquare, path: "/approvals" },
  { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const displayName = account?.name || "Signed-in User";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Header */}
      <header className="bg-white border-b border-[#DDDDDD] h-14 flex items-center px-5 gap-4 z-40 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <WinWireLogo />
          <div className="w-px h-8 bg-[#DDDDDD] flex-shrink-0" />
          <div className="flex-shrink-0">
            <p
              className="text-black text-[18px] leading-none"
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400 }}
            >
              Collection Catalyst Agent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
                className="relative w-8 h-8 rounded-[6px] hover:bg-[#F3F6FB] flex items-center justify-center transition-colors"
              >
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-[6px] border border-[#DDDDDD] shadow-lg z-50">
                  <div className="px-3 py-2.5 border-b border-[#E5E7EB] flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <span className="text-[11px] text-[#003087] font-medium cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-72 overflow-auto">
                    {activities.map((a) => {
                      const Icon = a.icon;
                      return (
                        <div key={a.id} className="px-3 py-2.5 hover:bg-[#F5F9FF] border-b border-[#E5E7EB] last:border-0 cursor-pointer flex gap-2.5">
                          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${a.color}15` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-700 leading-snug">{a.message}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-[6px] hover:bg-[#F3F6FB] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-none">{displayName}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-[6px] border border-[#DDDDDD] shadow-lg z-50 p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F9FF] rounded-[4px]">
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F9FF] rounded-[4px]">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t border-[#E5E7EB] my-1" />
                  <button
                    onClick={() => instance.logoutRedirect()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-[4px]"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-[#DDDDDD] flex flex-col flex-shrink-0 overflow-hidden">
          <nav className="flex-1 overflow-y-auto py-3 px-2">
            <div className="space-y-0.5">
              {navItems.map(({ id, label, icon: Icon, badge, path }: any) => {
                const active = isActive(path);
                
                return (
                  <Link
                    key={id}
                    to={path}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[13px] transition-colors ${
                      active
                        ? "bg-[rgba(0,48,135,0.08)] text-[#003087] font-semibold"
                        : "text-gray-600 hover:bg-[#F3F6FB] hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#003087]" : "text-gray-500"}`} />
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        active ? "bg-[#003087] text-white" : "bg-gray-100 text-gray-600"
                      }`}>{badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
