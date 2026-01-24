import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-blue/20 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-cyan/10 blur-[100px] rounded-full z-0" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-6 group cursor-default">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-sm font-semibold text-accent-blue tracking-wide uppercase">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
            <span className="block">{t("hero.title_part1")}</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-cyan italic">
              {t("hero.title_part2")}
            </span>
          </h1>

          <p className="text-xl text-white/70 max-w-lg mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary group">
              {t("hero.cta_discover")}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn btn-secondary">
              <Play size={18} fill="currentColor" />
              {t("hero.cta_demo")}
            </button>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background-primary bg-background-accent"
                />
              ))}
            </div>
            <p className="text-sm text-white/50 font-medium">
              <span className="text-white font-bold">
                {t("hero.trusted").split(" ")[0]}
              </span>{" "}
              {t("hero.trusted").split(" ").slice(1).join(" ")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent-cyan/20 blur-[100px] rounded-full z-0 animate-pulse" />
          <img
            src="/assets/hero_mockup.png"
            alt="DriveLytix App Mockup"
            className="relative z-10 w-full max-w-[500px] mx-auto drop-shadow-2xl"
          />

          {/* Floating Data Card Overlay */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-0 glass p-4 rounded-2xl shadow-xl z-20 hidden md:block"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green/20 rounded-lg text-accent-green">
                <div className="w-5 h-5 bg-accent-green rounded-full blur-[4px] absolute animate-ping" />
                <div className="w-3 h-3 bg-accent-green rounded-full relative" />
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase font-black">
                  Velocity
                </p>
                <p className="text-lg font-bold">124 km/h</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
