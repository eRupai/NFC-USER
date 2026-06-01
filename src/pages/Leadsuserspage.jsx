import { useState, useMemo } from "react";
import {
  Menu, Search, Sun, Bell, Zap, ChevronDown, Filter,
  Users, Star, Target, UserCheck, TrendingUp, Activity,
  Download, X, CheckCircle2, ArrowUpRight, Plus,
  Smartphone, Globe, MoreHorizontal, Calendar, BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const LEADS = [
  { id:1,  name:"John Doe",       email:"john@example.com",     phone:"+1 555-0101", source:"NFC Scan",       status:"New",       date:"May 31, 2025 10:30 AM", av:"JD", color:"from-red-500 to-rose-600" },
  { id:2,  name:"Alice Smith",    email:"alice@example.com",    phone:"+1 555-0102", source:"Website",        status:"Contacted", date:"May 31, 2025 09:15 AM", av:"AS", color:"from-rose-500 to-red-700" },
  { id:3,  name:"Michael Lee",    email:"michael@example.com",  phone:"+1 555-0103", source:"Social Media",   status:"Qualified", date:"May 30, 2025 04:45 PM", av:"ML", color:"from-red-600 to-rose-500" },
  { id:4,  name:"Emma Brown",     email:"emma@example.com",     phone:"+1 555-0104", source:"NFC Scan",       status:"Converted", date:"May 30, 2025 03:20 PM", av:"EB", color:"from-rose-600 to-red-800" },
  { id:5,  name:"David Wilson",   email:"david@example.com",    phone:"+1 555-0105", source:"Email Campaign", status:"New",       date:"May 29, 2025 11:10 AM", av:"DW", color:"from-red-500 to-rose-700" },
  { id:6,  name:"Sarah Connor",   email:"sarah@example.com",    phone:"+1 555-0106", source:"Website",        status:"Contacted", date:"May 29, 2025 09:00 AM", av:"SC", color:"from-rose-500 to-red-600" },
  { id:7,  name:"James Taylor",   email:"james@example.com",    phone:"+1 555-0107", source:"NFC Scan",       status:"New",       date:"May 28, 2025 02:30 PM", av:"JT", color:"from-red-700 to-rose-500" },
  { id:8,  name:"Olivia Martin",  email:"olivia@example.com",   phone:"+1 555-0108", source:"Social Media",   status:"Qualified", date:"May 28, 2025 11:45 AM", av:"OM", color:"from-rose-700 to-red-500" },
  { id:9,  name:"Noah Garcia",    email:"noah@example.com",     phone:"+1 555-0109", source:"Email Campaign", status:"Converted", date:"May 27, 2025 03:00 PM", av:"NG", color:"from-red-600 to-rose-600" },
  { id:10, name:"Ava Martinez",   email:"ava@example.com",      phone:"+1 555-0110", source:"Website",        status:"New",       date:"May 27, 2025 10:15 AM", av:"AM", color:"from-rose-600 to-red-700" },
  { id:11, name:"Liam Johnson",   email:"liam@example.com",     phone:"+1 555-0111", source:"NFC Scan",       status:"Contacted", date:"May 26, 2025 04:00 PM", av:"LJ", color:"from-red-500 to-rose-800" },
  { id:12, name:"Sophia White",   email:"sophia@example.com",   phone:"+1 555-0112", source:"Social Media",   status:"Qualified", date:"May 26, 2025 01:30 PM", av:"SW", color:"from-rose-500 to-red-700" },
  { id:13, name:"Mason Harris",   email:"mason@example.com",    phone:"+1 555-0113", source:"Website",        status:"New",       date:"May 25, 2025 09:45 AM", av:"MH", color:"from-red-700 to-rose-600" },
  { id:14, name:"Isabella Clark", email:"isabella@example.com", phone:"+1 555-0114", source:"NFC Scan",       status:"Converted", date:"May 25, 2025 08:30 AM", av:"IC", color:"from-rose-700 to-red-600" },
  { id:15, name:"Ethan Lewis",    email:"ethan@example.com",    phone:"+1 555-0115", source:"Email Campaign", status:"Contacted", date:"May 24, 2025 03:15 PM", av:"EL", color:"from-red-600 to-rose-700" },
];

const TOP_USERS = [
  { name:"John Doe",     interactions:245, av:"JD", color:"from-red-500 to-rose-600" },
  { name:"Alice Smith",  interactions:189, av:"AS", color:"from-rose-500 to-red-700" },
  { name:"Michael Lee",  interactions:156, av:"ML", color:"from-red-600 to-rose-500" },
  { name:"Emma Brown",   interactions:142, av:"EB", color:"from-rose-600 to-red-800" },
  { name:"David Wilson", interactions:118, av:"DW", color:"from-red-500 to-rose-700" },
];

const LEADS_CHART = [
  {l:"May 1",v:800},{l:"May 6",v:1200},{l:"May 11",v:900},{l:"May 16",v:1500},
  {l:"May 21",v:1100},{l:"May 26",v:1800},{l:"May 31",v:2000},
];
const GROWTH_CHART = [
  {l:"May 1",v:1000},{l:"May 6",v:1800},{l:"May 11",v:2500},{l:"May 16",v:3200},
  {l:"May 21",v:4100},{l:"May 26",v:5500},{l:"May 31",v:6800},
];
const INTER_CHART = [
  {l:"May 1",  cardScans:700, profileViews:450, calls:200, messages:120},
  {l:"May 6",  cardScans:850, profileViews:520, calls:250, messages:160},
  {l:"May 11", cardScans:780, profileViews:490, calls:230, messages:140},
  {l:"May 16", cardScans:920, profileViews:600, calls:290, messages:190},
  {l:"May 21", cardScans:860, profileViews:550, calls:260, messages:170},
  {l:"May 26", cardScans:950, profileViews:680, calls:310, messages:210},
  {l:"May 31", cardScans:1000,profileViews:720, calls:330, messages:220},
];

const SOURCES_PIE  = [{name:"NFC Scan",value:32.5,fill:"#ef4444"},{name:"Website",value:24.3,fill:"#f87171"},{name:"Social Media",value:18.7,fill:"#fca5a5"},{name:"Email",value:12.4,fill:"#fecaca"},{name:"Others",value:12.1,fill:"#fee2e2"}];
const STATUS_PIE   = [{name:"New",value:52.4,fill:"#ef4444"},{name:"Contacted",value:24.6,fill:"#f87171"},{name:"Qualified",value:15.3,fill:"#fca5a5"},{name:"Converted",value:7.7,fill:"#fecaca"}];
const INTERACT_PIE = [{name:"Card Scans",value:45.2,fill:"#ef4444"},{name:"Profile Views",value:24.7,fill:"#f87171"},{name:"Phone Calls",value:15.3,fill:"#fca5a5"},{name:"Messages",value:10.1,fill:"#fecaca"},{name:"Others",value:4.7,fill:"#fee2e2"}];
const DEVICE_PIE   = [{name:"Android",value:62.4,fill:"#ef4444"},{name:"iOS",value:28.1,fill:"#f87171"},{name:"Web",value:6.3,fill:"#fca5a5"},{name:"Others",value:3.2,fill:"#fecaca"}];

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
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[status]||""}`}>{status}</span>;
}

// ─── LEAD MODAL ───────────────────────────────────────────────────────────────

function LeadModal({ lead, onClose, onStatusChange }) {
  const [status, setStatus] = useState(lead.status);
  const [note,   setNote]   = useState("");
  const [notes,  setNotes]  = useState(["Initial contact made via NFC card scan."]);

  const handleSave = () => {
    if (note.trim()) { setNotes(p=>[...p,note.trim()]); setNote(""); }
    onStatusChange(lead.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-100 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-red-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base">Lead Details</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="flex items-center gap-4 mb-5 bg-red-50 border border-red-100 rounded-xl p-4">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${lead.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>{lead.av}</div>
          <div className="flex-1 min-w-0">
            <div className="text-red-900 font-bold text-base">{lead.name}</div>
            <div className="text-red-400 text-xs">{lead.email}</div>
            <div className="text-red-400 text-xs">{lead.phone}</div>
          </div>
          <StatusBadge status={status}/>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[{l:"Source",v:lead.source},{l:"Captured On",v:lead.date}].map(r=>(
            <div key={r.l} className="bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="text-red-400 text-[10px] mb-0.5">{r.l}</div>
              <div className="text-red-900 text-xs font-semibold">{r.v}</div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-red-700 text-xs font-semibold block mb-2">Update Status</label>
          <div className="grid grid-cols-4 gap-1.5">
            {["New","Contacted","Qualified","Converted"].map(s=>(
              <button key={s} onClick={()=>setStatus(s)}
                className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${status===s?"bg-red-600 border-red-600 text-white shadow-md":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="text-red-700 text-xs font-semibold block mb-2">Notes</label>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2 space-y-1 max-h-20 overflow-y-auto">
            {notes.map((n,i)=>(
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 text-[10px] mt-0.5 flex-shrink-0">•</span>
                <span className="text-red-700 text-xs">{n}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..."
              onKeyDown={e=>{if(e.key==="Enter"&&note.trim()){setNotes(p=>[...p,note.trim()]);setNote("");}}}
              className="flex-1 bg-white border border-red-200 text-red-900 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
            <button onClick={()=>{if(note.trim()){setNotes(p=>[...p,note.trim()]);setNote("");}}}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all border border-red-200">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold bg-red-600 border-red-400 text-white">
      <CheckCircle2 className="w-4 h-4"/> {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function LeadsUsersPage({ onMenuClick }) {
  const [tab,          setTab]          = useState("leads");
  const [search,       setSearch]       = useState("");
  const [srcFilter,    setSrcFilter]    = useState("All Sources");
  const [stFilter,     setStFilter]     = useState("All Status");
  const [selectedLead, setSelectedLead] = useState(null);
  const [leads,        setLeads]        = useState(LEADS);
  const [toast,        setToast]        = useState("");
  const [chartRange,   setChartRange]   = useState("Daily");
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const filtered = useMemo(()=>leads.filter(l=>{
    const q = search.toLowerCase();
    return (!q||l.name.toLowerCase().includes(q)||l.email.toLowerCase().includes(q)||l.source.toLowerCase().includes(q))
      && (srcFilter==="All Sources"||l.source===srcFilter)
      && (stFilter==="All Status"||l.status===stFilter);
  }),[leads,search,srcFilter,stFilter]);

  const handleStatusChange = (id, status) => {
    setLeads(p=>p.map(l=>l.id===id?{...l,status}:l));
    showToast("Lead status updated successfully!");
  };

  const handleExport = () => {
    const hdr = "Name,Email,Phone,Source,Status,Date";
    const rows = filtered.map(l=>`${l.name},${l.email},${l.phone},${l.source},${l.status},${l.date}`);
    const blob = new Blob([[hdr,...rows].join("\n")],{type:"text/csv"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="leads.csv"; a.click();
    showToast("Leads exported!");
  };

  const STATS = [
    { Icon:Users,      bg:"from-red-500 to-rose-600",   label:"Total Leads",           value:"8,721",  change:"21.4%" },
    { Icon:Star,       bg:"from-rose-500 to-red-600",   label:"New Leads",             value:"2,450",  change:"18.6%" },
    { Icon:Target,     bg:"from-red-600 to-rose-700",   label:"Converted Leads",       value:"1,245",  change:"16.3%" },
    { Icon:UserCheck,  bg:"from-rose-600 to-red-800",   label:"Active Users",          value:"6,521",  change:"24.7%" },
    { Icon:TrendingUp, bg:"from-red-700 to-rose-600",   label:"Engagement Rate",       value:"78.45%", change:"12.8%" },
    { Icon:Activity,   bg:"from-rose-700 to-red-700",   label:"Avg Interactions/User", value:"5.6",    change:"11.3%" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title + Tabs */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200">
              <Users className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Leads &amp; Users</h1>
              <p className="text-red-400 text-xs hidden sm:block">Manage captured leads and user interactions</p>
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
          {[{id:"leads",label:"Captured Leads"},{id:"interactions",label:"User Interactions"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 sm:px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats — 2 cols mobile → 3 sm → 6 xl */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {STATS.map(s=>(
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

        {/* Row 1: Leads Chart + Source Pie + Status Pie — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Leads Overview */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-500"/>Leads Overview
              </h3>
              <div className="flex gap-1 bg-red-50 border border-red-100 rounded-lg p-0.5">
                {["Daily","Weekly","Monthly"].map(r=>(
                  <button key={r} onClick={()=>setChartRange(r)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${chartRange===r?"bg-red-600 text-white":"text-red-400 hover:text-red-700"}`}>{r}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={LEADS_CHART} margin={{top:4,right:4,left:-24,bottom:0}}>
                <defs>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE}/>
                <Area type="monotone" dataKey="v" name="Leads" stroke="#ef4444" strokeWidth={2.5} fill="url(#leadsGrad)"
                  dot={{fill:"#ef4444",r:3,stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Leads by Source */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Leads by Source</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={SOURCES_PIE} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {SOURCES_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">8,721</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {SOURCES_PIE.map(s=>(
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1 truncate">{s.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leads by Status */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Leads by Status</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={STATUS_PIE} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {STATUS_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">8,721</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {STATUS_PIE.map(s=>(
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{s.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Leads Table + Interactions Chart — stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Leads Table */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="interactions"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500"/>Captured Leads
              </h3>
              <button onClick={handleExport}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-all">
                <Download className="w-3 h-3"/>Export CSV
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button onClick={()=>setFiltersOpen(p=>!p)}
              className="sm:hidden w-full flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg mb-2">
              <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5"/>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen?"rotate-180":""}`}/>
            </button>

            <div className={`${filtersOpen?"flex":"hidden"} sm:flex flex-col sm:flex-row gap-2 mb-3`}>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..."
                  className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
              </div>
              <select value={srcFilter} onChange={e=>setSrcFilter(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer">
                {["All Sources","NFC Scan","Website","Social Media","Email Campaign"].map(o=><option key={o}>{o}</option>)}
              </select>
              <select value={stFilter} onChange={e=>setStFilter(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer">
                {["All Status","New","Contacted","Qualified","Converted"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Name","Email","Source","Status","Date",""].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-3 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0,6).length===0
                    ? <tr><td colSpan={6} className="text-center text-red-300 py-8">No leads found</td></tr>
                    : filtered.slice(0,6).map(l=>(
                    <tr key={l.id} className="border-b border-red-50 hover:bg-red-50/50 transition-colors cursor-pointer" onClick={()=>setSelectedLead(l)}>
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
                      <td className="px-3 py-2.5">
                        <button onClick={e=>{e.stopPropagation();setSelectedLead(l);}}>
                          <MoreHorizontal className="w-4 h-4 text-red-300 hover:text-red-600 transition-colors"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={()=>showToast("Loading all leads...")}
              className="w-full mt-3 text-red-500 hover:text-red-700 text-xs font-semibold py-2 transition-colors">
              View All Leads ({filtered.length})
            </button>
          </div>

          {/* User Interactions Chart */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="leads"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500"/>User Interactions Overview
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {[{l:"Card Scans",c:"#ef4444"},{l:"Profile Views",c:"#f87171"},{l:"Calls",c:"#fca5a5"},{l:"Messages",c:"#fecaca"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-500 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={INTER_CHART} margin={{top:4,right:4,left:-20,bottom:0}}>
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

        {/* Row 3: Interaction Types + Top Users + User Growth + Device — 2 cols sm, 4 xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Interaction Types Donut */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Interactions by Type</h3>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={INTERACT_PIE} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={2}>
                      {INTERACT_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-sm">18,742</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="w-full space-y-1.5">
                {INTERACT_PIE.map(s=>(
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{s.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Engaged Users */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm">Top Engaged Users</h3>
              <span className="text-red-400 text-[10px]">Interactions</span>
            </div>
            <div className="space-y-3">
              {TOP_USERS.map(u=>(
                <div key={u.name} className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm`}>{u.av}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-red-900 text-xs font-medium mb-1">{u.name}</div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-600"
                        style={{width:`${(u.interactions/245)*100}%`}}/>
                    </div>
                  </div>
                  <span className="text-red-900 text-xs font-bold flex-shrink-0">{u.interactions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500"/>User Growth
            </h3>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={GROWTH_CHART} margin={{top:4,right:4,left:-24,bottom:0}}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE}/>
                <Area type="monotone" dataKey="v" name="Users" stroke="#ef4444" strokeWidth={2} fill="url(#growthGrad)"
                  dot={{r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement by Device */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500"/>Engagement by Device
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={90} height={90}>
                  <PieChart>
                    <Pie data={DEVICE_PIE} cx="50%" cy="50%" innerRadius={24} outerRadius={40} dataKey="value" paddingAngle={2}>
                      {DEVICE_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {DEVICE_PIE.map(d=>(
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{d.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{l:"Peak Time",v:"2–4 PM"},{l:"Best Day",v:"Wednesday"}].map(r=>(
                <div key={r.l} className="bg-red-50 border border-red-100 rounded-lg p-2">
                  <div className="text-red-400 text-[9px] mb-0.5">{r.l}</div>
                  <div className="text-red-900 text-xs font-bold">{r.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedLead && <LeadModal lead={selectedLead} onClose={()=>setSelectedLead(null)} onStatusChange={handleStatusChange}/>}
      <Toast msg={toast} onClose={()=>setToast("")}/>
    </div>
  );
}