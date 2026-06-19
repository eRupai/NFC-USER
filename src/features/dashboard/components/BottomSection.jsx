import { CreditCard, LayoutTemplate } from "lucide-react";
import { recentCards, templatesList, quickActions, footerFeatures } from "../data/dashboardData";

export default function BottomSection({ onOpen }) {
  return (
    <div className="px-3 sm:px-4 pb-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* Recent Cards */}
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500" />My Recent Cards
            </h3>
            <button className="text-red-500 hover:text-red-700 text-xs font-semibold">View All</button>
          </div>
          <div className="space-y-2.5">
            {recentCards.map(card => (
              <div key={card.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <card.Icon className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-medium truncate">{card.name}</div>
                  <div className="text-red-400 text-[10px]">{card.sub}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-red-400 text-[10px]">{card.time}</div>
                  <span className="text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-red-500" />Templates
            </h3>
            <button onClick={() => onOpen("template")} className="text-red-500 hover:text-red-700 text-xs font-semibold">View All</button>
          </div>
          <div className="space-y-2">
            {templatesList.map(t => (
              <div key={t.name} onClick={() => onOpen("template")}
                className="flex items-center gap-3 hover:bg-red-50 rounded-lg p-1.5 -mx-1.5 transition-colors cursor-pointer">
                <div className={`w-8 h-8 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <t.Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-red-900 text-xs font-medium truncate">{t.name}</div>
                  <div className="text-red-400 text-[10px]">{t.sub}</div>
                </div>
                <span className="text-red-500 text-xs flex-shrink-0">{t.count} Cards</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <h3 className="text-red-900 font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => onOpen(a.modal)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${a.bg} transition-all text-left shadow-sm hover:shadow-md hover:scale-[1.01]`}>
                <a.Icon className="w-4 h-4 text-white flex-shrink-0" />
                <div>
                  <div className="text-white text-xs font-semibold">{a.label}</div>
                  <div className="text-white/70 text-[10px] hidden sm:block">{a.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer features */}
      <div className="bg-white border border-red-100 rounded-xl px-3 sm:px-5 py-3 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:divide-x sm:divide-red-100">
          {footerFeatures.map(f => (
            <div key={f.label} className="flex items-center gap-2 sm:px-4 sm:first:pl-0 sm:last:pr-0">
              <f.Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${f.color} flex-shrink-0`} />
              <div>
                <div className="text-red-900 text-xs font-semibold">{f.label}</div>
                <div className="text-red-400 text-[10px] hidden sm:block">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}