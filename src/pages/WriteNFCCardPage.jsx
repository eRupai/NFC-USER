import { useState, useCallback } from "react";
import {
  Menu, Search, Sun, Bell, Zap, Radio, User, FileText, Wifi, Mail,
  Phone, MessageSquare, MessageCircle, Share2, MapPin, Bookmark, Code2,
  Link2, CheckCircle2, XCircle, AlertTriangle, Info, X, RefreshCw,
  LayoutTemplate, Package, Clock, Settings, Shield, Cloud, Globe,
  Smartphone, Leaf, PenLine, ArrowUpRight, ChevronDown,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DATA_TYPES = [
  { Icon:Link2,         label:"URL / Link",   sub:"URL / Link",    id:"url"      },
  { Icon:User,          label:"vCard",        sub:"Contact",       id:"vcard"    },
  { Icon:FileText,      label:"Text",         sub:"Plain Text",    id:"text"     },
  { Icon:Wifi,          label:"WiFi",         sub:"Network",       id:"wifi"     },
  { Icon:Mail,          label:"Email",        sub:"Email Address", id:"email"    },
  { Icon:Phone,         label:"Phone",        sub:"Phone Number",  id:"phone"    },
  { Icon:MessageSquare, label:"SMS",          sub:"Text Message",  id:"sms"      },
  { Icon:MessageCircle, label:"WhatsApp",     sub:"WhatsApp Link", id:"whatsapp" },
  { Icon:Share2,        label:"Social Media", sub:"Social Links",  id:"social"   },
  { Icon:MapPin,        label:"Location",     sub:"Map Location",  id:"location" },
  { Icon:Bookmark,      label:"App Link",     sub:"Deep Link",     id:"applink"  },
  { Icon:Code2,         label:"Custom JSON",  sub:"NDEF Data",     id:"json"     },
];

const SUPPORTED_CARDS = ["NTAG213","NTAG215","NTAG216","MIFARE","Ultralight","DESFire"];

const RECENT_ACTIVITY = [
  { Icon:Link2,   label:"URL Card Written",      time:"2 min ago"   },
  { Icon:User,    label:"vCard Card Written",    time:"15 min ago"  },
  { Icon:Wifi,    label:"WiFi Card Written",     time:"32 min ago"  },
  { Icon:FileText,label:"Text Card Written",     time:"1 hour ago"  },
  { Icon:Mail,    label:"Email Card Written",    time:"2 hours ago" },
  { Icon:MapPin,  label:"Location Card Written", time:"3 hours ago" },
];

const QUICK_ACTIONS = [
  { Icon:LayoutTemplate, label:"Create Template",  bg:"bg-red-600 hover:bg-red-500"        },
  { Icon:Package,        label:"Bulk Write Cards", bg:"bg-rose-700 hover:bg-rose-600"      },
  { Icon:Clock,          label:"View History",     bg:"bg-red-800 hover:bg-red-700"        },
  { Icon:Settings,       label:"My Templates",     bg:"bg-rose-800 hover:bg-rose-700"      },
];

const FOOTER_FEATURES = [
  { Icon:Shield,    label:"Bank Level Security", sub:"Your data is 100% secure",  color:"text-red-500"  },
  { Icon:Cloud,     label:"Cloud Backup",        sub:"Automatic & secure backup", color:"text-rose-500" },
  { Icon:Globe,     label:"Global Compatibility",sub:"Works on all NFC devices",  color:"text-red-600"  },
  { Icon:Smartphone,label:"No App Required",     sub:"Just tap and it works",     color:"text-rose-600" },
  { Icon:Leaf,      label:"Eco Friendly",        sub:"Reduce paper, save planet", color:"text-red-400"  },
];

const SCAN_CHART = [
  {l:"May 1",v:200},{l:"May 8",v:480},{l:"May 15",v:350},{l:"May 22",v:825},{l:"May 31",v:520},
];

const FIELD_MAP = {
  url:      [{key:"url",     label:"Enter URL",           placeholder:"https://yourwebsite.com",      type:"url"               }],
  vcard:    [{key:"name",    label:"Full Name",            placeholder:"John Doe"                      },
             {key:"phone",   label:"Phone",                placeholder:"+1 234 567 890"                },
             {key:"email",   label:"Email",                placeholder:"john@example.com", type:"email"}],
  text:     [{key:"text",    label:"Enter Text",           placeholder:"Type your message here...",    multiline:true           }],
  wifi:     [{key:"ssid",    label:"Network Name (SSID)",  placeholder:"MyWiFiNetwork"                 },
             {key:"password",label:"Password",             placeholder:"wifi_password",  type:"password"}],
  email:    [{key:"email",   label:"Email Address",        placeholder:"example@email.com",type:"email"}],
  phone:    [{key:"phone",   label:"Phone Number",         placeholder:"+1 234 567 890", type:"tel"    }],
  sms:      [{key:"phone",   label:"Phone Number",         placeholder:"+1 234 567 890"                },
             {key:"message", label:"Message (optional)",   placeholder:"Hello!",         multiline:true }],
  whatsapp: [{key:"phone",   label:"WhatsApp Number",      placeholder:"+1234567890"                   }],
  social:   [{key:"url",     label:"Profile URL",          placeholder:"https://instagram.com/username"}],
  location: [{key:"lat",     label:"Latitude",             placeholder:"28.6139"                       },
             {key:"lng",     label:"Longitude",            placeholder:"77.2090"                       }],
  applink:  [{key:"url",     label:"Deep Link URL",        placeholder:"myapp://screen"                }],
  json:     [{key:"json",    label:"JSON Data",            placeholder:'{"key":"value"}', multiline:true}],
};

const NFC = { IDLE:"idle", SCANNING:"scanning", WRITING:"writing", SUCCESS:"success", ERROR:"error", UNSUPPORTED:"unsupported" };

const TOOLTIP = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
  itemStyle:{color:"#ef4444"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildNDEFRecord(typeId, value) {
  switch(typeId){
    case "url":     case "social": case "applink": return [{recordType:"url", data:value}];
    case "text":    case "json":   return [{recordType:"text", data:value}];
    case "email":   return [{recordType:"url", data:`mailto:${value}`}];
    case "phone":   return [{recordType:"url", data:`tel:${value}`}];
    case "sms":     return [{recordType:"url", data:`sms:${value}`}];
    case "whatsapp":return [{recordType:"url", data:`https://wa.me/${value}`}];
    default:        return [{recordType:"text", data:value}];
  }
}

// ─── STEP WIZARD ─────────────────────────────────────────────────────────────

function StepWizard({ activeStep }) {
  const steps = ["Select Type","Add Data","Tap & Write","Verify & Complete"];
  return (
    <div className="flex items-center gap-0 mb-5 overflow-x-auto pb-1">
      {steps.map((step,i)=>{
        const done=i<activeStep, curr=i===activeStep;
        return (
          <div key={step} className="flex items-center gap-0">
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              curr?"bg-red-600 text-white shadow-lg shadow-red-200":
              done?"bg-green-100 text-green-700 border border-green-200":
                   "text-red-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border ${
                curr?"bg-white text-red-600 border-white":
                done?"bg-green-500 border-green-400 text-white":
                     "border-red-200 text-red-400"}`}>
                {done?<CheckCircle2 className="w-3 h-3"/>:i+1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </div>
            {i<steps.length-1&&(
              <div className={`w-4 sm:w-8 h-px mx-0.5 sm:mx-1 flex-shrink-0 ${done?"bg-green-400":"bg-red-100"}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DATA TYPE GRID ──────────────────────────────────────────────────────────

function DataTypeGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-5">
      {DATA_TYPES.map((dt,i)=>(
        <button key={dt.id} onClick={()=>onSelect(i)}
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 rounded-xl border text-left transition-all ${
            selected===i?"bg-red-600 border-red-600 text-white shadow-md shadow-red-200":
                        "bg-red-50 border-red-200 text-red-700 hover:border-red-400 hover:bg-red-100"
          }`}>
          <dt.Icon className="w-3.5 h-3.5 flex-shrink-0"/>
          <div className="min-w-0">
            <div className="font-semibold text-[10px] sm:text-xs leading-tight truncate">{dt.label}</div>
            <div className={`text-[9px] leading-tight hidden sm:block ${selected===i?"text-red-200":"text-red-400"}`}>{dt.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── ADD DATA FORM ────────────────────────────────────────────────────────────

function AddDataForm({ selectedType, value, onChange }) {
  const dt = DATA_TYPES[selectedType];
  const fields = FIELD_MAP[dt.id] || FIELD_MAP.url;
  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  return (
    <div className="space-y-3">
      {fields.map(f=>(
        <div key={f.key}>
          <label className="text-red-600 text-xs font-medium block mb-1">{f.label}</label>
          {f.multiline
            ?<textarea value={value[f.key]||""} onChange={e=>onChange({...value,[f.key]:e.target.value})}
                placeholder={f.placeholder} rows={3} className={`${inputCls} resize-none`}/>
            :<input type={f.type||"text"} value={value[f.key]||""} onChange={e=>onChange({...value,[f.key]:e.target.value})}
                placeholder={f.placeholder} className={inputCls}/>
          }
        </div>
      ))}
    </div>
  );
}

// ─── ADVANCED OPTIONS ─────────────────────────────────────────────────────────

function AdvancedOptions({ options, onChange }) {
  const opts = [
    {key:"dynamicLink",    label:"Enable Dynamic Link"      },
    {key:"lockAfterWrite", label:"Lock Card After Write"    },
    {key:"passwordProtect",label:"Set Password Protection"  },
    {key:"autoDetect",     label:"Auto Detect Card Type"    },
    {key:"writeOnce",      label:"Write Once (Lock after)"  },
    {key:"optimizeMemory", label:"Optimize Memory Usage"    },
  ];
  return (
    <div className="mt-4 pt-4 border-t border-red-100">
      <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
        <Settings className="w-4 h-4 text-red-500"/>Advanced Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
        {opts.map(opt=>(
          <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={options[opt.key]||false}
              onChange={e=>onChange({...options,[opt.key]:e.target.checked})}
              className="w-4 h-4 rounded accent-red-500 cursor-pointer"/>
            <span className="text-red-600 text-xs group-hover:text-red-800 transition-colors">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── READY TO WRITE ───────────────────────────────────────────────────────────

function ReadyToWrite({ selectedType, value, nfcStatus, onWrite, onClear }) {
  const dt = DATA_TYPES[selectedType];
  const primVal = Object.values(value)[0]||"";
  const isReady = primVal.trim()!=="";
  const isBusy  = nfcStatus===NFC.WRITING||nfcStatus===NFC.SCANNING;

  const statusBg = {
    [NFC.SUCCESS]:     "bg-green-50 border-green-300 text-green-700",
    [NFC.ERROR]:       "bg-red-100 border-red-400 text-red-700",
    [NFC.UNSUPPORTED]: "bg-rose-50 border-rose-300 text-rose-600",
  }[nfcStatus] || "bg-red-50 border-red-200 text-red-600";

  return (
    <div className="mt-4 pt-4 border-t border-red-100">
      <h3 className="text-red-900 text-sm font-semibold mb-1">3. Ready to Write</h3>
      <p className="text-red-400 text-xs mb-4">Review data and tap Write to NFC Card</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0">
            <dt.Icon className="w-5 h-5 text-white"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-red-900 text-sm font-semibold">{dt.label}</div>
            <div className="text-red-400 text-xs truncate">{primVal||"No data entered"}</div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
            isReady?"bg-green-100 text-green-700 border-green-200":"bg-red-100 text-red-400 border-red-200"
          }`}>{isReady?"Ready":"Incomplete"}</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs space-y-1.5 flex-shrink-0">
          {[{l:"Data Size",v:`${Math.max(28,(primVal?.length||0)+10)} B`},{l:"Writable",v:"Yes"},{l:"Card Type",v:"Auto"}].map(r=>(
            <div key={r.l} className="flex items-center gap-4">
              <span className="text-red-400 w-20">{r.l}</span>
              <span className="text-red-900 font-medium">{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onWrite} disabled={!isReady||isBusy}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
          {isBusy
            ? <><RefreshCw className="w-4 h-4 animate-spin"/>{nfcStatus===NFC.SCANNING?"Scanning...":"Writing..."}</>
            : nfcStatus===NFC.SUCCESS
              ? <><CheckCircle2 className="w-4 h-4"/>Written Successfully!</>
              : <><Radio className="w-4 h-4"/>Write to NFC Card</>
          }
        </button>
        <button onClick={onClear}
          className="flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 hover:border-red-400 text-red-600 text-sm font-semibold px-4 sm:px-5 py-3 rounded-xl transition-all">
          <X className="w-4 h-4"/><span className="hidden sm:inline">Clear All</span>
        </button>
      </div>

      {nfcStatus!==NFC.IDLE && (
        <div className={`mt-3 flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border ${statusBg}`}>
          {nfcStatus===NFC.SUCCESS?<CheckCircle2 className="w-4 h-4 flex-shrink-0"/>:
           nfcStatus===NFC.ERROR||nfcStatus===NFC.UNSUPPORTED?<AlertTriangle className="w-4 h-4 flex-shrink-0"/>:
           <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin"/>}
          {nfcStatus===NFC.SCANNING    &&"Waiting for NFC card... Hold your card near the device."}
          {nfcStatus===NFC.WRITING     &&"Writing data to NFC card... Do not remove the card."}
          {nfcStatus===NFC.SUCCESS     &&"Data written successfully to NFC card!"}
          {nfcStatus===NFC.ERROR       &&"Failed to write. Check card compatibility and try again."}
          {nfcStatus===NFC.UNSUPPORTED &&"Web NFC not supported. Use Android + Chrome."}
        </div>
      )}
    </div>
  );
}

// ─── TAP NFC PANEL ────────────────────────────────────────────────────────────

function TapNFCPanel({ nfcStatus, cardInfo }) {
  const isActive  = [NFC.SCANNING,NFC.WRITING].includes(nfcStatus);
  const isSuccess = nfcStatus===NFC.SUCCESS;
  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
      <h2 className="text-red-900 font-bold text-sm mb-0.5 flex items-center gap-2">
        <Radio className="w-4 h-4 text-red-500"/>Tap Your NFC Card
      </h2>
      <p className="text-red-400 text-[11px] mb-4">Hold your NFC card near the device</p>

      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28">
          {isActive&&<>
            <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" style={{animationDuration:"1.5s"}}/>
            <div className="absolute inset-3 rounded-full border-2 border-rose-300/30 animate-ping" style={{animationDuration:"2s",animationDelay:"0.3s"}}/>
          </>}
          <div className={`absolute inset-4 rounded-full border-2 flex items-center justify-center transition-all ${
            isSuccess?"border-red-400 bg-red-50":isActive?"border-red-500 bg-red-50 animate-pulse":"border-red-200 bg-red-50/50"
          }`}>
            <Smartphone className={`w-10 h-10 transition-colors ${isSuccess||isActive?"text-red-500":"text-red-300"}`}/>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className={`flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-full ${
          isSuccess?"bg-green-100 border-green-300 text-green-700":
          isActive ?"bg-red-100 border-red-300 text-red-600":
                    "bg-red-50 border-red-200 text-red-500"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSuccess?"bg-green-500":isActive?"bg-red-500":"bg-red-400"}`}/>
          {isActive?"Processing...":isSuccess?"Write Success!":"Ready to Scan"}
        </div>
      </div>

      <p className="text-red-500 text-[10px] font-medium mb-2">Supported Cards</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {SUPPORTED_CARDS.map(c=>(
          <span key={c} className="text-[9px] font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">{c}</span>
        ))}
      </div>

      <div className="border-t border-red-100 pt-3">
        <p className="text-red-900 text-xs font-semibold mb-2 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-red-500"/>Card Information
        </p>
        <div className="space-y-1.5">
          {[
            {l:"Status",     v:cardInfo.status     ||"No Card Detected"},
            {l:"UID",        v:cardInfo.uid         ||"--"},
            {l:"Card Type",  v:cardInfo.cardType    ||"--"},
            {l:"Memory",     v:cardInfo.memorySize  ||"--"},
            {l:"Writable",   v:cardInfo.writable    ||"--"},
            {l:"Lock Status",v:cardInfo.lockStatus  ||"--"},
          ].map(r=>(
            <div key={r.l} className="flex items-center text-xs">
              <span className="text-red-400 w-20 flex-shrink-0">{r.l}</span>
              <span className={`${r.l==="Status"&&cardInfo.status?"text-green-600 font-semibold":"text-red-700"}`}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-red-500 flex-shrink-0"/>
          <span className="text-red-700 text-xs font-semibold">Important Tips</span>
        </div>
        <ul className="space-y-1">
          {["Make sure card is NFC compatible and writable.","Keep the card steady near the device.","Do not remove card while writing.","Some cards may require unlocking first."].map((t,i)=>(
            <li key={i} className="flex items-start gap-1.5 text-[10px]">
              <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
              <span className="text-red-600">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── RIGHT PANEL ─────────────────────────────────────────────────────────────

function RightPanel() {
  return (
    <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4">
      {/* Live Scan Analytics */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-red-900 font-semibold text-sm">Live Scan Analytics</h3>
          <select className="bg-red-50 border border-red-200 text-red-500 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
            <option>This Month</option><option>This Week</option>
          </select>
        </div>
        <div className="text-red-400 text-xs mb-1">Total Scans</div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-red-900 font-bold text-2xl">2,543</span>
          <span className="text-green-600 text-xs font-semibold mb-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3"/>12.5%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={SCAN_CHART} margin={{top:2,right:2,left:-32,bottom:0}}>
            <defs>
              <linearGradient id="scanGradW" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="l" tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Area type="monotone" dataKey="v" name="Scans" stroke="#ef4444" strokeWidth={2}
              fill="url(#scanGradW)" dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-900 font-semibold text-sm">Recent Activity</h3>
          <button className="text-red-500 hover:text-red-700 text-[10px] font-semibold">View All</button>
        </div>
        <div className="space-y-2.5">
          {RECENT_ACTIVITY.map((a,i)=>(
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <a.Icon className="w-3.5 h-3.5 text-red-600"/>
              </div>
              <span className="text-red-700 text-xs flex-1">{a.label}</span>
              <span className="text-red-400 text-[10px] flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-red-900 font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {QUICK_ACTIONS.map(a=>(
            <button key={a.label} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg ${a.bg} transition-colors text-left`}>
              <a.Icon className="w-4 h-4 text-white flex-shrink-0"/>
              <span className="text-white text-xs font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function WriteNFCCardPage({ onMenuClick }) {
  const [selType,   setSelType]   = useState(0);
  const [fieldVal,  setFieldVal]  = useState({});
  const [step,      setStep]      = useState(0);
  const [nfcStatus, setNfcStatus] = useState(NFC.IDLE);
  const [cardInfo,  setCardInfo]  = useState({});
  const [advOpts,   setAdvOpts]   = useState({dynamicLink:true,autoDetect:true});

  const handleSelectType = (i) => {
    setSelType(i); setFieldVal({});
    if (step===0) setStep(1);
  };
  const handleFieldChange = (val) => {
    setFieldVal(val);
    const hasVal = Object.values(val).some(v=>v&&v.trim?.()!=="");
    if (hasVal&&step<2) setStep(2);
  };

  const handleWrite = useCallback(async () => {
    const dt = DATA_TYPES[selType];
    const primVal = Object.values(fieldVal)[0]||"";
    if (!primVal.trim()) return;
    if (typeof NDEFReader==="undefined") {
      setNfcStatus(NFC.UNSUPPORTED); return;
    }
    try {
      setNfcStatus(NFC.SCANNING); setStep(2);
      const ndef = new NDEFReader();
      await ndef.write({records:buildNDEFRecord(dt.id,primVal)});
      setNfcStatus(NFC.SUCCESS); setStep(3);
      setCardInfo({status:"Written Successfully",uid:"Auto Detected",cardType:"NDEF Compatible",
        memorySize:`${Math.max(28,primVal.length+10)} Bytes`,writable:"Yes",
        lockStatus:advOpts.lockAfterWrite?"Locked":"Unlocked"});
      setTimeout(()=>{setNfcStatus(NFC.IDLE);setStep(3);},5000);
    } catch(err) {
      setNfcStatus(err.name==="NotSupportedError"?NFC.UNSUPPORTED:NFC.ERROR);
      setCardInfo({status:`Error: ${err.message}`});
    }
  },[selType,fieldVal,advOpts]);

  const handleClear = () => {
    setFieldVal({}); setNfcStatus(NFC.IDLE); setCardInfo({});
    setStep(0); setSelType(0);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      {/* ── Page body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 sm:px-5 pt-4 sm:pt-5 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <PenLine className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Write NFC Card</h1>
              <p className="text-red-400 text-xs hidden sm:block">Select data type, add data and write to your NFC card</p>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-5 pb-4">
          {/* Main layout: stacked on mobile, 3-col on xl */}
          <div className="flex flex-col xl:flex-row gap-4">

            {/* ── Left: Form ── */}
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
                <StepWizard activeStep={step}/>

                <h3 className="text-red-900 font-semibold text-sm mb-1">1. Select Data Type</h3>
                <p className="text-red-400 text-xs mb-3">Choose the type of data you want to write</p>
                <DataTypeGrid selected={selType} onSelect={handleSelectType}/>

                <div className="border-t border-red-100 pt-4">
                  <h3 className="text-red-900 font-semibold text-sm mb-1">2. Add Data</h3>
                  <p className="text-red-400 text-xs mb-3">
                    Enter data for <span className="text-red-600 font-medium">{DATA_TYPES[selType].label}</span>
                  </p>
                  <AddDataForm selectedType={selType} value={fieldVal} onChange={handleFieldChange}/>
                </div>

                <AdvancedOptions options={advOpts} onChange={setAdvOpts}/>
                <ReadyToWrite selectedType={selType} value={fieldVal} nfcStatus={nfcStatus} onWrite={handleWrite} onClear={handleClear}/>
              </div>
            </div>

            {/* ── Middle: Tap NFC ── */}
            <div className="w-full xl:w-56 flex-shrink-0">
              <TapNFCPanel nfcStatus={nfcStatus} cardInfo={cardInfo}/>
            </div>

            {/* ── Right: Analytics ── */}
            <RightPanel/>
          </div>
        </div>

        {/* Footer features */}
        <div className="px-3 sm:px-5 pb-5">
          <div className="bg-white border border-red-100 rounded-xl px-4 sm:px-5 py-3 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:divide-x sm:divide-red-100">
              {FOOTER_FEATURES.map(f=>(
                <div key={f.label} className="flex items-center gap-2 sm:px-3 first:pl-0 last:pr-0">
                  <f.Icon className={`w-5 h-5 ${f.color} flex-shrink-0`}/>
                  <div>
                    <div className="text-red-900 text-xs font-semibold">{f.label}</div>
                    <div className="text-red-400 text-[10px]">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}