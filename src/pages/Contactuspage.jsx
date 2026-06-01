import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, X,
  MessageCircle, Globe, Share2, Link2, Code2,
  ExternalLink, ArrowUpRight, ChevronDown,
  Headphones, Users, Zap, Shield, Radio, Star,
  Building, BookOpen, HelpCircle, Rss, Play, MessageSquare,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const OFFICES = [
  {
    city:"Mumbai (HQ)", country:"India", flag:"🇮🇳",
    addr:"Level 12, One BKC, Bandra Kurla Complex, Mumbai 400051",
    phone:"+91 22 6789 0000", email:"india@nfcwriter.com",
    hours:"Mon–Fri 9am–6pm IST",
  },
  {
    city:"New York", country:"USA", flag:"🇺🇸",
    addr:"350 5th Avenue, Suite 4800, New York, NY 10118",
    phone:"+1 (212) 555-0100", email:"us@nfcwriter.com",
    hours:"Mon–Fri 9am–6pm EST",
  },
  {
    city:"London", country:"UK", flag:"🇬🇧",
    addr:"1 Canada Square, Canary Wharf, London E14 5AB",
    phone:"+44 20 7946 0200", email:"uk@nfcwriter.com",
    hours:"Mon–Fri 9am–5pm GMT",
  },
];

const CONTACT_REASONS = [
  "General Inquiry","Technical Support","Billing & Payments","Sales & Pricing",
  "Partnership Opportunity","Feature Request","Bug Report","Enterprise Plan","Other",
];

const SOCIAL_LINKS = [
  { Icon: MessageSquare,label:"Twitter",   handle:"@NFCWriter",    url:"#", color:"text-sky-500",   bg:"bg-sky-50 border-sky-200"   },
  { Icon: Link2,        label:"LinkedIn",  handle:"NFCWriter",     url:"#", color:"text-blue-600",  bg:"bg-blue-50 border-blue-200"  },
  { Icon: Code2,        label:"GitHub",    handle:"nfc-writer",    url:"#", color:"text-red-700",   bg:"bg-red-50 border-red-200"    },
  { Icon: Share2,       label:"Instagram", handle:"@nfcwriter",    url:"#", color:"text-rose-500",  bg:"bg-rose-50 border-rose-200"  },
  { Icon: Rss,          label:"Blog",      handle:"nfcwriter.com", url:"#", color:"text-orange-500",bg:"bg-orange-50 border-orange-200"},
  { Icon: Play,         label:"YouTube",   handle:"NFC Writer",    url:"#", color:"text-red-600",   bg:"bg-red-50 border-red-200"    },
];

const STATS = [
  { Icon: Users,        val:"50,000+",  label:"Happy Customers"   },
  { Icon: Globe,        val:"120+",     label:"Countries Served"  },
  { Icon: Star,         val:"4.9 / 5",  label:"Average Rating"    },
  { Icon: Headphones,   val:"< 2 hrs",  label:"Avg Response Time" },
];

const TEAM = [
  { name:"Arjun Sharma",  role:"Support Lead",      initials:"AS", bg:"bg-red-500"  },
  { name:"Priya Mehta",   role:"Technical Expert",  initials:"PM", bg:"bg-rose-500" },
  { name:"Rohan Das",     role:"Sales Manager",     initials:"RD", bg:"bg-red-600"  },
  { name:"Neha Gupta",    role:"Account Manager",   initials:"NG", bg:"bg-rose-600" },
];

// ─── TOAST ────────────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold bg-red-600 text-white border border-red-400">
      <CheckCircle2 className="w-4 h-4 flex-shrink-0"/>{msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm({ onSuccess }) {
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    company:"", reason:"General Inquiry", message:"", newsletter:false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim())   e.message   = "Required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onSuccess(); }, 1500);
  };

  const inp = (err) => `w-full bg-red-50 border ${err?"border-red-400":"border-red-200"} text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors`;
  const lbl = "text-red-700 text-xs font-semibold block mb-1";

  return (
    <div className="space-y-4">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>First Name *</label>
          <input value={form.firstName} onChange={e=>set("firstName",e.target.value)}
            placeholder="Arjun" className={inp(errors.firstName)}/>
          {errors.firstName && <p className="text-red-500 text-[10px] mt-0.5">{errors.firstName}</p>}
        </div>
        <div>
          <label className={lbl}>Last Name</label>
          <input value={form.lastName} onChange={e=>set("lastName",e.target.value)}
            placeholder="Singh" className={inp(false)}/>
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Email Address *</label>
          <input type="email" value={form.email} onChange={e=>set("email",e.target.value)}
            placeholder="arjun@example.com" className={inp(errors.email)}/>
          {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
        </div>
        <div>
          <label className={lbl}>Phone Number</label>
          <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)}
            placeholder="+91 98765 43210" className={inp(false)}/>
        </div>
      </div>

      {/* Company + Reason */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Company / Organisation</label>
          <input value={form.company} onChange={e=>set("company",e.target.value)}
            placeholder="Your company name" className={inp(false)}/>
        </div>
        <div>
          <label className={lbl}>Reason for Contact</label>
          <div className="relative">
            <select value={form.reason} onChange={e=>set("reason",e.target.value)}
              className={`${inp(false)} pr-8 appearance-none cursor-pointer`}>
              {CONTACT_REASONS.map(r=><option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={lbl}>Message *</label>
        <textarea value={form.message} onChange={e=>set("message",e.target.value)} rows={5}
          placeholder="Tell us how we can help. Include as much detail as possible — the more context you provide, the better we can assist you."
          className={`${inp(errors.message)} resize-none`}/>
        {errors.message && <p className="text-red-500 text-[10px] mt-0.5">{errors.message}</p>}
        <p className="text-red-400 text-[10px] mt-1 text-right">{form.message.length} / 1000</p>
      </div>

      {/* Newsletter */}
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <input type="checkbox" checked={form.newsletter} onChange={e=>set("newsletter",e.target.checked)}
          className="w-4 h-4 accent-red-500 mt-0.5 flex-shrink-0"/>
        <span className="text-red-600 text-xs group-hover:text-red-800 transition-colors">
          Subscribe to product updates and helpful NFC tips. No spam, unsubscribe anytime.
        </span>
      </label>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-70 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-200">
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Sending...</>
          : <><Send className="w-4 h-4"/>Send Message</>
        }
      </button>

      <p className="text-red-400 text-[10px] text-center flex items-center justify-center gap-1">
        <Shield className="w-3 h-3 flex-shrink-0"/>
        Your information is protected and never shared with third parties.
      </p>
    </div>
  );
}

// ─── SUCCESS STATE ────────────────────────────────────────────────────────────

function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 shadow-lg">
        <CheckCircle2 className="w-8 h-8 text-green-600"/>
      </div>
      <h3 className="text-red-900 font-bold text-xl mb-2">Message Sent!</h3>
      <p className="text-red-500 text-sm mb-1 max-w-xs">Thank you for reaching out. We've received your message and will get back to you shortly.</p>
      <p className="text-red-400 text-xs mb-6">Expected response time: <span className="font-semibold text-red-600">2–4 hours</span> on business days.</p>
      <div className="flex gap-3">
        <button onClick={onReset}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          Send Another
        </button>
        <button className="flex items-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
          <HelpCircle className="w-4 h-4"/>Visit FAQ
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ContactUsPage({ onMenuClick }) {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast]         = useState("");
  const [activeOffice, setActiveOffice] = useState(0);

  const showToast = (m)=>{ setToast(m); setTimeout(()=>setToast(""),3000); };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick}/>
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 px-4 sm:px-8 py-5 sm:py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"/>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
                <Mail className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl sm:text-2xl">Contact Us</h1>
                <p className="text-red-100 text-xs">We'd love to hear from you. Get in touch with our team.</p>
              </div>
            </div>
            {/* Stats — inline on sm+ */}
            <div className="flex flex-wrap gap-2">
              {STATS.map(s=>(
                <div key={s.label} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
                  <s.Icon className="w-4 h-4 text-white opacity-80 flex-shrink-0"/>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{s.val}</div>
                    <div className="text-red-100 text-[9px]">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-5 py-5">

          {/* ── Row 1: Form + Contact Info ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

            {/* Contact Form — takes 2 cols */}
            <div className="lg:col-span-2 bg-white border border-red-100 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-red-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200 flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <h2 className="text-red-900 font-bold text-base">Send us a Message</h2>
                  <p className="text-red-400 text-xs">Fill in the form and we'll reply within 2–4 hours.</p>
                </div>
              </div>
              {submitted
                ? <SuccessState onReset={()=>setSubmitted(false)}/>
                : <ContactForm onSuccess={()=>{ setSubmitted(true); showToast("Message sent successfully!"); }}/>
              }
            </div>

            {/* Right: Contact details */}
            <div className="flex flex-col gap-4">

              {/* Contact channels */}
              <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-red-900 font-bold text-sm mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500"/>Contact Channels
                </h3>
                <div className="space-y-3">
                  {[
                    { Icon:Mail,         label:"Email",     val:"support@nfcwriter.com",  sub:"General inquiries",   color:"bg-red-100 text-red-600"   },
                    { Icon:Phone,        label:"Phone",     val:"+91 22 6789 0000",        sub:"Mon–Fri 9am–6pm IST", color:"bg-rose-100 text-rose-600" },
                    { Icon:MessageCircle,label:"Live Chat", val:"Start a conversation",    sub:"Avg. reply in 5 min", color:"bg-red-100 text-red-600"   },
                    { Icon:Globe,        label:"Help Center",val:"help.nfcwriter.com",     sub:"Browse 100+ articles",color:"bg-rose-100 text-rose-600" },
                  ].map(c=>(
                    <div key={c.label} className="flex items-start gap-3 p-3 bg-red-50/60 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group">
                      <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <c.Icon className="w-3.5 h-3.5"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-400 text-[10px] font-medium">{c.label}</div>
                        <div className="text-red-900 text-xs font-semibold truncate">{c.val}</div>
                        <div className="text-red-400 text-[10px]">{c.sub}</div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-red-300 group-hover:text-red-600 flex-shrink-0 mt-1 transition-colors"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business hours */}
              <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-red-900 font-bold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500"/>Business Hours
                </h3>
                <div className="space-y-2">
                  {[
                    {day:"Monday – Friday",  hrs:"9:00 AM – 6:00 PM", tz:"IST", active:true },
                    {day:"Saturday",          hrs:"10:00 AM – 2:00 PM",tz:"IST", active:true },
                    {day:"Sunday",            hrs:"Closed",            tz:"",    active:false},
                  ].map(h=>(
                    <div key={h.day} className={`flex items-center justify-between text-xs py-1.5 px-2 rounded-lg ${h.active?"":"opacity-50"}`}>
                      <span className="text-red-700 font-medium">{h.day}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`${h.active?"text-red-900 font-semibold":"text-red-400"}`}>{h.hrs}</span>
                        {h.tz && <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full font-medium">{h.tz}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"/>
                  <span className="text-green-700 text-xs font-semibold">We're currently online</span>
                </div>
              </div>

              {/* Meet the team */}
              <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-red-900 font-bold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-500"/>Meet Our Team
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM.map(m=>(
                    <div key={m.name} className="flex items-center gap-2 p-2 bg-red-50/60 rounded-xl">
                      <div className={`w-8 h-8 rounded-full ${m.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                        {m.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-red-900 text-[11px] font-semibold truncate">{m.name}</div>
                        <div className="text-red-400 text-[9px] truncate">{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Offices ── */}
          <div className="mb-5">
            <h2 className="text-red-900 font-bold text-base mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-red-500"/>Our Offices
            </h2>
            {/* Office tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {OFFICES.map((o,i)=>(
                <button key={o.city} onClick={()=>setActiveOffice(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeOffice===i?"bg-red-600 border-red-600 text-white shadow-md shadow-red-200":"bg-white border-red-200 text-red-600 hover:border-red-400"
                  }`}>
                  <span className="text-sm">{o.flag}</span>{o.city}
                </button>
              ))}
            </div>

            {/* Active office card + Map placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Office info */}
              <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{OFFICES[activeOffice].flag}</span>
                  <div>
                    <h3 className="text-red-900 font-bold text-base">{OFFICES[activeOffice].city}</h3>
                    <p className="text-red-400 text-xs">{OFFICES[activeOffice].country}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {Icon:MapPin, label:"Address",        val:OFFICES[activeOffice].addr  },
                    {Icon:Phone,  label:"Phone",          val:OFFICES[activeOffice].phone },
                    {Icon:Mail,   label:"Email",          val:OFFICES[activeOffice].email },
                    {Icon:Clock,  label:"Business Hours", val:OFFICES[activeOffice].hours },
                  ].map(r=>(
                    <div key={r.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <r.Icon className="w-3.5 h-3.5 text-red-600"/>
                      </div>
                      <div>
                        <div className="text-red-400 text-[10px] font-medium">{r.label}</div>
                        <div className="text-red-900 text-sm font-medium leading-snug">{r.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>showToast("Opening Google Maps...")}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-all">
                  <MapPin className="w-4 h-4"/>Get Directions
                </button>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm relative">
                {/* SVG Map Illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center">
                  <svg viewBox="0 0 400 280" className="w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
                    {/* Grid lines */}
                    {[0,40,80,120,160,200,240,280].map(y=>(
                      <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
                    ))}
                    {[0,40,80,120,160,200,240,280,320,360,400].map(x=>(
                      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="280" stroke="#ef4444" strokeWidth="0.5" opacity="0.4"/>
                    ))}
                    {/* Roads */}
                    <path d="M0,140 Q100,120 200,140 Q300,160 400,140" fill="none" stroke="#fca5a5" strokeWidth="6" opacity="0.6"/>
                    <path d="M200,0 Q220,70 200,140 Q180,210 200,280" fill="none" stroke="#fca5a5" strokeWidth="6" opacity="0.6"/>
                    <path d="M0,80 Q200,100 400,80" fill="none" stroke="#fecaca" strokeWidth="4" opacity="0.5"/>
                    <path d="M0,200 Q200,180 400,200" fill="none" stroke="#fecaca" strokeWidth="4" opacity="0.5"/>
                    <path d="M100,0 Q120,140 100,280" fill="none" stroke="#fecaca" strokeWidth="4" opacity="0.5"/>
                    <path d="M300,0 Q280,140 300,280" fill="none" stroke="#fecaca" strokeWidth="4" opacity="0.5"/>
                    {/* Blocks */}
                    {[[20,20,60,50],[110,20,70,50],[210,20,65,50],[310,20,70,50],
                      [20,100,60,60],[110,100,70,60],[210,100,65,60],[310,100,70,60],
                      [20,180,60,60],[110,180,70,60],[310,180,70,60]].map(([x,y,w,h],i)=>(
                      <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#fecaca" opacity="0.5"/>
                    ))}
                  </svg>
                </div>
                {/* Pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 border-4 border-white flex items-center justify-center shadow-2xl shadow-red-300 animate-bounce">
                      <MapPin className="w-6 h-6 text-white"/>
                    </div>
                    <div className="mt-2 bg-white border border-red-200 rounded-xl px-3 py-1.5 shadow-lg text-center">
                      <div className="text-red-900 text-xs font-bold">{OFFICES[activeOffice].city}</div>
                      <div className="text-red-400 text-[10px]">{OFFICES[activeOffice].country}</div>
                    </div>
                  </div>
                </div>
                <button onClick={()=>showToast("Opening full map view...")}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white border border-red-200 hover:border-red-400 text-red-600 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5"/>Open in Maps
                </button>
              </div>
            </div>
          </div>

          {/* ── Row 3: Social + FAQ CTA ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

            {/* Social Media */}
            <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-red-900 font-bold text-sm mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500"/>Follow Us
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SOCIAL_LINKS.map(s=>(
                  <button key={s.label} onClick={()=>showToast(`Opening ${s.label}...`)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left hover:shadow-md transition-all group ${s.bg}`}>
                    <s.Icon className={`w-4 h-4 ${s.color} flex-shrink-0 group-hover:scale-110 transition-transform`}/>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold ${s.color}`}>{s.label}</div>
                      <div className="text-red-400 text-[9px] truncate">{s.handle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick FAQ CTA */}
            <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-red-200">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2"/>
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2"/>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mb-3">
                  <HelpCircle className="w-5 h-5 text-white"/>
                </div>
                <h3 className="font-bold text-base mb-1">Have a quick question?</h3>
                <p className="text-red-100 text-xs mb-4">Browse our FAQ section — most questions are answered there instantly, no waiting needed.</p>
                <div className="space-y-1.5 mb-4">
                  {["How do I write NFC cards?","What devices are supported?","How do I top up credits?"].map(q=>(
                    <div key={q} className="flex items-center gap-2 text-xs text-red-100">
                      <div className="w-1 h-1 rounded-full bg-red-200 flex-shrink-0"/>
                      {q}
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 bg-white text-red-600 text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-red-50 transition-colors">
                  Browse FAQs<ArrowUpRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          </div>

          {/* ── Row 4: Partners / Trusted By ── */}
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-red-900 font-bold text-sm mb-4 text-center flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-red-500"/>Trusted by Leading Companies
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {["TechCorp","StartupXYZ","RetailMax","EventPro","HealthPlus","EduTech"].map(c=>(
                <div key={c} className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-bold">
                  <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {c[0]}
                  </div>
                  {c}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              {[{val:"50K+",label:"Active Users"},{val:"2M+",label:"NFC Writes"},{val:"120+",label:"Countries"},{val:"4.9★",label:"App Rating"}].map(s=>(
                <div key={s.label} className="text-center">
                  <div className="text-red-900 font-bold text-lg">{s.val}</div>
                  <div className="text-red-400 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Toast msg={toast} onClose={()=>setToast("")}/>
    </div>
  );
}