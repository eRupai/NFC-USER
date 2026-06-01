import { useState, useRef } from "react";
import {
  Menu, Search, Sun, Bell, Zap, ChevronDown, Upload,
  Play, Zap as ZapIcon, FileText, CheckCircle2, XCircle,
  Clock, ArrowRight, RefreshCw, AlertTriangle, Download,
  BarChart2, Radio, Package, Timer,
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TEMPLATES = [
  "Business Card Template","Social Profile Template",
  "Product Info Template","Event Access Template","Custom URL Template",
];

const PREVIEW_ROWS = [
  { id:1, name:"John Doe",     type:"vCard", url:"https://johndoe.com"     },
  { id:2, name:"Alice Smith",  type:"Text",  url:"https://alicesmith.com"  },
  { id:3, name:"Michael Lee",  type:"URL",   url:"https://michaellee.com"  },
  { id:4, name:"Emma Brown",   type:"vCard", url:"https://emmabrown.com"   },
  { id:5, name:"David Wilson", type:"Text",  url:"https://davidwilson.com" },
];

const RECENT_BATCHES = [
  { id:"#BULK250501", file:"business_cards.csv", total:250, success:198, failed:32, status:"Completed", date:"01 May 2025" },
  { id:"#BULK250430", file:"team_data.xlsx",      total:150, success:145, failed:5,  status:"Completed", date:"30 Apr 2025" },
  { id:"#BULK250429", file:"leads_import.csv",    total:300, success:280, failed:20, status:"Completed", date:"29 Apr 2025" },
  { id:"#BULK250428", file:"contacts.xlsx",       total:120, success:120, failed:0,  status:"Completed", date:"28 Apr 2025" },
  { id:"#BULK250427", file:"partners.csv",        total:200, success:180, failed:20, status:"Completed", date:"27 Apr 2025" },
];

const ACTIVITY = [
  { ok:true,  msg:"Card 198 written successfully", time:"2 sec ago"  },
  { ok:true,  msg:"Card 197 written successfully", time:"4 sec ago"  },
  { ok:false, msg:"Card 196 failed to write",      time:"6 sec ago"  },
  { ok:true,  msg:"Card 195 written successfully", time:"8 sec ago"  },
  { ok:true,  msg:"Card 194 written successfully", time:"10 sec ago" },
];

const CHART_DATA = [
  {l:"26 Apr",v:80},{l:"27 Apr",v:130},{l:"28 Apr",v:100},
  {l:"29 Apr",v:270},{l:"30 Apr",v:160},{l:"01 May",v:210},
];

const PIE_DATA = [
  {name:"Success",value:78,fill:"#ef4444"},
  {name:"Failed", value:12,fill:"#f87171"},
  {name:"Pending",value:10,fill:"#fecaca"},
];

const AVG_SPARK = [
  {i:0,v:18},{i:1,v:14},{i:2,v:16},{i:3,v:10},
  {i:4,v:13},{i:5,v:8},{i:6,v:11},{i:7,v:6},
];

const TOOLTIP = {
  contentStyle:{background:"#fff",border:"1px solid #fecaca",borderRadius:10,fontSize:11},
  labelStyle:{color:"#991b1b"},
  itemStyle:{color:"#ef4444"},
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <button onClick={()=>onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked?"bg-red-600":"bg-red-100 border border-red-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked?"translate-x-5":"translate-x-0.5"}`}/>
    </button>
  );
}

function UploadZone({ label, accepts, onFile, file }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);
  const handleDrop = (e)=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)onFile(f);};
  return (
    <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
      onDrop={handleDrop} onClick={()=>ref.current.click()}
      className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
        drag ?"border-red-400 bg-red-50":
        file ?"border-red-400 bg-red-50":
              "border-red-200 hover:border-red-400 hover:bg-red-50"
      }`}>
      <input ref={ref} type="file" accept={accepts} className="hidden" onChange={e=>onFile(e.target.files[0])}/>
      {file ? (
        <>
          <CheckCircle2 className="w-8 h-8 text-red-500 mb-2"/>
          <p className="text-red-700 text-sm font-semibold">{file.name}</p>
          <p className="text-red-400 text-xs mt-1">Click to change file</p>
        </>
      ) : (
        <>
          <Upload className="w-7 h-7 text-red-300 mb-2"/>
          <p className="text-red-700 text-sm font-medium mb-1">{label}</p>
          <p className="text-red-400 text-xs mb-3">Drag & drop or click to browse</p>
          <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow-sm shadow-red-200">Browse File</button>
          <p className="text-red-300 text-[10px] mt-1.5">{accepts}</p>
        </>
      )}
    </div>
  );
}

function SectionBadge({ num, label, Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-red-200">{num}</div>
      <Icon className="w-4 h-4 text-red-500"/>
      <h2 className="text-red-900 font-bold text-sm">{label}</h2>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BulkOperationsPage({ onMenuClick }) {
  const [template,       setTemplate]       = useState(TEMPLATES[0]);
  const [writeMode,      setWriteMode]      = useState("sequential");
  const [dataFile,       setDataFile]       = useState(null);
  const [csvFile,        setCsvFile]        = useState(null);
  const [lockAfter,      setLockAfter]      = useState(true);
  const [verifyAfter,    setVerifyAfter]    = useState(true);
  const [skipLocked,     setSkipLocked]     = useState(false);
  const [running,        setRunning]        = useState(false);
  const [progress,       setProgress]       = useState(80);
  const [analyticsRange, setAnalyticsRange] = useState("Last 7 Days");

  const handleStartBulk = () => {
    setRunning(true);
    let p=progress;
    const iv=setInterval(()=>{p=Math.min(p+1,100);setProgress(p);if(p>=100)clearInterval(iv);},180);
  };

  const card  = "bg-white border border-red-100 shadow-sm";
  const input = "bg-red-50 border border-red-200 text-red-900 placeholder-red-300 focus:border-red-500";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">

      {/* ── Topbar ── */}
      <Topbar onMenuClick={onMenuClick}/>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Package className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Bulk Operations</h1>
            <p className="text-red-400 text-xs">Write, import and manage multiple NFC cards at once</p>
          </div>
        </div>

        {/* Top 3 panels — 1 col → 2 sm → 3 lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* 1. Bulk Write */}
          <div className={`${card} rounded-xl p-4 sm:p-5`}>
            <SectionBadge num="1" label="Bulk Write" Icon={Radio}/>
            <p className="text-red-400 text-xs mb-4">Write multiple NFC cards at once</p>

            <div className="mb-3">
              <label className="text-red-600 text-xs font-medium block mb-1.5">Template</label>
              <div className="relative">
                <select value={template} onChange={e=>setTemplate(e.target.value)}
                  className={`w-full text-sm px-3 py-2 pr-8 rounded-lg focus:outline-none appearance-none cursor-pointer ${input}`}>
                  {TEMPLATES.map(t=><option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none"/>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-red-600 text-xs font-medium block mb-1.5">Write Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[{m:"sequential",Icon:Clock},{m:"parallel",Icon:ZapIcon}].map(({m,Icon})=>(
                  <button key={m} onClick={()=>setWriteMode(m)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all capitalize ${
                      writeMode===m?"bg-red-600 border-red-600 text-white shadow-sm shadow-red-200":"bg-red-50 border-red-200 text-red-600 hover:border-red-400"
                    }`}>
                    <Icon className="w-3.5 h-3.5"/>{m}
                  </button>
                ))}
              </div>
            </div>

            <UploadZone label="Upload Data File" accepts="CSV, Excel" onFile={setDataFile} file={dataFile}/>

            <div className="mt-4 pt-4 border-t border-red-100">
              <h4 className="text-red-900 text-xs font-semibold mb-3">Write Settings</h4>
              <div className="space-y-2.5">
                {[
                  {label:"Lock card after write",  val:lockAfter,   set:setLockAfter  },
                  {label:"Verify after write",      val:verifyAfter, set:setVerifyAfter},
                  {label:"Skip locked cards",       val:skipLocked,  set:setSkipLocked },
                ].map(s=>(
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-red-700 text-xs">{s.label}</span>
                    <Toggle checked={s.val} onChange={s.set}/>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleStartBulk}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">
              {running
                ? <><RefreshCw className="w-4 h-4 animate-spin"/>Running...</>
                : <><Play className="w-4 h-4"/>Start Bulk Write</>
              }
            </button>
          </div>

          {/* 2. Bulk Import */}
          <div className={`${card} rounded-xl p-4 sm:p-5`}>
            <SectionBadge num="2" label="Bulk Import (CSV/Excel)" Icon={FileText}/>
            <p className="text-red-400 text-xs mb-4">Import card data from file</p>

            <UploadZone label="Upload CSV / Excel File" accepts=".csv, .xlsx, .xls" onFile={setCsvFile} file={csvFile}/>

            <div className="mt-4">
              <h4 className="text-red-900 text-xs font-semibold mb-2">File Preview</h4>
              <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-red-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-red-500"/>
                    <span className="text-red-700 text-xs">{csvFile?.name||"sample_data.csv"}</span>
                  </div>
                  <span className="text-red-400 text-[10px]">245 Records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[320px]">
                    <thead>
                      <tr className="border-b border-red-100">
                        {["#","Name","Type","URL"].map(h=>(
                          <th key={h} className="text-left text-red-500 font-semibold px-3 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PREVIEW_ROWS.map((r,i)=>(
                        <tr key={r.id} className={`hover:bg-red-100/50 transition-colors ${i<PREVIEW_ROWS.length-1?"border-b border-red-50":""}`}>
                          <td className="px-3 py-2 text-red-400">{r.id}</td>
                          <td className="px-3 py-2 text-red-900 font-medium">{r.name}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                              r.type==="vCard"?"bg-red-100 text-red-700 border-red-200":
                              r.type==="Text" ?"bg-rose-100 text-rose-700 border-rose-200":
                                               "bg-red-50 text-red-600 border-red-200"
                            }`}>{r.type}</span>
                          </td>
                          <td className="px-3 py-2 text-red-400 truncate max-w-[90px]">{r.url}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md shadow-red-200">
              Import &amp; Continue<ArrowRight className="w-4 h-4"/>
            </button>
          </div>

          {/* 3. Batch Status */}
          <div className={`${card} rounded-xl p-4 sm:p-5 sm:col-span-2 lg:col-span-1`}>
            <SectionBadge num="3" label="Batch Status" Icon={BarChart2}/>
            <p className="text-red-400 text-xs mb-4">Monitor your bulk operation</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                {label:"Total",   value:250, Icon:Package,      bg:"bg-red-600"  },
                {label:"Success", value:198, Icon:CheckCircle2, bg:"bg-red-500"  },
                {label:"Failed",  value:32,  Icon:XCircle,      bg:"bg-rose-600" },
                {label:"Pending", value:20,  Icon:Clock,        bg:"bg-red-400"  },
              ].map(s=>(
                <div key={s.label} className="bg-red-50 border border-red-200 rounded-xl p-2 text-center">
                  <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-1.5 shadow-sm`}>
                    <s.Icon className="w-3.5 h-3.5 text-white"/>
                  </div>
                  <div className="text-red-900 font-bold text-base">{s.value}</div>
                  <div className="text-red-400 text-[9px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-red-600 text-xs flex items-center gap-1.5">
                  <Timer className="w-3 h-3"/>Progress
                </span>
                <span className="text-red-900 text-xs font-bold">{progress}%</span>
              </div>
              <div className="h-2.5 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}}/>
              </div>
            </div>

            {/* Current op */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-500 text-[10px] uppercase tracking-wider font-medium">Current Operation</span>
                <span className="text-red-600 text-[10px] font-mono">00:02:45</span>
              </div>
              <div className="text-red-900 text-sm font-semibold">Writing card 201 of 250</div>
              <div className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3"/>Don't remove the NFC card during writing.
              </div>
            </div>

            <h4 className="text-red-900 text-xs font-semibold mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {ACTIVITY.map((a,i)=>(
                <div key={i} className="flex items-center gap-2">
                  {a.ok
                    ? <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0"/>
                    : <XCircle      className="w-4 h-4 text-rose-600 flex-shrink-0"/>
                  }
                  <span className="text-red-700 text-[11px] flex-1">{a.msg}</span>
                  <span className="text-red-400 text-[10px] flex-shrink-0">{a.time}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 text-xs font-bold py-3 rounded-xl transition-all">
              View Full Batch Status<ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Bottom 2 panels — stacked → side-by-side lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Batch Operations */}
          <div className={`${card} rounded-xl p-4 sm:p-5`}>
            <h3 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2 mb-4">
              <Download className="w-4 h-4 text-red-500"/>Recent Batch Operations
            </h3>
            <div className="overflow-x-auto rounded-xl border border-red-100">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    {["Batch ID","File","Total","Success","Failed","Status","Date"].map(h=>(
                      <th key={h} className="text-left text-red-500 font-semibold px-2.5 sm:px-3 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BATCHES.map((b,i)=>(
                    <tr key={b.id} className={`hover:bg-red-50/50 transition-colors ${i<RECENT_BATCHES.length-1?"border-b border-red-50":""}`}>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-600 font-mono font-medium">{b.id}</td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-700">{b.file}</td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-900 font-semibold">{b.total}</td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-green-600 font-semibold">{b.success}</td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-500 font-semibold">{b.failed}</td>
                      <td className="px-2.5 sm:px-3 py-2.5">
                        <span className="bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">{b.status}</span>
                      </td>
                      <td className="px-2.5 sm:px-3 py-2.5 text-red-400 whitespace-nowrap">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operation Analytics */}
          <div className={`${card} rounded-xl p-4 sm:p-5`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-500"/>Operation Analytics
              </h3>
              <select value={analyticsRange} onChange={e=>setAnalyticsRange(e.target.value)}
                className="bg-red-50 border border-red-200 text-red-700 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
                <option>Last 7 Days</option><option>Last 30 Days</option><option>This Month</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Area chart */}
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={CHART_DATA} margin={{top:4,right:4,left:-24,bottom:0}}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
                    <XAxis dataKey="l" tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:8,fill:"#f87171"}} axisLine={false} tickLine={false}/>
                    <Tooltip {...TOOLTIP}/>
                    <Area type="monotone" dataKey="v" name="Operations" stroke="#ef4444" strokeWidth={2.5}
                      fill="url(#areaGrad)" dot={{fill:"#ef4444",r:3.5,stroke:"#fff",strokeWidth:1.5}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Donut + sparkline */}
              <div className="flex flex-row sm:flex-col gap-3 sm:w-36 flex-shrink-0">
                {/* Donut */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex-1 sm:flex-none">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0">
                      <ResponsiveContainer width={64} height={64}>
                        <PieChart>
                          <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={20} outerRadius={30} dataKey="value" paddingAngle={2}>
                            {PIE_DATA.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1">
                      {PIE_DATA.map(d=>(
                        <div key={d.name} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.fill}}/>
                          <span className="text-red-600 text-[10px] flex-1">{d.name}</span>
                          <span className="text-red-900 text-[10px] font-bold">{d.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avg write time */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex-1 sm:flex-none">
                  <div className="text-red-400 text-[10px] mb-0.5">Avg Write Time</div>
                  <div className="text-red-900 font-bold text-lg">2.45<span className="text-red-400 text-xs font-normal ml-1">sec</span></div>
                  <ResponsiveContainer width="100%" height={28}>
                    <LineChart data={AVG_SPARK} margin={{top:2,right:0,left:0,bottom:0}}>
                      <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}