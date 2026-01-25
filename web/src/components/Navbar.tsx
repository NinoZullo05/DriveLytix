import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Globe, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "it" : "en";
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { name: t("nav.features"), href: "#features" },
    { name: t("nav.architecture"), href: "#architecture" },
    { name: t("nav.demo"), href: "#demo" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "py-4 px-4" : "py-8 px-6"
      }`}
    >
      <div
        className={`container mx-auto px-6 h-16 flex items-center justify-between transition-all duration-500 rounded-2xl ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl"
            : "bg-transparent border border-transparent"
        }`}
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
            <Cpu size={20} className="text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-950 uppercase italic">
            DriveLytix
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[13px] font-bold text-slate-500 hover:text-slate-950 transition-all duration-300 uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}

          <div className="h-4 w-[1px] bg-slate-200" />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Globe
                size={14}
                className="text-slate-500 group-hover:text-slate-950"
              />
            </div>
            <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-950 uppercase tracking-wider">
              {i18n.language}
            </span>
          </button>

          <button className="btn btn-primary px-6 py-2.5 text-xs">
            {t("nav.get_started")}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-950"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-4 right-4 bg-white backdrop-blur-3xl rounded-3xl border border-slate-200 p-8 flex flex-col gap-6 shadow-2xl z-40"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-black text-slate-950 py-4 border-b border-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center justify-between text-xl font-bold uppercase mt-2 bg-slate-50 p-4 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <Globe size={24} className="text-slate-950" />
                {i18n.language === "en" ? "Italiano" : "English"}
              </div>
              <span className="text-slate-400 text-sm">{i18n.language}</span>
            </button>

            <button className="btn btn-primary w-full text-lg py-5 mt-4">
              {t("nav.get_started")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
