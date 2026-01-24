import { Cloud, Download, Maximize2, Settings } from "lucide-react";
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

  return (
    <section id="demo" className="py-24 bg-background-secondary relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="section-title mb-4">{t("demo.title")}</h2>
          <p className="section-subtitle">{t("demo.subtitle")}</p>
        </div>

        <div className="glass rounded-[32px] overflow-hidden shadow-2xl border-white/5 bg-[#0d1017]">
          {/* Dashboard Header */}
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Live Stream: OBDI-4592-TX
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg bg-white/10 text-xs font-bold uppercase">
                  {t("demo.simulation")}
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase text-white/30 hover:text-white transition-colors">
                  {t("demo.history")}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/50">
              <Settings size={20} className="hover:text-white cursor-pointer" />
              <Maximize2
                size={20}
                className="hover:text-white cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 min-h-[500px]">
            {/* Chart Area */}
            <div className="lg:col-span-3 p-8">
              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-xs uppercase text-white/40 font-bold mb-1">
                    Engine Output
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">
                      {Math.floor(data[data.length - 1].rpm).toLocaleString()}
                    </span>
                    <span className="text-white/40 font-bold">RPM</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-white/40 font-bold mb-1">
                    Vehicle Velocity
                  </p>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-4xl font-black text-accent-cyan">
                      {Math.floor(data[data.length - 1].velocity)}
                    </span>
                    <span className="text-accent-cyan/60 font-bold">MPH</span>
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#00ff88"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00ff88"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#00f2ff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00f2ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1e26",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rpm"
                      stroke="#00ff88"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRpm)"
                    />
                    <Area
                      type="monotone"
                      dataKey="velocity"
                      stroke="#00f2ff"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVel)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="border-l border-white/5 bg-black/10 p-8 flex flex-col gap-8">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span className="text-white/40">Fuel Reserve</span>
                  <span>64%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: "64%" }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-white/40 font-bold uppercase mb-4">
                  Diagnostics Console
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-green/10 border border-accent-green/20">
                    <div className="w-5 h-5 rounded-full bg-accent-green flex items-center justify-center text-[10px] text-background-primary font-bold">
                      ✓
                    </div>
                    <p className="text-xs">
                      Oil Pressure Optimal
                      <br />
                      <span className="text-[10px] opacity-50">
                        Stable at 45 PSI
                      </span>
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      !
                    </div>
                    <p className="text-xs">
                      5G Connectivity
                      <br />
                      <span className="text-[10px] opacity-50">
                        Latency: 14ms
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-auto btn btn-secondary w-full text-xs py-2 bg-white/5">
                <Download size={14} />
                {t("demo.export")}
              </button>
            </div>
          </div>

          <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase text-white/30 tracking-widest">
            <div className="flex gap-8">
              <span>Session Time: 00:42:18</span>
              <span>Data Packets: 1.28 GB</span>
              <span>VIN Hash: 1HGCM...8293</span>
            </div>
            <div className="flex items-center gap-2 text-accent-cyan">
              <Cloud size={12} />
              <span>Cloud Sync Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
