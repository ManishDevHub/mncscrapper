import { Link } from "react-router-dom";
import { BriefcaseBusiness, Globe, Code, MessageSquare, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Career<span className="text-blue-600 dark:text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Empowering engineers and students to crack dream MNC opportunities with curated listings, interview round breakdowns, and tech prep insights.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-900">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-900">
                <Code className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-900">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-zinc-400 font-medium">
              <li>
                <Link to="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Latest Job Openings
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  MNC Profiles & Products
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Interview Round Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Target MNCs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              MNC Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-zinc-400 font-medium">
              <li>
                <Link to="/jobs?search=Google" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Google & FAANG
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Microsoft" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Microsoft & Cloud Giants
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Internship" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  MNC Internships 2025/2026
                </Link>
              </li>
              <li>
                <Link to="/jobs?experience=Fresher" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Fresher & Early Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              System Live Status
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live MNC Scrapper Active
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Tracking 500+ global tech organizations and fresh openings updated hourly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} CareerHub / MNC Scrapper. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious developers.
          </p>
        </div>
      </div>
    </footer>
  );
};
