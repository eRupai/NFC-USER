import { useState, useRef } from "react";
import {
  Menu, Search, Sun, Bell, Zap, User, Lock, Shield, Monitor,
  Smartphone, Mail, Phone, Globe, Clock, Volume2, Eye, EyeOff,
  CheckCircle2, X, Camera, ChevronRight, ChevronDown, Save,
  Key, AlertTriangle, Radio, Activity, Settings,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  "United States","United Kingdom","India","Canada","Australia",
  "Germany","France","Japan","Brazil","UAE","Singapore","Netherlands",
];
const TIMEZONES = [
  "(UTC-08:00) Pacific Time","(UTC-07:00) Mountain Time",
  "(UTC-06:00) Central Time","(UTC-05:00) Eastern Time",
  "(UTC+00:00) London, Dublin","(UTC+01:00) Berlin, Paris",
  "(UTC+05:30) Chennai, Mumbai","(UTC+08:00) Beijing, Singapore",
  "(UTC+09:00) Tokyo, Seoul","(UTC+10:00) Sydney, Melbourne",
];
const EMAIL_NOTIFS = [
  {key:"cardActivity",  label:"Card Activity",       Icon:Radio    },
  {key:"leadCaptures",  label:"Lead Captures",        Icon:User     },
  {key:"bulkOps",       label:"Bulk Operations",      Icon:Activity },
  {key:"systemUpdates", label:"System Updates",       Icon:Settings },
  {key:"promotions",    label:"Promotions & Offers",  Icon:Bell     },
];
const INAPP_NOTIFS = [
  {key:"cardScans",      label:"Card Scans",               Icon:Radio      },
  {key:"newLeads",       label:"New Leads",                Icon:User       },
  {key:"systemAlerts",   label:"System Alerts",            Icon:Bell       },
  {key:"securityAlerts", label:"Security Alerts",          Icon:Shield     },
  {key:"announcements",  label:"Updates & Announcements",  Icon:Activity   },
];
const NOTIF_CHART = [
  {day:"Mon",email:12,inapp:28},{day:"Tue",email:18,inapp:35},
  {day:"Wed",email:9,inapp:22},{day:"Thu",email:24,inapp:41},
  {day:"Fri",email:15,inapp:30},{day:"Sat",email:6,inapp:14},{day:"Sun",email:10,inapp:19},
];

const TOOLTIP_STYLE = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked?"bg-red-600":"bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked?"translate-x-6":"translate-x-1"}`}/>
    </button>
  );
}

function PasswordInput({ label, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-red-600 text-xs font-medium block mb-1">{label}</label>
      <div className="relative">
        <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)}
          className={`w-full bg-red-50 border ${error?"border-red-500":"border-red-200"} text-red-900 text-sm px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`}/>
        <button onClick={()=>setShow(s=>!s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-700 transition-colors">
          {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
        </button>
      </div>
      {error&&<p className="text-red-500 text-[10px] mt-1">{error}</p>}
    </div>
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
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<AlertTriangle className="w-4 h-4"/>:<Bell className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SettingsPage({ onMenuClick }) {
  const [tab,  setTab]  = useState("profile");
  const [toast,setToast]= useState({msg:"",type:"success"});
  const showToast = (msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:""}),3000);};

  // ── Profile ──
  const [avatar,         setAvatar]         = useState(null);
  const avatarRef = useRef();
  const [profile,        setProfile]        = useState({
    name:"John Doe", email:"john.doe@example.com", phone:"+1 (555) 123-4567",
    company:"NFC Solutions Inc.", website:"https://www.nfcsolutions.com",
    country:"United States", timezone:"(UTC-05:00) Eastern Time",
  });
  const [profileErrors,  setProfileErrors]  = useState({});

  const validateProfile = () => {
    const e={};
    if (!profile.name.trim())  e.name ="Name is required";
    if (!profile.email.trim()) e.email="Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) e.email="Invalid email";
    if (!profile.phone.trim()) e.phone="Phone is required";
    return e;
  };
  const handleSaveProfile = () => {
    const e=validateProfile(); setProfileErrors(e);
    if (!Object.keys(e).length) showToast("Profile saved successfully!");
    else showToast("Please fix the errors above.","error");
  };
  const handleAvatarChange = (ev) => {
    const f=ev.target.files[0];
    if (f){const r=new FileReader();r.onload=e=>setAvatar(e.target.result);r.readAsDataURL(f);}
  };

  // ── Security ──
  const [passwords,  setPasswords]  = useState({current:"",newPass:"",confirm:""});
  const [passErrors, setPassErrors] = useState({});
  const [twoFA,      setTwoFA]      = useState(true);
  const [sessions,   setSessions]   = useState([
    {id:1,device:"Windows · Chrome", location:"New York, USA",      time:null,                    current:true},
    {id:2,device:"iPhone 14 · Safari",location:"San Francisco, USA",time:"May 31, 2025 10:30 AM", current:false},
  ]);

  const validatePasswords = () => {
    const e={};
    if (!passwords.current)               e.current="Required";
    if (!passwords.newPass||passwords.newPass.length<8) e.newPass="Min 8 characters";
    if (passwords.newPass!==passwords.confirm)          e.confirm="Passwords don't match";
    return e;
  };
  const handleUpdatePassword = () => {
    const e=validatePasswords(); setPassErrors(e);
    if (!Object.keys(e).length){setPasswords({current:"",newPass:"",confirm:""});showToast("Password updated!");}
    else showToast("Fix password errors.","error");
  };

  // ── Notifications ──
  const [emailNotifs, setEmailNotifs] = useState({cardActivity:true,leadCaptures:true,bulkOps:true,systemUpdates:true,promotions:false});
  const [inAppNotifs, setInAppNotifs] = useState({cardScans:true,newLeads:true,systemAlerts:true,securityAlerts:true,announcements:false});
  const [notifSound,  setNotifSound]  = useState(true);
  const [vibration,   setVibration]   = useState(true);
  const [quietModal,  setQuietModal]  = useState(false);
  const [quietFrom,   setQuietFrom]   = useState("22:00");
  const [quietTo,     setQuietTo]     = useState("07:00");
  const [quietHours,  setQuietHours]  = useState("10:00 PM – 07:00 AM");

  const handleSaveQuietHours = () => {
    const fmt=t=>{const[h,m]=t.split(":");const hr=parseInt(h);return`${hr%12||12}:${m} ${hr<12?"AM":"PM"}`;};
    setQuietHours(`${fmt(quietFrom)} – ${fmt(quietTo)}`);
    setQuietModal(false); showToast("Quiet hours updated!");
  };

  // ── Shared input style ──
  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  const selCls   = `${inputCls} pr-8 appearance-none cursor-pointer`;

  const TABS = [
    {id:"profile",       label:"Profile",       Icon:User   },
    {id:"security",      label:"Security",      Icon:Lock   },
    {id:"notifications", label:"Notifications", Icon:Bell   },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title + tabs */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Settings className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Settings</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage your account preferences</p>
          </div>
        </div>

        {/* Tabs — horizontal scroll on mobile */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* ── 3-col grid → stacked mobile ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── 1. Profile ── */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="profile"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Profile Settings</h2>
            </div>

            {/* Avatar row */}
            <div className="mb-5">
              <label className="text-red-600 text-xs font-medium block mb-3">Profile Picture</label>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 border-2 border-red-200 overflow-hidden flex items-center justify-center shadow-lg shadow-red-100">
                    {avatar?<img src={avatar} alt="" className="w-full h-full object-cover"/>:<span className="text-white text-2xl font-bold">{profile.name[0]}</span>}
                  </div>
                  <button onClick={()=>avatarRef.current.click()}
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 border-2 border-white flex items-center justify-center transition-colors shadow-md">
                    <Camera className="w-3 h-3 text-white"/>
                  </button>
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-red-600 text-xs font-medium block mb-1">Full Name</label>
                    <input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}
                      className={`${inputCls}${profileErrors.name?" border-red-500":""}`}/>
                    {profileErrors.name&&<p className="text-red-500 text-[10px] mt-1">{profileErrors.name}</p>}
                  </div>
                  <div>
                    <label className="text-red-600 text-xs font-medium block mb-1">Email Address</label>
                    <input type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}
                      className={`${inputCls}${profileErrors.email?" border-red-500":""}`}/>
                    {profileErrors.email&&<p className="text-red-500 text-[10px] mt-1">{profileErrors.email}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-red-900 text-sm font-semibold mb-3">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
                    <input type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}
                      className={`${inputCls} pl-8${profileErrors.phone?" border-red-500":""}`}/>
                  </div>
                  {profileErrors.phone&&<p className="text-red-500 text-[10px] mt-1">{profileErrors.phone}</p>}
                </div>
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Company Name</label>
                  <input value={profile.company} onChange={e=>setProfile(p=>({...p,company:e.target.value}))} className={inputCls}/>
                </div>
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
                    <input type="url" value={profile.website} onChange={e=>setProfile(p=>({...p,website:e.target.value}))}
                      className={`${inputCls} pl-8`}/>
                  </div>
                </div>
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Country</label>
                  <div className="relative">
                    <select value={profile.country} onChange={e=>setProfile(p=>({...p,country:e.target.value}))} className={selCls}>
                      {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
                  </div>
                </div>
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
                    <select value={profile.timezone} onChange={e=>setProfile(p=>({...p,timezone:e.target.value}))}
                      className={`${selCls} pl-8`}>
                      {TIMEZONES.map(t=><option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSaveProfile}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
              <Save className="w-4 h-4"/>Save Changes
            </button>
          </div>

          {/* ── 2. Security ── */}
          <div className={`space-y-4 transition-opacity ${tab!=="security"?"lg:opacity-40 lg:pointer-events-none":""}`}>

            {/* Change Password */}
            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-red-600"/>
                </div>
                <h2 className="text-red-900 font-bold text-base">Change Password</h2>
              </div>
              <div className="space-y-3 mb-4">
                <PasswordInput label="Current Password"      value={passwords.current} onChange={v=>setPasswords(p=>({...p,current:v}))} error={passErrors.current}/>
                <PasswordInput label="New Password"          value={passwords.newPass} onChange={v=>setPasswords(p=>({...p,newPass:v}))} error={passErrors.newPass}/>
                <PasswordInput label="Confirm New Password"  value={passwords.confirm} onChange={v=>setPasswords(p=>({...p,confirm:v}))} error={passErrors.confirm}/>
                {passwords.newPass && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-400 text-[10px]">Password Strength</span>
                      <span className={`text-[10px] font-semibold ${passwords.newPass.length<6?"text-red-500":passwords.newPass.length<10?"text-amber-500":"text-green-600"}`}>
                        {passwords.newPass.length<6?"Weak":passwords.newPass.length<10?"Medium":"Strong"}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3].map(i=>(
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${
                          i===1?(passwords.newPass.length>=1?passwords.newPass.length<6?"bg-red-500":passwords.newPass.length<10?"bg-amber-400":"bg-green-500":"bg-red-100"):
                          i===2?(passwords.newPass.length>=6?passwords.newPass.length<10?"bg-amber-400":"bg-green-500":"bg-red-100"):
                                (passwords.newPass.length>=10?"bg-green-500":"bg-red-100")
                        }`}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleUpdatePassword}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
                <Key className="w-4 h-4"/>Update Password
              </button>
            </div>

            {/* Two-Factor Auth */}
            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-red-600"/>
                </div>
                <h2 className="text-red-900 font-bold text-base">Two-Factor Authentication</h2>
              </div>
              <p className="text-red-400 text-xs mb-4">Add an extra layer of security to your account.</p>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-red-400 text-xs mb-0.5">Status</div>
                  <div className={`text-sm font-bold ${twoFA?"text-green-600":"text-red-500"}`}>{twoFA?"Enabled":"Disabled"}</div>
                </div>
                <Toggle checked={twoFA} onChange={v=>{setTwoFA(v);showToast(v?"2FA enabled.":"2FA disabled.",v?"success":"info");}}/>
              </div>
              {twoFA && (
                <button onClick={()=>showToast("2FA management would open here.","info")}
                  className="w-full mt-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2 rounded-lg transition-all">
                  Manage 2FA Settings
                </button>
              )}
            </div>

            {/* Active Sessions */}
            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-red-600"/>
                </div>
                <h2 className="text-red-900 font-bold text-base">Active Sessions</h2>
              </div>
              <p className="text-red-400 text-xs mb-4">Devices currently signed into your account.</p>
              <div className="space-y-2">
                {sessions.map(s=>(
                  <div key={s.id} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {s.device.includes("iPhone")||s.device.includes("Android")
                        ?<Smartphone className="w-4 h-4 text-red-500"/>
                        :<Monitor className="w-4 h-4 text-red-500"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-red-900 text-xs font-semibold truncate">{s.device}</div>
                      <div className="text-red-400 text-[10px]">{s.location}</div>
                      {s.time&&<div className="text-red-300 text-[10px]">{s.time}</div>}
                    </div>
                    {s.current
                      ?<span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">Current</span>
                      :<button onClick={()=>{setSessions(p=>p.filter(x=>x.id!==s.id));showToast("Session removed.");}}
                          className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-300 hover:bg-red-200 px-2 py-0.5 rounded-full flex-shrink-0 transition-colors">Remove</button>
                    }
                  </div>
                ))}
                {!sessions.length&&<p className="text-red-300 text-xs text-center py-4">No other active sessions.</p>}
              </div>
            </div>
          </div>

          {/* ── 3. Notifications ── */}
          <div className={`space-y-4 transition-opacity ${tab!=="notifications"?"lg:opacity-40 lg:pointer-events-none":""}`}>

            <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-red-600"/>
                </div>
                <h2 className="text-red-900 font-bold text-base">Notification Settings</h2>
              </div>

              {/* Email Notifications */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-red-500"/>
                  <h3 className="text-red-900 text-sm font-semibold">Email Notifications</h3>
                </div>
                <div className="space-y-3">
                  {EMAIL_NOTIFS.map(n=>(
                    <div key={n.key} className="flex items-center gap-3">
                      <n.Icon className="w-4 h-4 text-red-400 flex-shrink-0"/>
                      <span className="text-red-700 text-sm flex-1">{n.label}</span>
                      <Toggle checked={emailNotifs[n.key]} onChange={v=>setEmailNotifs(p=>({...p,[n.key]:v}))}/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-red-100 pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-4 h-4 text-red-500"/>
                  <h3 className="text-red-900 text-sm font-semibold">In-App Notifications</h3>
                </div>
                <div className="space-y-3">
                  {INAPP_NOTIFS.map(n=>(
                    <div key={n.key} className="flex items-center gap-3">
                      <n.Icon className="w-4 h-4 text-red-400 flex-shrink-0"/>
                      <span className="text-red-700 text-sm flex-1">{n.label}</span>
                      <Toggle checked={inAppNotifs[n.key]} onChange={v=>setInAppNotifs(p=>({...p,[n.key]:v}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-red-100 pt-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-red-500"/>
                  <h3 className="text-red-900 text-sm font-semibold">Preferences</h3>
                </div>
                <div className="space-y-1">
                  {[
                    {Icon:Clock,   label:"Quiet Hours",         val:quietHours,                                     onClick:()=>setQuietModal(true)},
                    {Icon:Volume2, label:"Notification Sound",  val:notifSound?"Enabled":"Disabled",               onClick:()=>{setNotifSound(s=>!s);showToast(`Sound ${!notifSound?"enabled":"disabled"}.`);}},
                    {Icon:Activity,label:"Vibration",           val:vibration?"Enabled":"Disabled",                onClick:()=>{setVibration(s=>!s);showToast(`Vibration ${!vibration?"enabled":"disabled"}.`);}},
                  ].map(r=>(
                    <button key={r.label} onClick={r.onClick}
                      className="w-full flex items-center gap-3 hover:bg-red-50 rounded-lg px-2 py-2 transition-colors group">
                      <r.Icon className="w-4 h-4 text-red-400 flex-shrink-0"/>
                      <span className="text-red-700 text-sm flex-1 text-left">{r.label}</span>
                      <span className={`text-xs font-medium ${r.val==="Enabled"?"text-green-600":r.val==="Disabled"?"text-red-400":"text-red-600"}`}>{r.val}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-red-300 group-hover:text-red-600 transition-colors"/>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification activity chart */}
              <div className="border-t border-red-100 pt-4">
                <p className="text-red-700 text-xs font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-red-500"/>Notification Activity This Week
                </p>
                <div className="flex gap-3 mb-1">
                  {[{l:"Email",c:"#ef4444"},{l:"In-App",c:"#fca5a5"}].map(s=>(
                    <div key={s.l} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                      <span className="text-red-400 text-[10px]">{s.l}</span>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={NOTIF_CHART} margin={{top:2,right:2,left:-30,bottom:0}} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                    <XAxis dataKey="day" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TOOLTIP_STYLE} itemStyle={{color:"#ef4444"}}/>
                    <Bar dataKey="email" name="Email"  stackId="a" fill="#ef4444" radius={[0,0,0,0]}/>
                    <Bar dataKey="inapp" name="In-App" stackId="a" fill="#fca5a5" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button onClick={()=>showToast("Notification preferences saved!")}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
                <Save className="w-4 h-4"/>Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quiet Hours Modal ── */}
      {quietModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500"/>Set Quiet Hours
              </h3>
              <button onClick={()=>setQuietModal(false)} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <p className="text-red-400 text-xs mb-4">Notifications will be silenced during these hours.</p>
            <div className="space-y-3 mb-5">
              {[{label:"From",val:quietFrom,set:setQuietFrom},{label:"To",val:quietTo,set:setQuietTo}].map(f=>(
                <div key={f.label}>
                  <label className="text-red-600 text-xs font-medium block mb-1">{f.label}</label>
                  <input type="time" value={f.val} onChange={e=>f.set(e.target.value)} className={inputCls}/>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setQuietModal(false)} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
              <button onClick={handleSaveQuietHours} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">Save</button>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}