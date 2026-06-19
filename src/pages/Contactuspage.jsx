import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, CheckCircle2, X,
  MessageCircle, Send, Shield, Star,
  ChevronDown, HelpCircle, Settings,
  Edit3, FileText, Save, RefreshCw,
  Bell, AlertCircle, Building, Globe,
  ThumbsUp, ThumbsDown,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CONTACT_REASONS = [
  "Technical Support",
  "Billing & Payments",
  "Feature Request",
  "Sales & Pricing",
  "Account Help",
  "General Inquiry",
];

const OFFICES = [
  { city:"Mumbai (HQ)", country:"India", flag:"🇮🇳", addr:"Level 12, One BKC, Bandra Kurla Complex", phone:"+91 22 6789 0000", email:"support@nfcwriter.com",    hours:"Mon–Fri 9am–6pm IST", open:true  },
  { city:"New York",    country:"USA",   flag:"🇺🇸", addr:"350 5th Avenue, Suite 4800",               phone:"+1 (212) 555-0100", email:"us@nfcwriter.com",         hours:"Mon–Fri 9am–6pm EST", open:true  },
  { city:"London",      country:"UK",    flag:"🇬🇧", addr:"1 Canada Square, Canary Wharf",            phone:"+44 20 7946 0200",  email:"uk@nfcwriter.com",         hours:"Mon–Fri 9am–5pm GMT", open:false },
];

const FAQS = [
  { q:"How do I write data to an NFC card?",      a:"Go to Dashboard → Write NFC Card, pick your data type, fill in the data, then hold the NFC card near your phone's NFC reader." },
  { q:"My NFC write is failing — what should I do?", a:"Check that NFC is enabled in your phone settings. Make sure the card is held flat against the back of the device. Verify the card type is supported (NTAG213/215/216, MIFARE)." },
  { q:"How do I upgrade my plan?",                 a:"Go to Billing & Plan → My Plan, then click 'Upgrade to Pro/Unlimited'. You can pay via UPI, card, or net banking." },
  { q:"Can I use NFC on iPhone?",                  a:"Yes! iPhone 7+ with iOS 14+ supports NFC reading natively. For writing, you'll need to use Safari or the dedicated NFC Writer app." },
  { q:"How do I generate an API key?",             a:"Go to API & Integrations → My API Keys → Create Key. Choose your permission level and copy the key securely." },
];

const SETTING_GROUPS = [
  {
    title: "Email Preferences", Icon: Mail,
    items: [
      { label:"Email me when my ticket gets a reply",     checked:true  },
      { label:"Send me the weekly newsletter",             checked:false },
      { label:"Notify me about product updates",          checked:true  },
    ],
  },
  {
    title: "Notifications", Icon: Bell,
    items: [
      { label:"Push notifications for ticket updates",    checked:true  },
      { label:"SMS alerts for urgent replies",            checked:false },
    ],
  },
];

// ─── TOAST ─────────────────────────────────────────────────────────────────────

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

// ─── CONTACT FORM TAB ─────────────────────────────────────────────────────────

function ContactFormTab({ showToast }) {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [company,  setCompany]  = useState("");
  const [reason,   setReason]   = useState(CONTACT_REASONS[0]);
  const [message,  setMessage]  = useState("");
  const [priority, setPriority] = useState("Normal");
  const [subscribe,setSubscribe]= useState(true);
  const [sent,     setSent]     = useState(false);
  const [errors,   setErrors]   = useState({});

  const inp = (err) => `w-full bg-red-50 border ${err ? "border-red-400" : "border-red-200"} text-red-900 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;

  const handleSubmit = () => {
    const e = {};
    if (!name.trim())    e.name    = "Name is required";
    if (!email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!message.trim()) e.message = "Please describe your issue";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSent(true);
    showToast("Message sent! We'll reply within 2 hours.");
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mb-4 shadow-lg shadow-green-100">
          <CheckCircle2 className="w-8 h-8 text-green-500"/>
        </div>
        <h3 className="text-red-900 font-bold text-lg mb-2">Message Sent!</h3>
        <p className="text-red-400 text-sm mb-1">We've received your message and will reply to</p>
        <p className="text-red-600 font-semibold text-sm mb-6">{email}</p>
        <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 mb-6 text-left max-w-xs w-full space-y-1.5">
          {[["Name", name],["Topic", reason],["Priority", priority]].map(([k,v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-red-400">{k}</span>
              <span className="text-red-800 font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); setCompany(""); }}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-red-200">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-red-900 font-bold text-base mb-1 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-red-500"/>Send us a Message
        </h2>
        <p className="text-red-400 text-xs mb-5">We typically reply within 2 hours on weekdays</p>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Daksh Kumar" className={inp(errors.name)}/>
              {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Email Address *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inp(errors.email)}/>
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="text-red-700 text-xs font-semibold block mb-1">Company (optional)</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" className={inp(false)}/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Topic</label>
              <div className="relative">
                <select value={reason} onChange={e => setReason(e.target.value)} className={`${inp(false)} pr-8 appearance-none cursor-pointer`}>
                  {CONTACT_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
              </div>
            </div>
            <div>
              <label className="text-red-700 text-xs font-semibold block mb-1">Priority</label>
              <div className="grid grid-cols-3 gap-1.5">
                {["Low","Normal","High"].map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                      priority === p
                        ? "bg-red-600 border-red-600 text-white shadow-sm shadow-red-200"
                        : "bg-red-50 border-red-200 text-red-500 hover:border-red-400"
                    }`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-red-700 text-xs font-semibold block mb-1">Message *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
              placeholder="Describe your issue or question in detail…"
              className={`${inp(errors.message)} resize-none`}/>
            {errors.message && <p className="text-red-500 text-[10px] mt-0.5">{errors.message}</p>}
            <p className="text-red-300 text-[10px] mt-0.5 text-right">{message.length} / 1000</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={subscribe} onChange={e => setSubscribe(e.target.checked)} className="w-3.5 h-3.5 accent-red-500"/>
            <span className="text-red-600 text-xs">Subscribe to product updates and newsletters</span>
          </label>

          <button onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md shadow-red-200">
            <Send className="w-4 h-4"/>Send Message
          </button>
        </div>
      </div>

      {/* Right side: quick info + channels */}
      <div className="space-y-4">
        {/* Response time */}
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500"/>Expected Response Times
          </h3>
          {[
            { label:"🔴 High Priority",   val:"Within 30 min" },
            { label:"🟡 Normal Priority", val:"Within 2 hours" },
            { label:"🟢 Low Priority",    val:"Within 24 hours"},
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-red-50 last:border-0 text-xs">
              <span className="text-red-500">{r.label}</span>
              <span className="text-red-900 font-semibold">{r.val}</span>
            </div>
          ))}
        </div>

        {/* Other channels */}
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-500"/>Other Ways to Reach Us
          </h3>
          <div className="space-y-2.5">
            {[
              { Icon:MessageCircle, label:"Live Chat",       sub:"Available Mon–Fri 9am–6pm",     action:"Start Chat"   },
              { Icon:Phone,         label:"Phone Support",   sub:"+91 22 6789 0000",               action:"Call Now"     },
              { Icon:Mail,          label:"Email",           sub:"support@nfcwriter.com",          action:"Send Email"   },
              { Icon:HelpCircle,    label:"Help Center",     sub:"Browse articles & guides",      action:"Visit"        },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-white border border-red-200 flex items-center justify-center flex-shrink-0">
                  <c.Icon className="w-4 h-4 text-red-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-semibold">{c.label}</div>
                  <div className="text-red-400 text-[10px]">{c.sub}</div>
                </div>
                <button onClick={() => showToast(`Opening ${c.label}…`)}
                  className="text-red-500 hover:text-red-700 text-[10px] font-semibold transition-colors flex-shrink-0">
                  {c.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OFFICES TAB ──────────────────────────────────────────────────────────────

function OfficesTab({ showToast }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OFFICES.map((o, i) => (
          <div key={i} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{o.flag}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${o.open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {o.open ? "Open Now" : "Closed"}
              </span>
            </div>
            <div className="text-red-900 font-bold text-sm mb-0.5">{o.city}</div>
            <div className="text-red-400 text-xs mb-3">{o.country}</div>
            <div className="space-y-2">
              {[
                { Icon: MapPin, v: o.addr  },
                { Icon: Phone,  v: o.phone },
                { Icon: Mail,   v: o.email },
                { Icon: Clock,  v: o.hours },
              ].map((r, j) => (
                <div key={j} className="flex items-start gap-2">
                  <r.Icon className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0"/>
                  <span className="text-red-600 text-[11px] leading-snug">{r.v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => showToast(`Opening directions to ${o.city}…`)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 text-[11px] py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all">
              <MapPin className="w-3 h-3"/>Get Directions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQS TAB ─────────────────────────────────────────────────────────────────

function FaqsTab({ showToast }) {
  const [open,    setOpen]    = useState(null);
  const [helpful, setHelpful] = useState({});

  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {FAQS.map((f, i) => (
        <div key={i}
          className={`bg-white border rounded-2xl overflow-hidden transition-all ${open === i ? "border-red-300 shadow-sm shadow-red-100" : "border-red-100 hover:border-red-200"}`}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start gap-3 p-4 text-left">
            <HelpCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${open === i ? "text-red-600" : "text-red-400"}`}/>
            <span className={`text-sm font-semibold flex-1 ${open === i ? "text-red-900" : "text-red-700"}`}>{f.q}</span>
            <ChevronDown className={`w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 transition-transform ${open === i ? "rotate-180" : ""}`}/>
          </button>
          {open === i && (
            <div className="px-4 pb-4 border-t border-red-50 pt-3">
              <p className="text-red-700 text-sm leading-relaxed mb-3">{f.a}</p>
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xs">Was this helpful?</span>
                <button onClick={() => { setHelpful(p => ({...p,[i]:"yes"})); showToast("Thanks for your feedback!"); }}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${helpful[i]==="yes"?"bg-green-100 text-green-700 border-green-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                  <ThumbsUp className="w-3 h-3"/>Yes
                </button>
                <button onClick={() => { setHelpful(p => ({...p,[i]:"no"})); showToast("We'll improve this answer.", "info"); }}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${helpful[i]==="no"?"bg-red-100 text-red-700 border-red-200":"text-red-400 border-red-200 hover:bg-red-50"}`}>
                  <ThumbsDown className="w-3 h-3"/>No
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="text-center pt-4">
        <p className="text-red-400 text-sm mb-3">Can't find what you're looking for?</p>
        <button onClick={() => showToast("Opening Help Center…")}
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-red-200">
          Browse Help Center →
        </button>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────

function SettingsTab({ showToast }) {
  const [groups, setGroups] = useState(SETTING_GROUPS);
  const [autoReply, setAutoReply] = useState(true);

  const toggle = (gi, ii) => {
    setGroups(prev => prev.map((g, gIdx) => gIdx !== gi ? g : {
      ...g,
      items: g.items.map((item, iIdx) => iIdx !== ii ? item : { ...item, checked: !item.checked }),
    }));
    showToast("Preference updated");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {groups.map((g, gi) => (
        <div key={g.title} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
            <g.Icon className="w-4 h-4 text-red-500"/>{g.title}
          </div>
          <div className="space-y-0">
            {g.items.map((item, ii) => (
              <label key={item.label}
                className="flex items-center gap-3 py-2.5 border-b border-red-50 last:border-0 cursor-pointer group">
                <input type="checkbox" checked={item.checked} onChange={() => toggle(gi, ii)} className="w-3.5 h-3.5 accent-red-500 flex-shrink-0"/>
                <span className="text-red-600 text-sm group-hover:text-red-900 transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 text-red-900 font-semibold text-sm mb-4">
          <RefreshCw className="w-4 h-4 text-red-500"/>Auto-reply Settings
        </div>
        <div className="flex items-center justify-between py-2.5">
          <div>
            <div className="text-red-700 text-sm">Auto-reply when I'm away</div>
            <div className="text-red-400 text-[10px] mt-0.5">Sends an automated acknowledgment to support team</div>
          </div>
          <button onClick={() => { setAutoReply(v => !v); showToast("Auto-reply setting updated"); }}
            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${autoReply ? "bg-red-600" : "bg-red-100 border border-red-200"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoReply ? "translate-x-5" : "translate-x-0.5"}`}/>
          </button>
        </div>
      </div>

      <button onClick={() => showToast("Preferences saved!")}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md shadow-red-200">
        <Save className="w-4 h-4"/>Save Preferences
      </button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"contact",  label:"Contact Us", Icon:MessageCircle },
  { id:"offices",  label:"Our Offices",Icon:Building      },
  { id:"faqs",     label:"FAQs",       Icon:HelpCircle    },
  { id:"settings", label:"Preferences",Icon:Settings      },
];

export default function UserContactPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("contact");
  const [toast,     setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const renderTab = () => {
    switch (activeTab) {
      case "contact":  return <ContactFormTab showToast={showToast}/>;
      case "offices":  return <OfficesTab     showToast={showToast}/>;
      case "faqs":     return <FaqsTab        showToast={showToast}/>;
      case "settings": return <SettingsTab    showToast={showToast}/>;
      default:         return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Page header */}
        <div className="bg-white border-b border-red-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-white"/>
            </div>
            <span className="text-red-900 font-bold text-sm">Contact & Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xs hidden sm:block">Daksh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">DK</div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-red-400 hover:text-red-700"
              }`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-3 sm:p-5">
          {renderTab()}
        </div>
      </div>

      <Toast msg={toast} onClose={() => setToast("")}/>
    </div>
  );
}