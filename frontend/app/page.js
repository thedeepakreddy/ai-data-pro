"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, BarChart3, Brain, CheckCircle, Activity, Sparkles, Table } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DataDashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [target, setTarget] = useState("");
  const [mlResults, setMlResults] = useState(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState({ upload: false, train: false, report: false });

  // 1. Upload & Analysis
  const handleUpload = async () => {
    if (!file) return;
    setLoading({ ...loading, upload: true });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setData(res.data);
      setTarget(res.data.summary.columns[res.data.summary.columns.length - 1]);
    } catch (err) { alert("Upload failed. Make sure backend is running on port 8000!"); }
    setLoading({ ...loading, upload: false });
  };

  // 2. Machine Learning
  const handleTrain = async () => {
    setLoading({ ...loading, train: true });
    try {
      const res = await axios.post(`http://localhost:8000/train?target_column=${target}`);
      setMlResults(res.data);
    } catch (err) { alert("Training failed."); }
    setLoading({ ...loading, train: false });
  };

  // 3. AI Storytelling
  const handleReport = async () => {
    setLoading({ ...loading, report: true });
    try {
      // Make sure this matches your backend address
      const res = await axios.post('http://127.0.0.1:8000/report');
      setReport(res.data.report);
    } catch (err) { 
      console.error(err);
      alert("AI report failed."); 
    }
    setLoading({ ...loading, report: false });
};

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-indigo-600 flex items-center gap-3">
          <Brain size={44} /> INSIGHT-AI
        </h1>
        <p className="text-slate-500 font-semibold ml-12">Your End-to-End Data Science Partner</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: INPUTS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Upload size={22} className="text-indigo-500"/> 1. Data Input</h3>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-slate-500 mb-6" />
            <button onClick={handleUpload} disabled={loading.upload} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 disabled:bg-slate-300 transition">
              {loading.upload ? "CLEANING DATA..." : "CLEAN & ANALYZE"}
            </button>
          </div>

          {data && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 animate-in fade-in duration-500">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Activity size={22} className="text-emerald-500"/> 2. Prediction Target</h3>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full mb-6 p-3 border-2 border-slate-100 rounded-xl bg-slate-50 font-medium">
                {data.summary.columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
              <button onClick={handleTrain} disabled={loading.train} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 disabled:bg-slate-300 transition">
                {loading.train ? "AI IS LEARNING..." : "RUN AUTO-ML"}
              </button>
            </div>
          )}

          {mlResults && (
            <button onClick={handleReport} disabled={loading.report} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 rounded-3xl font-black shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.03] transition-all">
              <Sparkles /> {loading.report ? "WRITING STORY..." : "GENERATE AI STRATEGY"}
            </button>
          )}
        </div>

        {/* RIGHT PANEL: VISUALS */}
        <div className="lg:col-span-8 space-y-8">
          {!data ? (
            <div className="h-96 border-4 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-300">
              <Table size={80} strokeWidth={1} />
              <p className="font-bold text-xl mt-4">Waiting for your messy data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
                  <p className="text-xs font-black text-slate-400 uppercase">Rows</p>
                  <p className="text-3xl font-black">{data.summary.total_rows}</p>
                </div>
                {mlResults && (
                  <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg col-span-2 text-white text-center">
                    <p className="text-xs font-black text-indigo-200 uppercase">Prediction Power</p>
                    <p className="text-3xl font-black">{(mlResults.score * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-200">
                <h3 className="font-black text-xl mb-8 flex items-center gap-2 text-slate-700">
                  <BarChart3 size={24} className="text-indigo-500"/> DATA DISTRIBUTION
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(data.analysis.chart_data[Object.keys(data.analysis.chart_data)[0]] || {}).map(([name, value]) => ({ name, value }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={11} fontWeight="bold" />
                      <YAxis fontSize={11} fontWeight="bold" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {report && (
                <div className="bg-white p-10 rounded-[40px] shadow-2xl border-t-8 border-purple-500">
                  <h3 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-3">
                    <Sparkles size={28} className="text-purple-500"/> AI STRATEGY REPORT
                  </h3>
                  <div className="text-slate-600 whitespace-pre-wrap leading-loose font-medium text-lg">
                    {report}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}