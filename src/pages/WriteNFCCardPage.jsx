import { useState, useCallback } from "react";
import {
  PenLine, Radio, User, FileText, Wifi, Mail,
  Phone, MessageSquare, MessageCircle, Share2, MapPin, Bookmark, Code2,
  Link2, CheckCircle2, AlertTriangle, Info, X, RefreshCw,
  LayoutTemplate, Package, Clock, Settings, Shield, Cloud, Globe,
  Smartphone, Leaf, ArrowUpRight, ChevronDown,
  BarChart2, Download, Crown, Zap, Star, Check, Eye,
  ScanLine, FileBarChart, CreditCard,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DATA_TYPES = [
  { Icon: Link2,         label: "URL / Link",   sub: "URL / Link",    id: "url"      },
  { Icon: User,          label: "vCard",        sub: "Contact",       id: "vcard"    },
  { Icon: FileText,      label: "Text",         sub: "Plain Text",    id: "text"     },
  { Icon: Wifi,          label: "WiFi",         sub: "Network",       id: "wifi"     },
  { Icon: Mail,          label: "Email",        sub: "Email Address", id: "email"    },
  { Icon: Phone,         label: "Phone",        sub: "Phone Number",  id: "phone"    },
  { Icon: MessageSquare, label: "SMS",          sub: "Text Message",  id: "sms"      },
  { Icon: MessageCircle, label: "WhatsApp",     sub: "WhatsApp Link", id: "whatsapp" },
  { Icon: Share2,        label: "Social Media", sub: "Social Links",  id: "social"   },
  { Icon: MapPin,        label: "Location",     sub: "Map Location",  id: "location" },
  { Icon: Bookmark,      label: "App Link",     sub: "Deep Link",     id: "applink"  },
  { Icon: Code2,         label: "Custom JSON",  sub: "NDEF Data",     id: "json"     },
];

const SUPPORTED_CARDS = ["NTAG213","NTAG215","NTAG216","MIFARE","Ultralight","DESFire"];

const RECENT_ACTIVITY = [
  { Icon: Link2,    label: "URL Card Written",       time: "2 min ago"   },
  { Icon: User,     label: "vCard Card Written",     time: "15 min ago"  },
  { Icon: Wifi,     label: "WiFi Card Written",      time: "32 min ago"  },
  { Icon: FileText, label: "Text Card Written",      time: "1 hour ago"  },
  { Icon: Mail,     label: "Email Card Written",     time: "2 hours ago" },
  { Icon: MapPin,   label: "Location Card Written",  time: "3 hours ago" },
];

const SCAN_CHART = [
  { l:"May 1",v:200 },{ l:"May 8",v:480 },{ l:"May 15",v:350 },
  { l:"May 22",v:825 },{ l:"May 31",v:520 },
];

const BULK_CHART = [
  { l:"Mon",cards:12 },{ l:"Tue",cards:28 },{ l:"Wed",cards:18 },
  { l:"Thu",cards:35 },{ l:"Fri",cards:22 },{ l:"Sat",cards:8 },{ l:"Sun",cards:5 },
];

const FIELD_MAP = {
  url:      [{ key:"url",      label:"Enter URL",            placeholder:"https://yourwebsite.com",       type:"url"      }],
  vcard:    [{ key:"name",     label:"Full Name",             placeholder:"John Doe"                       },
             { key:"phone",    label:"Phone",                 placeholder:"+1 234 567 890"                 },
             { key:"email",    label:"Email",                 placeholder:"john@example.com", type:"email" }],
  text:     [{ key:"text",     label:"Enter Text",            placeholder:"Type your message here...",     multiline:true  }],
  wifi:     [{ key:"ssid",     label:"Network Name (SSID)",   placeholder:"MyWiFiNetwork"                  },
             { key:"password", label:"Password",              placeholder:"wifi_password", type:"password" }],
  email:    [{ key:"email",    label:"Email Address",         placeholder:"example@email.com", type:"email"}],
  phone:    [{ key:"phone",    label:"Phone Number",          placeholder:"+1 234 567 890", type:"tel"     }],
  sms:      [{ key:"phone",    label:"Phone Number",          placeholder:"+1 234 567 890"                 },
             { key:"message",  label:"Message (optional)",    placeholder:"Hello!", multiline:true          }],
  whatsapp: [{ key:"phone",    label:"WhatsApp Number",       placeholder:"+1234567890"                    }],
  social:   [{ key:"url",      label:"Profile URL",           placeholder:"https://instagram.com/username" }],
  location: [{ key:"lat",      label:"Latitude",              placeholder:"28.6139"                        },
             { key:"lng",      label:"Longitude",             placeholder:"77.2090"                        }],
  applink:  [{ key:"url",      label:"Deep Link URL",         placeholder:"myapp://screen"                 }],
  json:     [{ key:"json",     label:"JSON Data",             placeholder:'{"key":"value"}', multiline:true }],
};

const NFC = { IDLE:"idle", SCANNING:"scanning", WRITING:"writing", SUCCESS:"success", ERROR:"error", UNSUPPORTED:"unsupported" };

const PLANS = [
  {
    name:"Free",  price:"₹0",     period:"/month", color:"border-red-200",
    badge:null, current:false,
    features:["500 credits/month","5 NFC card slots","Basic card types","Standard analytics","Email support"],
    missing: ["API access","Bulk operations","Custom templates","Priority support"],
  },
  {
    name:"Basic", price:"₹499",   period:"/month", color:"border-red-300",
    badge:null, current:false,
    features:["3,000 credits/month","25 NFC card slots","All basic card types","Advanced analytics","Priority email support"],
    missing: ["API access","Bulk operations","Custom templates"],
  },
  {
    name:"Premium",    price:"₹1,499", period:"/month", color:"border-red-600",
    badge:"Most Popular", current:true,
    features:["15,000 credits/month","100 NFC card slots","All card types incl. vCard & JSON","Advanced analytics + export","API access","Bulk operations","Custom templates","Priority support"],
    missing:[],
  },
  {
    name:"Enterprise", price:"Custom",  period:"",        color:"border-rose-700",
    badge:"Best Value", current:false,
    features:["Unlimited credits","Unlimited card slots","All features","Dedicated account manager","SLA guarantee","White-label option","Custom integrations"],
    missing:[],
  },
];

const INIT_TEMPLATES = [
  { id:1, name:"Business Card",   Icon:User,          uses:142, type:"vcard"    },
  { id:2, name:"Office WiFi",     Icon:Wifi,          uses:89,  type:"wifi"     },
  { id:3, name:"Product URL",     Icon:Link2,         uses:67,  type:"url"      },
  { id:4, name:"Event Location",  Icon:MapPin,        uses:45,  type:"location" },
  { id:5, name:"WhatsApp CTA",    Icon:MessageCircle, uses:38,  type:"whatsapp" },
  { id:6, name:"Social Profile",  Icon:Share2,        uses:31,  type:"social"   },
];

const REPORT_STATS = [
  { label:"Total Writes",    val:"2,841", change:"+18%",  up:true  },
  { label:"Success Rate",    val:"98.7%", change:"+0.4%", up:true  },
  { label:"Most Used Type",  val:"URL",   change:"43%",   up:true  },
  { label:"Cards Written",   val:"1,204", change:"+24%",  up:true  },
];

const TOOLTIP_STYLE = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:8, fontSize:11 },
  labelStyle:  { color:"#991b1b" },
  itemStyle:   { color:"#ef4444" },
};

const FOOTER_FEATURES = [
  { Icon:Shield,    label:"Bank-Level Security",   sub:"Your data is 100% secure",   color:"text-red-500"  },
  { Icon:Cloud,     label:"Cloud Backup",          sub:"Automatic & secure backup",  color:"text-rose-500" },
  { Icon:Globe,     label:"Global Compatibility",  sub:"Works on all NFC devices",   color:"text-red-600"  },
  { Icon:Smartphone,label:"No App Required",       sub:"Just tap and it works",      color:"text-rose-600" },
  { Icon:Leaf,      label:"Eco Friendly",          sub:"Reduce paper, save planet",  color:"text-red-400"  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function buildNDEFRecord(typeId, value) {
  switch (typeId) {
    case "url": case "social": case "applink": return [{ recordType:"url",  data:value }];
    case "text": case "json":                  return [{ recordType:"text", data:value }];
    case "email":    return [{ recordType:"url",  data:`mailto:${value}` }];
    case "phone":    return [{ recordType:"url",  data:`tel:${value}`    }];
    case "sms":      return [{ recordType:"url",  data:`sms:${value}`    }];
    case "whatsapp": return [{ recordType:"url",  data:`https://wa.me/${value}` }];
    default:         return [{ recordType:"text", data:value }];
  }
}

// ─── STEP WIZARD ──────────────────────────────────────────────────────────────

function StepWizard({ activeStep }) {
  const steps = ["Select Type","Add Data","Tap & Write","Verify & Complete"];
  return (
    <div className="flex items-center gap-0 mb-5 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const done = i < activeStep, curr = i === activeStep;
        return (
          <div key={step} className="flex items-center gap-0">
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap
              ${curr?"bg-red-600 text-white shadow-lg shadow-red-200":done?"bg-green-100 text-green-700 border border-green-200":"text-red-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border
                ${curr?"bg-white text-red-600 border-white":done?"bg-green-500 border-green-400 text-white":"border-red-200 text-red-400"}`}>
                {done ? <CheckCircle2 className="w-3 h-3"/> : i+1}
              </span>
              <span className="hidden sm:inline">{step}</span>
            </div>
            {i < steps.length-1 && (
              <div className={`w-4 sm:w-8 h-px mx-0.5 sm:mx-1 flex-shrink-0 ${done?"bg-green-400":"bg-red-100"}`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── WRITE NFC FORM ───────────────────────────────────────────────────────────

function WriteNFCForm({ selType, setSelType, fieldVal, setFieldVal, step, setStep, nfcStatus, cardInfo, advOpts, setAdvOpts, handleWrite, handleClear }) {
  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  const dt     = DATA_TYPES[selType];
  const fields = FIELD_MAP[dt.id] || FIELD_MAP.url;
  const primVal = Object.values(fieldVal)[0] || "";
  const isReady = primVal.trim() !== "";
  const isBusy  = nfcStatus === NFC.WRITING || nfcStatus === NFC.SCANNING;

  const handleSelectType = (i) => { setSelType(i); setFieldVal({}); if (step === 0) setStep(1); };
  const handleFieldChange = (val) => {
    setFieldVal(val);
    const hasVal = Object.values(val).some(v => v && v.trim?.() !== "");
    if (hasVal && step < 2) setStep(2);
  };

  const statusBg = {
    [NFC.SUCCESS]:     "bg-green-50 border-green-300 text-green-700",
    [NFC.ERROR]:       "bg-red-100 border-red-400 text-red-700",
    [NFC.UNSUPPORTED]: "bg-rose-50 border-rose-300 text-rose-600",
  }[nfcStatus] || "bg-red-50 border-red-200 text-red-600";

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
      <StepWizard activeStep={step}/>

      {/* Step 1 */}
      <h3 className="text-red-900 font-semibold text-sm mb-1">1. Select Data Type</h3>
      <p className="text-red-400 text-xs mb-3">Choose the type of data you want to write</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-5">
        {DATA_TYPES.map((d, i) => (
          <button key={d.id} onClick={() => handleSelectType(i)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 rounded-xl border text-left transition-all
              ${selType===i?"bg-red-600 border-red-600 text-white shadow-md shadow-red-200":"bg-red-50 border-red-200 text-red-700 hover:border-red-400 hover:bg-red-100"}`}>
            <d.Icon className="w-3.5 h-3.5 flex-shrink-0"/>
            <div className="min-w-0">
              <div className="font-semibold text-[10px] sm:text-xs leading-tight truncate">{d.label}</div>
              <div className={`text-[9px] leading-tight hidden sm:block ${selType===i?"text-red-200":"text-red-400"}`}>{d.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Step 2 */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 font-semibold text-sm mb-1">2. Add Data</h3>
        <p className="text-red-400 text-xs mb-3">Enter data for <span className="text-red-600 font-medium">{dt.label}</span></p>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-red-600 text-xs font-medium block mb-1">{f.label}</label>
              {f.multiline
                ? <textarea value={fieldVal[f.key]||""} onChange={e=>handleFieldChange({...fieldVal,[f.key]:e.target.value})}
                    placeholder={f.placeholder} rows={3} className={`${inputCls} resize-none`}/>
                : <input type={f.type||"text"} value={fieldVal[f.key]||""} onChange={e=>handleFieldChange({...fieldVal,[f.key]:e.target.value})}
                    placeholder={f.placeholder} className={inputCls}/>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Advanced options */}
      <div className="mt-4 pt-4 border-t border-red-100">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-500"/>Advanced Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
          {[
            { key:"dynamicLink",     label:"Enable Dynamic Link"       },
            { key:"lockAfterWrite",  label:"Lock Card After Write"     },
            { key:"passwordProtect", label:"Set Password Protection"   },
            { key:"autoDetect",      label:"Auto Detect Card Type"     },
            { key:"writeOnce",       label:"Write Once (Lock after)"   },
            { key:"optimizeMemory",  label:"Optimize Memory Usage"     },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={advOpts[opt.key]||false}
                onChange={e=>setAdvOpts({...advOpts,[opt.key]:e.target.checked})}
                className="w-4 h-4 rounded accent-red-500 cursor-pointer"/>
              <span className="text-red-600 text-xs group-hover:text-red-800 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 3 — ready to write */}
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
              <div className="text-red-400 text-xs truncate">{primVal || "No data entered"}</div>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0
              ${isReady?"bg-green-100 text-green-700 border-green-200":"bg-red-100 text-red-400 border-red-200"}`}>
              {isReady ? "Ready" : "Incomplete"}
            </span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs space-y-1.5 flex-shrink-0">
            {[
              { l:"Data Size", v:`${Math.max(28,(primVal?.length||0)+10)} B` },
              { l:"Writable",  v:"Yes"  },
              { l:"Card Type", v:"Auto" },
            ].map(r => (
              <div key={r.l} className="flex items-center gap-4">
                <span className="text-red-400 w-20">{r.l}</span>
                <span className="text-red-900 font-medium">{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleWrite} disabled={!isReady || isBusy}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
            {isBusy
              ? <><RefreshCw className="w-4 h-4 animate-spin"/>{nfcStatus===NFC.SCANNING?"Scanning...":"Writing..."}</>
              : nfcStatus===NFC.SUCCESS
                ? <><CheckCircle2 className="w-4 h-4"/>Written Successfully!</>
                : <><Radio className="w-4 h-4"/>Write to NFC Card</>
            }
          </button>
          <button onClick={handleClear}
            className="flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 hover:border-red-400 text-red-600 text-sm font-semibold px-4 sm:px-5 py-3 rounded-xl transition-all">
            <X className="w-4 h-4"/><span className="hidden sm:inline">Clear All</span>
          </button>
        </div>

        {nfcStatus !== NFC.IDLE && (
          <div className={`mt-3 flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border ${statusBg}`}>
            {nfcStatus===NFC.SUCCESS
              ? <CheckCircle2 className="w-4 h-4 flex-shrink-0"/>
              : nfcStatus===NFC.ERROR||nfcStatus===NFC.UNSUPPORTED
                ? <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                : <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin"/>
            }
            {nfcStatus===NFC.SCANNING    && "Waiting for NFC card… Hold your card near the device."}
            {nfcStatus===NFC.WRITING     && "Writing data to NFC card… Do not remove the card."}
            {nfcStatus===NFC.SUCCESS     && "Data written successfully to NFC card!"}
            {nfcStatus===NFC.ERROR       && "Failed to write. Check card compatibility and try again."}
            {nfcStatus===NFC.UNSUPPORTED && "Web NFC not supported. Use Android + Chrome."}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCAN NFC PANEL ───────────────────────────────────────────────────────────

function ScanNFCPanel() {
  const [scanStatus,  setScanStatus]  = useState("idle");
  const [scannedData, setScannedData] = useState(null);

  const handleScan = async () => {
    if (typeof NDEFReader === "undefined") {
      setScanStatus("unsupported");
      setScannedData({ error:"Web NFC not supported. Use Android + Chrome 89+." });
      return;
    }
    try {
      setScanStatus("scanning");
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        const decoder = new TextDecoder();
        const records = message.records.map(r => ({ type:r.recordType, data:decoder.decode(r.data) }));
        setScannedData({ uid:serialNumber, records, time:new Date().toLocaleTimeString() });
        setScanStatus("success");
      });
    } catch (e) {
      setScanStatus("error");
      setScannedData({ error:e.message });
    }
  };

  const isScanning = scanStatus === "scanning";
  const isSuccess  = scanStatus === "success";

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
          <ScanLine className="w-5 h-5 text-white"/>
        </div>
        <div>
          <h2 className="text-red-900 font-bold text-lg">Scan NFC Card</h2>
          <p className="text-red-400 text-xs">Read and inspect any NFC card</p>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          {isScanning && <>
            <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" style={{animationDuration:"1.5s"}}/>
            <div className="absolute inset-3 rounded-full border-2 border-rose-300/30 animate-ping" style={{animationDuration:"2s",animationDelay:"0.3s"}}/>
          </>}
          <div className={`absolute inset-4 rounded-full border-2 flex items-center justify-center transition-all
            ${isSuccess?"border-green-400 bg-green-50":isScanning?"border-red-500 bg-red-50 animate-pulse":"border-red-200 bg-red-50/50"}`}>
            <ScanLine className={`w-12 h-12 transition-colors ${isSuccess?"text-green-500":isScanning?"text-red-500":"text-red-300"}`}/>
          </div>
          {isSuccess && (
            <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white"/>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-5">
        <div className={`flex items-center gap-1.5 border text-xs font-semibold px-4 py-1.5 rounded-full
          ${isSuccess?"bg-green-100 border-green-300 text-green-700"
          :isScanning?"bg-red-100 border-red-300 text-red-600"
          :scanStatus==="error"||scanStatus==="unsupported"?"bg-rose-100 border-rose-300 text-rose-600"
          :"bg-red-50 border-red-200 text-red-500"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isSuccess?"bg-green-500":isScanning?"bg-red-500 animate-pulse":"bg-red-300"}`}/>
          {scanStatus==="idle"        && "Ready to Scan"}
          {scanStatus==="scanning"    && "Hold card near device…"}
          {scanStatus==="success"     && "Card Detected!"}
          {scanStatus==="error"       && "Scan Failed"}
          {scanStatus==="unsupported" && "Not Supported"}
        </div>
      </div>

      {scannedData && (
        <div className={`mb-4 p-4 rounded-xl border ${isSuccess?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
          {scannedData.error ? (
            <div className="text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0"/>{scannedData.error}
            </div>
          ) : (
            <div className="space-y-2">
              {[{k:"UID",v:scannedData.uid||"N/A"},{k:"Read at",v:scannedData.time},{k:"Records",v:scannedData.records?.length||0}].map(r=>(
                <div key={r.k} className="flex justify-between text-xs">
                  <span className="text-green-600 font-semibold">{r.k}</span>
                  <span className="text-green-900 font-mono">{r.v}</span>
                </div>
              ))}
              {scannedData.records?.map((r,i)=>(
                <div key={i} className="bg-white border border-green-200 rounded-lg p-2.5">
                  <div className="text-[10px] text-green-500 font-semibold mb-1">{r.type}</div>
                  <div className="text-xs text-green-900 break-all">{r.data}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleScan} disabled={isScanning}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
          {isScanning ? <><RefreshCw className="w-4 h-4 animate-spin"/>Scanning…</> : <><ScanLine className="w-4 h-4"/>Scan NFC Card</>}
        </button>
        <button onClick={()=>{setScanStatus("idle");setScannedData(null);}}
          className="flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4"/><span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
        <p className="text-red-500 text-[10px] font-medium mb-2">Supported Cards</p>
        <div className="flex flex-wrap gap-1">
          {SUPPORTED_CARDS.map(c=>(
            <span key={c} className="text-[9px] font-medium text-red-600 bg-white border border-red-200 px-1.5 py-0.5 rounded-md">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BULK WRITE PANEL ─────────────────────────────────────────────────────────

function BulkWritePanel() {
  const [csvData,  setCsvData]  = useState("");
  const [parsed,   setParsed]   = useState([]);
  const [writing,  setWriting]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [done,     setDone]     = useState(false);
  const SAMPLE = `type,value\nurl,https://site1.com\nurl,https://site2.com\nvcard,John Doe`;

  const handleParse = () => {
    const lines = csvData.trim().split("\n").slice(1).filter(Boolean);
    setParsed(lines.map((l,i)=>{ const [type,value]=l.split(","); return {id:i+1,type:type?.trim(),value:value?.trim(),status:"pending"}; }));
    setDone(false); setProgress(0);
  };

  const handleBulkWrite = async () => {
    if (!parsed.length) return;
    setWriting(true); setProgress(0); setDone(false);
    for (let i=0; i<parsed.length; i++) {
      await new Promise(r=>setTimeout(r,600));
      setParsed(p=>p.map((row,idx)=>idx===i?{...row,status:"success"}:row));
      setProgress(Math.round(((i+1)/parsed.length)*100));
    }
    setWriting(false); setDone(true);
  };

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
          <Package className="w-5 h-5 text-white"/>
        </div>
        <div>
          <h2 className="text-red-900 font-bold text-lg">Bulk Write Cards</h2>
          <p className="text-red-400 text-xs">Write data to multiple NFC cards at once</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-700 text-xs font-semibold">Weekly Bulk Writes</span>
          <span className="text-green-600 text-xs font-semibold flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/>+28% this week</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={BULK_CHART} margin={{top:2,right:2,left:-30,bottom:0}} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP_STYLE}/>
            <Bar dataKey="cards" name="Cards" fill="#ef4444" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-red-600 text-xs font-medium">Paste CSV Data</label>
          <button onClick={()=>setCsvData(SAMPLE)} className="text-red-500 hover:text-red-700 text-[10px] font-semibold">Use sample</button>
        </div>
        <textarea value={csvData} onChange={e=>setCsvData(e.target.value)} rows={5}
          placeholder={`type,value\nurl,https://example.com\nvcard,John Doe`}
          className="w-full bg-red-50 border border-red-200 text-red-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 resize-none font-mono"/>
        <button onClick={handleParse} disabled={!csvData.trim()}
          className="w-full mt-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2 rounded-lg transition-all disabled:opacity-50">
          Parse CSV ({Math.max(0,csvData.trim().split("\n").filter(Boolean).length-1)} rows)
        </button>
      </div>

      {parsed.length > 0 && (
        <div className="mb-3">
          <div className="text-red-700 text-xs font-semibold mb-2">{parsed.length} cards queued</div>
          {writing && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-red-600">Writing…</span><span className="text-red-900 font-bold">{progress}%</span></div>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}}/>
              </div>
            </div>
          )}
          {done && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3 text-green-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4"/>All {parsed.length} cards written successfully!
            </div>
          )}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {parsed.map(row=>(
              <div key={row.id} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <span className="text-red-400 text-[10px] font-mono w-5">{row.id}</span>
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">{row.type}</span>
                <span className="text-red-700 text-xs flex-1 truncate">{row.value}</span>
                {row.status==="success"
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0"/>
                  : <div className="w-3.5 h-3.5 rounded-full border-2 border-red-200 flex-shrink-0"/>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleBulkWrite} disabled={!parsed.length||writing}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
        {writing ? <><RefreshCw className="w-4 h-4 animate-spin"/>Writing {progress}%…</>
        : done    ? <><CheckCircle2 className="w-4 h-4"/>Write Again</>
        :           <><Package className="w-4 h-4"/>Start Bulk Write</>}
      </button>
    </div>
  );
}

// ─── CREATE TEMPLATE PANEL ────────────────────────────────────────────────────

function CreateTemplatePanel() {
  const [templates, setTemplates] = useState(INIT_TEMPLATES);
  const [name,      setName]      = useState("");
  const [selType,   setSelType]   = useState(0);
  const [saved,     setSaved]     = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    const dt = DATA_TYPES[selType];
    setTemplates(p=>[...p,{id:Date.now(),name,Icon:dt.Icon,uses:0,type:dt.id}]);
    setName(""); setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <LayoutTemplate className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h2 className="text-red-900 font-bold text-lg">Create Template</h2>
            <p className="text-red-400 text-xs">Save reusable NFC card templates</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Template Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Business Card v2"
              className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors"/>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-2">Data Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DATA_TYPES.slice(0,8).map((d,i)=>(
                <button key={d.id} onClick={()=>setSelType(i)}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-xl border text-left transition-all
                    ${selType===i?"bg-red-600 border-red-600 text-white shadow-md shadow-red-200":"bg-red-50 border-red-200 text-red-700 hover:border-red-400"}`}>
                  <d.Icon className="w-3.5 h-3.5 flex-shrink-0"/>
                  <span className="text-[10px] font-semibold truncate">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {saved && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4"/>Template saved!
          </div>
        )}
        <button onClick={handleSave} disabled={!name.trim()}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
          <LayoutTemplate className="w-4 h-4"/>Save Template
        </button>
      </div>

      <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center justify-between">
          My Templates <span className="text-red-400 font-normal text-xs">{templates.length} saved</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {templates.map(t=>(
            <div key={t.id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 hover:border-red-300 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-200">
                <t.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold truncate">{t.name}</div>
                <div className="text-red-400 text-[10px]">{t.uses} uses · {t.type}</div>
              </div>
              <button onClick={()=>setTemplates(p=>p.filter(x=>x.id!==t.id))}
                className="text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                <X className="w-3.5 h-3.5"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS PANEL ────────────────────────────────────────────────────────────

function ReportsPanel() {
  const handleExport = () => {
    const rows = RECENT_ACTIVITY.map(a=>`${a.label},${a.time}`);
    const blob = new Blob([["Action,Time",...rows].join("\n")],{type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="nfc_write_report.csv"; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <FileBarChart className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h2 className="text-red-900 font-bold text-lg">Write Reports</h2>
              <p className="text-red-400 text-xs">Analytics for your NFC card writes</p>
            </div>
          </div>
          <button onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
            <Download className="w-3.5 h-3.5"/>Export CSV
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {REPORT_STATS.map(s=>(
            <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-3">
              <div className="text-red-400 text-[11px] mb-1">{s.label}</div>
              <div className="text-red-900 font-bold text-lg">{s.val}</div>
              <div className={`text-[11px] font-semibold flex items-center gap-0.5 ${s.up?"text-green-600":"text-red-500"}`}>
                <ArrowUpRight className="w-3 h-3"/>{s.change}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 text-xs font-semibold">Scan Analytics — May 2025</span>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-red-400 text-[10px]">Scans</span></div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={SCAN_CHART} margin={{top:4,right:4,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="scanGradR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
              <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
              <Tooltip {...TOOLTIP_STYLE}/>
              <Area type="monotone" dataKey="v" name="Scans" stroke="#ef4444" strokeWidth={2}
                fill="url(#scanGradR)" dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-red-900 font-semibold text-sm mb-3">Recent Write Activity</h3>
        <div className="space-y-2.5">
          {RECENT_ACTIVITY.map((a,i)=>(
            <div key={i} className="flex items-center gap-2.5 p-2.5 bg-red-50/50 border border-red-100 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-200">
                <a.Icon className="w-4 h-4 text-white"/>
              </div>
              <span className="text-red-700 text-xs flex-1 font-medium">{a.label}</span>
              <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5"/>Success
              </span>
              <span className="text-red-400 text-[10px] flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── UPGRADE PLANS MODAL ──────────────────────────────────────────────────────

function UpgradePlansModal({ onClose }) {
  const [selected, setSelected] = useState("Premium");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-red-100 my-auto">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-t-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white"/>
            </div>
            <div>
              <div className="text-white font-bold text-base">Upgrade Your Plan</div>
              <div className="text-red-100 text-xs">Unlock more credits, cards and features</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {PLANS.map(p=>(
              <div key={p.name} onClick={()=>setSelected(p.name)}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${selected===p.name?"border-red-600 shadow-lg shadow-red-100":p.color+" hover:border-red-400"}`}>
                {p.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md shadow-red-200">
                    {p.badge}
                  </div>
                )}
                {p.current && (
                  <div className="absolute top-2 right-2 text-[9px] bg-green-100 text-green-700 border border-green-200 font-bold px-1.5 py-0.5 rounded-full">Current</div>
                )}
                <div className="mb-3">
                  <div className="text-red-900 font-bold text-sm">{p.name}</div>
                  <div className="flex items-end gap-0.5">
                    <span className="text-red-900 font-bold text-xl">{p.price}</span>
                    <span className="text-red-400 text-xs mb-0.5">{p.period}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {p.features.map(f=>(
                    <div key={f} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5"/>
                      <span className="text-red-700 text-[10px] leading-snug">{f}</span>
                    </div>
                  ))}
                  {p.missing.map(f=>(
                    <div key={f} className="flex items-start gap-1.5 opacity-40">
                      <X className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5"/>
                      <span className="text-red-400 text-[10px] leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
                {selected===p.name && (
                  <div className="absolute top-2 left-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white"/>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-xl transition-all">Maybe Later</button>
            <button onClick={onClose} className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2">
              <Crown className="w-4 h-4"/>Upgrade to {selected}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAP NFC SIDE PANEL ───────────────────────────────────────────────────────

function TapNFCSidePanel({ nfcStatus, cardInfo }) {
  const isActive  = [NFC.SCANNING,NFC.WRITING].includes(nfcStatus);
  const isSuccess = nfcStatus === NFC.SUCCESS;
  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
      <h2 className="text-red-900 font-bold text-sm mb-0.5 flex items-center gap-2">
        <Radio className="w-4 h-4 text-red-500"/>Tap Your NFC Card
      </h2>
      <p className="text-red-400 text-[11px] mb-4">Hold your NFC card near the device</p>

      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28">
          {isActive && <>
            <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" style={{animationDuration:"1.5s"}}/>
            <div className="absolute inset-3 rounded-full border-2 border-rose-300/30 animate-ping" style={{animationDuration:"2s",animationDelay:"0.3s"}}/>
          </>}
          <div className={`absolute inset-4 rounded-full border-2 flex items-center justify-center transition-all
            ${isSuccess?"border-red-400 bg-red-50":isActive?"border-red-500 bg-red-50 animate-pulse":"border-red-200 bg-red-50/50"}`}>
            <Smartphone className={`w-10 h-10 transition-colors ${isSuccess||isActive?"text-red-500":"text-red-300"}`}/>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className={`flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-full
          ${isSuccess?"bg-green-100 border-green-300 text-green-700":isActive?"bg-red-100 border-red-300 text-red-600":"bg-red-50 border-red-200 text-red-500"}`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSuccess?"bg-green-500":isActive?"bg-red-500":"bg-red-400"}`}/>
          {isActive?"Processing…":isSuccess?"Write Success!":"Ready to Scan"}
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
            { l:"Status",      v:cardInfo.status     || "No Card Detected" },
            { l:"UID",         v:cardInfo.uid         || "--"              },
            { l:"Card Type",   v:cardInfo.cardType    || "--"              },
            { l:"Memory",      v:cardInfo.memorySize  || "--"              },
            { l:"Writable",    v:cardInfo.writable    || "--"              },
            { l:"Lock Status", v:cardInfo.lockStatus  || "--"              },
          ].map(r=>(
            <div key={r.l} className="flex items-center text-xs">
              <span className="text-red-400 w-20 flex-shrink-0">{r.l}</span>
              <span className={r.l==="Status"&&cardInfo.status?"text-green-600 font-semibold":"text-red-700"}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT PANEL ──────────────────────────────────────────────────────────────

function RightPanel({ onAction, onUpgrade }) {
  const ACTIONS = [
    { id:"write",    Icon:PenLine,        label:"Write New Card",    sub:"Create a new NFC card",  bg:"from-red-500 to-rose-600"  },
    { id:"scan",     Icon:ScanLine,       label:"Scan NFC Card",     sub:"Read any NFC card",      bg:"from-rose-500 to-red-600"  },
    { id:"bulk",     Icon:Package,        label:"Bulk Write Cards",  sub:"Write multiple cards",   bg:"from-red-600 to-rose-700"  },
    { id:"template", Icon:LayoutTemplate, label:"Create Template",   sub:"Save as template",       bg:"from-rose-600 to-red-700"  },
    { id:"reports",  Icon:FileBarChart,   label:"View Reports",      sub:"Download analytics",     bg:"from-red-700 to-rose-800"  },
  ];

  return (
    <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4">

      {/* Quick actions */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-red-900 font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="space-y-2">
          {ACTIONS.map(a=>(
            <button key={a.id} onClick={()=>onAction(a.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r ${a.bg} hover:opacity-90 transition-all shadow-sm shadow-red-100 text-left`}>
              <a.Icon className="w-4 h-4 text-white flex-shrink-0"/>
              <div className="min-w-0">
                <div className="text-white text-xs font-bold leading-tight">{a.label}</div>
                <div className="text-white/70 text-[10px] truncate">{a.sub}</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/60 flex-shrink-0 ml-auto"/>
            </button>
          ))}
        </div>
      </div>

      {/* Live analytics */}
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
          <span className="text-green-600 text-xs font-semibold mb-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/>12.5%</span>
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
            <Tooltip {...TOOLTIP_STYLE}/>
            <Area type="monotone" dataKey="v" name="Scans" stroke="#ef4444" strokeWidth={2}
              fill="url(#scanGradW)" dot={{r:3,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-900 font-semibold text-sm">Recent Activity</h3>
          <button onClick={()=>onAction("reports")} className="text-red-500 hover:text-red-700 text-[10px] font-semibold">View All</button>
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

      {/* Plan CTA */}
      <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-xl p-4 relative overflow-hidden shadow-lg shadow-red-200">
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"/>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-300"/>
            <span className="text-white font-bold text-sm">You're on Premium</span>
          </div>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 rounded-full" style={{width:"58%"}}/>
            </div>
            <span className="text-white/70 text-[10px]">8,690/15k</span>
          </div>
          <button onClick={onUpgrade}
            className="w-full bg-white hover:bg-red-50 text-red-600 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5"/>Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function WriteNFCCardPage({ onMenuClick }) {
  const [activePanel, setActivePanel] = useState("write");
  const [selType,     setSelType]     = useState(0);
  const [fieldVal,    setFieldVal]    = useState({});
  const [step,        setStep]        = useState(0);
  const [nfcStatus,   setNfcStatus]   = useState(NFC.IDLE);
  const [cardInfo,    setCardInfo]    = useState({});
  const [advOpts,     setAdvOpts]     = useState({ dynamicLink:true, autoDetect:true });
  const [showPlans,   setShowPlans]   = useState(false);

  const handleWrite = useCallback(async () => {
    const dt = DATA_TYPES[selType];
    const primVal = Object.values(fieldVal)[0] || "";
    if (!primVal.trim()) return;

    if (typeof NDEFReader === "undefined") {
      // Demo mode
      setNfcStatus(NFC.SCANNING); setStep(2);
      setTimeout(() => {
        setNfcStatus(NFC.WRITING);
        setTimeout(() => {
          setNfcStatus(NFC.SUCCESS); setStep(3);
          setCardInfo({
            status:"Written Successfully", uid:"04 A2 B3 C4 D5 E6 80",
            cardType:"NTAG215", memorySize:`${Math.max(28,(primVal?.length||0)+10)} Bytes`,
            writable:"Yes", lockStatus:advOpts.lockAfterWrite?"Locked":"Unlocked",
          });
          setTimeout(() => { setNfcStatus(NFC.IDLE); }, 5000);
        }, 1000);
      }, 1200);
      return;
    }

    try {
      setNfcStatus(NFC.SCANNING); setStep(2);
      const ndef = new NDEFReader();
      await ndef.write({ records: buildNDEFRecord(dt.id, primVal) });
      setNfcStatus(NFC.SUCCESS); setStep(3);
      setCardInfo({
        status:"Written Successfully", uid:"Auto Detected",
        cardType:"NDEF Compatible", memorySize:`${Math.max(28,(primVal?.length||0)+10)} Bytes`,
        writable:"Yes", lockStatus:advOpts.lockAfterWrite?"Locked":"Unlocked",
      });
      setTimeout(() => { setNfcStatus(NFC.IDLE); }, 5000);
    } catch (err) {
      setNfcStatus(err.name==="NotSupportedError" ? NFC.UNSUPPORTED : NFC.ERROR);
      setCardInfo({ status:`Error: ${err.message}` });
    }
  }, [selType, fieldVal, advOpts]);

  const handleClear = () => { setFieldVal({}); setNfcStatus(NFC.IDLE); setCardInfo({}); setStep(0); setSelType(0); };

  const PANEL_TITLES = {
    write:"Write NFC Card", scan:"Scan NFC Card",
    bulk:"Bulk Write Cards", template:"Create Template", reports:"View Reports",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>
      {showPlans && <UpgradePlansModal onClose={()=>setShowPlans(false)}/>}

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 sm:px-5 pt-4 sm:pt-5 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <PenLine className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">{PANEL_TITLES[activePanel]}</h1>
              <p className="text-red-400 text-xs hidden sm:block">Select data type, add data and write to your NFC card</p>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-5 pb-4">
          <div className="flex flex-col xl:flex-row gap-4">

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {activePanel==="write"    && <WriteNFCForm selType={selType} setSelType={setSelType} fieldVal={fieldVal} setFieldVal={setFieldVal} step={step} setStep={setStep} nfcStatus={nfcStatus} cardInfo={cardInfo} advOpts={advOpts} setAdvOpts={setAdvOpts} handleWrite={handleWrite} handleClear={handleClear}/>}
              {activePanel==="scan"     && <ScanNFCPanel/>}
              {activePanel==="bulk"     && <BulkWritePanel/>}
              {activePanel==="template" && <CreateTemplatePanel/>}
              {activePanel==="reports"  && <ReportsPanel/>}
            </div>

            {/* Tap NFC side panel — write mode only */}
            {activePanel==="write" && (
              <div className="w-full xl:w-56 flex-shrink-0">
                <TapNFCSidePanel nfcStatus={nfcStatus} cardInfo={cardInfo}/>
              </div>
            )}

            {/* Right panel — always visible */}
            <RightPanel onAction={setActivePanel} onUpgrade={()=>setShowPlans(true)}/>
          </div>
        </div>

        {/* Footer feature strip */}
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