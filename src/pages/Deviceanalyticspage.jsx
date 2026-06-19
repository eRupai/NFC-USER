import { useState } from "react";
import {
  Smartphone, Download, Calendar, ArrowUpRight, CheckCircle2, X,
  Monitor, Tablet, Cpu, Wifi, Battery, Signal, BarChart2,
  TrendingUp, RefreshCw, Star, Clock, Zap, Globe, Shield,
  Activity, Filter, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped) ───────────────────────────────────────────────────────

const OS_DAILY = [
  { l:"May 1",  android:52, ios:21, windows:5, other:1 },
  { l:"May 6",  android:68, ios:28, windows:7, other:2 },
  { l:"May 11", android:61, ios:25, windows:6, other:1 },
  { l:"May 16", android:76, ios:31, windows:8, other:2 },
  { l:"May 21", android:70, ios:29, windows:8, other:2 },
  { l:"May 26", android:81, ios:33, windows:9, other:2 },
  { l:"May 31", android:85, ios:35, windows:10,other:3 },
];
const OS_WEEKLY = [
  { l:"W1", android:310, ios:132, windows:34, other:9  },
  { l:"W2", android:385, ios:164, windows:42, other:11 },
  { l:"W3", android:352, ios:150, windows:39, other:10 },
  { l:"W4", android:420, ios:178, windows:46, other:12 },
];
const OS_MONTHLY = [
  { l:"Jan", android:1200, ios:510, windows:134, other:36 },
  { l:"Feb", android:1450, ios:620, windows:162, other:43 },
  { l:"Mar", android:1320, ios:560, windows:148, other:39 },
  { l:"Apr", android:1600, ios:680, windows:178, other:47 },
  { l:"May", android:1740, ios:736, windows:193, other:51 },
];

const SESSION_DAILY = [
  { l:"May 1",  avg:2.8, peak:5.1 },
  { l:"May 6",  avg:3.2, peak:5.8 },
  { l:"May 11", avg:3.0, peak:5.4 },
  { l:"May 16", avg:3.5, peak:6.2 },
  { l:"May 21", avg:3.3, peak:5.9 },
  { l:"May 26", avg:3.7, peak:6.6 },
  { l:"May 31", avg:3.9, peak:7.0 },
];
const SESSION_WEEKLY = [
  { l:"W1", avg:3.0, peak:5.5 },
  { l:"W2", avg:3.4, peak:6.2 },
  { l:"W3", avg:3.2, peak:5.9 },
  { l:"W4", avg:3.8, peak:6.8 },
];
const SESSION_MONTHLY = [
  { l:"Jan", avg:2.5, peak:4.8 },
  { l:"Feb", avg:2.9, peak:5.3 },
  { l:"Mar", avg:3.1, peak:5.6 },
  { l:"Apr", avg:3.4, peak:6.1 },
  { l:"May", avg:3.7, peak:6.8 },
];

const DEVICE_PIE = [
  { name:"Android",  value:67.8, fill:"#ef4444" },
  { name:"iOS",      value:28.6, fill:"#f87171" },
  { name:"Windows",  value:2.9,  fill:"#fca5a5" },
  { name:"Other",    value:0.7,  fill:"#fecaca" },
];
const FORM_PIE = [
  { name:"Smartphone", value:78.4, fill:"#ef4444" },
  { name:"Tablet",     value:14.2, fill:"#f87171" },
  { name:"Desktop",    value:5.8,  fill:"#fca5a5" },
  { name:"Wearable",   value:1.6,  fill:"#fecaca" },
];
const BROWSER_PIE = [
  { name:"Chrome",  value:48.3, fill:"#ef4444" },
  { name:"Safari",  value:30.1, fill:"#f87171" },
  { name:"Firefox", value:10.4, fill:"#fca5a5" },
  { name:"Samsung", value:7.8,  fill:"#fecaca" },
  { name:"Other",   value:3.4,  fill:"#fee2e2" },
];

const TOP_DEVICES = [
  { model:"Samsung Galaxy S24", os:"Android 14", scans:284, share:100, icon:"📱" },
  { model:"iPhone 15 Pro",      os:"iOS 17",     scans:219, share:77,  icon:"📱" },
  { model:"iPhone 14",          os:"iOS 16",     scans:165, share:58,  icon:"📱" },
  { model:"Samsung Galaxy A54", os:"Android 13", scans:142, share:50,  icon:"📱" },
  { model:"Google Pixel 8",     os:"Android 14", scans:118, share:42,  icon:"📱" },
  { model:"OnePlus 12",         os:"Android 14", scans:98,  share:35,  icon:"📱" },
  { model:"iPad Pro",           os:"iPadOS 17",  scans:76,  share:27,  icon:"📟" },
  { model:"Redmi Note 13",      os:"Android 13", scans:64,  share:23,  icon:"📱" },
];

const OS_VERSIONS = [
  { version:"Android 14", count:984, pct:100, color:"#ef4444" },
  { version:"iOS 17",     count:542, pct:55,  color:"#f87171" },
  { version:"Android 13", count:412, pct:42,  color:"#fca5a5" },
  { version:"iOS 16",     count:284, pct:29,  color:"#fca5a5" },
  { version:"Android 12", count:168, pct:17,  color:"#fecaca" },
  { version:"Other",      count:146, pct:15,  color:"#fee2e2" },
];

const SCREEN_DATA = [
  { range:'< 5"',   count:124 },
  { range:'5–6"',   count:842 },
  { range:'6–6.5"', count:918 },
  { range:'6.5–7"', count:432 },
  { range:'> 7"',   count:220 },
];

const RADAR_DATA = [
  { metric:"NFC Support",  android:92, ios:88, windows:45 },
  { metric:"App Version",   android:85, ios:90, windows:60 },
  { metric:"Battery Life",  android:78, ios:82, windows:55 },
  { metric:"Connectivity",  android:88, ios:84, windows:70 },
  { metric:"Scan Speed",    android:90, ios:86, windows:50 },
  { metric:"Performance",   android:83, ios:91, windows:65 },
];

const PERFORMANCE_STATS = [
  { label:"Avg. Scan Time",    value:"1.2s",  sub:"Best: 0.4s",   Icon:Zap,      bg:"from-red-500 to-rose-600" },
  { label:"NFC Read Success",  value:"98.7%", sub:"+0.3% this wk", Icon:Shield,  bg:"from-rose-500 to-red-600" },
  { label:"App Crash Rate",    value:"0.12%", sub:"↓ 0.04%",      Icon:Activity, bg:"from-red-600 to-rose-700" },
  { label:"Avg. Session",      value:"3m 42s",sub:"+14s vs last",  Icon:Clock,   bg:"from-rose-600 to-red-800" },
  { label:"Bluetooth Active",  value:"84.2%", sub:"of sessions",   Icon:Wifi,    bg:"from-red-700 to-rose-600" },
  { label:"Low Battery Exits", value:"2.4%",  sub:"↓ 0.8%",       Icon:Battery, bg:"from-rose-700 to-red-700" },
];

const TOOLTIP_STYLE = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:8, fontSize:11 },
  labelStyle:{ color:"#991b1b" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function RangeToggle({ value, onChange }) {
  return (
    <div className="flex gap-0.5 bg-red-50 border border-red-200 rounded-lg p-0.5">
      {["Daily","Weekly","Monthly"].map(r => (
        <button key={r} onClick={() => onChange(r)}
          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${value===r?"bg-red-600 text-white shadow-sm":"text-red-500 hover:text-red-700"}`}>
          {r}
        </button>
      ))}
    </div>
  );
}

function DonutCard({ title, Icon, data, center, centerSub }) {
  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-red-500"/>{title}
      </h3>
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                {data.map((d,i) => <Cell key={i} fill={d.fill}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11}} itemStyle={{color:"#ef4444"}} formatter={v=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-red-900 font-bold text-xs leading-tight">{center}</span>
            <span className="text-red-400 text-[8px]">{centerSub}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map(d => (
            <div key={d.name}>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                <span className="text-red-600 text-xs flex-1 truncate">{d.name}</span>
                <span className="text-red-900 text-xs font-bold">{d.value}%</span>
              </div>
              <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${d.value}%`,background:d.fill}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold bg-red-600 border-red-400 text-white">
      <CheckCircle2 className="w-4 h-4"/>{msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function UserDeviceAnalyticsPage({ onMenuClick }) {
  const [tab,       setTab]       = useState("overview");
  const [osRange,   setOsRange]   = useState("Daily");
  const [sessRange, setSessRange] = useState("Daily");
  const [period,    setPeriod]    = useState("This Month");
  const [toast,     setToast]     = useState("");

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const osData   = osRange   === "Daily" ? OS_DAILY   : osRange   === "Weekly" ? OS_WEEKLY   : OS_MONTHLY;
  const sessData = sessRange === "Daily" ? SESSION_DAILY : sessRange === "Weekly" ? SESSION_WEEKLY : SESSION_MONTHLY;

  const handleExport = () => {
    const rows = TOP_DEVICES.map(d => `${d.model},${d.os},${d.scans}`);
    const blob = new Blob([["Model,OS,Scans",...rows].join("\n")],{type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my_device_analytics.csv";
    a.click();
    showToast("Report exported!");
  };

  const TABS = [
    { id:"overview",    label:"Overview",      Icon:BarChart2   },
    { id:"os",          label:"OS & Platform", Icon:Cpu         },
    { id:"devices",     label:"My Devices",    Icon:Smartphone  },
    { id:"performance", label:"Performance",   Icon:Activity    },
  ];

  const STATS = [
    { Icon:Smartphone, bg:"from-red-500 to-rose-600", label:"Total Scans",   value:"2,543",  change:"+18.4%" },
    { Icon:Monitor,    bg:"from-rose-500 to-red-600", label:"Unique Devices",value:"321",    change:"+14.2%" },
    { Icon:Cpu,        bg:"from-red-600 to-rose-700", label:"Android Share", value:"67.8%",  change:"+2.1%"  },
    { Icon:Tablet,     bg:"from-rose-600 to-red-800", label:"iOS Share",     value:"28.6%",  change:"+0.8%"  },
    { Icon:TrendingUp, bg:"from-red-700 to-rose-600", label:"Top Device",    value:"S24",    change:"11.2%"  },
    { Icon:Zap,        bg:"from-rose-700 to-red-700", label:"Avg Scan Speed",value:"1.2s",   change:"↓ 0.3s" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

        {/* ── Title + Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Device Analytics</h1>
              <p className="text-red-400 text-xs hidden sm:block">Who's scanning your NFC cards and with which device</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
              <Calendar className="w-3.5 h-3.5"/>May 1 – May 31, 2025
            </div>
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="bg-white border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              {["This Month","Last Month","Last 7 Days","Last 90 Days"].map(o => <option key={o}>{o}</option>)}
            </select>
            <button onClick={handleExport}
              className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all shadow-sm">
              <Download className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-0 mb-4 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 hover:border-red-300 transition-colors shadow-sm hover:shadow-md">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-md shadow-red-100`}>
                <s.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="text-red-400 text-[9px] leading-tight mb-0.5 truncate">{s.label}</div>
              <div className="text-red-900 font-bold text-sm leading-tight">{s.value}</div>
              <div className="text-red-500 text-[10px] font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3"/>{s.change}
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 1: OS Stacked Bar + Session Duration ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="devices"||tab==="performance"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-500"/>Visitor OS Over Time
              </h3>
              <RangeToggle value={osRange} onChange={setOsRange}/>
            </div>
            <div className="flex flex-wrap gap-3 mb-2">
              {[{l:"Android",c:"#ef4444"},{l:"iOS",c:"#f87171"},{l:"Windows",c:"#fca5a5"},{l:"Other",c:"#fecaca"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={osData} margin={{top:4,right:4,left:-20,bottom:0}} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                <Bar dataKey="android" name="Android" stackId="a" fill="#ef4444"/>
                <Bar dataKey="ios"     name="iOS"     stackId="a" fill="#f87171"/>
                <Bar dataKey="windows" name="Windows" stackId="a" fill="#fca5a5"/>
                <Bar dataKey="other"   name="Other"   stackId="a" fill="#fecaca" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="os"||tab==="devices"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500"/>My Session Duration (min)
              </h3>
              <RangeToggle value={sessRange} onChange={setSessRange}/>
            </div>
            <div className="flex flex-wrap gap-3 mb-2">
              {[{l:"Average",c:"#ef4444"},{l:"Peak",c:"#fca5a5"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <AreaChart data={sessData} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#fca5a5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}} formatter={v=>`${v} min`}/>
                <Area type="monotone" dataKey="avg"  name="Average" stroke="#ef4444" strokeWidth={2.5} fill="url(#avgGrad)"  dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                <Area type="monotone" dataKey="peak" name="Peak"    stroke="#fca5a5" strokeWidth={2}   fill="url(#peakGrad)" dot={{r:3,fill:"#fca5a5",stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Three Donuts ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className={`transition-opacity ${tab==="devices"?"opacity-40 pointer-events-none":""}`}>
            <DonutCard title="Visitor OS" Icon={Cpu} data={DEVICE_PIE} center="2,543" centerSub="Scans"/>
          </div>
          <div className={`transition-opacity ${tab==="os"||tab==="performance"?"opacity-40 pointer-events-none":""}`}>
            <DonutCard title="Form Factor" Icon={Tablet} data={FORM_PIE} center="78.4%" centerSub="Mobile"/>
          </div>
          <div className={`transition-opacity ${tab==="devices"?"opacity-40 pointer-events-none":""}`}>
            <DonutCard title="Browser" Icon={Globe} data={BROWSER_PIE} center="Chrome" centerSub="48.3%"/>
          </div>
        </div>

        {/* ── Row 3: Top Devices + OS Versions + Screen Size ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          <div className={`lg:col-span-2 bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="os"||tab==="performance"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-red-500"/>Visitor Devices
              </h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-semibold">
                  <Filter className="w-3 h-3"/>Filter
                </button>
                <button onClick={() => showToast("Loading all devices...")} className="text-red-500 hover:text-red-700 text-[10px] font-semibold">View All</button>
              </div>
            </div>
            <div className="space-y-2.5">
              {TOP_DEVICES.map((d,i) => (
                <div key={d.model}
                  className="flex items-center gap-3 p-2.5 bg-red-50/60 hover:bg-red-50 border border-red-100 hover:border-red-200 rounded-xl transition-all cursor-pointer group"
                  onClick={() => showToast(`Viewing ${d.model} details`)}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-red-200">
                    {i+1}
                  </div>
                  <div className="text-xl flex-shrink-0">{d.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-red-900 text-xs font-semibold truncate">{d.model}</span>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md flex-shrink-0">{d.os}</span>
                      </div>
                      <span className="text-red-900 text-xs font-bold ml-2 flex-shrink-0">{d.scans.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{width:`${d.share}%`}}/>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-red-300 group-hover:text-red-500 flex-shrink-0 transition-colors"/>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="devices"||tab==="performance"?"opacity-40 pointer-events-none":""}`}>
              <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-red-500"/>OS Versions
              </h3>
              <div className="space-y-2.5">
                {OS_VERSIONS.map(v => (
                  <div key={v.version} className="flex items-center gap-2">
                    <span className="text-red-700 text-[11px] font-medium w-24 flex-shrink-0 truncate">{v.version}</span>
                    <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{width:`${v.pct}%`,background:v.color}}/>
                    </div>
                    <span className="text-red-900 text-[11px] font-bold w-10 text-right flex-shrink-0">{v.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm flex-1 transition-opacity ${tab==="os"||tab==="performance"?"opacity-40 pointer-events-none":""}`}>
              <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-500"/>Screen Size Distribution
              </h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={SCREEN_DATA} margin={{top:4,right:4,left:-20,bottom:0}} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                  <XAxis dataKey="range" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                  <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                  <Bar dataKey="count" name="Devices" fill="#ef4444" radius={[4,4,0,0]}
                    label={{position:"top",fontSize:7,fill:"#f87171",formatter:v=>v}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Row 4: Radar + Performance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="devices"||tab==="os"?"opacity-40 pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-red-500"/>Device Capability Score
            </h3>
            <p className="text-red-400 text-[10px] mb-3">Capability index of devices used to scan your cards</p>
            <div className="flex flex-wrap gap-3 mb-1">
              {[{l:"Android",c:"#ef4444"},{l:"iOS",c:"#f87171"},{l:"Windows",c:"#fca5a5"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA} margin={{top:10,right:20,bottom:10,left:20}}>
                <PolarGrid stroke="#fecaca"/>
                <PolarAngleAxis dataKey="metric" tick={{fontSize:9,fill:"#f87171"}}/>
                <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fontSize:7,fill:"#fca5a5"}} tickCount={4}/>
                <Radar name="Android" dataKey="android" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2}/>
                <Radar name="iOS"     dataKey="ios"     stroke="#f87171" fill="#f87171" fillOpacity={0.10} strokeWidth={2}/>
                <Radar name="Windows" dataKey="windows" stroke="#fca5a5" fill="#fca5a5" fillOpacity={0.08} strokeWidth={1.5}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="os"||tab==="devices"?"opacity-40 pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500"/>My Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {PERFORMANCE_STATS.map(s => (
                <div key={s.label} className="bg-red-50 border border-red-100 hover:border-red-300 rounded-xl p-3 transition-colors">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-sm shadow-red-100`}>
                    <s.Icon className="w-3.5 h-3.5 text-white"/>
                  </div>
                  <div className="text-red-400 text-[9px] leading-tight mb-0.5">{s.label}</div>
                  <div className="text-red-900 font-bold text-sm leading-tight">{s.value}</div>
                  <div className="text-red-500 text-[10px] mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-red-100 pt-3 space-y-2">
              {[
                {label:"NFC Chip: Type 2",pct:48},
                {label:"NFC Chip: Type 4",pct:35},
                {label:"NFC Chip: Type 5",pct:17},
              ].map(r => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="text-red-500 text-xs w-32 flex-shrink-0">{r.label}</span>
                  <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{width:`${r.pct}%`}}/>
                  </div>
                  <span className="text-red-900 text-xs font-semibold w-8 text-right flex-shrink-0">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast} onClose={() => setToast("")}/>
    </div>
  );
}