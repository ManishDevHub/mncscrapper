import React from "react";
import { Link } from "react-router-dom";
import { Globe, Code, MessageSquare, Heart, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Footer: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-300 transition-colors relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl p-1 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-md shadow-blue-500/10 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="CareerHub Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(59,130,246,0.5)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images (1).png";
                  }}
                />
              </div>
              <span className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans']">
                Career<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering engineers and students to crack dream MNC opportunities with curated listings, interview round breakdowns, and tech prep insights.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800">
                <Code className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">
                  Latest Job Openings
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-400 transition-colors">
                  MNC Profiles & Products
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-blue-400 transition-colors">
                  Interview Round Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Platform
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Control Center
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Target MNCs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              MNC Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/jobs?search=Google" className="hover:text-blue-400 transition-colors">
                  Google & FAANG Openings
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Microsoft" className="hover:text-blue-400 transition-colors">
                  Microsoft & Cloud Giants
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Internship" className="hover:text-blue-400 transition-colors">
                  MNC Internships 2025/2026
                </Link>
              </li>
              <li>
                <Link to="/jobs?experience=Fresher" className="hover:text-blue-400 transition-colors">
                  Fresher & Early Career Roles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              System Live Status
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live MNC Scrapper Active
              </div>
              <p className="text-xs text-slate-400">
                Tracking global tech organizations and fresh openings updated hourly.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                Role-Based Access: Admin Controlled
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerHub / MNC Scrapper. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious developers.
          </p>
        </div>
      </div>
    </footer>
  );
};
