import { useState, useRef } from "react";
import {
  Shield, Settings, Bell, Lock, Globe, Key,
  CheckCircle2, X, AlertTriangle,
  ChevronDown, Save, Eye, EyeOff, RefreshCw,
  Mail, Phone, Monitor, Smartphone,
  UserPlus, Crown, Zap, Clock, Activity,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PLAN_FEATURES = {
  Free:       { credits:"500",    cards:"5",   api:false, bulk:false },
  Basic:      { credits:"3,000",  cards:"25",  api:false, bulk:false },
  Premium:    { credits:"15,000", cards:"100", api:true,  bulk:true  },
  Enterprise: { credits:"Custom", cards:"∞",   api:true,  bulk:true  },
};

const ACTIVITY_LOG = [
  { id:1, action:"Signed in from Mumbai, India",       time:"2 min ago",   type:"security" },
  { id:2, action:"Updated profile photo",              time:"1 hr ago",    type:"profile"  },
  { id:3, action:"Changed email address",              time:"3 hrs ago",   type:"account"  },
  { id:4, action:"API key regenerated",                time:"Yesterday",   type:"security" },
  { id:5, action:"Exported scan analytics report",     time:"Yesterday",   type:"data"     },
  { id:6, action:"Updated notification preferences",   time:"2 days ago",  type:"settings" },
  { id:7, action:"Upgraded to Premium plan",           time:"3 days ago",  type:"billing"  },
];

const LOG_TYPE_STYLES = {
  security: "bg-amber-100 text-amber-700",
  profile:  "bg-blue-100 text-blue-600",
  account:  "bg-red-100 text-red-600",
  data:     "bg-green-100 text-green-700",
  settings: "bg-rose-100 text-rose-600",
  billing:  "bg-purple-100 text-purple-700",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked?"bg-red-600":"bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked?"translate-x-6":"translate-x-1"}`}/>
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
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<AlertTriangle className="w-4 h-4"/>:<Bell className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── COL 1: PROFILE & ACCOUNT ────────────────────────────────────────────────

function ProfileAccount({ showToast }) {
  const [name,    setName]    = useState("Rahul Singh");
  const [email,   setEmail]   = useState("rahul@example.com");
  const [phone,   setPhone]   = useState("+91 98765 43210");
  const [website, setWebsite] = useState("https://rahulsingh.in");
  const [bio,     setBio]     = useState("NFC enthusiast and product manager.");
  const [avatar,  setAvatar]  = useState("RS");
  const fileRef = useRef(null);

  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="space-y-4">

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-lg font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-200">
          {avatar}
        </div>
        <div>
          <button onClick={()=>fileRef.current?.click()}
            className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">
            Change Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={()=>showToast("Photo updated!")}/>
          <p className="text-red-300 text-[10px] mt-1">JPG, PNG up to 2MB</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Full Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" className={inputCls}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Email Address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className={inputCls}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Phone Number</label>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Website</label>
          <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yoursite.com" className={inputCls}/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Bio <span className="text-red-300">(Optional)</span></label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} placeholder="A short bio…"
            className={`${inputCls} resize-none`}/>
        </div>
      </div>

      <button onClick={()=>showToast("Profile saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save Profile
      </button>

      {/* Danger zone */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500"/>Danger Zone
        </h3>
        <div className="space-y-2">
          <button onClick={()=>showToast("Account deactivated. Contact support to reactivate.","error")}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-all">
            Deactivate Account
          </button>
          <button onClick={()=>showToast("A deletion confirmation has been sent to your email.","error")}
            className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COL 2: SECURITY & NOTIFICATIONS ─────────────────────────────────────────

function SecurityNotifications({ showToast }) {
  const [twoFA,       setTwoFA]       = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [scanAlerts,  setScanAlerts]  = useState(true);
  const [weeklyReport,setWeeklyReport]= useState(false);
  const [marketing,   setMarketing]   = useState(false);
  const [showKey,     setShowKey]     = useState(false);
  const [sessions] = useState([
    {device:"Chrome on Windows", loc:"Mumbai, IN",   time:"Active now",  current:true },
    {device:"Safari on iPhone",  loc:"Delhi, IN",    time:"2 hrs ago",   current:false},
    {device:"Chrome on MacBook", loc:"Bangalore, IN",time:"1 day ago",   current:false},
  ]);

  const apiKey = "sk_live_••••••••••••••••••••••••••••••••";
  const apiKeyReal = "sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";

  return (
    <div className="space-y-4">

      {/* Password change */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500"/>Change Password
        </h3>
        <div className="space-y-2">
          {["Current Password","New Password","Confirm New Password"].map(label => (
            <div key={label}>
              <label className="text-red-600 text-xs font-medium block mb-1">{label}</label>
              <input type="password" placeholder="••••••••"
                className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors"/>
            </div>
          ))}
        </div>
        <button onClick={()=>showToast("Password updated!")}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          <Save className="w-4 h-4"/>Update Password
        </button>
      </div>

      {/* 2FA */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500"/>Two-Factor Authentication
        </h3>
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-2">
          <span className="text-red-700 text-sm flex-1">Enable 2FA on my account</span>
          <Toggle checked={twoFA} onChange={v=>{setTwoFA(v);showToast(v?"2FA enabled — you're more secure!":"2FA disabled.",v?"success":"info");}}/>
        </div>
        {twoFA && (
          <p className="text-red-400 text-[11px] leading-relaxed">
            2FA is active. You'll be asked for a verification code each time you sign in.
          </p>
        )}
      </div>

      {/* Notification preferences */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-500"/>Notifications
        </h3>
        <div className="space-y-3">
          {[
            {label:"Login alerts",          val:loginAlerts, set:setLoginAlerts},
            {label:"Card scan alerts",      val:scanAlerts,  set:setScanAlerts },
            {label:"Weekly activity report",val:weeklyReport,set:setWeeklyReport},
            {label:"Product updates & tips",val:marketing,   set:setMarketing  },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-red-700 text-sm flex-1">{item.label}</span>
              <Toggle checked={item.val} onChange={v=>{item.set(v);showToast("Preferences updated.");}}/>
            </div>
          ))}
        </div>
      </div>

      {/* My API Key */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-red-500"/>My API Key
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-2">
            <code className="text-red-700 text-[11px] flex-1 truncate font-mono">
              {showKey ? apiKeyReal : apiKey}
            </code>
            <button onClick={()=>setShowKey(s=>!s)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
              {showKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
            </button>
          </div>
        </div>
        <button onClick={()=>showToast("API key regenerated! Update any active integrations.","info")}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5"/>Regenerate Key
        </button>
      </div>

      {/* Active sessions */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-red-500"/>Active Sessions
        </h3>
        <div className="space-y-2">
          {sessions.map((s,i) => (
            <div key={i} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                {s.device.includes("iPhone") ? <Smartphone className="w-3.5 h-3.5 text-red-600"/> : <Monitor className="w-3.5 h-3.5 text-red-600"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold truncate">{s.device}</div>
                <div className="text-red-400 text-[10px]">{s.loc} · {s.time}</div>
              </div>
              {s.current
                ? <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">This device</span>
                : <button onClick={()=>showToast("Session revoked.","info")} className="text-red-400 hover:text-red-600 text-[10px] font-semibold flex-shrink-0">Revoke</button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COL 3: PLAN & ACTIVITY ───────────────────────────────────────────────────

function PlanActivity({ showToast }) {
  const currentPlan = "Premium";
  const features = PLAN_FEATURES[currentPlan];

  return (
    <div className="space-y-4">

      {/* Current plan */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-red-500"/>My Plan
        </h3>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white mb-3 shadow-lg shadow-red-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold">{currentPlan}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Current plan</span>
          </div>
          <div className="text-white/80 text-xs">{features.credits} credits · {features.cards} cards</div>
          <div className="flex items-center gap-3 mt-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${features.api?"bg-white/25 text-white":"bg-white/10 text-white/40 line-through"}`}>API Access</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${features.bulk?"bg-white/25 text-white":"bg-white/10 text-white/40 line-through"}`}>Bulk Write</span>
          </div>
        </div>

        {/* Plan options */}
        <div className="space-y-2">
          {Object.entries(PLAN_FEATURES).filter(([plan])=>plan!==currentPlan).map(([plan,f]) => (
            <div key={plan} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold">{plan}</div>
                <div className="text-red-400 text-[10px]">{f.credits} credits · {f.cards} cards</div>
              </div>
              <button onClick={()=>showToast(`Redirecting to ${plan} plan checkout…`,"info")}
                className="text-[10px] font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all flex-shrink-0">
                {plan==="Enterprise"?"Contact Sales":plan==="Free"?"Downgrade":"Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage this month */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-red-500"/>Usage This Month
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            {label:"Credits Used",    val:"6,241",  sub:`of ${features.credits}`},
            {label:"Cards Active",    val:"18",     sub:`of ${features.cards}`  },
            {label:"API Calls",       val:"2,104",  sub:"this month"            },
            {label:"NFC Writes",      val:"342",    sub:"total"                 },
          ].map(s => (
            <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              <div className="text-red-900 font-bold text-base">{s.val}</div>
              <div className="text-red-400 text-[10px] mt-0.5">{s.label}</div>
              <div className="text-red-300 text-[9px]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My activity log */}
      <div className="border-t border-red-100 pt-4">
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500"/>My Activity
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {ACTIVITY_LOG.map(l => (
            <div key={l.id} className="flex items-start gap-2.5 p-2.5 bg-red-50/60 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${LOG_TYPE_STYLES[l.type]}`}>{l.type}</span>
              <div className="flex-1 min-w-0">
                <div className="text-red-500 text-[10px] leading-snug">{l.action}</div>
              </div>
              <span className="text-red-300 text-[10px] flex-shrink-0 whitespace-nowrap">{l.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"profile",  label:"Profile",       Icon:Settings },
  { id:"security", label:"Security",      Icon:Shield   },
  { id:"plan",     label:"Plan & Usage",  Icon:Crown    },
];

export default function UserSettingsPage({ onMenuClick }) {
  const [tab,   setTab]   = useState("profile");
  const [toast, setToast] = useState({ msg:"", type:"success" });

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast({msg:""}),3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Settings className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Settings</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage your profile, security and plan</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Col 1: Profile */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="profile"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Profile & Account</h2>
            </div>
            <ProfileAccount showToast={showToast}/>
          </div>

          {/* Col 2: Security & Notifications */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="security"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Security & Notifications</h2>
            </div>
            <SecurityNotifications showToast={showToast}/>
          </div>

          {/* Col 3: Plan & Activity */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab!=="plan"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Plan & Usage</h2>
            </div>
            <PlanActivity showToast={showToast}/>
          </div>

        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}