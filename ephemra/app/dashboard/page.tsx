import Link from 'next/link';
import { 
  Satellite, 
  Globe, 
  Navigation, 
  Disc, 
  ArrowRight, 
  Wifi, 
  Activity,
  Cpu,
  Zap
} from 'lucide-react';

export default function DashboardSelection() {
  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-hidden perspective-1000">

      {/* ==================== 0. AMBIENT BACKGROUND & PARTICLES ==================== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Deep Space Gradient */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1d2e_0%,#000000_100%)]"></div>
         
         {/* Noise Texture */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                 
         {/* Drifting Stars (Simulated with CSS Gradients) */}
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:50px_50px] opacity-20 animate-[pulse_4s_infinite]"></div>
      </div>

      {/* ==================== 1. CENTRAL HOLOGRAPHIC EARTH ==================== */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-60">
          {/* The Wireframe Globe */}
          <div className="relative w-96 h-96">
             <div className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.2)]"></div>
             {/* Grid Texture */}
             <div className="absolute inset-0 rounded-full bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[spin_60s_linear_infinite]"></div>
             <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_60%,#030014_100%)]"></div>
          </div>

          {/* MEO Orbit Ring (3D Tilted) */}
          <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/30 [transform:rotateX(75deg)] animate-[spin_20s_linear_infinite]">
             <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_20px_cyan]"></div>
          </div>

          {/* GEO Orbit Ring (3D Tilted Opposite) */}
          <div className="absolute w-[900px] h-[900px] rounded-full border border-dashed border-amber-500/30 [transform:rotateX(75deg)_rotateY(20deg)] animate-[spin_40s_linear_infinite_reverse]">
             <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_20px_orange]"></div>
          </div>
      </div>

      {/* ==================== 2. MAIN INTERFACE LAYER ==================== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* HUD Header */}
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start opacity-70">
           <div className="flex flex-col gap-1">
              <div className="text-[10px] font-mono text-cyan-500 tracking-[0.3em]">SECURE CONNECTION ESTABLISHED</div>
              <div className="text-xs font-mono text-slate-500">LAT: 12.9716° N | LON: 77.5946° E</div>
           </div>
           <div className="flex gap-4">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
           </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-16 space-y-4 relative">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-300 text-xs font-mono tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Activity size={12} className="animate-pulse" />
              AWAITING INPUT
           </div>
           
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500">
              Select Orbit<span className="text-cyan-500">.</span>
           </h1>
        </div>

        {/* THE HOLOGRAPHIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
          
          {/* === CARD 1: MEO === */}
          <Link href="/meo/main_page" className="group relative h-[450px] w-full perspective-1000">
             
             {/* Hover Scan Effect (The Laser) */}
             <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_cyan] z-50 opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none"></div>

             {/* Card Body */}
             <div className="relative h-full bg-[#05050A]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:border-cyan-500/50 group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.3)]">
                
                {/* Internal Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Top Section */}
                <div className="relative z-10">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500/20 transition-colors">
                         <Navigation size={32} />
                      </div>
                      <div className="text-right">
                         <div className="text-4xl font-mono font-bold text-white opacity-20 group-hover:opacity-100 transition-opacity">01</div>
                      </div>
                   </div>

                   <h2 className="text-4xl font-bold text-white mt-8 mb-2 group-hover:text-cyan-300 transition-colors">MEO <span className="text-lg font-normal text-slate-400">Constellation</span></h2>
                   <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
                      Medium Earth Orbit. Primary domain for GNSS navigation satellites (GPS, Galileo, BeiDou). High velocity tracking required.
                   </p>
                </div>

                {/* Bottom Stats */}
                <div className="relative z-10 border-t border-white/10 pt-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1 font-mono text-xs text-cyan-500">
                         <div>ALT: 20,200 KM</div>
                         <div>SPD: 3.9 KM/S</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                         <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                   </div>
                </div>
             </div>
          </Link>

          {/* === CARD 2: GEO === */}
          <Link href="/geo/main_page" className="group relative h-[450px] w-full perspective-1000">
             
             {/* Hover Scan Effect (The Laser) */}
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_20px_orange] z-50 opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none"></div>

             {/* Card Body */}
             <div className="relative h-full bg-[#05050A]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:border-amber-500/50 group-hover:scale-[1.02] group-hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.3)]">
                
                {/* Internal Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                
                {/* Top Section */}
                <div className="relative z-10">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:bg-amber-500/20 transition-colors">
                         <Disc size={32} />
                      </div>
                      <div className="text-right">
                         <div className="text-4xl font-mono font-bold text-white opacity-20 group-hover:opacity-100 transition-opacity">02</div>
                      </div>
                   </div>

                   <h2 className="text-4xl font-bold text-white mt-8 mb-2 group-hover:text-amber-300 transition-colors">GEO <span className="text-lg font-normal text-slate-400">Constellation</span></h2>
                   <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
                      Geostationary Earth Orbit. Fixed position relative to ground observers. Ideal for communications and weather monitoring.
                   </p>
                </div>

                {/* Bottom Stats */}
                <div className="relative z-10 border-t border-white/10 pt-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1 font-mono text-xs text-amber-500">
                         <div>ALT: 35,786 KM</div>
                         <div>SPD: 3.07 KM/S</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                         <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </div>
                   </div>
                </div>
             </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-6 opacity-50">
           <TechBadge icon={Wifi} label="TELEMETRY: ONLINE" />
           <TechBadge icon={Cpu} label="GPU CLUSTER: READY" />
           <TechBadge icon={Zap} label="LATENCY: 12ms" />
        </div>

      </div>
      
      {/* GLOBAL CSS FOR SCAN ANIMATION */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}

function TechBadge({ icon: Icon, label }: any) {
   return (
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400">
         <Icon size={12} />
         {label}
      </div>
   )
}