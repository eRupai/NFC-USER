import { useState, useMemo } from "react";
import {
  Search, CreditCard, Radio, CheckCircle2, XCircle,
  Download, Filter, Calendar, ChevronDown, Info,
  MapPin, Smartphone, ArrowUpRight, ArrowDownRight, X,
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped) ───────────────────────────────────────────────────────

const CARD_DATA = [
  { time:"May 31\n10:46 AM", card:"My Website Link",   id:"04:A7:3B:9C:21:AF:01", action:"Read",  device:"iPhone 14",  status:"success", location:"🇮🇳" },
  { time:"May 31\n10:30 AM", card:"Business vCard",    id:"04:A7:3B:9C:21:AF:02", action:"Write", device:"Galaxy S23", status:"success", location:"🇮🇳" },
  { time:"May 31\n10:15 AM", card:"Office WiFi",       id:"04:A7:3B:9C:21:AF:03", action:"Read",  device:"iPhone 13",  status:"success", location:"🇬🇧" },
  { time:"May 31\n09:58 AM", card:"Instagram Profile", id:"04:A7:3B:9C:21:AF:04", action:"Write", device:"OnePlus 11", status:"failed",  location:"🇺🇸" },
  { time:"May 31\n09:40 AM", card:"Location Office",   id:"04:A7:3B:9C:21:AF:05", action:"Read",  device:"iPhone 14",  status:"success", location:"🇩🇪" },
  { time:"May 31\n09:25 AM", card:"My Website Link",   id:"04:A7:3B:9C:21:AF:01", action:"Read",  device:"Galaxy S22", status:"success", location:"🇦🇺" },
  { time:"May 31\n09:10 AM", card:"Business vCard",    id:"04:A7:3B:9C:21:AF:02", action:"Read",  device:"iPhone 12",  status:"success", location:"🇫🇷" },
  { time:"May 31\n08:50 AM", card:"Office WiFi",       id:"04:A7:3B:9C:21:AF:03", action:"Read",  device:"Pixel 7",    status:"failed",  location:"🇨🇦" },
  { time:"May 31\n08:30 AM", card:"Instagram Profile", id:"04:A7:3B:9C:21:AF:04", action:"Read",  device:"iPhone 15",  status:"success", location:"🇯🇵" },
  { time:"May 31\n08:15 AM", card:"Location Office",   id:"04:A7:3B:9C:21:AF:05", action:"Write", device:"Galaxy S24", status:"success", location:"🇧🇷" },
  { time:"May 31\n08:00 AM", card:"My Website Link",   id:"04:A7:3B:9C:21:AF:01", action:"Read",  device:"iPhone 13",  status:"failed",  location:"🇮🇳" },
  { time:"May 31\n07:45 AM", card:"Business vCard",    id:"04:A7:3B:9C:21:AF:02", action:"Write", device:"Pixel 6",    status:"success", location:"🇺🇸" },
  { time:"May 31\n07:30 AM", card:"Office WiFi",       id:"04:A7:3B:9C:21:AF:03", action:"Read",  device:"OnePlus 12", status:"success", location:"🇬🇧" },
  { time:"May 31\n07:15 AM", card:"Instagram Profile", id:"04:A7:3B:9C:21:AF:04", action:"Write", device:"iPhone 14",  status:"success", location:"🇫🇷" },
  { time:"May 31\n07:00 AM", card:"Location Office",   id:"04:A7:3B:9C:21:AF:05", action:"Read",  device:"Galaxy S23", status:"failed",  location:"🇩🇪" },
  { time:"May 31\n06:45 AM", card:"My Website Link",   id:"04:A7:3B:9C:21:AF:01", action:"Read",  device:"iPhone 12",  status:"success", location:"🇦🇺" },
  { time:"May 31\n06:30 AM", card:"Business vCard",    id:"04:A7:3B:9C:21:AF:02", action:"Write", device:"Pixel 7",    status:"success", location:"🇨🇦" },
  { time:"May 31\n06:15 AM", card:"Office WiFi",       id:"04:A7:3B:9C:21:AF:03", action:"Read",  device:"iPhone 15",  status:"success", location:"🇯🇵" },
  { time:"May 31\n06:00 AM", card:"Instagram Profile", id:"04:A7:3B:9C:21:AF:04", action:"Write", device:"Galaxy S22", status:"success", location:"🇧🇷" },
  { time:"May 31\n05:45 AM", card:"Location Office",   id:"04:A7:3B:9C:21:AF:05", action:"Read",  device:"OnePlus 11", status:"failed",  location:"🇺🇸" },
];

const MY_ACTIVITY = [
  { time:"May 31\n10:46 AM", event:"Card Scanned",     dot:"bg-red-500",  ip:"192.168.1.101", status:"success", card:"My Website Link"   },
  { time:"May 31\n10:32 AM", event:"Card Written",     dot:"bg-rose-500", ip:"192.168.1.101", status:"success", card:"Business vCard"    },
  { time:"May 31\n10:20 AM", event:"Profile Viewed",   dot:"bg-red-600",  ip:"192.168.1.102", status:"success", card:"My Website Link"   },
  { time:"May 31\n10:05 AM", event:"Card Shared",      dot:"bg-rose-600", ip:"192.168.1.101", status:"success", card:"Instagram Profile" },
  { time:"May 31\n09:55 AM", event:"Card Scanned",     dot:"bg-red-400",  ip:"192.168.1.103", status:"success", card:"Office WiFi"       },
  { time:"May 31\n09:35 AM", event:"Password Changed", dot:"bg-rose-400", ip:"192.168.1.101", status:"success", card:"—"                 },
  { time:"May 31\n09:15 AM", event:"Card Written",     dot:"bg-red-700",  ip:"192.168.1.101", status:"success", card:"Location Office"   },
  { time:"May 31\n09:00 AM", event:"Login",            dot:"bg-rose-700", ip:"192.168.1.104", status:"success", card:"—"                 },
  { time:"May 31\n08:45 AM", event:"Card Scanned",     dot:"bg-red-500",  ip:"192.168.1.105", status:"failed",  card:"Office WiFi"       },
  { time:"May 31\n08:30 AM", event:"Profile Viewed",   dot:"bg-rose-800", ip:"192.168.1.106", status:"success", card:"Business vCard"    },
  { time:"May 31\n08:15 AM", event:"Card Shared",      dot:"bg-red-600",  ip:"192.168.1.101", status:"success", card:"My Website Link"   },
  { time:"May 31\n08:00 AM", event:"Login",            dot:"bg-rose-500", ip:"192.168.1.107", status:"failed",  card:"—"                 },
  { time:"May 31\n07:45 AM", event:"Card Written",     dot:"bg-red-400",  ip:"192.168.1.101", status:"success", card:"Instagram Profile" },
  { time:"May 31\n07:30 AM", event:"Card Scanned",     dot:"bg-rose-600", ip:"192.168.1.108", status:"success", card:"Location Office"   },
  { time:"May 31\n07:15 AM", event:"Profile Viewed",   dot:"bg-red-500",  ip:"192.168.1.109", status:"success", card:"Business vCard"    },
  { time:"May 31\n07:00 AM", event:"Card Shared",      dot:"bg-rose-700", ip:"192.168.1.101", status:"success", card:"Office WiFi"       },
  { time:"May 31\n06:45 AM", event:"Card Written",     dot:"bg-red-600",  ip:"192.168.1.101", status:"success", card:"My Website Link"   },
  { time:"May 31\n06:30 AM", event:"Card Scanned",     dot:"bg-rose-400", ip:"192.168.1.110", status:"success", card:"Instagram Profile" },
  { time:"May 31\n06:15 AM", event:"Login",            dot:"bg-red-700",  ip:"192.168.1.101", status:"success", card:"—"                 },
  { time:"May 31\n06:00 AM", event:"Card Scanned",     dot:"bg-rose-800", ip:"192.168.1.111", status:"failed",  card:"Location Office"   },
];

const ACTIVITY_CHART = [
  {l:"May 1",v:30},{l:"May 6",v:85},{l:"May 11",v:60},
  {l:"May 16",v:110},{l:"May 21",v:90},{l:"May 26",v:140},{l:"May 31",v:180},
];

const TOP_CARDS_PIE = [
  {name:"My Website",  value:32.4, fill:"#ef4444"},
  {name:"Biz vCard",   value:24.7, fill:"#f87171"},
  {name:"Instagram",   value:18.3, fill:"#fca5a5"},
  {name:"Office WiFi", value:14.8, fill:"#fecaca"},
  {name:"Location",    value:9.8,  fill:"#fee2e2"},
];

const TOP_DEVICES_PIE = [
  {name:"iPhone",  value:40.2, fill:"#ef4444"},
  {name:"Android", value:45.1, fill:"#f87171"},
  {name:"Web",     value:10.6, fill:"#fca5a5"},
  {name:"Others",  value:4.1,  fill:"#fecaca"},
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return status === "success"
    ? <span className="flex items-center gap-1 text-green-600 text-[10px] font-semibold"><CheckCircle2 className="w-3.5 h-3.5"/>OK</span>
    : <span className="flex items-center gap-1 text-red-500 text-[10px] font-semibold"><XCircle className="w-3.5 h-3.5"/>Failed</span>;
}

function ActionBadge({ action }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
      action === "Write" ? "bg-red-100 text-red-700 border-red-200" : "bg-rose-100 text-rose-700 border-rose-200"
    }`}>{action}</span>
  );
}

function Pagination({ page, totalPages, onPage, perPage, onPerPage }) {
  const pages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : page <= 3 ? [1,2,3,"...",totalPages]
    : page >= totalPages - 2 ? [1,"...",totalPages-2,totalPages-1,totalPages]
    : [1,"...",page,"...",totalPages];
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-red-100">
      <div className="flex items-center gap-1 flex-wrap">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:text-red-700 hover:border-red-400 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 rotate-90"/>
        </button>
        {pages.map((p, i) => (
          <button key={i} onClick={() => typeof p === "number" && onPage(p)}
            className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${
              p === page ? "bg-red-600 border-red-600 text-white"
              : p === "..." ? "border-transparent text-red-300 cursor-default"
              : "border-red-200 text-red-500 hover:text-red-700 hover:border-red-400"
            }`}>{p}</button>
        ))}
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:text-red-700 hover:border-red-400 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 -rotate-90"/>
        </button>
      </div>
      <select value={perPage} onChange={e => onPerPage(Number(e.target.value))}
        className="bg-red-50 border border-red-200 text-red-600 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
        {[5,10,20].map(n => <option key={n}>{n} / page</option>)}
      </select>
    </div>
  );
}

function FilterBar({ search, onSearch, filter1, onFilter1, opts1, filter2, onFilter2, opts2, onExport, placeholder }) {
  const [open, setOpen] = useState(false);
  const selCls = "flex-1 sm:flex-none bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1.5 rounded-lg outline-none cursor-pointer";
  return (
    <div className="mb-3">
      {/* Mobile: search + filter toggle */}
      <div className="flex items-center gap-2 sm:hidden mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder || "Search..."}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
        </div>
        <button onClick={() => setOpen(p => !p)}
          className="w-8 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all">
          <Filter className="w-3.5 h-3.5"/>
        </button>
      </div>
      {/* Desktop + mobile expanded */}
      <div className={`${open ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2`}>
        <div className="relative flex-1 sm:max-w-[200px] hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-300"/>
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder={placeholder || "Search..."}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-[11px] pl-7 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filter1} onChange={e => onFilter1(e.target.value)} className={selCls}>
            {opts1.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={filter2} onChange={e => onFilter2(e.target.value)} className={selCls}>
            {opts2.map(o => <option key={o}>{o}</option>)}
          </select>
          <div className="hidden md:flex items-center gap-1 bg-red-50 border border-red-200 text-red-500 text-[11px] px-2.5 py-1.5 rounded-lg">
            <Calendar className="w-3 h-3"/>
            <span>May 1 – May 31</span>
          </div>
          <button onClick={onExport}
            className="flex items-center gap-1 bg-red-50 border border-red-200 hover:border-red-400 text-red-500 hover:text-red-700 text-[11px] px-2.5 py-1.5 rounded-lg transition-all">
            <Download className="w-3 h-3"/>Export
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────

function DetailModal({ row, type, onClose }) {
  if (!row) return null;
  const fields = type === "card"
    ? [["Card Name", row.card],["Card ID", row.id],["Action", row.action],["Device", row.device],["Location", row.location],["Time", row.time.replace("\n"," ")],["Status", row.status]]
    : [["Event", row.event],["Card", row.card],["IP Address", row.ip],["Time", row.time.replace("\n"," ")],["Status", row.status]];
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
              <Info className="w-4 h-4 text-red-600"/>
            </div>
            <span className="text-red-900 font-bold text-sm">Activity Detail</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-700 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {fields.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5 border-b border-red-50 last:border-0">
              <span className="text-red-400 text-xs">{k}</span>
              {k === "Action" ? <ActionBadge action={v} />
               : k === "Status" ? <StatusBadge status={v} />
               : <span className="text-red-800 text-xs font-semibold">{v}</span>}
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function UserActivityLogsPage({ onMenuClick }) {
  const [tab,        setTab]        = useState("card");
  const [caSearch,   setCaSearch]   = useState("");
  const [caCard,     setCaCard]     = useState("All Cards");
  const [caAction,   setCaAction]   = useState("All Actions");
  const [caPage,     setCaPage]     = useState(1);
  const [caPerPage,  setCaPerPage]  = useState(10);
  const [mySearch,   setMySearch]   = useState("");
  const [myEvent,    setMyEvent]    = useState("All Events");
  const [myStatus,   setMyStatus]   = useState("All Status");
  const [myPage,     setMyPage]     = useState(1);
  const [myPerPage,  setMyPerPage]  = useState(10);
  const [chartRange, setChartRange] = useState("Daily");
  const [detailRow,  setDetailRow]  = useState(null);
  const [detailType, setDetailType] = useState("card");

  // ── Filtered data ──────────────────────────────────────────────────────────

  const filteredCA = useMemo(() => CARD_DATA.filter(r => {
    const q = caSearch.toLowerCase();
    return (!q || r.card.toLowerCase().includes(q) || r.id.includes(caSearch))
      && (caCard === "All Cards" || r.card === caCard)
      && (caAction === "All Actions" || r.action === caAction);
  }), [caSearch, caCard, caAction]);

  const filteredMY = useMemo(() => MY_ACTIVITY.filter(r => {
    const q = mySearch.toLowerCase();
    return (!q || r.event.toLowerCase().includes(q) || r.ip.includes(mySearch) || r.card.toLowerCase().includes(q))
      && (myEvent === "All Events" || r.event === myEvent)
      && (myStatus === "All Status" || r.status === myStatus);
  }), [mySearch, myEvent, myStatus]);

  const caTotalPages = Math.max(1, Math.ceil(filteredCA.length / caPerPage));
  const myTotalPages = Math.max(1, Math.ceil(filteredMY.length / myPerPage));
  const caRows = filteredCA.slice((caPage - 1) * caPerPage, caPage * caPerPage);
  const myRows = filteredMY.slice((myPage - 1) * myPerPage, myPage * myPerPage);

  // ── Export CSV ─────────────────────────────────────────────────────────────

  const handleExport = (type) => {
    const data = type === "card" ? CARD_DATA : MY_ACTIVITY;
    const hdr  = type === "card"
      ? ["Time","Card","ID","Action","Device","Status","Location"]
      : ["Time","Event","Card","IP","Status"];
    const rows = data.map(r => type === "card"
      ? [r.time.replace("\n"," "), r.card, r.id, r.action, r.device, r.status, r.location]
      : [r.time.replace("\n"," "), r.event, r.card, r.ip, r.status]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[hdr.join(","), ...rows.map(r => r.join(","))].join("\n")], { type:"text/csv" }));
    a.download = `my_activity_${type}.csv`;
    a.click();
  };

  const uniqueCards  = ["All Cards",  ...new Set(CARD_DATA.map(r => r.card))];
  const uniqueEvents = ["All Events", ...new Set(MY_ACTIVITY.map(r => r.event))];

  const STATS = [
    { Icon:CreditCard,   bg:"from-red-500 to-rose-600",  label:"My Card Scans",    value:"2,543",  change:"18.6%", up:true  },
    { Icon:Radio,        bg:"from-rose-500 to-red-600",  label:"Successful Reads",  value:"1,842",  change:"21.4%", up:true  },
    { Icon:CheckCircle2, bg:"from-red-600 to-rose-700",  label:"Cards Written",     value:"284",    change:"16.2%", up:true  },
    { Icon:XCircle,      bg:"from-rose-700 to-red-900",  label:"Failed Attempts",   value:"45",     change:"8.7%",  up:false },
    { Icon:Smartphone,   bg:"from-red-700 to-rose-600",  label:"Unique Visitors",   value:"921",    change:"14.3%", up:true  },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* ── Title ── */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">My Activity Logs</h1>
            <p className="text-red-400 text-xs hidden sm:block">Track your card scans and account activity</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {[{id:"card",label:"Card Scans"},{id:"account",label:"Account Activity"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"
              }`}>{t.label}</button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-red-300 hover:shadow-md transition-all shadow-sm">
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-100`}>
                <s.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
              </div>
              <div className="min-w-0">
                <div className="text-red-400 text-[9px] sm:text-[10px] leading-tight mb-0.5 truncate">{s.label}</div>
                <div className="text-red-900 font-bold text-base sm:text-lg leading-tight">{s.value}</div>
                <div className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up ? "text-green-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}{s.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Card Scans */}
          <div className={`bg-white border border-red-100 rounded-xl p-3 sm:p-4 shadow-sm transition-opacity ${tab === "account" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500"/>Card Scan History
            </h3>
            <FilterBar
              search={caSearch} onSearch={v => { setCaSearch(v); setCaPage(1); }}
              filter1={caCard}   onFilter1={v => { setCaCard(v); setCaPage(1); }}   opts1={uniqueCards}
              filter2={caAction} onFilter2={v => { setCaAction(v); setCaPage(1); }} opts2={["All Actions","Read","Write"]}
              onExport={() => handleExport("card")} placeholder="Search by card or ID"
            />
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-[11px] min-w-[480px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Time","Card / ID","Action","Device","Status","Loc",""].map(h => (
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {caRows.length === 0
                    ? <tr><td colSpan={7} className="text-center text-red-300 py-8">No results found</td></tr>
                    : caRows.map((r, i) => (
                    <tr key={i}
                      onClick={() => { setDetailRow(r); setDetailType("card"); }}
                      className={`hover:bg-red-50/50 transition-colors cursor-pointer ${i < caRows.length - 1 ? "border-b border-red-50" : ""}`}>
                      <td className="px-2.5 py-2 text-red-400 whitespace-pre-line leading-tight text-[10px]">{r.time}</td>
                      <td className="px-2.5 py-2">
                        <div className="text-red-900 font-medium truncate max-w-[90px]">{r.card}</div>
                        <div className="text-red-300 font-mono text-[9px]">{r.id.slice(0,13)}…</div>
                      </td>
                      <td className="px-2.5 py-2"><ActionBadge action={r.action}/></td>
                      <td className="px-2.5 py-2 text-red-600 whitespace-nowrap">{r.device}</td>
                      <td className="px-2.5 py-2"><StatusBadge status={r.status}/></td>
                      <td className="px-2.5 py-2 text-sm">{r.location}</td>
                      <td className="px-2.5 py-2">
                        <button
                          onClick={e => { e.stopPropagation(); setDetailRow(r); setDetailType("card"); }}
                          className="w-5 h-5 rounded-full border border-red-200 text-red-400 hover:border-red-500 hover:text-red-600 flex items-center justify-center transition-all">
                          <Info className="w-3 h-3"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={caPage} totalPages={caTotalPages} onPage={setCaPage} perPage={caPerPage} onPerPage={v => { setCaPerPage(v); setCaPage(1); }}/>
          </div>

          {/* Account Activity */}
          <div className={`bg-white border border-red-100 rounded-xl p-3 sm:p-4 shadow-sm transition-opacity ${tab === "card" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500"/>Account Activity
            </h3>
            <FilterBar
              search={mySearch} onSearch={v => { setMySearch(v); setMyPage(1); }}
              filter1={myEvent}  onFilter1={v => { setMyEvent(v); setMyPage(1); }}  opts1={uniqueEvents}
              filter2={myStatus} onFilter2={v => { setMyStatus(v); setMyPage(1); }} opts2={["All Status","success","failed"]}
              onExport={() => handleExport("account")} placeholder="Search by event or IP"
            />
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-[11px] min-w-[400px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Time","Event","Card","IP Address","Status",""].map(h => (
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myRows.length === 0
                    ? <tr><td colSpan={6} className="text-center text-red-300 py-8">No results found</td></tr>
                    : myRows.map((r, i) => (
                    <tr key={i}
                      onClick={() => { setDetailRow(r); setDetailType("account"); }}
                      className={`hover:bg-red-50/50 transition-colors cursor-pointer ${i < myRows.length - 1 ? "border-b border-red-50" : ""}`}>
                      <td className="px-2.5 py-2 text-red-400 whitespace-pre-line leading-tight text-[10px]">{r.time}</td>
                      <td className="px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-md ${r.dot} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-[8px] font-bold">{r.event[0]}</span>
                          </div>
                          <span className="text-red-900 font-medium truncate max-w-[80px]">{r.event}</span>
                        </div>
                      </td>
                      <td className="px-2.5 py-2 text-red-600 text-[10px] truncate max-w-[70px]">{r.card}</td>
                      <td className="px-2.5 py-2 text-red-500 font-mono text-[10px]">{r.ip}</td>
                      <td className="px-2.5 py-2"><StatusBadge status={r.status}/></td>
                      <td className="px-2.5 py-2">
                        <button
                          onClick={e => { e.stopPropagation(); setDetailRow(r); setDetailType("account"); }}
                          className="w-5 h-5 rounded-full border border-red-200 text-red-400 hover:border-red-500 hover:text-red-600 flex items-center justify-center transition-all">
                          <Info className="w-3 h-3"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={myPage} totalPages={myTotalPages} onPage={setMyPage} perPage={myPerPage} onPerPage={v => { setMyPerPage(v); setMyPage(1); }}/>
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Activity Over Time */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-900 font-semibold text-sm">My Activity Over Time</h3>
              <select value={chartRange} onChange={e => setChartRange(e.target.value)}
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

          {/* My Most Scanned Cards */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3">Most Scanned Cards</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={TOP_CARDS_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {TOP_CARDS_PIE.map((d, i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">2,543</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {TOP_CARDS_PIE.map(c => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:c.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1 truncate">{c.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visitor Devices */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-red-500"/>Visitor Devices
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ResponsiveContainer width={110} height={110}>
                  <PieChart>
                    <Pie data={TOP_DEVICES_PIE} cx="50%" cy="50%" innerRadius={28} outerRadius={50} dataKey="value" paddingAngle={2}>
                      {TOP_DEVICES_PIE.map((d, i) => <Cell key={i} fill={d.fill}/>)}
                    </Pie>
                    <Tooltip {...TOOLTIP}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-red-900 font-bold text-xs">921</span>
                  <span className="text-red-400 text-[8px]">Total</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {TOP_DEVICES_PIE.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                    <span className="text-red-600 text-[10px] flex-1">{d.name}</span>
                    <span className="text-red-900 text-[10px] font-bold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scanned From */}
          <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500"/>Scanned From
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
                {MAP_DOTS.map((d, i) => (
                  <g key={i}>
                    <circle cx={d.x} cy={d.y} r={d.r+5} fill={d.c} opacity="0.15"/>
                    <circle cx={d.x} cy={d.y} r={d.r}   fill={d.c} opacity="0.9"/>
                    <circle cx={d.x} cy={d.y} r={d.r-1.5} fill="white" opacity="0.4"/>
                  </g>
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {[{f:"🇮🇳",c:"India",v:"934"},{f:"🇺🇸",c:"USA",v:"287"},{f:"🇬🇧",c:"UK",v:"145"},{f:"🇩🇪",c:"Germany",v:"76"}].map(l => (
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

      {/* Detail Modal */}
      <DetailModal row={detailRow} type={detailType} onClose={() => setDetailRow(null)}/>
    </div>
  );
}