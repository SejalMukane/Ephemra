"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Area, AreaChart
} from "recharts";
import { 
  Satellite, 
  ArrowLeft, 
  Table, 
  Activity, 
  Zap, 
  LayoutDashboard,
  Clock,
  Globe,
  RefreshCw,
  AlertTriangle,
  Download
} from "lucide-react";

// --- TYPES ---
type Row = {
  timestamp: string;
  x_error: number;
  y_error: number;
  z_error: number;
  satclockerror: number;
};

export default function MEOResultsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("meo_prediction");
    if (!data) {
      setError("No prediction found locally.");
      setLoading(false);
      return;
    }

    try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          setError(parsed.error);
          setLoading(false);
          return;
        }
    
        const preds: any[] = parsed.prediction;
        const timestamps: string[] = parsed.timestamps;
    
        const processed: Row[] = preds.map((row, i) => ({
          timestamp: new Date(timestamps[i]).toLocaleString(),
          x_error: row[0],
          y_error: row[1],
          z_error: row[2],
          satclockerror: row[3]
        }));
    
        setRows(processed);
        setLoading(false);
    } catch (err) {
        setError("Failed to parse prediction data.");
        setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 border-t-4 border-b-4 border-cyan-500 rounded-full animate-spin"></div>
            <div className="mt-8 flex items-center gap-3 text-cyan-400 font-mono tracking-widest animate-pulse">
                <Satellite size={20} className="animate-bounce" />
                DECRYPTING TELEMETRY STREAM...
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden">
         <div className="relative z-10 p-8 bg-[#0A0A0F] border border-red-500/30 backdrop-blur-xl rounded-2xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Telemetry Lost</h2>
            <p className="text-red-300 mb-8 font-mono text-sm">{error}</p>
            <button onClick={() => router.push("/meo/main_page")} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold">RE-INITIALIZE LINK</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden perspective-1000 relative">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020204_70%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:60px_60px] opacity-10 animate-[pulse_6s_infinite]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 md:px-8">
        
        {/* HEADER */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="flex flex-col gap-2">
                <button onClick={() => router.push("/meo/main_page")} className="flex items-center gap-2 text-cyan-500 hover:text-cyan-300 transition-colors text-xs font-mono tracking-widest uppercase group w-fit">
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Return to Config
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl shadow-lg shadow-cyan-900/50">
                        <Satellite className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Orbital Analysis <span className="text-slate-600 font-light">| MEO</span></h1>
                        <p className="text-slate-400 text-sm">Prediction ID: <span className="font-mono text-cyan-400">#MEO-{Math.floor(Math.random() * 9000) + 1000}</span></p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="px-5 py-3 bg-[#0A0A0F] border border-green-500/30 rounded-lg flex flex-col items-end">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase tracking-widest mb-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>Status</div>
                    <div className="text-lg font-bold text-white leading-none">OPTIMAL</div>
                </div>
            </div>
        </header>

        {/* MAIN CHART SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* LARGE CHART */}
            <div className="lg:col-span-2 bg-[#08080C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="text-blue-500" size={18} /> Positional Deviation</h3>
                    <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Radial</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a855f7]"></div> Along-Track</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Cross-Track</div>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rows}>
                            <defs>
                                <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="timestamp" stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} minTickGap={60} />
                            <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} width={40} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(5, 5, 10, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} itemStyle={{ padding: 0 }} />
                            <Area type="monotone" dataKey="x_error" stroke="#3b82f6" strokeWidth={2} fill="url(#colorX)" />
                            <Area type="monotone" dataKey="y_error" stroke="#a855f7" strokeWidth={2} fill="url(#colorY)" />
                            <Area type="monotone" dataKey="z_error" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CLOCK BIAS SIDE PANEL */}
            <div className="bg-[#08080C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6"><Clock className="text-cyan-400" size={18} /><h3 className="text-lg font-bold text-white">Clock Bias</h3></div>
                <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rows}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="timestamp" hide />
                            <YAxis stroke="#475569" width={30} tick={{fontSize: 10}} />
                            <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: '11px' }} />
                            <Line type="stepAfter" dataKey="satclockerror" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{r: 4, fill: "white"}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* --- MINI CHARTS GRID (Added Back!) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { key: "x_error", title: "X Deviation", color: "#3b82f6", label: "RADIAL" },
              { key: "y_error", title: "Y Deviation", color: "#a855f7", label: "ALONG-TRACK" },
              { key: "z_error", title: "Z Deviation", color: "#f59e0b", label: "CROSS-TRACK" },
              { key: "satclockerror", title: "Clock Bias", color: "#22d3ee", label: "DRIFT" },
            ].map((c) => (
                <div key={c.key} className="bg-[#08080C]/60 border border-white/5 rounded-xl p-5 hover:bg-[#0A0A0F] hover:border-white/10 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: c.color}}></div>
                             <h3 className="text-xs font-bold text-white uppercase tracking-wider">{c.title}</h3>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{c.label}</span>
                    </div>
                    <div className="w-full h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rows}>
                                <defs>
                                    <linearGradient id={`grad_${c.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={c.color} stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor={c.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={1.5} fill={`url(#grad_${c.key})`} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>

        {/* DATA TABLE */}
        <div className="bg-[#08080C]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3"><Table className="text-slate-400" size={18} /><h3 className="text-white font-bold tracking-wide">Ephemeris Log Data</h3></div>
                <button className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors"><Download size={14} /> EXPORT CSV</button>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#020205] sticky top-0 z-10 shadow-lg">
                        <tr>
                            {['TIMESTAMP', 'X-ERR', 'Y-ERR', 'Z-ERR', 'CLOCK'].map(h => (
                                <th key={h} className="p-4 text-xs font-mono text-slate-500 tracking-widest border-b border-white/10">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-sm">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="p-4 text-slate-400 group-hover:text-white">{row.timestamp}</td>
                                <td className="p-4 text-slate-300">{row.x_error.toFixed(6)}</td>
                                <td className="p-4 text-slate-300">{row.y_error.toFixed(6)}</td>
                                <td className="p-4 text-slate-300">{row.z_error.toFixed(6)}</td>
                                <td className="p-4 text-cyan-300 font-bold bg-cyan-950/10">{row.satclockerror.toExponential(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-center gap-6 pb-20">
            <button onClick={() => router.push("/meo/main_page")} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center gap-3"><Zap size={20} className="fill-white" /> RUN NEW MODEL</button>
            <button onClick={() => router.push("/dashboard")} className="px-8 py-4 bg-[#1e293b]/50 border border-white/10 hover:bg-white/10 text-white rounded-xl font-medium flex items-center gap-3"><LayoutDashboard size={20} /> DASHBOARD HOME</button>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: ` @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } } `}} />
    </div>
  );
}