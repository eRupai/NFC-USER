import { useState } from "react";
import {
  Star, ThumbsUp, MessageSquare, Flag,
  CheckCircle2, X, Search,
  BarChart2, TrendingUp,
  Users, ArrowUpRight,
  Send, Pin, AlertCircle,
  Plus, Tag,
} from "lucide-react";
import Topbar from "../shared/components/Topbar";

// ─── DATA ──────────────────────────────────────────────────────────────────────

// Only reviews for this user's own product / NFC cards
const MY_REVIEWS = [
  { id:1, name:"Priya Mehta",   email:"priya.m@gmail.com",   avatar:"PM", bg:"bg-red-500",  rating:5, title:"Absolutely brilliant!",          body:"I've been using this card for 3 months and it's transformed how I share my business details. Writing vCards is seamless.",      date:"31 May 2025", platform:"Google Play", helpful:42, reply:"" },
  { id:2, name:"Aditya Kumar",  email:"aditya.k@tc.in",      avatar:"AK", bg:"bg-red-700",  rating:4, title:"Great, minor UI feedback",         body:"The core functionality is excellent. Would appreciate a dark mode. Support was very responsive to my queries.",                  date:"29 May 2025", platform:"App Store",   helpful:28, reply:"Thank you for the feedback! Dark mode is on our roadmap for Q3." },
  { id:3, name:"Sunita Rao",    email:"sunita@ep.com",        avatar:"SR", bg:"bg-rose-500", rating:2, title:"Crashes on Samsung S23",           body:"Card crashes every time I try to write to NTAG216. I've reinstalled three times. Very frustrating for my business.",            date:"27 May 2025", platform:"Google Play", helpful:15, reply:"" },
  { id:4, name:"Karan Shah",    email:"karan@sx.io",          avatar:"KS", bg:"bg-red-800",  rating:5, title:"Best NFC tool I've tried",         body:"Tried 5 different NFC cards before this one. The analytics and clean dashboard make it miles ahead of the competition.",        date:"25 May 2025", platform:"App Store",   helpful:67, reply:"" },
  { id:5, name:"Divya Nair",    email:"divya@corp.com",       avatar:"DN", bg:"bg-rose-600", rating:5, title:"Game changer for events",          body:"We used this at our corporate event to create 500 smart name tags in under an hour. Attendees were genuinely impressed.",        date:"18 May 2025", platform:"Google Play", helpful:89, reply:"Wow, 500 tags in an hour — that's amazing! Thank you for sharing." },
];

const RATING_DIST = [
  { stars:5, count:3, pct:62 },
  { stars:4, count:1, pct:13 },
  { stars:3, count:0, pct:0  },
  { stars:2, count:1, pct:13 },
  { stars:1, count:0, pct:0  },
];

// Community feedback / feature requests visible to users
const COMMUNITY_FEEDBACK = [
  { id:1, name:"Preethi S.",   avatar:"PS", bg:"bg-red-600",  type:"Feature Request", subject:"Add dark mode to the dashboard",         body:"Would love a dark mode toggle in settings. Staring at a bright screen all day is tough.",                      date:"30 May 2025", status:"under review", votes:48, tag:"UI/UX",       voted:false },
  { id:2, name:"Vikram Iyer",  avatar:"VI", bg:"bg-rose-700", type:"Bug Report",      subject:"Webhook not firing on card scan events",  body:"My webhook endpoint works for write events but never receives scan events. Tested with multiple tools.",          date:"28 May 2025", status:"in progress",  votes:31, tag:"API",         voted:false },
  { id:3, name:"Ananya Patel", avatar:"AP", bg:"bg-red-800",  type:"Feature Request", subject:"CSV export for scan analytics",           body:"Need to export scan data to Excel for monthly client reports. Manual copying is tedious.",                       date:"26 May 2025", status:"planned",      votes:27, tag:"Analytics",   voted:true  },
  { id:4, name:"Rahul Menon",  avatar:"RM", bg:"bg-red-500",  type:"Improvement",     subject:"Faster bulk write speed",                 body:"Bulk writing 200 cards takes ~40 minutes. Competitors claim under 20 mins for the same batch.",                   date:"24 May 2025", status:"under review", votes:22, tag:"Performance", voted:false },
  { id:5, name:"Tarun Kapoor", avatar:"TK", bg:"bg-red-700",  type:"Feature Request", subject:"NFC card templates library",              body:"Would love a library of ready-made NFC templates for events, menus, and business cards that I can deploy quickly.",date:"19 May 2025", status:"planned",      votes:56, tag:"Templates",   voted:true  },
];

const FB_STATUS_STYLES = {
  "under review": "bg-amber-100 text-amber-700 border-amber-200",
  "in progress":  "bg-blue-100 text-blue-700 border-blue-200",
  "planned":      "bg-purple-100 text-purple-700 border-purple-200",
  "resolved":     "bg-green-100 text-green-700 border-green-200",
};

const FB_TYPE_STYLES = {
  "Feature Request": "bg-red-100 text-red-600",
  "Bug Report":      "bg-rose-100 text-rose-600",
  "Improvement":     "bg-amber-100 text-amber-700",
};

const METRICS = [
  { label:"Avg Rating",      val:"4.2", sub:"+0.3 this month", up:true,  Icon:Star          },
  { label:"Total Reviews",   val:"5",   sub:"+2 this week",    up:true,  Icon:MessageSquare },
  { label:"Helpful Votes",   val:"241", sub:"across all reviews", up:true, Icon:ThumbsUp    },
  { label:"Replied",         val:"2",   sub:"of 5 reviews",    up:false, Icon:Send          },
  { label:"My Requests",     val:"2",   sub:"feedback items",  up:true,  Icon:Tag           },
  { label:"Community Votes", val:"184", sub:"on open requests",up:true,  Icon:TrendingUp    },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = "w-3.5 h-3.5" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${size} ${i<=rating?"text-amber-400 fill-amber-400":"text-gray-200 fill-gray-200"}`}/>
      ))}
    </div>
  );
}

function StarPicker({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
          onClick={()=>onChange(i)}>
          <Star className={`w-6 h-6 transition-colors ${(hover||rating)>=i?"text-amber-400 fill-amber-400":"text-gray-200 fill-gray-200"}`}/>
        </button>
      ))}
    </div>
  );
}

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl">
      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0"/>{msg}
      <button onClick={onClose}><X className="w-3 h-3 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ setActiveTab }) {
  const avg = (MY_REVIEWS.reduce((s,r)=>s+r.rating,0)/MY_REVIEWS.length).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {METRICS.map(m => (
          <div key={m.label} className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <m.Icon className="w-3.5 h-3.5 text-red-600"/>
              </div>
              <span className="text-red-400 text-[11px]">{m.label}</span>
            </div>
            <div className="text-red-900 text-xl font-bold">{m.val}</div>
            <div className={`text-[11px] mt-1 ${m.up?"text-green-600":"text-red-500"}`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rating breakdown */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm mb-4">
            <Star className="w-4 h-4 text-red-500"/>Your Rating Summary
          </div>
          <div className="flex items-center gap-6 mb-5">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-900">{avg}</div>
              <StarRow rating={Math.round(parseFloat(avg))} size="w-4 h-4"/>
              <div className="text-red-400 text-[11px] mt-1">{MY_REVIEWS.length} reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {RATING_DIST.map(r => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-red-400 text-[11px] w-3 text-right flex-shrink-0">{r.stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0"/>
                  <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{width:`${r.pct}%`}}/>
                  </div>
                  <span className="text-red-400 text-[11px] w-4 text-right flex-shrink-0">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={()=>setActiveTab("reviews")}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors">
            See all my reviews <ArrowUpRight className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* Top community feedback */}
        <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <ThumbsUp className="w-4 h-4 text-red-500"/>Top Requests
            </div>
            <button onClick={()=>setActiveTab("feedback")} className="text-red-400 text-[11px] hover:text-red-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3"/>
            </button>
          </div>
          <div className="space-y-2.5">
            {COMMUNITY_FEEDBACK.sort((a,b)=>b.votes-a.votes).slice(0,4).map(f => (
              <div key={f.id} className="flex items-start gap-3 p-2.5 bg-red-50/50 rounded-xl border border-red-100">
                <div className={`w-7 h-7 rounded-full ${f.bg} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>{f.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-semibold truncate">{f.subject}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${FB_TYPE_STYLES[f.type]}`}>{f.type}</span>
                    <span className="text-red-400 text-[10px]">{f.votes} votes</span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${FB_STATUS_STYLES[f.status]}`}>{f.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reviews */}
      <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <MessageSquare className="w-4 h-4 text-red-500"/>Recent Reviews on Your Card
          </div>
          <button onClick={()=>setActiveTab("reviews")} className="text-red-400 text-[11px] hover:text-red-700 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3"/>
          </button>
        </div>
        <div className="space-y-3">
          {MY_REVIEWS.slice(0,3).map(r => (
            <div key={r.id} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
              <div className={`w-8 h-8 rounded-full ${r.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{r.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-red-900 text-xs font-semibold">{r.name}</span>
                  <StarRow rating={r.rating} size="w-3 h-3"/>
                  <span className="text-red-400 text-[10px] ml-auto">{r.date}</span>
                </div>
                <div className="text-red-700 text-xs font-medium">{r.title}</div>
                <div className="text-red-400 text-[11px] mt-0.5 truncate">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── REVIEWS TAB (read + reply only) ─────────────────────────────────────────

function ReviewsTab({ showToast }) {
  const [reviews, setReviews] = useState(MY_REVIEWS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch]   = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [replyText, setReplyText]       = useState("");

  const filtered = reviews.filter(r => {
    const matchR = filterRating==="all" || r.rating===parseInt(filterRating);
    const matchQ = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase());
    return matchR && matchQ;
  });

  const handleReply = () => {
    if (!replyText.trim()) { showToast("Please type a reply first"); return; }
    setReviews(p=>p.map(r=>r.id===selected.id?{...r,reply:replyText}:r));
    setSelected(s=>({...s,reply:replyText}));
    setReplyText("");
    showToast("Reply published");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
          <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reviews…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
        </div>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {["all","5","4","3","2","1"].map(s => (
            <button key={s} onClick={()=>setFilterRating(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all flex items-center gap-1 ${filterRating===s?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
              {s!=="all"&&<Star className="w-2.5 h-2.5 fill-current"/>}{s==="all"?"All":s}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length===0 ? (
            <div className="text-center py-10 text-red-400 text-xs">
              <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-40"/>No reviews found
            </div>
          ) : filtered.map(r => (
            <div key={r.id} onClick={()=>{setSelected(r);setReplyText(r.reply||"");}}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.id===r.id?"border-red-400 bg-red-50":"border-red-100 bg-white hover:bg-red-50/50"}`}>
              <div className={`w-8 h-8 rounded-full ${r.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{r.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-red-900 text-xs font-semibold">{r.name}</span>
                  <StarRow rating={r.rating} size="w-3 h-3"/>
                </div>
                <div className="text-red-700 text-[11px] font-medium truncate">{r.title}</div>
                <div className="text-red-400 text-[10px] truncate mt-0.5">{r.body}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{r.platform}</span>
                  {r.reply && <span className="text-[9px] text-green-600 flex items-center gap-0.5"><Send className="w-2.5 h-2.5"/>Replied</span>}
                </div>
              </div>
              <span className="text-[10px] text-red-300 flex-shrink-0">{r.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail — reply only, no moderation actions */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-red-400 text-xs">
            <Star className="w-8 h-8 mb-2 opacity-30"/>Select a review to read & reply
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-red-100">
              <div className={`w-10 h-10 rounded-full ${selected.bg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{selected.avatar}</div>
              <div className="flex-1">
                <div className="text-red-900 text-sm font-semibold">{selected.name}</div>
                <div className="text-red-400 text-xs">{selected.email}</div>
                <StarRow rating={selected.rating} size="w-3.5 h-3.5"/>
              </div>
              <span className="text-red-300 text-xs flex-shrink-0">{selected.date}</span>
            </div>

            <div className="mb-4">
              <div className="text-red-900 text-sm font-bold mb-2">"{selected.title}"</div>
              <div className="bg-red-50 rounded-xl p-3 text-red-700 text-xs leading-relaxed">{selected.body}</div>
            </div>

            <div className="space-y-0 mb-4">
              {[
                { k:"Platform",      v:selected.platform                },
                { k:"Helpful votes", v:`${selected.helpful} votes`       },
              ].map(r => (
                <div key={r.k} className="flex justify-between items-center py-1.5 border-b border-red-50 last:border-0">
                  <span className="text-red-400 text-[11px]">{r.k}</span>
                  <span className="text-red-900 text-[11px] font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {selected.reply && (
              <div className="mb-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-green-700 text-[11px] font-semibold mb-1 flex items-center gap-1"><Send className="w-3 h-3"/>Your reply</div>
                <div className="text-green-800 text-xs leading-relaxed">{selected.reply}</div>
              </div>
            )}

            <div className="mb-2">
              <div className="text-red-700 text-[11px] font-semibold mb-1.5">{selected.reply?"Edit reply":"Reply publicly"}</div>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} rows={3}
                placeholder="Write a public reply to this review…"
                className="w-full bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 placeholder-red-300 px-3 py-2 outline-none focus:border-red-400 resize-none"/>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-red-300">Visible publicly on {selected.platform}</span>
                <button onClick={handleReply}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all">
                  <Send className="w-3 h-3"/>Publish
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FEEDBACK TAB (upvote + submit) ──────────────────────────────────────────

function FeedbackTab({ showToast }) {
  const [feedback, setFeedback]         = useState(COMMUNITY_FEEDBACK);
  const [search, setSearch]             = useState("");
  const [filterType, setFilterType]     = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState({ type:"Feature Request", subject:"", body:"", tag:"" });

  const types    = ["all","Feature Request","Bug Report","Improvement"];
  const statuses = ["all","under review","in progress","planned","resolved"];

  const filtered = feedback.filter(f => {
    const matchT = filterType==="all" || f.type===filterType;
    const matchS = filterStatus==="all" || f.status===filterStatus;
    const matchQ = !search || f.subject.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase());
    return matchT && matchS && matchQ;
  });

  const handleVote = (id) => {
    setFeedback(p=>p.map(f=>f.id===id?{...f,votes:f.voted?f.votes-1:f.votes+1,voted:!f.voted}:f));
  };

  const handleSubmit = () => {
    if (!form.subject.trim() || !form.body.trim()) { showToast("Please fill in all fields"); return; }
    const newItem = {
      id: Date.now(), name:"You", avatar:"ME", bg:"bg-red-600",
      type:form.type, subject:form.subject.trim(), body:form.body.trim(),
      date:"Today", status:"under review", votes:1, tag:form.tag||"General", voted:true,
    };
    setFeedback(p=>[newItem,...p]);
    setForm({ type:"Feature Request", subject:"", body:"", tag:"" });
    setShowForm(false);
    showToast("Feedback submitted — thank you!");
  };

  const inputCls = "w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="space-y-4">

      {/* Submit button / form */}
      {!showForm ? (
        <button onClick={()=>setShowForm(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
          <Plus className="w-4 h-4"/>Submit Feedback or Request
        </button>
      ) : (
        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-red-900 font-bold text-sm">Submit Feedback</h3>
            <button onClick={()=>setShowForm(false)} className="text-red-400 hover:text-red-700">
              <X className="w-4 h-4"/>
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Type</label>
              <div className="flex gap-2 flex-wrap">
                {["Feature Request","Bug Report","Improvement"].map(t => (
                  <button key={t} onClick={()=>setForm(p=>({...p,type:t}))}
                    className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${form.type===t?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Subject *</label>
              <input value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="Briefly describe your request…" className={inputCls}/>
            </div>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Details *</label>
              <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} rows={3} placeholder="Provide more context…" className={`${inputCls} resize-none`}/>
            </div>
            <div>
              <label className="text-red-600 text-xs font-medium block mb-1">Tag <span className="text-red-300">(optional)</span></label>
              <input value={form.tag} onChange={e=>setForm(p=>({...p,tag:e.target.value}))} placeholder="e.g. UI/UX, API, Mobile…" className={inputCls}/>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={()=>setShowForm(false)} className="flex-1 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg hover:bg-red-100 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="flex-[2] bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg shadow-md shadow-red-200 transition-all flex items-center justify-center gap-1.5">
                <Send className="w-4 h-4"/>Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <Search className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search feedback…"
          className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={()=>setFilterType(t)}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all ${filterType===t?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {t==="all"?"All types":t}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={()=>setFilterStatus(s)}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all capitalize ${filterStatus===s?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400"}`}>
            {s==="all"?"All status":s}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      <div className="space-y-3">
        {filtered.length===0 ? (
          <div className="text-center py-10 text-red-400 text-xs bg-white border border-red-100 rounded-2xl">
            <ThumbsUp className="w-7 h-7 mx-auto mb-2 opacity-40"/>No feedback found
          </div>
        ) : filtered.map(f => (
          <div key={f.id} className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm hover:border-red-200 transition-all">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full ${f.bg} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>{f.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-red-900 text-xs font-semibold leading-tight">{f.subject}</div>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0 capitalize ${FB_STATUS_STYLES[f.status]}`}>{f.status}</span>
                </div>
                <div className="text-red-400 text-[11px] leading-relaxed mb-2">{f.body}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${FB_TYPE_STYLES[f.type]}`}>{f.type}</span>
                  <span className="text-[9px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">{f.tag}</span>
                  <span className="text-[10px] text-red-300">{f.name} · {f.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-50">
              <button onClick={()=>handleVote(f.id)}
                className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${f.voted?"bg-red-600 border-red-600 text-white":"bg-white border-red-200 text-red-500 hover:border-red-400 hover:bg-red-50"}`}>
                <ThumbsUp className="w-3 h-3"/>{f.votes} {f.voted?"Voted":"Vote"}
              </button>
              {f.name==="You" && (
                <span className="text-[10px] text-red-400 italic">Your submission</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"overview",  label:"Overview",  Icon:BarChart2     },
  { id:"reviews",   label:"Reviews",   Icon:Star          },
  { id:"feedback",  label:"Feedback",  Icon:ThumbsUp      },
];

export default function UserReviewsFeedbackPage({ onMenuClick }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast]         = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab setActiveTab={setActiveTab}/>;
      case "reviews":  return <ReviewsTab  showToast={showToast}/>;
      case "feedback": return <FeedbackTab showToast={showToast}/>;
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
              <Star className="w-3.5 h-3.5 text-white"/>
            </div>
            <span className="text-red-900 font-bold text-sm">Reviews & Feedback</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-red-100 flex overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab===t.id?"border-red-600 text-red-600":"border-transparent text-red-400 hover:text-red-700"
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

      <Toast msg={toast} onClose={()=>setToast("")}/>
    </div>
  );
}