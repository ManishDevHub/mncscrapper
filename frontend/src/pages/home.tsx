import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Compass,
} from "lucide-react";
import api, { type Job, type Company, type Blog } from "../services/api";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes, blogsRes] = await Promise.allSettled([
          api.get("/api/job"),
          api.get("/api/company"),
          api.get("/api/blog"),
        ]);

        if (jobsRes.status === "fulfilled" && jobsRes.value.data.data) {
          setRecentJobs(jobsRes.value.data.data.slice(0, 6));
        }
        if (companiesRes.status === "fulfilled" && companiesRes.value.data.data) {
          setTopCompanies(companiesRes.value.data.data.slice(0, 6));
        }
        if (blogsRes.status === "fulfilled" && blogsRes.value.data.data) {
          setFeaturedBlogs(blogsRes.value.data.data.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to load home data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.set("search", searchTerm);
    if (locationTerm) query.set("location", locationTerm);
    navigate(`/jobs?${query.toString()}`);
  };

  const trendingTags = [
    "Google",
    "Microsoft",
    "Amazon",
    "Frontend",
    "Backend",
    "Internship",
    "Fresher",
    "Remote",
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-500/15 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-indigo-500/15 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Animated Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300">
                500+ Verified MNC Job Openings & Rounds
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]"
            >
              Crack Your Dream{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MNC Career & Internship
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 font-normal leading-relaxed"
            >
              Discover active tech openings, explore company products, and master interview rounds step-by-step with real candidate questions.
            </motion.p>

            {/* Interactive Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4"
            >
              <form
                onSubmit={handleSearch}
                className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl shadow-blue-500/5 dark:shadow-none flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/2">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, skill, or MNC name..."
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="hidden sm:block h-7 w-[1px] bg-slate-200 dark:bg-zinc-800" />

                <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="City, Remote, or Country"
                    className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  Find Jobs
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trending tag chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-slate-500 dark:text-zinc-500 font-medium">Trending:</span>
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/jobs?search=${tag}`)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="border-y border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div whileHover={{ y: -4 }} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400">500+</p>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">MNC Opportunities</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">120+</p>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Tracked Companies</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-purple-400">450+</p>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Interview Rounds</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">95%</p>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">Candidate Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED MNCS SECTION ================= */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <Building2 className="w-4 h-4" />
                Featured Companies
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Explore Top Tech MNCs
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                Learn company products, culture, and their exact interview structures.
              </p>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
            >
              Browse All Companies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 animate-pulse" />
              ))}
            </div>
          ) : topCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-700 text-lg font-bold text-slate-800 dark:text-white group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-colors">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain rounded" />
                      ) : (
                        company.name.charAt(0)
                      )}
                    </div>
                    {company.type && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                        {company.type}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {company.description || company.discription || `${company.industry || "Technology"} company`}
                  </p>

                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <div>
                      <strong className="text-slate-800 dark:text-white">{company._count?.product || company.product?.length || 0}</strong> Products
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-white">{company._count?.interviewRounds || company.interviewRounds?.length || 0}</strong> Interview Rounds
                    </div>
                    <Link
                      to={`/companies/${company.id}`}
                      className="ml-auto inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      View
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-zinc-400 text-sm">No companies yet. You can add one anytime!</p>
              <Link to="/companies?create=true" className="inline-block mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white">
                Add First Company
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= RECENT JOBS SECTION ================= */}
      <section className="py-16 bg-white dark:bg-zinc-950/40 border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <BriefcaseBusiness className="w-4 h-4" />
                Latest Opportunities
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Fresh MNC Job Openings
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                Hand-picked high-growth engineering, product, and tech roles.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
            >
              View All Openings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          {job.Company}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {job.title}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/80 shrink-0">
                        {job.salary}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>{job.jobType}</span>
                      <span>•</span>
                      <span>{job.exprience}</span>
                    </div>

                    {/* Skill chips */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-800/80">
                    <span className="text-[11px] text-slate-400">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <BriefcaseBusiness className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-zinc-400 text-sm">No jobs listed yet. Post the first one!</p>
              <Link to="/jobs?post=true" className="inline-block mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white">
                Post First Job
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================= INTERVIEW PROCESS BLUEPRINT SECTION ================= */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Standardized Blueprint
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              The 4 Stages of Modern MNC Hiring
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              How tech giants like Amazon, Microsoft, and Google evaluate developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Online Assessment",
                desc: "90-minute algorithmic screening on HackerRank or LeetCode with 2-3 DSA problems and MCQs.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Technical DSA (1-2)",
                desc: "Live coding with senior engineers focusing on trees, dynamic programming, graphs, and clean code.",
                icon: Compass,
              },
              {
                step: "03",
                title: "System Design & Arch",
                desc: "High-level & low-level architecture, scalability, database schema, caching, and concurrency.",
                icon: TrendingUp,
              },
              {
                step: "04",
                title: "Managerial & Culture",
                desc: "STAR format behavioral interview assessing leadership principles, conflict resolution, and impact.",
                icon: Award,
              },
            ].map((round, idx) => {
              const Icon = round.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group"
                >
                  <span className="text-5xl font-black text-slate-100 dark:text-zinc-800/80 absolute top-3 right-4 select-none group-hover:text-blue-50 dark:group-hover:text-blue-950/40 transition-colors">
                    {round.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 relative z-10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white relative z-10">
                    {round.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed relative z-10">
                    {round.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LATEST PREP BLOGS ================= */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Insights & Resources
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Latest Interview Guides
                </h2>
              </div>
              <Link to="/blogs" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View all articles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.id}`}
                  className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-40 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center p-6 text-center">
                    <span className="text-lg font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 100)}...
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{new Date(blog.createAt).toLocaleDateString()}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read Guide <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to land your dream offer?
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Join thousands of software engineers tracking opportunities, practicing interview patterns, and securing offers at top tier tech companies.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-md hover:bg-blue-50 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/jobs"
                  className="px-6 py-3 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-white/20 text-white font-semibold text-sm transition-colors"
                >
                  Explore Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
