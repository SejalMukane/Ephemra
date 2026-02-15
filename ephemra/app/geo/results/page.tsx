"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
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
  Download,
  Orbit
} from "lucide-react";

// --- TYPES ---
type GeoRow = {
  timestamp: string;
  x_error: number;
  y_error: number;
  z_error: number;
  satclockerror: number;
  drift: number;
};

export default function GEOResultsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<GeoRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC (UNCHANGED) ---
  useEffect(() => {
    const saved = localStorage.getItem("geo_prediction");

    if (!saved) {
      setError("No prediction data found.");
      setLoading(false);
      return;
    }

    try {
        const parsed = JSON.parse(saved);

        if (parsed.error) {
          setError(parsed.error);
          setLoading(false);
          return;
        }
    
        const processed = parsed.prediction?.map((row: any) => ({
          timestamp: row["utc_time"],
          x_error: row["x_error (m)"],
          y_error: row["y_error (m)"],
          z_error: row["z_error (m)"],
          satclockerror: row["satclockerror (m)"],
          drift: Math.sqrt(
            Math.pow(row["x_error (m)"], 2) +
            Math.pow(row["y_error (m)"], 2) +
            Math.pow(row["z_error (m)"], 2)
          )
        }));
    
        setRows(processed || []);
        setLoading(false);
    } catch (err) {
        setError("Failed to parse GEO prediction data.");
        setLoading(false);
    }
  }, []);

  // --- UI: LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:50px_50px] opacity-20 animate-[pulse_4s_infinite]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
                <div className="w-24 h-24 border-t-4 border-b-4 border-amber-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-24 h-24 border-r-4 border-l-4 border-orange-500 rounded-full animate-spin [animation-duration:2s]"></div>
            </div>
            <div className="mt-8 flex items-center gap-3 text-amber-400 font-mono tracking-widest animate-pulse">
                <Satellite size={20} className="animate-bounce" />
                ANALYZING GEO STATIONARY ORBIT...
            </div>
        </div>
      </div>
    );
  }

  // --- UI: ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,#030014_70%)]"></div>
         
         <div className="relative z-10 p-8 bg-[#0A0A0F] border border-red-500/30 backdrop-blur-xl rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-1 ring-red-500/50">
                <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">GEO Link Failed</h2>
            <p className="text-red-300 mb-8 font-mono text-sm border-t border-b border-red-900/30 py-4 my-4 bg-red-950/20">
                ERROR: {error}
            </p>
            <button 
                onClick={() => router.push("/geo/main_page")}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
            >
                <RefreshCw size={18} /> RETRY CONNECTION
            </button>
         </div>
      </div>
    );
  }

  // --- UI: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden perspective-1000 relative">
      
      {/* ==================== BACKGROUND LAYERS ==================== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1f1208_0%,_#020204_70%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:60px_60px] opacity-10 animate-[pulse_6s_infinite]"></div>
         
         {/* GEO Ring Decoration (Amber) */}
         <div className="absolute -top-[20%] -left-[10%] opacity-20">
            <div className="w-[800px] h-[800px] rounded-full border border-amber-800/30 [transform:rotateX(60deg)] animate-[spin_120s_linear_infinite]"></div>
         </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-8 md:px-8">
        
        {/* ==================== HEADER ==================== */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/5 pb-8">
            <div className="flex flex-col gap-2">
                <button 
                    onClick={() => router.push("/geo/main_page")}
                    className="flex items-center gap-2 text-amber-500 hover:text-amber-300 transition-colors text-xs font-mono tracking-widest uppercase group w-fit"
                >
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Config
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl shadow-lg shadow-amber-900/50">
                        <Satellite className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Orbital Analysis <span className="text-slate-600 font-light">| GEO</span>
                        </h1>
                        <p className="text-slate-400 text-sm">Target Lock: <span className="font-mono text-amber-400">STATIONARY ORBIT</span></p>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="px-5 py-3 bg-[#0A0A0F] border border-amber-500/30 rounded-lg flex flex-col items-end shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                        <Orbit size={10} />
                        Drift Avg
                    </div>
                    <div className="text-lg font-bold text-white leading-none">
                       {(rows.reduce((sum, r) => sum + r.drift, 0) / rows.length).toFixed(4)} m
                    </div>
                </div>
                <div className="px-5 py-3 bg-[#0A0A0F] border border-green-500/30 rounded-lg flex flex-col items-end shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 uppercase tracking-widest mb-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        Status
                    </div>
                    <div className="text-lg font-bold text-white leading-none">LOCKED</div>
                </div>
            </div>
        </header>

        {/* ==================== MAIN CHART SECTION ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* LARGE CHART CONTAINER */}
            <div className="lg:col-span-2 bg-[#08080C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group overflow-hidden">
                {/* Scanner Effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Globe className="text-amber-500" size={18} />
                        Error Components & Drift
                    </h3>
                    <div className="flex gap-4 text-[10px] font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#4f8bff]"></div> X</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a855f7]"></div> Y</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Z</div>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rows}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="timestamp" 
                                stroke="#475569" 
                                tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}}
                                tickLine={false}
                                minTickGap={60}
                            />
                            <YAxis 
                                stroke="#475569" 
                                tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}}
                                tickLine={false}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: "rgba(5, 5, 10, 0.9)", 
                                    borderColor: "rgba(255,255,255,0.1)", 
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                                }}
                                itemStyle={{ padding: 0 }}
                            />
                            <Line type="monotone" dataKey="x_error" stroke="#4f8bff" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="y_error" stroke="#a855f7" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="z_error" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="satclockerror" stroke="#22d3ee" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* DRIFT CHART (Side Panel) */}
            <div className="bg-[#08080C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-green-400" size={18} />
                    <h3 className="text-lg font-bold text-white">Orbital Drift</h3>
                </div>
                
                <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rows}>
                            <defs>
                                <linearGradient id="gradDrift" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="timestamp" hide />
                            <YAxis stroke="#475569" width={30} tick={{fontSize: 10}} />
                            <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: '11px' }} />
                            <Area type="monotone" dataKey="drift" stroke="#34d399" strokeWidth={2} fill="url(#gradDrift)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="mt-4 p-4 bg-green-950/20 border border-green-500/20 rounded-lg">
                    <div className="text-[10px] text-green-500 font-mono uppercase mb-1">Peak Drift</div>
                    <div className="text-xl font-mono text-white">
                        {Math.max(...rows.map(r => r.drift)).toFixed(4)} <span className="text-sm text-slate-500">m</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MINI CHARTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { key: "x_error", title: "X Error", color: "#4f8bff", label: "RADIAL" },
              { key: "y_error", title: "Y Error", color: "#a855f7", label: "ALONG" },
              { key: "z_error", title: "Z Error", color: "#f59e0b", label: "CROSS" },
              { key: "satclockerror", title: "Clock Err", color: "#22d3ee", label: "TIME" },
            ].map((c) => (
                <div key={c.key} className="bg-[#08080C]/60 border border-white/5 rounded-xl p-5 hover:bg-[#0A0A0F] hover:border-amber-500/20 transition-all group">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: c.color}}></div>
                             <h3 className="text-xs font-bold text-white uppercase tracking-wider">{c.title}</h3>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{c.label}</span>
                    </div>
                    <div className="w-full h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={rows}>
                                <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>

        {/* ==================== DATA TABLE ==================== */}
        <div className="bg-[#08080C]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <Table className="text-slate-400" size={18} />
                    <h3 className="text-white font-bold tracking-wide">GEO Ephemeris Log</h3>
                </div>
                <button className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <Download size={14} /> EXPORT CSV
                </button>
            </div>
            
            <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#020205] sticky top-0 z-10 shadow-lg">
                        <tr>
                            <th className="p-4 text-xs font-mono text-slate-500 tracking-widest border-b border-white/10">TIMESTAMP</th>
                            <th className="p-4 text-xs font-mono text-blue-400 tracking-widest border-b border-white/10">X-ERR (m)</th>
                            <th className="p-4 text-xs font-mono text-purple-400 tracking-widest border-b border-white/10">Y-ERR (m)</th>
                            <th className="p-4 text-xs font-mono text-amber-400 tracking-widest border-b border-white/10">Z-ERR (m)</th>
                            <th className="p-4 text-xs font-mono text-cyan-400 tracking-widest border-b border-white/10">CLOCK (m)</th>
                            <th className="p-4 text-xs font-mono text-green-400 tracking-widest border-b border-white/10">DRIFT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-sm">
                        {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="p-4 text-slate-400 group-hover:text-white transition-colors">{row.timestamp}</td>
                                <td className="p-4 text-slate-300">{row.x_error.toFixed(6)}</td>
                                <td className="p-4 text-slate-300">{row.y_error.toFixed(6)}</td>
                                <td className="p-4 text-slate-300">{row.z_error.toFixed(6)}</td>
                                <td className="p-4 text-slate-300">{row.satclockerror.toFixed(6)}</td>
                                <td className="p-4 text-green-300 font-bold bg-green-950/10">{row.drift.toFixed(6)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* ==================== FOOTER ACTIONS ==================== */}
        <div className="flex justify-center gap-6 pb-20">
            <button
                onClick={() => router.push("/geo/main_page")}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold tracking-wide shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.6)] hover:scale-105 transition-all flex items-center gap-3"
            >
                <Zap size={20} className="fill-white" />
                RUN NEW SIMULATION
            </button>
            
            <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 bg-[#1e293b]/50 border border-white/10 hover:bg-white/10 text-white rounded-xl font-medium transition-all flex items-center gap-3"
            >
                <LayoutDashboard size={20} />
                DASHBOARD HOME
            </button>
        </div>

      </div>
      
      {/* Animation Style for Scanner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}