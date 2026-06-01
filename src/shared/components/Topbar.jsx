import { useState } from "react";
import { Menu, Search, Sun, Moon, Bell, Globe, Zap, ChevronDown, X } from "lucide-react";

// ─── UNIVERSAL TOPBAR ─────────────────────────────────────────────────────────
// Usage in any page:
//   import Topbar from "../components/Topbar";
//   <Topbar onMenuClick={onMenuClick} />
//
// Optional props:
//   title        – page title shown on mobile (default: none)
//   credits      – credits balance (default: 12,450)
//   userName     – user display name (default: "Arjun Singh")
//   userRole     – user subtitle (default: "Premium User")
//   notifications – badge count (default: 3)
//   onTopUp      – callback for Top Up button
//   onSearch     – callback for search input change
// ─────────────────────────────────────────────────────────────────────────────

export default function Topbar({
  onMenuClick,
  title,
  credits       = "12,450",
  userName      = "Arjun Singh",
  userRole      = "Premium User",
  notifications = 3,
  onTopUp,
  onSearch,
}) {
  const [searchVal,    setSearchVal]    = useState("");
  const [darkMode,     setDarkMode]     = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [userOpen,     setUserOpen]     = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleTopUp = () => {
    onTopUp?.();
  };

  return (
    <header className="h-14 bg-white border-b border-red-100 flex items-center px-3 sm:px-5 gap-2 sm:gap-3 sticky top-0 z-30 shadow-sm">

      {/* ── Mobile hamburger ── */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5"/>
      </button>

      {/* ── Optional mobile page title ── */}
      {title && (
        <span className="lg:hidden text-red-900 font-bold text-sm truncate flex-shrink-0 max-w-[120px]">
          {title}
        </span>
      )}

      {/* ── Search bar ── */}
      <div className={`relative transition-all duration-200 ${searchActive ? "flex-1" : "flex-1 max-w-xs sm:max-w-sm"}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300 pointer-events-none"/>
        <input
          type="text"
          value={searchVal}
          onChange={handleSearch}
          onFocus={()=>setSearchActive(true)}
          onBlur={()=>setSearchActive(false)}
          placeholder="Search..."
          className="w-full bg-red-50 border border-red-200 text-red-900 text-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-400 focus:bg-white placeholder-red-300 transition-all"
        />
        {searchVal && (
          <button
            onClick={()=>{setSearchVal("");onSearch?.("");}}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5"/>
          </button>
        )}
      </div>

      {/* ── Right side icons ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">

        {/* Dark/Light toggle */}
        <button
          onClick={()=>setDarkMode(p=>!p)}
          title={darkMode ? "Switch to Light" : "Switch to Dark"}
          className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 border border-red-200 items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-100 transition-all"
        >
          {darkMode ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={()=>setNotifOpen(p=>!p)}
            className="relative w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-100 transition-all"
          >
            <Bell className="w-4 h-4"/>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={()=>setNotifOpen(false)}/>
              <div className="absolute right-0 top-10 z-50 w-72 bg-white border border-red-100 rounded-xl shadow-2xl shadow-red-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-red-100 bg-red-50">
                  <span className="text-red-900 text-sm font-bold">Notifications</span>
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">{notifications} new</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {[
                    { title:"Card written successfully",    sub:"Business Card · 2 min ago",  dot:"bg-green-500" },
                    { title:"Bulk operation completed",     sub:"250 cards processed · 1h ago",dot:"bg-red-500"   },
                    { title:"New lead captured",            sub:"John Doe · 2h ago",           dot:"bg-rose-500"  },
                  ].map((n,i)=>(
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-colors cursor-pointer border-b border-red-50 last:border-0">
                      <div className={`w-2 h-2 rounded-full ${n.dot} flex-shrink-0 mt-1.5`}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-900 text-xs font-semibold">{n.title}</div>
                        <div className="text-red-400 text-[10px] mt-0.5">{n.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-red-100 bg-red-50">
                  <button onClick={()=>setNotifOpen(false)} className="text-red-600 text-xs font-semibold hover:text-red-800 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Globe / Language */}
        <button
          className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 border border-red-200 items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-100 transition-all"
          title="Language"
        >
          <Globe className="w-4 h-4"/>
        </button>

        {/* ── Credits ── */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 sm:px-3 py-1.5">
          <Zap className="w-3.5 h-3.5 text-red-500 flex-shrink-0"/>
          <span className="text-red-900 text-xs font-bold leading-none hidden xs:inline sm:inline">
            {credits}
          </span>
          <button
            onClick={handleTopUp}
            className="ml-0.5 sm:ml-1 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[10px] font-bold px-2 py-1 rounded-md transition-all shadow-sm shadow-red-200"
          >
            Top Up
          </button>
        </div>

        {/* ── User avatar + dropdown ── */}
        <div className="relative">
          <button
            onClick={()=>setUserOpen(p=>!p)}
            className="flex items-center gap-1.5 sm:gap-2 bg-red-50 border border-red-200 rounded-lg px-2 sm:px-3 py-1.5 hover:bg-red-100 hover:border-red-300 transition-all"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-red-900 text-xs font-semibold leading-none">{userName}</div>
              <div className="text-red-400 text-[10px] leading-none mt-0.5">{userRole}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-red-400 transition-transform hidden sm:block ${userOpen?"rotate-180":""}`}/>
          </button>

          {/* User dropdown */}
          {userOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={()=>setUserOpen(false)}/>
              <div className="absolute right-0 top-11 z-50 w-52 bg-white border border-red-100 rounded-xl shadow-2xl shadow-red-100 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {userName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold leading-tight">{userName}</div>
                      <div className="text-red-100 text-[10px]">{userRole}</div>
                    </div>
                  </div>
                </div>
                {/* Menu items */}
                <div className="py-1">
                  {[
                    { label:"My Profile",    icon:"👤" },
                    { label:"Settings",      icon:"⚙️" },
                    { label:"Billing",       icon:"💳" },
                    { label:"Help & Support",icon:"❓" },
                  ].map(item=>(
                    <button key={item.label} onClick={()=>setUserOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-red-800 text-xs font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-red-100 py-1">
                  <button onClick={()=>setUserOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
                    <span className="text-sm">🚪</span>
                    <span className="text-red-600 text-xs font-semibold">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}