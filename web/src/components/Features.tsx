import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Zap className="text-yellow-400" />,
      title: t("features.telemetry.title"),
      desc: t("features.telemetry.desc"),
    },
    {
      icon: <ShieldCheck className="text-accent-green" />,
      title: t("features.maintenance.title"),
      desc: t("features.maintenance.desc"),
    },
    {
      icon: <Activity className="text-accent-cyan" />,
      title: t("features.eco.title"),
      desc: t("features.eco.desc"),
    },
  ];

  return (
    <section id="features" className="bg-background-secondary py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-4"
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

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass p-8 rounded-3xl hover:border-accent-cyan/30 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full -mr-16 -mt-16 group-hover:bg-accent-blue/10 transition-colors" />

              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-transform">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
