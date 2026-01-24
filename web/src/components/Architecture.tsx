import { motion } from "framer-motion";
import { Cpu, Database, Layers, Wifi } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Architecture: React.FC = () => {
  const { t } = useTranslation();

  const layers = [
    {
      id: "presentation",
      icon: <Layers className="text-blue-400" />,
      title: t("architecture.layers.presentation"),
      desc: t("architecture.layers.presentation_desc"),
      label: "Presentation Layer",
    },
    {
      id: "logic",
      icon: <Cpu className="text-purple-400" />,
      title: t("architecture.layers.logic"),
      desc: t("architecture.layers.logic_desc"),
      label: "Logic Layer",
    },
    {
      id: "connectivity",
      icon: <Wifi className="text-cyan-400" />,
      title: t("architecture.layers.connectivity"),
      desc: t("architecture.layers.connectivity_desc"),
      label: "Connectivity Layer",
    },
    {
      id: "storage",
      icon: <Database className="text-accent-green" />,
      title: t("architecture.layers.storage"),
      desc: t("architecture.layers.storage_desc"),
      label: "Storage Layer",
    },
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="section-title mb-4">{t("architecture.title")}</h2>
          <p className="section-subtitle">{t("architecture.subtitle")}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {layers.map((layer, idx) => (
            <React.Fragment key={layer.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-3xl glass p-8 rounded-2xl flex items-center gap-6 relative z-10 border-l-4 border-l-accent-blue hover:translate-x-2 transition-transform"
              >
                <div className="text-xs absolute -top-3 left-6 px-3 py-1 bg-accent-blue rounded-full font-black uppercase tracking-widest">
                  {layer.label}
                </div>
                <div className="p-4 bg-white/5 rounded-xl">{layer.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{layer.title}</h3>
                  <p className="text-white/60 text-sm">{layer.desc}</p>
                </div>
              </motion.div>
              {idx < layers.length - 1 && (
                <div className="w-1 h-8 bg-gradient-to-b from-accent-blue/50 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Decorative vertical line in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-accent-blue/10 -z-0" />
    </section>
  );
};

export default Architecture;
