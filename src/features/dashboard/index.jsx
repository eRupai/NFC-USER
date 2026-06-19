import { useState } from "react";
import {
  X, Check, Loader, Download, Crown, CheckCircle2,
  Package, LayoutTemplate, PenLine, Radio, Smartphone,
} from "lucide-react";
import Topbar        from "../../shared/components/Topbar";
import StatsBar      from "./components/StatsBar";
import WriteNFCCard  from "./components/WriteNFCCard";
import TapNFCCard    from "./components/TapNFCCard";
import LiveAnalytics from "./components/LiveAnalytics";
import BottomSection from "./components/BottomSection";
import { DATA_TYPES } from "./data/dashboardData";

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, icon: Icon, children, footer }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-red-900 font-bold text-sm">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-red-100 flex gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WRITE CARD MODAL ─────────────────────────────────────────────────────────

function WriteCardModal({ open, onClose }) {
  const [step,     setStep]     = useState(0);
  const [typeIdx,  setTypeIdx]  = useState(0);
  const [cardName, setCardName] = useState("");
  const [dataVal,  setDataVal]  = useState("");

  const reset = () => { setStep(0); setTypeIdx(0); setCardName(""); setDataVal(""); };
  const handleClose = () => { reset(); onClose(); };
  const stepLabels = ["Select Type", "Enter Data", "Tap Card", "Done"];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Write NFC Card"
      icon={PenLine}
      footer={
        step < 3 ? (
          <>
            <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
              Cancel
            </button>
            {step === 2 ? (
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors">
                Simulate Tap ✓
              </button>
            ) : (
              <button onClick={() => setStep(s => s + 1)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
                Continue →
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
              Write Another
            </button>
            <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
              Done
            </button>
          </>
        )
      }
    >
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
        {stepLabels.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${
                i < step  ? "bg-green-500 border-green-400 text-white"
                : i === step ? "bg-red-600 border-red-500 text-white"
                : "border-red-200 text-red-300"
              }`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${i === step ? "text-red-700" : "text-red-300"}`}>{s}</span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`w-4 h-px flex-shrink-0 ${i < step ? "bg-green-300" : "bg-red-100"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — pick type */}
      {step === 0 && (
        <>
          <p className="text-red-900 text-xs font-semibold mb-1">Choose Data Type</p>
          <p className="text-red-400 text-[10px] mb-3">What do you want to store on your NFC card?</p>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {DATA_TYPES.map((dt, i) => (
              <button
                key={dt.label}
                onClick={() => setTypeIdx(i)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                  typeIdx === i ? "bg-red-600 border-red-600 shadow-sm" : "bg-red-50 border-red-100 hover:border-red-300"
                }`}
              >
                <dt.Icon className={`w-3.5 h-3.5 flex-shrink-0 ${typeIdx === i ? "text-white" : "text-red-600"}`} />
                <span className={`text-[9px] font-medium leading-tight ${typeIdx === i ? "text-white" : "text-red-700"}`}>{dt.label}</span>
              </button>
            ))}
          </div>
          <div>
            <label className="text-red-700 text-[10px] font-semibold mb-1 block">Card Name</label>
            <input
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="e.g. My Website"
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </>
      )}

      {/* Step 1 — enter data */}
      {step === 1 && (
        <>
          <p className="text-red-900 text-xs font-semibold mb-1">Enter {DATA_TYPES[typeIdx].label} Data</p>
          <p className="text-red-400 text-[10px] mb-3">This will be stored on your NFC card</p>
          <div className="mb-3">
            <label className="text-red-700 text-[10px] font-semibold mb-1 block">{DATA_TYPES[typeIdx].label}</label>
            <input
              value={dataVal}
              onChange={e => setDataVal(e.target.value)}
              placeholder={DATA_TYPES[typeIdx].placeholder}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
          <div>
            <label className="text-red-700 text-[10px] font-semibold mb-1 block">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Add a note..."
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none"
            />
          </div>
          <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-400 text-[10px] mb-1">Summary</p>
            <div className="flex justify-between text-xs">
              <span className="text-red-500">Type</span>
              <span className="text-red-800 font-semibold">{DATA_TYPES[typeIdx].label}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-red-500">Name</span>
              <span className="text-red-800 font-semibold">{cardName || "—"}</span>
            </div>
          </div>
        </>
      )}

      {/* Step 2 — tap */}
      {step === 2 && (
        <div className="flex flex-col items-center py-2">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-rose-300/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Ready to write
          </div>
          <p className="text-red-500 text-xs text-center">Hold your NFC card near the back of your device</p>
        </div>
      )}

      {/* Step 3 — done */}
      {step === 3 && (
        <div className="flex flex-col items-center py-2 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mb-3 shadow-lg shadow-green-100">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-red-900 font-bold text-sm mb-1">Card Written Successfully!</p>
          <p className="text-red-400 text-xs mb-3">Your NFC card has been programmed.</p>
          <div className="flex gap-2 flex-wrap justify-center">
            <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">✓ Success</span>
            <span className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">{DATA_TYPES[typeIdx].label}</span>
            {cardName && <span className="text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 rounded-full">{cardName}</span>}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── SCAN MODAL ───────────────────────────────────────────────────────────────

function ScanModal({ open, onClose }) {
  const [scanned, setScanned] = useState(false);
  const handleClose = () => { setScanned(false); onClose(); };
  const supported = ["NTAG213", "NTAG215", "NTAG216", "MIFARE", "Ultralight", "DESFire"];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Scan NFC Card"
      icon={Radio}
      footer={
        <>
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Close
          </button>
          {!scanned ? (
            <button onClick={() => setScanned(true)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
              Simulate Tap
            </button>
          ) : (
            <button onClick={() => setScanned(false)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
              Scan Again
            </button>
          )}
        </>
      }
    >
      {!scanned ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-rose-300/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Scanning...
            </div>
            <p className="text-red-400 text-xs text-center">Hold any NFC card near the back of your phone</p>
          </div>
          <p className="text-red-500 text-xs font-semibold mb-2">Supported Cards</p>
          <div className="flex flex-wrap gap-1.5">
            {supported.map(c => (
              <span key={c} className="text-[9px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">{c}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mb-2 shadow-md shadow-green-100">
              <Check className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-red-900 font-bold text-sm">Card Detected!</p>
          </div>
          {[["Status","Readable"],["UID","04:A3:B2:C1:D0:E5"],["Card Type","NTAG213"],["Memory","144 bytes"],["Content","URL — https://example.com"],["Locked","No"]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-red-50 last:border-0">
              <span className="text-red-400 text-xs">{k}</span>
              <span className={`text-xs font-semibold ${k === "Status" ? "text-green-600" : "text-red-800"}`}>{v}</span>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
}

// ─── BULK WRITE MODAL ─────────────────────────────────────────────────────────

function BulkWriteModal({ open, onClose }) {
  const [cardCount, setCardCount] = useState(3);
  const [statuses,  setStatuses]  = useState([]);
  const [running,   setRunning]   = useState(false);

  const handleClose = () => { setStatuses([]); setRunning(false); onClose(); };

  const startBulk = () => {
    setRunning(true);
    setStatuses(Array(cardCount).fill("pending"));
    Array.from({ length: cardCount }).forEach((_, i) => {
      setTimeout(() => setStatuses(s => s.map((v, j) => j === i ? "writing" : v)), i * 900);
      setTimeout(() => setStatuses(s => s.map((v, j) => j === i ? "done"    : v)), i * 900 + 700);
    });
    setTimeout(() => setRunning(false), cardCount * 900 + 800);
  };

  const badge = (s) => {
    if (s === "done")    return <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Done ✓</span>;
    if (s === "writing") return <span className="text-[9px] font-bold bg-blue-100 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">Writing...</span>;
    return <span className="text-[9px] font-bold bg-red-100 text-red-500 border border-red-200 px-2 py-0.5 rounded-full">Pending</span>;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Bulk Write Cards"
      icon={Package}
      footer={
        <>
          <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button onClick={startBulk} disabled={running}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
            {running ? "Writing..." : "Start Writing"}
          </button>
        </>
      }
    >
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Data Type</label>
          <select className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
            <option>URL / Link</option><option>vCard</option><option>Text</option><option>WiFi</option>
          </select>
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Data to write on all cards</label>
          <input
            placeholder="https://example.com"
            className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Number of cards: {cardCount}</label>
          <input
            type="range" min={1} max={10} value={cardCount}
            onChange={e => { setCardCount(+e.target.value); setStatuses([]); }}
            className="w-full accent-red-600"
          />
        </div>
      </div>
      <p className="text-red-700 text-[10px] font-semibold mb-2">Queue ({cardCount} cards)</p>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-red-900 text-xs font-medium">Card #{i + 1}</div>
              <div className="text-red-400 text-[9px]">{statuses[i] === "writing" ? "Writing..." : statuses[i] === "done" ? "Complete" : "Waiting..."}</div>
            </div>
            {badge(statuses[i] || "pending")}
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── TEMPLATE MODAL ───────────────────────────────────────────────────────────

function TemplateModal({ open, onClose }) {
  const [saved, setSaved] = useState(false);
  const [name,  setName]  = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setName(""); onClose(); }, 1500);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Template"
      icon={LayoutTemplate}
      footer={
        <>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-colors shadow-md ${saved ? "bg-green-500 shadow-green-200" : "bg-red-600 hover:bg-red-500 shadow-red-200"}`}>
            {saved ? "✓ Saved!" : "Save Template"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Template Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My Business Card"
            className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" />
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Data Type</label>
          <select className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
            <option>URL / Link</option><option>vCard</option><option>Text</option><option>WiFi</option><option>Email</option><option>Phone</option>
          </select>
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Default Data</label>
          <input placeholder="https://example.com"
            className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" />
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Description</label>
          <textarea rows={2} placeholder="What is this template for?"
            className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 placeholder-red-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-3.5 h-3.5 rounded accent-red-500" />
          <span className="text-red-600 text-xs">Set as default template</span>
        </label>
      </div>
    </Modal>
  );
}

// ─── REPORT MODAL ─────────────────────────────────────────────────────────────

function ReportModal({ open, onClose }) {
  const [loading,    setLoading]    = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDownloaded(true);
      setTimeout(() => { setDownloaded(false); onClose(); }, 1200);
    }, 1600);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="View Reports"
      icon={Download}
      footer={
        <>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDownload} disabled={loading || downloaded}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors ${
              downloaded ? "bg-green-500 shadow-green-200" : "bg-red-600 hover:bg-red-500 shadow-red-200 disabled:opacity-60"
            }`}>
            {loading    ? <><Loader className="w-3.5 h-3.5 animate-spin" />Downloading...</>
             : downloaded ? "✓ Downloaded!"
             : <><Download className="w-3.5 h-3.5" />Download</>}
          </button>
        </>
      }
    >
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Report Type</label>
          <select className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
            <option>Scan Analytics</option><option>Card Performance</option><option>Location Report</option><option>Device Report</option>
          </select>
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Date Range</label>
          <select className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
            <option>Last 7 days</option><option>Last 30 days</option><option>Last 3 months</option><option>This year</option>
          </select>
        </div>
        <div>
          <label className="text-red-700 text-[10px] font-semibold mb-1 block">Format</label>
          <select className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 outline-none focus:border-red-400">
            <option>PDF</option><option>CSV</option><option>Excel (.xlsx)</option>
          </select>
        </div>
      </div>
      <div className="bg-red-50 rounded-xl border border-red-100 p-3">
        <p className="text-red-700 text-[10px] font-semibold mb-2">Preview</p>
        {[["Total Scans","2,543"],["Active Cards","10"],["Top Location","Mumbai"],["Top Device","Android (68%)"]].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-1.5 border-b border-red-100 last:border-0">
            <span className="text-red-400 text-xs">{k}</span>
            <span className="text-red-800 text-xs font-semibold">{v}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── UPGRADE MODAL ────────────────────────────────────────────────────────────

function UpgradeModal({ open, onClose }) {
  const [plan,     setPlan]     = useState("unlimited");
  const [upgraded, setUpgraded] = useState(false);

  const plans = [
    { id: "pro",       name: "Pro",       price: "₹299", period: "/month", features: ["50 NFC cards", "Advanced analytics", "Custom templates", "Email support"] },
    { id: "unlimited", name: "Unlimited", price: "₹599", period: "/month", features: ["Unlimited NFC cards", "Bulk writing", "Priority support", "API access"], popular: true },
  ];

  const handleUpgrade = () => {
    setUpgraded(true);
    setTimeout(() => { setUpgraded(false); onClose(); }, 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Go Unlimited"
      icon={Crown}
      footer={
        <>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            Maybe Later
          </button>
          <button onClick={handleUpgrade}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-colors ${
              upgraded ? "bg-green-500 shadow-green-200" : "bg-red-600 hover:bg-red-500 shadow-red-200"
            }`}>
            {upgraded ? `✓ Upgraded to ${plans.find(p => p.id === plan)?.name}!` : "Upgrade Now →"}
          </button>
        </>
      }
    >
      <p className="text-red-400 text-xs mb-4">Choose a plan that works for you</p>
      <div className="space-y-3">
        {plans.map(p => (
          <div key={p.id} onClick={() => setPlan(p.id)}
            className={`rounded-xl border p-4 cursor-pointer transition-all ${
              plan === p.id ? "border-red-500 bg-red-50 shadow-md shadow-red-100" : "border-red-100 hover:border-red-300"
            }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-red-900 font-bold text-sm">{p.name}</span>
                {p.popular && <span className="text-[9px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">Most Popular</span>}
              </div>
              <div>
                <span className="text-red-700 font-bold text-sm">{p.price}</span>
                <span className="text-red-400 text-[10px]">{p.period}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {p.features.map(f => (
                <div key={f} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-red-600 text-[10px]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function Dashboard({ onMenuClick }) {
  const [activeModal, setActiveModal] = useState(null);
  const openModal  = (id) => setActiveModal(id);
  const closeModal = ()   => setActiveModal(null);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} />
      <div className="flex-1 overflow-y-auto min-h-0">
        <StatsBar />
        <div className="px-3 sm:px-4 pb-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <WriteNFCCard onOpen={openModal} />
              <TapNFCCard   onOpen={openModal} />
            </div>
            <div className="w-full xl:w-72 xl:flex-shrink-0">
              <LiveAnalytics onOpen={openModal} />
            </div>
          </div>
        </div>
        <BottomSection onOpen={openModal} />
      </div>

      {/* ── Modals ── */}
      <WriteCardModal open={activeModal === "write"}    onClose={closeModal} />
      <ScanModal      open={activeModal === "scan"}     onClose={closeModal} />
      <BulkWriteModal open={activeModal === "bulk"}     onClose={closeModal} />
      <TemplateModal  open={activeModal === "template"} onClose={closeModal} />
      <ReportModal    open={activeModal === "report"}   onClose={closeModal} />
      <UpgradeModal   open={activeModal === "upgrade"}  onClose={closeModal} />
    </div>
  );
}