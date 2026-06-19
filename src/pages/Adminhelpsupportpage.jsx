import { useState } from "react";
import {
  HelpCircle, MessageCircle, FileText, CheckCircle2, X,
  AlertTriangle, Search, Send, ChevronDown, Star,
  ThumbsUp, ThumbsDown, Plus, BookOpen, Video,
  Clock, RefreshCw, ChevronRight, MessageSquare,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MY_TICKETS = [
  { id:"TKT-1042", subject:"NFC write failing on NTAG216",   status:"Open",        priority:"High",   cat:"NFC Cards", date:"31 May 2025", reply:"Our team is looking into this and will get back to you shortly." },
  { id:"TKT-1040", subject:"Invoice discrepancy ₹1,200",     status:"In Progress", priority:"High",   cat:"Billing",   date:"29 May 2025", reply:"We've escalated this to our billing team." },
  { id:"TKT-1039", subject:"Bulk CSV import not working",    status:"Resolved",    priority:"Normal", cat:"Bulk Ops",  date:"28 May 2025", reply:"This has been fixed in the latest update. Please try again." },
  { id:"TKT-1037", subject:"iOS NFC support query",          status:"Closed",      priority:"Low",    cat:"NFC Cards", date:"26 May 2025", reply:"iOS 14+ supports NFC scanning natively." },
];

const FAQS = [
  { id:1, q:"How do I write data to an NFC card?",       cat:"NFC Cards", helpful:94, answer:"Go to Dashboard → Write NFC Card, select your data type, enter the data, then hold your NFC card near your phone's NFC reader. Supported types include URL, vCard, WiFi, and more." },
  { id:2, q:"Which devices support Web NFC?",            cat:"NFC Cards", helpful:89, answer:"Web NFC is supported on Android devices running Chrome 89+. iOS supports NFC reading natively on iPhone 7+ with iOS 14+, but Web NFC writing requires a native app." },
  { id:3, q:"How do I top up my credits?",               cat:"Billing",   helpful:87, answer:"Go to Billing & Plan → My Usage → Top Up Credits. You can purchase credit packs via UPI, card, or net banking. Credits are added instantly." },
  { id:4, q:"What is the difference between plans?",     cat:"Billing",   helpful:92, answer:"Free plan gives 10 cards and 500 scans/mo. Basic gives 50 cards and 3,000 scans/mo. Premium gives unlimited cards, 15,000 scans, API access, and bulk write. Enterprise is custom." },
  { id:5, q:"How do I generate an API key?",             cat:"API",       helpful:88, answer:"Go to API & Integrations → My API Keys → Create Key. Name your key, choose Read Only or Full Access permissions, then copy and store it securely." },
  { id:6, q:"Why is my NFC write failing?",              cat:"NFC Cards", helpful:85, answer:"Common causes: (1) NFC is disabled — enable it in Settings. (2) Card is locked — check the lock status. (3) Unsupported card type — verify it's NTAG213/215/216 or MIFARE. (4) Too far from reader — hold card flat against the back of your device." },
];

const RESOURCES = [
  { Icon: BookOpen, label:"Getting Started Guide",    sub:"Learn the basics of NFC cards",       color:"text-red-500",  bg:"bg-red-50" },
  { Icon: Video,    label:"Video Tutorials",          sub:"Watch step-by-step walkthroughs",     color:"text-rose-500", bg:"bg-rose-50" },
  { Icon: FileText, label:"API Documentation",        sub:"Integrate NFC into your apps",        color:"text-red-600",  bg:"bg-red-50" },
  { Icon: HelpCircle,label:"Troubleshooting Guide",  sub:"Fix common NFC issues",               color:"text-rose-600", bg:"bg-rose-50" },
];

const MY_ACTIVITY_CHART = [
  { day:"Mon", scans:12 },
  { day:"Tue", scans:24 },
  { day:"Wed", scans:18 },
  { day:"Thu", scans:31 },
  { day:"Fri", scans:20 },
  { day:"Sat", scans:8  },
  { day:"Sun", scans:5  },
];

const TICKET_STATUS_STYLES = {
  "Open":        "bg-green-100 text-green-700 border-green-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  "Resolved":    "bg-purple-100 text-purple-700 border-purple-200",
  "Closed":      "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Normal: "bg-red-50 text-red-500 border-red-200",
  Low:    "bg-gray-100 text-gray-500 border-gray-200",
};

const TOOLTIP = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:8, fontSize:11 },
  labelStyle:{ color:"#991b1b" }, itemStyle:{ color:"#ef4444" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

// ─── NEW TICKET MODAL ─────────────────────────────────────────────────────────

function NewTicketModal({ onClose, onSubmit }) {
  const [subject, setSubject] = useState("");
  const [cat,     setCat]     = useState("NFC Cards");
  const [priority,setPriority]= useState("Normal");
  const [desc,    setDesc]    = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !desc.trim()) { return; }
    onSubmit({ subject: subject.trim(), cat, priority, desc: desc.trim() });
  };

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
            <label className="text-red-700 text-[10px] font-semibold mb-1 block">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Briefly describe your issue"
              className="w-full bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-900 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-red-700 text-[10px] font-semibold mb-1 block">Category</label>
              <select value={cat} onChange={e => setCat(e.target.value)}
                className="w-full bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
                {["NFC Cards","Billing","API","Bulk Ops","Account","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-red-700 text-[10px] font-semibold mb-1 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
                {["Low","Normal","High"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-red-700 text-[10px] font-semibold mb-1 block">Description *</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
              placeholder="Describe your issue in detail…"
              className="w-full bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-900 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"/>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-red-500 text-[10px]">💡 Before submitting, check the FAQs — your question may already be answered there.</p>
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

// ─── MY TICKETS PANEL ────────────────────────────────────────────────────────

function MyTicketsPanel({ showToast }) {
  const [tickets,  setTickets]  = useState(MY_TICKETS);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [reply,    setReply]    = useState("");
  const [showNew,  setShowNew]  = useState(false);
  const [helpful,  setHelpful]  = useState({});

  const filtered = tickets.filter(t => {
    const matchS = filter === "All" || t.status === filter;
    const matchQ = !search || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchS && matchQ;
  });

  const handleNewTicket = ({ subject, cat, priority }) => {
    const newT = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject, cat, priority,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
      reply: "Thanks for reaching out! Our support team will get back to you within 24 hours.",
    };
    setTickets(p => [newT, ...p]);
    setShowNew(false);
    showToast("Ticket submitted! We'll respond within 24h.");
  };

  const handleReply = () => {
    if (!reply.trim()) { showToast("Please type a message first.", "error"); return; }
    setReply("");
    showToast("Message sent to support team!");
  };

  return (
    <>
      <div className="space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your tickets…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 flex-wrap">
          {["All","Open","In Progress","Resolved","Closed"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${filter === s ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="text-center text-red-300 py-6 text-xs">No tickets found</div>
          )}
          {filtered.map(t => (
            <div key={t.id} onClick={() => { setSelected(t); setReply(""); }}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === t.id ? "border-red-400 bg-red-50" : "border-red-100 bg-white hover:bg-red-50/50"}`}>
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
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${TICKET_STATUS_STYLES[t.status]}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected ticket detail */}
        {selected && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-red-900 text-xs font-bold truncate">{selected.subject}</div>
                <div className="text-red-400 text-[10px] mt-0.5">{selected.id} · {selected.cat}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-red-300 hover:text-red-600 transition-colors flex-shrink-0">
                <X className="w-4 h-4"/>
              </button>
            </div>
            {/* Support reply */}
            <div className="bg-white border border-red-100 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-bold">S</span>
                </div>
                <span className="text-red-600 text-[10px] font-semibold">Support Team</span>
                <span className="text-red-300 text-[10px]">· just now</span>
              </div>
              <p className="text-red-700 text-xs leading-relaxed">{selected.reply}</p>
              {/* Helpful? */}
              {selected.status === "Resolved" && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-red-50">
                  <span className="text-red-400 text-[10px]">Was this helpful?</span>
                  <button onClick={() => { setHelpful(p => ({...p,[selected.id]:"yes"})); showToast("Thanks for your feedback!"); }}
                    className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${helpful[selected.id]==="yes"?"bg-green-100 text-green-700 border-green-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsUp className="w-3 h-3"/>Yes
                  </button>
                  <button onClick={() => { setHelpful(p => ({...p,[selected.id]:"no"})); showToast("We'll improve this response.", "info"); }}
                    className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${helpful[selected.id]==="no"?"bg-red-100 text-red-700 border-red-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsDown className="w-3 h-3"/>No
                  </button>
                </div>
              )}
            </div>
            {/* Reply input */}
            {!["Resolved","Closed"].includes(selected.status) && (
              <>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2}
                  placeholder="Add a message…"
                  className="w-full bg-white border border-red-200 text-red-900 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 resize-none"/>
                <button onClick={handleReply}
                  className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-md shadow-red-200">
                  <Send className="w-3 h-3"/>Send Message
                </button>
              </>
            )}
          </div>
        )}

        {/* New ticket button */}
        <button onClick={() => setShowNew(true)}
          className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-red-200">
          <Plus className="w-3.5 h-3.5"/>Submit New Ticket
        </button>
      </div>

      {showNew && <NewTicketModal onClose={() => setShowNew(false)} onSubmit={handleNewTicket}/>}
    </>
  );
}

// ─── FAQS PANEL ───────────────────────────────────────────────────────────────

function FaqsPanel({ showToast }) {
  const [open,     setOpen]     = useState(null);
  const [search,   setSearch]   = useState("");
  const [catFilter,setCatFilter]= useState("All");
  const [helpful,  setHelpful]  = useState({});

  const cats = ["All", ...new Set(FAQS.map(f => f.cat))];

  const filtered = FAQS.filter(f => {
    const matchC = catFilter === "All" || f.cat === catFilter;
    const matchQ = !search || f.q.toLowerCase().includes(search.toLowerCase());
    return matchC && matchQ;
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs…"
          className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${catFilter === c ? "bg-red-600 border-red-600 text-white" : "bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center text-red-300 py-6 text-xs">No FAQs found</div>
        )}
        {filtered.map(f => (
          <div key={f.id}
            className={`bg-white border rounded-xl overflow-hidden transition-all ${open === f.id ? "border-red-300 shadow-sm shadow-red-100" : "border-red-100 hover:border-red-200"}`}>
            <button onClick={() => setOpen(open === f.id ? null : f.id)}
              className="w-full flex items-start gap-2 p-3 text-left">
              <div className="flex-1 min-w-0">
                <div className="text-red-900 text-xs font-semibold">{f.q}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{f.cat}</span>
                  <span className="text-[10px] text-red-400">{f.helpful}% found helpful</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 transition-transform ${open === f.id ? "rotate-180" : ""}`}/>
            </button>
            {open === f.id && (
              <div className="px-3 pb-3 border-t border-red-50">
                <p className="text-red-700 text-xs leading-relaxed mt-2 mb-3">{f.answer}</p>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-[10px]">Was this helpful?</span>
                  <button onClick={() => { setHelpful(p => ({...p,[f.id]:"yes"})); showToast("Thanks for your feedback!"); }}
                    className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${helpful[f.id]==="yes"?"bg-green-100 text-green-700 border-green-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsUp className="w-3 h-3"/>Yes
                  </button>
                  <button onClick={() => { setHelpful(p => ({...p,[f.id]:"no"})); showToast("We'll improve this answer.", "info"); }}
                    className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${helpful[f.id]==="no"?"bg-red-100 text-red-700 border-red-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                    <ThumbsDown className="w-3 h-3"/>No
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OVERVIEW PANEL ───────────────────────────────────────────────────────────

function OverviewPanel({ showToast }) {
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReview = () => {
    if (!rating) { showToast("Please select a star rating first.", "error"); return; }
    setSubmitted(true);
    showToast("Thank you for your feedback! 🌟");
  };

  return (
    <div className="space-y-4">
      {/* My scan activity chart */}
      <div>
        <div className="text-red-700 text-xs font-semibold mb-2">My Scan Activity This Week</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={MY_ACTIVITY_CHART} margin={{ top:4, right:4, left:-25, bottom:0 }} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="day" tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Bar dataKey="scans" name="Scans" fill="#ef4444" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resources */}
      <div>
        <div className="text-red-700 text-xs font-semibold mb-2">Help Resources</div>
        <div className="grid grid-cols-2 gap-2">
          {RESOURCES.map(r => (
            <button key={r.label} onClick={() => showToast(`Opening ${r.label}…`, "info")}
              className={`flex items-start gap-2 p-2.5 ${r.bg} border border-red-100 rounded-xl hover:border-red-300 transition-all text-left group`}>
              <r.Icon className={`w-4 h-4 ${r.color} flex-shrink-0 mt-0.5`}/>
              <div className="min-w-0">
                <div className="text-red-900 text-[10px] font-semibold leading-tight">{r.label}</div>
                <div className="text-red-400 text-[9px] mt-0.5 leading-tight">{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick account stats */}
      <div className="border-t border-red-100 pt-3 space-y-1.5">
        {[
          { k:"My Open Tickets",   v:"2"        },
          { k:"Resolved Tickets",  v:"1"        },
          { k:"Account Status",    v:"Active ✓" },
          { k:"Support Plan",      v:"Premium"  },
        ].map(s => (
          <div key={s.k} className="flex justify-between text-xs">
            <span className="text-red-400">{s.k}</span>
            <span className="text-red-900 font-semibold">{s.v}</span>
          </div>
        ))}
      </div>

      {/* Rate support */}
      <div className="border border-red-100 rounded-xl p-3">
        <div className="text-red-700 text-xs font-semibold mb-2">Rate Our Support</div>
        {!submitted ? (
          <>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(n => (
                <button key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110">
                  <Star className={`w-5 h-5 ${(hover || rating) >= n ? "text-amber-400 fill-amber-400" : "text-red-200"} transition-colors`}/>
                </button>
              ))}
              {rating > 0 && <span className="text-red-400 text-[10px] ml-1">{rating}/5</span>}
            </div>
            <textarea value={review} onChange={e => setReview(e.target.value)} rows={2}
              placeholder="Tell us how we're doing…"
              className="w-full bg-red-50 border border-red-200 text-red-900 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-red-400 placeholder-red-300 resize-none mb-2"/>
            <button onClick={handleReview}
              className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
              Submit Feedback
            </button>
          </>
        ) : (
          <div className="text-center py-3">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1.5"/>
            <div className="text-red-900 text-xs font-semibold">Thanks for your feedback!</div>
            <div className="text-red-400 text-[10px] mt-0.5">Your rating: {rating}/5 ⭐</div>
          </div>
        )}
      </div>

      {/* Live chat CTA */}
      <button onClick={() => showToast("Connecting to live chat…", "info")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-red-200">
        <MessageCircle className="w-4 h-4"/>Chat with Support
      </button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"tickets",  label:"My Tickets", Icon:FileText     },
  { id:"faqs",     label:"FAQs",       Icon:HelpCircle   },
  { id:"overview", label:"Overview",   Icon:MessageCircle},
];

export default function UserHelpSupportPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("tickets");
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
            <HelpCircle className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Help & Support</h1>
            <p className="text-red-400 text-xs hidden sm:block">Submit tickets, browse FAQs and chat with our team</p>
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

          {/* My Tickets */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "tickets" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">My Tickets</h2>
            </div>
            <MyTicketsPanel showToast={showToast}/>
          </div>

          {/* FAQs */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "faqs" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">FAQs</h2>
            </div>
            <FaqsPanel showToast={showToast}/>
          </div>

          {/* Overview */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "overview" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">Overview</h2>
            </div>
            <OverviewPanel showToast={showToast}/>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:"" })}/>
    </div>
  );
}