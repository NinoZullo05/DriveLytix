import React from "react";
import Architecture from "./components/Architecture";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LiveDemo from "./components/LiveDemo";
import Navbar from "./components/Navbar";
import "./i18n";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 relative">
      <div className="fixed inset-0 bg-mesh-light opacity-60 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
          <Architecture />
          <LiveDemo />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
