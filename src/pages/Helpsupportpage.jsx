import { useState } from "react";
import {
  Search, HelpCircle, MessageCircle, Mail, Phone, FileText,
  ChevronDown, ChevronUp, ChevronRight, ExternalLink, Send,
  CheckCircle2, X, Clock, Radio, Zap, Shield, Book,
  Video, Star, ThumbsUp, ThumbsDown, AlertTriangle,
  ArrowUpRight, Users, CreditCard, Settings, Wifi,
  Package, BarChart2, Link2, PenLine, Plus, RefreshCw,
  Headphones, Globe, MessageSquare,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { Icon: PenLine,    label:"Getting Started",    desc:"Setup guides and tutorials",          count:12, bg:"from-red-500 to-rose-600"   },
  { Icon: CreditCard, label:"NFC Cards",           desc:"Writing, reading and managing cards", count:18, bg:"from-rose-500 to-red-600"   },
  { Icon: CreditCard, label:"Billing & Credits",   desc:"Payments, top-up and invoices",       count:9,  bg:"from-red-600 to-rose-700"   },
  { Icon: Link2,      label:"API & Integrations",  desc:"Webhooks, keys and third-party",      count:15, bg:"from-rose-600 to-red-700"   },
  { Icon: Settings,   label:"Account & Settings",  desc:"Profile, security and preferences",   count:11, bg:"from-red-700 to-rose-800"   },
  { Icon: BarChart2,  label:"Analytics",           desc:"Reports, scans and insights",         count:7,  bg:"from-rose-700 to-red-800"   },
  { Icon: Package,    label:"Bulk Operations",     desc:"Mass writing and imports",            count:6,  bg:"from-red-800 to-rose-900"   },
  { Icon: Shield,     label:"Security & Privacy",  desc:"Data protection and compliance",      count:8,  bg:"from-rose-800 to-red-900"   },
];

const FAQS = [
  { q:"How do I write data to an NFC card?", a:"Select 'Write NFC Card' from the sidebar, choose your data type (URL, vCard, WiFi, etc.), enter your data, then tap your NFC card to the back of your Android device. Make sure NFC is enabled in your device settings and you're using Chrome browser for Web NFC support.", cat:"NFC Cards" },
  { q:"Which devices and browsers support Web NFC?", a:"Web NFC is currently supported on Android devices running Chrome 89 or higher. iOS devices and desktop browsers do not support Web NFC. For iOS, you'll need a dedicated NFC app. Make sure your device has NFC hardware and it's enabled in Settings → Connected Devices.", cat:"NFC Cards" },
  { q:"What NFC card types are supported?", a:"NFC Writer supports NTAG213, NTAG215, NTAG216, MIFARE Classic, MIFARE Ultralight, and DESFire cards. Most standard NFC tags purchased from retailers are NTAG213 or NTAG215 and will work perfectly. Cards must be in NDEF format and not locked/password-protected to write.", cat:"NFC Cards" },
  { q:"How do I top up my credits?", a:"Go to Wallet & Credits in the sidebar. Choose a preset amount (1,000 / 5,000 / 10,000 / 25,000 credits) or enter a custom amount. Select your payment method (Credit Card, UPI, Net Banking, or Wallet) and click 'Proceed to Payment'. Credits are added instantly after successful payment.", cat:"Billing & Credits" },
  { q:"What is the difference between Free and Premium plans?", a:"The Free plan includes 500 credits/month, basic card types, and standard analytics. Premium unlocks 15,000 credits/month, all card types including vCard and Custom JSON, advanced analytics, bulk operations, API access, priority support, and custom templates. Upgrade anytime from the Subscription page.", cat:"Billing & Credits" },
  { q:"How do I generate an API key?", a:"Navigate to API & Integrations in the sidebar, click 'Create New Key', enter a key name and select permissions (Full Access, Read Only, or Custom). Your key is generated instantly. Store it securely — it's only shown once. You can revoke and regenerate keys at any time.", cat:"API & Integrations" },
  { q:"Why is my NFC write failing?", a:"Common causes: (1) NFC is disabled on your device — enable it in Settings. (2) Card is locked or password protected. (3) Card memory is full. (4) Incompatible card type. (5) Browser permissions denied — allow NFC access when prompted. (6) Card removed too quickly during write. Try holding the card steady for 2-3 seconds.", cat:"NFC Cards" },
  { q:"How do I set up a webhook?", a:"Go to API & Integrations → Webhooks → Add Webhook. Enter your endpoint URL and select which events to subscribe to (Card Events, User Events, Scan Events, Analytics). We'll send POST requests to your URL when events occur. Use the Test button to verify your endpoint is working.", cat:"API & Integrations" },
];

const ARTICLES = [
  { Icon: PenLine,   title:"Quick Start: Write Your First NFC Card",      time:"5 min read",  views:"12.4K", cat:"Getting Started" },
  { Icon: Wifi,      title:"Setting Up WiFi NFC Cards for Your Office",   time:"8 min read",  views:"8.2K",  cat:"NFC Cards"       },
  { Icon: Users,     title:"Creating vCard Business Cards with NFC",      time:"6 min read",  views:"7.1K",  cat:"NFC Cards"       },
  { Icon: Package,   title:"Bulk Writing 100+ NFC Cards with CSV Import", time:"10 min read", views:"5.8K",  cat:"Bulk Operations" },
  { Icon: Link2,     title:"Integrating NFC Writer API with Zapier",      time:"12 min read", views:"4.3K",  cat:"API"             },
  { Icon: BarChart2, title:"Understanding Your NFC Scan Analytics",       time:"7 min read",  views:"3.9K",  cat:"Analytics"       },
];

const VIDEOS = [
  { title:"Getting Started with NFC Writer",  dur:"4:32",  views:"25.6K" },
  { title:"Write NFC Cards on Android",       dur:"6:18",  views:"18.2K" },
  { title:"Bulk Operations Tutorial",         dur:"8:45",  views:"11.4K" },
  { title:"API Integration Walkthrough",      dur:"12:30", views:"7.8K"  },
];

const STATUS = [
  { service:"NFC Writing API",     status:"Operational", uptime:"99.98%" },
  { service:"Analytics Service",   status:"Operational", uptime:"99.95%" },
  { service:"Webhook Delivery",    status:"Operational", uptime:"99.92%" },
  { service:"Payment Processing",  status:"Operational", uptime:"99.99%" },
  { service:"Dashboard & Web App", status:"Operational", uptime:"99.97%" },
];

const TICKETS = [
  { id:"TKT-1042", subject:"NFC write failing on NTAG216",  status:"Open",     date:"31 May 2025", priority:"High"   },
  { id:"TKT-1038", subject:"API key permissions question",  status:"Resolved", date:"28 May 2025", priority:"Normal" },
  { id:"TKT-1031", subject:"Bulk import CSV format help",   status:"Resolved", date:"24 May 2025", priority:"Normal" },
];

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a, cat }) {
  const [open, setOpen]       = useState(false);
  const [helpful, setHelpful] = useState(null);
  return (
    <div className={`border rounded-xl transition-all overflow-hidden ${open?"border-red-300 shadow-sm shadow-red-100":"border-red-100 hover:border-red-200"}`}>
      <button onClick={()=>setOpen(p=>!p)} className="w-full flex items-start gap-3 p-4 text-left">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${open?"bg-red-600":"bg-red-100"}`}>
          {open ? <ChevronUp className="w-3 h-3 text-white"/> : <ChevronDown className="w-3 h-3 text-red-500"/>}
        </div>
        <span className={`font-semibold text-sm flex-1 ${open?"text-red-700":"text-red-900"}`}>{q}</span>
        <span className="text-[9px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full flex-shrink-0 hidden sm:block">{cat}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-12">
          <p className="text-red-700 text-sm leading-relaxed mb-3">{a}</p>
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-xs">Was this helpful?</span>
            <button onClick={()=>setHelpful(true)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all ${helpful===true?"bg-green-100 border-green-200 text-green-700":"bg-red-50 border-red-200 text-red-500 hover:border-red-400"}`}>
              <ThumbsUp className="w-3 h-3"/>Yes
            </button>
            <button onClick={()=>setHelpful(false)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all ${helpful===false?"bg-red-100 border-red-300 text-red-700":"bg-red-50 border-red-200 text-red-500 hover:border-red-400"}`}>
              <ThumbsDown className="w-3 h-3"/>No
            </button>
            {helpful===false && <span className="text-red-400 text-xs">We'll improve this answer.</span>}
            {helpful===true  && <span className="text-green-600 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Thanks!</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm({ onClose }) {
  const [subject,  setSubject]  = useState("");
  const [category, setCategory] = useState("NFC Cards");
  const [priority, setPriority] = useState("Normal");
  const [msg,      setMsg]      = useState("");
  const [sent,     setSent]     = useState(false);

  if (sent) return (
    <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm text-center">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-7 h-7 text-green-600"/>
      </div>
      <h3 className="text-red-900 font-bold text-base mb-1">Ticket Submitted!</h3>
      <p className="text-red-500 text-sm mb-1">Ticket ID: <span className="font-bold text-red-700">TKT-{Math.floor(Math.random()*1000)+1050}</span></p>
      <p className="text-red-400 text-xs mb-4">Our team will respond within 2–4 hours for Normal priority.</p>
      <button onClick={onClose||(()=>setSent(false))}
        className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
        Back to Help Center
      </button>
    </div>
  );

  const inp = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";
  return (
    <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-red-900 font-bold text-base mb-1 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-red-500"/>Submit a Support Ticket
      </h2>
      <p className="text-red-400 text-xs mb-4">Describe your issue and our team will get back to you shortly.</p>
      <div className="space-y-3">
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Subject *</label>
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Brief description of your issue" className={inp}/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Category</label>
            <div className="relative">
              <select value={category} onChange={e=>setCategory(e.target.value)} className={`${inp} pr-8 appearance-none cursor-pointer`}>
                {CATEGORIES.map(c=><option key={c.label}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
            </div>
          </div>
          <div>
            <label className="text-red-600 text-xs font-medium block mb-1">Priority</label>
            <div className="relative">
              <select value={priority} onChange={e=>setPriority(e.target.value)} className={`${inp} pr-8 appearance-none cursor-pointer`}>
                {["Low","Normal","High","Urgent"].map(p=><option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
            </div>
          </div>
        </div>
        <div>
          <label className="text-red-600 text-xs font-medium block mb-1">Message *</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4}
            placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, and device/browser information..."
            className={`${inp} resize-none`}/>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-500 flex items-start gap-2">
          <Clock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"/>
          <div><span className="font-semibold text-red-700">Response times: </span>Low: 24h · Normal: 4h · High: 2h · Urgent: 30min</div>
        </div>
      </div>
      <button onClick={()=>{if(subject.trim()&&msg.trim())setSent(true);}}
        disabled={!subject.trim()||!msg.trim()}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
        <Send className="w-4 h-4"/>Submit Ticket
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function HelpSupportPage({ onMenuClick }) {
  const [tab,       setTab]       = useState("faq");
  const [search,    setSearch]    = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCat,    setFaqCat]    = useState("All");

  const faqCats      = ["All", ...new Set(FAQS.map(f=>f.cat))];
  const filteredFAQs = FAQS.filter(f=>{
    const q = faqSearch.toLowerCase();
    return (!q||f.q.toLowerCase().includes(q)||f.a.toLowerCase().includes(q))
      &&(faqCat==="All"||f.cat===faqCat);
  });

  const TABS = [
    {id:"faq",     label:"FAQs",          Icon:HelpCircle   },
    {id:"articles",label:"Articles",      Icon:Book         },
    {id:"videos",  label:"Video Guides",  Icon:Video        },
    {id:"ticket",  label:"Submit Ticket", Icon:MessageCircle},
    {id:"tickets", label:"My Tickets",    Icon:FileText     },
    {id:"status",  label:"System Status", Icon:Radio        },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Compact Hero ── */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 px-4 sm:px-8 py-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"/>
          <div className="relative z-10">
            {/* Title + search in one row on sm+ */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg">
                  <Headphones className="w-4 h-4 text-white"/>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">Help &amp; Support</h1>
                  <p className="text-red-100 text-[11px]">How can we help you today?</p>
                </div>
              </div>
              {/* Search bar */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300 pointer-events-none"/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search articles, FAQs, guides..."
                  className="w-full bg-white/90 border border-white/30 text-red-900 text-sm pl-9 pr-8 py-2.5 rounded-xl focus:outline-none focus:bg-white placeholder-red-300 transition-all shadow-md"/>
                {search && (
                  <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-700">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                )}
              </div>
              {/* Quick stats — inline, hidden on very small */}
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                {[{val:"100+",label:"Articles"},{val:"50+",label:"FAQs"},{val:"< 2h",label:"Response"}].map(s=>(
                  <div key={s.label} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-red-200 flex-shrink-0"/>
                    <span className="text-red-100 text-[11px]"><span className="font-bold text-white">{s.val}</span> {s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-5 py-5">

          {/* ── Quick Contact Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              {Icon:MessageCircle,label:"Live Chat",     desc:"Chat with support",  sub:"Avg. response: 5 min", color:"from-red-500 to-rose-600", action:"Start Chat" },
              {Icon:Mail,          label:"Email Support", desc:"Send us a message",  sub:"Reply within 2 hours", color:"from-rose-500 to-red-600", action:"Send Email" },
              {Icon:Phone,         label:"Phone Support", desc:"+1 (800) NFC-HELP",  sub:"Mon–Fri 9am–6pm IST",  color:"from-red-600 to-rose-700", action:"Call Now"   },
            ].map(c=>(
              <div key={c.label} className="bg-white border border-red-100 rounded-xl p-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-md shadow-red-100 mb-3 group-hover:scale-105 transition-transform`}>
                  <c.Icon className="w-5 h-5 text-white"/>
                </div>
                <div className="text-red-900 font-bold text-sm">{c.label}</div>
                <div className="text-red-500 text-xs mt-0.5">{c.desc}</div>
                <div className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0"/>{c.sub}
                </div>
                <button className="mt-3 text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 transition-colors">
                  {c.action}<ArrowUpRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
          </div>

          {/* ── Browse Categories ── */}
          <div className="mb-5">
            <h2 className="text-red-900 font-bold text-base mb-3 flex items-center gap-2">
              <Book className="w-5 h-5 text-red-500"/>Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {CATEGORIES.map(c=>(
                <button key={c.label} onClick={()=>setTab("articles")}
                  className="bg-white border border-red-100 rounded-xl p-3 text-left hover:border-red-300 hover:shadow-md transition-all group shadow-sm">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform`}>
                    <c.Icon className="w-4 h-4 text-white"/>
                  </div>
                  <div className="text-red-900 text-xs font-semibold leading-tight">{c.label}</div>
                  <div className="text-red-400 text-[10px] mt-0.5 hidden sm:block">{c.desc}</div>
                  <div className="text-red-500 text-[10px] font-semibold mt-1">{c.count} articles</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-0 mb-5 border-b border-red-200 overflow-x-auto">
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
                <t.Icon className="w-3.5 h-3.5"/>{t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: FAQs ── */}
          {tab==="faq"&&(
            <div>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300"/>
                  <input value={faqSearch} onChange={e=>setFaqSearch(e.target.value)} placeholder="Search FAQs..."
                    className="w-full bg-white border border-red-200 text-red-900 text-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 shadow-sm"/>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {faqCats.map(c=>(
                    <button key={c} onClick={()=>setFaqCat(c)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${faqCat===c?"bg-red-600 border-red-600 text-white shadow-sm shadow-red-200":"bg-white border-red-200 text-red-600 hover:border-red-400"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {filteredFAQs.length===0
                ? <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
                    <HelpCircle className="w-10 h-10 text-red-200 mx-auto mb-2"/>
                    <p className="text-red-400 text-sm">No FAQs found. Try a different search or category.</p>
                  </div>
                : <div className="space-y-2">{filteredFAQs.map((faq,i)=><FAQItem key={i} {...faq}/>)}</div>
              }
            </div>
          )}

          {/* ── TAB: Articles ── */}
          {tab==="articles"&&(
            <div>
              <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-red-500"/>Popular Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ARTICLES.map((a,i)=>(
                  <div key={i} className="bg-white border border-red-100 rounded-xl p-4 shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                        <a.Icon className="w-4 h-4 text-red-600 group-hover:text-white transition-colors"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-900 text-sm font-semibold leading-tight mb-1 group-hover:text-red-600 transition-colors">{a.title}</div>
                        <div className="flex items-center gap-3 text-[10px] text-red-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{a.time}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{a.views} views</span>
                          <span className="bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-medium">{a.cat}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-red-300 group-hover:text-red-500 flex-shrink-0 mt-0.5 transition-colors"/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">View All Articles</button>
              </div>
            </div>
          )}

          {/* ── TAB: Videos ── */}
          {tab==="videos"&&(
            <div>
              <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-red-500"/>Video Tutorials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VIDEOS.map((v,i)=>(
                  <div key={i} className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="relative bg-gradient-to-br from-red-100 to-rose-100 h-32 sm:h-40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1"/>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-red-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{v.dur}</span>
                    </div>
                    <div className="p-3">
                      <div className="text-red-900 text-sm font-semibold mb-1 group-hover:text-red-600 transition-colors">{v.title}</div>
                      <div className="text-red-400 text-[10px] flex items-center gap-1"><Users className="w-3 h-3"/>{v.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: Submit Ticket ── */}
          {tab==="ticket"&&(
            <div className="max-w-2xl"><ContactForm onClose={()=>setTab("tickets")}/></div>
          )}

          {/* ── TAB: My Tickets ── */}
          {tab==="tickets"&&(
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-red-500"/>My Support Tickets</h3>
                <button onClick={()=>setTab("ticket")}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all shadow-sm shadow-red-200">
                  <Plus className="w-3.5 h-3.5"/>New Ticket
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-red-50 border-b border-red-100">
                      {["Ticket ID","Subject","Priority","Status","Date","Action"].map(h=>(
                        <th key={h} className="text-left text-red-500 font-semibold px-3 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white border border-red-100">
                    {TICKETS.map((t,i)=>(
                      <tr key={t.id} className={`hover:bg-red-50/50 transition-colors ${i<TICKETS.length-1?"border-b border-red-50":""}`}>
                        <td className="px-3 py-3 text-red-600 font-mono font-semibold">{t.id}</td>
                        <td className="px-3 py-3 text-red-900 font-medium max-w-[180px] truncate">{t.subject}</td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.priority==="High"?"bg-red-100 text-red-700 border-red-200":"bg-red-50 text-red-500 border-red-200"}`}>{t.priority}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit ${t.status==="Open"?"bg-green-100 text-green-700 border-green-200":"bg-red-100 text-red-600 border-red-200"}`}>
                            {t.status==="Open"?<Radio className="w-2.5 h-2.5"/>:<CheckCircle2 className="w-2.5 h-2.5"/>}{t.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-red-400 whitespace-nowrap">{t.date}</td>
                        <td className="px-3 py-3">
                          <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[11px] font-semibold transition-colors">
                            View<ChevronRight className="w-3.5 h-3.5"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB: System Status ── */}
          {tab==="status"&&(
            <div>
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0"/>
                <div>
                  <div className="text-green-800 font-bold text-sm">All Systems Operational</div>
                  <div className="text-green-600 text-xs">Last checked: {new Date().toLocaleTimeString()}</div>
                </div>
                <button className="ml-auto text-green-600 hover:text-green-800 transition-colors"><RefreshCw className="w-4 h-4"/></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[400px]">
                  <thead>
                    <tr className="bg-red-50 border-b border-red-100">
                      {["Service","Status","Uptime (30d)","Indicator"].map(h=>(
                        <th key={h} className="text-left text-red-500 font-semibold px-3 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white border border-red-100">
                    {STATUS.map((s,i)=>(
                      <tr key={s.service} className={`hover:bg-red-50/50 transition-colors ${i<STATUS.length-1?"border-b border-red-50":""}`}>
                        <td className="px-3 py-3 text-red-900 font-medium">{s.service}</td>
                        <td className="px-3 py-3">
                          <span className="flex items-center gap-1.5 text-green-700 text-[11px] font-semibold">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"/>{s.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-red-900 font-bold">{s.uptime}</td>
                        <td className="px-3 py-3">
                          <div className="flex gap-0.5">
                            {Array.from({length:30},(_,j)=>(
                              <div key={j} className={`w-1.5 h-4 rounded-sm ${Math.random()>0.02?"bg-green-400":"bg-red-300"}`}/>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-red-500"/>Recent Incidents</h3>
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0"/>
                  <div>
                    <div className="text-green-800 text-xs font-semibold">No recent incidents</div>
                    <div className="text-green-600 text-[10px]">All systems have been running smoothly for the past 30 days.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Bottom: Community + Resources ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200 mb-3">
                <Users className="w-5 h-5 text-white"/>
              </div>
              <h3 className="text-red-900 font-bold text-sm mb-1">Community Forum</h3>
              <p className="text-red-500 text-xs mb-3">Join 12,000+ NFC Writer users. Share tips, ask questions, get help from the community.</p>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {["12K+ Members","500+ Threads","Active Daily"].map(s=>(
                  <span key={s} className="text-[10px] bg-white border border-red-200 text-red-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm shadow-red-200">
                Visit Forum<ArrowUpRight className="w-3.5 h-3.5"/>
              </button>
            </div>
            <div className="bg-white border border-red-100 rounded-xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md shadow-red-200 mb-3">
                <Link2 className="w-5 h-5 text-white"/>
              </div>
              <h3 className="text-red-900 font-bold text-sm mb-1">Developer Resources</h3>
              <p className="text-red-500 text-xs mb-3">API documentation, SDKs, code samples and integration guides.</p>
              <div className="space-y-1.5 mb-3">
                {["API Reference","SDK Downloads","Code Samples","Changelog"].map(r=>(
                  <button key={r} className="flex items-center gap-2 text-xs text-red-600 hover:text-red-800 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0"/>{r}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-4 py-2 rounded-lg transition-all">
                View Docs<ExternalLink className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}