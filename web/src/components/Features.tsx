import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Database,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Zap size={24} className="text-blue-600" />,
      title: t("features.telemetry.title"),
      desc: t("features.telemetry.desc"),
    },
    {
      icon: <ShieldCheck size={24} className="text-blue-600" />,
      title: t("features.maintenance.title"),
      desc: t("features.maintenance.desc"),
    },
    {
      icon: <Activity size={24} className="text-blue-600" />,
      title: t("features.eco.title"),
      desc: t("features.eco.desc"),
    },
    {
      icon: <BarChart3 size={24} className="text-blue-600" />,
      title: t("features.realtime.title"),
      desc: t("features.realtime.desc"),
    },
    {
      icon: <Radio size={24} className="text-blue-600" />,
      title: t("features.connectivity.title"),
      desc: t("features.connectivity.desc"),
    },
    {
      icon: <Database size={24} className="text-blue-600" />,
      title: t("features.history.title"),
      desc: t("features.history.desc"),
    },
  ];

  return (
    <section
      id="features"
      className="relative py-32 bg-slate-50 overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-6"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                <div className="group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 group-hover:gap-4 transition-all">
                <div className="h-[2px] w-8 bg-blue-600 group-hover:w-12 transition-all" />
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                  Explore
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
