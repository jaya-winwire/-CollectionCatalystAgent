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
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const trendData = [
  { month: "Feb", collected: 285, target: 300, overdue: 45 },
  { month: "Mar", collected: 320, target: 300, overdue: 38 },
  { month: "Apr", collected: 298, target: 320, overdue: 52 },
  { month: "May", collected: 415, target: 350, overdue: 29 },
  { month: "Jun", collected: 380, target: 360, overdue: 41 },
  { month: "Jul", collected: 128, target: 380, overdue: 67 },
];

const agingData = [
  { bucket: "0–30d", amount: 1250, count: 142 },
  { bucket: "31–60d", amount: 890, count: 87 },
  { bucket: "61–90d", amount: 520, count: 43 },
  { bucket: "90+d", amount: 340, count: 19 },
];

const cashForecast = [
  { day: "Jul 20", predicted: 45, actual: 42 },
  { day: "Jul 21", predicted: 62, actual: 58 },
  { day: "Jul 22", predicted: 38, actual: 35 },
  { day: "Jul 23", predicted: 71 },
  { day: "Jul 24", predicted: 55 },
  { day: "Jul 25", predicted: 83 },
  { day: "Jul 26", predicted: 47 },
];

const effectivenessData = [
  { name: "Opened", value: 68, color: "#003087" },
  { name: "Clicked", value: 41, color: "#0066CC" },
  { name: "Paid", value: 23, color: "#16a34a" },
  { name: "Ignored", value: 32, color: "#D1D5DB" },
];

// Risk distribution for donut chart
const riskDistributionData = [
  { name: "High Risk", value: 5, count: 5, color: "#dc2626" },
  { name: "Medium Risk", value: 4, count: 4, color: "#f59e0b" },
  { name: "Low Risk", value: 1, count: 1, color: "#16a34a" },
];

// Recent activities with more Dataverse events
const recentActivitiesData = [
  { id: 1, message: "Reminder email sent to ABC Ltd.", time: "2 min ago", icon: Mail, color: "#003087" },
  { id: 2, message: "Payment received from XYZ Manufacturing ($85,000)", time: "18 min ago", icon: DollarSign, color: "#16a34a" },
  { id: 3, message: "AI flagged ABC Ltd. as critical risk (score: 95)", time: "34 min ago", icon: Brain, color: "#dc2626" },
  { id: 4, message: "Payment plan approved for Global Retail Inc.", time: "1h ago", icon: CircleCheck, color: "#16a34a" },
  { id: 5, message: "Dataverse updated: 47 customer records synced", time: "1h 30m ago", icon: RefreshCw, color: "#8b5cf6" },
  { id: 6, message: "Escalation initiated for Northwind Logistics ($142.8K)", time: "2h ago", icon: AlertTriangle, color: "#f59e0b" },
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
    ownerInitials: "MT"
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
    ownerInitials: "MT"
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
    ownerInitials: "JP"
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
    ownerInitials: "SC"
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
    ownerInitials: "JP"
  },
  { 
    id: "CUST-006", 
    customer: "Apex Construction LLC", 
    initials: "AC",
    outstandingBalance: 89500,
    openInvoices: 2,
    oldestInvoiceDueDate: "Jun 22, 2024",
    lastPaymentDate: "Jul 12, 2024",
    lastPaymentAmount: 50000,
    paymentHistory: "Good - Mostly on-time",
    collectionStatus: "1st Reminder",
    daysOverdue: 28,
    riskScore: 62,
    priority: "Medium",
    aiReason: "Typically reliable payer with recent delay. Industry slowdown impact.",
    aiRecommendation: "Send automated reminder email",
    owner: "James Park",
    ownerInitials: "JP"
  },
  { 
    id: "CUST-007", 
    customer: "BlueSky Retail Group", 
    initials: "BR",
    outstandingBalance: 56700,
    openInvoices: 3,
    oldestInvoiceDueDate: "Jun 28, 2024",
    lastPaymentDate: "Jul 8, 2024",
    lastPaymentAmount: 25000,
    paymentHistory: "Good - Regular payments",
    collectionStatus: "1st Reminder",
    daysOverdue: 22,
    riskScore: 45,
    priority: "Low",
    aiReason: "Low risk with good payment history. Minor delay likely due to processing.",
    aiRecommendation: "Standard automated reminder",
    owner: "David Kim",
    ownerInitials: "DK"
  },
  { 
    id: "CUST-008", 
    customer: "Pinnacle Tech Solutions", 
    initials: "PT",
    outstandingBalance: 32000,
    openInvoices: 1,
    oldestInvoiceDueDate: "Jul 1, 2024",
    lastPaymentDate: "Jul 14, 2024",
    lastPaymentAmount: 30000,
    paymentHistory: "Excellent - Always on-time",
    collectionStatus: "Recent",
    daysOverdue: 19,
    riskScore: 34,
    priority: "Low",
    aiReason: "Excellent payment history. No action needed yet.",
    aiRecommendation: "Monitor only - send reminder at 30 days",
    owner: "Sarah Chen",
    ownerInitials: "SC"
  },
  { 
    id: "CUST-009", 
    customer: "Harbor Medical Center", 
    initials: "HM",
    outstandingBalance: 94200,
    openInvoices: 3,
    oldestInvoiceDueDate: "Jun 18, 2024",
    lastPaymentDate: "Jun 30, 2024",
    lastPaymentAmount: 45000,
    paymentHistory: "Fair - Occasional delays",
    collectionStatus: "1st Reminder",
    daysOverdue: 32,
    riskScore: 57,
    priority: "Medium",
    aiReason: "Moderate risk with occasional payment delays.",
    aiRecommendation: "Send reminder and follow up with phone call",
    owner: "David Kim",
    ownerInitials: "DK"
  },
  { 
    id: "CUST-010", 
    customer: "Pacific Ventures Ltd", 
    initials: "PV",
    outstandingBalance: 67300,
    openInvoices: 2,
    oldestInvoiceDueDate: "Jun 5, 2024",
    lastPaymentDate: "Jun 20, 2024",
    lastPaymentAmount: 35000,
    paymentHistory: "Good - Consistent payer",
    collectionStatus: "2nd Reminder",
    daysOverdue: 45,
    riskScore: 71,
    priority: "Medium",
    aiReason: "Good history but payment delay is increasing.",
    aiRecommendation: "Personal outreach recommended",
    owner: "Sarah Chen",
    ownerInitials: "SC"
  },
];

const invoicesData = [
  { id: "INV-2024-0891", customer: "Meridian Healthcare Group", initials: "MH", amount: 125000, dueDate: "Jun 15, 2024", daysOverdue: 35, riskScore: 78, priority: "High", status: "2nd Reminder", owner: "Sarah Chen", ownerInitials: "SC" },
  { id: "INV-2024-0756", customer: "Apex Construction LLC", initials: "AC", amount: 89500, dueDate: "Jun 22, 2024", daysOverdue: 28, riskScore: 62, priority: "Medium", status: "1st Reminder", owner: "James Park", ownerInitials: "JP" },
  { id: "INV-2024-0634", customer: "Northstar Logistics", initials: "NL", amount: 245000, dueDate: "May 30, 2024", daysOverdue: 51, riskScore: 91, priority: "Critical", status: "Final Notice", owner: "Maria Torres", ownerInitials: "MT" },
  { id: "INV-2024-0812", customer: "Pinnacle Tech Solutions", initials: "PT", amount: 32000, dueDate: "Jul 1, 2024", daysOverdue: 19, riskScore: 34, priority: "Low", status: "1st Reminder", owner: "Sarah Chen", ownerInitials: "SC" },
  { id: "INV-2024-0923", customer: "Crestview Financial", initials: "CF", amount: 178000, dueDate: "Jun 10, 2024", daysOverdue: 40, riskScore: 83, priority: "High", status: "Escalated", owner: "James Park", ownerInitials: "JP" },
  { id: "INV-2024-0445", customer: "BlueSky Retail Group", initials: "BR", amount: 56700, dueDate: "Jun 28, 2024", daysOverdue: 22, riskScore: 45, priority: "Medium", status: "2nd Reminder", owner: "David Kim", ownerInitials: "DK" },
  { id: "INV-2024-0301", customer: "Summit Energy Corp", initials: "SE", amount: 312000, dueDate: "May 20, 2024", daysOverdue: 61, riskScore: 95, priority: "Critical", status: "Escalated", owner: "Maria Torres", ownerInitials: "MT" },
  { id: "INV-2024-0678", customer: "Harbor Medical Center", initials: "HM", amount: 94200, dueDate: "Jun 18, 2024", daysOverdue: 32, riskScore: 57, priority: "Medium", status: "1st Reminder", owner: "David Kim", ownerInitials: "DK" },
  { id: "INV-2024-0549", customer: "Pacific Ventures Ltd", initials: "PV", amount: 67300, dueDate: "Jun 5, 2024", daysOverdue: 45, riskScore: 71, priority: "High", status: "2nd Reminder", owner: "Sarah Chen", ownerInitials: "SC" },
  { id: "INV-2024-0389", customer: "Ironclad Manufacturing", initials: "IM", amount: 142800, dueDate: "May 25, 2024", daysOverdue: 56, riskScore: 88, priority: "High", status: "Final Notice", owner: "James Park", ownerInitials: "JP" },
];

// Keep for backward compatibility with notifications
const activities = recentActivitiesData;

const aiSuggestions = [
  { id: 1, title: "Critical: Summit Energy Corp", description: "91 days overdue. Recommend immediate legal escalation — recovery probability drops to 34% after 100 days.", confidence: 94, action: "Escalate Now", severity: "critical" },
  { id: 2, title: "Payment Plan Opportunity", description: "Meridian Healthcare shows consistent partial payments. A 3-month installment plan has 87% recovery probability.", confidence: 87, action: "Create Plan", severity: "medium" },
  { id: 3, title: "Batch Reminder Ready", description: "14 invoices are 30+ days overdue without a 2nd reminder. Optimal send time: Today 9–11 AM.", confidence: 91, action: "Send Batch", severity: "info" },
];

const pendingApprovals = [
  { id: 1, type: "Payment Plan", customer: "Crestview Financial", amount: 178000, requestedBy: "Sarah Chen", urgency: "High", description: "3-month installment plan — $59,333/month", days: 2 },
  { id: 2, type: "Write-Off", customer: "Delta Ventures LLC", amount: 23400, requestedBy: "James Park", urgency: "Medium", description: "Account inactive >180 days, legal exhausted", days: 5 },
  { id: 3, type: "Escalation", customer: "Summit Energy Corp", amount: 312000, requestedBy: "Maria Torres", urgency: "Critical", description: "61 days overdue, risk score 95 — legal referral", days: 0 },
];

const automationFlows = [
  { id: 1, name: "Daily Reminder Batch", status: "Running", progress: 67, startTime: "09:15 AM", records: 142, processed: 95 },
  { id: 2, name: "Risk Score Recalculation", status: "Completed", progress: 100, startTime: "08:00 AM", records: 287, processed: 287, duration: "4m 23s" },
  { id: 3, name: "Payment Plan Follow-up", status: "Completed", progress: 100, startTime: "07:30 AM", records: 34, processed: 34, duration: "1m 12s" },
  { id: 4, name: "Escalation Report", status: "Failed", progress: 45, startTime: "06:00 AM", records: 19, processed: 8, error: "Dataverse connection timeout" },
  { id: 5, name: "Weekly Aging Report", status: "Scheduled", progress: 0, startTime: "11:00 AM", records: null, processed: 0 },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "collections", label: "Collections", icon: Target, badge: 47 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "approvals", label: "Approvals", icon: CheckSquare, badge: 8 },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

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

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#DDDDDD] h-14 flex items-center px-5 gap-4 z-40 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* WinWire / NTT DATA inline SVG */}
        <WinWireLogo />

        {/* Divider */}
        <div className="w-px h-8 bg-[#DDDDDD] flex-shrink-0" />

        {/* Caption */}
        <div className="flex-shrink-0">
          <p
            className="text-[#003087] font-bold text-[8px] tracking-[0.18em] leading-none"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            COLLECTION
          </p>
          <p
            className="text-[#003087] font-bold text-[8px] tracking-[0.18em] leading-none mt-0.5"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            CATALYST AGENT
          </p>
        </div>
      </div>

      {/* Search */}
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
        {/* AI Status pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f0fdf4] rounded-[6px] border border-[#bbf7d0]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#16a34a]">AI Active</span>
        </div>

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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (id: string) => void }) {
  return (
    <aside className="w-52 bg-white border-r border-[#DDDDDD] flex flex-col flex-shrink-0 overflow-hidden">
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }: any) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
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
              </button>
            );
          })}
        </div>
      </nav>

      {/* Power Automate status */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <div className="bg-[#F8FAFC] rounded-[6px] p-2.5 border border-[#DDDDDD]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            <span className="text-[10px] font-semibold text-gray-700">Power Automate</span>
          </div>
          <p className="text-[10px] text-gray-500">3 flows running · 1 failed</p>
          <div className="mt-1.5 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-[#003087] rounded-full" style={{ width: "67%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, change, positive, icon: Icon, color, sub }: any) {
  return (
    <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-[6px] flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardView({ setActiveNav }: { setActiveNav: (id: string) => void }) {
  const [searchCustomer, setSearchCustomer] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");

  // Filter customers based on search and filters
  const filteredCustomers = customersData.filter((customer) => {
    const matchSearch = !searchCustomer || 
      customer.customer.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchCustomer.toLowerCase());
    const matchRisk = filterRisk === "All" || 
      (filterRisk === "High" && customer.riskScore >= 80) ||
      (filterRisk === "Medium" && customer.riskScore >= 40 && customer.riskScore < 80) ||
      (filterRisk === "Low" && customer.riskScore < 40);
    const matchPriority = filterPriority === "All" || customer.priority === filterPriority;
    const matchOwner = filterOwner === "All" || customer.owner === filterOwner;
    return matchSearch && matchRisk && matchPriority && matchOwner;
  });

  // Get unique owners for filter
  const uniqueOwners = Array.from(new Set(customersData.map(c => c.owner)));

  // Calculate total reminder emails sent today (mock)
  const reminderEmailsToday = 12;

  return (
    <div className="p-6 space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Collections Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Sunday, July 20, 2026 · Executive Overview · Powered by Dataverse & AI</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#003087] rounded-[6px] hover:bg-[#00256A] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        <KPICard 
          label="Outstanding Receivables" 
          value="$1.44M" 
          change="+12%" 
          positive={false} 
          icon={DollarSign} 
          color="#003087" 
          sub="vs. last month" 
        />
        <KPICard 
          label="Overdue Customers" 
          value="10" 
          change="+3" 
          positive={false} 
          icon={Users} 
          color="#dc2626" 
          sub="active cases" 
        />
        <KPICard 
          label="High-Risk Customers" 
          value="5" 
          change="+1" 
          positive={false} 
          icon={AlertTriangle} 
          color="#f59e0b" 
          sub="requires attention" 
        />
        <KPICard 
          label="Expected Cash Collection" 
          value="$892K" 
          change="+5%" 
          positive={true} 
          icon={TrendingUp} 
          color="#16a34a" 
          sub="next 30 days" 
        />
        <KPICard 
          label="Pending Approvals" 
          value="8" 
          change="-2" 
          positive={true} 
          icon={CheckSquare} 
          color="#8b5cf6" 
          sub="require action" 
        />
        <KPICard 
          label="Reminder Emails Today" 
          value={reminderEmailsToday.toString()} 
          change="+4" 
          positive={true} 
          icon={Mail} 
          color="#0066CC" 
          sub="sent successfully" 
        />
      </div>

      {/* AI Risk Prioritization Section */}
      <div className="bg-gradient-to-r from-[#003087] to-[#0066CC] rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-white" />
          <h2 className="text-base font-semibold text-white">AI-Driven Risk Prioritization</h2>
          <span className="ml-auto text-[11px] text-white/80">Powered by Azure AI</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {customersData
            .filter(c => c.riskScore >= 80)
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 3)
            .map((customer) => {
              const riskBadgeColor = customer.riskScore >= 90 ? "#dc2626" : "#f59e0b";
              const riskBadgeBg = customer.riskScore >= 90 ? "#fef2f2" : "#fffbeb";
              
              return (
                <div key={customer.id} className="bg-white rounded-[6px] border border-[#E5E7EB] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: "#003087" }}
                        >
                          {customer.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{customer.customer}</p>
                          <p className="text-[10px] text-gray-500">{customer.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold mb-1"
                        style={{ backgroundColor: riskBadgeBg, color: riskBadgeColor }}
                      >
                        Risk: {customer.riskScore}
                      </div>
                      <Badge label={customer.priority} style={priorityStyle(customer.priority)} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Outstanding:</span>
                      <span className="font-semibold text-gray-900">{fmtCurrency(customer.outstandingBalance)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Days Overdue:</span>
                      <span className="font-semibold text-red-600">{customer.daysOverdue} days</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Open Invoices:</span>
                      <span className="font-semibold text-gray-900">{customer.openInvoices}</span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-[6px] p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Brain className="w-3.5 h-3.5 text-[#003087] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-gray-900 mb-1">AI Insight</p>
                        <p className="text-[10px] text-gray-600 leading-snug">{customer.aiReason}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-[#003087]" />
                    <p className="text-[10px] text-gray-600 flex-1">{customer.aiRecommendation}</p>
                  </div>

                  <button 
                    onClick={() => setActiveNav("collections")}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[#003087] rounded-[6px] hover:bg-[#00256A] transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View Details
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Collections Trend */}
        <div className="col-span-2 bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Collections Trend</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Monthly collections vs. target (USD thousands)</p>
            </div>
            <select className="text-[11px] border border-[#DDDDDD] rounded-[6px] px-2 py-1 bg-white text-gray-600 focus:outline-none focus:border-[#003087]">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Line type="monotone" dataKey="collected" name="Collected" stroke="#003087" strokeWidth={2} dot={{ r: 3, fill: "#003087" }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="overdue" name="Overdue" stroke="#dc2626" strokeWidth={2} dot={{ r: 3, fill: "#dc2626" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Risk Distribution</h3>
          <p className="text-[11px] text-gray-500 mb-4">Customer risk categories</p>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie 
                  data={riskDistributionData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={45} 
                  outerRadius={65} 
                  dataKey="value" 
                  strokeWidth={0}
                  label={({ name, value }) => `${value}`}
                  labelLine={false}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {riskDistributionData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{d.count} customers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aging Analysis */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Aging Analysis</h3>
        <p className="text-[11px] text-gray-500 mb-4">Invoice age distribution (USD thousands)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={agingData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
              {agingData.map((_, i) => {
                const colors = ["#16a34a", "#f59e0b", "#f97316", "#dc2626"];
                return <Cell key={i} fill={colors[i]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {agingData.map((d, i) => {
            const colors = ["#16a34a", "#f59e0b", "#f97316", "#dc2626"];
            return (
              <div key={d.bucket} className="flex flex-col items-center text-center p-2 bg-[#F8FAFC] rounded-[6px]">
                <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: colors[i] }} />
                <span className="text-[11px] font-semibold text-gray-900">{d.bucket}</span>
                <span className="text-[10px] text-gray-500">{d.count} invoices</span>
                <span className="text-[12px] font-bold text-gray-900 mt-1">${d.amount}K</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Collection Worklist */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Customer Collection Worklist</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {filteredCustomers.length} customers · ${(filteredCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0) / 1000).toFixed(0)}K outstanding
            </p>
          </div>
          <button 
            onClick={() => setActiveNav("collections")}
            className="text-[11px] text-[#003087] font-medium cursor-pointer hover:underline"
          >
            View All Collections →
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E5E7EB]">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              className="w-full h-9 pl-9 pr-4 bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] text-[12px] placeholder:text-gray-400 focus:outline-none focus:border-[#003087] focus:bg-white transition-colors"
              placeholder="Search customer..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
            />
          </div>

          <select 
            className="h-9 px-3 text-[12px] border border-[#DDDDDD] rounded-[6px] bg-white text-gray-600 focus:outline-none focus:border-[#003087]"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk (80+)</option>
            <option value="Medium">Medium Risk (40-79)</option>
            <option value="Low">Low Risk (&lt;40)</option>
          </select>

          <select 
            className="h-9 px-3 text-[12px] border border-[#DDDDDD] rounded-[6px] bg-white text-gray-600 focus:outline-none focus:border-[#003087]"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select 
            className="h-9 px-3 text-[12px] border border-[#DDDDDD] rounded-[6px] bg-white text-gray-600 focus:outline-none focus:border-[#003087]"
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
          >
            <option value="All">All Owners</option>
            {uniqueOwners.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>

          <button className="flex items-center gap-1.5 px-3 h-9 text-[12px] font-medium text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
            <Filter className="w-3.5 h-3.5" /> More
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DDDDDD]">
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Customer Name</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Outstanding Amount</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Open Invoices</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Days Overdue</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Risk Score</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Priority</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Collection Owner</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Status</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const p = priorityStyle(customer.priority);
                const s = statusStyle(customer.collectionStatus);
                const rc = riskColor(customer.riskScore);

                return (
                  <tr key={customer.id} className="border-b border-[#E5E7EB] hover:bg-[#F5F9FF] transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ backgroundColor: "#003087" }}
                        >
                          {customer.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.customer}</p>
                          <p className="text-[10px] text-gray-500">{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-gray-900">
                      {fmtCurrency(customer.outstandingBalance)}
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      {customer.openInvoices}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-red-600">{customer.daysOverdue} days</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${customer.riskScore}%`,
                              backgroundColor: rc
                            }}
                          />
                        </div>
                        <span className="font-semibold text-[11px]" style={{ color: rc }}>
                          {customer.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge label={customer.priority} style={p} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                          style={{ backgroundColor: "#003087" }}
                        >
                          {customer.ownerInitials}
                        </div>
                        <span className="text-gray-700">{customer.owner}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge label={customer.collectionStatus} style={s} />
                    </td>
                    <td className="px-3 py-3">
                      <button 
                        onClick={() => setActiveNav("collections")}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#003087] bg-[#F5F9FF] border border-[#003087]/20 rounded-[6px] hover:bg-[#003087] hover:text-white transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No customers found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#003087]" />
              <h3 className="text-sm font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <span className="text-[11px] text-[#003087] font-medium cursor-pointer hover:underline">View all</span>
          </div>
          <div className="space-y-3">
            {recentActivitiesData.slice(0, 6).map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: `${a.color}15` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-gray-700 leading-snug">{a.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations & Quick Stats */}
        <div className="space-y-4">
          {/* AI Suggestions */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#003087]" />
              <h3 className="text-sm font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="space-y-2.5">
              {aiSuggestions.slice(0, 2).map((s) => {
                const borderColor = s.severity === "critical" ? "#dc2626" : s.severity === "medium" ? "#f59e0b" : "#003087";
                const bgColor = s.severity === "critical" ? "#fef2f2" : s.severity === "medium" ? "#fffbeb" : "#eff6ff";
                return (
                  <div key={s.id} className="rounded-[6px] p-3 border-l-2" style={{ backgroundColor: bgColor, borderLeftColor: borderColor }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[12px] font-semibold text-gray-900">{s.title}</p>
                      <span className="text-[10px] font-semibold text-gray-500 flex-shrink-0">{s.confidence}% conf.</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug mb-2">{s.description}</p>
                    <button
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px] text-white transition-colors"
                      style={{ backgroundColor: borderColor }}
                    >
                      {s.action}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Queue Preview */}
          <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Approval Queue</h3>
              <button onClick={() => setActiveNav("approvals")} className="text-[11px] text-[#003087] font-medium cursor-pointer hover:underline">
                View all (8)
              </button>
            </div>
            <div className="space-y-2">
              {pendingApprovals.slice(0, 2).map((a) => {
                const p = priorityStyle(a.urgency);
                return (
                  <div key={a.id} className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-[6px] border border-[#DDDDDD]">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold text-gray-700">{a.type}</span>
                        <Badge label={a.urgency} style={p} />
                      </div>
                      <p className="text-[11px] text-gray-600">{a.customer}</p>
                      <p className="text-[11px] font-semibold text-gray-900">{fmtCurrency(a.amount)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="w-6 h-6 rounded-[4px] bg-[#f0fdf4] hover:bg-[#dcfce7] flex items-center justify-center transition-colors">
                        <Check className="w-3 h-3 text-[#16a34a]" />
                      </button>
                      <button className="w-6 h-6 rounded-[4px] bg-[#fef2f2] hover:bg-[#fee2e2] flex items-center justify-center transition-colors">
                        <X className="w-3 h-3 text-[#dc2626]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Collections View ─────────────────────────────────────────────────────────

function CollectionsView() {
  const [filterPriority, setFilterPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filtered = invoicesData.filter((inv) => {
    const matchPriority = filterPriority === "All" || inv.priority === filterPriority;
    const matchSearch = !search || inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    return matchPriority && matchSearch;
  });

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Collections</h1>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} accounts · $
            {(filtered.reduce((s, i) => s + i.amount, 0) / 1000).toFixed(0)}K outstanding</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#003087] rounded-[6px] hover:bg-[#00256A] transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Case
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-3 mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            className="w-full h-9 pl-9 pr-4 bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#003087] focus:bg-white transition-colors"
            placeholder="Search customer or invoice…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Critical", "High", "Medium", "Low"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[6px] border transition-colors ${
                filterPriority === p
                  ? "bg-[#003087] text-white border-[#003087]"
                  : "bg-white text-gray-600 border-[#DDDDDD] hover:bg-[#F3F6FB]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors ml-auto">
          <Filter className="w-3.5 h-3.5" /> More Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#DDDDDD]">
                <th className="w-8 px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-[#D6D6D6]" />
                </th>
                {["Customer", "Invoice", "Amount", "Due Date", "Days Overdue", "Risk", "Priority", "Status", "Owner", ""].map((h) => (
                  <th key={h} className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const p = priorityStyle(inv.priority);
                const s = statusStyle(inv.status);
                const rc = riskColor(inv.riskScore);
                const selected = selectedRows.has(inv.id);
                return (
                  <tr
                    key={inv.id}
                    className={`border-b border-[#E5E7EB] hover:bg-[#F5F9FF] transition-colors ${selected ? "bg-[#F5F9FF]" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected} onChange={() => toggleRow(inv.id)} className="rounded border-[#D6D6D6]" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {inv.initials}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{inv.customer}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">{inv.id}</td>
                    <td className="px-3 py-3 font-semibold text-gray-900">{fmtCurrency(inv.amount)}</td>
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="px-3 py-3">
                      <span className={`font-semibold ${inv.daysOverdue > 45 ? "text-[#dc2626]" : inv.daysOverdue > 30 ? "text-[#f59e0b]" : "text-gray-700"}`}>
                        {inv.daysOverdue}d
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rc }} />
                        <span className="font-bold" style={{ color: rc }}>{inv.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3"><Badge label={inv.priority} style={p} /></td>
                    <td className="px-3 py-3"><Badge label={inv.status} style={s} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#003087] flex items-center justify-center text-white text-[9px] font-bold">{inv.ownerInitials}</div>
                        <span className="text-gray-600 whitespace-nowrap">{inv.owner}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-[#F3F6FB] rounded-[4px] text-gray-500 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-[#F3F6FB] rounded-[4px] text-gray-500 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="p-1 hover:bg-[#F3F6FB] rounded-[4px] text-gray-500 transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-gray-500">
          <span>Showing {filtered.length} of {invoicesData.length} records</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-6 h-6 rounded-[4px] text-[11px] font-medium transition-colors ${p === 1 ? "bg-[#003087] text-white" : "hover:bg-[#F3F6FB] text-gray-600"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────

const initMessages = [
  {
    role: "assistant",
    content: "Hello! I'm the Collection Catalyst AI. I can analyze your AR portfolio, generate payment reminders, identify high-risk accounts, and recommend collection strategies.",
    time: "9:00 AM",
  },
  {
    role: "user",
    content: "Which customers have the highest risk score this week?",
    time: "9:02 AM",
  },
  {
    role: "assistant",
    content: "Based on my analysis of your AR portfolio, here are the top high-risk accounts:",
    table: [
      { rank: 1, customer: "Summit Energy Corp", score: 95, amount: "$312,000", days: "61 days", trend: "↑ +12" },
      { rank: 2, customer: "Northstar Logistics", score: 91, amount: "$245,000", days: "51 days", trend: "↑ +8" },
      { rank: 3, customer: "Crestview Financial", score: 83, amount: "$178,000", days: "40 days", trend: "→ +1" },
    ],
    summary: "I recommend immediate action on Summit Energy Corp — their risk score increased 12 points this week. Recovery probability drops below 40% after 90 days.",
    confidence: 94,
    time: "9:02 AM",
  },
];

const promptSuggestions = [
  "Which customers have the highest risk?",
  "Generate reminders for 60+ day overdue invoices",
  "Recommend payment plans for Crestview Financial",
  "Summarize today's collection status",
  "Predict cash flow for next 30 days",
];

function AIAssistantView() {
  const [messages, setMessages] = useState<any[]>(initMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "assistant",
        content: `I've analyzed your request: "${text}". Based on current data, I recommend reviewing the top 5 overdue accounts. Summit Energy Corp (risk: 95) requires immediate escalation. Shall I generate a detailed action plan?`,
        confidence: 89,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex">
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b border-[#DDDDDD] bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <h1 className="text-sm font-semibold text-gray-900">AI Collections Assistant</h1>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0fdf4] rounded-full border border-[#bbf7d0]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                <span className="text-[10px] font-semibold text-[#16a34a]">Online</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 ml-9">Powered by Azure OpenAI · GPT-4o</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                msg.role === "user" ? "bg-[#003087] text-white" : "bg-white border border-[#DDDDDD] text-gray-600"
              }`}>
                {msg.role === "user" ? "AM" : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-lg ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-[6px] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${
                  msg.role === "user"
                    ? "bg-[#003087] text-white"
                    : "bg-white border border-[#DDDDDD] text-gray-800"
                }`}>
                  <p className="text-[13px] leading-relaxed">{msg.content}</p>

                  {msg.table && (
                    <div className="mt-3 rounded-[6px] overflow-hidden border border-[#E5E7EB]">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="bg-[#F8FAFC] text-gray-600 font-semibold">
                            {["#", "Customer", "Score", "Amount", "Overdue", "Trend"].map((h) => (
                              <th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {msg.table.map((row: any) => (
                            <tr key={row.rank} className="border-t border-[#E5E7EB]">
                              <td className="px-3 py-2 font-bold text-gray-400">{row.rank}</td>
                              <td className="px-3 py-2 font-semibold text-gray-800">{row.customer}</td>
                              <td className="px-3 py-2">
                                <span className="font-bold" style={{ color: riskColor(row.score) }}>{row.score}</span>
                              </td>
                              <td className="px-3 py-2 font-semibold text-gray-800">{row.amount}</td>
                              <td className="px-3 py-2 text-gray-600">{row.days}</td>
                              <td className="px-3 py-2 text-[#dc2626] font-semibold">{row.trend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {msg.summary && (
                    <div className="mt-3 p-2.5 bg-[#eff6ff] rounded-[6px] border border-[#bfdbfe]">
                      <p className="text-[11px] text-[#1d4ed8] leading-snug">{msg.summary}</p>
                    </div>
                  )}

                  {msg.confidence && (
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#E5E7EB]">
                      <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div className="h-full bg-[#003087] rounded-full" style={{ width: `${msg.confidence}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500">{msg.confidence}% confidence</span>
                      <div className="flex gap-1">
                        <button className="px-2 py-0.5 text-[10px] font-medium text-white bg-[#003087] rounded-[4px] hover:bg-[#00256A] transition-colors">Approve</button>
                        <button className="px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-[#F8FAFC] border border-[#DDDDDD] rounded-[4px] hover:bg-[#F3F6FB] transition-colors">Edit</button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-white border border-[#DDDDDD] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="bg-white border border-[#DDDDDD] rounded-[6px] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#003087] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Prompt suggestions */}
        <div className="px-5 pt-3 bg-white border-t border-[#E5E7EB] flex gap-2 overflow-x-auto">
          {promptSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="flex-shrink-0 text-[11px] px-3 py-1.5 bg-[#F8FAFC] border border-[#DDDDDD] rounded-[6px] text-gray-600 hover:border-[#003087] hover:text-[#003087] hover:bg-[#eff6ff] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white">
          <div className="flex items-end gap-2 bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] p-2 focus-within:border-[#003087] transition-colors">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              className="flex-1 bg-transparent text-[13px] placeholder:text-gray-400 focus:outline-none resize-none min-h-[36px] max-h-32"
              placeholder="Ask the AI assistant anything about your collections…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="p-1.5 rounded-[6px] bg-[#003087] text-white hover:bg-[#00256A] disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: AI Risk Context */}
      <div className="w-72 border-l border-[#DDDDDD] bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-gray-900">AI Risk Context</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Live analysis · 291 accounts</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Risk Distribution */}
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-2">Risk Distribution</p>
            {[
              { label: "Critical (80–100)", count: 12, pct: 75, color: "#dc2626" },
              { label: "High (60–79)", count: 23, pct: 55, color: "#f59e0b" },
              { label: "Medium (40–59)", count: 41, pct: 35, color: "#2563eb" },
              { label: "Low (0–39)", count: 215, pct: 15, color: "#16a34a" },
            ].map((r) => (
              <div key={r.label} className="mb-2">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-600">{r.label}</span>
                  <span className="font-semibold" style={{ color: r.color }}>{r.count}</span>
                </div>
                <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Top Risks */}
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-2">Top Risks Today</p>
            <div className="space-y-2">
              {invoicesData.filter((i) => i.riskScore >= 80).map((inv) => (
                <div key={inv.id} className="p-2.5 bg-[#fef2f2] rounded-[6px] border border-[#fecaca]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-gray-900 truncate mr-2">{inv.customer}</span>
                    <span className="text-[12px] font-bold text-[#dc2626]">{inv.riskScore}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>{fmtCurrency(inv.amount)}</span>
                    <span>{inv.daysOverdue}d overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-[#eff6ff] rounded-[6px] p-3 border border-[#bfdbfe]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#003087]" />
              <span className="text-[11px] font-semibold text-[#003087]">Model Confidence</span>
            </div>
            <p className="text-xl font-bold text-[#003087]">92.4%</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Avg. across 291 risk assessments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Automation View ───────────────────────────────────────────────────────────

function AutomationView() {
  const statusIcon = (s: string) => {
    if (s === "Running") return <div className="w-2 h-2 rounded-full bg-[#003087] animate-pulse" />;
    if (s === "Completed") return <div className="w-2 h-2 rounded-full bg-[#16a34a]" />;
    if (s === "Failed") return <div className="w-2 h-2 rounded-full bg-[#dc2626]" />;
    return <div className="w-2 h-2 rounded-full bg-gray-300" />;
  };

  const statusColor = (s: string) => {
    if (s === "Running") return { bg: "#eff6ff", text: "#1d4ed8" };
    if (s === "Completed") return { bg: "#f0fdf4", text: "#16a34a" };
    if (s === "Failed") return { bg: "#fef2f2", text: "#dc2626" };
    return { bg: "#f3f4f6", text: "#6b7280" };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Automation Monitor</h1>
          <p className="text-xs text-gray-500 mt-0.5">Power Automate · Real-time flow execution</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#003087] rounded-[6px] hover:bg-[#00256A] transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Flow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Running Flows", value: "3", icon: Activity, color: "#003087" },
          { label: "Completed Today", value: "24", icon: CircleCheck, color: "#16a34a" },
          { label: "Failed", value: "1", icon: CircleX, color: "#dc2626" },
          { label: "Avg. Processing", value: "2m 47s", icon: Clock, color: "#f59e0b" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flows */}
      <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Flow Executions</p>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {automationFlows.map((flow) => {
            const sc = statusColor(flow.status);
            return (
              <div key={flow.id} className="p-4 hover:bg-[#F5F9FF] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex items-center mt-1">{statusIcon(flow.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-gray-900">{flow.name}</span>
                      <Badge label={flow.status} style={sc} />
                      {flow.error && (
                        <div className="flex items-center gap-1 text-[11px] text-[#dc2626]">
                          <CircleAlert className="w-3 h-3" />
                          <span>{flow.error}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-2">
                      <span>Started {flow.startTime}</span>
                      {flow.records && <span>{flow.processed}/{flow.records} records</span>}
                      {flow.duration && <span>Duration: {flow.duration}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-xs h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${flow.progress}%`,
                            backgroundColor: flow.status === "Failed" ? "#dc2626" : flow.status === "Completed" ? "#16a34a" : "#003087",
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500">{flow.progress}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {flow.status === "Running" && (
                      <button className="p-1.5 hover:bg-[#F3F6FB] rounded-[4px] text-gray-500 transition-colors">
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {flow.status === "Failed" && (
                      <button className="px-2 py-1 text-[11px] font-medium text-white bg-[#dc2626] rounded-[4px] hover:bg-red-700 transition-colors flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                    <button className="p-1.5 hover:bg-[#F3F6FB] rounded-[4px] text-gray-500 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Pipeline */}
      <div className="mt-5 bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">AI Agent Pipeline</h3>
        <div className="flex items-center gap-0">
          {[
            { name: "Planner Agent", icon: Brain, status: "done" },
            { name: "Risk Analysis", icon: Shield, status: "done" },
            { name: "Reminder Gen", icon: Mail, status: "active" },
            { name: "Approval Agent", icon: CircleCheck, status: "waiting" },
            { name: "Automation", icon: Zap, status: "waiting" },
            { name: "Notification", icon: Bell, status: "waiting" },
          ].map((agent, i) => {
            const Icon = agent.icon;
            const isDone = agent.status === "done";
            const isActive = agent.status === "active";
            return (
              <div key={agent.name} className="flex items-center">
                <div className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-[6px] min-w-[88px] border transition-all ${
                  isDone ? "bg-[#f0fdf4] border-[#bbf7d0]" :
                  isActive ? "bg-[#eff6ff] border-[#bfdbfe]" :
                  "bg-[#F8FAFC] border-[#E5E7EB]"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDone ? "bg-[#16a34a]" : isActive ? "bg-[#003087]" : "bg-[#E5E7EB]"
                  }`}>
                    <Icon className={`w-4 h-4 ${isDone || isActive ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight ${
                    isDone ? "text-[#16a34a]" : isActive ? "text-[#003087]" : "text-gray-400"
                  }`}>{agent.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isDone ? "bg-[#16a34a]" : isActive ? "bg-[#003087] animate-pulse" : "bg-gray-300"
                  }`} />
                </div>
                {i < 5 && (
                  <div className={`w-6 h-0.5 ${isDone ? "bg-[#16a34a]" : isActive ? "bg-[#003087]" : "bg-[#E5E7EB]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Approvals View ───────────────────────────────────────────────────────────

function ApprovalsView() {
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [comments, setComments] = useState<Record<number, string>>({});

  const handleAction = (id: number, action: "approve" | "reject") => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Approval Center</h1>
          <p className="text-xs text-gray-500 mt-0.5">{approvals.length} items pending manager review</p>
        </div>
      </div>

      {approvals.length === 0 ? (
        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-12 text-center">
          <CircleCheck className="w-10 h-10 text-[#16a34a] mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">All caught up!</p>
          <p className="text-[12px] text-gray-500 mt-1">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => {
            const p = priorityStyle(approval.urgency);
            return (
              <div key={approval.id} className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#003087] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {approval.customer.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[13px] font-semibold text-[#003087]">{approval.type}</span>
                      <Badge label={approval.urgency} style={p} />
                      {approval.days === 0 && (
                        <span className="text-[11px] font-semibold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded-full">Urgent</span>
                      )}
                    </div>
                    <p className="text-[13px] font-semibold text-gray-900 mb-0.5">{approval.customer}</p>
                    <p className="text-[12px] text-gray-500 mb-1">{approval.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{fmtCurrency(approval.amount)}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />Requested by {approval.requestedBy}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{approval.days === 0 ? "Today" : `${approval.days}d ago`}</span>
                    </div>

                    {/* AI Recommendation */}
                    <div className="mt-3 p-3 bg-[#eff6ff] rounded-[6px] border border-[#bfdbfe]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#003087]" />
                        <span className="text-[11px] font-semibold text-[#003087]">AI Recommendation</span>
                        <span className="text-[10px] text-gray-500 ml-auto">92% confidence</span>
                      </div>
                      <p className="text-[11px] text-[#1d4ed8] leading-snug">
                        {approval.type === "Payment Plan"
                          ? "Approve — customer shows 3-month payment consistency. Installment plan improves recovery probability by 34%."
                          : approval.type === "Write-Off"
                          ? "Approve write-off — legal options exhausted. Tax benefit offsets 28% of loss."
                          : "Approve escalation — immediate action critical. Risk score increased 12 pts this week."}
                      </p>
                    </div>

                    {/* Comment input */}
                    <div className="mt-3">
                      <input
                        className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] text-[12px] placeholder:text-gray-400 focus:outline-none focus:border-[#003087] transition-colors"
                        placeholder="Add a comment (optional)…"
                        value={comments[approval.id] ?? ""}
                        onChange={(e) => setComments((c) => ({ ...c, [approval.id]: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAction(approval.id, "approve")}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#16a34a] rounded-[6px] hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(approval.id, "reject")}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#dc2626] bg-white border border-[#dc2626] rounded-[6px] hover:bg-[#fef2f2] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Request Changes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────

const reportTrend = [
  { month: "Jan", collected: 310, recovered: 245, reminders: 180 },
  { month: "Feb", collected: 285, recovered: 198, reminders: 210 },
  { month: "Mar", collected: 320, recovered: 272, reminders: 195 },
  { month: "Apr", collected: 298, recovered: 231, reminders: 225 },
  { month: "May", collected: 415, recovered: 361, reminders: 187 },
  { month: "Jun", collected: 380, recovered: 312, reminders: 203 },
];

function ReportsView() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Collection performance · Jan–Jun 2024</p>
        </div>
        <div className="flex gap-2">
          {["PDF", "Excel", "PowerPoint"].map((fmt) => (
            <button key={fmt} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-[#DDDDDD] rounded-[6px] hover:bg-[#F3F6FB] transition-colors">
              <Download className="w-3.5 h-3.5" /> {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Collected YTD", value: "$2.01M", change: "+18%", positive: true, color: "#003087" },
          { label: "Recovery Rate", value: "79.2%", change: "+4.1%", positive: true, color: "#16a34a" },
          { label: "Avg. Days to Collect", value: "28.4d", change: "-3.2d", positive: true, color: "#8b5cf6" },
          { label: "Write-offs YTD", value: "$47K", change: "-12%", positive: true, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
            <p className={`text-[11px] font-semibold mt-1 ${s.positive ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{s.change} vs. last period</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Collection Performance</h3>
          <p className="text-[11px] text-gray-500 mb-4">Monthly collected vs. recovered ($K)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={reportTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Bar dataKey="collected" name="Collected" fill="#003087" radius={[3, 3, 0, 0]} />
              <Bar dataKey="recovered" name="Recovered" fill="#16a34a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Reminder Statistics</h3>
          <p className="text-[11px] text-gray-500 mb-4">Reminders sent vs. collection trend ($K)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={reportTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Line type="monotone" dataKey="reminders" name="Reminders" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="collected" name="Collected" stroke="#003087" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">AI Effectiveness</h3>
          <p className="text-[11px] text-gray-500 mb-3">AI-assisted vs. manual collections</p>
          <div className="space-y-3">
            {[
              { label: "AI-Assisted Collections", value: 79, color: "#003087" },
              { label: "Reminder Open Rate", value: 68, color: "#0066CC" },
              { label: "Payment Plan Adoption", value: 54, color: "#8b5cf6" },
              { label: "Escalation Avoidance", value: 41, color: "#16a34a" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-bold" style={{ color: m.color }}>{m.value}%</span>
                </div>
                <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Cash Recovery Trend</h3>
          <p className="text-[11px] text-gray-500 mb-4">Cumulative cash recovered ($K)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={reportTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="rpt-recovered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#16a34a" strokeWidth={2} fill="url(#rpt-recovered)" dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────

function SettingsView() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-lg font-semibold text-gray-900 mb-5">Settings</h1>
      {[
        {
          section: "Collection Rules",
          items: [
            { label: "Auto-send 1st reminder after", value: "30 days overdue" },
            { label: "Auto-send 2nd reminder after", value: "45 days overdue" },
            { label: "Auto-escalate after", value: "60 days overdue" },
            { label: "Write-off threshold", value: "$10,000" },
          ],
        },
        {
          section: "AI Configuration",
          items: [
            { label: "Risk score model", value: "Azure OpenAI GPT-4o" },
            { label: "Confidence threshold", value: "80%" },
            { label: "Auto-approve plans below", value: "$5,000" },
            { label: "Reminder tone default", value: "Professional" },
          ],
        },
        {
          section: "Notifications",
          items: [
            { label: "Payment received alerts", value: "Email + In-app" },
            { label: "Escalation notifications", value: "Email + SMS" },
            { label: "Daily digest", value: "9:00 AM" },
            { label: "Automation failure alerts", value: "Immediate" },
          ],
        },
      ].map((group) => (
        <div key={group.section} className="bg-white rounded-[6px] border border-[#DDDDDD] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <p className="text-[12px] font-semibold text-gray-700">{group.section}</p>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {group.items.map((item) => (
              <div key={item.label} className="px-4 py-3 flex items-center justify-between hover:bg-[#F5F9FF] transition-colors">
                <span className="text-[13px] text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-900">{item.value}</span>
                  <button className="p-1 hover:bg-[#F3F6FB] rounded-[4px] text-gray-400 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Placeholder Views ────────────────────────────────────────────────────────

function PlaceholderView({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-[6px] bg-[rgba(0,48,135,0.08)] flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-[#003087]" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        <p className="text-[12px] text-gray-500 mt-1">This section is under development.</p>
        <button className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#003087] rounded-[6px] hover:bg-[#00256A] transition-colors">
          Coming Soon
        </button>
      </div>
    </div>
  );
}

// ─── Floating Copilot ─────────────────────────────────────────────────────────

function FloatingCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Hi! How can I help with your collections today?" },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", content: "I'm analyzing your request and will have an answer shortly. For detailed analysis, try the full AI Assistant view." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 bg-white rounded-[6px] border border-[#DDDDDD] shadow-xl overflow-hidden mb-1">
          <div className="bg-[#003087] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white text-[12px] font-semibold">AI Copilot</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48 overflow-y-auto p-3 space-y-2 bg-[#F8FAFC]">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-[220px] rounded-[6px] px-3 py-2 text-[11px] leading-snug ${
                  m.role === "user" ? "bg-[#003087] text-white" : "bg-white border border-[#DDDDDD] text-gray-700"
                }`}>{m.content}</div>
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-[#E5E7EB] flex gap-2">
            <input
              className="flex-1 h-8 px-2.5 text-[12px] bg-[#F8FAFC] border border-[#D6D6D6] rounded-[6px] placeholder:text-gray-400 focus:outline-none focus:border-[#003087] transition-colors"
              placeholder="Ask anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send} className="w-8 h-8 rounded-[6px] bg-[#003087] hover:bg-[#00256A] flex items-center justify-center text-white transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-[#003087] hover:bg-[#00256A] shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return <DashboardView setActiveNav={setActiveNav} />;
      case "collections": return <CollectionsView />;
      case "ai-assistant": return <AIAssistantView />;
      case "automation": return <AutomationView />;
      case "approvals": return <ApprovalsView />;
      case "reports": return <ReportsView />;
      case "settings": return <SettingsView />;
      case "customers": return <PlaceholderView label="Customers" icon={Users} />;
      case "invoices": return <PlaceholderView label="Invoices" icon={FileText} />;
      default: return <DashboardView setActiveNav={setActiveNav} />;
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
      <FloatingCopilot />
    </div>
  );
}
