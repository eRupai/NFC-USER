import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search, Sun, Moon, Bell, Globe, Zap, ChevronDown, X,
  User, Settings, CreditCard, HelpCircle, LogOut,
  Camera, Mail, Phone, Shield, Crown, Edit3, Save,
  CheckCircle2, Clock, Radio, Package, AlertTriangle,
  ArrowUpRight, Star,
} from "lucide-react";

function Portal({ children }) {
  return createPortal(children, document.body);
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────

function ProfileModal({ userName, userRole, onClose }) {
  const [tab, setTab]         = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [form, setForm]       = useState({
    name:    userName,
    role:    userRole,
    email:   "arjun.singh@example.com",
    phone:   "+91 98765 43210",
    company: "NFC Solutions Inc.",
    bio:     "NFC enthusiast & product manager.",
  });
  const [draft, setDraft]     = useState({ ...form });
  const fileRef               = useRef();
  const [avatar, setAvatar]   = useState(null);

  const handleSave = () => {
    setForm({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e) => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onload = ev => setAvatar(ev.target.result); r.readAsDataURL(f); }
  };

  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  const TABS = [
    { id: "profile",   label: "Profile",  Icon: User     },
    { id: "security",  label: "Security", Icon: Shield   },
    { id: "activity",  label: "Activity", Icon: Clock    },
  ];

  const ACTIVITY = [
    { Icon: Radio,   text: "Wrote URL card",          time: "2 min ago",   color: "bg-green-500"  },
    { Icon: Package, text: "Bulk operation (10 cards)",time: "1 hr ago",    color: "bg-amber-500"  },
    { Icon: Radio,   text: "Wrote vCard",              time: "3 hrs ago",   color: "bg-red-500"    },
    { Icon: Radio,   text: "Wrote WiFi card",          time: "Yesterday",   color: "bg-rose-500"   },
    { Icon: Package, text: "Bulk operation (5 cards)", time: "2 days ago",  color: "bg-amber-500"  },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-red-100 overflow-hidden">

        {/* Header banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 pt-5 pb-14 relative">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-sm">My Profile</span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute -bottom-0.5 left-0 right-0 h-6 bg-white rounded-t-2xl" />
        </div>

        {/* Avatar */}
        <div className="px-5 -mt-10 flex items-end justify-between mb-3 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {avatar
                ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                : <span className="text-white text-2xl font-bold">{form.name.charAt(0)}</span>
              }
            </div>
            <button onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 border-2 border-white flex items-center justify-center shadow-md transition-all">
              <Camera className="w-2.5 h-2.5 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full">
              <Crown className="w-3 h-3" />Premium
            </span>
            {!editing
              ? <button onClick={() => { setEditing(true); setDraft({ ...form }); }}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-red-200">
                  <Edit3 className="w-3 h-3" />Edit
                </button>
              : <button onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm">
                  <Save className="w-3 h-3" />Save
                </button>
            }
          </div>
        </div>

        {saved && (
          <div className="mx-5 mb-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />Profile saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-red-100 px-5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 py-4 max-h-72 overflow-y-auto">

          {tab === "profile" && (
            <div className="space-y-3">
              {editing ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-red-600 text-[11px] font-medium block mb-1">Full Name</label>
                      <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} className={inp} />
                    </div>
                    <div>
                      <label className="text-red-600 text-[11px] font-medium block mb-1">Phone</label>
                      <input value={draft.phone} onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className="text-red-600 text-[11px] font-medium block mb-1">Email</label>
                    <input type="email" value={draft.email} onChange={e => setDraft(p => ({ ...p, email: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="text-red-600 text-[11px] font-medium block mb-1">Company</label>
                    <input value={draft.company} onChange={e => setDraft(p => ({ ...p, company: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="text-red-600 text-[11px] font-medium block mb-1">Bio</label>
                    <textarea value={draft.bio} onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))} rows={2}
                      className={`${inp} resize-none`} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-red-900 font-bold text-base">{form.name}</div>
                    <div className="text-red-400 text-xs">{form.role}</div>
                    {form.bio && <div className="text-red-600 text-xs mt-1 leading-relaxed">{form.bio}</div>}
                  </div>
                  <div className="space-y-0">
                    {[
                      { Icon: Mail,   label: "Email",   val: form.email   },
                      { Icon: Phone,  label: "Phone",   val: form.phone   },
                      { Icon: User,   label: "Company", val: form.company },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0">
                        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <r.Icon className="w-3.5 h-3.5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-red-400 text-[10px]">{r.label}</div>
                          <div className="text-red-900 text-xs font-medium">{r.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[{ val: "2,456", label: "Scans" }, { val: "20", label: "Cards" }, { val: "4.9★", label: "Rating" }].map(s => (
                      <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-2 text-center">
                        <div className="text-red-900 font-bold text-sm">{s.val}</div>
                        <div className="text-red-400 text-[10px]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-3">
              {[
                { Icon: Shield,      label: "Two-Factor Auth",    val: "Enabled",            color: "text-green-600", badge: "bg-green-100 text-green-700 border-green-200" },
                { Icon: CreditCard,  label: "Active Sessions",    val: "2 devices",          color: "text-amber-600", badge: "bg-amber-100 text-amber-700 border-amber-200" },
                { Icon: CheckCircle2,label: "Last Login",         val: "Today, 9:43 AM",     color: "text-red-500",   badge: "bg-red-50 text-red-500 border-red-200"        },
                { Icon: AlertTriangle,label: "Password Strength", val: "Strong",             color: "text-green-600", badge: "bg-green-100 text-green-700 border-green-200" },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center flex-shrink-0">
                    <r.Icon className={`w-4 h-4 ${r.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-red-900 text-xs font-semibold">{r.label}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badge}`}>{r.val}</span>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200 mt-2">
                <Settings className="w-3.5 h-3.5" />Manage Security Settings
              </button>
            </div>
          )}

          {tab === "activity" && (
            <div className="space-y-2">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-red-50/50 border border-red-100 rounded-xl">
                  <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <a.Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-red-700 text-xs flex-1 font-medium">{a.text}</span>
                  <span className="text-red-400 text-[10px] flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-2 border-t border-red-100">
          <button onClick={onClose}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-xl transition-all">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN TOPBAR ──────────────────────────────────────────────────────────────

export default function Topbar({
  credits        = "12,450",
  userName       = "Arjun Singh",
  userRole       = "Premium User",
  notifications  = 3,
  onTopUp,
  onSearch,
  onMenuClick,
  navigate,        // ← pass setActiveItem from parent
}) {
  const [searchVal,     setSearchVal]     = useState("");
  const [darkMode,      setDarkMode]      = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [userOpen,      setUserOpen]      = useState(false);
  const [searchActive,  setSearchActive]  = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);

  const notifBtnRef = useRef(null);
  const userBtnRef  = useRef(null);
  const [notifRect,  setNotifRect]  = useState(null);
  const [userRect,   setUserRect]   = useState(null);

  const openNotif = () => {
    if (notifBtnRef.current) setNotifRect(notifBtnRef.current.getBoundingClientRect());
    setNotifOpen(v => !v); setUserOpen(false);
  };
  const openUser = () => {
    if (userBtnRef.current) setUserRect(userBtnRef.current.getBoundingClientRect());
    setUserOpen(v => !v); setNotifOpen(false);
  };

  // Helper: close dropdown then navigate
  const go = (route) => { setUserOpen(false); setNotifOpen(false); if (navigate) { navigate(route); } else { window.dispatchEvent(new CustomEvent("nfc:navigate", { detail: route })); } };

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") { setNotifOpen(false); setUserOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const USER_MENU = [
    { label: "My Profile",     Icon: User,        action: () => { setUserOpen(false); setProfileOpen(true); }, color: "text-red-800", badge: null },
    { label: "Settings",       Icon: Settings,    action: () => go("admin-settings"),                         color: "text-red-800", badge: null },
    { label: "Billing",        Icon: CreditCard,  action: () => go("admin-billing"),                          color: "text-red-800", badge: null },
    { label: "Help & Support", Icon: HelpCircle,  action: () => go("admin-help"),                             color: "text-red-800", badge: null },
  ];

  return (
    <>
      <header className="h-14 bg-white border-b border-red-100 flex items-center px-3 sm:px-5 gap-2 sm:gap-3 sticky top-0 z-30 shadow-sm pl-16 lg:pl-5">

        {/* Search */}
        <div className={`relative transition-all duration-200 ${searchActive ? "flex-1" : "flex-1 max-w-xs sm:max-w-sm"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300 pointer-events-none" />
          <input type="text" value={searchVal} onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value); }}
            onFocus={() => setSearchActive(true)} onBlur={() => setSearchActive(false)}
            placeholder="Search..."
            className="w-full bg-red-50 border border-red-200 text-red-900 text-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-400 focus:bg-white placeholder-red-300 transition-all" />
          {searchVal && (
            <button onClick={() => { setSearchVal(""); onSearch?.(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">

          {/* Dark toggle */}
          <button onClick={() => setDarkMode(p => !p)} title={darkMode ? "Light mode" : "Dark mode"}
            className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 border border-red-200 items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-100 transition-all">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Bell */}
          <button ref={notifBtnRef} onClick={openNotif}
            className={`relative w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${notifOpen ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-200" : "bg-red-50 border-red-200 text-red-400 hover:text-red-700 hover:bg-red-100"}`}>
            <Bell className="w-4 h-4" />
            {notifications > 0 && !notifOpen && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm border-2 border-white">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Globe */}
          <button className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 border border-red-200 items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-100 transition-all" title="Language">
            <Globe className="w-4 h-4" />
          </button>

          {/* Credits */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 sm:px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="text-red-900 text-xs font-bold leading-none hidden sm:inline">{credits}</span>
            <button onClick={() => { onTopUp?.(); go("wallet"); }}
              className="ml-0.5 sm:ml-1 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[10px] font-bold px-2 py-1 rounded-md transition-all shadow-sm shadow-red-200">
              Top Up
            </button>
          </div>

          {/* User button */}
          <button ref={userBtnRef} onClick={openUser}
            className="flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 rounded-lg px-2 sm:px-3 py-1.5 hover:bg-red-100 hover:border-red-300 transition-all">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-red-900 text-xs font-semibold leading-none">{userName}</div>
              <div className="text-red-400 text-[10px] leading-none mt-0.5">{userRole}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-red-400 transition-transform hidden sm:block ${userOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </header>

      {/* Notification dropdown */}
      {notifOpen && notifRect && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setNotifOpen(false)} />
          <div style={{ position:"fixed", top:notifRect.bottom+8, right:window.innerWidth-notifRect.right, zIndex:99999, width:288 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-red-100 rounded-2xl shadow-2xl shadow-red-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-red-100 bg-gradient-to-r from-red-600 to-rose-600">
              <span className="text-white text-sm font-bold">Notifications</span>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">{notifications} new</span>
            </div>
            <ul className="divide-y divide-red-50 max-h-64 overflow-y-auto">
              {[
                { title:"Card written successfully",  sub:"Business Card · 2 min ago",   dot:"bg-green-500" },
                { title:"Bulk operation completed",   sub:"10 cards processed · 1h ago", dot:"bg-amber-500" },
                { title:"New lead captured",          sub:"John Doe · 2h ago",           dot:"bg-red-500"   },
              ].map((n,i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${n.dot} flex-shrink-0 mt-1.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-red-900 text-xs font-semibold leading-tight">{n.title}</p>
                    <p className="text-red-400 text-[10px] mt-0.5">{n.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 border-t border-red-100 bg-red-50 text-center">
              <button onClick={() => { setNotifOpen(false); go("activity-logs"); }} className="text-red-600 text-xs font-bold hover:text-red-800 transition-colors">
                View all notifications →
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* User dropdown */}
      {userOpen && userRect && (
        <Portal>
          <div className="fixed inset-0 z-[99998]" onClick={() => setUserOpen(false)} />
          <div style={{ position:"fixed", top:userRect.bottom+8, right:window.innerWidth-userRect.right, zIndex:99999, width:220 }}
            onClick={e => e.stopPropagation()}
            className="bg-white border border-red-100 rounded-xl shadow-2xl shadow-red-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2 border-white/30">
                  {userName.charAt(0)}
                </div>
                <div>
                  <div className="text-white text-sm font-bold leading-tight">{userName}</div>
                  <div className="text-red-100 text-[10px] flex items-center gap-1"><Crown className="w-3 h-3 text-amber-300" />{userRole}</div>
                </div>
              </div>
            </div>
            {/* Credits mini */}
            <button onClick={() => go("wallet")} className="w-full px-4 py-2.5 bg-red-50 border-b border-red-100 flex items-center justify-between hover:bg-red-100 transition-colors">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-900 text-xs font-bold">{credits} credits</span>
              </div>
              <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 font-bold px-2 py-0.5 rounded-full">Active</span>
            </button>
            {/* Menu items */}
            <div className="py-1">
              {USER_MENU.map(item => (
                <button key={item.label} onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left group">
                  <div className="w-7 h-7 rounded-lg bg-red-100 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-colors">
                    <item.Icon className="w-3.5 h-3.5 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-red-300 group-hover:text-red-600 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
            {/* Sign out */}
            <div className="border-t border-red-100 py-1">
              <button onClick={() => setUserOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left group">
                <div className="w-7 h-7 rounded-lg bg-red-100 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-colors">
                  <LogOut className="w-3.5 h-3.5 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-red-600 text-xs font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <ProfileModal userName={userName} userRole={userRole} onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}