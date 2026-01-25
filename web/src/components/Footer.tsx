import { Cpu, Github, Linkedin, Mail, Twitter } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative pt-32 pb-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6 group cursor-pointer">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-all duration-500">
                <Cpu size={20} className="text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-950 uppercase italic">
                DriveLytix
              </span>
            </div>
            <p className="text-slate-500 font-medium max-w-sm leading-relaxed mb-8 mx-auto md:mx-0">
              The next generation of automotive telemetry and real-time vehicle
              analytics. Engineered for excellence and high performance.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white hover:shadow-lg hover:shadow-slate-200 transition-all duration-300 text-slate-400 hover:text-slate-900"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
              Resources
            </h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                Documentation
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                API Status
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                Firmware Updates
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
              Legal
            </h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors uppercase tracking-widest text-[11px]"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-100">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            © 2026 DriveLytix Analytics. Engineered for Excellence.
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
              Service Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
