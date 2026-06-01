import { Radio, RefreshCw, Smartphone } from "lucide-react";

const SUPPORTED_CARDS = ["NTAG213", "NTAG215", "NTAG216", "MIFARE", "Ultralight", "DESFire"];

export default function TapNFCCard() {
  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <h2 className="text-red-900 font-bold text-sm mb-0.5 flex items-center gap-2">
        <Radio className="w-4 h-4 text-red-500" />2. Tap Your NFC Card
      </h2>
      <p className="text-red-400 text-xs mb-4">Hold your NFC card near the device</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-red-300/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-rose-300/30 animate-pulse" />
          <div className="absolute inset-3 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-inner">
            <Smartphone className="w-9 h-9 text-red-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-full w-fit mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            Ready to Scan
          </div>
          <p className="text-red-500 text-xs font-medium mb-1.5">Supported Cards</p>
          <div className="flex flex-wrap gap-1">
            {SUPPORTED_CARDS.map(c => (
              <span key={c} className="text-[9px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-red-900 text-xs font-semibold">Card Information</p>
          <button className="text-red-400 hover:text-red-700 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[["Status", "No Card Detected"], ["UID", "--"], ["Card Type", "--"], ["Memory Size", "--"]].map(([l, v]) => (
            <div key={l} className="flex items-center gap-1.5 text-xs">
              <span className="text-red-400 w-16 flex-shrink-0 text-[10px]">{l}</span>
              <span className="text-red-700 text-[10px]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
