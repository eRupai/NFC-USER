import { useState, useMemo } from "react";
import {
  Search, Plus, LayoutGrid, List, Filter, ChevronDown,
  User, Link2, FileText, Wifi, Mail, Phone, MessageSquare, MessageCircle,
  MapPin, Share2, Bookmark, Code2, Settings, Globe, Briefcase, Calendar,
  Eye, Trash2, Pencil, CheckCircle2, ChevronRight, Save,
  HardDrive, TrendingUp, Star, X, MoreVertical, Radio, AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TYPE_STYLES = {
  vCard:    { bg:"from-red-500 to-rose-700",   badge:"bg-red-100 text-red-700 border-red-300"    },
  Social:   { bg:"from-rose-500 to-red-700",   badge:"bg-rose-100 text-rose-700 border-rose-300" },
  URL:      { bg:"from-red-600 to-rose-800",   badge:"bg-red-100 text-red-600 border-red-200"    },
  WiFi:     { bg:"from-rose-600 to-red-800",   badge:"bg-rose-100 text-rose-600 border-rose-200" },
  Contact:  { bg:"from-red-400 to-rose-600",   badge:"bg-red-50 text-red-500 border-red-200"     },
  Location: { bg:"from-red-700 to-rose-900",   badge:"bg-red-100 text-red-700 border-red-300"    },
  WhatsApp: { bg:"from-rose-500 to-red-600",   badge:"bg-rose-100 text-rose-600 border-rose-200" },
  Event:    { bg:"from-red-500 to-rose-600",   badge:"bg-red-100 text-red-600 border-red-200"    },
  Custom:   { bg:"from-rose-700 to-red-900",   badge:"bg-rose-100 text-rose-700 border-rose-300" },
  Email:    { bg:"from-red-400 to-rose-700",   badge:"bg-red-50 text-red-500 border-red-200"     },
  AppLink:  { bg:"from-rose-600 to-red-700",   badge:"bg-rose-100 text-rose-600 border-rose-200" },
};

const TYPE_ICONS = {
  vCard:User, Social:Share2, URL:Link2, WiFi:Wifi, Contact:Phone,
  Location:MapPin, WhatsApp:MessageCircle, Event:Calendar,
  Custom:Code2, Email:Mail, AppLink:Bookmark,
};

const DATA_TYPES = [
  { id:"url",      Icon:Link2,         label:"URL / Link"   },
  { id:"vcard",    Icon:User,          label:"vCard"        },
  { id:"text",     Icon:FileText,      label:"Text"         },
  { id:"wifi",     Icon:Wifi,          label:"WiFi"         },
  { id:"email",    Icon:Mail,          label:"Email"        },
  { id:"phone",    Icon:Phone,         label:"Phone"        },
  { id:"sms",      Icon:MessageSquare, label:"SMS"          },
  { id:"whatsapp", Icon:MessageCircle, label:"WhatsApp"     },
  { id:"location", Icon:MapPin,        label:"Location"     },
  { id:"social",   Icon:Share2,        label:"Social Media" },
  { id:"applink",  Icon:Bookmark,      label:"App Link"     },
  { id:"custom",   Icon:Code2,         label:"Custom"       },
];

const CAT_ICONS_MAP = {
  All:Globe, Business:Briefcase, "Social Media":Share2,
  Contact:Phone, WiFi:Wifi, Link:Link2, Location:MapPin,
  Event:Calendar, Custom:Settings,
};

// Community templates (read-only browsing) + user's own templates
const INIT_TEMPLATES = [
  { id:1,  name:"Business Card",    sub:"vCard Template",        type:"vCard",    cat:"Business",     uses:1200, saves:512,  mine:false },
  { id:2,  name:"Social Profile",   sub:"Social Media Links",    type:"Social",   cat:"Social Media", uses:2400, saves:1100, mine:false },
  { id:3,  name:"Website Link",     sub:"URL / Link",            type:"URL",      cat:"Link",         uses:3600, saves:1800, mine:false },
  { id:4,  name:"WiFi Access",      sub:"WiFi Credentials",      type:"WiFi",     cat:"WiFi",         uses:896,  saves:412,  mine:false },
  { id:5,  name:"Contact Details",  sub:"Contact Information",   type:"Contact",  cat:"Contact",      uses:1800, saves:742,  mine:true  },
  { id:6,  name:"Location",         sub:"Map Location",          type:"Location", cat:"Location",     uses:654,  saves:321,  mine:false },
  { id:7,  name:"WhatsApp Chat",    sub:"WhatsApp Link",         type:"WhatsApp", cat:"Social Media", uses:1100, saves:521,  mine:true  },
  { id:8,  name:"Event Access",     sub:"Event Information",     type:"Event",    cat:"Event",        uses:432,  saves:210,  mine:false },
  { id:9,  name:"Product Info",     sub:"Product Details",       type:"Custom",   cat:"Business",     uses:321,  saves:154,  mine:false },
  { id:10, name:"Email Signature",  sub:"Email Address",         type:"Email",    cat:"Contact",      uses:964,  saves:432,  mine:true  },
  { id:11, name:"App Download",     sub:"App Store / Play Store",type:"AppLink",  cat:"Link",         uses:876,  saves:401,  mine:false },
  { id:12, name:"Custom Data",      sub:"NDEF / Text / JSON",    type:"Custom",   cat:"Custom",       uses:289,  saves:123,  mine:false },
  { id:13, name:"Restaurant Menu",  sub:"URL / Link",            type:"URL",      cat:"Business",     uses:540,  saves:230,  mine:false },
  { id:14, name:"Portfolio Card",   sub:"vCard Template",        type:"vCard",    cat:"Business",     uses:980,  saves:450,  mine:true  },
  { id:15, name:"Store Locator",    sub:"Map Location",          type:"Location", cat:"Location",     uses:312,  saves:145,  mine:false },
  { id:16, name:"Event Ticket",     sub:"Event Information",     type:"Event",    cat:"Event",        uses:765,  saves:380,  mine:false },
  { id:17, name:"Music Profile",    sub:"Social Media Links",    type:"Social",   cat:"Social Media", uses:1450, saves:670,  mine:false },
  { id:18, name:"Hotel WiFi",       sub:"WiFi Credentials",      type:"WiFi",     cat:"WiFi",         uses:423,  saves:201,  mine:false },
  { id:19, name:"Instagram Link",   sub:"Social Media Links",    type:"Social",   cat:"Social Media", uses:2100, saves:950,  mine:true  },
  { id:20, name:"Booking Link",     sub:"URL / Link",            type:"URL",      cat:"Link",         uses:1320, saves:620,  mine:false },
];

const CATEGORIES  = ["All Categories","Business","Social Media","Contact","WiFi","Link","Location","Event","Custom"];
const TYPE_FILTER = ["All Types","vCard","Social","URL","WiFi","Contact","Location","WhatsApp","Event","Custom","Email","AppLink"];
const SORT_OPTS   = ["Latest","Most Used","Most Saved","Oldest"];
const CAT_PILLS   = ["All","Business","Social Media","Contact","WiFi","Link","Location","Event","Custom"];

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

const USAGE_CHART = [
  {name:"vCard",uses:2180},{name:"Social",uses:5950},{name:"URL",uses:5240},
  {name:"WiFi", uses:624}, {name:"Contact",uses:1396},{name:"Event",uses:1197},
];

const TOOLTIP_STYLE = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:10, fontSize:11 },
  labelStyle:  { color:"#991b1b" },
  itemStyle:   { color:"#ef4444" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = {
    success:"bg-red-600 border-red-400 text-white",
    error:  "bg-red-800 border-red-600 text-white",
    info:   "bg-rose-600 border-rose-400 text-white",
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<AlertCircle className="w-4 h-4"/>:<Radio className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

function ConfirmModal({ title, msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <h3 className="text-red-900 font-bold text-base mb-2">{title}</h3>
        <p className="text-red-500 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4"/>Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TEMPLATE CARD ────────────────────────────────────────────────────────────

function TemplateCard({ tpl, viewMode, onUse, onEdit, onDelete, onSaveToggle, saved }) {
  const [open, setOpen] = useState(false);
  const st   = TYPE_STYLES[tpl.type] || TYPE_STYLES.Custom;
  const Icon = TYPE_ICONS[tpl.type]  || Code2;

  // Only show Edit/Delete for user's own templates
  const menuItems = [
    { label:"Use Template", action:onUse,         Icon:CheckCircle2, color:"text-red-600"  },
    { label:saved?"Unsave":"Save", action:onSaveToggle, Icon:Bookmark, color:"text-rose-600" },
    ...(tpl.mine ? [
      { label:"Edit",   action:onEdit,   Icon:Pencil, color:"text-red-900" },
      { label:"Delete", action:onDelete, Icon:Trash2, color:"text-red-500" },
    ] : []),
  ];

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-red-100 hover:border-red-300 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-4 transition-all group shadow-sm hover:shadow-md">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${st.bg} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="text-red-900 font-semibold text-xs sm:text-sm truncate">{tpl.name}</div>
            {tpl.mine && <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Mine</span>}
          </div>
          <div className="text-red-400 text-[10px] hidden sm:block">{tpl.sub}</div>
        </div>
        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 hidden sm:inline ${st.badge}`}>{tpl.type}</span>
        <div className="hidden md:flex items-center gap-3 text-xs text-red-400 flex-shrink-0">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{fmt(tpl.uses)}</span>
          <span className="flex items-center gap-1"><Bookmark className="w-3 h-3"/>{fmt(tpl.saves)}</span>
        </div>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={()=>onUse(tpl)} className="bg-red-600 hover:bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg transition-all">Use</button>
          {tpl.mine && (
            <button onClick={()=>onEdit(tpl)} className="hidden sm:block bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all">Edit</button>
          )}
          <button onClick={()=>onSaveToggle(tpl)} className={`transition-colors p-1.5 ${saved?"text-red-500":"text-red-200 hover:text-red-500"}`}>
            <Bookmark className="w-3.5 h-3.5"/>
          </button>
          {tpl.mine && (
            <button onClick={()=>onDelete(tpl)} className="text-red-300 hover:text-red-600 transition-colors p-1.5">
              <Trash2 className="w-3.5 h-3.5"/>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-red-100 hover:border-red-300 rounded-xl overflow-hidden transition-all group relative shadow-sm hover:shadow-lg">
      <div className={`relative h-[90px] sm:h-[100px] bg-gradient-to-br ${st.bg}`}>
        <div className="absolute inset-3 flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white"/>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="h-2 bg-white/35 rounded-full w-3/4"/>
            <div className="h-1.5 bg-white/20 rounded-full w-1/2"/>
            <div className="h-1.5 bg-white/20 rounded-full w-2/3"/>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <button onClick={()=>setOpen(p=>!p)}
            className="w-6 h-6 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all">
            <MoreVertical className="w-3.5 h-3.5"/>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={()=>setOpen(false)}/>
              <div className="absolute right-0 top-7 bg-white border border-red-200 rounded-xl shadow-2xl shadow-red-100 overflow-hidden z-20 w-36">
                {menuItems.map(m => (
                  <button key={m.label} onClick={()=>{ m.action(tpl); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-red-50 transition-colors flex items-center gap-2 ${m.color}`}>
                    <m.Icon className="w-3.5 h-3.5 flex-shrink-0"/>{m.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {saved && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
            <Bookmark className="w-3 h-3 text-red-500"/>
          </div>
        )}
        {tpl.mine && (
          <div className="absolute bottom-2 left-2 text-[9px] font-bold bg-white/90 text-red-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5"/>Mine
          </div>
        )}
      </div>
      <div className="px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white">
        <div className="flex items-start justify-between gap-1 mb-1">
          <div className="min-w-0">
            <div className="text-red-900 font-semibold text-xs leading-tight truncate">{tpl.name}</div>
            <div className="text-red-400 text-[10px] hidden sm:block">{tpl.sub}</div>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${st.badge}`}>{tpl.type}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-red-400">
            <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5"/>{fmt(tpl.uses)}</span>
            <span className="flex items-center gap-0.5"><Bookmark className="w-2.5 h-2.5"/>{fmt(tpl.saves)}</span>
          </div>
          <button onClick={()=>onUse(tpl)}
            className="text-[9px] font-bold bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5"/>Use
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CREATE TEMPLATE PANEL ────────────────────────────────────────────────────

function CreateTemplatePanel({ onSave, editData, onReset }) {
  const [step,      setStep]      = useState(1);
  const [name,      setName]      = useState(editData?.name || "");
  const [category,  setCategory]  = useState(editData?.cat  || "");
  const [desc,      setDesc]      = useState("");
  const [selType,   setSelType]   = useState(editData ? DATA_TYPES.findIndex(d=>d.label.toLowerCase().includes((editData.type||"").toLowerCase())) : -1);
  const [dynLink,   setDynLink]   = useState(false);
  const [lockAfter, setLockAfter] = useState(false);
  const [password,  setPassword]  = useState(false);
  const [expiry,    setExpiry]    = useState(false);
  const [allowRW,   setAllowRW]   = useState(true);
  const [fieldVals, setFieldVals] = useState({});

  const STEPS = ["Template Info","Add Data","Preview","Save"];
  const selDT = selType >= 0 ? DATA_TYPES[selType] : null;
  const pct   = ((step-1)/3)*100;

  const handleNext = () => {
    if (step===1 && !name.trim()) return;
    if (step===2 && selType<0) return;
    if (step<4) setStep(s=>s+1);
  };
  const handleSave = () => {
    if (!name.trim() || selType<0) return;
    onSave({ name:name.trim(), cat:category||"Custom", type:selDT?.label?.split(" ")[0]||"Custom", sub:selDT?.label||"Custom" });
    setName(""); setCategory(""); setDesc(""); setSelType(-1); setStep(1); setFieldVals({});
  };
  const handleReset = () => {
    setName(""); setCategory(""); setDesc(""); setSelType(-1); setStep(1); setFieldVals({});
    if (onReset) onReset();
  };

  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-red-900 font-bold text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-500"/>
          {editData ? "Edit Template" : "Create Template"}
        </h2>
        <p className="text-red-400 text-xs mt-0.5">Build your own NFC template</p>
      </div>

      {/* Step wizard */}
      <div className="relative mb-5">
        <div className="flex items-center justify-between relative z-10">
          {STEPS.map((s,i) => {
            const n=i+1, done=step>n, curr=step===n;
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <button onClick={()=>n<step&&setStep(n)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done?"bg-red-600 border-red-500 text-white":
                    curr?"bg-red-700 border-red-600 text-white":
                         "bg-red-50 border-red-200 text-red-400"
                  }`}>
                  {done?<CheckCircle2 className="w-3.5 h-3.5"/>:n}
                </button>
                <span className={`text-[9px] font-medium whitespace-nowrap ${curr?"text-red-700":done?"text-red-600":"text-red-300"}`}>{s}</span>
              </div>
            );
          })}
        </div>
        <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5 bg-red-100 -z-0">
          <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-500 rounded-full" style={{width:`${pct}%`}}/>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">

        {step===1 && (
          <>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Template Name *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-300"/>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. My Business Card"
                  className={`${inputCls} pl-8`}/>
              </div>
            </div>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Category</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-300 pointer-events-none"/>
                <select value={category} onChange={e=>setCategory(e.target.value)}
                  className={`${inputCls} pl-8 pr-8 appearance-none cursor-pointer`}>
                  <option value="">Select Category</option>
                  {CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
              </div>
            </div>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Description <span className="text-red-300">(Optional)</span></label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} placeholder="Enter template description..."
                className={`${inputCls} resize-none`}/>
            </div>
          </>
        )}

        {step===2 && (
          <>
            <p className="text-red-600 text-xs mb-2 flex items-center gap-1.5"><Settings className="w-3 h-3"/>Select Data Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {DATA_TYPES.map((dt,i) => (
                <button key={dt.id} onClick={()=>setSelType(i)}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border text-xs transition-all ${
                    selType===i?"bg-red-600 border-red-600 text-white shadow-md":"bg-red-50 border-red-200 text-red-600 hover:border-red-400 hover:bg-red-100"
                  }`}>
                  <dt.Icon className="w-3.5 h-3.5 flex-shrink-0"/>
                  <span className="font-medium truncate">{dt.label}</span>
                </button>
              ))}
            </div>
            {selType>=0 && (
              <div className="mt-2">
                <label className="text-red-600 text-xs font-medium block mb-1">{DATA_TYPES[selType].label} Value *</label>
                <input value={fieldVals.main||""} onChange={e=>setFieldVals(p=>({...p,main:e.target.value}))}
                  placeholder={`Enter ${DATA_TYPES[selType].label} data...`} className={inputCls}/>
              </div>
            )}
            <div className="border-t border-red-100 pt-3 mt-1">
              <p className="text-red-700 text-xs font-semibold mb-2 flex items-center gap-1.5"><Settings className="w-3 h-3 text-red-400"/>Advanced Options</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                {[
                  {label:"Enable Dynamic Data", val:dynLink,   set:setDynLink   },
                  {label:"Lock After Write",     val:lockAfter, set:setLockAfter },
                  {label:"Set Password",         val:password,  set:setPassword  },
                  {label:"Set Expiry Date",      val:expiry,    set:setExpiry    },
                  {label:"Allow Re-Write",       val:allowRW,   set:setAllowRW   },
                ].map(opt => (
                  <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={opt.val} onChange={e=>opt.set(e.target.checked)} className="w-3.5 h-3.5 accent-red-500"/>
                    <span className="text-red-600 text-[10px] group-hover:text-red-800 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {step===3 && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-500 text-[10px] font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3 h-3"/>Template Preview
              </p>
              {(()=>{
                const PreviewIcon = selType>=0 ? DATA_TYPES[selType].Icon : Code2;
                const previewBg   = selType>=0 ? (TYPE_STYLES[DATA_TYPES[selType]?.label?.split(" ")[0]]||TYPE_STYLES.Custom).bg : "from-red-600 to-rose-800";
                return (
                  <div className={`h-28 rounded-xl bg-gradient-to-br ${previewBg} relative overflow-hidden shadow-lg`}>
                    <div className="absolute inset-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0">
                        <PreviewIcon className="w-6 h-6 text-white"/>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="text-white font-bold text-sm">{name||"Template Name"}</div>
                        <div className="h-1.5 bg-white/30 rounded-full w-3/4"/>
                        <div className="h-1.5 bg-white/20 rounded-full w-1/2"/>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                      <Radio className="w-2.5 h-2.5 text-white"/>
                      <span className="text-white text-[8px] font-bold">NFC</span>
                    </div>
                  </div>
                );
              })()}
              <p className="text-red-300 text-[9px] text-center mt-2">Tap to preview on device</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 text-xs font-semibold mb-2 flex items-center gap-1.5"><FileText className="w-3 h-3 text-red-400"/>Template Summary</p>
              <div className="space-y-1.5">
                {[
                  {l:"Type",        v:selType>=0?DATA_TYPES[selType].label:"-"},
                  {l:"Category",    v:category||"-"},
                  {l:"Data Fields", v:selType>=0?"1":"0"},
                  {l:"Size",        v:fieldVals.main?`${fieldVals.main.length*2} Bytes`:"0 Bytes"},
                  {l:"Unlocked",    v:lockAfter?"No":"Yes"},
                  {l:"Re-Writable", v:allowRW?"Yes":"No"},
                ].map(r => (
                  <div key={r.l} className="flex items-center justify-between text-xs">
                    <span className="text-red-500">{r.l}</span>
                    <span className={`font-medium ${r.v==="Yes"?"text-red-600":r.v==="No"?"text-red-300":"text-red-900"}`}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step===4 && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto mb-2"/>
              <div className="text-red-900 font-bold text-sm mb-1">Ready to Save!</div>
              <div className="text-red-500 text-xs">Template "{name}" is configured and ready.</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-500 text-[10px] font-semibold mb-2 uppercase tracking-wider">Tips</p>
              {[
                "Choose the right data type for your need.",
                "Dynamic data can be updated after saving.",
                "Lock after write for extra security.",
                "Preview before saving your template.",
              ].map(t => (
                <div key={t} className="flex items-start gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0"/>
                  <span className="text-red-600 text-[10px]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-red-100">
        <button onClick={handleReset}
          className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
          <X className="w-3.5 h-3.5"/>Reset
        </button>
        {step < 4
          ? <button onClick={handleNext} disabled={(step===1&&!name.trim())||(step===2&&selType<0)}
              className="flex-[2] flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
              Next Step<ChevronRight className="w-3.5 h-3.5"/>
            </button>
          : <button onClick={handleSave}
              className="flex-[2] bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-200">
              <Save className="w-3.5 h-3.5"/>Save Template
            </button>
        }
      </div>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────

function Pagination({ page, total, perPage, onPage }) {
  const totalPages = Math.ceil(total/perPage);
  if (totalPages<=1) return null;
  const pages = totalPages<=7
    ? Array.from({length:totalPages},(_,i)=>i+1)
    : page<=3?[1,2,3,4,5,"...",totalPages]
    : page>=totalPages-2?[1,"...",totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]
    : [1,"...",page-1,page,page+1,"...",totalPages];
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 pt-3 border-t border-red-100">
      <p className="text-red-400 text-xs">Showing {Math.min((page-1)*perPage+1,total)}–{Math.min(page*perPage,total)} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={()=>onPage(Math.max(1,page-1))} disabled={page===1}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 rotate-90"/>
        </button>
        {pages.map((p,i) => (
          <button key={i} onClick={()=>typeof p==="number"&&onPage(p)}
            className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${
              p===page?"bg-red-600 border-red-600 text-white":
              p==="..."?"border-transparent text-red-300 cursor-default":
              "border-red-200 text-red-500 hover:border-red-500 hover:text-red-700"
            }`}>{p}</button>
        ))}
        <button onClick={()=>onPage(Math.min(totalPages,page+1))} disabled={page===totalPages}
          className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center transition-all">
          <ChevronDown className="w-3.5 h-3.5 -rotate-90"/>
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function UserNFCTemplatesPage({ onMenuClick }) {
  const [templates,   setTemplates]   = useState(INIT_TEMPLATES);
  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("All Categories");
  const [typeFilter,  setTypeFilter]  = useState("All Types");
  const [sortBy,      setSortBy]      = useState("Latest");
  const [viewMode,    setViewMode]    = useState("grid");
  const [pill,        setPill]        = useState("All");
  const [page,        setPage]        = useState(1);
  const [saved,       setSaved]       = useState(new Set([1,3]));
  const [sideTab,     setSideTab]     = useState("all");
  const [editTpl,     setEditTpl]     = useState(null);
  const [delTpl,      setDelTpl]      = useState(null);
  const [toast,       setToast]       = useState({msg:"",type:"success"});
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const PER_PAGE = 12;
  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast({msg:""}),3000); };

  const myTemplates   = templates.filter(t=>t.mine);
  const savedTemplates = templates.filter(t=>saved.has(t.id));

  const filtered = useMemo(() => {
    let list =
      sideTab==="mine"  ? templates.filter(t=>t.mine) :
      sideTab==="saved" ? templates.filter(t=>saved.has(t.id)) :
      templates;

    const q = search.toLowerCase();
    if (q) list=list.filter(t=>t.name.toLowerCase().includes(q)||t.sub.toLowerCase().includes(q)||t.type.toLowerCase().includes(q));
    if (catFilter!=="All Categories") list=list.filter(t=>t.cat===catFilter);
    if (typeFilter!=="All Types")     list=list.filter(t=>t.type===typeFilter);
    if (pill!=="All")                 list=list.filter(t=>t.cat===pill);
    list = [...list];
    if (sortBy==="Most Used")  list.sort((a,b)=>b.uses-a.uses);
    if (sortBy==="Most Saved") list.sort((a,b)=>b.saves-a.saves);
    if (sortBy==="Oldest")     list.sort((a,b)=>a.id-b.id);
    if (sortBy==="Latest")     list.sort((a,b)=>b.id-a.id);
    return list;
  }, [templates, search, catFilter, typeFilter, pill, sortBy, sideTab, saved]);

  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const handleUse       = (tpl) => { showToast(`Template "${tpl.name}" applied!`); };
  const handleEdit      = (tpl) => { setEditTpl(tpl); setSideTab("create"); setPanelOpen(true); };
  const handleDelete    = (tpl) => setDelTpl(tpl);
  const confirmDelete   = () => { setTemplates(p=>p.filter(t=>t.id!==delTpl.id)); showToast(`"${delTpl.name}" deleted.`,"info"); setDelTpl(null); };
  const handleSaveToggle= (tpl) => {
    setSaved(p => {
      const n = new Set(p);
      n.has(tpl.id) ? (n.delete(tpl.id), showToast(`"${tpl.name}" unsaved.`,"info")) : (n.add(tpl.id), showToast(`"${tpl.name}" saved!`));
      return n;
    });
  };
  const handleCreateSave= (data) => {
    if (editTpl) {
      setTemplates(p=>p.map(t=>t.id===editTpl.id?{...t,...data}:t));
      showToast(`"${data.name}" updated!`);
      setEditTpl(null);
    } else {
      setTemplates(p=>[{id:Date.now(),...data,uses:0,saves:0,mine:true},...p]);
      showToast(`"${data.name}" created!`);
    }
    setSideTab("all"); setPanelOpen(false);
  };

  const totalWrites = templates.reduce((s,t)=>s+t.uses,0);

  // Sub-tabs — user-friendly labels; "Create" opens the panel
  const SUB_TABS = [
    { id:"all",    label:"All Templates" },
    { id:"mine",   label:`Mine (${myTemplates.length})`   },
    { id:"saved",  label:`Saved (${savedTemplates.length})` },
    { id:"create", label:"+ Create"      },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-hidden flex relative">

        {/* ── Left: Template Grid ── */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5 min-w-0">

          {/* Title */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
                <FileText className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h1 className="text-red-900 font-bold text-xl sm:text-2xl">NFC Templates</h1>
                <p className="text-red-400 text-xs hidden sm:block mt-0.5">Browse, save, and create your own NFC card templates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>{setSideTab("create");setEditTpl(null);setPanelOpen(true);}}
                className="lg:hidden flex items-center gap-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5"/>Create
              </button>
              <button onClick={()=>{setSideTab("create");setEditTpl(null);setPanelOpen(true);}}
                className="hidden lg:flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-red-200">
                <Plus className="w-4 h-4"/>Create Template
              </button>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 mb-3 sm:mb-4 bg-white border border-red-200 rounded-lg p-1 w-fit overflow-x-auto shadow-sm">
            {SUB_TABS.map(t => (
              <button key={t.id}
                onClick={() => {
                  setSideTab(t.id);
                  if (t.id==="create") setPanelOpen(true);
                  setPage(1);
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  sideTab===t.id?"bg-red-600 text-white shadow-sm":"text-red-500 hover:text-red-700"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {sideTab==="create" ? (
            <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-5 max-w-lg shadow-md">
              <CreateTemplatePanel
                onSave={handleCreateSave}
                editData={editTpl}
                onReset={()=>{setEditTpl(null);setSideTab("all");}}/>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-3">
                <button onClick={()=>setFiltersOpen(p=>!p)}
                  className="sm:hidden w-full flex items-center justify-between bg-white border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg mb-2 shadow-sm">
                  <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5"/>Filters & Sort</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen?"rotate-180":""}`}/>
                </button>
                <div className={`${filtersOpen?"flex":"hidden"} sm:flex flex-col sm:flex-row items-stretch sm:items-center gap-2`}>
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-300"/>
                    <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search templates..."
                      className="w-full bg-white border border-red-200 text-red-900 text-xs pl-7 pr-3 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300"/>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {[
                      {val:catFilter,  set:(v)=>{setCatFilter(v);setPage(1);},  opts:CATEGORIES                         },
                      {val:typeFilter, set:(v)=>{setTypeFilter(v);setPage(1);}, opts:TYPE_FILTER                         },
                      {val:sortBy,     set:setSortBy,                           opts:SORT_OPTS.map(s=>`Sort: ${s}`)     },
                    ].map((s,i) => (
                      <select key={i} value={s.val} onChange={e=>s.set(e.target.value)}
                        className="flex-1 sm:flex-none bg-white border border-red-200 text-red-700 text-xs px-2.5 py-2 rounded-lg outline-none cursor-pointer">
                        {s.opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    ))}
                    <div className="flex gap-1 bg-white border border-red-200 rounded-lg p-0.5">
                      {[{m:"grid",Icon:LayoutGrid},{m:"list",Icon:List}].map(v => (
                        <button key={v.m} onClick={()=>setViewMode(v.m)}
                          className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${viewMode===v.m?"bg-red-600 text-white":"text-red-400 hover:text-red-700"}`}>
                          <v.Icon className="w-3.5 h-3.5"/>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
                {CAT_PILLS.map(c => {
                  const CatIcon = CAT_ICONS_MAP[c] || Globe;
                  return (
                    <button key={c} onClick={()=>{setPill(c);setPage(1);}}
                      className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm ${
                        pill===c?"bg-red-600 text-white shadow-md shadow-red-200":"bg-white border border-red-200 text-red-600 hover:border-red-400 hover:text-red-700"
                      }`}>
                      <CatIcon className="w-3 h-3 flex-shrink-0"/>{c}
                    </button>
                  );
                })}
              </div>

              {/* Grid / List */}
              {paginated.length===0 ? (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 mx-auto mb-3 text-red-200"/>
                  <div className="text-red-700 font-semibold mb-1">No templates found</div>
                  <div className="text-red-400 text-sm">Try adjusting your filters or create a new one</div>
                </div>
              ) : viewMode==="grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {paginated.map(t => (
                    <TemplateCard key={t.id} tpl={t} viewMode="grid"
                      onUse={handleUse} onEdit={handleEdit} onDelete={handleDelete}
                      onSaveToggle={handleSaveToggle} saved={saved.has(t.id)}/>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {paginated.map(t => (
                    <TemplateCard key={t.id} tpl={t} viewMode="list"
                      onUse={handleUse} onEdit={handleEdit} onDelete={handleDelete}
                      onSaveToggle={handleSaveToggle} saved={saved.has(t.id)}/>
                  ))}
                </div>
              )}

              <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onPage={p=>setPage(p)}/>
            </>
          )}

          {/* Bottom Stats + Usage Chart */}
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              {[
                { Icon:FileText,     bg:"from-red-500 to-rose-600",  label:"My Templates",    value:myTemplates.length,           sub:"Created by me"          },
                { Icon:Bookmark,     bg:"from-rose-500 to-red-600",  label:"Saved Templates", value:savedTemplates.length,        sub:"Bookmarked for later"   },
                { Icon:Star,         bg:"from-red-600 to-rose-700",  label:"Total Templates", value:templates.length,             sub:"In the library"         },
                { Icon:HardDrive,    bg:"from-rose-600 to-red-800",  label:"Storage Used",    value:"42.6 MB",                    sub:"of 100 MB"              },
                { Icon:CheckCircle2, bg:"from-red-700 to-rose-600",  label:"Uses This Month", value:fmt(totalWrites),             sub:"+32.5% growth"          },
              ].map(s => (
                <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center flex-shrink-0 shadow-md shadow-red-100`}>
                    <s.Icon className="w-4 h-4 text-white"/>
                  </div>
                  <div className="min-w-0">
                    <div className="text-red-400 text-[9px] sm:text-[10px] truncate">{s.label}</div>
                    <div className="text-red-900 font-bold text-xs sm:text-sm leading-tight truncate">{typeof s.value==="number"?s.value.toLocaleString():s.value}</div>
                    <div className="text-red-300 text-[9px] hidden sm:block">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Chart */}
            <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
              <h3 className="text-red-900 font-semibold text-sm mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500"/>Template Usage by Type
              </h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={USAGE_CHART} margin={{top:4,right:4,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                  <XAxis dataKey="name" tick={{fontSize:10,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:9,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                  <Tooltip {...TOOLTIP_STYLE}/>
                  <Bar dataKey="uses" name="Uses" fill="#ef4444" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Right: Create Panel (desktop) ── */}
        <div className="w-72 flex-shrink-0 border-l border-red-100 bg-white overflow-y-auto px-4 py-5 hidden lg:flex flex-col shadow-lg">
          <CreateTemplatePanel
            onSave={handleCreateSave}
            editData={editTpl}
            onReset={()=>setEditTpl(null)}/>
        </div>

        {/* ── Mobile Create Panel Drawer ── */}
        {panelOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="flex-1 bg-black/30" onClick={()=>setPanelOpen(false)}/>
            <div className="w-80 bg-white border-l border-red-200 flex flex-col overflow-y-auto px-4 py-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-900 font-bold text-sm">Create Template</span>
                <button onClick={()=>setPanelOpen(false)}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-700 transition-all">
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <CreateTemplatePanel
                onSave={handleCreateSave}
                editData={editTpl}
                onReset={()=>{setEditTpl(null);setPanelOpen(false);}}/>
            </div>
          </div>
        )}
      </div>

      {delTpl && (
        <ConfirmModal
          title={`Delete "${delTpl.name}"?`}
          msg="This template will be permanently deleted and cannot be undone."
          onConfirm={confirmDelete}
          onCancel={()=>setDelTpl(null)}
        />
      )}
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}