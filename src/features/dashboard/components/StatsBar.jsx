import { ArrowUpRight } from "lucide-react";
import { statsData } from "../data/dashboardData";

export default function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 sm:p-4">
      {statsData.map(s => (
        <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-2 hover:border-red-300 hover:shadow-md transition-all shadow-sm">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center shadow-lg shadow-red-100 flex-shrink-0`}>
            <s.Icon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-red-400 text-[10px] mb-0.5 truncate">{s.label}</div>
            <div className="text-red-900 font-bold text-sm leading-tight">{s.value}</div>
            <div className={`text-[10px] mt-0.5 flex items-center gap-0.5 ${s.up === true ? "text-green-600" : s.up === false ? "text-red-500" : "text-red-400"}`}>
              {s.up === true && <ArrowUpRight className="w-3 h-3" />}
              {s.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}