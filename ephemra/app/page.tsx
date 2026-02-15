import Link from 'next/link';
import { 
  Satellite, 
  Globe, 
  Activity, 
  Cpu, 
  Database, 
  ArrowRight, 
  Terminal,
  Radio,
  Ruler,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';

export default function HomeOrbital() {
  return (
    <main className="min-h-screen bg-[#030014] text-slate-200 overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black perspective-1000">
      
      {/* ==================== 1. BACKGROUND: Deep Space & Stars ==================== */}
      {/* We keep this Layer A for the "Hyper-Immersive" atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1d2e_0%,#000000_100%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:50px_50px] opacity-20 animate-[pulse_4s_infinite]"></div>
      </div>

      {/* ==================== 2. CONTENT LAYER ==================== */}
      <div className="relative z-10">

        {/* ==================== FLOATING NAV ==================== */}
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-wider">
              <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 p-1.5 rounded-lg">
                <Satellite size={16} className="text-white" />
              </div>
              <span>EPHEMRA<span className="text-cyan-400">.AI</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Technology</a>
              <a href="#data" className="hover:text-white transition-colors">Ephemeris Data</a>
            </div>

            <Link href="/dashboard" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
               Launch App <ArrowRight size={14} />
            </Link>
          </div>
        </nav>

        {/* ==================== HERO SECTION (Split Layout) ==================== */}
        <section className="min-h-screen flex items-center pt-20 pb-20 px-6 relative overflow-hidden">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              
              {/* LEFT COLUMN: Text Content */}
              <div className="z-20 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/50 bg-cyan-950/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM NOMINAL
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-medium text-white leading-[1.0] tracking-tight mb-6 drop-shadow-2xl">
                    Predicting the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Drift of Time.</span>
                  </h1>

                  <p className="text-lg text-slate-300 leading-relaxed max-w-xl mb-8 drop-shadow-md mx-auto lg:mx-0">
                    An advanced ML framework for modeling the error buildup between uploaded and modeled GNSS satellite clock & ephemeris parameters.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2">
                        <Zap size={20} className="fill-white" /> 
                        Initialize Model
                      </Link>
                      <Link href="/model_info" className="px-8 py-4 bg-white/5 border border-white/20 hover:bg-white/10 text-slate-200 rounded-lg font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2">
                        <Terminal size={18} />
                        Documentation
                      </Link>
                  </div>

                  {/* Integrated Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
                    <div>
                        <div className="text-2xl lg:text-3xl font-mono text-white">08</div>
                        <div className="text-[10px] text-cyan-500 uppercase tracking-widest">Forecast Horizon</div>
                    </div>
                    <div>
                        <div className="text-2xl lg:text-3xl font-mono text-white">15<span className="text-sm">m</span></div>
                        <div className="text-[10px] text-cyan-500 uppercase tracking-widest">Resolution</div>
                    </div>
                    <div>
                        <div className="text-2xl lg:text-3xl font-mono text-white">GAN</div>
                        <div className="text-[10px] text-cyan-500 uppercase tracking-widest">Synthesis Core</div>
                    </div>
                  </div>
              </div>

              {/* RIGHT COLUMN: Your Specific Visualization */}
              {/* This is the code you asked to adjust and include */}
              <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000 lg:-mr-20">
                    
                    {/* 1. The Earth */}
                    <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-[#1e3a8a] to-[#0f172a] shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.8),0_0_80px_rgba(30,58,138,0.5)] z-20 flex items-center justify-center">
                        {/* Grid Lines on Earth */}
                        <div className="absolute inset-0 rounded-full opacity-40 bg-[linear-gradient(transparent_9px,#ffffff_10px)] bg-[size:10px_10px] [mask-image:radial-gradient(circle,black_60%,transparent_100%)]"></div>
                        {/* Atmosphere Glow */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl"></div>
                    </div>

                    {/* 2. LEO Orbit Ring */}
                    <div className="absolute w-[400px] h-[400px] rounded-full border border-slate-600/50 animate-[spin_20s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-slate-100 rounded-sm shadow-[0_0_15px_white]"></div> 
                    </div>

                    {/* 3. MEO Orbit Ring (Tilted) */}
                    <div className="absolute w-[650px] h-[650px] rounded-full border border-cyan-700/60 animate-[spin_45s_linear_infinite_reverse] [transform:rotateX(60deg)]">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_20px_cyan]"></div>
                    </div>

                    {/* 4. GEO Orbit Ring (Dashed) */}
                    <div className="absolute w-[850px] h-[850px] rounded-full border border-dashed border-slate-700/50 animate-[spin_80s_linear_infinite] opacity-60">
                        <div className="absolute right-0 top-1/2 translate-x-1.5 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_20px_orange]"></div>
                    </div>
              </div>

           </div>
        </section>

        {/* ==================== PROBLEM BREAKDOWN (Cards) ==================== */}
        <section id="mission" className="py-24 bg-[#030014]/80 backdrop-blur-xl border-y border-white/5 relative z-20">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                 <div>
                    <h2 className="text-3xl font-medium text-white mb-2">Technical Objective</h2>
                    <p className="text-slate-400 max-w-2xl">
                       Modeling the deviation between Broadcast (Uploaded) and Precise (Modeled) ephemeris data to minimize GNSS positioning errors.
                    </p>
                 </div>
                 <div className="h-px flex-1 bg-slate-800 mx-8 hidden md:block relative top-[-10px]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <TechCard 
                    icon={Clock} 
                    title="Clock Bias Error" 
                    desc="Atomic clocks on satellites drift over time. We use LSTMs to predict the stochastic component of this drift relative to ground truth."
                 />
                 <TechCard 
                    icon={Layers} 
                    title="Ephemeris Deviation" 
                    desc="Orbital path prediction errors (Radial, Along-track, Cross-track). Captured using Transformer attention mechanisms for long-range dependency."
                 />
                 <TechCard 
                    icon={Ruler} 
                    title="Distribution Fit" 
                    desc="Ensuring the error residuals adhere to a Gaussian (Normal) distribution, validating the robustness of the predictive model."
                 />
              </div>
           </div>
        </section>

        {/* ==================== METHODOLOGY STRIP ==================== */}
        <section id="models" className="py-24 px-6 bg-[#030014] relative z-20">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h2 className="text-3xl font-medium text-white">Algorithmic Approach</h2>
                    
                    <div className="space-y-6">
                       <MethodItem 
                          title="Recurrent Neural Networks (LSTM/GRU)"
                          desc="For handling sequential time-series data of clock biases, effectively managing the vanishing gradient problem."
                       />
                       <MethodItem 
                          title="Generative Adversarial Networks (GANs)"
                          desc="Used to synthesize realistic error patterns to augment training data and improve model generalization."
                       />
                       <MethodItem 
                          title="Transformers"
                          desc="Leveraging self-attention mechanisms to correlate ephemeris errors across different satellites in the constellation."
                       />
                    </div>
                 </div>

                 {/* Visual Representation of Data Flow */}
                 <div className="bg-[#0A0A0F] border border-slate-800 rounded-lg p-8 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    
                    <div className="font-mono text-sm text-cyan-400 mb-6"> SYSTEM_PIPELINE_VIEW</div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 bg-white/5 border border-slate-800 rounded">
                          <Database size={20} className="text-slate-500" />
                          <div className="flex-1">
                             <div className="text-sm text-white">Input: 7-Day Dataset</div>
                             <div className="text-xs text-slate-600">GEO/GSO & MEO Satellites</div>
                          </div>
                          <ArrowRight size={16} className="text-slate-600" />
                       </div>

                       <div className="flex items-center gap-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded">
                          <Cpu size={20} className="text-blue-400" />
                          <div className="flex-1">
                             <div className="text-sm text-blue-100">Processing: Hybrid Model</div>
                             <div className="text-xs text-blue-300/50">LSTM + Transformer Ensemble</div>
                          </div>
                          <Activity size={16} className="text-blue-400 animate-pulse" />
                       </div>

                       <div className="flex items-center gap-4 p-4 bg-green-900/10 border border-green-900/30 rounded">
                          <Radio size={20} className="text-green-400" />
                          <div className="flex-1">
                             <div className="text-sm text-green-100">Output: 8th Day Forecast</div>
                             <div className="text-xs text-green-300/50">15-min Intervals</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="border-t border-white/5 bg-[#020205] py-12 text-sm relative z-20">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500">
              <div>
                 &copy; 2025 Orbital Prediction System. <span className="text-slate-700 mx-2">|</span> ISRO Challenge Problem #25176
              </div>
              <div className="mt-4 md:mt-0 font-mono text-xs">
                 STATUS: <span className="text-green-500">OPERATIONAL</span>
              </div>
           </div>
        </footer>

      </div>
    </main>
  );
}

// --- SUBCOMPONENTS ---

function TechCard({ icon: Icon, title, desc }:  any) {
  return (
     <div className="group p-6 bg-[#0A0A0F] border border-slate-800 hover:border-cyan-500/50 transition-colors rounded-sm">
        <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center mb-4 group-hover:bg-cyan-900/30 transition-colors">
           <Icon size={20} className="text-slate-300 group-hover:text-cyan-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
           {desc}
        </p>
     </div>
  )
}

function MethodItem({ title, desc }: { title: string, desc: string }) {
   return (
      <div className="pl-6 border-l border-slate-800 hover:border-cyan-500 transition-colors">
         <h4 className="text-lg text-white font-medium mb-1">{title}</h4>
         <p className="text-slate-400 text-sm">{desc}</p>
      </div>
   )
}


