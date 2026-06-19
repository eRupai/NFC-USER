import { useState } from "react";
import {
  Calendar, CreditCard, Radio, Users, Star, BarChart2, CheckCircle2,
  MapPin, Smartphone, Clock, Globe, ArrowUpRight, X,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (scoped to this user's own cards) ───────────────────────────────────

const SCAN_DAILY   = [{l:"May 1",v:42},{l:"May 6",v:68},{l:"May 11",v:55},{l:"May 16",v:81},{l:"May 21",v:64},{l:"May 26",v:95},{l:"May 31",v:103}];
const SCAN_WEEKLY  = [{l:"W1",v:245},{l:"W2",v:312},{l:"W3",v:289},{l:"W4",v:376}];
const SCAN_MONTHLY = [{l:"Jan",v:820},{l:"Feb",v:940},{l:"Mar",v:870},{l:"Apr",v:1050},{l:"May",v:1222}];

const ENGAGE_DATA = [
  {l:"May 1",  newUsers:12, returning:25, inactive:8},
  {l:"May 6",  newUsers:18, returning:32, inactive:12},
  {l:"May 11", newUsers:14, returning:29, inactive:10},
  {l:"May 16", newUsers:22, returning:38, inactive:14},
  {l:"May 21", newUsers:19, returning:34, inactive:11},
  {l:"May 26", newUsers:26, returning:42, inactive:13},
  {l:"May 31", newUsers:28, returning:45, inactive:10},
];

const OS_DATA = [
  {l:"May 1",  android:26, ios:11, other:5 },
  {l:"May 6",  android:34, ios:14, other:6 },
  {l:"May 11", android:30, ios:13, other:5 },
  {l:"May 16", android:38, ios:16, other:7 },
  {l:"May 21", android:35, ios:15, other:6 },
  {l:"May 26", android:42, ios:17, other:8 },
  {l:"May 31", android:45, ios:18, other:9 },
];

const TOP_LOCATIONS = [
  {flag:"🇮🇳",country:"India",         scans:342},
  {flag:"🇺🇸",country:"United States", scans:218},
  {flag:"🇬🇧",country:"United Kingdom",scans:104},
  {flag:"🇨🇦",country:"Canada",        scans:61},
  {flag:"🇦🇺",country:"Australia",     scans:48},
  {flag:"🇩🇪",country:"Germany",       scans:39},
  {flag:"🇦🇪",country:"UAE",           scans:31},
  {flag:"🌍",country:"Others",         scans:179},
];

// User's own cards only
const MY_TOP_CARDS = [
  {name:"My Website Link",    scans:452, pct:100},
  {name:"My vCard",           scans:324, pct:72 },
  {name:"Instagram Profile",  scans:298, pct:66 },
  {name:"Office Location",    scans:187, pct:41 },
  {name:"Event Access Pass",  scans:134, pct:30 },
];

const DEVICES_PIE   = [{name:"Android",value:68.2,fill:"#ef4444"},{name:"iOS",value:27.6,fill:"#f87171"},{name:"Other",value:4.2,fill:"#fecaca"}];
const USER_TYPE_PIE = [{name:"New",value:28.1,fill:"#ef4444"},{name:"Returning",value:45.7,fill:"#f87171"},{name:"Inactive",value:26.2,fill:"#fecaca"}];

const MAP_DOTS = [
  {x:390,y:130,s:8,c:"#ef4444"},{x:200,y:140,s:7,c:"#ef4444"},
  {x:315,y:100,s:6,c:"#dc2626"},{x:220,y:170,s:5,c:"#fca5a5"},
  {x:460,y:200,s:4,c:"#fca5a5"},{x:330,y:105,s:4,c:"#fca5a5"},
  {x:380,y:140,s:3,c:"#b91c1c"},{x:470,y:110,s:3,c:"#fca5a5"},
  {x:230,y:200,s:3,c:"#dc2626"},
];

const TOOLTIP_STYLE = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function RangeToggle({ value, onChange }) {
  return (
    <div className="flex gap-0.5 bg-red-50 border border-red-200 rounded-lg p-0.5">
      {["Daily","Weekly","Monthly"].map(r => (
        <button key={r} onClick={()=>onChange(r)}
          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${value===r?"bg-red-600 text-white shadow-sm":"text-red-500 hover:text-red-700"}`}>
          {r}
        </button>
      ))}
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function UserScanAnalyticsPage({ onMenuClick }) {
  const [tab,       setTab]       = useState("scan");
  const [scanRange, setScanRange] = useState("Daily");
  const [engRange,  setEngRange]  = useState("Daily");
  const [osRange,   setOsRange]   = useState("Daily");
  const [period,    setPeriod]    = useState("This Month");
  const [toast,     setToast]     = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const scanData = scanRange==="Daily"?SCAN_DAILY:scanRange==="Weekly"?SCAN_WEEKLY:SCAN_MONTHLY;

  const TABS = [
    {id:"scan",     label:"Scan Activity",   Icon:Radio      },
    {id:"engage",   label:"Who's Scanning",  Icon:Users      },
    {id:"location", label:"Locations",       Icon:MapPin     },
    {id:"device",   label:"Devices",         Icon:Smartphone },
  ];

  const STATS = [
    {Icon:CreditCard,   bg:"from-red-500 to-rose-600",  label:"My Total Scans",   value:"1,222",  change:"32.7%"},
    {Icon:Radio,        bg:"from-rose-500 to-red-600",  label:"Unique Scans",     value:"874",    change:"28.4%"},
    {Icon:Users,        bg:"from-red-600 to-rose-700",  label:"People Reached",   value:"421",    change:"21.4%"},
    {Icon:Star,         bg:"from-rose-600 to-red-800",  label:"New Contacts",     value:"118",    change:"18.6%"},
    {Icon:BarChart2,    bg:"from-red-700 to-rose-600",  label:"Avg Scans / Day",  value:"39",     change:"14.3%"},
    {Icon:CheckCircle2, bg:"from-rose-700 to-red-700",  label:"Success Rate",     value:"98.7%",  change:"8.6%" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">

      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

        {/* Title + Period filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <BarChart2 className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">My Analytics</h1>
              <p className="text-red-400 text-xs hidden sm:block">Track how people interact with your NFC cards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs text-red-500">
              <Calendar className="w-3.5 h-3.5"/>May 1 – May 31, 2025
            </div>
            <select value={period} onChange={e=>setPeriod(e.target.value)}
              className="bg-white border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
              {["This Month","Last Month","Last 7 Days","Last 90 Days"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-4 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
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

        {/* Row 1: Scan Chart + Top Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* My Scan Activity */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab!=="scan"&&tab!=="engage"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500"/>My Scan Activity
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"/>
                  <span className="text-red-400 text-[10px]">Scans on my cards</span>
                </div>
              </div>
              <RangeToggle value={scanRange} onChange={setScanRange}/>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={scanData} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                <Area type="monotone" dataKey="v" name="Scans" stroke="#ef4444" strokeWidth={2.5}
                  fill="url(#scanGrad)" dot={{r:3.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Where Are People Scanning From */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab!=="scan"&&tab!=="location"?"opacity-40 pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500"/>Where People Scan Your Cards
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:flex-1">
                <svg viewBox="0 0 560 220" className="w-full" style={{height:100}}>
                  <rect width="560" height="220" fill="transparent"/>
                  <path d="M60,55 Q90,42 135,48 Q175,52 185,88 Q190,118 165,138 Q140,152 112,148 Q82,142 65,118 Q48,92 60,55Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M130,158 Q162,153 178,173 Q188,198 178,228 Q168,248 148,252 Q122,252 112,232 Q102,208 107,183 Q112,162 130,158Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M252,45 Q278,40 298,52 Q314,62 309,82 Q304,98 284,102 Q262,102 252,88 Q244,72 252,45Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M262,112 Q293,107 308,128 Q318,153 312,183 Q305,208 288,218 Q268,222 256,203 Q246,178 248,153 Q250,128 262,112Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M312,42 Q378,32 440,48 Q492,58 507,83 Q512,108 492,123 Q462,133 422,128 Q382,123 343,108 Q313,93 308,73 Q306,55 312,42Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M376,126 Q395,124 405,142 Q411,162 396,173 Q380,176 372,158 Q367,140 376,126Z" fill="#fecaca" opacity="0.6"/>
                  <path d="M448,182 Q488,178 508,198 Q518,216 508,230 Q494,242 470,240 Q447,236 439,218 Q433,200 448,182Z" fill="#fecaca" opacity="0.6"/>
                  {MAP_DOTS.map((d,i) => (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r={d.s+5} fill={d.c} opacity="0.15"/>
                      <circle cx={d.x} cy={d.y} r={d.s}   fill={d.c} opacity="0.9"/>
                      <circle cx={d.x} cy={d.y} r={d.s-2} fill="white" opacity="0.4"/>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="w-full sm:w-48 flex-shrink-0">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-0 sm:space-y-1.5">
                  {TOP_LOCATIONS.map(l => (
                    <div key={l.country} className="flex items-center gap-2">
                      <span className="text-sm flex-shrink-0">{l.flag}</span>
                      <span className="text-red-700 text-xs flex-1 truncate">{l.country}</span>
                      <span className="text-red-900 text-xs font-semibold">{l.scans.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Who's Scanning + Engagement Over Time + My Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Who's Scanning — User Type Donut */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="device"?"opacity-40 pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500"/>Who's Scanning Your Cards
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={USER_TYPE_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {USER_TYPE_PIE.map((d,i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11}} itemStyle={{color:"#ef4444"}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">421</span>
                  <span className="text-red-400 text-[8px]">People</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {USER_TYPE_PIE.map(u => (
                  <div key={u.name}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:u.fill}}/>
                      <span className="text-red-600 text-xs flex-1">{u.name}</span>
                      <span className="text-red-900 text-xs font-bold">{u.value}%</span>
                    </div>
                    <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${u.value}%`,background:u.fill}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scan Engagement Over Time */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="device"||tab==="location"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-900 font-semibold text-sm">Scan Engagement</h3>
              <RangeToggle value={engRange} onChange={setEngRange}/>
            </div>
            <div className="flex flex-wrap gap-3 mb-2">
              {[{l:"New",c:"#ef4444"},{l:"Returning",c:"#f87171"},{l:"Inactive",c:"#fca5a5"}].map(s => (
                <div key={s.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={ENGAGE_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                <Line type="monotone" dataKey="newUsers"  name="New"       stroke="#ef4444" strokeWidth={2} dot={{r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="returning" name="Returning" stroke="#f87171" strokeWidth={2} dot={{r:2.5,fill:"#f87171",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="inactive"  name="Inactive"  stroke="#fca5a5" strokeWidth={2} dot={{r:2.5,fill:"#fca5a5",stroke:"#fff",strokeWidth:1.5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* My Top Cards by Scans */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="location"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500"/>My Top Cards
              </h3>
            </div>
            <div className="space-y-3">
              {MY_TOP_CARDS.map((c,i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-red-200">
                    {i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-900 text-xs font-medium truncate">{c.name}</span>
                      <span className="text-red-900 text-xs font-bold ml-2 flex-shrink-0">{c.scans.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{width:`${c.pct}%`}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Device Breakdown + OS Chart + My Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Device Breakdown */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="engage"||tab==="location"?"opacity-40 pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500"/>Devices Used to Scan
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={DEVICES_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {DEVICES_PIE.map((d,i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11}} itemStyle={{color:"#ef4444"}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">1,222</span>
                  <span className="text-red-400 text-[8px]">Scans</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {DEVICES_PIE.map(d => (
                  <div key={d.name}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                      <span className="text-red-600 text-xs flex-1">{d.name}</span>
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

          {/* OS Breakdown */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 shadow-sm transition-opacity ${tab==="engage"||tab==="location"?"opacity-40 pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-red-900 font-semibold text-sm">OS Breakdown</h3>
              <RangeToggle value={osRange} onChange={setOsRange}/>
            </div>
            <div className="flex flex-wrap gap-3 mb-2">
              {[{l:"Android",c:"#ef4444"},{l:"iOS",c:"#f87171"},{l:"Other",c:"#fca5a5"}].map(s => (
                <div key={s.l} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={OS_DATA} margin={{top:4,right:4,left:-20,bottom:0}} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                <Bar dataKey="android" name="Android" stackId="a" fill="#ef4444" radius={[0,0,0,0]}/>
                <Bar dataKey="ios"     name="iOS"     stackId="a" fill="#f87171"/>
                <Bar dataKey="other"   name="Other"   stackId="a" fill="#fca5a5" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* My Quick Insights */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-red-500"/>My Insights
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                {Icon:Calendar,  bg:"bg-red-100",  ic:"text-red-600",  label:"Best Day",    val:"May 20",  sub:"81 Scans"   },
                {Icon:Clock,     bg:"bg-rose-100", ic:"text-rose-600", label:"Peak Hour",   val:"2:00 PM", sub:"Most active"},
                {Icon:Globe,     bg:"bg-red-100",  ic:"text-red-600",  label:"Top Country", val:"India",   sub:"342 Scans"  },
                {Icon:Smartphone,bg:"bg-rose-100", ic:"text-rose-600", label:"Top Device",  val:"Android", sub:"68.2%"      },
              ].map(q => (
                <div key={q.label} className="bg-red-50 border border-red-100 rounded-xl p-2.5">
                  <div className={`w-6 h-6 rounded-lg ${q.bg} flex items-center justify-center mb-1.5`}>
                    <q.Icon className={`w-3.5 h-3.5 ${q.ic}`}/>
                  </div>
                  <div className="text-red-400 text-[9px] mb-0.5">{q.label}</div>
                  <div className="text-red-900 font-bold text-xs">{q.val}</div>
                  <div className="text-red-400 text-[9px]">{q.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-red-100 pt-3">
              {[
                {label:"Avg. Scan Duration",  val:"3m 24s"},
                {label:"Bounce Rate",         val:"12.4%" },
                {label:"Repeat Scan Rate",    val:"45.7%" },
                {label:"Cards with 0 Scans",  val:"3"     },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-red-500 text-xs">{r.label}</span>
                  <span className="text-red-900 text-xs font-semibold">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast} onClose={()=>setToast("")}/>
    </div>
  );
}