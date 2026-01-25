import { motion } from "framer-motion";
import { Cpu, Database, Layers, Wifi } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const Architecture: React.FC = () => {
  const { t } = useTranslation();

  const layers = [
    {
      id: "presentation",
      icon: <Layers size={22} className="text-blue-600" />,
      title: t("architecture.layers.presentation"),
      desc: t("architecture.layers.presentation_desc"),
      label: "User Interface",
    },
    {
      id: "logic",
      icon: <Cpu size={22} className="text-blue-600" />,
      title: t("architecture.layers.logic"),
      desc: t("architecture.layers.logic_desc"),
      label: "Core Engine",
    },
    {
      id: "connectivity",
      icon: <Wifi size={22} className="text-blue-600" />,
      title: t("architecture.layers.connectivity"),
      desc: t("architecture.layers.connectivity_desc"),
      label: "Vehicle Bus",
    },
    {
      id: "storage",
      icon: <Database size={22} className="text-blue-600" />,
      title: t("architecture.layers.storage"),
      desc: t("architecture.layers.storage_desc"),
      label: "Persistence",
    },
  ];

  return (
    <section
      id="architecture"
      className="py-32 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-6"
          >
            {t("architecture.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            {t("architecture.subtitle")}
          </motion.p>
        </div>

        <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-100 -z-0" />

          {layers.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-full group relative z-10"
            >
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all duration-500">
                <div className="bg-slate-50/50 rounded-[2.2rem] p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      {layer.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">
                      {layer.label}
                    </div>
                    <h3 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">
                      {layer.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
                      {layer.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
