import { useState } from "react";
import {
  Search, Menu, Bell, Zap, Sun, Globe, Plus, Key,
  Link2, Eye, EyeOff, Copy, Pencil, Trash2, Check, Play,
  Pause, BookOpen, Code2, ArrowUpRight, ArrowDownRight,
  CheckCircle2, X, ChevronDown, BarChart2, Activity,
} from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const INIT_KEYS = [
  { id:1, name:"Production Key", creator:"Admin",     key:"NFC_live_••••••••••8f7a", perm:"Full Access", created:"12 May 2025", status:"Active"   },
  { id:2, name:"Test Key",       creator:"Admin",     key:"NFC_test_•••••••••3c2d",  perm:"Read Only",   created:"10 May 2025", status:"Active"   },
  { id:3, name:"Mobile App Key", creator:"Developer", key:"NFC_mobile_•••••••7e4b",  perm:"Custom",      created:"08 May 2025", status:"Active"   },
  { id:4, name:"Analytics Key",  creator:"Admin",     key:"NFC_analytics_••••1a9d",  perm:"Read Only",   created:"05 May 2025", status:"Inactive" },
  { id:5, name:"Webhook Key",    creator:"Developer", key:"NFC_webhook_•••••••5b6c", perm:"Custom",      created:"02 May 2025", status:"Active"   },
];

const INIT_HOOKS = [
  { id:1, url:"https://app.example.com/webhook/nfc",  events:["card","user"],                    status:"Active",   last:"31 May, 10:30 AM" },
  { id:2, url:"https://api.example.com/nfc-events",   events:["card","user","scan","analytics"], status:"Active",   last:"31 May, 09:15 AM" },
  { id:3, url:"https://webhook.myapp.com/notify",     events:["card","scan"],                    status:"Inactive", last:"30 May, 04:20 PM" },
  { id:4, url:"https://server.example.com/hook",      events:["card","user"],                    status:"Active",   last:"31 May, 08:45 AM" },
];

const INTEGRATIONS = [
  { id:1, name:"Zapier",            bg:"bg-red-500",    letter:"Z", connected:true  },
  { id:2, name:"Google Sheets",     bg:"bg-rose-500",   letter:"G", connected:true  },
  { id:3, name:"Slack",             bg:"bg-red-700",    letter:"S", connected:true  },
  { id:4, name:"Webhook.site",      bg:"bg-rose-700",   letter:"W", connected:true  },
  { id:5, name:"Make",              bg:"bg-red-600",    letter:"M", connected:true  },
  { id:6, name:"Pabbly Connect",    bg:"bg-rose-600",   letter:"P", connected:true  },
  { id:7, name:"Microsoft Teams",   bg:"bg-red-800",    letter:"T", connected:false },
];

const EVENT_COLORS = { card:"bg-red-500", user:"bg-rose-500", scan:"bg-red-400", analytics:"bg-rose-400" };

const CHART_DATA = [
  { l:"1 May",  success:8000,  failed:2000, total:12000 },
  { l:"8 May",  success:9500,  failed:2500, total:14000 },
  { l:"15 May", success:8800,  failed:1800, total:13500 },
  { l:"22 May", success:11000, failed:3000, total:16000 },
  { l:"31 May", success:12000, failed:3200, total:18000 },
];

const SPARK_DATA = {
  total:    [30,45,35,55,42,60,55,70].map((v,i)=>({i,v})),
  success:  [25,40,32,50,38,56,50,65].map((v,i)=>({i,v})),
  failed:   [8,12,9,15,11,18,14,20].map((v,i)=>({i,v})),
  response: [100,130,115,145,125,160,140,170].map((v,i)=>({i,v})),
  active:   [3,5,4,6,5,7,6,8].map((v,i)=>({i,v})),
};

const TOOLTIP = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:10, fontSize:11 },
  labelStyle:  { color:"#991b1b" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      status==="Active"?"bg-green-100 text-green-700 border-green-200":"bg-red-100 text-red-500 border-red-200"
    }`}>{status}</span>
  );
}

function PermBadge({ perm }) {
  const map = {
    "Full Access": "bg-red-100 text-red-700 border-red-200",
    "Read Only":   "bg-rose-100 text-rose-700 border-rose-200",
    "Custom":      "bg-red-50 text-red-600 border-red-200",
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${map[perm]||""}`}>{perm}</span>;
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked?"bg-red-600":"bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked?"translate-x-4":"translate-x-0.5"}`}/>
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s={success:"bg-red-600 border-red-400",error:"bg-red-800 border-red-600",info:"bg-rose-600 border-rose-400"};
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold text-white ${s[type]||s.info}`}>
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<X className="w-4 h-4"/>:<Activity className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

function CreateKeyModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [perm, setPerm] = useState("Full Access");
  const inputCls="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300";
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2"><Key className="w-4 h-4 text-red-500"/>Create New API Key</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"><X className="w-4 h-4"/></button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Key Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Mobile App Key" className={inputCls}/>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Permissions</label>
            <div className="relative">
              <select value={perm} onChange={e=>setPerm(e.target.value)} className={`${inputCls} pr-8 appearance-none cursor-pointer`}>
                {["Full Access","Read Only","Custom"].map(p=><option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={()=>{if(name.trim())onCreate(name.trim(),perm);}}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-red-200">
            <Key className="w-4 h-4"/>Create Key
          </button>
        </div>
      </div>
    </div>
  );
}

function AddWebhookModal({ onClose, onAdd }) {
  const [url,  setUrl]  = useState("");
  const [evts, setEvts] = useState({card:true,user:false,scan:false,analytics:false});
  const inputCls="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300";
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2"><Link2 className="w-4 h-4 text-red-500"/>Add Webhook</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all"><X className="w-4 h-4"/></button>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Endpoint URL *</label>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://your-app.com/webhook" className={inputCls}/>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-2">Events</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(evts).map(e=>(
                <label key={e} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={evts[e]} onChange={ev=>setEvts(p=>({...p,[e]:ev.target.checked}))} className="w-4 h-4 accent-red-500"/>
                  <span className="text-red-700 text-xs capitalize">{e} Events</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={()=>{if(url.trim())onAdd(url.trim(),Object.keys(evts).filter(k=>evts[k]));}}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-red-200">
            <Plus className="w-4 h-4"/>Add Webhook
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function APIIntegrationsPage({ onMenuClick }) {
  const [tab,         setTab]         = useState("keys");
  const [keys,        setKeys]        = useState(INIT_KEYS);
  const [hooks,       setHooks]       = useState(INIT_HOOKS);
  const [integs,      setIntegs]      = useState(INTEGRATIONS);
  const [chartRange,  setChartRange]  = useState("This Month");
  const [showCreate,  setShowCreate]  = useState(false);
  const [showAddHook, setShowAddHook] = useState(false);
  const [toast,       setToast]       = useState({msg:"",type:"success"});
  const [revealed,    setRevealed]    = useState({});
  const [editKeyId,   setEditKeyId]   = useState(null);
  const [editName,    setEditName]    = useState("");

  const showToast = (msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:""}),3000);};

  const handleCreateKey  = (name,perm) => {
    setKeys(p=>[{id:Date.now(),name,creator:"Admin",
      key:`NFC_${name.toLowerCase().replace(/\s/g,"_").slice(0,6)}_••••${Math.random().toString(16).slice(2,6)}`,
      perm,created:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),status:"Active"},...p]);
    setShowCreate(false); showToast(`API key "${name}" created!`);
  };
  const handleDeleteKey  = (id)=>{setKeys(p=>p.filter(k=>k.id!==id));showToast("Key deleted.","info");};
  const handleReveal     = (id)=>setRevealed(p=>({...p,[id]:!p[id]}));
  const handleCopy       = (key)=>{navigator.clipboard?.writeText(key.replace(/•/g,"x")).catch(()=>{});showToast("Key copied!");};
  const handleSaveEdit   = (id)=>{setKeys(p=>p.map(k=>k.id===id?{...k,name:editName}:k));setEditKeyId(null);showToast("Key updated.");};
  const handleAddWebhook = (url,events)=>{
    setHooks(p=>[...p,{id:Date.now(),url,events,status:"Active",last:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}]);
    setShowAddHook(false); showToast("Webhook added!");
  };
  const handleDeleteHook  = (id)=>{setHooks(p=>p.filter(h=>h.id!==id));showToast("Webhook deleted.","info");};
  const handleToggleHook  = (id)=>setHooks(p=>p.map(h=>h.id===id?{...h,status:h.status==="Active"?"Inactive":"Active"}:h));
  const handleTestWebhook = (h) =>showToast(`Test ping sent to ${h.url.slice(0,30)}...`);
  const handleToggleInteg = (id)=>{
    const integ=integs.find(i=>i.id===id);
    setIntegs(p=>p.map(i=>i.id===id?{...i,connected:!i.connected}:i));
    showToast(`${integ?.name} ${integ?.connected?"disconnected":"connected"}.`,integ?.connected?"info":"success");
  };

  const STATS = [
    {Icon:BarChart2,   bg:"from-red-500 to-rose-600",  label:"Total API Requests",  value:"125,430", change:"18.6%", up:true,  spark:"total",    sc:"#ef4444"},
    {Icon:CheckCircle2,bg:"from-rose-500 to-red-600",  label:"Successful Requests", value:"112,450", change:"17.2%", up:true,  spark:"success",  sc:"#f87171"},
    {Icon:X,           bg:"from-red-700 to-rose-800",  label:"Failed Requests",     value:"12,980",  change:"8.4%",  up:false, spark:"failed",   sc:"#fca5a5"},
    {Icon:Activity,    bg:"from-rose-600 to-red-700",  label:"Avg Response Time",   value:"120 ms",  change:"12.3%", up:false, spark:"response", sc:"#ef4444"},
    {Icon:Link2,       bg:"from-red-600 to-rose-700",  label:"Active Integrations", value:"8",       change:"14.3%", up:true,  spark:"active",   sc:"#f87171"},
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4 sm:py-5">

        {/* Title + doc buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <Key className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">API &amp; Integrations</h1>
              <p className="text-red-400 text-xs hidden sm:block">Manage API keys, webhooks and integrations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>showToast("Opening API documentation...","info")}
              className="flex items-center gap-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm">
              <BookOpen className="w-3.5 h-3.5"/>
              <span className="hidden sm:inline">API Documentation</span>
              <span className="sm:hidden">Docs</span>
            </button>
            <button onClick={()=>showToast("Opening developer guide...","info")}
              className="flex items-center gap-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm">
              <Code2 className="w-3.5 h-3.5"/>
              <span className="hidden sm:inline">Developer Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {[{id:"keys",label:"API Keys",Icon:Key},{id:"webhooks",label:"Webhooks",Icon:Link2},{id:"integrations",label:"Integrations",Icon:Globe}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* Stats — 2 col → 3 sm → 5 lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {STATS.map(s=>(
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 sm:p-4 hover:border-red-300 hover:shadow-md transition-all shadow-sm overflow-hidden relative">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-2 shadow-lg shadow-red-100`}>
                <s.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="text-red-400 text-[9px] sm:text-[10px] leading-tight mb-0.5 truncate">{s.label}</div>
              <div className="text-red-900 font-bold text-base sm:text-lg leading-tight">{s.value}</div>
              <div className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up?"text-green-600":"text-red-500"}`}>
                {s.up?<ArrowUpRight className="w-3 h-3"/>:<ArrowDownRight className="w-3 h-3"/>}{s.change}
              </div>
              {/* Sparkline */}
              <div className="absolute bottom-0 right-0 left-0 h-8 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SPARK_DATA[s.spark]} margin={{top:0,right:0,left:0,bottom:0}}>
                    <Line type="monotone" dataKey="v" stroke={s.sc} strokeWidth={1.5} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* API Keys + Chart — stacked → side-by-side lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* API Keys */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="integrations"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-red-500"/>API Keys
              </h2>
              <button onClick={()=>setShowCreate(true)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg transition-all shadow-sm shadow-red-200">
                <Plus className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">Create New Key</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
            <p className="text-red-400 text-xs mb-4">Manage your API keys and access your account securely.</p>

            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Key Name","API Key","Permissions","Created","Status","Actions"].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 sm:px-3 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keys.map(k=>(
                    <tr key={k.id} className="border-b border-red-50 hover:bg-red-50/50 transition-colors">
                      <td className="px-2.5 sm:px-3 py-2.5">
                        {editKeyId===k.id
                          ? <input value={editName} onChange={e=>setEditName(e.target.value)}
                              onKeyDown={e=>e.key==="Enter"&&handleSaveEdit(k.id)} autoFocus
                              className="bg-red-50 border border-red-400 text-red-900 text-xs px-2 py-1 rounded-lg w-28 focus:outline-none"/>
                          : <div>
                              <div className="text-red-900 font-semibold truncate max-w-[90px]">{k.name}</div>
                              <div className="text-red-400 text-[10px]">by {k.creator}</div>
                            </div>
                        }
                      </td>
                      <td className="px-2.5 sm:px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="text-red-600 font-mono text-[9px] truncate max-w-[80px]">
                            {revealed[k.id]?k.key.replace(/•/g,"x"):k.key}
                          </span>
                          <button onClick={()=>handleReveal(k.id)} className="text-red-400 hover:text-red-700 transition-colors flex-shrink-0">
                            {revealed[k.id]?<EyeOff className="w-3 h-3"/>:<Eye className="w-3 h-3"/>}
                          </button>
                          <button onClick={()=>handleCopy(k.key)} className="text-red-400 hover:text-red-700 transition-colors flex-shrink-0">
                            <Copy className="w-3 h-3"/>
                          </button>
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-3 py-2.5"><PermBadge perm={k.perm}/></td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-500 whitespace-nowrap text-[10px]">{k.created}</td>
                      <td className="px-2.5 sm:px-3 py-2.5"><StatusBadge status={k.status}/></td>
                      <td className="px-2.5 sm:px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {editKeyId===k.id
                            ? <button onClick={()=>handleSaveEdit(k.id)} className="text-green-600 hover:text-green-700 transition-colors"><Check className="w-3.5 h-3.5"/></button>
                            : <button onClick={()=>{setEditKeyId(k.id);setEditName(k.name);}} className="text-red-400 hover:text-red-700 transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                          }
                          <button onClick={()=>handleDeleteKey(k.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={()=>showToast("Loading all keys...","info")}
              className="w-full mt-3 text-red-500 hover:text-red-700 text-xs font-semibold py-2 transition-colors">
              View All API Keys ({keys.length})
            </button>
          </div>

          {/* Request Usage Chart */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="integrations"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-500"/>Request Usage
              </h2>
              <select value={chartRange} onChange={e=>setChartRange(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer">
                {["This Month","Last Month","Last 7 Days"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {[{l:"Successful",c:"#16a34a"},{l:"Failed",c:"#ef4444"},{l:"Total",c:"#f87171"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.c}}/>
                  <span className="text-red-500 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={CHART_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP} itemStyle={{color:"#ef4444"}}/>
                <Line type="monotone" dataKey="success" name="Successful" stroke="#16a34a" strokeWidth={2} dot={{r:3,fill:"#16a34a",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="failed"  name="Failed"     stroke="#ef4444" strokeWidth={2} dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                <Line type="monotone" dataKey="total"   name="Total"      stroke="#f87171" strokeWidth={2} dot={{r:3,fill:"#f87171",stroke:"#fff",strokeWidth:1.5}}/>
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="text-red-400 text-[10px] mb-1">Total Requests</div>
                <div className="text-red-900 font-bold text-base">125,430</div>
                <div className="text-green-600 text-[10px] font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3"/>18.6%
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="text-red-400 text-[10px] mb-1">Remaining Quota</div>
                <div className="text-red-900 font-bold text-sm">874,570<span className="text-red-400 text-xs font-normal"> / 1M</span></div>
                <div className="mt-1.5">
                  <div className="h-1.5 bg-red-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{width:"87.5%"}}/>
                  </div>
                  <div className="text-red-400 text-[10px] mt-0.5">87.5% remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks + Integrations — stacked → side-by-side lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Webhooks */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="integrations"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <Link2 className="w-4 h-4 text-red-500"/>Webhooks
              </h2>
              <button onClick={()=>setShowAddHook(true)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-2.5 sm:px-3 py-2 rounded-lg transition-all shadow-sm shadow-red-200">
                <Plus className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">Add Webhook</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
            <p className="text-red-400 text-xs mb-4">Configure webhook endpoints for real-time events.</p>

            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[420px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Endpoint URL","Events","Status","Last Triggered",""].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 sm:px-3 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hooks.map(h=>(
                    <tr key={h.id} className="border-b border-red-50 hover:bg-red-50/50 transition-colors">
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-700 max-w-[130px] truncate text-[10px]">{h.url}</td>
                      <td className="px-2.5 sm:px-3 py-2.5">
                        <div className="flex gap-1 flex-wrap">
                          {h.events.map(e=>(
                            <span key={e} className={`w-4 h-4 rounded-sm ${EVENT_COLORS[e]||"bg-red-400"} flex items-center justify-center text-white text-[7px] font-bold`}>
                              {e[0].toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2.5 sm:px-3 py-2.5"><StatusBadge status={h.status}/></td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-400 text-[10px] whitespace-nowrap hidden sm:table-cell">{h.last}</td>
                      <td className="px-2.5 sm:px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={()=>handleTestWebhook(h)} className="text-red-400 hover:text-red-700 transition-colors"><Play className="w-3.5 h-3.5"/></button>
                          <button onClick={()=>handleToggleHook(h.id)} className={`transition-colors ${h.status==="Active"?"text-green-500 hover:text-red-500":"text-red-300 hover:text-green-600"}`}>
                            {h.status==="Active"?<Pause className="w-3.5 h-3.5"/>:<Play className="w-3.5 h-3.5"/>}
                          </button>
                          <button onClick={()=>handleDeleteHook(h.id)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={()=>showToast("Loading all webhooks...","info")}
              className="w-full mt-3 text-red-500 hover:text-red-700 text-xs font-semibold py-2 transition-colors">
              View All Webhooks ({hooks.length})
            </button>
          </div>

          {/* Third-party Integrations */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500"/>Third-party Integrations
              </h2>
              <button onClick={()=>showToast("Loading all integrations...","info")}
                className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {integs.map(integ=>(
                <div key={integ.id} className={`bg-red-50 border rounded-xl p-3 transition-all ${integ.connected?"border-red-200 hover:border-red-400":"border-red-100 opacity-60"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg ${integ.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                      {integ.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-red-900 text-[11px] font-semibold truncate">{integ.name}</div>
                      <div className={`text-[9px] font-medium ${integ.connected?"text-green-600":"text-red-400"}`}>
                        {integ.connected?"Connected":"Disconnected"}
                      </div>
                    </div>
                  </div>
                  <Toggle checked={integ.connected} onChange={()=>handleToggleInteg(integ.id)}/>
                </div>
              ))}
              <button onClick={()=>showToast("Opening integration marketplace...","info")}
                className="bg-red-50 border-2 border-dashed border-red-200 hover:border-red-400 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all group">
                <div className="w-7 h-7 rounded-full bg-white border border-red-200 group-hover:bg-red-100 flex items-center justify-center transition-all">
                  <Plus className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors"/>
                </div>
                <span className="text-red-400 group-hover:text-red-700 text-[10px] font-medium transition-colors">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreate  && <CreateKeyModal   onClose={()=>setShowCreate(false)}   onCreate={handleCreateKey}/>}
      {showAddHook && <AddWebhookModal  onClose={()=>setShowAddHook(false)}  onAdd={handleAddWebhook}/>}
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}