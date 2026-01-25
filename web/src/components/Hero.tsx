import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Star, Zap } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden tech-grid-light">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 mb-8 shadow-sm">
              <Star size={14} className="text-blue-600 fill-blue-600" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-blue-700">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1] mb-8 tracking-tighter text-slate-950">
              {t("hero.title_part1")}
              <br />
              <span className="text-blue-600">{t("hero.title_part2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button className="btn btn-primary px-10 py-4 text-base group shadow-xl shadow-slate-200">
                {t("hero.cta_discover")}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button className="btn btn-secondary px-10 py-4 text-base group">
                <Play
                  size={16}
                  className="fill-slate-900 group-hover:scale-110 transition-transform"
                />
                {t("hero.cta_demo")}
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8 border-t border-slate-100 pt-8">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-green-600" />
                  <span className="text-sm font-bold text-slate-900">
                    100% Secure
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {t("hero.trusted")}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-20 bg-blue-50/50 blur-[100px] rounded-full -z-10" />

            <div className="glass-card p-3 rounded-[3rem] shadow-2xl shadow-slate-200/50">
              <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-200 aspect-[4/3] relative">
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-1.5 rounded-full bg-slate-200"
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Status
                      </div>
                      <div className="text-xs text-green-600 font-bold">
                        CONNECTED
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                      Current Velocity
                    </div>
                    <div className="text-8xl font-black text-slate-950 tracking-tighter leading-none">
                      <motion.span
                        animate={{ opacity: [1, 0.9, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        120
                      </motion.span>
                    </div>
                    <div className="text-sm font-black text-blue-600 tracking-widest mt-2 uppercase italic">
                      Kilometers per Hour
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Engine Load
                      </div>
                      <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
                        <Zap size={16} className="text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 glass-card p-6 shadow-xl hidden md:block"
            >
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Fuel Economy
              </div>
              <div className="text-3xl font-black text-slate-950">
                14.2 <span className="text-sm text-slate-400">km/L</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
