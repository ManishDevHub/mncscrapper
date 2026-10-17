import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400"
          >
            <Sparkles className="w-4 h-4" />
            Our Mission & Story
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Demystifying MNC Tech Hiring for Every Ambitious Engineer
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            CareerHub / MNC Scrapper was built to solve the frustration of opaque job applications, endless generic job boards, and mystery interview formats. We provide verified roles, direct application links, and transparent step-by-step interview rounds for tech multinationals.
          </p>
        </div>

        {/* Pillars / Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Curated MNC Opportunities
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Every job listing points directly to the verified official company careers portal. No third-party spam or expired redirects.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Interview Rounds Blueprints
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Know what to expect before you walk into the room. We catalog Round 1 OA to final Managerial behavioral evaluations.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Actionable Prep Strategies
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              In-depth articles written by engineers who successfully cracked Tier-1 product companies and global startups.
            </p>
          </motion.div>
        </div>

        {/* Why choose CareerHub checklist */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The CareerHub Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 mb-4">
              Everything you need to secure your next offer
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
              Whether you are an undergraduate looking for your first 2025/2026 summer internship, or an experienced engineer leveling up to Senior/Staff, CareerHub gives you the clarity to succeed.
            </p>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              Explore Live Roles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {[
              "Real-time MNC opening scraper with salary estimates",
              "Structured interview round timeline with candidate notes",
              "Product ecosystem directory for each company",
              "Zero recruiter middle-men — direct apply links only",
              "Community-contributed interview questions & guides",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;