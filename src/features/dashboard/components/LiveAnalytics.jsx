import { useState } from "react";
import { Activity, MapPin, Smartphone, ArrowUpRight, Crown } from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, CartesianGrid, Tooltip, YAxis,
} from "recharts";
import { scanData, locationData, deviceData, recentActivity, TOOLTIP_STYLE } from "../data/dashboardData";

export default function LiveAnalytics({ onOpen }) {
  const [range, setRange] = useState("This Month");

  return (
    <div className="flex flex-col gap-4">

      {/* Scan Chart */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" />My Scan Analytics
          </h3>
          <select value={range} onChange={e => setRange(e.target.value)}
            className="bg-red-50 border border-red-200 text-red-600 text-[10px] rounded px-2 py-1 outline-none cursor-pointer">
            <option>This Month</option><option>This Week</option>
          </select>
        </div>
        <div className="text-red-900 font-bold text-2xl">2,543</div>
        <div className="text-green-600 text-xs mb-3 flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" />+12.5%
        </div>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={scanData} margin={{ top: 2, right: 2, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 8, fill: "#f87171" }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="scans" name="Scans" stroke="#ef4444" strokeWidth={2.5}
              fill="url(#scanGrad)" dot={{ fill: "#ef4444", r: 3, stroke: "#fff", strokeWidth: 1.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Locations */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-900 font-semibold text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />Top Locations
          </h3>
          <button className="text-red-500 hover:text-red-700 text-xs font-semibold">View All</button>
        </div>
        <div className="space-y-2.5">
          {locationData.map(l => (
            <div key={l.city}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-700 text-xs">{l.city}</span>
                <span className="text-red-900 text-xs font-semibold">{l.scans.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                  style={{ width: `${(l.scans / 1245) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Distribution */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-red-900 font-semibold text-sm mb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-red-500" />Device Distribution
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={88} height={88}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={24} outerRadius={40} dataKey="value" paddingAngle={2}>
                  {deviceData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 8, fontSize: 10 }} itemStyle={{ color: "#ef4444" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 flex-1">
            {deviceData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                <span className="text-red-600 text-xs flex-1">{d.name}</span>
                <span className="text-red-900 text-xs font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-900 font-semibold text-sm">Recent Activity</h3>
          <button className="text-red-500 hover:text-red-700 text-xs font-semibold">View All</button>
        </div>
        <div className="space-y-2">
          {recentActivity.map(a => (
            <div key={a.label} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.fill }} />
              <span className="text-red-700 text-xs flex-1">{a.label}</span>
              <span className="text-red-400 text-[10px]">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Go Unlimited */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 text-center shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-red-200">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-red-900 font-bold text-sm mb-1">Go Unlimited!</h3>
        <p className="text-red-500 text-xs mb-3">Upgrade and unlock all premium features.</p>
        <button onClick={() => onOpen("upgrade")}
          className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-md shadow-red-200">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}