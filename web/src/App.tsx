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
    <div className="min-h-screen bg-background-primary text-white selection:bg-accent-cyan/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Architecture />
        <LiveDemo />
      </main>
      <Footer />
    </div>
  );
};

export default App;
