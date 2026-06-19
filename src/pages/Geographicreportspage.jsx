import { useState } from "react";
import {
  Globe2, MapPin, Download, Calendar, ArrowUpRight,
  CheckCircle2, X, TrendingUp, Users, Radio, BarChart2,
  Navigation, Layers, Filter,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped) ───────────────────────────────────────────────────────

const COUNTRIES = [
  { flag:"🇮🇳", country:"India",          city:"Mumbai",    scans:1245, pct:100, growth:"+24.3%" },
  { flag:"🇺🇸", country:"United States",  city:"New York",  scans:782,  pct:63,  growth:"+18.7%" },
  { flag:"🇬🇧", country:"United Kingdom", city:"London",    scans:354,  pct:30,  growth:"+12.1%" },
  { flag:"🇨🇦", country:"Canada",         city:"Toronto",   scans:212,  pct:17,  growth:"+9.4%"  },
  { flag:"🇦🇺", country:"Australia",      city:"Sydney",    scans:164,  pct:14,  growth:"+7.8%"  },
  { flag:"🇩🇪", country:"Germany",        city:"Berlin",    scans:134,  pct:11,  growth:"+6.2%"  },
  { flag:"🇦🇪", country:"UAE",            city:"Dubai",     scans:108,  pct:9,   growth:"+15.5%" },
  { flag:"🇸🇬", country:"Singapore",      city:"Singapore", scans:84,   pct:7,   growth:"+21.0%" },
];

const CITIES = [
  { city:"Mumbai",    country:"India",   scans:532, pct:100 },
  { city:"New York",  country:"USA",     scans:400, pct:75  },
  { city:"London",    country:"UK",      scans:324, pct:61  },
  { city:"Dubai",     country:"UAE",     scans:248, pct:46  },
  { city:"Toronto",   country:"Canada",  scans:192, pct:36  },
  { city:"Sydney",    country:"AUS",     scans:152, pct:29  },
  { city:"Berlin",    country:"Germany", scans:123, pct:23  },
  { city:"Singapore", country:"SGP",     scans:84,  pct:16  },
];

const REGION_DATA = [
  { name:"Asia Pacific",  value:44.2, fill:"#ef4444" },
  { name:"North America", value:28.6, fill:"#f87171" },
  { name:"Europe",        value:18.3, fill:"#fca5a5" },
  { name:"Middle East",   value:6.8,  fill:"#fecaca" },
  { name:"Others",        value:2.1,  fill:"#fee2e2" },
];

const TREND_DAILY = [
  { l:"May 1",  asia:48, na:28, eu:14 },
  { l:"May 6",  asia:62, na:38, eu:19 },
  { l:"May 11", asia:57, na:32, eu:16 },
  { l:"May 16", asia:74, na:43, eu:22 },
  { l:"May 21", asia:69, na:39, eu:20 },
  { l:"May 26", asia:82, na:49, eu:24 },
  { l:"May 31", asia:87, na:52, eu:26 },
];
const TREND_WEEKLY = [
  { l:"W1", asia:310, na:182, eu:92  },
  { l:"W2", asia:385, na:224, eu:113 },
  { l:"W3", asia:352, na:205, eu:104 },
  { l:"W4", asia:420, na:246, eu:125 },
];
const TREND_MONTHLY = [
  { l:"Jan", asia:1200, na:720,  eu:360 },
  { l:"Feb", asia:1450, na:840,  eu:420 },
  { l:"Mar", asia:1320, na:780,  eu:390 },
  { l:"Apr", asia:1600, na:920,  eu:460 },
  { l:"May", asia:1780, na:1040, eu:520 },
];
const GROWTH_DATA = [
  { l:"Jan", India:520, USA:310, UK:150 },
  { l:"Feb", India:580, USA:350, UK:170 },
  { l:"Mar", India:610, USA:380, UK:190 },
  { l:"Apr", India:670, USA:410, UK:200 },
  { l:"May", India:745, USA:458, UK:215 },
];

const SCAN_HOTSPOTS = [
  { label:"Connaught Place, Delhi", country:"🇮🇳", scans:240, type:"Business Hub"  },
  { label:"Times Square, NYC",      country:"🇺🇸", scans:205, type:"Tourist Area"  },
  { label:"Canary Wharf, London",   country:"🇬🇧", scans:189, type:"Business Hub"  },
  { label:"Dubai Mall, Dubai",      country:"🇦🇪", scans:178, type:"Retail"        },
  { label:"BKC, Mumbai",            country:"🇮🇳", scans:172, type:"Business Hub"  },
  { label:"Shibuya, Tokyo",         country:"🇯🇵", scans:165, type:"Tourist Area"  },
];

const MAP_DOTS = [
  { x:390, y:125, s:10, c:"#ef4444", label:"India" },
  { x:195, y:130, s:8,  c:"#ef4444", label:"USA"   },
  { x:310, y:90,  s:6,  c:"#dc2626", label:"UK"    },
  { x:325, y:95,  s:5,  c:"#fca5a5", label:"DE"    },
  { x:460, y:115, s:5,  c:"#fca5a5", label:"AUS"   },
  { x:365, y:107, s:6,  c:"#f87171", label:"UAE"   },
  { x:440, y:130, s:4,  c:"#fca5a5", label:"SGP"   },
  { x:235, y:118, s:4,  c:"#fca5a5", label:"CAN"   },
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

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold bg-red-600 border-red-400 text-white">
      <CheckCircle2 className="w-4 h-4"/>{msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function UserGeographicReportsPage({ onMenuClick }) {
  const [tab,        setTab]        = useState("overview");
  const [trendRange, setTrendRange] = useState("Daily");
  const [period,     setPeriod]     = useState("This Month");
  const [toast,      setToast]      = useState({ msg:"", type:"success" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"" }), 3000);
  };

  const trendData = trendRange==="Daily" ? TREND_DAILY : trendRange==="Weekly" ? TREND_WEEKLY : TREND_MONTHLY;

  const handleExport = () => {
    const rows = COUNTRIES.map(c => `${c.country},${c.scans},${c.growth}`);
    const blob = new Blob([["Country,Scans,Growth",...rows].join("\n")], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my_geographic_report.csv";
    a.click();
    showToast("Report exported!");
  };

  const TABS = [
    { id:"overview",  label:"Overview",   Icon:Globe2      },
    { id:"countries", label:"Countries",  Icon:MapPin      },
    { id:"cities",    label:"Top Cities", Icon:Navigation  },
    { id:"hotspots",  label:"Hotspots",   Icon:Layers      },
  ];

  const STATS = [
    { Icon:Globe2,     bg:"from-red-500 to-rose-600",  label:"Countries Reached", value:"38",    change:"+5 new"  },
    { Icon:MapPin,     bg:"from-rose-500 to-red-600",  label:"Cities Reached",    value:"24",    change:"+3 new"  },
    { Icon:Radio,      bg:"from-red-600 to-rose-700",  label:"My Global Scans",   value:"2,543", change:"+28.4%"  },
    { Icon:Users,      bg:"from-rose-600 to-red-800",  label:"Unique Visitors",   value:"921",   change:"+21.4%"  },
    { Icon:TrendingUp, bg:"from-red-700 to-rose-600",  label:"Fastest Growing",   value:"India", change:"+24.3%"  },
    { Icon:BarChart2,  bg:"from-rose-700 to-red-700",  label:"Top Continent",     value:"Asia",  change:"44.2%"   },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

        {/* ── Title + Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <Globe2 className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Geographic Reports</h1>
              <p className="text-red-400 text-xs hidden sm:block">See where your NFC cards are being scanned worldwide</p>
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

        {/* ── Stats ── */}
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

        {/* ── Overview Tab ── */}
        {tab === "overview" && (
          <div className="space-y-4">
            {/* Map + Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-red-500"/>Where Your Cards Are Scanned
                </h3>
                <svg viewBox="0 0 560 220" className="w-full rounded-lg" style={{ height:130, background:"linear-gradient(135deg,#fff5f5,#fef2f2)" }}>
                  <path d="M60,55 Q90,42 135,48 Q175,52 185,88 Q190,118 165,138 Q140,152 112,148 Q82,142 65,118 Q48,92 60,55Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M130,158 Q162,153 178,173 Q188,198 178,228 Q168,248 148,252 Q122,252 112,232 Q102,208 107,183 Q112,162 130,158Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M252,45 Q278,40 298,52 Q314,62 309,82 Q304,98 284,102 Q262,102 252,88 Q244,72 252,45Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M262,112 Q293,107 308,128 Q318,153 312,183 Q305,208 288,218 Q268,222 256,203 Q246,178 248,153 Q250,128 262,112Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M312,42 Q378,32 440,48 Q492,58 507,83 Q512,108 492,123 Q462,133 422,128 Q382,123 343,108 Q313,93 308,73 Q306,55 312,42Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M316,106 Q336,102 348,116 Q354,132 344,142 Q330,146 320,136 Q312,124 316,106Z" fill="#fecaca" opacity="0.7"/>
                  <path d="M448,158 Q488,154 508,174 Q518,192 508,206 Q494,218 470,216 Q447,212 439,194 Q433,176 448,158Z" fill="#fecaca" opacity="0.7"/>
                  {MAP_DOTS.map((d,i) => (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r={d.s+6} fill={d.c} opacity="0.12"/>
                      <circle cx={d.x} cy={d.y} r={d.s+3} fill={d.c} opacity="0.20"/>
                      <circle cx={d.x} cy={d.y} r={d.s}   fill={d.c} opacity="0.95"/>
                      <circle cx={d.x} cy={d.y} r={d.s-2} fill="white" opacity="0.35"/>
                    </g>
                  ))}
                </svg>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {[{c:"#ef4444",label:"High"},{c:"#f87171",label:"Medium"},{c:"#fca5a5",label:"Low"}].map(l => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background:l.c }}/>
                      <span className="text-red-400 text-[10px]">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500"/>Regional Breakdown
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={REGION_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                          {REGION_DATA.map((d,i) => <Cell key={i} fill={d.fill}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11}} itemStyle={{color:"#ef4444"}}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-red-900 font-bold text-xs">38</span>
                      <span className="text-red-400 text-[8px]">Countries</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {REGION_DATA.map(r => (
                      <div key={r.name}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:r.fill }}/>
                          <span className="text-red-600 text-xs flex-1">{r.name}</span>
                          <span className="text-red-900 text-xs font-bold">{r.value}%</span>
                        </div>
                        <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${r.value}%`, background:r.fill }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trend + Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-red-900 font-semibold text-sm">My Scan Trend by Region</h3>
                  <RangeToggle value={trendRange} onChange={setTrendRange}/>
                </div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {[{l:"Asia Pacific",c:"#ef4444"},{l:"N. America",c:"#f87171"},{l:"Europe",c:"#fca5a5"}].map(s => (
                    <div key={s.l} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background:s.c }}/>
                      <span className="text-red-400 text-[10px]">{s.l}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={145}>
                  <AreaChart data={trendData} margin={{top:4,right:4,left:-20,bottom:0}}>
                    <defs>
                      <linearGradient id="asiaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="naGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                    <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                    <Area type="monotone" dataKey="asia" name="Asia Pacific" stroke="#ef4444" strokeWidth={2} fill="url(#asiaGrad)" dot={{r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                    <Area type="monotone" dataKey="na"   name="N. America"   stroke="#f87171" strokeWidth={2} fill="url(#naGrad)"   dot={{r:2.5,fill:"#f87171",stroke:"#fff",strokeWidth:1.5}}/>
                    <Area type="monotone" dataKey="eu"   name="Europe"       stroke="#fca5a5" strokeWidth={2} fill="transparent"    dot={{r:2.5,fill:"#fca5a5",stroke:"#fff",strokeWidth:1.5}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-red-900 font-semibold text-sm">Top Country Growth</h3>
                  <span className="text-red-400 text-[10px]">Jan – May 2025</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {[{l:"India",c:"#ef4444"},{l:"USA",c:"#f87171"},{l:"UK",c:"#fca5a5"}].map(s => (
                    <div key={s.l} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background:s.c }}/>
                      <span className="text-red-400 text-[10px]">{s.l}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={145}>
                  <BarChart data={GROWTH_DATA} margin={{top:4,right:4,left:-20,bottom:0}} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                    <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                    <Bar dataKey="India" name="India" fill="#ef4444" radius={[3,3,0,0]}/>
                    <Bar dataKey="USA"   name="USA"   fill="#f87171" radius={[3,3,0,0]}/>
                    <Bar dataKey="UK"    name="UK"    fill="#fca5a5" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── Countries Tab ── */}
        {tab === "countries" && (
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500"/>Countries Scanning My Cards
              </h3>
              <button onClick={handleExport} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                <Download className="w-3.5 h-3.5"/>Export
              </button>
            </div>
            <div className="space-y-2.5">
              {COUNTRIES.map((c,i) => (
                <div key={c.country} className="flex items-center gap-2 hover:bg-red-50/50 rounded-xl p-1.5 -mx-1.5 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200">
                    {i+1}
                  </div>
                  <span className="text-base flex-shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-red-900 text-xs font-semibold truncate">{c.country}</span>
                        <span className="text-red-400 text-[10px] hidden sm:block">{c.city}</span>
                      </div>
                      <span className="text-red-900 text-xs font-bold ml-2 flex-shrink-0">{c.scans.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width:`${c.pct}%` }}/>
                    </div>
                  </div>
                  <span className="text-green-600 text-[10px] font-semibold flex items-center gap-0.5 flex-shrink-0">
                    <ArrowUpRight className="w-3 h-3"/>{c.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Cities Tab ── */}
        {tab === "cities" && (
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-red-500"/>Top Cities
              </h3>
              <button onClick={handleExport} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                <Download className="w-3.5 h-3.5"/>Export
              </button>
            </div>
            <div className="space-y-2.5">
              {CITIES.map((c,i) => (
                <div key={c.city} className="flex items-center gap-2 hover:bg-red-50/50 rounded-xl p-1.5 -mx-1.5 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200">
                    {i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div>
                        <span className="text-red-900 text-xs font-semibold">{c.city}</span>
                        <span className="text-red-400 text-[10px] ml-1">{c.country}</span>
                      </div>
                      <span className="text-red-900 text-xs font-bold">{c.scans.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500" style={{ width:`${c.pct}%` }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Hotspots Tab ── */}
        {tab === "hotspots" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hotspot list */}
            <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500"/>Top Scan Locations
                </h3>
                <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-semibold">
                  <Filter className="w-3 h-3"/>Filter
                </button>
              </div>
              <div className="space-y-2.5">
                {SCAN_HOTSPOTS.map((h,i) => (
                  <div key={h.label}
                    className="bg-red-50 border border-red-100 rounded-xl p-2.5 hover:border-red-300 transition-colors cursor-pointer"
                    onClick={() => showToast(`Viewing ${h.label}`)}>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 shadow-sm shadow-red-200 mt-0.5">
                        {i+1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-red-900 text-[11px] font-semibold truncate">{h.label}</span>
                          <span className="text-base ml-1 flex-shrink-0">{h.country}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[9px] font-medium px-1.5 py-0.5 bg-red-100 text-red-600 rounded-md">{h.type}</span>
                          <span className="text-red-900 text-[11px] font-bold">{h.scans.toLocaleString()} scans</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple summary */}
            <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
              <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-500"/>Location Summary
              </h3>
              <div className="space-y-3 mb-4">
                {[
                  {label:"Business Hubs",  scans:1132, pct:100},
                  {label:"Tourist Areas",  scans:370,  pct:33 },
                  {label:"Retail Zones",   scans:178,  pct:16 },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-600 text-xs">{r.label}</span>
                      <span className="text-red-900 text-xs font-bold">{r.scans.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width:`${r.pct}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-red-100 pt-3 space-y-1.5">
                {[
                  {k:"Total Hotspot Scans", v:"1,680"},
                  {k:"Avg per Location",    v:"280"},
                  {k:"Most Active",         v:"Connaught Place"},
                  {k:"Fastest Growing",     v:"BKC Mumbai"},
                ].map(s => (
                  <div key={s.k} className="flex justify-between text-xs">
                    <span className="text-red-400">{s.k}</span>
                    <span className="text-red-900 font-semibold">{s.v}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleExport}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
                <Download className="w-3.5 h-3.5"/>Download Full Report
              </button>
            </div>
          </div>
        )}

      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:"" })}/>
    </div>
  );
}