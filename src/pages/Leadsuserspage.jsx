import { useState, useMemo } from "react";
import {
  Search, Filter, ChevronDown,
  Users, Star, Target, UserCheck, TrendingUp, Activity,
  X, ArrowUpRight, Smartphone, Globe, Calendar,
  BarChart2, Zap, Eye, Phone, MessageSquare, CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped — only this user's captured leads & activity) ──────────

const MY_LEADS = [
  { id:1,  name:"John Doe",       email:"john@example.com",     phone:"+1 555-0101", source:"NFC Scan",       status:"New",       date:"May 31, 2025 10:30 AM", av:"JD", color:"from-red-500 to-rose-600" },
  { id:2,  name:"Alice Smith",    email:"alice@example.com",    phone:"+1 555-0102", source:"Website",        status:"Contacted", date:"May 31, 2025 09:15 AM", av:"AS", color:"from-rose-500 to-red-700" },
  { id:3,  name:"Michael Lee",    email:"michael@example.com",  phone:"+1 555-0103", source:"Social Media",   status:"Qualified", date:"May 30, 2025 04:45 PM", av:"ML", color:"from-red-600 to-rose-500" },
  { id:4,  name:"Emma Brown",     email:"emma@example.com",     phone:"+1 555-0104", source:"NFC Scan",       status:"Converted", date:"May 30, 2025 03:20 PM", av:"EB", color:"from-rose-600 to-red-800" },
  { id:5,  name:"David Wilson",   email:"david@example.com",    phone:"+1 555-0105", source:"Email Campaign", status:"New",       date:"May 29, 2025 11:10 AM", av:"DW", color:"from-red-500 to-rose-700" },
  { id:6,  name:"Sarah Connor",   email:"sarah@example.com",    phone:"+1 555-0106", source:"Website",        status:"Contacted", date:"May 29, 2025 09:00 AM", av:"SC", color:"from-rose-500 to-red-600" },
  { id:7,  name:"James Taylor",   email:"james@example.com",    phone:"+1 555-0107", source:"NFC Scan",       status:"New",       date:"May 28, 2025 02:30 PM", av:"JT", color:"from-red-700 to-rose-500" },
  { id:8,  name:"Olivia Martin",  email:"olivia@example.com",   phone:"+1 555-0108", source:"Social Media",   status:"Qualified", date:"May 28, 2025 11:45 AM", av:"OM", color:"from-rose-700 to-red-500" },
];

const LEADS_CHART = [
  {l:"May 1",v:18},{l:"May 6",v:24},{l:"May 11",v:19},{l:"May 16",v:31},
  {l:"May 21",v:27},{l:"May 26",v:38},{l:"May 31",v:42},
];
const ACTIVITY_CHART = [
  {l:"May 1",  cardScans:14, profileViews:9,  calls:4, messages:3},
  {l:"May 6",  cardScans:18, profileViews:11, calls:5, messages:4},
  {l:"May 11", cardScans:16, profileViews:10, calls:4, messages:3},
  {l:"May 16", cardScans:22, profileViews:13, calls:6, messages:5},
  {l:"May 21", cardScans:19, profileViews:12, calls:5, messages:4},
  {l:"May 26", cardScans:25, profileViews:15, calls:7, messages:6},
  {l:"May 31", cardScans:28, profileViews:17, calls:8, messages:6},
];

const SOURCES_PIE  = [{name:"NFC Scan",value:38,fill:"#ef4444"},{name:"Website",value:25,fill:"#f87171"},{name:"Social Media",value:20,fill:"#fca5a5"},{name:"Email",value:17,fill:"#fecaca"}];
const INTERACT_PIE = [{name:"Card Scans",value:46,fill:"#ef4444"},{name:"Profile Views",value:25,fill:"#f87171"},{name:"Phone Calls",value:16,fill:"#fca5a5"},{name:"Messages",value:13,fill:"#fecaca"}];

const TOOLTIP_STYLE = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:10, fontSize:11, color:"#1a0000" },
  labelStyle:  { color:"#991b1b" },
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    New:       "bg-red-100 text-red-700 border-red-300",
    Contacted: "bg-rose-100 text-rose-700 border-rose-300",
    Qualified: "bg-orange-100 text-orange-700 border-orange-300",
    Converted: "bg-green-100 text-green-700 border-green-300",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status]||""}`}>
      {status}
    </span>
  );
}

// ─── LEAD DETAIL DRAWER (read-only) ──────────────────────────────────────────

function LeadDrawer({ lead, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base">Lead Details</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"
          >
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5 bg-red-50 border border-red-100 rounded-xl p-4">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${lead.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
            {lead.av}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-red-900 font-bold text-base">{lead.name}</div>
            <div className="text-red-400 text-xs">{lead.email}</div>
            <div className="text-red-400 text-xs">{lead.phone}</div>
          </div>
          <StatusBadge status={lead.status}/>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[{l:"Source",v:lead.source},{l:"Captured On",v:lead.date}].map(r=>(
            <div key={r.l} className="bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="text-red-400 text-[10px] mb-0.5">{r.l}</div>
              <div className="text-red-900 text-xs font-semibold">{r.v}</div>
            </div>
          ))}
        </div>

        {/* Quick action links (read-only intent) */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <a href={`mailto:${lead.email}`}
            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold py-2.5 rounded-lg transition-all">
            <MessageSquare className="w-3.5 h-3.5"/> Email
          </a>
          <a href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">
            <Phone className="w-3.5 h-3.5"/> Call
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all border border-red-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function UserLeadsPage({ onMenuClick }) {
  const [tab,          setTab]          = useState("leads");
  const [search,       setSearch]       = useState("");
  const [srcFilter,    setSrcFilter]    = useState("All Sources");
  const [stFilter,     setStFilter]     = useState("All Status");
  const [selectedLead, setSelectedLead] = useState(null);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const filtered = useMemo(() => MY_LEADS.filter(l => {
    const q = search.toLowerCase();
    return (
      (!q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.source.toLowerCase().includes(q))
      && (srcFilter === "All Sources" || l.source === srcFilter)
      && (stFilter  === "All Status"  || l.status === stFilter)
    );
  }), [search, srcFilter, stFilter]);

  const STATS = [
    { Icon:Users,      bg:"from-red-500 to-rose-600",   label:"My Total Leads",      value:"342",    change:"21.4%" },
    { Icon:Star,       bg:"from-rose-500 to-red-600",   label:"New This Month",      value:"58",     change:"18.6%" },
    { Icon:Target,     bg:"from-red-600 to-rose-700",   label:"Leads Converted",     value:"24",     change:"16.3%" },
    { Icon:Zap,        bg:"from-rose-600 to-red-800",   label:"NFC Scans",           value:"189",    change:"24.7%" },
    { Icon:TrendingUp, bg:"from-red-700 to-rose-600",   label:"Engagement Rate",     value:"72.3%",  change:"12.8%" },
    { Icon:Activity,   bg:"from-rose-700 to-red-700",   label:"Avg Daily Activity",  value:"5.6",    change:"11.3%" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* ── Title + Tabs ── */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200">
              <Users className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">My Leads</h1>
              <p className="text-red-400 text-xs hidden sm:block">Your captured leads and interaction activity</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
              <Calendar className="w-3.5 h-3.5"/>
              <span>May 1 – May 31, 2025</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {[
            { id:"leads",        label:"Captured Leads" },
            { id:"interactions", label:"My Activity"    },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 sm:px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap
                ${tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 sm:p-4 hover:border-red-300 transition-colors shadow-sm hover:shadow-md">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-lg shadow-red-200`}>
                <s.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="text-red-400 text-[9px] sm:text-[10px] leading-tight mb-0.5 truncate">{s.label}</div>
              <div className="text-red-900 font-bold text-base leading-tight">{s.value}</div>
              <div className="text-red-500 text-[10px] font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3"/>{s.change}
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 1: Leads trend + Source breakdown ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          {/* My Leads Trend */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-red-500"/>Leads Captured This Month
            </h3>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={LEADS_CHART} margin={{top:4,right:4,left:-24,bottom:0}}>
                <defs>
                  <linearGradient id="myLeadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE}/>
                <Area type="monotone" dataKey="v" name="Leads" stroke="#ef4444" strokeWidth={2.5} fill="url(#myLeadsGrad)"
                  dot={{fill:"#ef4444",r:3,stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Leads by Source */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Where Your Leads Come From</h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={SOURCES_PIE} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {SOURCES_PIE.map((d,i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">342</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {SOURCES_PIE.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1 truncate">{s.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Leads table + Activity chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Leads Table (read-only, click to view) */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "interactions" ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500"/>My Captured Leads
              </h3>
              <span className="text-red-400 text-[10px] font-medium">{filtered.length} leads</span>
            </div>

            {/* Mobile filter toggle */}
            <button onClick={() => setFiltersOpen(p => !p)}
              className="sm:hidden w-full flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg mb-2">
              <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5"/>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}/>
            </button>

            <div className={`${filtersOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row gap-2 mb-3`}>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
                  className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
              </div>
              <select value={srcFilter} onChange={e => setSrcFilter(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer">
                {["All Sources","NFC Scan","Website","Social Media","Email Campaign"].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={stFilter} onChange={e => setStFilter(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer">
                {["All Status","New","Contacted","Qualified","Converted"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[420px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Name","Email","Source","Status","Date"].map(h => (
                      <th key={h} className="text-left text-red-500 font-semibold px-3 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={5} className="text-center text-red-300 py-8">No leads match your search</td></tr>
                    : filtered.map(l => (
                      <tr key={l.id}
                        className="border-b border-red-50 hover:bg-red-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedLead(l)}>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${l.color} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>{l.av}</div>
                            <span className="text-red-900 font-medium">{l.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-red-500 text-[11px]">{l.email}</td>
                        <td className="px-3 py-2.5 text-red-600">{l.source}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={l.status}/></td>
                        <td className="px-3 py-2.5 text-red-400 text-[10px] whitespace-nowrap">{l.date.slice(0,12)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-red-400 text-xs">Showing {Math.min(filtered.length, MY_LEADS.length)} of {MY_LEADS.length}</span>
              <button className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                <Eye className="w-3.5 h-3.5"/> View All
              </button>
            </div>
          </div>

          {/* My Activity Chart */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab === "leads" ? "opacity-40 pointer-events-none" : ""}`}>
            <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-red-500"/>My Interaction Activity
            </h3>
            <div className="flex flex-wrap gap-3 mb-3">
              {[{l:"Card Scans",c:"#ef4444"},{l:"Profile Views",c:"#f87171"},{l:"Calls",c:"#fca5a5"},{l:"Messages",c:"#fecaca"}].map(s => (
                <div key={s.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-500 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={168}>
              <LineChart data={ACTIVITY_CHART} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE}/>
                <Line type="monotone" dataKey="cardScans"    name="Card Scans"    stroke="#ef4444" strokeWidth={2} dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="profileViews" name="Profile Views" stroke="#f87171" strokeWidth={2} dot={{r:3,fill:"#f87171",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="calls"        name="Calls"         stroke="#fca5a5" strokeWidth={2} dot={{r:3,fill:"#fca5a5",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="messages"     name="Messages"      stroke="#fecaca" strokeWidth={2} dot={{r:3,fill:"#fecaca",stroke:"#fff",strokeWidth:1.5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 3: Interaction types + Quick stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Interaction Breakdown */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Activity Breakdown</h3>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={INTERACT_PIE} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={2}>
                      {INTERACT_PIE.map((d,i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-sm">486</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="w-full space-y-1.5">
                {INTERACT_PIE.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{s.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Performance */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-4">Your Performance</h3>
            <div className="space-y-4">
              {[
                { label:"Conversion Rate",  value:7.0,  display:"7.0%",  max:100, hint:"+2.1% vs last month" },
                { label:"Response Rate",    value:68,   display:"68%",   max:100, hint:"Based on contacted leads" },
                { label:"NFC Scan Rate",    value:55,   display:"55%",   max:100, hint:"Out of total leads" },
                { label:"Profile Views",    value:42,   display:"42%",   max:100, hint:"Of card scans" },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-700 text-xs font-medium">{p.label}</span>
                    <span className="text-red-900 text-xs font-bold">{p.display}</span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mb-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600 transition-all"
                      style={{width:`${p.value}%`}}
                    />
                  </div>
                  <p className="text-red-400 text-[10px]">{p.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Insights */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500"/>Engagement Insights
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { l:"Peak Time",   v:"2–4 PM"    },
                { l:"Best Day",    v:"Wednesday" },
                { l:"Top Source",  v:"NFC Scan"  },
                { l:"Top Status",  v:"New Leads" },
              ].map(r => (
                <div key={r.l} className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <div className="text-red-400 text-[9px] mb-0.5">{r.l}</div>
                  <div className="text-red-900 text-xs font-bold">{r.v}</div>
                </div>
              ))}
            </div>

            {/* Quick action nudge */}
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 opacity-90 flex-shrink-0"/>
                <span className="text-xs font-bold">5 leads awaiting contact</span>
              </div>
              <p className="text-[10px] opacity-80 leading-relaxed">
                Follow up with your New leads to improve your conversion rate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedLead && (
        <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)}/>
      )}
    </div>
  );
}