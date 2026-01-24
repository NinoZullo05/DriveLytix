import { Globe, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "it" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? "w-[95%] lg:w-[1200px] mt-0" : "w-full mt-4"}`}
    >
      <div
        className={`glass mx-2 px-6 py-4 flex items-center justify-between ${isScrolled ? "shadow-2xl" : "border-transparent bg-transparent"}`}
        style={{
          backgroundColor: isScrolled ? "rgba(10, 12, 16, 0.8)" : "transparent",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">
            D
          </div>
          <span className="font-bold text-2xl tracking-tighter">
            DriveLytix
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            {t("nav.features")}
          </a>
          <a
            href="#architecture"
            className="hover:text-cyan-400 transition-colors"
          >
            {t("nav.architecture")}
          </a>
          <a href="#demo" className="hover:text-cyan-400 transition-colors">
            {t("nav.demo")}
          </a>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/50 transition-all"
          >
            <Globe size={18} />
            <span className="uppercase text-sm font-medium">
              {i18n.language}
            </span>
          </button>

          <button className="btn btn-primary">{t("nav.get_started")}</button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-24 z-40 p-4">
          <div className="glass p-8 flex flex-col gap-6 items-center bg-[#0a0c10]/95">
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              {t("nav.features")}
            </a>
            <a href="#architecture" onClick={() => setIsMenuOpen(false)}>
              {t("nav.architecture")}
            </a>
            <a href="#demo" onClick={() => setIsMenuOpen(false)}>
              {t("nav.demo")}
            </a>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 uppercase font-bold"
            >
              <Globe size={20} /> {i18n.language}
            </button>
            <button className="btn btn-primary w-full">
              {t("nav.get_started")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
