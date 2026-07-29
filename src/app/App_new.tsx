import { useState, useRef, useEffect } from "react";
import WinWireLogo from "../components/WinWireLogo";
import {
  LayoutDashboard, Users, FileText, Bot, Zap, CheckSquare, BarChart3,
  Settings, Bell, Search, TrendingUp, TrendingDown, DollarSign, Brain,
  AlertTriangle, Mail, CircleCheck, Target, ChevronDown, ChevronUp,
  MoreHorizontal, Filter, Download, RefreshCw, Check, X, Activity,
  Calendar, ArrowRight, Sparkles, Send, Mic, Paperclip, LogOut, User,
  Clock, Shield, Star, Globe, Cpu, Play, Pause, CircleX, Plus,
  Eye, Pencil, MessageSquare, CircleAlert, Info, ChevronRight,
  Building2, Phone, MapPin, CreditCard, FileBarChart, History,
  TrendingDown as TrendDown, AlertCircle, CheckCircle2, XCircle,
  ArrowLeft, Copy, ThumbsUp, ThumbsDown, Loader2, Zap as Lightning,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

// Collections Trend Data
const trendData = [
  { month: "Jan", collected: 385, target: 350, overdue: 42 },
  { month: "Feb", collected: 420, target: 380, overdue: 38 },
  { month: "Mar", collected: 398, target: 400, overdue: 45 },
  { month: "Apr", collected: 485, target: 420, overdue: 35 },
  { month: "May", collected: 512, target: 480, overdue: 29 },
  { month: "Jun", collected: 468, target: 500, overdue: 41 },
  { month: "Jul", collected: 245, target: 520, overdue: 67 },
];

// Aging Analysis Data
const agingData = [
  { bucket: "0-30 Days", amount: 1450, count: 165 },
  { bucket: "31-60 Days", amount: 985, count: 92 },
  { bucket: "61-90 Days", amount: 620, count: 48 },
  { bucket: "90+ Days", amount: 425, count: 24 },
];

// Risk Distribution Data
const riskDistributionData = [
  { name: "High Risk", value: 5, count: 5, color: "#dc2626" },
  { name: "Medium Risk", value: 4, count: 4, color: "#f59e0b" },
  { name: "Low Risk", value: 3, count: 3, color: "#16a34a" },
];

// Recent Activities
const recentActivitiesData = [
  { id: 1, message: "Reminder email sent to ABC Ltd.", time: "2 min ago", icon: Mail, color: "#003087" },
  { id: 2, message: "Payment received from XYZ Manufacturing ($85,000)", time: "18 min ago", icon: DollarSign, color: "#16a34a" },
  { id: 3, message: "AI flagged ABC Ltd. as critical risk (score: 95)", time: "34 min ago", icon: Brain, color: "#dc2626" },
  { id: 4, message: "Payment plan approved for Global Retail Inc.", time: "1h ago", icon: CircleCheck, color: "#16a34a" },
  { id: 5, message: "Dataverse updated: 47 customer records synced", time: "1h 30m ago", icon: RefreshCw, color: "#8b5cf6" },
  { id: 6, message: "Escalation initiated for Northwind Logistics", time: "2h ago", icon: AlertTriangle, color: "#f59e0b" },
  { id: 7, message: "AI recommendation generated for 5 high-risk customers", time: "2h 30m ago", icon: Sparkles, color: "#003087" },
  { id: 8, message: "Power Automate flow completed: 12 reminders queued", time: "3h ago", icon: Zap, color: "#8b5cf6" },
];

// Enhanced customer data with Dataverse fields
const customersData = [
  {
    id: "CUST-001",
    customer: "ABC Ltd.",
    initials: "AB",
    outstandingBalance: 312000,
    openInvoices: 5,
    oldestInvoiceDueDate: "May 20, 2024",
    lastPaymentDate: "Jun 15, 2024",
    lastPaymentAmount: 45000,
    paymentHistory: "Inconsistent - 2 late, 1 broken promise",
    collectionStatus: "Escalated",
    daysOverdue: 61,
    riskScore: 95,
    priority: "High",
    aiReason: "Multiple overdue invoices, inconsistent payment history, and two broken payment promises detected.",
    aiRecommendation: "Generate reminder email and propose a payment plan",
    owner: "Maria Torres",
    ownerInitials: "MT",
    email: "accounts@abcltd.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, New York, NY 10001",
    industry: "Manufacturing",
    creditLimit: 500000,
    avgPaymentDays: 68,
  },
  {
    id: "CUST-002",
    customer: "XYZ Manufacturing",
    initials: "XM",
    outstandingBalance: 245000,
    openInvoices: 4,
    oldestInvoiceDueDate: "May 30, 2024",
    lastPaymentDate: "Jul 10, 2024",
    lastPaymentAmount: 85000,
    paymentHistory: "Good - 90% on-time payments",
    collectionStatus: "Final Notice",
    daysOverdue: 51,
    riskScore: 91,
    priority: "High",
    aiReason: "High outstanding balance with aging invoices exceeding 50 days.",
    aiRecommendation: "Initiate immediate legal escalation",
    owner: "Maria Torres",
    ownerInitials: "MT",
    email: "billing@xyzmfg.com",
    phone: "+1 (555) 234-5678",
    address: "456 Industrial Pkwy, Chicago, IL 60601",
    industry: "Manufacturing",
    creditLimit: 400000,
    avgPaymentDays: 52,
  },
  {
    id: "CUST-003",
    customer: "Global Retail Inc.",
    initials: "GR",
    outstandingBalance: 178000,
    openInvoices: 3,
    oldestInvoiceDueDate: "Jun 10, 2024",
    lastPaymentDate: "Jun 25, 2024",
    lastPaymentAmount: 60000,
    paymentHistory: "Fair - Partial payments consistent",
    collectionStatus: "2nd Reminder",
    daysOverdue: 40,
    riskScore: 83,
    priority: "High",
    aiReason: "Shows consistent partial payments pattern. 87% recovery probability with structured plan.",
    aiRecommendation: "Propose 3-month installment payment plan",
    owner: "James Park",
    ownerInitials: "JP",
    email: "finance@globalretail.com",
    phone: "+1 (555) 345-6789",
    address: "789 Retail Plaza, Los Angeles, CA 90001",
    industry: "Retail",
    creditLimit: 350000,
    avgPaymentDays: 45,
  },
  {
    id: "CUST-004",
    customer: "Contoso Services",
    initials: "CS",
    outstandingBalance: 125000,
    openInvoices: 4,
    oldestInvoiceDueDate: "Jun 15, 2024",
    lastPaymentDate: "Jul 5, 2024",
    lastPaymentAmount: 40000,
    paymentHistory: "Good - Minor delays only",
    collectionStatus: "1st Reminder",
    daysOverdue: 35,
    riskScore: 78,
    priority: "Medium",
    aiReason: "Regular payer with recent 35-day delay. Cash flow issues suspected.",
    aiRecommendation: "Send friendly reminder and offer payment flexibility",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    email: "ar@contoso.com",
    phone: "+1 (555) 456-7890",
    address: "321 Service Dr, Dallas, TX 75201",
    industry: "Services",
    creditLimit: 250000,
    avgPaymentDays: 38,
  },
  {
    id: "CUST-005",
    customer: "Northwind Logistics",
    initials: "NL",
    outstandingBalance: 142800,
    openInvoices: 6,
    oldestInvoiceDueDate: "May 25, 2024",
    lastPaymentDate: "May 30, 2024",
    lastPaymentAmount: 35000,
    paymentHistory: "Poor - Frequent late payments",
    collectionStatus: "Final Notice",
    daysOverdue: 56,
    riskScore: 88,
    priority: "High",
    aiReason: "Frequent late payments with increasing delinquency pattern.",
    aiRecommendation: "Escalate to senior management and legal review",
    owner: "James Park",
    ownerInitials: "JP",
    email: "payables@northwind.com",
    phone: "+1 (555) 567-8901",
    address: "654 Logistics Way, Seattle, WA 98101",
    industry: "Logistics",
    creditLimit: 300000,
    avgPaymentDays: 72,
  },
];

// Navigation items
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "collections", label: "Collections", icon: Target, badge: 47 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot },
  { id: "approvals", label: "Approvals", icon: CheckSquare, badge: 8 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function riskColor(s: number) {
  if (s >= 80) return "#dc2626";
  if (s >= 60) return "#f59e0b";
  if (s >= 40) return "#2563eb";
  return "#16a34a";
}

function priorityStyle(p: string) {
  const m: Record<string, { bg: string; text: string }> = {
    Critical: { bg: "#fef2f2", text: "#dc2626" },
    High: { bg: "#fff7ed", text: "#ea580c" },
    Medium: { bg: "#fffbeb", text: "#d97706" },
    Low: { bg: "#f0fdf4", text: "#16a34a" },
  };
  return m[p] ?? { bg: "#f3f4f6", text: "#6b7280" };
}

function statusStyle(s: string) {
  const m: Record<string, { bg: string; text: string }> = {
    "Final Notice": { bg: "#fef2f2", text: "#dc2626" },
    Escalated: { bg: "#fdf4ff", text: "#9333ea" },
    "2nd Reminder": { bg: "#fff7ed", text: "#ea580c" },
    "1st Reminder": { bg: "#eff6ff", text: "#1d4ed8" },
    Paid: { bg: "#f0fdf4", text: "#16a34a" },
    Recent: { bg: "#f3f4f6", text: "#6b7280" },
  };
  return m[s] ?? { bg: "#f3f4f6", text: "#6b7280" };
}

function Badge({ label, style }: { label: string; style: { bg: string; text: string } }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {label}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#DDDDDD] rounded-[6px] shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-medium text-gray-800">{typeof p.value === "number" ? `$${p.value}K` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#DDDDDD] h-14 flex items-center px-5 gap-4 z-40 flex-shrink-0">
      <div className="flex items-center gap-3 flex-shrink-0">
        <WinWireLogo />
        <div className="w-px h-8 bg-[#DDDDDD] flex-shrink-0" />
        <div className="flex-shrink-0">
          <p className="text-[#003087] font-bold text-[8px] tracking-[0.18em] leading-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            COLLECTION
          </p>
          <p className="text-[#003087] font-bold text-[8px] tracking-[0.18em] leading-none mt-0.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            CATALYST AGENT
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            className="w-full h-9 pl-9 pr-4 bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#003087] focus:bg-white transition-colors"
            placeholder="Search customers, invoices, reminders…"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0fdf4] rounded-[6px] border border-[#bbf7d0]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#16a34a]">AI Active</span>
        </div>

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
                {recentActivitiesData.map((a) => {
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

        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1 rounded-[6px] hover:bg-[#F3F6FB] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center text-white text-xs font-bold">AM</div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 leading-none">Alex Mitchell</p>
              <p className="text-[10px] text-gray-500 mt-0.5">AR Manager</p>
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
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-[4px]">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Sidebar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (id: string) => void }) {
  return (
    <aside className="w-52 bg-white border-r border-[#DDDDDD] flex flex-col flex-shrink-0 overflow-hidden">
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#003087] text-white"
                    : "text-gray-700 hover:bg-[#F5F9FF] hover:text-[#003087]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-3 border-t border-[#DDDDDD]">
        <div className="bg-[#F8FAFC] rounded-[6px] p-3">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#003087]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#003087]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">AI Insights</p>
              <p className="text-[10px] text-gray-500 mt-0.5">5 new recommendations</p>
            </div>
          </div>
          <button className="w-full bg-[#003087] hover:bg-[#00256A] text-white text-xs font-medium px-3 py-1.5 rounded-[6px] transition-colors">
            View All
          </button>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 1: COLLECTIONS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function DashboardView({ onNavigateToCustomer }: { onNavigateToCustomer: (customerId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredCustomers = customersData.filter((c) => {
    const matchesSearch = c.customer.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || (filterRisk === "high" && c.riskScore >= 80) || (filterRisk === "medium" && c.riskScore >= 60 && c.riskScore < 80) || (filterRisk === "low" && c.riskScore < 60);
    const matchesPriority = filterPriority === "all" || c.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesRisk && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor collections performance, AI-driven risk prioritization, and customer worklists</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 rounded-[6px] border border-[#DDDDDD] bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="h-9 px-4 rounded-[6px] bg-[#003087] hover:bg-[#00256A] text-white text-sm font-medium flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sync Dataverse
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Outstanding Receivables", value: "$1.0M", trend: "up", change: "+8.2%", icon: DollarSign, color: "#003087" },
          { label: "Overdue Customers", value: "47", trend: "down", change: "-12%", icon: AlertTriangle, color: "#dc2626" },
          { label: "High-Risk Customers", value: "5", trend: "down", change: "-2", icon: Brain, color: "#ea580c" },
          { label: "Expected Cash Collection", value: "$385K", trend: "up", change: "+15%", icon: TrendingUp, color: "#16a34a" },
          { label: "Pending Approvals", value: "8", trend: "up", change: "+3", icon: CheckSquare, color: "#8b5cf6" },
          { label: "Reminders Sent Today", value: "23", trend: "up", change: "+5", icon: Mail, color: "#0066CC" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-[6px] border border-[#DDDDDD] p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-[6px] flex items-center justify-center" style={{ backgroundColor: `${kpi.color}15` }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <div className="flex items-center gap-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#16a34a]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-[#dc2626]" />
                )}
                <span className={`text-[10px] font-semibold ${kpi.trend === "up" ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* AI Risk Prioritization Section */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-[6px] border border-red-200 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-[6px] bg-red-600 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">AI Risk Prioritization</h2>
            <p className="text-sm text-gray-600 mt-0.5">Customers requiring immediate attention based on AI analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {customersData.filter(c => c.riskScore >= 80).map((customer) => (
            <div key={customer.id} className="bg-white rounded-[6px] border border-red-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003087] flex items-center justify-center text-white text-sm font-bold">
                    {customer.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{customer.customer}</p>
                    <p className="text-xs text-gray-500">{customer.id}</p>
                  </div>
                </div>
                <Badge label={customer.priority} style={priorityStyle(customer.priority)} />
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Risk Score</p>
                  <p className="text-2xl font-bold" style={{ color: riskColor(customer.riskScore) }}>{customer.riskScore}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${customer.riskScore}%`, backgroundColor: riskColor(customer.riskScore) }} />
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-[6px] p-3 mb-3">
                <p className="text-xs font-semibold text-red-900 mb-1">AI Insight</p>
                <p className="text-xs text-red-700 leading-relaxed">{customer.aiReason}</p>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Recommended Action</p>
                  <p className="text-xs font-medium text-gray-900 mt-0.5">{customer.aiRecommendation}</p>
                </div>
                <button
                  onClick={() => onNavigateToCustomer(customer.id)}
                  className="h-8 px-3 rounded-[6px] bg-[#003087] hover:bg-[#00256A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collections Trend */}
        <div className="lg:col-span-2 bg-white rounded-[6px] border border-[#DDDDDD] p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Collections Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="collected" stroke="#003087" strokeWidth={2} name="Collected" />
              <Line type="monotone" dataKey="target" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              <Line type="monotone" dataKey="overdue" stroke="#dc2626" strokeWidth={2} name="Overdue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aging Analysis */}
        <div className="lg:col-span-3 bg-white rounded-[6px] border border-[#DDDDDD] p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Aging Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="amount" fill="#003087" name="Amount ($K)" />
              <Bar dataKey="count" fill="#0066CC" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Collection Worklist */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Customer Collection Worklist</h2>
              <p className="text-sm text-gray-500 mt-0.5">All customers with outstanding balances</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="h-9 px-3 rounded-[6px] border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:border-[#003087]"
              >
                <option value="all">All Risks</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="h-9 px-3 rounded-[6px] border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:border-[#003087]"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 pr-4 w-64 rounded-[6px] border border-[#DDDDDD] bg-white text-sm focus:outline-none focus:border-[#003087]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#E5E7EB]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Customer</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700">Outstanding</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Invoices</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Days Overdue</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Risk Score</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Priority</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Owner</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Status</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {customer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.customer}</p>
                        <p className="text-xs text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <p className="text-sm font-semibold text-gray-900">{fmtCurrency(customer.outstandingBalance)}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {customer.openInvoices}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm font-medium text-gray-900">{customer.daysOverdue}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${customer.riskScore}%`, backgroundColor: riskColor(customer.riskScore) }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ color: riskColor(customer.riskScore) }}>
                        {customer.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge label={customer.priority} style={priorityStyle(customer.priority)} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {customer.ownerInitials}
                      </div>
                      <span className="text-xs text-gray-700">{customer.owner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge label={customer.collectionStatus} style={statusStyle(customer.collectionStatus)} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => onNavigateToCustomer(customer.id)}
                      className="h-8 px-3 rounded-[6px] bg-[#003087] hover:bg-[#00256A] text-white text-xs font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">No customers found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivitiesData.slice(0, 6).map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${activity.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: activity.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 2: CUSTOMER COLLECTION WORKSPACE
// ═══════════════════════════════════════════════════════════════════════════

function CustomerWorkspaceView({ customerId, onBack }: { customerId: string; onBack: () => void }) {
  const customer = customersData.find((c) => c.id === customerId);
  
  if (!customer) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Customer not found</p>
        <button onClick={onBack} className="mt-4 text-[#003087] text-sm font-medium">← Back to Dashboard</button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; timestamp?: string }>>([
    { role: "assistant", content: `Hello! I'm your AI Collection Assistant. I can help you understand ${customer.customer}'s account, generate reminder emails, recommend payment plans, and more. How can I assist you today?`, timestamp: "Just now" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showReminderPreview, setShowReminderPreview] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [approvalStep, setApprovalStep] = useState<"none" | "reviewing" | "approved" | "sent">("none");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Activity timeline
  const [timeline, setTimeline] = useState([
    { id: 1, title: "Customer Selected", description: `Viewing ${customer.customer} collection workspace`, timestamp: "Just now", icon: Eye, status: "completed" },
  ]);

  // Suggested prompts
  const suggestedPrompts = [
    "Why is this customer high risk?",
    "Generate reminder email",
    "Recommend payment plan",
    "Summarize payment history",
    "Should this account be escalated?",
  ];

  // Mock invoice data for this customer
  const customerInvoices = [
    { id: "INV-2024-0301", amount: 85000, dueDate: "May 20, 2024", status: "Overdue", daysOverdue: 61 },
    { id: "INV-2024-0412", amount: 62000, dueDate: "Jun 1, 2024", status: "Overdue", daysOverdue: 49 },
    { id: "INV-2024-0523", amount: 58000, dueDate: "Jun 10, 2024", status: "Overdue", daysOverdue: 40 },
    { id: "INV-2024-0634", amount: 54000, dueDate: "Jun 18, 2024", status: "Overdue", daysOverdue: 32 },
    { id: "INV-2024-0745", amount: 53000, dueDate: "Jun 25, 2024", status: "Overdue", daysOverdue: 25 },
  ];

  // Mock communication history
  const communicationHistory = [
    { id: 1, type: "Email", subject: "Payment Reminder - Invoice #0301", date: "Jul 15, 2024", status: "Opened" },
    { id: 2, type: "Phone", subject: "Follow-up call with AR Manager", date: "Jul 10, 2024", status: "Completed" },
    { id: 3, type: "Email", subject: "2nd Payment Reminder", date: "Jul 5, 2024", status: "Opened" },
    { id: 4, type: "Email", subject: "1st Payment Reminder", date: "Jun 25, 2024", status: "Opened" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message, timestamp: "Just now" };
    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Add to timeline
    setTimeline((prev) => [
      ...prev,
      { id: prev.length + 1, title: "AI Query", description: message, timestamp: "Just now", icon: MessageSquare, status: "completed" },
    ]);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "";
      
      if (message.toLowerCase().includes("why") && message.toLowerCase().includes("risk")) {
        aiResponse = `${customer.customer} has a **High Risk Score of ${customer.riskScore}** because:\n\n• **5 overdue invoices** totaling $${(customer.outstandingBalance / 1000).toFixed(0)}K\n• Average payment delay of **${customer.avgPaymentDays} days**\n• **Two broken payment commitments** in the last 90 days\n• **Declining payment consistency** over the last 6 months\n• Industry sector showing signs of financial stress\n\nBased on historical payment behavior and current financial indicators, I recommend **immediate engagement** with a structured payment plan. The recovery probability is **78%** if actioned within the next 7 days.`;
        
        setTimeline((prev) => [
          ...prev,
          { id: prev.length + 1, title: "Risk Analysis Completed", description: "AI analyzed customer risk factors", timestamp: "Just now", icon: Brain, status: "completed" },
        ]);
      } else if (message.toLowerCase().includes("email") || message.toLowerCase().includes("reminder")) {
        aiResponse = "I've generated a professional reminder email based on the customer's risk profile and payment history. Would you like to review and approve it?";
        setShowReminderPreview(true);
        
        setTimeline((prev) => [
          ...prev,
          { id: prev.length + 1, title: "Reminder Draft Created", description: "AI-generated reminder email ready for review", timestamp: "Just now", icon: Mail, status: "completed" },
        ]);
      } else if (message.toLowerCase().includes("payment plan") || message.toLowerCase().includes("recommend")) {
        aiResponse = "Based on the customer's payment history and outstanding balance, I recommend a **3-month installment plan** with equal monthly payments of **$104K**. This plan has a **91% confidence** of successful recovery based on similar customer profiles. Would you like to see the full plan details?";
        setShowPaymentPlan(true);
        
        setTimeline((prev) => [
          ...prev,
          { id: prev.length + 1, title: "Payment Plan Generated", description: "AI recommended 3-month installment plan", timestamp: "Just now", icon: FileBarChart, status: "completed" },
        ]);
      } else if (message.toLowerCase().includes("history") || message.toLowerCase().includes("summarize")) {
        aiResponse = `**Payment History Summary for ${customer.customer}:**\n\n• **Payment Behavior:** ${customer.paymentHistory}\n• **Last Payment:** ${customer.lastPaymentDate} ($${(customer.lastPaymentAmount / 1000).toFixed(0)}K)\n• **Average Delay:** ${customer.avgPaymentDays} days\n• **Oldest Overdue:** ${customer.oldestInvoiceDueDate} (${customer.daysOverdue} days)\n• **Total Outstanding:** $${(customer.outstandingBalance / 1000).toFixed(0)}K across ${customer.openInvoices} invoices\n\n**Key Concerns:**\n• Payment consistency has declined in Q2 2024\n• Two payment promises were not honored\n• Growing balance trend indicates cash flow issues`;
      } else if (message.toLowerCase().includes("escalate") || message.toLowerCase().includes("escalation")) {
        aiResponse = `**Escalation Recommendation:**\n\nYes, I recommend escalating this account. Here's why:\n\n✓ Risk score of ${customer.riskScore} exceeds threshold (80)\n✓ ${customer.daysOverdue} days overdue surpasses policy limit (60 days)\n✓ Multiple collection attempts with no response\n✓ Broken payment commitments indicate non-cooperation\n\n**Recommended Actions:**\n1. Escalate to Senior AR Manager\n2. Initiate legal review\n3. Place account on credit hold\n4. Send final notice via certified mail\n\n**Confidence Level:** 94%`;
      } else {
        aiResponse = "I can help you with that. Please let me know if you'd like me to:\n\n• Analyze this customer's risk factors\n• Generate a reminder email\n• Recommend a payment plan\n• Summarize payment history\n• Assess escalation needs\n\nWhat would you like to explore?";
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse, timestamp: "Just now" }]);
    }, 1500);
  };

  const handleApproveAndSend = () => {
    setApprovalStep("reviewing");
    
    setTimeline((prev) => [
      ...prev,
      { id: prev.length + 1, title: "Manager Approval Requested", description: "Waiting for approval to send reminder", timestamp: "Just now", icon: CheckSquare, status: "in-progress" },
    ]);

    setTimeout(() => {
      setApprovalStep("approved");
      setTimeline((prev) =>
        prev.map((t) =>
          t.title === "Manager Approval Requested"
            ? { ...t, title: "Manager Approved", description: "Reminder email approved by Alex Mitchell", status: "completed" }
            : t
        )
      );
      
      setTimeout(() => {
        setApprovalStep("sent");
        setTimeline((prev) => [
          ...prev,
          { id: prev.length + 1, title: "Reminder Email Sent", description: `Email sent to ${customer.email}`, timestamp: "Just now", icon: Send, status: "completed" },
          { id: prev.length + 2, title: "Outlook Notification", description: "Reminder logged in Outlook Calendar", timestamp: "Just now", icon: Calendar, status: "completed" },
          { id: prev.length + 3, title: "Dataverse Updated Successfully", description: "Customer record synced to Dataverse", timestamp: "Just now", icon: RefreshCw, status: "completed" },
        ]);
        
        // Show success toast
        setTimeout(() => {
          alert("✓ Reminder email sent successfully!\n✓ Dataverse updated successfully!");
        }, 500);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#DDDDDD] p-5 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#003087] hover:text-[#00256A] font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#003087] flex items-center justify-center text-white text-2xl font-bold">
              {customer.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.customer}</h1>
              <p className="text-sm text-gray-500 mt-1">{customer.id} • {customer.industry}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{customer.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{customer.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Collection Owner</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-[10px] font-bold">
                  {customer.ownerInitials}
                </div>
                <span className="text-sm font-medium text-gray-900">{customer.owner}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-6 gap-4 mt-5">
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Outstanding Amount</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{fmtCurrency(customer.outstandingBalance)}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Open Invoices</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{customer.openInvoices}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Days Overdue</p>
            <p className="text-lg font-bold text-red-600 mt-1">{customer.daysOverdue}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Risk Score</p>
            <p className="text-lg font-bold mt-1" style={{ color: riskColor(customer.riskScore) }}>{customer.riskScore}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Priority</p>
            <div className="mt-1">
              <Badge label={customer.priority} style={priorityStyle(customer.priority)} />
            </div>
          </div>
          <div className="bg-[#F8FAFC] rounded-[6px] p-3">
            <p className="text-xs text-gray-500">Status</p>
            <div className="mt-1">
              <Badge label={customer.collectionStatus} style={statusStyle(customer.collectionStatus)} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#003087]" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{customer.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Industry</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{customer.industry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credit Limit</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{fmtCurrency(customer.creditLimit!)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Payment Days</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{customer.avgPaymentDays} days</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{customer.address}</p>
              </div>
            </div>
          </div>

          {/* Outstanding Invoices */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#003087]" />
                Outstanding Invoices
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Invoice ID</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Days Overdue</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {customerInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">{inv.id}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">{fmtCurrency(inv.amount)}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{inv.dueDate}</td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-sm font-medium text-red-600">{inv.daysOverdue}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Badge label={inv.status} style={statusStyle(inv.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Communication History */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-[#003087]" />
              Communication History
            </h3>
            <div className="space-y-3">
              {communicationHistory.map((comm) => (
                <div key={comm.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {comm.type === "Email" ? <Mail className="w-4 h-4 text-blue-600" /> : <Phone className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{comm.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{comm.type} • {comm.date}</p>
                  </div>
                  <Badge label={comm.status} style={statusStyle(comm.status)} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Payment Plan */}
          {showPaymentPlan && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[6px] border border-green-200 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-[6px] bg-green-600 flex items-center justify-center flex-shrink-0">
                  <FileBarChart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Recommended Payment Plan</h3>
                  <p className="text-sm text-gray-600 mt-0.5">AI-generated installment plan based on customer profile</p>
                </div>
              </div>
              
              <div className="bg-white rounded-[6px] border border-green-200 p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Plan Duration</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">3 Months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly Payment</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">$104K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Success Probability</p>
                    <p className="text-lg font-bold text-green-600 mt-1">91%</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Payment Schedule:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment 1 (Aug 20, 2024)</span>
                      <span className="font-semibold text-gray-900">$104,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment 2 (Sep 20, 2024)</span>
                      <span className="font-semibold text-gray-900">$104,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment 3 (Oct 20, 2024)</span>
                      <span className="font-semibold text-gray-900">$104,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 h-9 px-4 rounded-[6px] bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors">
                    Accept Plan
                  </button>
                  <button className="h-9 px-4 rounded-[6px] border border-[#DDDDDD] bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    Modify
                  </button>
                  <button className="h-9 px-4 rounded-[6px] border border-[#DDDDDD] bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dataverse Status Card */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#003087]" />
              Dataverse Sync Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Last Sync</p>
                <p className="text-sm font-medium text-gray-900 mt-1">Jul 21, 2024 9:15 AM</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Updated By</p>
                <p className="text-sm font-medium text-gray-900 mt-1">System (Auto)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sync Status</p>
                <div className="mt-1">
                  <Badge label="Synced" style={{ bg: "#f0fdf4", text: "#16a34a" }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Records Updated</p>
                <p className="text-sm font-medium text-gray-900 mt-1">12 fields</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#003087]" />
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === timeline.length - 1;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.status === "completed" ? "bg-green-100" :
                        item.status === "in-progress" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          item.status === "completed" ? "text-green-600" :
                          item.status === "in-progress" ? "text-blue-600" : "text-gray-400"
                        }`} />
                      </div>
                      {!isLast && <div className="w-px h-full bg-gray-200 my-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - AI Collection Assistant */}
        <div className="w-[480px] bg-white border-l border-[#DDDDDD] flex flex-col flex-shrink-0">
          <div className="bg-gradient-to-r from-[#003087] to-[#0066CC] px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">AI Collection Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs">Active & Ready</span>
              </div>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div className="p-4 border-b border-[#E5E7EB] flex-shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">Suggested Prompts:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-[6px] bg-[#F8FAFC] hover:bg-[#003087] hover:text-white border border-[#DDDDDD] text-xs font-medium text-gray-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" ? "bg-gray-300 text-white" : "bg-[#003087] text-white"
                }`}>
                  {msg.role === "user" ? "AM" : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block max-w-[85%] rounded-[6px] px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-[#003087] text-white"
                      : "bg-[#F8FAFC] border border-[#DDDDDD] text-gray-700"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#F8FAFC] border border-[#DDDDDD] rounded-[6px] px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Reminder Email Preview */}
          {showReminderPreview && (
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex-shrink-0">
              <div className="bg-white rounded-[6px] border border-[#DDDDDD] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">Reminder Email Preview</h4>
                  <button onClick={() => setShowReminderPreview(false)}>
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Subject</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">Payment Reminder - Outstanding Balance $312K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tone</p>
                    <Badge label="Professional" style={{ bg: "#eff6ff", text: "#1d4ed8" }} />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-[6px] p-3 text-xs text-gray-700 leading-relaxed mb-3 max-h-32 overflow-y-auto">
                  Dear Accounts Payable Team,<br /><br />
                  We hope this message finds you well. We are writing to remind you of the outstanding balance of $312,000 on your account with 5 invoices currently overdue.<br /><br />
                  The oldest invoice (#INV-2024-0301) is now 61 days past due. We value our business relationship and would appreciate your prompt attention to this matter.<br /><br />
                  If you have already processed payment, please disregard this notice. Otherwise, please contact us to discuss payment arrangements.<br /><br />
                  Best regards,<br />
                  {customer.owner}<br />
                  AR Collection Team
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleApproveAndSend}
                    disabled={approvalStep !== "none"}
                    className="flex-1 h-9 px-4 rounded-[6px] bg-[#003087] hover:bg-[#00256A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {approvalStep === "none" && (
                      <>
                        <Send className="w-4 h-4" />
                        Approve & Send
                      </>
                    )}
                    {approvalStep === "reviewing" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Requesting Approval...
                      </>
                    )}
                    {approvalStep === "approved" && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    )}
                    {approvalStep === "sent" && (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Sent Successfully!
                      </>
                    )}
                  </button>
                  <button className="h-9 px-4 rounded-[6px] border border-[#DDDDDD] bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t border-[#E5E7EB] flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                placeholder="Ask AI anything about this customer..."
                className="flex-1 h-10 px-4 rounded-[6px] border border-[#DDDDDD] text-sm focus:outline-none focus:border-[#003087] transition-colors"
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                className="w-10 h-10 rounded-[6px] bg-[#003087] hover:bg-[#00256A] flex items-center justify-center text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PLACEHOLDER VIEW
// ═══════════════════════════════════════════════════════════════════════════

function PlaceholderView({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{label}</h1>
      <p className="text-sm text-gray-500">This is a placeholder page. Full functionality coming soon.</p>
      <div className="mt-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-4">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">No content available</p>
        <p className="text-xs text-gray-500 mt-1">This page is under development</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const handleNavigateToCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveNav("customer-workspace");
  };

  const handleBackToDashboard = () => {
    setSelectedCustomerId(null);
    setActiveNav("dashboard");
  };

  const renderContent = () => {
    if (activeNav === "customer-workspace" && selectedCustomerId) {
      return <CustomerWorkspaceView customerId={selectedCustomerId} onBack={handleBackToDashboard} />;
    }

    switch (activeNav) {
      case "dashboard":
        return <DashboardView onNavigateToCustomer={handleNavigateToCustomer} />;
      case "collections":
        return <PlaceholderView label="Collections" icon={Target} />;
      case "customers":
        return <PlaceholderView label="Customers" icon={Users} />;
      case "invoices":
        return <PlaceholderView label="Invoices" icon={FileText} />;
      case "ai-assistant":
        return <PlaceholderView label="AI Assistant" icon={Bot} />;
      case "approvals":
        return <PlaceholderView label="Approvals" icon={CheckSquare} />;
      case "reports":
        return <PlaceholderView label="Reports" icon={BarChart3} />;
      case "settings":
        return <PlaceholderView label="Settings" icon={Settings} />;
      default:
        return <DashboardView onNavigateToCustomer={handleNavigateToCustomer} />;
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
