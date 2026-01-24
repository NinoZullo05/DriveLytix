import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.05)_0%,_transparent_50%)]">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-blue/5 blur-[120px] rounded-full -mr-48 -mt-48" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
            <span className="text-white">{t("hero.title_part1")}</span>
            <br />
            <span className="text-accent-cyan">{t("hero.title_part2")}</span>
          </h1>

          <p className="text-lg text-white/50 max-w-lg mb-12 leading-relaxed font-medium">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-5">
            <button className="btn btn-primary px-8 group">
              {t("hero.cta_discover")}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="btn btn-secondary px-8">
              <Play size={14} fill="white" />
              {t("hero.cta_demo")}
            </button>
          </div>

          <div className="mt-16 flex items-center gap-6 border-t border-white/5 pt-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-background-primary bg-background-accent"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-accent-green" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Trusted Solution
                </span>
              </div>
              <p className="text-[11px] text-white/30 font-medium">
                {t("hero.trusted")}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:ml-auto"
        >
          <div className="absolute -inset-4 bg-accent-blue/20 blur-[100px] rounded-full z-0 opacity-50" />
          <img
            src="/assets/hero_mockup.png"
            alt="App Mockup"
            className="relative z-10 w-full max-w-[480px] drop-shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
          />

          {/* Floating Minimal Data Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-1/4 glass p-5 rounded-2xl shadow-2xl z-20 border-white/10 hidden md:block"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Performance
              </span>
              <span className="text-2xl font-black text-white">98%</span>
              <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-accent-green w-[98%]" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
