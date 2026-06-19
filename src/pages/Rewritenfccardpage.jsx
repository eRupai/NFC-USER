import { useState, useCallback } from "react";
import {
  RefreshCw, ExternalLink, Smartphone, Radio,
  CheckCircle2, XCircle, AlertTriangle, Info,
  Wifi, WifiOff, Shield, Lock, Clock, Activity, BarChart2,
  CreditCard, Link2, FileText, MessageSquare, MessageCircle,
  MapPin, Share2, Bookmark, Code2, Phone, Mail, User,
  ArrowUpRight, RotateCcw, X, ChevronDown,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DATA_TYPES = [
  { Icon:Link2,         label:"URL / Link",   sub:"Contact",       id:"url"      },
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

const MOCK_CARD = {
  cardType:"NTAG215", uid:"04 A2 B3 C4 D5 E6 80",
  memorySize:"504 Bytes", writable:"Yes",
  lockStatus:"Unlocked", lastWritten:"22 May 2025, 10:30 AM",
};

const WRITE_HISTORY = [
  {day:"Mon",writes:8},{day:"Tue",writes:12},{day:"Wed",writes:7},
  {day:"Thu",writes:15},{day:"Fri",writes:10},{day:"Sat",writes:5},{day:"Sun",writes:9},
];

const SUCCESS_TREND = [
  {day:"Mon",rate:96},{day:"Tue",rate:99},{day:"Wed",rate:97},
  {day:"Thu",rate:98},{day:"Fri",rate:100},{day:"Sat",rate:95},{day:"Sun",rate:99},
];

const FIELD_MAP = {
  url:      [{key:"url",   label:"URL / Link",     placeholder:"https://mywebsite.com",          required:true},
             {key:"title", label:"Title",           placeholder:"My Website",                     required:false},
             {key:"desc",  label:"Description",     placeholder:"A short description...",         required:false, multiline:true}],
  vcard:    [{key:"name",  label:"Full Name",       placeholder:"John Doe",                       required:true},
             {key:"phone", label:"Phone",            placeholder:"+1 234 567 890",                 required:false},
             {key:"email", label:"Email",            placeholder:"john@example.com",               required:false}],
  text:     [{key:"text",  label:"Text Content",    placeholder:"Enter your text here...",        required:true, multiline:true}],
  wifi:     [{key:"ssid",  label:"Network Name",    placeholder:"MyWiFiNetwork",                  required:true},
             {key:"pass",  label:"Password",         placeholder:"wifi_password",                  required:true, type:"password"}],
  email:    [{key:"email", label:"Email Address",   placeholder:"example@email.com",              required:true}],
  phone:    [{key:"phone", label:"Phone Number",    placeholder:"+1 234 567 890",                 required:true}],
  sms:      [{key:"phone", label:"Phone Number",    placeholder:"+1 234 567 890",                 required:true},
             {key:"msg",   label:"Message",          placeholder:"Hello!",                         required:false, multiline:true}],
  whatsapp: [{key:"phone", label:"WhatsApp Number", placeholder:"+1234567890",                    required:true}],
  social:   [{key:"url",   label:"Profile URL",     placeholder:"https://instagram.com/username", required:true}],
  location: [{key:"lat",   label:"Latitude",        placeholder:"28.6139",                        required:true},
             {key:"lng",   label:"Longitude",        placeholder:"77.2090",                        required:true}],
  applink:  [{key:"url",   label:"Deep Link URL",   placeholder:"myapp://screen",                 required:true}],
  json:     [{key:"json",  label:"JSON Data",       placeholder:'{"key":"value"}',                required:true, multiline:true}],
};

const NFC = { IDLE:"idle", SCANNING:"scanning", WRITING:"writing", SUCCESS:"success", ERROR:"error", UNSUPPORTED:"unsupported" };

const TOOLTIP_STYLE = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
  itemStyle:{color:"#ef4444"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked?"bg-red-600":"bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked?"translate-x-5":"translate-x-0.5"}`}/>
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = {
    success:"bg-red-600 border-red-400 text-white",
    error:  "bg-red-800 border-red-600 text-white",
    info:   "bg-rose-600 border-rose-400 text-white",
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<XCircle className="w-4 h-4"/>:<Info className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

function HowItWorksModal({ onClose }) {
  const steps = [
    {n:1,Icon:Radio,        title:"Scan Your Card",     desc:"Hold your NFC card near the device to read what's currently on it."},
    {n:2,Icon:Activity,     title:"See Current Data",   desc:"The app reads and shows the data stored on your card right now."},
    {n:3,Icon:FileText,     title:"Update Your Data",   desc:"Choose a new data type and enter the updated information."},
    {n:4,Icon:CheckCircle2, title:"Write & Confirm",    desc:"Tap the card again to write the new data. Done!"},
  ];
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-red-500"/>How Re-Write Works
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="space-y-4">
          {steps.map(s => (
            <div key={s.n} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-red-200">
                <s.Icon className="w-4 h-4"/>
              </div>
              <div>
                <div className="text-red-900 text-sm font-semibold mb-0.5">{s.title}</div>
                <div className="text-red-500 text-xs">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          Got it!
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function UserReWriteNFCCardPage({ onMenuClick }) {
  const [activeStep, setActiveStep] = useState(1);
  const [selType,    setSelType]    = useState(0);
  const [fieldVals,  setFieldVals]  = useState({url:"https://mywebsite.com",title:"My Website",desc:"My personal NFC card link."});
  const [nfcStatus,  setNfcStatus]  = useState(NFC.IDLE);
  const [cardInfo,   setCardInfo]   = useState(MOCK_CARD);
  const [showCard,   setShowCard]   = useState(true);
  const [dynLink,    setDynLink]    = useState(true);
  const [lockAfter,  setLockAfter]  = useState(false);
  const [setPwd,     setSetPwd]     = useState(false);
  const [writeOnce,  setWriteOnce]  = useState(false);
  const [optMem,     setOptMem]     = useState(true);
  const [advOpen,    setAdvOpen]    = useState(false);
  const [showHowTo,  setShowHowTo]  = useState(false);
  const [toast,      setToast]      = useState({msg:"",type:"success"});
  const [activity,   setActivity]   = useState([
    {Icon:CheckCircle2, label:"Card Scanned",           time:"22 May, 10:31 AM", color:"text-red-500",  bg:"bg-red-100"},
    {Icon:FileText,     label:"Data Read Successfully",  time:"22 May, 10:31 AM", color:"text-rose-500", bg:"bg-rose-100"},
    {Icon:RefreshCw,    label:"Card Rewritten",          time:"22 May, 10:33 AM", color:"text-red-600",  bg:"bg-red-100"},
    {Icon:CheckCircle2, label:"Verification Successful", time:"22 May, 10:33 AM", color:"text-red-500",  bg:"bg-red-100"},
  ]);

  const showToast = (msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:""}),3000);};

  const dt     = DATA_TYPES[selType];
  const fields = FIELD_MAP[dt.id] || FIELD_MAP.url;
  const primVal= fieldVals[fields[0]?.key] || "";
  const isWriting = nfcStatus===NFC.WRITING||nfcStatus===NFC.SCANNING;

  const handleScanCard = useCallback(async () => {
    if (typeof NDEFReader==="undefined") {
      setNfcStatus(NFC.UNSUPPORTED);
      setShowCard(true); setActiveStep(2);
      showToast("Demo mode: showing mock card data.","info");
      return;
    }
    try {
      setNfcStatus(NFC.SCANNING);
      const ndef = new NDEFReader();
      await ndef.scan();
      ndef.addEventListener("reading",({serialNumber})=>{
        setNfcStatus(NFC.IDLE);
        setCardInfo(p=>({...p,uid:serialNumber||"04 A2 B3 C4 D5 E6 80",lastWritten:new Date().toLocaleString()}));
        setActivity(p=>[{Icon:CheckCircle2,label:"Card Scanned",time:new Date().toLocaleTimeString(),color:"text-red-500",bg:"bg-red-100"},...p.slice(0,3)]);
        setActiveStep(2); setShowCard(true);
        showToast("Card detected successfully!");
      });
    } catch(e) { setNfcStatus(NFC.ERROR); showToast(`Scan error: ${e.message}`,"error"); }
  },[]);

  const handleWrite = useCallback(async () => {
    if (!primVal.trim()) { showToast("Please enter the required data first.","error"); return; }
    if (typeof NDEFReader==="undefined") {
      setNfcStatus(NFC.WRITING); setActiveStep(3);
      setTimeout(()=>{
        setNfcStatus(NFC.SUCCESS); setActiveStep(4);
        setActivity(p=>[
          {Icon:CheckCircle2,label:"Verification Successful",time:new Date().toLocaleTimeString(),color:"text-red-500",bg:"bg-red-100"},
          {Icon:RefreshCw,   label:"Card Rewritten",         time:new Date().toLocaleTimeString(),color:"text-rose-500",bg:"bg-rose-100"},
          ...p.slice(0,2),
        ]);
        showToast("Card rewritten successfully! (Demo mode)");
        setTimeout(()=>setNfcStatus(NFC.IDLE),4000);
      },1500);
      return;
    }
    try {
      setNfcStatus(NFC.WRITING); setActiveStep(3);
      const ndef = new NDEFReader();
      let records = [];
      if (dt.id==="url")   records=[{recordType:"url",  data:primVal}];
      else if (dt.id==="text")  records=[{recordType:"text", data:primVal}];
      else if (dt.id==="email") records=[{recordType:"url",  data:`mailto:${primVal}`}];
      else if (dt.id==="phone") records=[{recordType:"url",  data:`tel:${primVal}`}];
      else records=[{recordType:"text",data:primVal}];
      await ndef.write({records});
      setNfcStatus(NFC.SUCCESS); setActiveStep(4);
      showToast("Card rewritten and verified!");
      setTimeout(()=>setNfcStatus(NFC.IDLE),5000);
    } catch(e) { setNfcStatus(NFC.ERROR); showToast(`Write error: ${e.message}`,"error"); }
  },[primVal,dt]);

  const handleCancel = () => {
    setFieldVals({}); setActiveStep(1); setSelType(0); setNfcStatus(NFC.IDLE);
    showToast("Form cleared.","info");
  };

  const STEPS = [
    {n:1, label:"Scan Card",      sub:"Tap NFC card"   },
    {n:2, label:"Read Current",   sub:"View content"   },
    {n:3, label:"Update Data",    sub:"Modify content" },
    {n:4, label:"Write & Verify", sub:"Write new data" },
  ];

  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-5">

          {/* Title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Re-Write My Card</h1>
                <p className="text-red-400 text-xs sm:text-sm mt-0.5 hidden sm:block">Update the data on your NFC card anytime</p>
              </div>
            </div>
            <button onClick={()=>setShowHowTo(true)}
              className="flex items-center gap-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-sm">
              <Info className="w-3.5 h-3.5"/>
              <span className="hidden sm:inline">How it works?</span>
              <span className="sm:hidden">Info</span>
            </button>
          </div>

          {/* Step Wizard */}
          <div className="bg-white border border-red-100 rounded-xl px-4 sm:px-5 py-4 mb-4 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-0 min-w-[500px] sm:min-w-0">
              {STEPS.map((step,i) => {
                const done=activeStep>step.n, curr=activeStep===step.n;
                return (
                  <div key={step.n} className="flex items-center flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        done ?"bg-red-600 border-red-500 text-white shadow-sm shadow-red-200":
                        curr ?"bg-red-700 border-red-600 text-white shadow-sm shadow-red-200":
                              "bg-red-50 border-red-200 text-red-400"
                      }`}>
                        {done?<CheckCircle2 className="w-3.5 h-3.5"/>:step.n}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${curr?"text-red-900":done?"text-red-600":"text-red-400"}`}>{step.label}</div>
                        <div className="text-red-300 text-[10px]">{step.sub}</div>
                      </div>
                    </div>
                    {i<STEPS.length-1 && (
                      <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${done?"bg-red-400":"bg-red-100"}`}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main 3-col layout */}
          <div className="flex flex-col xl:flex-row gap-4">

            {/* ── LEFT: Card Info + My Stats ── */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* My Card Info */}
              <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500"/>My Card Information
                  </h2>
                  <button onClick={()=>{setCardInfo(MOCK_CARD);showToast("Card info refreshed.");}}
                    className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 transition-all">
                    <RefreshCw className="w-3.5 h-3.5"/>
                  </button>
                </div>

                {showCard ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-24 h-20 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 border border-red-200 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-10 h-10 text-red-400"/>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5">
                      {[
                        {l:"Card Type",    v:cardInfo.cardType,   hl:false},
                        {l:"UID",          v:cardInfo.uid,        hl:false},
                        {l:"Memory Size",  v:cardInfo.memorySize, hl:false},
                        {l:"Writable",     v:cardInfo.writable,   hl:false},
                        {l:"Lock Status",  v:cardInfo.lockStatus, hl:true },
                        {l:"Last Written", v:cardInfo.lastWritten,hl:false},
                      ].map(r => (
                        <div key={r.l} className="flex items-center gap-2 text-xs">
                          <span className="text-red-400 w-20 sm:w-24 flex-shrink-0">{r.l}</span>
                          <span className={r.hl&&r.v==="Unlocked"?"text-red-600 font-semibold":r.hl?"text-red-800 font-semibold":"text-red-700"}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 gap-3">
                    <WifiOff className="w-8 h-8 text-red-300"/>
                    <div className="text-red-500 text-sm">Tap your NFC card to read current data</div>
                    <button onClick={handleScanCard}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
                      <Radio className="w-4 h-4"/>Scan My Card
                    </button>
                  </div>
                )}

                {showCard && (
                  <div className="mt-4 pt-4 border-t border-red-100">
                    <h3 className="text-red-900 text-xs font-semibold mb-3">Current Data on Card</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Link2 className="w-3 h-3"/>URL / Link
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-2">
                      <span className="text-red-700 text-xs flex-1 truncate">https://mywebsite.com/profile</span>
                      <button className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                    <div className="text-red-400 text-xs">Title: <span className="text-red-700">My Profile</span></div>
                    <div className="text-red-400 text-xs mt-0.5">Description: <span className="text-red-700">Tap to connect with me instantly.</span></div>
                  </div>
                )}
              </div>

              {/* My Write Stats */}
              <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-red-900 font-semibold text-sm mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-red-500"/>My Write History
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  {[
                    {Icon:RefreshCw,    bg:"bg-red-100",  ic:"text-red-600",  label:"Total Rewrites", value:"45"      },
                    {Icon:Clock,        bg:"bg-rose-100", ic:"text-rose-600", label:"Last Rewritten", value:"22 May"  },
                    {Icon:CheckCircle2, bg:"bg-red-100",  ic:"text-red-600",  label:"Success Rate",   value:"98.7%"   },
                    {Icon:Activity,     bg:"bg-rose-100", ic:"text-rose-600", label:"Avg Write Time", value:"2.3 sec" },
                  ].map(s => (
                    <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                        <s.Icon className={`w-3.5 h-3.5 ${s.ic}`}/>
                      </div>
                      <div className="text-red-400 text-[10px]">{s.label}</div>
                      <div className="text-red-900 font-bold text-sm">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-red-500 text-[10px] font-semibold mb-1">Writes This Week</p>
                    <ResponsiveContainer width="100%" height={80}>
                      <BarChart data={WRITE_HISTORY} margin={{top:2,right:2,left:-30,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                        <XAxis dataKey="day" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                        <Tooltip {...TOOLTIP_STYLE}/>
                        <Bar dataKey="writes" name="Writes" fill="#ef4444" radius={[3,3,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-red-500 text-[10px] font-semibold mb-1">Success Rate</p>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={SUCCESS_TREND} margin={{top:2,right:2,left:-30,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                        <XAxis dataKey="day" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false} domain={[90,100]}/>
                        <Tooltip {...TOOLTIP_STYLE}/>
                        <Line type="monotone" dataKey="rate" name="Rate %" stroke="#ef4444" strokeWidth={2}
                          dot={{r:2.5,fill:"#ef4444",stroke:"#fff",strokeWidth:1.5}}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MIDDLE: Update Form ── */}
            <div className="w-full xl:w-[460px] flex-shrink-0 space-y-4">
              <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-red-900 font-semibold text-base mb-1">Update Card Data</h2>
                <p className="text-red-400 text-xs mb-4">Choose what to put on your card and fill in the details</p>

                {/* Data Type Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
                  {DATA_TYPES.map((d,i) => (
                    <button key={d.id} onClick={()=>{setSelType(i);setFieldVals({});}}
                      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-2 rounded-xl border text-left transition-all ${
                        selType===i?"bg-red-600 border-red-600 text-white shadow-md shadow-red-200":
                                    "bg-red-50 border-red-200 text-red-600 hover:border-red-400 hover:bg-red-100"
                      }`}>
                      <d.Icon className="w-3.5 h-3.5 flex-shrink-0"/>
                      <div className="min-w-0">
                        <div className="font-semibold text-[10px] sm:text-xs leading-tight truncate">{d.label}</div>
                        <div className={`text-[9px] leading-tight hidden sm:block ${selType===i?"text-red-200":"text-red-400"}`}>{d.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Form fields */}
                <div className="border-t border-red-100 pt-4 mb-4">
                  <h3 className="text-red-900 text-sm font-semibold mb-3">Enter New Data</h3>
                  <div className="space-y-3">
                    {fields.map(f => (
                      <div key={f.key}>
                        <label className="text-red-600 text-xs font-medium block mb-1">
                          {f.label} {f.required&&<span className="text-red-500">*</span>}
                          {!f.required&&<span className="text-red-300 ml-1">(Optional)</span>}
                        </label>
                        {f.multiline
                          ? <textarea value={fieldVals[f.key]||""} onChange={e=>setFieldVals(p=>({...p,[f.key]:e.target.value}))}
                              placeholder={f.placeholder} rows={3} className={`${inputCls} resize-none`}/>
                          : <input type={f.type||"text"} value={fieldVals[f.key]||""} onChange={e=>setFieldVals(p=>({...p,[f.key]:e.target.value}))}
                              placeholder={f.placeholder} className={inputCls}/>
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic link toggle */}
                <div className="flex items-center gap-3 mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <Toggle checked={dynLink} onChange={setDynLink}/>
                  <div>
                    <span className="text-red-900 text-xs font-semibold">Enable Dynamic Link</span>
                    <span className="text-red-400 text-[10px] ml-2">(Allow future updates)</span>
                  </div>
                </div>

                {/* Advanced options — collapsed by default for user */}
                <div className="border-t border-red-100 pt-4">
                  <button onClick={()=>setAdvOpen(p=>!p)}
                    className="w-full flex items-center justify-between text-red-900 text-sm font-semibold mb-3 hover:text-red-700 transition-colors">
                    Advanced Options
                    <ChevronDown className={`w-4 h-4 text-red-400 transition-transform ${advOpen?"rotate-180":""}`}/>
                  </button>
                  {advOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                      {[
                        {label:"Lock after rewrite",      val:lockAfter, set:setLockAfter},
                        {label:"Write once (permanent)",  val:writeOnce, set:setWriteOnce},
                        {label:"Set password protection", val:setPwd,    set:setSetPwd   },
                        {label:"Optimize memory usage",   val:optMem,    set:setOptMem   },
                      ].map(opt => (
                        <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" checked={opt.val} onChange={e=>opt.set(e.target.checked)} className="w-4 h-4 rounded accent-red-500 cursor-pointer"/>
                          <span className="text-red-600 text-xs group-hover:text-red-800 transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button onClick={handleCancel}
                  className="flex-1 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 text-red-700 text-sm font-semibold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-4 h-4"/>Reset
                </button>
                <button onClick={handleWrite} disabled={isWriting||!primVal.trim()}
                  className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
                  {isWriting
                    ? <><RefreshCw className="w-4 h-4 animate-spin"/>{nfcStatus===NFC.SCANNING?"Scanning...":"Writing..."}</>
                    : nfcStatus===NFC.SUCCESS
                      ? <><CheckCircle2 className="w-4 h-4"/>Written Successfully!</>
                      : <><Radio className="w-4 h-4"/>Write to My Card</>
                  }
                </button>
              </div>

              {/* Status banner */}
              {nfcStatus!==NFC.IDLE && (
                <div className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border ${
                  nfcStatus===NFC.SUCCESS     ?"bg-red-50 border-red-300 text-red-700":
                  nfcStatus===NFC.ERROR       ?"bg-red-100 border-red-400 text-red-800":
                  nfcStatus===NFC.UNSUPPORTED ?"bg-rose-50 border-rose-300 text-rose-700":
                                               "bg-red-50 border-red-200 text-red-600"
                }`}>
                  {nfcStatus===NFC.SUCCESS?<CheckCircle2 className="w-4 h-4 flex-shrink-0"/>:
                   nfcStatus===NFC.ERROR||nfcStatus===NFC.UNSUPPORTED?<AlertTriangle className="w-4 h-4 flex-shrink-0"/>:
                   <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin"/>}
                  {nfcStatus===NFC.SCANNING    &&"Scanning for your NFC card… Hold it near the device."}
                  {nfcStatus===NFC.WRITING     &&"Writing to your card… Don't remove it yet."}
                  {nfcStatus===NFC.SUCCESS     &&"Your card was rewritten and verified successfully!"}
                  {nfcStatus===NFC.ERROR       &&"Write failed. Check your card is compatible and try again."}
                  {nfcStatus===NFC.UNSUPPORTED &&"Web NFC not supported on this device. Running in demo mode."}
                </div>
              )}
            </div>

            {/* ── RIGHT: Scan Panel + Activity + Tips ── */}
            <div className="w-full xl:w-60 flex-shrink-0 space-y-4">

              {/* Tap NFC Panel */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm mb-0.5">Tap Your Card</h3>
                <p className="text-red-400 text-[11px] mb-4">Hold your NFC card near the device to scan or write</p>

                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    {isWriting && <>
                      <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" style={{animationDuration:"1.5s"}}/>
                      <div className="absolute inset-3 rounded-full border-2 border-rose-300/30 animate-ping" style={{animationDuration:"2s",animationDelay:"0.3s"}}/>
                    </>}
                    <div className={`absolute inset-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      nfcStatus===NFC.SUCCESS?"border-red-400 bg-red-50":
                      isWriting?"border-red-500 bg-red-50 animate-pulse":
                      "border-red-200 bg-red-50/50"
                    }`}>
                      <Smartphone className={`w-12 h-12 transition-colors ${nfcStatus===NFC.SUCCESS?"text-red-500":isWriting?"text-red-500":"text-red-300"}`}/>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <div className={`flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-full ${
                    nfcStatus===NFC.SUCCESS?"bg-red-50 border-red-300 text-red-600":
                    isWriting?"bg-rose-50 border-rose-300 text-rose-600":
                    "bg-red-50 border-red-200 text-red-600"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${nfcStatus===NFC.SUCCESS?"bg-red-500":isWriting?"bg-rose-500":"bg-red-400"}`}/>
                    {isWriting?"Processing...":nfcStatus===NFC.SUCCESS?"Write Success!":"Ready"}
                  </div>
                </div>

                <p className="text-red-400 text-[10px] font-medium mb-2">Supported Cards</p>
                <div className="flex flex-wrap gap-1">
                  {SUPPORTED_CARDS.map(c => (
                    <span key={c} className="text-[9px] font-medium text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">{c}</span>
                  ))}
                </div>
              </div>

              {/* My Recent Activity */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm mb-3">Recent Activity</h3>
                <div className="space-y-2.5">
                  {activity.map((a,i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${a.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <a.Icon className={`w-3 h-3 ${a.color}`}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-900 text-xs font-medium">{a.label}</div>
                        <div className="text-red-400 text-[10px]">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-red-600"/>
                  </div>
                  <h3 className="text-red-900 font-semibold text-sm">Tips</h3>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Make sure your card is unlocked before rewriting.",
                    "Keep the card still while writing.",
                    "Don't remove the card until writing is complete.",
                    "Some cards can only be written once — check first.",
                  ].map((tip,i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                      <span className="text-red-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHowTo && <HowItWorksModal onClose={()=>setShowHowTo(false)}/>}
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}