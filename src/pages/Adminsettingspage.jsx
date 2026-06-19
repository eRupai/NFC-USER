import { useState, useRef } from "react";
import {
  Settings, Shield, Bell, Globe, Key, Save,
  Eye, EyeOff, RefreshCw, CheckCircle2,
  AlertTriangle, X, ChevronDown, Lock, Clock,
  Mail, Phone, Edit3, Camera, User, Trash2,
  Copy, Smartphone,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TIMEZONES = [
  "(UTC+05:30) Chennai, Mumbai",
  "(UTC+00:00) London",
  "(UTC-05:00) Eastern",
  "(UTC-08:00) Pacific",
  "(UTC+08:00) Singapore",
];
const LANGUAGES = ["English (US)","English (UK)","Hindi","German","French","Japanese","Spanish"];

const NOTIFICATION_GROUPS = [
  {
    title: "Card Activity",
    Icon: Smartphone,
    items: [
      { key:"scanAlert",    label:"Notify me when someone scans my card",   checked: true  },
      { key:"writeSuccess", label:"Notify me after a successful card write", checked: true  },
      { key:"writeFail",    label:"Alert me when a card write fails",        checked: true  },
      { key:"weeklyReport", label:"Weekly scan activity report via email",   checked: false },
    ],
  },
  {
    title: "Account & Billing",
    Icon: Bell,
    items: [
      { key:"billingAlert",  label:"Billing and payment reminders",           checked: true  },
      { key:"planExpiry",    label:"Plan expiry alerts (7 days before)",      checked: true  },
      { key:"creditLow",     label:"Alert when credits fall below 10%",       checked: true  },
      { key:"invoiceReady",  label:"Email me when a new invoice is available",checked: false },
    ],
  },
  {
    title: "Security",
    Icon: Shield,
    items: [
      { key:"loginAlert",   label:"Alert on new device login",               checked: true  },
      { key:"passChange",   label:"Notify on password change",               checked: true  },
      { key:"apiUsage",     label:"Alert on unusual API usage",              checked: false },
      { key:"twoFAReminder",label:"Remind me to enable 2FA",                checked: true  },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-red-600" : "bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}/>
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = {
    success: "bg-red-600 border-red-400 text-white",
    error:   "bg-red-800 border-red-600 text-white",
    info:    "bg-rose-600 border-rose-400 text-white",
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type]||s.info}`}>
      {type === "error" ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── PROFILE PANEL ────────────────────────────────────────────────────────────

function ProfilePanel({ showToast }) {
  const [name,     setName]     = useState("Daksh Kumar");
  const [email,    setEmail]    = useState("daksh@example.com");
  const [phone,    setPhone]    = useState("+91 98765 43210");
  const [bio,      setBio]      = useState("NFC enthusiast. Building smart digital cards.");
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [avatar,   setAvatar]   = useState(null);
  const fileRef = useRef();

  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  const sel = `${inp} pr-8 appearance-none cursor-pointer`;

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      showToast("Profile photo updated!");
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 overflow-hidden">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
              : <span className="text-white text-xl font-bold">DK</span>
            }
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-md hover:bg-red-500 transition-colors">
            <Camera className="w-3 h-3 text-white"/>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar}/>
        </div>
        <div>
          <div className="text-red-900 font-bold text-sm">{name}</div>
          <div className="text-red-400 text-xs">{email}</div>
          <button onClick={() => fileRef.current?.click()}
            className="text-red-500 hover:text-red-700 text-[10px] font-semibold mt-0.5 transition-colors">
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
            <input value={name} onChange={e => setName(e.target.value)} className={`${inp} pl-8`}/>
          </div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inp} pl-8`}/>
          </div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400"/>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`${inp} pl-8`}/>
          </div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Timezone</label>
          <div className="relative">
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className={sel}>
              {TIMEZONES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-red-600 text-xs font-semibold block mb-1">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
            className="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors resize-none"/>
        </div>
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Language</label>
          <div className="relative">
            <select value={language} onChange={e => setLanguage(e.target.value)} className={sel}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
          </div>
        </div>
      </div>

      <button onClick={() => showToast("Profile saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save Profile
      </button>

      {/* Danger zone */}
      <div className="border border-red-200 rounded-xl p-3">
        <div className="text-red-700 text-xs font-semibold mb-2">Danger Zone</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => showToast("Export started — check your email.", "info")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Export My Data
          </button>
          <button onClick={() => showToast("Account deletion request submitted.", "error")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5"/>Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SECURITY PANEL ───────────────────────────────────────────────────────────

function SecurityPanel({ showToast }) {
  const [twoFA,        setTwoFA]        = useState(false);
  const [loginAlerts,  setLoginAlerts]  = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [currentPass,  setCurrentPass]  = useState("");
  const [newPass,      setNewPass]      = useState("");
  const [confirmPass,  setConfirmPass]  = useState("");
  const [showKey,      setShowKey]      = useState(false);
  const [copied,       setCopied]       = useState(false);
  const apiKey = "NFC_live_dk_••••••••••8f7a";

  const handleChangePass = () => {
    if (!currentPass || !newPass || !confirmPass) { showToast("Fill in all password fields.", "error"); return; }
    if (newPass !== confirmPass) { showToast("New passwords do not match.", "error"); return; }
    if (newPass.length < 8) { showToast("Password must be at least 8 characters.", "error"); return; }
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    showToast("Password changed successfully!");
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey.replace(/•/g,"x")).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    showToast("API key copied!");
  };

  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="space-y-5">

      {/* Access controls */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500"/>Account Security
        </h3>
        <div className="space-y-0">
          {[
            { label:"Two-Factor Authentication (2FA)", val:twoFA,       set:v => { setTwoFA(v); showToast(v?"2FA enabled — check your authenticator app.":"2FA disabled.","info"); } },
            { label:"Login alerts for new devices",    val:loginAlerts, set:v => { setLoginAlerts(v); showToast(v?"Login alerts on.":"Login alerts off.","info"); } },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-red-50 last:border-0">
              <span className="text-red-700 text-sm">{item.label}</span>
              <Toggle checked={item.val} onChange={item.set}/>
            </div>
          ))}
        </div>
      </div>

      {/* Session */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500"/>Session
        </h3>
        <div>
          <label className="text-red-600 text-xs font-semibold block mb-1">Auto logout after</label>
          <div className="relative">
            <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
              className={`${inp} pr-8 appearance-none cursor-pointer`}>
              {["15","30","60","120","240"].map(v => <option key={v}>{v} minutes</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-red-500"/>Change Password
        </h3>
        <div className="space-y-2.5">
          {[
            { label:"Current Password", val:currentPass, set:setCurrentPass, show:showCurrent, setShow:setShowCurrent },
            { label:"New Password",     val:newPass,     set:setNewPass,     show:showNew,     setShow:setShowNew     },
            { label:"Confirm Password", val:confirmPass, set:setConfirmPass, show:showConfirm, setShow:setShowConfirm },
          ].map(f => (
            <div key={f.label}>
              <label className="text-red-600 text-xs font-semibold block mb-1">{f.label}</label>
              <div className="relative">
                <input type={f.show ? "text" : "password"} value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder="••••••••"
                  className={`${inp} pr-10`}/>
                <button onClick={() => f.setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-700 transition-colors">
                  {f.show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          ))}
        </div>
        {newPass.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                newPass.length < 6 ? "w-1/4 bg-red-500"
                : newPass.length < 10 ? "w-1/2 bg-amber-400"
                : "w-full bg-green-500"
              }`}/>
            </div>
            <span className={`text-[10px] font-semibold ${
              newPass.length < 6 ? "text-red-500" : newPass.length < 10 ? "text-amber-500" : "text-green-600"
            }`}>{newPass.length < 6 ? "Weak" : newPass.length < 10 ? "Fair" : "Strong"}</span>
          </div>
        )}
        <button onClick={handleChangePass}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          <Save className="w-4 h-4"/>Update Password
        </button>
      </div>

      {/* My API key */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-red-500"/>My API Key
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-2">
          <code className="text-red-700 text-[11px] flex-1 truncate font-mono">
            {showKey ? apiKey.replace(/•/g,"x") : apiKey}
          </code>
          <button onClick={() => setShowKey(s => !s)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
            {showKey ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
          <button onClick={handleCopyKey} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
          </button>
        </div>
        <button onClick={() => showToast("API key regenerated! Update your integrations.", "error")}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold py-2.5 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5"/>Regenerate API Key
        </button>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────

function NotificationsPanel({ showToast }) {
  const [groups, setGroups] = useState(NOTIFICATION_GROUPS);
  const [emailDigest, setEmailDigest] = useState("weekly");
  const [pushEnabled, setPushEnabled] = useState(true);

  const toggle = (gi, ii) => {
    setGroups(prev => prev.map((g, gIdx) =>
      gIdx !== gi ? g : {
        ...g,
        items: g.items.map((item, iIdx) =>
          iIdx !== ii ? item : { ...item, checked: !item.checked }
        ),
      }
    ));
    showToast("Preference updated.", "info");
  };

  return (
    <div className="space-y-5">
      {/* Push toggle */}
      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
        <div>
          <div className="text-red-900 text-sm font-semibold">Push Notifications</div>
          <div className="text-red-400 text-[10px] mt-0.5">Allow browser push notifications</div>
        </div>
        <Toggle checked={pushEnabled} onChange={v => { setPushEnabled(v); showToast(v ? "Push notifications enabled." : "Push notifications disabled.", "info"); }}/>
      </div>

      {/* Groups */}
      {groups.map((g, gi) => (
        <div key={g.title}>
          <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
            <g.Icon className="w-4 h-4 text-red-500"/>{g.title}
          </h3>
          <div className="space-y-0">
            {g.items.map((item, ii) => (
              <label key={item.key} className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0 cursor-pointer group">
                <input type="checkbox" checked={item.checked} onChange={() => toggle(gi, ii)}
                  className="w-3.5 h-3.5 accent-red-500 flex-shrink-0"/>
                <span className="text-red-600 text-sm group-hover:text-red-900 transition-colors flex-1">{item.label}</span>
                <Toggle checked={item.checked} onChange={() => toggle(gi, ii)}/>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Email digest */}
      <div>
        <h3 className="text-red-900 text-sm font-semibold mb-3 flex items-center gap-2">
          <Mail className="w-4 h-4 text-red-500"/>Email Digest Frequency
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {["daily","weekly","never"].map(opt => (
            <button key={opt} onClick={() => { setEmailDigest(opt); showToast(`Email digest set to ${opt}.`, "info"); }}
              className={`py-2 rounded-xl border text-xs font-semibold transition-all capitalize ${
                emailDigest === opt
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-200"
                  : "bg-white border-red-200 text-red-500 hover:border-red-400"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => showToast("Notification preferences saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save Preferences
      </button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"profile",       label:"Profile",       Icon: User    },
  { id:"security",      label:"Security",      Icon: Shield  },
  { id:"notifications", label:"Notifications", Icon: Bell    },
];

export default function UserSettingsPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("profile");
  const [toast, setToast] = useState({ msg:"", type:"success" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"" }), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} navigate={navigate}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Settings className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Settings</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage your profile, security and notification preferences</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-red-400 text-xs">Daksh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">DK</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"
              }`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* ── 3-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Profile */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "profile" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">My Profile</h2>
            </div>
            <ProfilePanel showToast={showToast}/>
          </div>

          {/* Security */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "security" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Security</h2>
            </div>
            <SecurityPanel showToast={showToast}/>
          </div>

          {/* Notifications */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "notifications" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Notifications</h2>
            </div>
            <NotificationsPanel showToast={showToast}/>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:"" })}/>
    </div>
  );
}