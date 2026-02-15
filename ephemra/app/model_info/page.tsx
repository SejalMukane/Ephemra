"use client";

import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  Database, 
  Calendar, 
  Layers, 
  Activity, 
  GitBranch, 
  ArrowLeft,
  Satellite,
  Globe,
  Zap,
  Radio,
  ArrowRight // Added ArrowRight for the new Navbar
} from "lucide-react";

// ===============================
//   STATIC MODEL INFO
// ===============================
const modelInfo = {
  meo: {
    model_name: "MEO-Transformer-v2",
    version: "v2.0.4",
    model_type: "Transformer + GRU Hybrid",
    seq_len: 96,
    pred_len: 96,
    features: 4,
    trained_on: "2024-11-12",
    dataset: "MEO Ephemeris (2020–2024)",
    description:
      "Deep learning architecture optimized for Medium Earth Orbit dynamics. Utilizes Gated Recurrent Units for short-term noise dampening and Transformer Attention heads for long-range orbital drift patterns.",
    status: "ACTIVE"
  },

  geo: {
    model_name: "GEO-Transformer-X1",
    version: "v1.5.0",
    model_type: "Pure Transformer Encoder",
    seq_len: 96,
    pred_len: 96,
    features: 4,
    trained_on: "2024-11-20",
    dataset: "GEO Ephemeris (2020–2024)",
    description:
      "Specialized for Geostationary constraints. Forecasts station-keeping maneuvers and long-term clock bias trends by analyzing historic deviations in the 24-hour orbital period.",
    status: "STANDBY"
  }
};

// ===============================
//        HELPER COMPONENT
// ===============================
function SpecItem({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
            <div className={`p-2 rounded-md bg-opacity-10 ${color === 'cyan' ? 'bg-cyan-500 text-cyan-400' : 'bg-amber-500 text-amber-400'}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{value}</p>
            </div>
        </div>
    )
}

// ===============================
//      MODEL CARD COMPONENT
// ===============================
function ModelCard({ data, type }: { data: any, type: 'meo' | 'geo' }) {
  const isMeo = type === 'meo';
  const accentColor = isMeo ? "text-cyan-400" : "text-amber-400";
  const borderColor = isMeo ? "border-cyan-500/30" : "border-amber-500/30";
  const glowColor = isMeo ? "shadow-cyan-500/20" : "shadow-amber-500/20";
  const gradient = isMeo ? "from-cyan-500/10" : "from-amber-500/10";

  return (
    <div className={`relative group w-full h-full`}>
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-b ${gradient} to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
      
      <div className={`relative h-full bg-[#0A0A0F]/90 backdrop-blur-xl border ${borderColor} rounded-2xl p-8 flex flex-col shadow-2xl ${glowColor}`}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${borderColor} bg-white/[0.02]`}>
                    {isMeo ? <Satellite size={28} className={accentColor} /> : <Globe size={28} className={accentColor} />}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{data.model_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${borderColor} ${accentColor} bg-white/[0.02]`}>
                            {data.version}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Build: {data.status}</span>
                    </div>
                </div>
            </div>
            {/* Status Dot */}
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isMeo ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-amber-500 shadow-[0_0_10px_orange]'} animate-pulse`}></span>
            </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <SpecItem icon={Cpu} label="Architecture" value={data.model_type} color={isMeo ? 'cyan' : 'amber'} />
            <SpecItem icon={Calendar} label="Training Date" value={data.trained_on} color={isMeo ? 'cyan' : 'amber'} />
            <SpecItem icon={Database} label="Dataset Source" value={data.dataset} color={isMeo ? 'cyan' : 'amber'} />
            <SpecItem icon={Layers} label="Input Features" value={`${data.features} Channels`} color={isMeo ? 'cyan' : 'amber'} />
            <SpecItem icon={GitBranch} label="Sequence Len" value={`${data.seq_len} Epochs`} color={isMeo ? 'cyan' : 'amber'} />
            <SpecItem icon={Activity} label="Prediction Len" value={`${data.pred_len} Epochs`} color={isMeo ? 'cyan' : 'amber'} />
        </div>

        {/* Description */}
        <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-sm text-slate-400 leading-relaxed font-light">
                <span className={`${accentColor} font-mono text-xs uppercase tracking-widest block mb-2`}>// System Description</span>
                {data.description}
            </p>
        </div>

      </div>
    </div>
  );
}

// ===============================
//        MAIN PAGE
// ===============================

export default function ModelInformationPage() {
  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden relative">

      {/* --- BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1d2e_0%,#000000_100%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:60px_60px] opacity-10 animate-[pulse_6s_infinite]"></div>
      </div>

      {/* --- CENTRAL DECORATION (The Planet between cards) --- */}
      <div className="fixed inset-0 flex items-center justify-center z-0 opacity-40 pointer-events-none">
          <div className="w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute w-[400px] h-[400px] border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_20px_white]"></div>
      </div>

      {/* ==================== FLOATING NAV (ADDED) ==================== */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-wider">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 p-1.5 rounded-lg">
              <Satellite size={16} className="text-white" />
            </div>
            <span>EPHERMA<span className="text-cyan-400">.AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/#features" className="hover:text-white transition-colors">Technology</Link>
            <Link href="/#data" className="hover:text-white transition-colors">Ephemeris Data</Link>
          </div>

          <Link href="/dashboard" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
             Launch App <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT CONTAINER --- */}
      {/* Adjusted padding top (pt-32) to clear the floating navbar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        
        {/* --- PAGE HEADER --- */}
        <header className="flex justify-between items-center mb-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-sm font-medium">Return to Console</span>
            </Link>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
                <Radio size={12} className="text-green-500 animate-pulse" />
                REGISTRY: ONLINE
            </div>
        </header>

        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Model Registry</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Technical specifications for the hybrid neural networks powering the SatEphemeris prediction engine.
            </p>
        </div>

        {/* --- CARDS LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* MEO Card */}
            <div className="lg:mt-0">
                <ModelCard data={modelInfo.meo} type="meo" />
            </div>

            {/* GEO Card */}
            <div className="lg:mt-0"> 
                <ModelCard data={modelInfo.geo} type="geo" />
            </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-20 pt-8 border-t border-white/5 flex justify-center text-xs text-slate-600 font-mono gap-8">
            <div className="flex items-center gap-2">
                <Zap size={12} /> LATENCY: 12ms
            </div>
            <div className="flex items-center gap-2">
                <Database size={12} /> REPO: v2.4.0
            </div>
        </div>

      </div>
    </div>
  );
}