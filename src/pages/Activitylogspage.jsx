import { useState, useMemo } from "react";
import {
  Search, Sun, Bell, Zap, Menu,
  CreditCard, Radio, CheckCircle2, XCircle, Users,
  Download, Filter, Calendar, ChevronDown, Info,
  Plus, MapPin, Smartphone, ArrowUpRight, ArrowDownRight, X,
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CARD_DATA = [
  { time:"May 31\n10:46 AM", card:"Corporate Card",  id:"04:A7:3B:9C:21:AF:01", action:"Read",  device:"iPhone 14",  status:"success", location:"🇺🇸" },
  { time:"May 31\n10:30 AM", card:"John's Card",     id:"04:A7:3B:9C:21:AF:02", action:"Write", device:"Galaxy S23", status:"success", location:"🇮🇳" },
  { time:"May 31\n10:15 AM", card:"Event Card",      id:"04:A7:3B:9C:21:AF:03", action:"Read",  device:"iPhone 13",  status:"success", location:"🇬🇧" },
  { time:"May 31\n09:58 AM", card:"Product Card",    id:"04:A7:3B:9C:21:AF:04", action:"Write", device:"OnePlus 11", status:"failed",  location:"🇨🇦" },
  { time:"May 31\n09:40 AM", card:"Marketing Card",  id:"04:A7:3B:9C:21:AF:05", action:"Read",  device:"iPhone 14",  status:"success", location:"🇦🇪" },
  { time:"May 31\n09:25 AM", card:"VIP Card",        id:"04:A7:3B:9C:21:AF:06", action:"Read",  device:"Galaxy S22", status:"success", location:"🇦🇺" },
  { time:"May 31\n09:10 AM", card:"Staff Card",      id:"04:A7:3B:9C:21:AF:07", action:"Write", device:"iPhone 12",  status:"success", location:"🇩🇪" },
  { time:"May 31\n08:50 AM", card:"NFC Stand Card",  id:"04:A7:3B:9C:21:AF:08", action:"Read",  device:"Pixel 7",    status:"failed",  location:"🇫🇷" },
  { time:"May 31\n08:30 AM", card:"Office Entry",    id:"04:A7:3B:9C:21:AF:09", action:"Read",  device:"iPhone 15",  status:"success", location:"🇯🇵" },
  { time:"May 31\n08:15 AM", card:"Promo Card",      id:"04:A7:3B:9C:21:AF:10", action:"Write", device:"Galaxy S24", status:"success", location:"🇧🇷" },
  { time:"May 31\n08:00 AM", card:"Guest Card",      id:"04:A7:3B:9C:21:AF:11", action:"Read",  device:"iPhone 13",  status:"failed",  location:"🇮🇳" },
  { time:"May 31\n07:45 AM", card:"Store Card",      id:"04:A7:3B:9C:21:AF:12", action:"Write", device:"Pixel 6",    status:"success", location:"🇺🇸" },
  { time:"May 31\n07:30 AM", card:"Employee Tag",    id:"04:A7:3B:9C:21:AF:13", action:"Read",  device:"OnePlus 12", status:"success", location:"🇬🇧" },
  { time:"May 31\n07:15 AM", card:"Event Badge",     id:"04:A7:3B:9C:21:AF:14", action:"Write", device:"iPhone 14",  status:"success", location:"🇫🇷" },
  { time:"May 31\n07:00 AM", card:"Access Card",     id:"04:A7:3B:9C:21:AF:15", action:"Read",  device:"Galaxy S23", status:"failed",  location:"🇩🇪" },
  { time:"May 31\n06:45 AM", card:"Visitor Pass",    id:"04:A7:3B:9C:21:AF:16", action:"Read",  device:"iPhone 12",  status:"success", location:"🇦🇺" },
  { time:"May 31\n06:30 AM", card:"Smart Label",     id:"04:A7:3B:9C:21:AF:17", action:"Write", device:"Pixel 7",    status:"success", location:"🇨🇦" },
  { time:"May 31\n06:15 AM", card:"Transport Card",  id:"04:A7:3B:9C:21:AF:18", action:"Read",  device:"iPhone 15",  status:"success", location:"🇯🇵" },
  { time:"May 31\n06:00 AM", card:"Loyalty Card",    id:"04:A7:3B:9C:21:AF:19", action:"Write", device:"Galaxy S22", status:"success", location:"🇧🇷" },
  { time:"May 31\n05:45 AM", card:"ID Badge",        id:"04:A7:3B:9C:21:AF:20", action:"Read",  device:"OnePlus 11", status:"failed",  location:"🇺🇸" },
];

const SYS_DATA = [
  { time:"May 31\n10:46 AM", event:"User Login",           dot:"bg-red-500",  user:"AS", ip:"192.168.1.101", status:"success" },
  { time:"May 31\n10:32 AM", event:"Card Created",         dot:"bg-rose-500", user:"JD", ip:"192.168.1.102", status:"success" },
  { time:"May 31\n10:20 AM", event:"Template Updated",     dot:"bg-red-600",  user:"ML", ip:"192.168.1.103", status:"success" },
  { time:"May 31\n10:05 AM", event:"Bulk Write Completed", dot:"bg-rose-600", user:"EB", ip:"192.168.1.104", status:"success" },
  { time:"May 31\n09:55 AM", event:"API Key Generated",    dot:"bg-red-400",  user:"DW", ip:"192.168.1.105", status:"success" },
  { time:"May 31\n09:35 AM", event:"Subscription Updated", dot:"bg-rose-400", user:"SC", ip:"192.168.1.106", status:"success" },
  { time:"May 31\n09:15 AM", event:"Webhook Triggered",    dot:"bg-red-700",  user:"JT", ip:"192.168.1.107", status:"success" },
  { time:"May 31\n09:00 AM", event:"Password Changed",     dot:"bg-rose-700", user:"OM", ip:"192.168.1.108", status:"success" },
  { time:"May 31\n08:45 AM", event:"User Logout",          dot:"bg-red-500",  user:"NG", ip:"192.168.1.109", status:"success" },
  { time:"May 31\n08:30 AM", event:"Card Deleted",         dot:"bg-rose-800", user:"AM", ip:"192.168.1.110", status:"failed"  },
  { time:"May 31\n08:15 AM", event:"Export Generated",     dot:"bg-red-600",  user:"LJ", ip:"192.168.1.111", status:"success" },
  { time:"May 31\n08:00 AM", event:"User Login",           dot:"bg-rose-500", user:"SW", ip:"192.168.1.112", status:"failed"  },
  { time:"May 31\n07:45 AM", event:"Settings Changed",     dot:"bg-red-400",  user:"MH", ip:"192.168.1.113", status:"success" },
  { time:"May 31\n07:30 AM", event:"Card Created",         dot:"bg-rose-600", user:"IC", ip:"192.168.1.114", status:"success" },
  { time:"May 31\n07:15 AM", event:"API Key Generated",    dot:"bg-red-500",  user:"EL", ip:"192.168.1.115", status:"success" },
  { time:"May 31\n07:00 AM", event:"Bulk Write Completed", dot:"bg-rose-700", user:"AS", ip:"192.168.1.116", status:"success" },
  { time:"May 31\n06:45 AM", event:"Template Updated",     dot:"bg-red-600",  user:"JD", ip:"192.168.1.117", status:"success" },
  { time:"May 31\n06:30 AM", event:"Webhook Triggered",    dot:"bg-rose-400", user:"ML", ip:"192.168.1.118", status:"success" },
  { time:"May 31\n06:15 AM", event:"Subscription Updated", dot:"bg-red-700",  user:"EB", ip:"192.168.1.119", status:"success" },
  { time:"May 31\n06:00 AM", event:"Password Changed",     dot:"bg-rose-800", user:"DW", ip:"192.168.1.120", status:"failed"  },
];

const ACTIVITY_CHART = [
  {l:"May 1",v:300},{l:"May 6",v:850},{l:"May 11",v:600},
  {l:"May 16",v:1100},{l:"May 21",v:900},{l:"May 26",v:1400},{l:"May 31",v:1800},
];

const TOP_CARDS_PIE   = [
  {name:"Corporate",  value:25.4, fill:"#ef4444"},
  {name:"Event Card", value:18.7, fill:"#f87171"},
  {name:"Marketing",  value:16.3, fill:"#fca5a5"},
  {name:"Product",    value:14.8, fill:"#fecaca"},
  {name:"Others",     value:24.8, fill:"#fee2e2"},
];
const TOP_DEVICES_PIE = [
  {name:"iPhone",  value:33.2, fill:"#ef4444"},
  {name:"Android", value:52.1, fill:"#f87171"},
  {name:"Web",     value:9.6,  fill:"#fca5a5"},
  {name:"Others",  value:5.1,  fill:"#fecaca"},
];

const MAP_DOTS = [
  {x:200,y:120,r:5,c:"#ef4444"},{x:260,y:140,r:4,c:"#f87171"},
  {x:330,y:110,r:6,c:"#dc2626"},{x:350,y:130,r:3,c:"#fca5a5"},
  {x:390,y:150,r:5,c:"#ef4444"},{x:440,y:120,r:3,c:"#f87171"},
  {x:470,y:110,r:4,c:"#fca5a5"},{x:200,y:180,r:3,c:"#dc2626"},
  {x:330,y:200,r:3,c:"#f87171"},
];

const TOOLTIP = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:10, fontSize:11 },
  labelStyle:  { color:"#991b1b" },
  itemStyle:   { color:"#ef4444" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return status==="success"
    ? <span className="flex items-center gap-1 text-green-600 text-[10px] font-semibold"><CheckCircle2 className="w-3.5 h-3.5"/>OK</span>
    : <span className="flex items-center gap-1 text-red-500 text-[10px] font-semibold"><XCircle className="w-3.5 h-3.5"/>Failed</span>;
}

function ActionBadge({ action }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
      action==="Write"?"bg-red-100 text-red-700 border-red-200":"bg-rose-100 text-rose-700 border-rose-200"
    }`}>{action}</span>
  );
}

function Pagination({ page, totalPages, onPage, perPage, onPerPage }) {
  const pages = totalPages<=5
    ? Array.from({length:totalPages},(_,i)=>i+1)
    : page<=3?[1,2,3,"...",totalPages]
    : page>=totalPages-2?[1,"...",totalPages-2,totalPages-1,totalPages]
    : [1,"...",page,"...",totalPages];
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-red-100">
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={()=>onPage(Math.max(1,page-1))} disabled={page===1}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:text-red-700 hover:border-red-400 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 rotate-90"/>
        </button>
        {pages.map((p,i)=>(
          <button key={i} onClick={()=>typeof p==="number"&&onPage(p)}
            className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${
              p===page?"bg-red-600 border-red-600 text-white":
              p==="..."?"border-transparent text-red-300 cursor-default":
              "border-red-200 text-red-500 hover:text-red-700 hover:border-red-400"
            }`}>{p}</button>
        ))}
        <button onClick={()=>onPage(Math.min(totalPages,page+1))} disabled={page===totalPages}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:text-red-700 hover:border-red-400 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 -rotate-90"/>
        </button>
      </div>
      <select value={perPage} onChange={e=>onPerPage(Number(e.target.value))}
        className="bg-red-50 border border-red-200 text-red-600 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
        {[5,10,20].map(n=><option key={n}>{n} / page</option>)}
      </select>
    </div>
  );
}

function FilterBar({ search, onSearch, filter1, onFilter1, opts1, filter2, onFilter2, opts2, onExport, extra, placeholder }) {
  const [open, setOpen] = useState(false);
  const selCls = "flex-1 sm:flex-none bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer";
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 sm:hidden mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder={placeholder||"Search..."}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
        </div>
        <button onClick={()=>setOpen(p=>!p)}
          className="w-8 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all">
          <Filter className="w-3.5 h-3.5"/>
        </button>
      </div>
      <div className={`${open?"flex":"hidden"} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2`}>
        <div className="relative flex-1 sm:max-w-[200px] hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder={placeholder||"Search..."}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filter1} onChange={e=>onFilter1(e.target.value)} className={selCls}>
            {opts1.map(o=><option key={o}>{o}</option>)}
          </select>
          <select value={filter2} onChange={e=>onFilter2(e.target.value)} className={selCls}>
            {opts2.map(o=><option key={o}>{o}</option>)}
          </select>
          <div className="hidden md:flex items-center gap-1 bg-red-50 border border-red-200 text-red-500 text-[11px] px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3 h-3"/>
            <span>May 1 – May 31</span>
          </div>
          <button onClick={onExport}
            className="flex items-center gap-1 bg-red-50 border border-red-200 hover:border-red-400 text-red-500 hover:text-red-700 text-[11px] px-2.5 py-1.5 rounded-lg transition-all">
            <Download className="w-3 h-3"/>Export
          </button>
          {extra && (
            <button className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-colors shadow-sm">
              <Plus className="w-3.5 h-3.5"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ActivityLogsPage({ onMenuClick }) {
  const [tab,       setTab]       = useState("card");
  const [caSearch,  setCaSearch]  = useState("");
  const [caCard,    setCaCard]    = useState("All Cards");
  const [caAction,  setCaAction]  = useState("All Actions");
  const [caPage,    setCaPage]    = useState(1);
  const [caPerPage, setCaPerPage] = useState(10);
  const [slSearch,  setSlSearch]  = useState("");
  const [slEvent,   setSlEvent]   = useState("All Events");
  const [slStatus,  setSlStatus]  = useState("All Status");
  const [slPage,    setSlPage]    = useState(1);
  const [slPerPage, setSlPerPage] = useState(10);
  const [chartRange,setChartRange]= useState("Daily");

  const filteredCA = useMemo(()=>CARD_DATA.filter(r=>{
    const q=caSearch.toLowerCase();
    return (!q||r.card.toLowerCase().includes(q)||r.id.includes(caSearch))
      &&(caCard==="All Cards"||r.card===caCard)
      &&(caAction==="All Actions"||r.action===caAction);
  }),[caSearch,caCard,caAction]);

  const filteredSL = useMemo(()=>SYS_DATA.filter(r=>{
    const q=slSearch.toLowerCase();
    return (!q||r.event.toLowerCase().includes(q)||r.ip.includes(slSearch))
      &&(slEvent==="All Events"||r.event===slEvent)
      &&(slStatus==="All Status"||r.status===slStatus);
  }),[slSearch,slEvent,slStatus]);

  const caTotalPages = Math.max(1,Math.ceil(filteredCA.length/caPerPage));
  const slTotalPages = Math.max(1,Math.ceil(filteredSL.length/slPerPage));
  const caRows = filteredCA.slice((caPage-1)*caPerPage,caPage*caPerPage);
  const slRows = filteredSL.slice((slPage-1)*slPerPage,slPage*slPerPage);

  const handleExport = (type) => {
    const data = type==="card"?CARD_DATA:SYS_DATA;
    const hdr  = type==="card"?["Time","Card","ID","Action","Device","Status"]:["Time","Event","User","IP","Status"];
    const rows = data.map(r=>type==="card"?[r.time.replace("\n"," "),r.card,r.id,r.action,r.device,r.status]:[r.time.replace("\n"," "),r.event,r.user,r.ip,r.status]);
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([[hdr.join(","),...rows.map(r=>r.join(","))].join("\n")],{type:"text/csv"}));
    a.download=`activity_${type}.csv`;a.click();
  };

  const uniqueCards  = ["All Cards",  ...new Set(CARD_DATA.map(r=>r.card))];
  const uniqueEvents = ["All Events", ...new Set(SYS_DATA.map(r=>r.event))];

  const STATS = [
    {Icon:CreditCard,  bg:"from-red-500 to-rose-600",  label:"Total Card Activities", value:"25,630", change:"18.6%", up:true  },
    {Icon:Radio,       bg:"from-rose-500 to-red-600",  label:"Successful Reads",      value:"18,742", change:"21.4%", up:true  },
    {Icon:CheckCircle2,bg:"from-red-600 to-rose-700",  label:"Successful Writes",     value:"6,845",  change:"16.2%", up:true  },
    {Icon:XCircle,     bg:"from-rose-700 to-red-900",  label:"Failed Attempts",       value:"1,245",  change:"8.7%",  up:false },
    {Icon:Users,       bg:"from-red-700 to-rose-600",  label:"Unique Devices",        value:"9,521",  change:"14.3%", up:true  },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title + Tabs */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Activity Logs</h1>
            <p className="text-red-400 text-xs hidden sm:block">Monitor card activity and system events</p>
          </div>
        </div>

        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {[{id:"card",label:"Card Activity"},{id:"system",label:"System Logs"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats — 2 col → 3 sm → 5 lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {STATS.map(s=>(
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-red-300 hover:shadow-md transition-all shadow-sm">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-100`}>
                <s.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
              </div>
              <div className="min-w-0">
                <div className="text-red-400 text-[9px] sm:text-[10px] leading-tight mb-0.5 truncate">{s.label}</div>
                <div className="text-red-900 font-bold text-base sm:text-lg leading-tight">{s.value}</div>
                <div className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up?"text-green-600":"text-red-500"}`}>
                  {s.up?<ArrowUpRight className="w-3 h-3"/>:<ArrowDownRight className="w-3 h-3"/>}{s.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tables — stacked on mobile, side-by-side lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Card Activity Table */}
          <div className={`bg-white border border-red-100 rounded-xl p-3 sm:p-4 shadow-sm transition-opacity ${tab==="system"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500"/>Card Activity
            </h3>
            <FilterBar
              search={caSearch} onSearch={v=>{setCaSearch(v);setCaPage(1);}}
              filter1={caCard}   onFilter1={v=>{setCaCard(v);setCaPage(1);}}   opts1={uniqueCards}
              filter2={caAction} onFilter2={v=>{setCaAction(v);setCaPage(1);}} opts2={["All Actions","Read","Write"]}
              onExport={()=>handleExport("card")} placeholder="Search by card or ID"
            />
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-[11px] min-w-[480px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Time","Card / ID","Action","Device","Status","Loc"].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {caRows.length===0
                    ? <tr><td colSpan={6} className="text-center text-red-300 py-8">No results found</td></tr>
                    : caRows.map((r,i)=>(
                    <tr key={i} className={`hover:bg-red-50/50 transition-colors ${i<caRows.length-1?"border-b border-red-50":""}`}>
                      <td className="px-2.5 py-2 text-red-400 whitespace-pre-line leading-tight text-[10px]">{r.time}</td>
                      <td className="px-2.5 py-2">
                        <div className="text-red-900 font-medium truncate max-w-[90px]">{r.card}</div>
                        <div className="text-red-300 font-mono text-[9px]">{r.id.slice(0,13)}…</div>
                      </td>
                      <td className="px-2.5 py-2"><ActionBadge action={r.action}/></td>
                      <td className="px-2.5 py-2 text-red-600 whitespace-nowrap">{r.device}</td>
                      <td className="px-2.5 py-2"><StatusBadge status={r.status}/></td>
                      <td className="px-2.5 py-2 text-sm">{r.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={caPage} totalPages={caTotalPages} onPage={setCaPage} perPage={caPerPage} onPerPage={v=>{setCaPerPage(v);setCaPage(1);}}/>
          </div>

          {/* System Logs Table */}
          <div className={`bg-white border border-red-100 rounded-xl p-3 sm:p-4 shadow-sm transition-opacity ${tab==="card"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500"/>System Logs
            </h3>
            <FilterBar
              search={slSearch} onSearch={v=>{setSlSearch(v);setSlPage(1);}}
              filter1={slEvent}  onFilter1={v=>{setSlEvent(v);setSlPage(1);}}  opts1={uniqueEvents}
              filter2={slStatus} onFilter2={v=>{setSlStatus(v);setSlPage(1);}} opts2={["All Status","success","failed"]}
              onExport={()=>handleExport("system")} extra placeholder="Search by event or IP"
            />
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-[11px] min-w-[400px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Time","Event","User","IP Address","Status",""].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slRows.length===0
                    ? <tr><td colSpan={6} className="text-center text-red-300 py-8">No results found</td></tr>
                    : slRows.map((r,i)=>(
                    <tr key={i} className={`hover:bg-red-50/50 transition-colors ${i<slRows.length-1?"border-b border-red-50":""}`}>
                      <td className="px-2.5 py-2 text-red-400 whitespace-pre-line leading-tight text-[10px]">{r.time}</td>
                      <td className="px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-md ${r.dot} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-[8px] font-bold">{r.event[0]}</span>
                          </div>
                          <span className="text-red-900 font-medium truncate max-w-[90px]">{r.event}</span>
                        </div>
                      </td>
                      <td className="px-2.5 py-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">{r.user}</div>
                      </td>
                      <td className="px-2.5 py-2 text-red-500 font-mono text-[10px]">{r.ip}</td>
                      <td className="px-2.5 py-2"><StatusBadge status={r.status}/></td>
                      <td className="px-2.5 py-2">
                        <button className="w-5 h-5 rounded-full border border-red-200 text-red-400 hover:border-red-500 hover:text-red-600 flex items-center justify-center transition-all">
                          <Info className="w-3 h-3"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={slPage} totalPages={slTotalPages} onPage={setSlPage} perPage={slPerPage} onPerPage={v=>{setSlPerPage(v);setSlPage(1);}}/>
          </div>
        </div>

        {/* Charts — 1 col → 2 sm → 4 xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Activity Over Time */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm">Activity Over Time</h3>
              <select value={chartRange} onChange={e=>setChartRange(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-600 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={ACTIVITY_CHART} margin={{top:4,right:4,left:-28,bottom:0}}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Area type="monotone" dataKey="v" name="Activities" stroke="#ef4444" strokeWidth={2.5}
                  fill="url(#actGrad)" dot={{fill:"#ef4444",r:3,stroke:"#fff",strokeWidth:1.5}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Active Cards */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Top Active Cards</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={TOP_CARDS_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {TOP_CARDS_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">3,245</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {TOP_CARDS_PIE.map(c=>(
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1 truncate">{c.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Devices */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500"/>Top Devices
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={TOP_DEVICES_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {TOP_DEVICES_PIE.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">5,421</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {TOP_DEVICES_PIE.map(d=>(
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{d.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity by Location */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500"/>Activity by Location
            </h3>
            <div className="relative w-full mb-3" style={{paddingBottom:"48%"}}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 270" preserveAspectRatio="xMidYMid meet">
                <rect width="560" height="270" fill="transparent"/>
                <path d="M60,60 Q80,45 130,50 Q170,55 180,90 Q185,120 160,140 Q140,155 110,150 Q80,145 65,120 Q50,95 60,60Z" fill="#fecaca" opacity="0.7"/>
                <path d="M130,160 Q160,155 175,175 Q185,200 175,230 Q165,250 145,255 Q120,255 110,235 Q100,210 105,185 Q110,165 130,160Z" fill="#fecaca" opacity="0.7"/>
                <path d="M255,50 Q280,45 300,55 Q315,65 310,85 Q305,100 285,105 Q265,105 255,90 Q248,75 255,50Z" fill="#fecaca" opacity="0.7"/>
                <path d="M265,115 Q295,110 310,130 Q320,155 315,185 Q308,210 290,220 Q270,225 258,205 Q248,180 250,155 Q252,130 265,115Z" fill="#fecaca" opacity="0.7"/>
                <path d="M315,45 Q380,35 440,50 Q490,60 505,85 Q510,110 490,125 Q460,135 420,130 Q380,125 345,110 Q315,95 310,75 Q308,58 315,45Z" fill="#fecaca" opacity="0.7"/>
                <path d="M380,130 Q395,128 405,145 Q410,165 395,175 Q380,178 372,160 Q368,142 380,130Z" fill="#fecaca" opacity="0.7"/>
                <path d="M450,185 Q490,180 510,200 Q520,218 510,233 Q495,245 470,242 Q448,238 440,220 Q435,202 450,185Z" fill="#fecaca" opacity="0.7"/>
                {MAP_DOTS.map((d,i)=>(
                  <g key={i}>
                    <circle cx={d.x} cy={d.y} r={d.r+5} fill={d.c} opacity="0.15"/>
                    <circle cx={d.x} cy={d.y} r={d.r}   fill={d.c} opacity="0.9"/>
                    <circle cx={d.x} cy={d.y} r={d.r-1.5} fill="white" opacity="0.4"/>
                  </g>
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {[{f:"🇮🇳",c:"India",v:"2,341"},{f:"🇺🇸",c:"USA",v:"1,987"},{f:"🇬🇧",c:"UK",v:"1,245"},{f:"🇩🇪",c:"Germany",v:"876"}].map(l=>(
                <div key={l.c} className="flex items-center gap-1.5">
                  <span className="text-sm">{l.f}</span>
                  <span className="text-red-500 text-[10px] flex-1">{l.c}</span>
                  <span className="text-red-900 text-[10px] font-bold">{l.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}