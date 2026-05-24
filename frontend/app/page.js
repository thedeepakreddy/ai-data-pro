"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Upload, BarChart3, Brain, Activity, Sparkles, Table, 
  Database, Zap, Cpu, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Cell, AreaChart, Area, PieChart, Pie
} from 'recharts';

export default function EnterpriseFlatDashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [target, setTarget] = useState("");
  const [mlResults, setMlResults] = useState(null);
  const [report, setReport] = useState("");
  const [activeChartCol, setActiveChartCol] = useState("");
  const [loading, setLoading] = useState({ upload: false, train: false, report: false });

  // --- LOGIC FUNCTIONS ---
  const handleUpload = async () => {
    if (!file) return;
    setLoading({ ...loading, upload: true });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setData(res.data);
      const cols = res.data.summary?.columns || [];
      setTarget(cols[cols.length - 1]);
      setActiveChartCol(Object.keys(res.data.analysis?.chart_data || {})[0] || "");
    } catch (err) { alert("Backend Connection Error. Check if FastAPI is running."); }
    setLoading({ ...loading, upload: false });
  };

  const handleTrain = async () => {
    setLoading({ ...loading, train: true });
    try {
      const res = await axios.post(`http://localhost:8000/train?target_column=${target}`);
      setMlResults(res.data);
    } catch (err) { alert("ML Engine Error"); }
    setLoading({ ...loading, train: false });
  };

  const handleReport = async () => {
    setLoading({ ...loading, report: true });
    try {
      const res = await axios.post('http://localhost:8000/report');
      setReport(res.data.report);
    } catch (err) { alert("AI Storyteller Error"); }
    setLoading({ ...loading, report: false });
  };

  // --- CUSTOM REPORT RENDERER (No Library Required) ---
  const renderAIReport = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Main Headings (Huge and Bold)
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-5xl font-[1000] uppercase tracking-tighter text-indigo-700 mt-12 mb-8 border-l-[12px] border-indigo-600 pl-8">{line.replace('# ', '')}</h1>;
      }
      // Side Headings (Large and Sharp)
      if (line.startsWith('## ') || line.startsWith('### ')) {
        return <h2 key={i} className="text-3xl font-[1000] uppercase text-slate-900 mt-10 mb-6 border-b-4 border-slate-100 pb-3">{line.replace(/### |## /g, '')}</h2>;
      }
      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return <div key={i} className="text-xl font-medium text-slate-600 mb-4 flex gap-4 items-start pl-4">
          <span className="text-indigo-500 font-black">▶</span>
          <span>{line.replace(/^- |^\* /, '')}</span>
        </div>;
      }
      // Body Text
      if (line.trim() === "") return <div key={i} className="h-4" />;
      return <p key={i} className="text-xl leading-[1.9] text-slate-600 font-medium mb-6 text-justify tracking-tight">{line}</p>;
    });
  };

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-0 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER - FLAT RECTANGLE */}
      <header className="w-full bg-white border-b-4 border-indigo-600 p-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-white rounded-none">
              <Cpu size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-[1000] tracking-tighter uppercase leading-none italic">Insight<span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Autonomous Strategy Engine</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-none shadow-inner">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-[10px] font-black px-4" />
            <button onClick={handleUpload} disabled={loading.upload} className="bg-indigo-600 text-white px-10 py-4 rounded-none font-[1000] uppercase text-[12px] tracking-widest hover:bg-black transition-all flex items-center gap-2">
              <Upload size={14} /> {loading.upload ? "INGESTING..." : "INGEST DATA"}
            </button>
          </div>
        </div>
      </header>

      <div className="p-8 md:p-14 max-w-[1600px] mx-auto">
        {data ? (
          <main className="grid grid-cols-12 gap-10">
            
            {/* KPI ROW - 90 DEGREE CORNERS */}
            <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-10 rounded-none border-l-[16px] border-l-indigo-600 shadow-sm">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Metric: Population</p>
              <h2 className="text-7xl font-[1000] text-slate-900 tracking-tighter leading-none">{data.summary?.total_rows?.toLocaleString()}</h2>
              <div className="mt-8 flex items-center gap-2 text-emerald-600 font-[1000] text-[11px] uppercase border-t border-slate-50 pt-4">
                <TrendingUp size={16} /> <span>Database Connected</span>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-10 rounded-none border-l-[16px] border-l-cyan-500 shadow-sm">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Metric: Dimensions</p>
              <h2 className="text-7xl font-[1000] text-slate-900 tracking-tighter leading-none">{data.summary?.total_cols}</h2>
              <p className="text-[11px] text-slate-400 mt-8 font-black uppercase italic tracking-widest border-t border-slate-50 pt-4 text-right">Verified</p>
            </div>

            <div className="col-span-12 md:col-span-4 bg-slate-900 p-10 rounded-none text-white border-b-[16px] border-indigo-600 shadow-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-[1000] text-indigo-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <Zap size={14}/> ML Control
                </h3>
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 p-4 text-xs font-black text-white outline-none mb-6 rounded-none appearance-none">
                  {data.summary?.columns.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                </select>
                <button onClick={handleTrain} className="w-full bg-indigo-600 py-5 font-[1000] uppercase text-[11px] tracking-[0.3em] hover:bg-indigo-500 transition-all rounded-none shadow-xl">
                  {loading.train ? "TRAINING..." : "Execute Logic"}
                </button>
              </div>
              {mlResults && (
                <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-[11px] font-[1000] text-slate-500 uppercase tracking-widest">Confidence Index</span>
                    <span className="text-5xl font-[1000] text-emerald-400 tracking-tighter">{(mlResults.score * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* VISUALS SECTION */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-10 rounded-none shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-12 border-b-2 border-slate-100 pb-8 text-slate-900">
                <h3 className="text-lg font-[1000] uppercase tracking-widest flex items-center gap-4">
                  <BarChart3 size={24} className="text-indigo-600" /> Statistical Variance Matrix
                </h3>
                <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 p-2">
                    <span className="text-[10px] font-black text-slate-500 px-2 uppercase tracking-tighter underline">Switch Variable</span>
                    <select value={activeChartCol} onChange={(e) => setActiveChartCol(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-[11px] font-black p-2 rounded-none outline-none">
                        {Object.keys(data.analysis?.chart_data || {}).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="0 0" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} />
                    <Tooltip contentStyle={{borderRadius: '0px', border: '3px solid #000', fontWeight: '900', textTransform: 'uppercase'}} />
                    <Area type="step" dataKey="value" stroke="#4f46e5" strokeWidth={5} fill="#eef2ff" fillOpacity={1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-10 rounded-none shadow-sm text-slate-900">
              <h3 className="text-lg font-[1000] uppercase mb-12 border-b-2 border-slate-100 pb-8 flex items-center gap-4 tracking-widest">
                  <Activity size={24} className="text-indigo-600" /> Distribution
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map(([name, value]) => ({ name, value }))}
                      cx="50%" cy="50%" innerRadius={0} outerRadius={130} dataKey="value" strokeWidth={4} stroke="#fff"
                    >
                      {Object.entries(data.analysis?.chart_data?.[activeChartCol] || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '0px', border: '3px solid #000'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="col-span-12 bg-white border-2 border-slate-900 shadow-xl rounded-none overflow-hidden mt-6">
              <div className="p-8 bg-slate-900 flex justify-between items-center">
                  <h3 className="text-[12px] font-[1000] text-white uppercase tracking-[0.5em] flex items-center gap-4">
                      <Table size={20} className="text-emerald-400" /> Descriptive Analysis Matrix
                  </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 font-[1000] text-[11px] uppercase border-b-2 border-slate-200">
                        <tr>
                            <th className="p-8">Variable Identifier</th>
                            <th className="p-8 text-center border-l border-slate-100">Mean Point</th>
                            <th className="p-8 text-center border-l border-slate-100">Median Point</th>
                            <th className="p-8 text-center border-l border-slate-100 text-rose-600">Critical Outliers</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                        {Object.entries(data.analysis?.descriptive_stats || {}).map(([col, s]) => (
                            <tr key={col} className="hover:bg-indigo-50 transition-colors group">
                                <td className="p-8 font-[1000] text-slate-900 text-sm uppercase tracking-tighter group-hover:text-indigo-600">{col}</td>
                                <td className="p-8 text-center border-l border-slate-100 font-black text-slate-600">{s.mean}</td>
                                <td className="p-8 text-center border-l border-slate-100 font-black text-slate-600">{s.median}</td>
                                <td className="p-8 text-center border-l border-slate-100">
                                    <span className={`px-6 py-3 text-[11px] font-[1000] border-2 ${s.outliers > 0 ? 'border-rose-600 text-rose-600 bg-rose-50' : 'border-slate-100 text-slate-200 bg-slate-50'}`}>
                                        {s.outliers} CRITICAL
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>

            {/* AI STRATEGY ENGINE - ZERO LIBRARY FORMATTING */}
            {mlResults && (
              <div className="col-span-12 mt-12 mb-20">
                  <button 
                    onClick={handleReport} 
                    disabled={loading.report}
                    className="w-full bg-slate-900 text-white py-10 font-[1000] uppercase text-2xl tracking-[0.3em] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-8 rounded-none border-b-8 border-indigo-500"
                  >
                      <Sparkles size={32} className="text-indigo-400" /> 
                      {loading.report ? "GENERATING STRATEGY..." : "ACTIVATE EXECUTIVE AI STRATEGY ENGINE"}
                  </button>

                  {report && (
                      <div className="mt-14 bg-white p-12 md:p-24 border-t-[24px] border-indigo-600 shadow-2xl border-2 border-slate-200 rounded-none relative">
                          <div className="flex items-center gap-6 mb-16 border-b-8 border-slate-100 pb-12">
                              <Brain size={60} className="text-indigo-600" />
                              <h2 className="text-6xl font-[1000] uppercase italic tracking-tighter text-slate-900">
                                Executive Report
                              </h2>
                          </div>
                          
                          {/* RENDER THE REPORT USING THE CUSTOM RENDERER DEFINED ABOVE */}
                          <div className="max-w-none">
                            {renderAIReport(report)}
                          </div>
                      </div>
                  )}
              </div>
            )}
          </main>
        ) : (
          <div className="max-w-4xl mx-auto mt-40">
              <div className="bg-white border-8 border-dashed border-slate-100 p-32 text-center rounded-none shadow-inner">
                  <Database size={100} className="text-slate-100 mx-auto mb-10" />
                  <h2 className="text-4xl font-[1000] text-slate-200 uppercase tracking-[0.5em] italic">System Standby</h2>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}