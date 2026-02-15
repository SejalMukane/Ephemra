"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Satellite, 
  ArrowLeft,
  X,
  Cpu
} from "lucide-react";

export default function MEOUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- LOGIC: HANDLE FILE SELECTION ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    console.log("Selected file:", selected);
  };

  // --- LOGIC: UPLOAD & PREDICT ---
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      // Simulating a delay for effect (optional, can remove)
      // await new Promise(r => setTimeout(r, 1500)); 

      const res = await fetch("http://localhost:8000/predict/meo", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        localStorage.setItem(
          "meo_prediction",
          JSON.stringify({ error: data.detail || "Prediction failed" })
        );
        router.push("/meo/results");
        return;
      }

      localStorage.setItem("meo_prediction", JSON.stringify(data));
      router.push("/meo/results");
    } catch (err: any) {
      console.log("Upload error:", err.message);
      localStorage.setItem("meo_prediction", JSON.stringify({ error: err.message }));
      router.push("/meo/results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* ==================== BACKGROUND LAYERS ==================== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f172a_0%,_#020204_70%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
         <div className="absolute inset-0 bg-[radial-gradient(white,transparent_2px)] bg-[size:60px_60px] opacity-10 animate-[pulse_6s_infinite]"></div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-900/50 bg-cyan-950/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
              <Satellite size={12} className="animate-pulse" />
              MEO UPLINK PORTAL
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Upload Telemetry Data
           </h1>
           <p className="text-slate-400 text-lg">
              Initialize the Neural Network by uploading your 7-day CSV dataset.
           </p>
        </div>

        {/* The Card */}
        <div className="bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            
            {/* Top Scanner Effect */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-opacity duration-500 ${loading ? 'opacity-100 animate-[scan_1.5s_ease-in-out_infinite]' : 'opacity-0'}`}></div>

            {/* --- DROP ZONE (Styled Label) --- */}
            <div className="relative mb-8">
               <input
                 type="file"
                 id="file-upload"
                 accept=".csv"
                 onChange={handleFileChange}
                 className="hidden" // Hide the ugly default input
                 disabled={loading}
               />
               <label 
                 htmlFor="file-upload" 
                 className={`
                    flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                    ${file 
                       ? 'border-cyan-500/50 bg-cyan-500/5' 
                       : 'border-white/10 hover:border-cyan-500/30 hover:bg-white/5'}
                    ${loading ? 'pointer-events-none opacity-50' : ''}
                 `}
               >
                  {/* Icon Changes based on state */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${file ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-400'}`}>
                     {file ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                  </div>

                  {/* Text Content */}
                  <div className="text-center space-y-2">
                     {file ? (
                        <>
                           <h3 className="text-xl font-bold text-white">{file.name}</h3>
                           <p className="text-sm text-cyan-400 font-mono">{(file.size / 1024).toFixed(2)} KB • READY FOR UPLOAD</p>
                        </>
                     ) : (
                        <>
                           <h3 className="text-lg font-bold text-white">Click to Select CSV</h3>
                           <p className="text-sm text-slate-500">or drag and drop file here</p>
                        </>
                     )}
                  </div>
               </label>

               {/* Clear Button (Only if file selected) */}
               {file && !loading && (
                 <button 
                   onClick={(e) => { e.preventDefault(); setFile(null); setError(null); }}
                   className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 hover:text-red-400 rounded-full text-slate-400 transition-colors"
                 >
                    <X size={16} />
                 </button>
               )}
            </div>

            {/* --- ERROR MESSAGE --- */}
            {error && (
               <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-300 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
               </div>
            )}

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col gap-4">
               <button
                 onClick={handleUpload}
                 disabled={loading || !file}
                 className={`
                    w-full py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all duration-300
                    ${loading 
                       ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/20 cursor-wait'
                       : file 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white hover:scale-[1.02]' 
                          : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                 `}
               >
                  {loading ? (
                     <>
                        <Cpu size={20} className="animate-spin" />
                        PROCESSING NEURAL NET...
                     </>
                  ) : (
                     "INITIALIZE PREDICTION"
                  )}
               </button>
               
               <button
                 onClick={() => router.push("/dashboard")}
                 disabled={loading}
                 className="w-full py-3 text-sm text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2"
               >
                  <ArrowLeft size={16} /> Cancel Operation
               </button>
            </div>

            {/* --- FOOTER INFO --- */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
               <p className="text-xs text-slate-500 leading-relaxed font-mono">
                  REQUIRED COLUMNS: <span className="text-cyan-500">utc_time</span>, <span className="text-cyan-500">x_error</span>, <span className="text-cyan-500">y_error</span>, <span className="text-cyan-500">z_error</span>, <span className="text-cyan-500">satclockerror</span>
                  <br />
                  <span className="opacity-50">SYSTEM AUTO-DETECTS SAMPLING INTERVAL (15-MIN)</span>
               </p>
            </div>

        </div>
      </div>
      
      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
            0% { left: -100%; opacity: 0; }
            50% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}