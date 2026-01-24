import { Globe, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "it" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? "bg-black/60 backdrop-blur-xl border-white/5 py-3" : "bg-transparent border-transparent py-6"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-accent-blue to-accent-cyan rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            DriveLytix
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="nav-link">
            {t("nav.features")}
          </a>
          <a href="#architecture" className="nav-link">
            {t("nav.architecture")}
          </a>
          <a href="#demo" className="nav-link">
            {t("nav.demo")}
          </a>

          <div className="h-4 w-[1px] bg-white/10" />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-[12px] font-bold text-white/40 hover:text-white transition-colors"
          >
            <Globe size={14} />
            <span className="uppercase">{i18n.language}</span>
          </button>

          <button className="btn btn-primary px-5 py-2 text-xs font-bold uppercase tracking-wider">
            {t("nav.get_started")}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-[#030508] p-8 flex flex-col pt-24 gap-8">
          <a
            href="#features"
            className="text-2xl font-bold border-b border-white/5 pb-4"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.features")}
          </a>
          <a
            href="#architecture"
            className="text-2xl font-bold border-b border-white/5 pb-4"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.architecture")}
          </a>
          <a
            href="#demo"
            className="text-2xl font-bold border-b border-white/5 pb-4"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.demo")}
          </a>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-4 text-xl font-bold uppercase mt-4"
          >
            <Globe size={24} />{" "}
            {i18n.language === "en" ? "Italiano" : "English"}
          </button>

          <button className="btn btn-primary w-full text-lg py-4 mt-auto">
            {t("nav.get_started")}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
