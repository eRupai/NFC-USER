import { useState } from "react";
import {
  Search, HelpCircle, MessageCircle, FileText,
  ChevronDown, ChevronRight, Send,
  CheckCircle2, X, Clock, Radio, Shield, Book,
  Star, ThumbsUp, ThumbsDown, AlertTriangle,
  Users, CreditCard, Settings, Wifi,
  Package, BarChart2, Link2, PenLine, Plus,
  Headphones, Globe, MessageSquare,
  Bell, ChevronUp, RefreshCw,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { Icon: PenLine,    label: "Getting Started",   count: 12 },
  { Icon: CreditCard, label: "NFC Cards",          count: 18 },
  { Icon: CreditCard, label: "Billing & Credits",  count: 9  },
  { Icon: Link2,      label: "API & Integrations", count: 15 },
  { Icon: Settings,   label: "Account & Settings", count: 11 },
  { Icon: BarChart2,  label: "Analytics",          count: 7  },
  { Icon: Package,    label: "Bulk Operations",    count: 6  },
  { Icon: Shield,     label: "Security & Privacy", count: 8  },
];

const ALL_FAQS = [
  { id:1, q:"How do I write data to an NFC card?",           a:"Select 'Write NFC Card' from the sidebar, choose your data type (URL, vCard, WiFi, etc.), enter your data, then tap your NFC card to the back of your Android device. Make sure NFC is enabled in your device settings.", cat:"NFC Cards",          views:4821, helpful:94 },
  { id:2, q:"Which devices and browsers support Web NFC?",   a:"Web NFC is currently supported on Android devices running Chrome 89 or higher. iOS devices and desktop browsers do not support Web NFC. For iOS, you'll need a dedicated NFC app.", cat:"NFC Cards",          views:3210, helpful:89 },
  { id:3, q:"What NFC card types are supported?",            a:"NFC Writer supports NTAG213, NTAG215, NTAG216, MIFARE Classic, MIFARE Ultralight, and DESFire cards. Most standard NFC tags from retailers are NTAG213 or NTAG215 and will work perfectly.", cat:"NFC Cards",          views:2908, helpful:91 },
  { id:4, q:"How do I top up my credits?",                   a:"Go to Billing & Plan in the sidebar. Choose a preset credit pack or enter a custom amount. Select your payment method and click 'Proceed to Payment'. Credits are added instantly.", cat:"Billing & Credits",  views:2105, helpful:87 },
  { id:5, q:"What is the difference between Free and Premium?", a:"Free gives 500 credits/month and basic card types. Premium unlocks 15,000 credits/month, all card types including vCard and Custom JSON, advanced analytics, bulk operations, API access, and priority support.", cat:"Billing & Credits",  views:1890, helpful:92 },
  { id:6, q:"How do I generate an API key?",                 a:"Navigate to API & Integrations, click 'Create New Key', enter a name and select permissions. Your key is generated instantly. Store it securely — it's only shown once.", cat:"API & Integrations", views:1540, helpful:88 },
  { id:7, q:"Why is my NFC write failing?",                  a:"Common causes: NFC is disabled, card is locked or full, incompatible card type, browser permissions denied, or card removed too quickly. Check device NFC settings and ensure Chrome 89+ is used on Android.", cat:"NFC Cards",          views:3780, helpful:85 },
  { id:8, q:"How do I set up a webhook?",                    a:"Go to API & Integrations → Webhooks → Add Webhook. Enter your endpoint URL and select the events to subscribe to. Use the Test button to verify your endpoint is working.", cat:"API & Integrations", views:1230, helpful:90 },
];

const MY_TICKETS = [
  { id:"TKT-1042", subject:"NFC write failing on NTAG216",   status:"Open",        priority:"High",   cat:"NFC Cards",          date:"31 May 2025", reply:"Our team is investigating this issue and will get back to you within 2 hours."       },
  { id:"TKT-1040", subject:"Invoice discrepancy ₹1,200",     status:"In Progress", priority:"High",   cat:"Billing & Credits",  date:"29 May 2025", reply:"We've escalated this to our billing team. We'll resolve it shortly."              },
  { id:"TKT-1039", subject:"Bulk CSV import not working",    status:"Resolved",    priority:"Normal", cat:"Bulk Operations",    date:"28 May 2025", reply:"This was a bug in CSV parsing — it's now fixed in the latest release."            },
  { id:"TKT-1037", subject:"iOS NFC support query",          status:"Closed",      priority:"Low",    cat:"NFC Cards",          date:"26 May 2025", reply:"iOS 14+ on iPhone 7+ supports NFC reading natively via Safari."                   },
];

const STATUS_SERVICES = [
  { service:"NFC Writing API",     status:"Operational", uptime:"99.98%" },
  { service:"Analytics Service",   status:"Operational", uptime:"99.95%" },
  { service:"Webhook Delivery",    status:"Degraded",    uptime:"98.12%" },
  { service:"Payment Processing",  status:"Operational", uptime:"99.99%" },
  { service:"Dashboard & Web App", status:"Operational", uptime:"99.97%" },
];

const ALL_ARTICLES = [
  { id:1, Icon:PenLine,   title:"Quick Start: Write Your First NFC Card",      cat:"Getting Started", views:12400, updated:"2 days ago"  },
  { id:2, Icon:Wifi,      title:"Setting Up WiFi NFC Cards for Your Office",   cat:"NFC Cards",       views:8200,  updated:"5 days ago"  },
  { id:3, Icon:Users,     title:"Creating vCard Business Cards with NFC",      cat:"NFC Cards",       views:7100,  updated:"1 week ago"  },
  { id:4, Icon:Package,   title:"Bulk Writing 100+ NFC Cards with CSV Import", cat:"Bulk Operations", views:5800,  updated:"3 days ago"  },
  { id:5, Icon:Link2,     title:"Integrating NFC Writer API with Zapier",      cat:"API",             views:4300,  updated:"2 weeks ago" },
  { id:6, Icon:BarChart2, title:"Understanding Your NFC Scan Analytics",       cat:"Analytics",       views:3900,  updated:"1 week ago"  },
];

const STATUS_STYLES = {
  Open:          "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Resolved:      "bg-blue-100 text-blue-700 border-blue-200",
  Closed:        "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Normal: "bg-red-50 text-red-500 border-red-200",
  Low:    "bg-gray-100 text-gray-500 border-gray-200",
};

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl">
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0"/>
      {msg}
      <button onClick={onClose}><X className="w-3 h-3 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── NEW TICKET MODAL ─────────────────────────────────────────────────────────

function NewTicketModal({ onClose, onSubmit }) {
  const [subject,  setSubject]  = useState("");
  const [cat,      setCat]      = useState("NFC Cards");
  const [priority, setPriority] = useState("Normal");
  const [desc,     setDesc]     = useState("");
  const [errors,   setErrors]   = useState({});

  const handleSubmit = () => {
    const e = {};
    if (!subject.trim()) e.subject = "Required";
    if (!desc.trim())    e.desc    = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ subject: subject.trim(), cat, priority });
  };

  const inp = (err) => `w-full bg-red-50 border ${err?"border-red-400":"border-red-200"} text-red-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-red-600"/>
            </div>
            <span className="text-red-900 font-bold text-sm">New Support Ticket</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-700 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          <div>
            <label className="text-red-700 text-xs font-semibold block mb-1">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Briefly describe your issue" className={inp(errors.subject)}/>
            {errors.subject && <p className="text-red-500 text-[10px] mt-0.5">{errors.subject}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value)}
                className="w-full bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
                {["NFC Cards","Billing & Credits","API & Integrations","Bulk Operations","Account & Settings","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Priority</label>
              <div className="grid grid-cols-3 gap-1">
                {["Low","Normal","High"].map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all ${priority===p?"bg-red-600 border-red-600 text-white":"bg-red-50 border-red-200 text-red-500 hover:border-red-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-red-700 text-xs font-semibold block mb-1">Description *</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
              placeholder="Describe your issue in detail…"
              className={`${inp(errors.desc)} resize-none`}/>
            {errors.desc && <p className="text-red-500 text-[10px] mt-0.5">{errors.desc}</p>}
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-red-500 text-[10px]">💡 Check the FAQs first — your question may already be answered there.</p>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-red-100 flex gap-2 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200 flex items-center justify-center gap-1.5">
            <Send className="w-3.5 h-3.5"/>Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ showToast, setActiveTab }) {
  return (
    <div className="space-y-5">
      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { Icon:MessageCircle, label:"Submit Ticket",   sub:"Get help from our team", action:()=>setActiveTab("tickets"), bg:"from-red-500 to-rose-600"  },
          { Icon:HelpCircle,    label:"Browse FAQs",     sub:"Find quick answers",     action:()=>setActiveTab("faqs"),    bg:"from-rose-500 to-red-600"  },
          { Icon:Book,          label:"Read Articles",   sub:"Guides and tutorials",   action:()=>setActiveTab("articles"),bg:"from-red-600 to-rose-700"  },
          { Icon:Radio,         label:"System Status",   sub:"Check service health",   action:()=>setActiveTab("status"),  bg:"from-rose-600 to-red-800"  },
        ].map(a => (
          <button key={a.label} onClick={a.action}
            className="bg-white border border-red-100 rounded-2xl p-4 text-left hover:border-red-300 hover:shadow-md transition-all shadow-sm group">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center mb-2.5 shadow-md shadow-red-100 group-hover:scale-105 transition-transform`}>
              <a.Icon className="w-4 h-4 text-white"/>
            </div>
            <div className="text-red-900 text-xs font-bold">{a.label}</div>
            <div className="text-red-400 text-[10px] mt-0.5">{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Browse categories */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
          <Book className="w-4 h-4 text-red-500"/>Browse by Category
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map(c => (
            <button key={c.label} onClick={() => { setActiveTab("faqs"); showToast(`Browsing ${c.label}`); }}
              className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-left group">
              <div className="w-7 h-7 rounded-lg bg-white border border-red-200 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                <c.Icon className="w-3.5 h-3.5 text-red-500"/>
              </div>
              <div className="min-w-0">
                <div className="text-red-900 text-[11px] font-semibold truncate">{c.label}</div>
                <div className="text-red-400 text-[10px]">{c.count} articles</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* My tickets preview */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <FileText className="w-4 h-4 text-red-500"/>My Recent Tickets
          </div>
          <button onClick={() => setActiveTab("tickets")} className="text-red-500 text-[11px] hover:text-red-700 flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3"/>
          </button>
        </div>
        <div className="space-y-2">
          {MY_TICKETS.slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50/50 transition-colors cursor-pointer"
              onClick={() => setActiveTab("tickets")}>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold truncate">{t.subject}</div>
                <div className="text-red-400 text-[10px]">{t.id} · {t.cat}</div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[t.status]}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TICKETS TAB ──────────────────────────────────────────────────────────────

function TicketsTab({ showToast }) {
  const [tickets, setTickets]   = useState(MY_TICKETS);
  const [filter,  setFilter]    = useState("All");
  const [search,  setSearch]    = useState("");
  const [selected,setSelected]  = useState(null);
  const [reply,   setReply]     = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [helpful, setHelpful]   = useState({});

  const statuses = ["All","Open","In Progress","Resolved","Closed"];
  const counts   = statuses.reduce((acc,s) => { acc[s] = s==="All" ? tickets.length : tickets.filter(t => t.status===s).length; return acc; }, {});

  const filtered = tickets.filter(t => {
    const matchS = filter==="All" || t.status===filter;
    const matchQ = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const handleNew = ({ subject, cat, priority }) => {
    const newT = {
      id: `TKT-${Math.floor(1000+Math.random()*9000)}`,
      subject, cat, priority,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),
      reply: "Thanks for reaching out! Our support team will review your ticket and respond within 24 hours.",
    };
    setTickets(p => [newT, ...p]);
    setShowNew(false);
    showToast("Ticket submitted! We'll respond within 24h.");
  };

  const handleReply = () => {
    if (!reply.trim()) { showToast("Type a message first"); return; }
    setReply("");
    showToast("Message sent to support team!");
  };

  return (
    <>
      {showNew && <NewTicketModal onClose={() => setShowNew(false)} onSubmit={handleNew}/>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
              <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your tickets…"
                className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-red-200 flex-shrink-0">
              <Plus className="w-3.5 h-3.5"/>New
            </button>
          </div>
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all ${filter===s?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
                {s} <span className="opacity-70">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-red-300 text-xs">No tickets found</div>
            )}
            {filtered.map(t => (
              <div key={t.id} onClick={() => { setSelected(t); setReply(""); }}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id===t.id?"border-red-400 bg-red-50":"border-red-100 bg-white hover:bg-red-50/50"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-red-400 text-[10px] font-mono">{t.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                  </div>
                  <div className="text-red-900 text-xs font-semibold truncate">{t.subject}</div>
                  <div className="text-red-400 text-[10px] mt-0.5">{t.cat}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-red-300">{t.date}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[t.status]}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
              <FileText className="w-8 h-8 mb-2 opacity-30"/>Select a ticket to view
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-red-100">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-red-400 mb-0.5">{selected.id}</div>
                  <div className="text-red-900 text-sm font-bold">{selected.subject}</div>
                  <div className="text-red-400 text-xs mt-0.5">{selected.cat}</div>
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
              </div>

              {/* Support reply */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[8px] font-bold">S</span>
                  </div>
                  <span className="text-red-600 text-[10px] font-semibold">Support Team</span>
                  <span className="text-red-300 text-[10px]">· just now</span>
                </div>
                <p className="text-red-700 text-xs leading-relaxed">{selected.reply}</p>
                {selected.status === "Resolved" && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-red-100">
                    <span className="text-red-400 text-[10px]">Was this helpful?</span>
                    <button onClick={() => { setHelpful(p => ({...p,[selected.id]:"yes"})); showToast("Thanks for your feedback!"); }}
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all ${helpful[selected.id]==="yes"?"bg-green-100 text-green-700 border-green-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                      <ThumbsUp className="w-3 h-3"/>Yes
                    </button>
                    <button onClick={() => { setHelpful(p => ({...p,[selected.id]:"no"})); showToast("We'll improve this.", "info"); }}
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all ${helpful[selected.id]==="no"?"bg-red-100 text-red-700 border-red-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                      <ThumbsDown className="w-3 h-3"/>No
                    </button>
                  </div>
                )}
              </div>

              {/* Reply input — only for active tickets */}
              {!["Resolved","Closed"].includes(selected.status) && (
                <>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2}
                    placeholder="Add a message…"
                    className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none mb-2"/>
                  <button onClick={handleReply}
                    className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-xl transition-all">
                    <Send className="w-3 h-3"/>Send Message
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── FAQS TAB ─────────────────────────────────────────────────────────────────

function FaqsTab({ showToast }) {
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [open,    setOpen]    = useState(null);
  const [helpful, setHelpful] = useState({});

  const cats     = ["All", ...new Set(ALL_FAQS.map(f => f.cat))];
  const filtered = ALL_FAQS.filter(f => {
    const matchCat = filter==="All" || f.cat===filter;
    const matchQ   = !search || f.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs…"
          className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`text-[11px] px-3 py-1 rounded-full border font-medium transition-all ${filter===c?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-center py-8 text-red-300 text-xs">No FAQs found</div>}
        {filtered.map(f => (
          <div key={f.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${open===f.id?"border-red-300 shadow-sm shadow-red-100":"border-red-100 hover:border-red-200"}`}>
            <button onClick={() => setOpen(open===f.id ? null : f.id)}
              className="w-full flex items-start gap-2 p-3 text-left">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${open===f.id?"bg-red-600":"bg-red-100"}`}>
                {open===f.id ? <ChevronUp className="w-3 h-3 text-white"/> : <ChevronDown className="w-3 h-3 text-red-500"/>}
              </div>
              <span className={`font-semibold text-xs flex-1 ${open===f.id?"text-red-700":"text-red-900"}`}>{f.q}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-green-600 font-medium hidden sm:block">{f.helpful}% helpful</span>
                <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full hidden sm:block">{f.cat}</span>
              </div>
            </button>
            {open === f.id && (
              <div className="px-4 pb-4 pl-10 border-t border-red-50">
                <p className="text-red-700 text-xs leading-relaxed mt-3 mb-3">{f.a}</p>
                <div className="flex items-center gap-3">
                  <span className="text-red-400 text-[10px]">Was this helpful?</span>
                  <button onClick={() => { setHelpful(p => ({...p,[f.id]:"yes"})); showToast("Thanks for your feedback!"); }}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${helpful[f.id]==="yes"?"bg-green-100 text-green-700 border-green-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsUp className="w-3 h-3"/>Yes
                  </button>
                  <button onClick={() => { setHelpful(p => ({...p,[f.id]:"no"})); showToast("We'll improve this answer."); }}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${helpful[f.id]==="no"?"bg-red-100 text-red-700 border-red-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsDown className="w-3 h-3"/>No
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center pt-2">
        <p className="text-red-400 text-sm mb-3">Still need help?</p>
        <button onClick={() => showToast("Opening contact form…")}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-red-200">
          Contact Support →
        </button>
      </div>
    </div>
  );
}

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────

function ArticlesTab({ showToast }) {
  return (
    <div className="space-y-3">
      <p className="text-red-400 text-xs">{ALL_ARTICLES.length} guides and tutorials available</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_ARTICLES.map(a => (
          <button key={a.id} onClick={() => showToast(`Opening: ${a.title}`)}
            className="bg-white border border-red-100 rounded-xl p-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all text-left group">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                <a.Icon className="w-4 h-4 text-red-600"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold leading-tight mb-1.5 group-hover:text-red-700 transition-colors">{a.title}</div>
                <div className="flex items-center gap-2 text-[10px] text-red-400">
                  <span className="bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{a.cat}</span>
                  <span>{a.views.toLocaleString()} views</span>
                  <span>{a.updated}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-500 flex-shrink-0 mt-0.5 transition-colors"/>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STATUS TAB ───────────────────────────────────────────────────────────────

function StatusTab({ showToast }) {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0"/>
        <div>
          <div className="text-amber-800 font-bold text-sm">Partial Degradation</div>
          <div className="text-amber-600 text-xs">Webhook Delivery is experiencing elevated latency.</div>
        </div>
        <button onClick={() => showToast("Status refreshed")} className="ml-auto text-amber-600 hover:text-amber-800 transition-colors">
          <RefreshCw className="w-4 h-4"/>
        </button>
      </div>

      {/* Service status — read-only for users */}
      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-red-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-500"/>
          <span className="text-red-900 font-bold text-sm">Service Status</span>
        </div>
        <div className="divide-y divide-red-50">
          {STATUS_SERVICES.map(s => (
            <div key={s.service} className="flex items-center justify-between px-4 py-3">
              <span className="text-red-900 text-xs font-medium">{s.service}</span>
              <div className="flex items-center gap-4">
                <span className="text-red-400 text-[10px]">{s.uptime} uptime</span>
                <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${s.status==="Operational"?"text-green-700":"text-amber-700"}`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${s.status==="Operational"?"bg-green-500":"bg-amber-500"}`}/>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident notice */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-3">
          <Bell className="w-4 h-4 text-red-500"/>Active Incidents
        </div>
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0"/>
          <div>
            <div className="text-amber-800 text-xs font-semibold">Webhook Delivery — Elevated latency</div>
            <div className="text-amber-600 text-[10px]">Started 45 min ago · Being investigated · Updates every 30 min</div>
          </div>
        </div>
        <p className="text-red-400 text-[10px] mt-3">Subscribe to status updates at <span className="text-red-600 font-semibold">status.nfcwriter.com</span></p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"overview",  label:"Overview",      Icon:BarChart2    },
  { id:"tickets",   label:"My Tickets",    Icon:FileText     },
  { id:"faqs",      label:"FAQs",          Icon:HelpCircle   },
  { id:"articles",  label:"Articles",      Icon:Book         },
  { id:"status",    label:"System Status", Icon:Radio        },
];

export default function UserHelpSupportFullPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [toast,     setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":  return <OverviewTab  showToast={showToast} setActiveTab={setActiveTab}/>;
      case "tickets":   return <TicketsTab   showToast={showToast}/>;
      case "faqs":      return <FaqsTab      showToast={showToast}/>;
      case "articles":  return <ArticlesTab  showToast={showToast}/>;
      case "status":    return <StatusTab    showToast={showToast}/>;
      default:          return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Hero */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 px-4 sm:px-8 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"/>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                <Headphones className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">Help & Support</h1>
                <p className="text-red-100 text-[11px]">Find answers, submit tickets and check service health</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-auto">
              {[{val:"< 2h",label:"Response time"},{val:"91%",label:"CSAT score"},{val:"24/7",label:"FAQ access"}].map(s => (
                <div key={s.label} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-red-200 flex-shrink-0"/>
                  <span className="text-red-100 text-[11px]"><span className="font-bold text-white">{s.val}</span> {s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${activeTab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-3 sm:px-5 py-5">
          {renderTab()}
        </div>
      </div>

      <Toast msg={toast} onClose={() => setToast("")}/>
    </div>
  );
}