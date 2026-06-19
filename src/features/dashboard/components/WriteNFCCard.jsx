import { useState } from "react";
import { PenLine, Check } from "lucide-react";
import { DATA_TYPES } from "../data/dashboardData";

export default function WriteNFCCard({ onOpen }) {
  const [selected, setSelected] = useState(0);
  const steps = ["Select Type", "Enter Data", "Tap NFC Card", "Verify & Complete"];

  return (
    <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0">
          <PenLine className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-red-900 font-bold text-sm sm:text-base">Write / Re-Write NFC Card</h2>
          <p className="text-red-400 text-xs">Select type, enter data and write to NFC card</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-1 mt-3 mb-4 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1 ${i === 0 ? "text-red-700" : "text-red-300"}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${i === 0 ? "bg-red-600 border-red-500 text-white" : "border-red-200 text-red-300"}`}>{i + 1}</div>
              <span className="text-[10px] font-medium whitespace-nowrap">{step}</span>
            </div>
            {i < steps.length - 1 && <div className="w-3 sm:w-5 h-px bg-red-100 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <p className="text-red-900 text-xs font-semibold mb-1">1. Select Data Type</p>
      <p className="text-red-400 text-xs mb-3">Choose the type of data you want to write</p>

      {/* Type grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 mb-4">
        {DATA_TYPES.map((dt, i) => (
          <button key={dt.label} onClick={() => setSelected(i)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
              selected === i ? "bg-red-600 border-red-600 text-white shadow-sm" : "bg-red-50 border-red-200 text-red-700 hover:border-red-400"
            }`}>
            <dt.Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className={`text-[9px] font-medium leading-tight ${selected === i ? "text-white" : "text-red-700"}`}>{dt.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced options */}
      <div className="border-t border-red-100 pt-3">
        <p className="text-red-900 text-xs font-semibold mb-2">Advanced Options</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          {["Enable Dynamic Link", "Lock Card After Write", "Set Password Protection", "Auto Detect Card Type", "Write Once (Lock after write)", "Optimize Memory Usage"].map((opt, i) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" defaultChecked={[0, 1, 3].includes(i)} className="w-3.5 h-3.5 rounded accent-red-500" />
              <span className="text-red-600 text-xs group-hover:text-red-800 transition-colors">{opt}</span>
            </label>
          ))}
        </div>
        <button onClick={() => onOpen("write")}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-red-200">
          Write Card →
        </button>
      </div>
    </div>
  );
}