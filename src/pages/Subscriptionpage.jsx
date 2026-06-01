import { useState } from "react";
import {
  Menu, Search, Sun, Bell, Zap, Crown, CheckCircle2, X,
  Settings, XCircle, CreditCard, Download, Filter,
  BarChart2, RefreshCw, Calendar, Users, Activity, Lock,
  ArrowUpRight, ChevronDown, ArrowRight,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PLANS = {
  monthly: [
    { id:"basic",      Icon:Zap,      name:"Basic",      price:5,   tagline:"Perfect for starters",      features:["5,000 Credits / month","Up to 2 Users","Basic Templates","Email Support"],          bg:"from-rose-400 to-red-500"    },
    { id:"standard",   Icon:BarChart2,name:"Standard",   price:9,   tagline:"Ideal for small teams",      features:["10,000 Credits / month","Up to 5 Users","Advanced Analytics","Priority Support"],  bg:"from-red-500 to-rose-600"    },
    { id:"premium",    Icon:Crown,    name:"Premium",    price:15,  tagline:"Best for growing businesses", features:["15,000 Credits / month","Up to 15 Users","All Features Included","Priority Support"], bg:"from-red-600 to-rose-700", current:true },
    { id:"enterprise", Icon:Users,    name:"Enterprise", price:29,  tagline:"For large organizations",    features:["50,000 Credits / month","Unlimited Users","Custom Integrations","24/7 Support"],     bg:"from-rose-700 to-red-900"    },
  ],
  yearly: [
    { id:"basic",      Icon:Zap,      name:"Basic",      price:48,  tagline:"Perfect for starters",      features:["5,000 Credits / month","Up to 2 Users","Basic Templates","Email Support"],          bg:"from-rose-400 to-red-500"    },
    { id:"standard",   Icon:BarChart2,name:"Standard",   price:86,  tagline:"Ideal for small teams",      features:["10,000 Credits / month","Up to 5 Users","Advanced Analytics","Priority Support"],  bg:"from-red-500 to-rose-600"    },
    { id:"premium",    Icon:Crown,    name:"Premium",    price:144, tagline:"Best for growing businesses", features:["15,000 Credits / month","Up to 15 Users","All Features Included","Priority Support"], bg:"from-red-600 to-rose-700", current:true },
    { id:"enterprise", Icon:Users,    name:"Enterprise", price:278, tagline:"For large organizations",    features:["50,000 Credits / month","Unlimited Users","Custom Integrations","24/7 Support"],     bg:"from-rose-700 to-red-900"    },
  ],
};

const INVOICES = [
  { id:"INV-2025-0001", date:"May 1, 2025",  plan:"Premium (Monthly)", amount:15, card:"4242", status:"Paid"    },
  { id:"INV-2025-0002", date:"Apr 1, 2025",  plan:"Premium (Monthly)", amount:15, card:"4242", status:"Paid"    },
  { id:"INV-2025-0003", date:"Mar 1, 2025",  plan:"Premium (Monthly)", amount:15, card:"4242", status:"Paid"    },
  { id:"INV-2025-0004", date:"Feb 1, 2025",  plan:"Premium (Monthly)", amount:15, card:"4242", status:"Paid"    },
  { id:"INV-2025-0005", date:"Jan 1, 2025",  plan:"Premium (Monthly)", amount:15, card:"4242", status:"Paid"    },
  { id:"INV-2024-0012", date:"Dec 1, 2024",  plan:"Standard (Monthly)", amount:9, card:"4242", status:"Paid"    },
];

const SPEND_CHART = [
  {m:"Dec",v:9},{m:"Jan",v:15},{m:"Feb",v:15},{m:"Mar",v:15},{m:"Apr",v:15},{m:"May",v:15},
];

const USAGE_CHART = [
  {day:"Mon",credits:1200,scans:18000},{day:"Tue",credits:1450,scans:21000},
  {day:"Wed",credits:980, scans:15000},{day:"Thu",credits:1800,scans:26000},
  {day:"Fri",credits:1350,scans:19500},{day:"Sat",credits:620, scans:9000 },
  {day:"Sun",credits:890, scans:12800},
];

const TOOLTIP = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
  itemStyle:{color:"#ef4444"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function RingProgress({ value, max, label, color="#ef4444" }) {
  const pct = Math.min(value/max,1);
  const r=44, cx=52, cy=52, circ=2*Math.PI*r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fecaca" strokeWidth="8"/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
            style={{transition:"stroke-dasharray 0.8s ease"}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-red-900 font-bold text-sm leading-tight">{(pct*100).toFixed(0)}%</span>
          <span className="text-red-400 text-[9px]">used</span>
        </div>
      </div>
      <span className="text-red-700 text-[10px] font-semibold text-center leading-tight">{label}</span>
      <span className="text-red-400 text-[9px]">{value.toLocaleString()} / {max.toLocaleString()}</span>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s={success:"bg-red-600 border-red-400",error:"bg-red-800 border-red-600",info:"bg-rose-600 border-rose-400"};
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold text-white ${s[type]||s.info}`}>
      {type==="success"?<CheckCircle2 className="w-4 h-4"/>:type==="error"?<XCircle className="w-4 h-4"/>:<Bell className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

function ConfirmModal({ title, msg, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <h3 className="text-red-900 font-bold text-base mb-2">{title}</h3>
        <p className="text-red-500 text-sm mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SubscriptionPage({ onMenuClick }) {
  const [tab,         setTab]         = useState("current");
  const [billing,     setBilling]     = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("premium");
  const [autoRenew,   setAutoRenew]   = useState(true);
  const [invFilter,   setInvFilter]   = useState("All Invoices");
  const [toast,       setToast]       = useState({msg:"",type:"success"});
  const [confirm,     setConfirm]     = useState(null);
  const [cardModal,   setCardModal]   = useState(false);
  const [cardNum,     setCardNum]     = useState("");
  const [cardExp,     setCardExp]     = useState("");
  const [cardCvv,     setCardCvv]     = useState("");

  const showToast = (msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:""}),3000);};

  const plans      = PLANS[billing];
  const activePlan = plans.find(p=>p.id===currentPlan)||plans[2];
  const totalPaid  = INVOICES.filter(i=>i.status==="Paid").reduce((s,i)=>s+i.amount,0);
  const filtered   = invFilter==="All Invoices" ? INVOICES : INVOICES.filter(i=>i.status===invFilter);

  const usage = {credits:8742,maxCredits:15000,scans:125630,maxScans:200000,users:2450,maxUsers:5000};
  const creditPct = (usage.credits/usage.maxCredits)*100;

  const handleChoosePlan = (plan) => {
    if (plan.id===currentPlan) return;
    setConfirm({
      title:`Switch to ${plan.name} Plan`,
      msg:`You'll be switched to ${plan.name} at $${plan.price}/${billing==="monthly"?"month":"year"}. Billing updates immediately.`,
      onConfirm:()=>{setCurrentPlan(plan.id);setConfirm(null);showToast(`Switched to ${plan.name} Plan!`);},
    });
  };
  const handleCancelSub = () => setConfirm({
    title:"Cancel Subscription",
    msg:"Are you sure? You'll lose premium features at end of billing cycle.",
    onConfirm:()=>{setConfirm(null);setAutoRenew(false);showToast("Cancellation scheduled.","info");},
  });
  const handleUpdateCard = () => {
    if (!cardNum||cardNum.length<16){showToast("Enter a valid 16-digit card.","error");return;}
    if (!cardExp){showToast("Enter expiry.","error");return;}
    if (!cardCvv||cardCvv.length<3){showToast("Enter a valid CVV.","error");return;}
    setCardModal(false);setCardNum("");setCardExp("");setCardCvv("");
    showToast("Payment method updated!");
  };
  const handleDownloadInvoice = (inv) => {
    const c=`Invoice: ${inv.id}\nDate: ${inv.date}\nPlan: ${inv.plan}\nAmount: $${inv.amount}.00\nStatus: ${inv.status}`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([c],{type:"text/plain"}));a.download=`${inv.id}.txt`;a.click();
    showToast(`Invoice ${inv.id} downloaded.`);
  };
  const handleDownloadAll = () => {
    const rows=INVOICES.map(i=>`${i.id} | ${i.date} | ${i.plan} | $${i.amount}.00 | ${i.status}`);
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/plain"}));a.download="invoices.txt";a.click();
    showToast("All invoices downloaded!");
  };

  const TABS=[
    {id:"current", label:"Current Plan",   Icon:Crown    },
    {id:"upgrade", label:"Upgrade Plan",   Icon:ArrowUpRight},
    {id:"history", label:"Billing History",Icon:CreditCard},
  ];

  const inputCls="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title + Tabs */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <Crown className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Subscription</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage your plan, billing and usage</p>
          </div>
        </div>

        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${tab===t.id?"border-red-500 text-red-700":"border-transparent text-red-400 hover:text-red-700"}`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* ── Row 1: Current Plan + Usage + Billing Summary (stack → 3 col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Current Plan */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="history"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-red-900 text-sm font-semibold">Current Plan</span>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Active
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activePlan.bg} flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0`}>
                <activePlan.Icon className="w-6 h-6 text-white"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-red-900 font-bold text-lg">{activePlan.name} Plan</div>
                <div className="text-red-400 text-xs">{activePlan.tagline}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-red-900 font-bold text-xl">${activePlan.price}<span className="text-red-400 text-sm font-normal">/mo</span></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                {Icon:RefreshCw,  label:"Billing Cycle",   val:"May 1 – May 31, 2025"},
                {Icon:Calendar,   label:"Next Billing",    val:"May 31, 2025"},
                {Icon:Zap,        label:"Credits Included",val:"15,000 / month"},
                {Icon:Activity,   label:"Credits Used",    val:`${usage.credits.toLocaleString()} (${creditPct.toFixed(1)}%)`},
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-2">
                  <r.Icon className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                  <span className="text-red-500 text-xs flex-1">{r.label}</span>
                  <span className="text-red-900 text-xs font-medium">{r.val}</span>
                </div>
              ))}
              <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all" style={{width:`${creditPct}%`}}/>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                <span className="text-red-500 text-xs flex-1">Auto Renewal</span>
                <span className={`text-xs font-semibold ${autoRenew?"text-green-600":"text-red-500"}`}>{autoRenew?"Enabled":"Disabled"}</span>
              </div>
            </div>

            <button onClick={()=>showToast("Opening subscription portal...","info")}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200 mb-2">
              <Settings className="w-4 h-4"/>Manage Subscription
            </button>
            <button onClick={handleCancelSub}
              className="w-full text-red-400 hover:text-red-600 text-xs font-medium py-1.5 transition-colors">
              Cancel Subscription
            </button>
          </div>

          {/* Usage Overview */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="history"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <h3 className="text-red-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-red-500"/>Usage Overview
            </h3>

            {/* Ring progress — row */}
            <div className="flex items-center justify-around mb-4">
              <RingProgress value={usage.credits} max={usage.maxCredits} label="Credits"  color="#ef4444"/>
              <RingProgress value={usage.scans}   max={usage.maxScans}   label="Scans"    color="#f87171"/>
              <RingProgress value={usage.users}   max={usage.maxUsers}   label="Users"    color="#fca5a5"/>
            </div>

            {/* Weekly usage chart */}
            <p className="text-red-500 text-[10px] font-semibold mb-1">Weekly Usage Trend</p>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={USAGE_CHART} margin={{top:2,right:2,left:-32,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="day" tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Line type="monotone" dataKey="credits" name="Credits" stroke="#ef4444" strokeWidth={2} dot={{r:2,fill:"#ef4444",stroke:"#fff",strokeWidth:1}}/>
              </LineChart>
            </ResponsiveContainer>

            <button onClick={()=>showToast("Loading detailed usage...","info")}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
              <BarChart2 className="w-4 h-4"/>View Detailed Usage
            </button>
          </div>

          {/* Billing Summary */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab==="upgrade"?"lg:opacity-40 lg:pointer-events-none":""}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500"/>Billing Summary
              </h3>
              <button onClick={handleDownloadAll}
                className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 transition-all">
                <Download className="w-3.5 h-3.5"/>
              </button>
            </div>

            <div className="space-y-2.5 mb-4">
              {[
                {label:"Monthly Subscription", val:`$${activePlan.price}.00`},
                {label:"Extra Credits",         val:"$0.00"},
                {label:"Taxes",                 val:"$0.00"},
              ].map(r=>(
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-red-500 text-sm">{r.label}</span>
                  <span className="text-red-900 text-sm font-semibold">{r.val}</span>
                </div>
              ))}
              <div className="border-t border-red-100 pt-2.5 flex items-center justify-between">
                <span className="text-red-900 font-bold text-sm">Total Amount</span>
                <span className="text-red-600 font-bold text-lg">${activePlan.price}.00</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-3">
              <div className="text-red-400 text-[10px] font-medium mb-2">Payment Method</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 rounded-md bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">MC</div>
                <span className="text-red-700 text-sm flex-1">•••• •••• •••• 4242</span>
                <button onClick={()=>setCardModal(true)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold bg-white hover:bg-red-50 border border-red-200 px-2 py-1 rounded-md transition-all">
                  Update
                </button>
              </div>
            </div>

            {/* Next billing */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-red-500"/>
                <span className="text-red-900 text-xs font-semibold">Next Billing</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-500 text-xs">May 31, 2025</span>
                <span className="text-red-700 text-xs font-bold">${activePlan.price}.00</span>
              </div>
            </div>

            {/* Spend chart */}
            <p className="text-red-500 text-[10px] font-semibold mb-1">Monthly Spending</p>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={SPEND_CHART} margin={{top:2,right:2,left:-30,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="m" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:7,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Bar dataKey="v" name="$" fill="#ef4444" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Upgrade Plans (full width) ── */}
        <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm mb-4 transition-opacity ${tab==="history"?"lg:opacity-40 lg:pointer-events-none":""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-red-900 font-semibold text-base flex items-center gap-2">
                <Crown className="w-4 h-4 text-red-500"/>Upgrade Your Plan
              </h3>
              <p className="text-red-400 text-xs mt-0.5">Choose the perfect plan for your needs</p>
            </div>
            {/* Billing toggle */}
            <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg p-1">
              <button onClick={()=>setBilling("monthly")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${billing==="monthly"?"bg-red-600 text-white shadow-sm":"text-red-500 hover:text-red-700"}`}>
                Monthly
              </button>
              <button onClick={()=>setBilling("yearly")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${billing==="yearly"?"bg-red-600 text-white shadow-sm":"text-red-500 hover:text-red-700"}`}>
                Yearly
                <span className="text-[8px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plan cards — 2 cols mobile → 4 lg */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {plans.map(plan=>{
              const isCurrent = plan.id===currentPlan;
              return (
                <div key={plan.id}
                  className={`relative rounded-xl border p-4 transition-all ${isCurrent?"border-red-500 bg-red-50 shadow-lg shadow-red-100":"border-red-100 bg-white hover:border-red-300 hover:shadow-md"}`}>
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5"/>Current
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.bg} flex items-center justify-center mb-3 shadow-md shadow-red-100`}>
                    <plan.Icon className="w-5 h-5 text-white"/>
                  </div>
                  <div className="text-red-900 font-bold text-sm mb-0.5">{plan.name}</div>
                  <div className="text-red-900 font-bold text-xl mb-1">
                    ${plan.price}<span className="text-red-400 text-xs font-normal">/{billing==="monthly"?"mo":"yr"}</span>
                  </div>
                  <p className={`text-xs mb-3 ${isCurrent?"text-red-600":"text-red-400"}`}>{plan.tagline}</p>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map(f=>(
                      <li key={f} className="flex items-start gap-1.5">
                        <CheckCircle2 className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isCurrent?"text-red-600":"text-red-400"}`}/>
                        <span className="text-red-600 text-[10px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={()=>handleChoosePlan(plan)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                      isCurrent?"bg-red-600 text-white cursor-default shadow-sm shadow-red-200":
                                "bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 text-red-700"
                    }`}>
                    {isCurrent?"Current Plan":"Choose Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Row 3: Billing History + Stats (stack → 2/3 + 1/3) ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 transition-opacity ${tab==="upgrade"?"lg:opacity-40 lg:pointer-events-none":""}`}>

          {/* Invoices table */}
          <div className="lg:col-span-2 bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h3 className="text-red-900 font-semibold text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500"/>Billing History
              </h3>
              <div className="flex items-center gap-2">
                <select value={invFilter} onChange={e=>setInvFilter(e.target.value)}
                  className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                  {["All Invoices","Paid","Pending","Failed"].map(o=><option key={o}>{o}</option>)}
                </select>
                <button className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:text-red-700 transition-all">
                  <Filter className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[540px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Invoice ID","Date","Plan","Amount","Card","Status",""].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-3 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv,i)=>(
                    <tr key={inv.id} className={`hover:bg-red-50/50 transition-colors ${i<filtered.length-1?"border-b border-red-50":""}`}>
                      <td className="px-3 py-2.5 text-red-600 font-mono font-medium">{inv.id}</td>
                      <td className="px-3 py-2.5 text-red-600">{inv.date}</td>
                      <td className="px-3 py-2.5 text-red-900 font-medium">{inv.plan}</td>
                      <td className="px-3 py-2.5 text-red-900 font-semibold">${inv.amount}.00</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-4 rounded bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center text-[7px] font-bold text-white flex-shrink-0">MC</div>
                          <span className="text-red-400 text-[10px]">••{inv.card}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          inv.status==="Paid"   ?"bg-green-100 text-green-700 border-green-200":
                          inv.status==="Pending"?"bg-amber-100 text-amber-700 border-amber-200":
                                                 "bg-red-100 text-red-700 border-red-200"
                        }`}>{inv.status}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={()=>handleDownloadInvoice(inv)}
                          className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 flex items-center justify-center text-red-400 hover:text-white transition-all">
                          <Download className="w-3 h-3"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!filtered.length&&(
                    <tr><td colSpan={7} className="text-center text-red-300 py-8">No invoices found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Billing Stats */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <h3 className="text-red-900 font-semibold text-sm mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500"/>Billing Statistics
            </h3>
            <div className="space-y-3 mb-5">
              {[
                {Icon:Zap,      label:"Total Paid",     val:`$${totalPaid}.00`, green:true},
                {Icon:CreditCard,label:"Total Invoices", val:String(INVOICES.length)},
                {Icon:Calendar, label:"Last Payment",   val:"May 1, 2025"},
                {Icon:ArrowRight,label:"Next Payment",  val:"May 31, 2025"},
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-2.5 py-2 border-b border-red-50 last:border-0">
                  <r.Icon className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                  <span className="text-red-500 text-sm flex-1">{r.label}</span>
                  <span className={`text-sm font-semibold ${r.green?"text-green-600":"text-red-900"}`}>{r.val}</span>
                </div>
              ))}
            </div>

            <p className="text-red-500 text-[10px] font-semibold mb-1">Monthly Spending (6m)</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={SPEND_CHART} margin={{top:2,right:2,left:-30,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="m" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Bar dataKey="v" name="$" fill="#ef4444" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>

            <button onClick={handleDownloadAll}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
              <Download className="w-3.5 h-3.5"/>Download All Invoices
            </button>
          </div>
        </div>
      </div>

      {/* ── Update Card Modal ── */}
      {cardModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500"/>Update Payment Method
              </h3>
              <button onClick={()=>setCardModal(false)} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-red-600 text-xs font-medium block mb-1">Card Number</label>
                <input value={cardNum} onChange={e=>setCardNum(e.target.value.replace(/\D/g,"").slice(0,16))}
                  placeholder="1234 5678 9012 3456" className={inputCls}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">Expiry Date</label>
                  <input value={cardExp} onChange={e=>setCardExp(e.target.value)} placeholder="MM/YY" className={inputCls}/>
                </div>
                <div>
                  <label className="text-red-600 text-xs font-medium block mb-1">CVV</label>
                  <input type="password" value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,"").slice(0,4))}
                    placeholder="•••" className={inputCls}/>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <Lock className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
                <span className="text-red-500 text-[10px]">Your payment info is encrypted and secure.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setCardModal(false)} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
              <button onClick={handleUpdateCard} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">Update Card</button>
            </div>
          </div>
        </div>
      )}

      {confirm && <ConfirmModal title={confirm.title} msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)}/>}
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}