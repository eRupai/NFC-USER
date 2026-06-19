import { useState, useMemo } from "react";
import {
  Search, Filter, Eye, CheckCircle2, XCircle, Lock, Clock,
  CreditCard, Radio, Wifi, MapPin, Share2, Mail, Phone,
  MessageSquare, Globe, Users, Bookmark, Copy, ArrowUpRight,
  ChevronDown, ChevronLeft, ChevronRight, BarChart2, X,
  HardDrive, Tag, Activity, Zap, Flag, UserCheck,
  AlertTriangle, Plus, QrCode,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped — only this user's own cards) ──────────────────────────

const TYPE_ICONS = {
  "URL / Link":   { Icon: Globe,         bg: "bg-red-500"  },
  "vCard":        { Icon: Users,         bg: "bg-rose-600" },
  "WiFi":         { Icon: Wifi,          bg: "bg-red-600"  },
  "Social Media": { Icon: Share2,        bg: "bg-rose-500" },
  "Location":     { Icon: MapPin,        bg: "bg-red-700"  },
  "Text":         { Icon: Copy,          bg: "bg-rose-700" },
  "Email":        { Icon: Mail,          bg: "bg-red-400"  },
  "Phone":        { Icon: Phone,         bg: "bg-rose-400" },
  "SMS":          { Icon: MessageSquare, bg: "bg-red-500"  },
  "App Link":     { Icon: Bookmark,      bg: "bg-rose-600" },
};

const MY_CARDS = [
  { id:1,  name:"My Website Link",    sub:"https://mywebsite.com",   type:"URL / Link",   status:"Active",   lastScan:"2 min ago",    scans:2456, tag:"Business"  },
  { id:2,  name:"My vCard",           sub:"Personal Contact",        type:"vCard",         status:"Active",   lastScan:"15 min ago",   scans:1856, tag:"Contact"   },
  { id:3,  name:"Office WiFi",        sub:"Office_Network_5G",       type:"WiFi",          status:"Active",   lastScan:"1 hour ago",   scans:1245, tag:"Office"    },
  { id:4,  name:"Instagram Profile",  sub:"@yourusername",           type:"Social Media",  status:"Active",   lastScan:"2 hours ago",  scans:987,  tag:"Social"    },
  { id:5,  name:"Office Location",    sub:"Mumbai, India",           type:"Location",      status:"Active",   lastScan:"3 hours ago",  scans:756,  tag:"Office"    },
  { id:6,  name:"Product Info Card",  sub:"Product Details & Link",  type:"Text",          status:"Locked",   lastScan:"1 day ago",    scans:432,  tag:"Product"   },
  { id:7,  name:"Event Access Pass",  sub:"24 May 2025",             type:"Text",          status:"Active",   lastScan:"1 day ago",    scans:389,  tag:"Event"     },
  { id:8,  name:"Support Email",      sub:"support@company.com",     type:"Email",         status:"Active",   lastScan:"2 days ago",   scans:278,  tag:"Support"   },
  { id:9,  name:"My Phone Number",    sub:"+91 98765 43210",         type:"Phone",         status:"Active",   lastScan:"2 days ago",   scans:198,  tag:"Contact"   },
  { id:10, name:"Promo Text Card",    sub:"Special Offer Inside!",   type:"Text",          status:"Expired",  lastScan:"5 days ago",   scans:145,  tag:"Marketing" },
  { id:11, name:"App Download Link",  sub:"myapp://download",        type:"App Link",      status:"Active",   lastScan:"2 weeks ago",  scans:87,   tag:"Product"   },
  { id:12, name:"Feedback Form",      sub:"https://forms.google.com",type:"URL / Link",    status:"Active",   lastScan:"1 month ago",  scans:54,   tag:"Business"  },
];

const RECENT_SCANS = [
  { name:"My Website Link",   loc:"Mumbai, India",     time:"2 min ago",  Icon:Globe,  bg:"bg-red-500"  },
  { name:"My vCard",          loc:"New Delhi, India",  time:"15 min ago", Icon:Users,  bg:"bg-rose-600" },
  { name:"Office WiFi",       loc:"Bangalore, India",  time:"32 min ago", Icon:Wifi,   bg:"bg-red-600"  },
  { name:"Instagram Profile", loc:"Hyderabad, India",  time:"1 hour ago", Icon:Share2, bg:"bg-rose-500" },
  { name:"Office Location",   loc:"Pune, India",       time:"2 hours ago",Icon:MapPin, bg:"bg-red-700"  },
];

const PER_PAGE_OPTS = [10, 20, 50];

const TOOLTIP = {
  contentStyle:{ background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11 },
  labelStyle:{ color:"#991b1b" }, itemStyle:{ color:"#ef4444" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = { Active:"bg-green-100 text-green-700 border-green-200", Locked:"bg-amber-100 text-amber-700 border-amber-200", Expired:"bg-red-100 text-red-600 border-red-200" };
  const icons = { Active:<CheckCircle2 className="w-3 h-3"/>, Locked:<Lock className="w-3 h-3"/>, Expired:<XCircle className="w-3 h-3"/> };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${map[status]||""}`}>
      {icons[status]}{status}
    </span>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = { success:"bg-red-600 border-red-400 text-white", error:"bg-red-800 border-red-600 text-white", info:"bg-rose-600 border-rose-400 text-white" };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      <CheckCircle2 className="w-4 h-4"/>
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── VIEW CARD MODAL (read-only) ─────────────────────────────────────────────

function ViewCardModal({ card, onClose }) {
  const ti = TYPE_ICONS[card.type] || { Icon: CreditCard, bg: "bg-red-500" };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-5 w-full max-w-sm shadow-2xl shadow-red-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-red-500"/>Card Details
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-700 transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Card header */}
        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
          <div className={`w-12 h-12 rounded-xl ${ti.bg} flex items-center justify-center flex-shrink-0 shadow-md shadow-red-200`}>
            <ti.Icon className="w-6 h-6 text-white"/>
          </div>
          <div>
            <div className="text-red-900 font-bold text-sm">{card.name}</div>
            <div className="text-red-400 text-xs mb-1">{card.sub}</div>
            <StatusBadge status={card.status}/>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { l:"Total Scans", v: card.scans.toLocaleString() },
            { l:"Last Scanned", v: card.lastScan },
            { l:"Type",        v: card.type     },
            { l:"Tag",         v: card.tag      },
          ].map(r => (
            <div key={r.l} className="bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="text-red-400 text-[10px] mb-0.5">{r.l}</div>
              <div className="text-red-900 text-xs font-semibold">{r.v}</div>
            </div>
          ))}
        </div>

        {/* QR hint */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-3 mb-4 text-white">
          <QrCode className="w-8 h-8 opacity-90 flex-shrink-0"/>
          <div>
            <div className="text-xs font-bold mb-0.5">Scan to share this card</div>
            <div className="text-[10px] opacity-80">Show your NFC card QR code to anyone.</div>
          </div>
        </div>

        <button onClick={onClose}
          className="w-full bg-red-50 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-red-100 transition-all">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function UserNFCCardsPage({ onMenuClick }) {
  const [search,      setSearch]      = useState("");
  const [typeFilter,  setTypeFilter]  = useState("All Types");
  const [statusFilter,setStatusFilter]= useState("All Status");
  const [tagFilter,   setTagFilter]   = useState("All Tags");
  const [page,        setPage]        = useState(1);
  const [perPage,     setPerPage]     = useState(10);
  const [filterOpen,  setFilterOpen]  = useState(false);
  const [viewCard,    setViewCard]    = useState(null);
  const [toast,       setToast]       = useState({ msg:"", type:"success" });

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:""}),3000); };

  const totalCards   = MY_CARDS.length;
  const activeCards  = MY_CARDS.filter(c=>c.status==="Active").length;
  const lockedCards  = MY_CARDS.filter(c=>c.status==="Locked").length;
  const expiredCards = MY_CARDS.filter(c=>c.status==="Expired").length;
  const totalScans   = MY_CARDS.reduce((s,c)=>s+c.scans, 0);

  const allTypes = ["All Types", ...new Set(MY_CARDS.map(c=>c.type))];
  const allTags  = ["All Tags",  ...new Set(MY_CARDS.map(c=>c.tag))];

  const filtered = useMemo(() =>
    MY_CARDS.filter(c => {
      const q = search.toLowerCase();
      return (
        (!q || c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q))
        && (typeFilter   === "All Types"   || c.type   === typeFilter)
        && (statusFilter === "All Status"  || c.status === statusFilter)
        && (tagFilter    === "All Tags"    || c.tag    === tagFilter)
      );
    })
  , [search, typeFilter, statusFilter, tagFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page-1)*perPage, page*perPage);

  const pageBtns = () => {
    if (totalPages <= 7) return Array.from({length:totalPages},(_,i)=>i+1);
    if (page <= 4) return [1,2,3,4,5,"...",totalPages];
    if (page >= totalPages-3) return [1,"...",totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
    return [1,"...",page-1,page,page+1,"...",totalPages];
  };

  const STATS = [
    { Icon:CreditCard,   bg:"from-red-500 to-rose-600",  label:"My Total Cards",  value:totalCards,                 sub:"+18.5% this month", up:true  },
    { Icon:CheckCircle2, bg:"from-rose-500 to-red-600",  label:"Active Cards",    value:activeCards,                sub:`${((activeCards/totalCards)*100).toFixed(1)}% of total`, up:null },
    { Icon:Lock,         bg:"from-red-700 to-rose-800",  label:"Locked Cards",    value:lockedCards,                sub:`${((lockedCards/totalCards)*100).toFixed(1)}% of total`, up:null },
    { Icon:XCircle,      bg:"from-rose-700 to-red-800",  label:"Expired Cards",   value:expiredCards,               sub:`${((expiredCards/totalCards)*100).toFixed(1)}% of total`, up:null },
    { Icon:ArrowUpRight, bg:"from-red-600 to-rose-700",  label:"Total Scans",     value:totalScans.toLocaleString(),sub:"+32.7% this month", up:true  },
    { Icon:Radio,        bg:"from-rose-600 to-red-700",  label:"Scans Today",     value:"128",                      sub:"Last scan 2 min ago", up:true },
  ];

  const selCls = "bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>
      {viewCard && <ViewCardModal card={viewCard} onClose={() => setViewCard(null)}/>}

      <div className="flex-1 overflow-y-auto min-h-0">

        {/* Header */}
        <div className="px-3 sm:px-5 pt-4 pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
                <CreditCard className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h1 className="text-red-900 font-bold text-xl sm:text-2xl">My NFC Cards</h1>
                <p className="text-red-400 text-xs hidden sm:block">View and monitor all your NFC cards and scan activity.</p>
              </div>
            </div>
            <button
              onClick={() => showToast("Card creation coming soon!", "info")}
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-md shadow-red-200 transition-all">
              <Plus className="w-3.5 h-3.5"/>New Card
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-3 sm:px-5 pb-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STATS.map(s => (
              <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-2.5 shadow-sm hover:border-red-300 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0`}>
                  <s.Icon className="w-5 h-5 text-white"/>
                </div>
                <div className="min-w-0">
                  <div className="text-red-400 text-[10px] truncate">{s.label}</div>
                  <div className="text-red-900 font-bold text-lg leading-tight">{typeof s.value==="number"?s.value.toLocaleString():s.value}</div>
                  <div className={`text-[10px] flex items-center gap-0.5 ${s.up===true?"text-green-600":s.up===false?"text-red-500":"text-red-400"}`}>
                    {s.up===true && <ArrowUpRight className="w-3 h-3 flex-shrink-0"/>}
                    <span className="truncate">{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main: Table + Right Panel */}
        <div className="px-3 sm:px-5 pb-5">
          <div className="flex flex-col xl:flex-row gap-4">

            {/* Table Panel */}
            <div className="flex-1 min-w-0 bg-white border border-red-100 rounded-xl shadow-sm">

              {/* Filter bar */}
              <div className="p-3 sm:p-4 border-b border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300"/>
                    <input
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search by name, tag..."
                      className="w-full bg-red-50 border border-red-200 text-red-900 text-xs pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
                  </div>
                  <button
                    onClick={() => setFilterOpen(p => !p)}
                    className="sm:hidden w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 flex-shrink-0">
                    <Filter className="w-4 h-4"/>
                  </button>
                </div>
                <div className={`${filterOpen?"flex":"hidden"} sm:flex flex-wrap items-center gap-2`}>
                  <select value={typeFilter}   onChange={e=>{setTypeFilter(e.target.value);setPage(1);}}   className={selCls}>{allTypes.map(t=><option key={t}>{t}</option>)}</select>
                  <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}} className={selCls}>{["All Status","Active","Locked","Expired"].map(s=><option key={s}>{s}</option>)}</select>
                  <select value={tagFilter}    onChange={e=>{setTagFilter(e.target.value);setPage(1);}}    className={selCls}>{allTags.map(t=><option key={t}>{t}</option>)}</select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-red-50 border-b border-red-100">
                      {["Card Info","Type","Status","Last Scan","Scans","Tag",""].map(h => (
                        <th key={h} className="text-left text-red-500 font-semibold px-3 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0
                      ? <tr><td colSpan={7} className="text-center text-red-300 py-12">No cards found</td></tr>
                      : rows.map(card => {
                          const ti = TYPE_ICONS[card.type] || { Icon: CreditCard, bg: "bg-red-500" };
                          return (
                            <tr key={card.id}
                              className="border-b border-red-50 hover:bg-red-50/50 transition-colors cursor-pointer"
                              onClick={() => setViewCard(card)}>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-lg ${ti.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                    <ti.Icon className="w-4 h-4 text-white"/>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-red-900 font-semibold truncate max-w-[120px]">{card.name}</div>
                                    <div className="text-red-400 text-[10px] truncate max-w-[120px]">{card.sub}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3 text-red-600 whitespace-nowrap text-[11px]">{card.type}</td>
                              <td className="px-3 py-3"><StatusBadge status={card.status}/></td>
                              <td className="px-3 py-3 text-red-400 whitespace-nowrap text-[11px]">{card.lastScan}</td>
                              <td className="px-3 py-3 text-red-900 font-semibold">{card.scans.toLocaleString()}</td>
                              <td className="px-3 py-3">
                                <span className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{card.tag}</span>
                              </td>
                              <td className="px-3 py-3">
                                <button
                                  onClick={e => { e.stopPropagation(); setViewCard(card); }}
                                  className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:border-red-400 transition-all">
                                  <Eye className="w-3.5 h-3.5"/>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    }
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-3 border-t border-red-100">
                <span className="text-red-400 text-xs">
                  Showing {filtered.length===0?0:(page-1)*perPage+1}–{Math.min(page*perPage,filtered.length)} of {filtered.length} cards
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                    className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center transition-all">
                    <ChevronLeft className="w-4 h-4"/>
                  </button>
                  {pageBtns().map((p,i) => (
                    <button key={i} onClick={() => typeof p==="number" && setPage(p)}
                      className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all
                        ${p===page?"bg-red-600 border-red-600 text-white":p==="..."?"border-transparent text-red-300 cursor-default":"border-red-200 text-red-500 hover:border-red-500 hover:text-red-700"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                    className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4"/>
                  </button>
                  <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                    className="bg-red-50 border border-red-200 text-red-700 text-xs px-2 py-1.5 rounded-lg outline-none cursor-pointer">
                    {PER_PAGE_OPTS.map(n => <option key={n}>{n} / page</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full xl:w-72 xl:flex-shrink-0 flex flex-col gap-4">

              {/* My Cards Overview */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-red-900 font-semibold text-sm">Cards Overview</h3>
                  <span className="text-red-400 text-[10px]">Live</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={[
                            {name:"Active",  value:activeCards,  fill:"#ef4444"},
                            {name:"Locked",  value:lockedCards,  fill:"#fca5a5"},
                            {name:"Expired", value:expiredCards, fill:"#fecaca"},
                          ]}
                          cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" paddingAngle={2}>
                          {[0,1,2].map(i => <Cell key={i} fill={["#ef4444","#fca5a5","#fecaca"][i]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:10}} itemStyle={{color:"#ef4444"}}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-red-900 font-bold text-sm">{totalCards}</span>
                      <span className="text-red-400 text-[8px]">Total</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      {name:"Active",  val:activeCards,  fill:"#ef4444"},
                      {name:"Locked",  val:lockedCards,  fill:"#fca5a5"},
                      {name:"Expired", val:expiredCards, fill:"#fecaca"},
                    ].map(d => (
                      <div key={d.name}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                          <span className="text-red-600 text-xs flex-1">{d.name}</span>
                          <span className="text-red-900 text-xs font-bold">{d.val}</span>
                        </div>
                        <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${(d.val/totalCards)*100}%`,background:d.fill}}/>
                        </div>
                      </div>
                    ))}
                    {expiredCards > 0 && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0"/>
                        <span className="text-red-600 text-[11px] font-semibold">{expiredCards} expired — renew now</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Cards by Scans */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2 mb-3">
                  <BarChart2 className="w-4 h-4 text-red-500"/>Top Cards by Scans
                </h3>
                <div className="space-y-2.5">
                  {MY_CARDS.sort((a,b)=>b.scans-a.scans).slice(0,5).map(card => {
                    const ti = TYPE_ICONS[card.type] || { Icon: CreditCard, bg: "bg-red-500" };
                    const maxScans = MY_CARDS[0] ? Math.max(...MY_CARDS.map(c=>c.scans)) : 1;
                    return (
                      <div key={card.id} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg ${ti.bg} flex items-center justify-center flex-shrink-0`}>
                          <ti.Icon className="w-3 h-3 text-white"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-red-700 text-xs truncate">{card.name}</span>
                            <span className="text-red-900 text-xs font-bold ml-2 flex-shrink-0">{card.scans.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-red-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{width:`${(card.scans/maxScans)*100}%`}}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Scans */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500"/>Recent Scans
                  </h3>
                  <button className="text-red-500 text-[10px] font-semibold hover:text-red-700">View All</button>
                </div>
                <div className="space-y-2.5">
                  {RECENT_SCANS.map((s,i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <s.Icon className="w-3.5 h-3.5 text-white"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-900 text-xs font-medium truncate">{s.name}</div>
                        <div className="text-red-400 text-[10px] truncate">{s.loc}</div>
                      </div>
                      <span className="text-red-400 text-[10px] flex-shrink-0">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Usage */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-red-500"/>Storage Usage
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0" style={{width:80,height:80}}>
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#fecaca" strokeWidth="8"/>
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#ef4444" strokeWidth="8"
                        strokeDasharray={`${(65/100)*188} 188`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-red-900 font-bold text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-500 text-xs">Used</span>
                      <span className="text-red-900 text-xs font-bold">2.6 MB</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-500 text-xs">Total</span>
                      <span className="text-red-900 text-xs font-bold">4 MB</span>
                    </div>
                    <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{width:"65%"}}/>
                    </div>
                    <div className="text-red-400 text-[10px] mt-1">1.4 MB remaining</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({msg:""})}/>
    </div>
  );
}