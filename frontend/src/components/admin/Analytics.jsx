import { useState } from 'react';
import { mockData } from '../../utils/mockData';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('This Week');

  // TODO: GET /admin/analytics?range=

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Platform performance and revenue insights.</p>
        </div>
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 font-bold rounded-xl px-4 py-2 outline-none focus:border-indigo-600 shadow-sm"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>Custom</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-96">
          <h3 className="font-extrabold text-slate-900 mb-6 text-lg">Daily Revenue (Gross)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.analytics.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4f46e5' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={4} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-indigo-600 rounded-3xl shadow-sm border border-indigo-500 p-6 flex-1 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
            <p className="text-sm font-bold text-indigo-200 uppercase tracking-wide">Dispute Rate</p>
            <p className="text-5xl font-black mt-2">1.2%</p>
            <p className="text-sm font-medium text-indigo-100 mt-2">Of total bookings this period.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col justify-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Earnings (10% Cut)</p>
            <p className="text-4xl font-black text-slate-900 mt-2">₹24,500</p>
            <p className="text-sm font-bold text-green-500 mt-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              +12% vs last period
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-80">
          <h3 className="font-extrabold text-slate-900 mb-6 text-lg">Bookings by Category</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.analytics.categories} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 'bold' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900 text-lg">Top 5 Workers</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {mockData.analytics.topWorkers.map((w, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">#{i+1}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{w.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{w.jobs} jobs • ★ {w.rating}</p>
                  </div>
                </div>
                <p className="font-extrabold text-slate-900 text-sm">₹{w.earnings / 1000}k</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900 text-lg">Top Cities</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {mockData.analytics.topCities.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">#{i+1}</div>
                  <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                </div>
                <p className="font-extrabold text-indigo-600 text-sm">{c.count} bookings</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
