import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-primary pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              D
            </div>
            <span className="font-bold text-xl">DriveLytix</span>
          </div>

          <div className="flex gap-8 text-sm text-white/50 uppercase font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors">
              API Reference
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>

          <div className="flex gap-4">
            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-white/20 text-xs font-medium border-t border-white/5 pt-10">
          © 2026 DriveLytix Analytics. All rights reserved. Designed for
          performance.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
