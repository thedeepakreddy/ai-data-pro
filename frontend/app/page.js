"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, BarChart3, Brain, Activity, Sparkles, Table, Database, Zap, Cpu, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, AreaChart, Area, PieChart, Pie } from 'recharts';

export default function IndustrialDashboard() {
  // Use Vercel Environment variable or fall back to localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [target, setTarget] = useState("");
  const [mlResults, setMlResults] = useState(null);
  const [report, setReport] = useState("");
  const [activeChartCol, setActiveChartCol] = useState("");
  const [loading, setLoading] = useState({ upload: false, train: false, report: false });

  const handleUpload = async () => {
    if (!file) return;
    setLoading({ ...loading, upload: true });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData);
      setData(res.data);
      const cols = res.data.summary?.columns || [];
      setTarget(cols[cols.length - 1]);
      setActiveChartCol(Object.keys(res.data.analysis?.chart_data || {})[0] || "");
    } catch (err) { alert("Backend Connection Error. Ensure FastAPI is running."); }
    setLoading({ ...loading, upload: false });
  };

  const handleTrain = async () => {
    setLoading({ ...loading, train: true });
    try {
      const res = await axios.post(`${API_URL}/train?target_column=${target}`);
      setMlResults(res.data);
    } catch (err) { alert("ML Engine Error"); }
    setLoading({ ...loading, train: false });
  };

  const handleReport = async () => {
    setLoading({ ...loading, report: true });
    try {
      const res = await axios.post(`${API_URL}/report`);
      setReport(res.data.report);
    } catch (err) { alert("AI Storyteller Error"); }
    setLoading({ ...loading, report: false });
  };

  // --- CUSTOM REPORT RENDERER ---
  const renderAIReport = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-5xl font-black uppercase tracking-tighter text-indigo-700 mt-12 mb-8 border-l-[16px] border-indigo-600 pl-8">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ') || line.startsWith('### ')) {
        return <h2 key={i} className="text-3xl font-black uppercase text-slate-900 mt-10 mb-6 border-b-4 border-slate-100 pb-3">{line.replace(/### |## /g, '')}</h2>;
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return <div key={i} className="text-xl font-medium text-slate-600 mb-4 flex gap-4 pl-4"><span className="text-indigo-500 font-black">▶</span><span>{line.replace(/^- |^\* /, '')}</span></div>;
      }
      if (line.trim() === "") return <div key={i} className="h-4" />;
      return <p key={i} className="text-xl leading-relaxed text-slate-600 font-medium mb-6 text-justify">{line}</p>;
    });
  };

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* HEADER */}
      <header className="bg-white border-b-4 border-indigo-600 p-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 text-white"><Cpu size={28} /></div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Insight<span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 p-1">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-[10px] font-black px-4" />
            <button onClick={handleUpload} className="bg-indigo-600 text-white px-10 py-4 font-black uppercase text-[12px] tracking-widest hover:bg-black transition-all">
              {loading.upload ? "INGESTING..." : "INGEST DATA"}
            </button>
          </div>
        </div>
      </header>

      <div className="p-10 max-w-[1600px] mx-auto">
        {data ? (
          <main className="grid grid-cols-12 gap-10">
            {/* KPI BOXES */}
            <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-10 rounded-none border-l-[16px] border-l-indigo-600 shadow-sm">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Population</p>
              <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{data.summary?.total_rows?.toLocaleString()}</h2>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-10 rounded-none border-l-[16px] border-l-cyan-500 shadow-sm">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Dimensions</p>
              <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{data.summary?.total_cols}</h2>
            </div>

            <div className="col-span-12 md:col-span-4 bg-slate-900 p-10 rounded-none text-white border-b-[16px] border-indigo-600 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-6">ML Control Logic</h3>
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-800 p-4 text-xs font-black text-white mb-6 outline-none">
                  {data.summary?.columns.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                </select>
                <button onClick={handleTrain} className="w-full bg-indigo-600 py-5 font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                  {loading.train ? "TRAINING..." : "Execute Logic"}
                </button>
              </div>
              {mlResults && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-[11px] font-black text-slate-500 uppercase">Confidence</span>
                    <span className="text-5xl font-black text-emerald-400 tracking-tighter">{(mlResults.score * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* CHART ROW */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-10 shadow-sm min-h-[450px]">
              <div className="flex justify-between items-center mb-10 border-b-2 border-slate-100 pb-8 text-slate-900">
                <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-4"><BarChart3 className="text-indigo-600" /> Variance Matrix</h3>
                <select value={activeChartCol} onChange={(e) => setActiveChartCol(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-black p-2 outline-none">
                    {Object.keys(data.analysis?.chart_data || {}).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="0 0" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" />
                    <Tooltip contentStyle={{borderRadius: '0px', border: '3px solid #000', fontWeight: '900'}} />
                    <Area type="step" dataKey="value" stroke="#4f46e5" strokeWidth={5} fill="#eef2ff" fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-10 shadow-sm">
              <h3 className="text-lg font-black uppercase mb-12 border-b-2 border-slate-100 pb-8">Density</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={0} outerRadius={120} dataKey="value">
                      {Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '0px', border: '3px solid #000'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABLE ROW */}
            <div className="col-span-12 bg-white border-2 border-slate-900 shadow-xl overflow-hidden mt-6">
              <div className="p-8 bg-slate-900 flex items-center text-white font-black uppercase tracking-[0.5em] text-[12px]">
                  <Table size={20} className="text-emerald-400 mr-4" /> Descriptive Matrix
              </div>
              <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[11px] uppercase border-b-2 border-slate-200">
                      <tr><th className="p-8">Variable</th><th className="p-8 text-center border-l border-slate-100">Mean</th><th className="p-8 text-center border-l border-slate-100">Median</th><th className="p-8 text-center border-l border-slate-100 text-rose-600">Outliers</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {Object.entries(data.analysis?.descriptive_stats || {}).map(([col, s]) => (
                          <tr key={col} className="hover:bg-indigo-50 font-bold text-slate-700 transition">
                              <td className="p-8 font-black text-slate-900 uppercase tracking-tighter text-sm">{col}</td>
                              <td className="p-8 text-center border-l border-slate-100">{s.mean}</td>
                              <td className="p-8 text-center border-l border-slate-100">{s.median}</td>
                              <td className="p-8 text-center border-l border-slate-100">
                                  <span className={`px-6 py-3 text-[11px] font-black border-2 ${s.outliers > 0 ? 'border-rose-600 text-rose-600 bg-rose-50' : 'border-slate-100 text-slate-200'}`}> {s.outliers} CRITICAL</span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>

            {/* AI STRATEGY ENGINE */}
            {mlResults && (
              <div className="col-span-12 mt-12 mb-20">
                  <button onClick={handleReport} disabled={loading.report} className="w-full bg-slate-900 text-white py-10 font-black uppercase text-2xl tracking-[0.3em] shadow-2xl hover:bg-indigo-700 transition-all rounded-none border-b-8 border-indigo-500">
                      <Sparkles size={32} className="text-indigo-400" /> {loading.report ? "GENERATING..." : "ACTIVATE EXECUTIVE AI ENGINE"}
                  </button>
                  {report && <div className="mt-14 bg-white p-12 md:p-24 border-t-[24px] border-indigo-600 shadow-2xl border-2 border-slate-200">{renderAIReport(report)}</div>}
              </div>
            )}
          </main>
        ) : (
          <div className="max-w-4xl mx-auto mt-40">
              <div className="bg-white border-8 border-dashed border-slate-100 p-32 text-center shadow-inner"><Database size={100} className="text-slate-100 mx-auto mb-10" /><h2 className="text-4xl font-black text-slate-200 uppercase tracking-[0.5em] italic">System Standby</h2></div>
          </div>
        )}
      </div>
    </div>
  );
}