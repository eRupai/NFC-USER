import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, ChevronUp, Zap, Crown, ArrowRight, X, Radio, Settings,
} from "lucide-react";

// ─── NAV CONFIG (inline for self-contained example) ──────────────────────────
// Replace with your actual import: import { NAV, MOBILE_RAIL } from "../shared/constants/navConfig";
import { NAV, MOBILE_RAIL } from "../shared/constants/navConfig";

// ─── FULL SIDEBAR CONTENT ────────────────────────────────────────────────────

function SidebarContent({ activeItem, setActiveItem, onClose }) {
  const [expanded, setExpanded] = useState({
    templates:        true,
    wallet:           true,
    "scan-analytics": false,
    leads:            false,
    subscription:     false,
    api:              false,
    "activity-logs":  false,
  });

  const toggle   = (id)   => setExpanded(p => ({ ...p, [id]: !p[id] }));
  const isActive = (item) =>
    activeItem === item.id ||
    (item.children && item.children.some(c => c.id === activeItem));

  const handleNavClick   = (item) => {
    if (item.children) { toggle(item.id); setActiveItem(item.id); }
    else { setActiveItem(item.id); onClose?.(); }
  };
  const handleChildClick = (id) => { setActiveItem(id); onClose?.(); };

  return (
    <aside className="w-60 h-full bg-white border-r border-red-100 flex flex-col shadow-xl shadow-red-50">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-red-100 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-red-600 to-rose-600">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">NFC Writer</div>
            <div className="text-red-100 text-[10px]">Tap. Write. Connect.</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-red-200">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-red-300 text-[9px] font-bold tracking-widest uppercase px-2 mb-1.5">
              {section}
            </p>
            <ul className="space-y-0.5">
              {items.map(item => {
                const Icon   = item.icon;
                const active = isActive(item);
                const isOpen = expanded[item.id];

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all ${
                        active && !item.children
                          ? "bg-red-600 text-white shadow-md shadow-red-200"
                          : active && item.children
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "text-red-500 hover:text-red-800 hover:bg-red-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[8px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        isOpen
                          ? <ChevronUp   className="w-3 h-3 flex-shrink-0 opacity-60" />
                          : <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
                      )}
                    </button>

                    {item.children && isOpen && (
                      <ul className="mt-0.5 ml-4 space-y-0.5 border-l-2 border-red-100 pl-3">
                        {item.children.map(child => (
                          <li key={child.label}>
                            <button
                              onClick={() => handleChildClick(child.id)}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition-all ${
                                activeItem === child.id
                                  ? "text-red-700 font-semibold bg-red-50"
                                  : "text-red-400 hover:text-red-700 hover:bg-red-50"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                                activeItem === child.id ? "bg-red-600" : "bg-red-200"
                              }`} />
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-red-100 flex-shrink-0 bg-red-50/60">
        <div className="bg-white border border-red-200 rounded-xl p-3 mb-2 flex items-center gap-2 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-red-400 text-[9px] leading-none">Credits Balance</div>
            <div className="text-red-900 font-bold text-sm leading-none mt-0.5">12,450</div>
          </div>
          <button className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors flex-shrink-0 shadow-md shadow-red-200">
            <ArrowRight className="w-3 h-3 text-white" />
          </button>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-3 mb-2 shadow-sm">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-red-400 text-[9px]">Current Plan</span>
            <Crown className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-red-900 font-bold text-sm leading-tight">Premium</div>
          <div className="text-red-400 text-[9px] mt-0.5 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            Valid till 24 May 2026
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[11px] font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200 flex items-center justify-center gap-1.5">
          <Crown className="w-3 h-3" />Upgrade Plan
        </button>
      </div>
      <div className="px-3 pb-2.5 text-center flex-shrink-0 bg-red-50/60">
        <p className="text-red-200 text-[9px]">NFC Writer v2.1.0 · © 2025</p>
      </div>
    </aside>
  );
}

// ─── MOBILE ICON RAIL ────────────────────────────────────────────────────────

function MobileIconRail({ activeItem, setActiveItem, onOpenDrawer }) {
  return (
    <aside className="lg:hidden fixed left-0 top-0 h-full w-14 bg-white border-r border-red-100 shadow-lg shadow-red-50 z-20 flex flex-col">
      <div className="h-14 flex items-center justify-center flex-shrink-0 bg-gradient-to-b from-red-600 to-rose-600 border-b border-red-500">
        <button onClick={onOpenDrawer}
          className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all">
          <Radio className="w-4 h-4 text-white" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 flex flex-col items-center gap-1 scrollbar-none overflow-x-hidden">
        {MOBILE_RAIL.map(item => {
          const Icon   = item.icon;
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              title={item.label}
              className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all group ${
                active ? "bg-red-600 shadow-md shadow-red-200" : "hover:bg-red-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : "text-red-400 group-hover:text-red-700"}`} />
              {active && (
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-600 rounded-l-full" />
              )}
              <span className="absolute left-full ml-2 px-2 py-1 bg-red-900 text-white text-[10px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="py-2 flex flex-col items-center gap-1 border-t border-red-100 flex-shrink-0">
        <button
          onClick={onOpenDrawer}
          title="Full Menu"
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-50 transition-all group"
        >
          <ChevronDown className="w-4 h-4 text-red-300 group-hover:text-red-600 rotate-[-90deg]" />
        </button>
        <button
          onClick={() => setActiveItem("settings")}
          title="Settings"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
            activeItem === "settings" ? "bg-red-600" : "hover:bg-red-50"
          }`}
        >
          <Settings className={`w-4 h-4 ${activeItem === "settings" ? "text-white" : "text-red-300 group-hover:text-red-600"}`} />
        </button>
      </div>
    </aside>
  );
}

// ─── EXPORTED SIDEBAR ────────────────────────────────────────────────────────

export default function Sidebar({ activeItem, setActiveItem }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ── Desktop: sticky full sidebar, NO hamburger needed ── */}
      <div className="hidden lg:flex h-screen sticky top-0 flex-shrink-0">
        <SidebarContent activeItem={activeItem} setActiveItem={setActiveItem} onClose={null} />
      </div>

      {/* ── Mobile: icon rail only ── */}
      <MobileIconRail
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      {/* ── Mobile: backdrop ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-red-950/40 backdrop-blur-sm z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </>
  );
}