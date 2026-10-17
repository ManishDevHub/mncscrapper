import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseBusiness,
  Search,
  MapPin,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import api, { type Job } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";

export const Jobs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("jobType") || "All");
  const [selectedExp, setSelectedExp] = useState(searchParams.get("experience") || "All");

  // Selected job for detail modal
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

  // Post Job Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(searchParams.get("post") === "true");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "Remote / Hybrid",
    jobType: "Full-Time",
    experience: "Fresher",
    salary: "$120,000 - $150,000 / yr",
    skills: "React, Node.js, TypeScript",
    applyLink: "",
    description: "",
  });

  const jobTypes = ["All", "Full-Time", "Internship", "Contract", "Remote"];
  const expLevels = ["All", "Fresher", "0-1 Years", "1-3 Years", "3+ Years"];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedType !== "All") params.jobType = selectedType;

      const res = await api.get("/api/job", { params });
      if (res.data && res.data.data) {
        setJobs(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch jobs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType]);

  useEffect(() => {
    if (searchParams.get("post") === "true") {
      setIsPostModalOpen(true);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.post("/api/job/create", {
        ...formData,
        skills: skillsArray,
      });

      if (res.data.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setIsPostModalOpen(false);
          setFormSuccess(false);
          setFormData({
            title: "",
            company: "",
            location: "Remote / Hybrid",
            jobType: "Full-Time",
            experience: "Fresher",
            salary: "$120,000 - $150,000 / yr",
            skills: "React, Node.js, TypeScript",
            applyLink: "",
            description: "",
          });
          fetchJobs();
        }, 1200);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter jobs locally for experience
  const filteredJobs = jobs.filter((job) => {
    if (selectedExp !== "All") {
      return (
        job.exprience.toLowerCase().includes(selectedExp.toLowerCase()) ||
        selectedExp.toLowerCase().includes(job.exprience.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <BriefcaseBusiness className="w-4 h-4" />
              MNC Career Opportunities
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Active Tech Roles
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Filter by tech stack, experience level, or MNC name.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/login");
              } else {
                setIsPostModalOpen(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all self-start md:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job Opening
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company, or keywords..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Job Types */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mr-1">Type:</span>
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedType === type
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Experience Level */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mr-1">Experience:</span>
              {expLevels.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExp(exp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedExp === exp
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="pt-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                              {job.Company}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/80">
                              {job.jobType}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                            {job.title}
                          </h3>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/80 shrink-0">
                          {job.salary}
                        </span>
                      </div>

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {job.exprience}
                        </span>
                      </div>

                      {/* Description preview */}
                      {job.description && (
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}

                      {/* Skills */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {job.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                      <button
                        onClick={() => setViewingJob(job)}
                        className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        View Full Details
                      </button>

                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Apply Directly
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <BriefcaseBusiness className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No job openings found</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                Try adjusting your search criteria or clear filters to view more opportunities.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("All");
                  setSelectedExp("All");
                  fetchJobs();
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= VIEW JOB DETAILS MODAL ================= */}
      <Modal
        isOpen={!!viewingJob}
        onClose={() => setViewingJob(null)}
        title={viewingJob?.title || "Job Details"}
      >
        {viewingJob && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {viewingJob.Company}
                </span>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {viewingJob.location} • {viewingJob.jobType} • {viewingJob.exprience}
                </p>
              </div>
              <span className="px-3 py-1 text-sm font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                {viewingJob.salary}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Job Overview & Requirements
              </h4>
              <p className="text-sm text-slate-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                {viewingJob.description || "No specific detailed description provided for this opening."}
              </p>
            </div>

            {viewingJob.skills && viewingJob.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Key Skills & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingJob.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setViewingJob(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
              <a
                href={viewingJob.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25"
              >
                Apply on Official Site
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= POST JOB OPENING MODAL ================= */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Post a New MNC Job Opening"
      >
        <form onSubmit={handlePostSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Job opening created successfully! Refreshing...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Software Engineer (SDE-1)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google / Microsoft / Amazon"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Job Type *
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Experience Level *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="Fresher">Fresher</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Salary Range *
              </label>
              <input
                type="text"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. $100k - $130k or ₹15-25 LPA"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, India or Remote"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Apply URL / Link *
              </label>
              <input
                type="url"
                required
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                placeholder="https://careers.google.com/jobs/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. React, Node.js, TypeScript, AWS, Docker"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Job Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the responsibilities, minimum qualifications, and interview expectations..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              {formSubmitting ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
