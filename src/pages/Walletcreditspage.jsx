import { useState, useMemo } from "react";
import {
  Menu, Search, Sun, Bell, Zap, Wallet, Crown, CreditCard, BarChart2,
  ArrowUpRight, ArrowDownLeft, Download, Filter, ChevronDown,
  CheckCircle2, XCircle, X, TrendingUp, Activity, Users,
  PenLine, RefreshCw, Radio, ArrowRight, Lock,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const INIT_TXN = [
  { id:"TXN6852F1A", date:"31 May 2025, 10:45 AM", type:"Top-Up", desc:"Credits added via UPI",          credits:+5000, amount:50.00,  status:"Success" },
  { id:"TXN6851G2B", date:"30 May 2025, 04:20 PM", type:"Usage",  desc:"NFC Card Writing",                credits:-120,  amount:1.20,   status:"Success" },
  { id:"TXN6851E3C", date:"30 May 2025, 02:15 PM", type:"Usage",  desc:"NFC Card Re-Write",               credits:-80,   amount:0.80,   status:"Success" },
  { id:"TXN6850D4D", date:"29 May 2025, 11:30 AM", type:"Top-Up", desc:"Credits added via Card",          credits:+2000, amount:20.00,  status:"Success" },
  { id:"TXN6849C5E", date:"28 May 2025, 09:10 AM", type:"Usage",  desc:"NFC Scan",                        credits:-50,   amount:0.50,   status:"Success" },
  { id:"TXN6848B6F", date:"27 May 2025, 05:35 PM", type:"Top-Up", desc:"Credits added via Net Banking",   credits:+3000, amount:30.00,  status:"Success" },
  { id:"TXN6847A7G", date:"26 May 2025, 01:22 PM", type:"Usage",  desc:"NFC Card Writing",                credits:-150,  amount:1.50,   status:"Success" },
  { id:"TXN6846H8D", date:"25 May 2025, 09:50 AM", type:"Usage",  desc:"NFC Card Re-Write",               credits:-100,  amount:1.00,   status:"Success" },
  { id:"TXN6845J9E", date:"24 May 2025, 03:15 PM", type:"Top-Up", desc:"Credits added via UPI",           credits:+1000, amount:10.00,  status:"Success" },
  { id:"TXN6844K0F", date:"23 May 2025, 11:05 AM", type:"Usage",  desc:"Bulk NFC Writing",                credits:-500,  amount:5.00,   status:"Success" },
  { id:"TXN6843L1G", date:"22 May 2025, 08:30 AM", type:"Usage",  desc:"NFC Scan",                        credits:-30,   amount:0.30,   status:"Success" },
  { id:"TXN6842M2H", date:"21 May 2025, 04:50 PM", type:"Top-Up", desc:"Credits added via Wallet",        credits:+2000, amount:20.00,  status:"Success" },
  { id:"TXN6841N3I", date:"20 May 2025, 02:20 PM", type:"Usage",  desc:"NFC Card Writing",                credits:-200,  amount:2.00,   status:"Failed"  },
  { id:"TXN6840O4J", date:"19 May 2025, 10:10 AM", type:"Usage",  desc:"NFC Card Re-Write",               credits:-90,   amount:0.90,   status:"Success" },
  { id:"TXN6839P5K", date:"18 May 2025, 07:45 AM", type:"Top-Up", desc:"Credits added via Card",          credits:+5000, amount:50.00,  status:"Success" },
];

const CREDIT_AMOUNTS = [
  { credits:1000,  price:10,  label:"1,000"  },
  { credits:5000,  price:50,  label:"5,000"  },
  { credits:10000, price:95,  label:"10,000" },
  { credits:25000, price:225, label:"25,000" },
];

const PAYMENT_METHODS = [
  { id:"card",    Icon:CreditCard,    label:"Credit / Debit Card" },
  { id:"upi",     Icon:Zap,           label:"UPI"                },
  { id:"netbank", Icon:Activity,      label:"Net Banking"        },
  { id:"wallet",  Icon:Wallet,        label:"Wallet"             },
];

const SPEND_CHART = [
  {l:"1 May",v:200},{l:"8 May",v:480},{l:"15 May",v:350},{l:"22 May",v:825},{l:"31 May",v:520},
];

const USAGE_CHART = [
  {day:"Mon",topup:0,   used:120},{day:"Tue",topup:2000,used:80},
  {day:"Wed",topup:0,   used:200},{day:"Thu",topup:5000,used:500},
  {day:"Fri",topup:0,   used:150},{day:"Sat",topup:3000,used:30},
  {day:"Sun",topup:1000,used:90},
];

const BREAKDOWN = [
  {Icon:PenLine,    label:"Card Writing", val:7250, color:"bg-red-500"  },
  {Icon:RefreshCw,  label:"Re-Writing",   val:3200, color:"bg-rose-500" },
  {Icon:Radio,      label:"Scans",        val:1450, color:"bg-red-400"  },
  {Icon:Zap,        label:"Other",        val:550,  color:"bg-rose-400" },
];

const TOOLTIP = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:8,fontSize:11},
  labelStyle:{color:"#991b1b"},
  itemStyle:{color:"#ef4444"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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

function PaymentModal({ amount, credits, method, onClose, onConfirm }) {
  const pm = PAYMENT_METHODS.find(m=>m.id===method);
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white border border-red-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-red-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-red-900 font-bold text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-red-500"/>Confirm Payment
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 space-y-2">
          {[{l:"Credits",v:`${credits.toLocaleString()} Credits`},{l:"Amount",v:`$${amount.toFixed(2)} USD`},{l:"Payment",v:pm?.label||method}].map(r=>(
            <div key={r.l} className="flex items-center justify-between text-sm">
              <span className="text-red-500">{r.l}</span>
              <span className="text-red-900 font-semibold">{r.v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          <Lock className="w-3.5 h-3.5 text-red-400 flex-shrink-0"/>
          <span className="text-red-500 text-xs">Your payment is encrypted and secure.</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-lg transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-md shadow-red-200">Confirm &amp; Pay</button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, total, perPage, onPage }) {
  const tp = Math.ceil(total/perPage); if (tp<=1) return null;
  const pages = tp<=7?Array.from({length:tp},(_,i)=>i+1):
    page<=3?[1,2,3,"...",tp]:page>=tp-2?[1,"...",tp-2,tp-1,tp]:[1,"...",page-1,page,page+1,"...",tp];
  return (
    <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-red-100 flex-wrap">
      <button onClick={()=>onPage(Math.max(1,page-1))} disabled={page===1}
        className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center text-xs transition-all">‹</button>
      {pages.map((p,i)=>(
        <button key={i} onClick={()=>typeof p==="number"&&onPage(p)}
          className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-all ${
            p===page?"bg-red-600 border-red-600 text-white":
            p==="..."?"border-transparent text-red-300 cursor-default":
            "border-red-200 text-red-500 hover:border-red-500 hover:text-red-700"
          }`}>{p}</button>
      ))}
      <button onClick={()=>onPage(Math.min(tp,page+1))} disabled={page===tp}
        className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:border-red-500 hover:text-red-700 disabled:opacity-40 flex items-center justify-center text-xs transition-all">›</button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function WalletCreditsPage({ onMenuClick }) {
  const [transactions, setTransactions] = useState(INIT_TXN);
  const [credits,      setCredits]      = useState(12450);
  const [selAmount,    setSelAmount]    = useState(1);
  const [customAmt,    setCustomAmt]    = useState("");
  const [selMethod,    setSelMethod]    = useState("card");
  const [txFilter,     setTxFilter]     = useState("All Transactions");
  const [txPage,       setTxPage]       = useState(1);
  const [summaryRange, setSummaryRange] = useState("This Month");
  const [showPayModal, setShowPayModal] = useState(false);
  const [toast,        setToast]        = useState({msg:"",type:"success"});
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  const PER_PAGE = 8;
  const TOTAL    = 15000;
  const USED     = TOTAL - credits;
  const usedPct  = (USED/TOTAL)*100;
  const availPct = (credits/TOTAL)*100;
  const usdVal   = (credits*0.01).toFixed(2);

  const showToast = (msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast({msg:""}),3000);};

  const topupCredits = customAmt&&!isNaN(Number(customAmt))&&Number(customAmt)>0 ? Number(customAmt) : CREDIT_AMOUNTS[selAmount].credits;
  const topupAmount  = customAmt&&!isNaN(Number(customAmt))&&Number(customAmt)>0 ? (Number(customAmt)*0.01).toFixed(2) : CREDIT_AMOUNTS[selAmount].price;

  const handleConfirmPayment = () => {
    const added = Number(topupCredits);
    setCredits(p=>p+added);
    const newTx = {
      id:`TXN${Math.random().toString(36).slice(2,10).toUpperCase()}`,
      date:new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),
      type:"Top-Up", desc:`Credits added via ${PAYMENT_METHODS.find(m=>m.id===selMethod)?.label}`,
      credits:+added, amount:parseFloat(topupAmount), status:"Success",
    };
    setTransactions(p=>[newTx,...p]);
    setShowPayModal(false); setCustomAmt("");
    showToast(`${added.toLocaleString()} credits added successfully!`);
  };

  const handleExport = () => {
    const hdr="Date,ID,Type,Description,Credits,Amount,Status";
    const rows=filteredTx.map(t=>`${t.date},${t.id},${t.type},${t.desc},${t.credits},${t.amount},${t.status}`);
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([[hdr,...rows].join("\n")],{type:"text/csv"}));a.download="transactions.csv";a.click();
    showToast("Transactions exported!");
  };

  const filteredTx = useMemo(()=>{
    if (txFilter==="All Transactions") return transactions;
    if (txFilter==="Top-Up") return transactions.filter(t=>t.type==="Top-Up");
    if (txFilter==="Usage")  return transactions.filter(t=>t.type==="Usage");
    return transactions.filter(t=>t.status===txFilter);
  },[transactions,txFilter]);

  const paginated = filteredTx.slice((txPage-1)*PER_PAGE,txPage*PER_PAGE);
  const totalAdded = transactions.filter(t=>t.type==="Top-Up").reduce((s,t)=>s+t.credits,0);
  const totalUsed  = transactions.filter(t=>t.type==="Usage").reduce((s,t)=>s+Math.abs(t.credits),0);

  // Compact ring — 120×120 works on all screens
  const R=50, CX=60, CY=60, CIRC=2*Math.PI*R;
  const availDash=(availPct/100)*CIRC;

  const inputCls="w-full bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder-red-300 transition-colors";

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-5 py-4">

        {/* Title + Plan Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <Wallet className="w-5 h-5 text-white"/>
            </div>
            <div>
              <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Wallet &amp; Credits</h1>
              <p className="text-red-400 text-xs hidden sm:block">Manage balance, top-up and transactions</p>
            </div>
          </div>
          {/* Plan banner — compact on mobile */}
          <div className="flex items-center gap-3 bg-white border border-red-200 rounded-xl px-4 py-2.5 shadow-sm w-full sm:w-fit">
            <Crown className="w-4 h-4 text-amber-500 flex-shrink-0"/>
            <div>
              <div className="text-red-400 text-[10px]">Current Plan</div>
              <div className="text-red-900 font-bold text-sm">Premium · 15,000 / month</div>
            </div>
          </div>
        </div>

        {/* ── Row 1: Balance + Top-Up + Summary — 1 col → 2 md → 3 lg ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Balance Overview */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 mb-3">
              <Wallet className="w-4 h-4 text-white"/>
            </div>

            {/* Compact donut + legend — side by side */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0" style={{width:120,height:120}}>
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke="#fecaca" strokeWidth="10"/>
                  <circle cx={CX} cy={CY} r={R} fill="none" stroke="#ef4444" strokeWidth="10"
                    strokeDasharray={`${availDash} ${CIRC}`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-red-400 text-[9px]">Total</span>
                  <span className="text-red-900 font-bold text-base">{TOTAL.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  {dot:"bg-red-500",  label:"Available", val:`${credits.toLocaleString()} (${availPct.toFixed(0)}%)`},
                  {dot:"bg-red-100 border border-red-200", label:"Used", val:`${USED.toLocaleString()} (${usedPct.toFixed(0)}%)`},
                ].map(l=>(
                  <div key={l.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${l.dot} flex-shrink-0`}/>
                    <span className="text-red-500 text-xs flex-1">{l.label}</span>
                    <span className="text-red-900 text-xs font-semibold">{l.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-red-400 text-xs mb-1">Available Credits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-red-900 font-bold text-3xl">{credits.toLocaleString()}</span>
                <span className="text-green-600 text-sm font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5"/>12.5%
                </span>
              </div>
              <p className="text-red-400 text-xs mt-1">≈ ${usdVal} USD</p>
            </div>

            <div className="flex flex-col xs:flex-row gap-2">
              <button onClick={()=>document.getElementById("topup-section")?.scrollIntoView({behavior:"smooth"})}
                className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-200">
                <Zap className="w-4 h-4"/>Top-Up
              </button>
              <button onClick={()=>setTxPage(1)}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-sm font-semibold py-2.5 rounded-xl transition-all">
                View History
              </button>
            </div>
          </div>

          {/* Top-Up Credits */}
          <div id="topup-section" className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-red-900 font-semibold text-base mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-red-500"/>Top-Up Credits
            </h2>

            {/* Amounts — always 2×2 on mobile, 4 col on sm */}
            <div className="mb-3">
              <p className="text-red-600 text-xs font-medium mb-2">Select Amount</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CREDIT_AMOUNTS.map((a,i)=>(
                  <button key={i} onClick={()=>{setSelAmount(i);setCustomAmt("");}}
                    className={`py-2.5 rounded-xl border text-center transition-all ${
                      selAmount===i&&!customAmt?"bg-red-600 border-red-600 shadow-md shadow-red-200":"bg-red-50 border-red-200 hover:border-red-400"
                    }`}>
                    <div className={`font-bold text-sm ${selAmount===i&&!customAmt?"text-white":"text-red-900"}`}>{a.label}</div>
                    <div className={`text-[10px] ${selAmount===i&&!customAmt?"text-red-200":"text-red-400"}`}>Credits · ${a.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="mb-3">
              <p className="text-red-600 text-xs font-medium mb-2">Other Amount</p>
              <div className="relative">
                <input type="number" value={customAmt} onChange={e=>setCustomAmt(e.target.value)}
                  placeholder="Enter custom amount" className={inputCls}/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-xs">Credits</span>
              </div>
            </div>

            {/* Payment methods — 2×2 always */}
            <div className="mb-4">
              <p className="text-red-600 text-xs font-medium mb-2">Payment Method</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m=>(
                  <button key={m.id} onClick={()=>setSelMethod(m.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      selMethod===m.id?"bg-red-100 border-red-500 shadow-sm":"bg-red-50 border-red-200 hover:border-red-400"
                    }`}>
                    <m.Icon className={`w-4 h-4 flex-shrink-0 ${selMethod===m.id?"text-red-600":"text-red-400"}`}/>
                    <span className={`text-xs font-semibold leading-tight ${selMethod===m.id?"text-red-700":"text-red-500"}`}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-1 mb-3 text-xs">
              <span className="text-red-500">You'll receive:</span>
              <span className="text-red-900 font-bold">{Number(topupCredits).toLocaleString()} Credits</span>
              <span className="text-red-400">for</span>
              <span className="text-red-600 font-bold">${topupAmount} USD</span>
            </div>

            <button onClick={()=>{if(!selMethod){showToast("Select a payment method.","error");return;}setShowPayModal(true);}}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
              Proceed to Payment<ArrowRight className="w-4 h-4"/>
            </button>
          </div>

          {/* Credit Summary */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-red-900 font-semibold text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500"/>Credit Summary
              </h2>
              <select value={summaryRange} onChange={e=>setSummaryRange(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-xs px-2 py-1 rounded-lg outline-none cursor-pointer">
                {["This Month","Last Month","Last 7 Days","All Time"].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="space-y-3 mb-4">
              {[
                {Icon:ArrowUpRight,  label:"Total Added",    val:`+${totalAdded.toLocaleString()}`,     color:"text-green-600",  bg:"bg-green-100"},
                {Icon:ArrowDownLeft, label:"Total Used",     val:`-${totalUsed.toLocaleString()}`,      color:"text-red-600",    bg:"bg-red-100"},
                {Icon:TrendingUp,    label:"Net Credits",    val:`+${(totalAdded-totalUsed).toLocaleString()}`, color:"text-red-700", bg:"bg-red-50 border border-red-200"},
                {Icon:Activity,      label:"Avg Daily Usage",val:`${(totalUsed/31).toFixed(1)}`,        color:"text-rose-600",   bg:"bg-rose-100"},
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${r.bg} flex items-center justify-center flex-shrink-0`}>
                    <r.Icon className={`w-4 h-4 ${r.color}`}/>
                  </div>
                  <span className="text-red-600 text-sm flex-1">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.val}</span>
                </div>
              ))}
            </div>

            <p className="text-red-500 text-[10px] font-semibold mb-1">Credits Trend</p>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={[{v:20},{v:35},{v:25},{v:45},{v:30},{v:50},{v:40},{v:60},{v:45},{v:70}].map((d,i)=>({i,v:d.v}))} margin={{top:2,right:2,left:0,bottom:0}}>
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-400 text-xs">Credits Remaining</span>
                <span className="text-red-900 text-xs font-bold">{availPct.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-700"
                  style={{width:`${availPct}%`}}/>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-red-300 text-[10px]">{credits.toLocaleString()} available</span>
                <span className="text-red-300 text-[10px]">{TOTAL.toLocaleString()} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Spending Chart + Weekly Bar — 1 col → 2 lg ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Spending Overview + Breakdown */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-red-900 font-semibold text-base mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500"/>Spending Overview
            </h2>

            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={SPEND_CHART} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Area type="monotone" dataKey="v" name="Credits" stroke="#ef4444" strokeWidth={2.5}
                  fill="url(#spendGrad)" dot={{r:4,fill:"#ef4444",stroke:"#fff",strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>

            <div className="border-t border-red-100 pt-4 mt-2">
              <h3 className="text-red-900 text-xs font-semibold mb-3">Credits Usage Breakdown</h3>
              <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                  style={{width:`${availPct.toFixed(0)}%`}}/>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BREAKDOWN.map(u=>(
                  <div key={u.label} className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center">
                    <div className={`w-7 h-7 rounded-lg ${u.color} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                      <u.Icon className="w-3.5 h-3.5 text-white"/>
                    </div>
                    <div className="text-red-400 text-[9px] mb-0.5">{u.label}</div>
                    <div className="text-red-900 font-bold text-sm">{u.val.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
            <h2 className="text-red-900 font-semibold text-base mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-red-500" />Weekly Credit Activity
            </h2>
            <div className="flex gap-3 mb-2">
              {[{l:"Top-Up",c:"#ef4444"},{l:"Used",c:"#fca5a5"}].map(s=>(
                <div key={s.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{background:s.c}}/>
                  <span className="text-red-400 text-[10px]">{s.l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={USAGE_CHART} margin={{top:4,right:4,left:-20,bottom:0}} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                <XAxis dataKey="day" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                <Tooltip {...TOOLTIP}/>
                <Bar dataKey="topup" name="Top-Up" fill="#ef4444" radius={[3,3,0,0]}/>
                <Bar dataKey="used"  name="Used"   fill="#fca5a5" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                {Icon:ArrowUpRight,label:"Total Topped Up",val:`+${totalAdded.toLocaleString()}`,color:"text-green-600",bg:"bg-green-100"},
                {Icon:ArrowDownLeft,label:"Total Consumed", val:`-${totalUsed.toLocaleString()}`, color:"text-red-600", bg:"bg-red-100"},
                {Icon:Zap,          label:"Available Now",  val:credits.toLocaleString(),         color:"text-red-700", bg:"bg-red-50 border border-red-200"},
                {Icon:TrendingUp,   label:"USD Value",      val:`$${usdVal}`,                     color:"text-rose-600",bg:"bg-rose-100"},
              ].map(s=>(
                <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <s.Icon className={`w-4 h-4 ${s.color}`}/>
                  </div>
                  <div className="min-w-0">
                    <div className="text-red-400 text-[9px] truncate">{s.label}</div>
                    <div className={`font-bold text-sm ${s.color}`}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-red-900 font-semibold text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500"/>Transaction History
            </h2>
            <div className="flex items-center gap-2">
              <select value={txFilter} onChange={e=>{setTxFilter(e.target.value);setTxPage(1);}}
                className="bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1.5 rounded-lg outline-none cursor-pointer">
                {["All Transactions","Top-Up","Usage","Success","Failed"].map(o=><option key={o}>{o}</option>)}
              </select>
              <button onClick={handleExport}
                className="flex items-center gap-1.5 bg-red-50 border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all">
                <Download className="w-3.5 h-3.5"/>Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-red-100">
            <table className="w-full text-xs min-w-[540px]">
              <thead>
                <tr className="bg-red-50 border-b border-red-100">
                  {["Date & Time","Transaction ID","Type","Description","Credits","Amount","Status"].map(h=>(
                    <th key={h} className="text-left text-red-500 font-semibold px-2.5 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!paginated.length
                  ? <tr><td colSpan={7} className="text-center text-red-300 py-8">No transactions found</td></tr>
                  : paginated.map(t=>(
                  <tr key={t.id} className="border-b border-red-50 hover:bg-red-50/50 transition-colors">
                    <td className="px-2.5 py-2.5 text-red-400 text-[10px] whitespace-nowrap">{t.date}</td>
                    <td className="px-2.5 py-2.5 text-red-600 font-mono text-[10px]">{t.id}</td>
                    <td className="px-2.5 py-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                        t.type==="Top-Up"?"bg-green-100 text-green-700 border-green-200":"bg-red-100 text-red-700 border-red-200"
                      }`}>{t.type}</span>
                    </td>
                    <td className="px-2.5 py-2.5 text-red-700 max-w-[120px] truncate">{t.desc}</td>
                    <td className={`px-2.5 py-2.5 font-bold text-xs ${t.credits>0?"text-green-600":"text-red-600"}`}>
                      {t.credits>0?"+":""}{t.credits.toLocaleString()}
                    </td>
                    <td className="px-2.5 py-2.5 text-red-900 font-semibold">${t.amount.toFixed(2)}</td>
                    <td className="px-2.5 py-2.5">
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${t.status==="Success"?"text-green-600":"text-red-500"}`}>
                        {t.status==="Success"?<CheckCircle2 className="w-3 h-3"/>:<XCircle className="w-3 h-3"/>}{t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={txPage} total={filteredTx.length} perPage={PER_PAGE} onPage={setTxPage}/>
        </div>
      </div>

      {showPayModal && (
        <PaymentModal amount={parseFloat(topupAmount)} credits={Number(topupCredits)} method={selMethod}
          onClose={()=>setShowPayModal(false)} onConfirm={handleConfirmPayment}/>
      )}
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}