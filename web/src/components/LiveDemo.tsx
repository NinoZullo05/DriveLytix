import { motion } from "framer-motion";
import {
  Activity,
  Cloud,
  Cpu,
  Download,
  Gauge,
  Maximize2,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const generateData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: i,
      rpm: 2000 + Math.random() * 4000,
      velocity: 60 + Math.random() * 40,
    });
  }
  return data;
};

const LiveDemo: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [
          ...prev.slice(1),
          {
            time: prev[prev.length - 1].time + 1,
            rpm: 2000 + Math.random() * 4000,
            velocity: 40 + Math.random() * 80,
          },
        ];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  return (
    <section id="demo" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-6"
          >
            {t("demo.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            {t("demo.subtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="px-10 py-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                  Live Telemetry
                </span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest">
                  {t("demo.simulation")}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  OBDII v2.4
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5 text-slate-400">
              <div className="flex items-center gap-2 group cursor-pointer hover:text-slate-900 transition-colors">
                <Settings size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Config
                </span>
              </div>
              <Maximize2
                size={18}
                className="hover:text-slate-900 cursor-pointer transition-colors"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4">
            <div className="lg:col-span-3 p-10">
              <div className="grid sm:grid-cols-2 gap-10 mb-12">
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge size={16} className="text-blue-600" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      Engine Speed
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-slate-950 tabular-nums">
                      {Math.floor(latest.rpm).toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-blue-600 tracking-widest">
                      RPM
                    </span>
                  </div>
                  <div className="mt-6 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(latest.rpm / 8000) * 100}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity size={16} className="text-blue-600" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                      Velocity
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-slate-950 tabular-nums">
                      {Math.floor(latest.velocity)}
                    </span>
                    <span className="text-sm font-bold text-blue-600 tracking-widest">
                      MPH
                    </span>
                  </div>
                  <div className="mt-6 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(latest.velocity / 120) * 100}%` }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full mt-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rpm"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRpm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border-l border-slate-100 bg-slate-50/30 p-10 flex flex-col gap-10">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    <span className="text-slate-400">Memory Load</span>
                    <span className="text-blue-600">1.2 GB</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[45%]" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Cpu size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    System Modules
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-bold text-slate-900">
                      Bluetooth LE
                    </span>
                    <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                      Stable
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-bold text-slate-900">
                      CAN-BUS Link
                    </span>
                    <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <button className="mt-auto btn btn-accent w-full py-4 text-xs">
                <Download size={16} />
                {t("demo.export")}
              </button>
            </div>
          </div>

          <div className="px-10 py-6 bg-slate-950 flex flex-wrap justify-between items-center gap-6">
            <div className="flex gap-10 text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">
              <div className="flex flex-col gap-1">
                <span className="text-white/20">Session</span>
                <span>00:42:18</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white/20">Packets</span>
                <span>1.28 GB</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 px-4 py-2 rounded-xl">
              <Cloud size={14} className="text-blue-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                Cloud Sync Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemo;
