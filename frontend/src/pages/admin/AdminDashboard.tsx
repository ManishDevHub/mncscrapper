import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  BriefcaseBusiness,
  BookOpen,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Layers,
  Sparkles,
  Database,
  Eye,
  Key,
} from "lucide-react";
import api, { type Company, type Job, type Blog } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal";

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, refreshUser } = useAuth();

  // Active section tab
  const [activeTab, setActiveTab] = useState<"companies" | "jobs" | "blogs" | "access">("companies");

  // Data states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Edit target
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedCompanyForRound, setSelectedCompanyForRound] = useState<Company | null>(null);

  // Company Form
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    establishedYear: "2000",
    type: "Product",
    industry: "Technology",
    website: "https://",
    logo: "",
    description: "",
  });

  // Job Form
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "Bangalore, India (Hybrid)",
    jobType: "Full-Time",
    experience: "Fresher",
    salary: "₹18 - ₹24 LPA",
    skills: "React, Node.js, TypeScript, PostgreSQL",
    applyLink: "https://careers.google.com",
    description: "Exciting opportunity to build large-scale distributed systems and collaborate with global engineering teams.",
  });

  // Round Form
  const [roundForm, setRoundForm] = useState({
    roundNumber: 1,
    title: "Round 1: Online Assessment (OA)",
    description: "2 LeetCode Medium/Hard algorithmic questions + 20 MCQs on OS, DBMS, and CS fundamentals. Time: 90 minutes.",
  });

  // Product Form
  const [productForm, setProductForm] = useState({
    name: "",
  });

  // Blog Form
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
  });

  // Access promotion form
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [promoting, setPromoting] = useState(false);

  // Fetch all administrative data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, jobRes, blogRes] = await Promise.all([
        api.get("/api/company"),
        api.get("/api/job"),
        api.get("/api/blog"),
      ]);

      if (compRes.data?.data) setCompanies(compRes.data.data);
      if (jobRes.data?.data) setJobs(jobRes.data.data);
      if (blogRes.data?.data) setBlogs(blogRes.data.data);
    } catch (err: any) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // ---------------- Company Handlers ----------------
  const handleOpenCreateCompany = () => {
    setEditingCompany(null);
    setCompanyForm({
      name: "",
      slug: "",
      establishedYear: "2000",
      type: "Product",
      industry: "Technology",
      website: "https://",
      logo: "",
      description: "",
    });
    setIsCompanyModalOpen(true);
  };

  const handleOpenEditCompany = (comp: Company) => {
    setEditingCompany(comp);
    setCompanyForm({
      name: comp.name || "",
      slug: comp.slug || "",
      establishedYear: comp.establishedYear ? String(comp.establishedYear) : "2000",
      type: comp.type || "Product",
      industry: comp.industry || "Technology",
      website: comp.website || "https://",
      logo: comp.logo || "",
      description: comp.description || (comp as any).discription || "",
    });
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.put(`/api/company/${editingCompany.id}`, companyForm);
        showToast("success", `Company "${companyForm.name}" updated successfully! Changes reflect across site.`);
      } else {
        await api.post("/api/company/create", companyForm);
        showToast("success", `Company "${companyForm.name}" created successfully! Now visible in MNC Directory.`);
      }
      setIsCompanyModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to save company");
    }
  };

  const handleDeleteCompany = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This removes its interview rounds and products as well.`)) {
      return;
    }
    try {
      await api.delete(`/api/company/${id}`);
      showToast("success", `Company "${name}" removed successfully.`);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete company");
    }
  };

  // ---------------- Job Handlers ----------------
  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      company: companies[0]?.name || "Google",
      location: "Bangalore, India (Hybrid)",
      jobType: "Full-Time",
      experience: "Fresher",
      salary: "₹18 - ₹24 LPA",
      skills: "React, Node.js, TypeScript, PostgreSQL",
      applyLink: "https://careers.google.com",
      description: "Exciting opportunity to build large-scale distributed systems and collaborate with global engineering teams.",
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      company: job.Company || "",
      location: job.location || "",
      jobType: job.jobType || "Full-Time",
      experience: job.exprience || "Fresher",
      salary: job.salary || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : (job.skills || ""),
      applyLink: job.applyLink || "",
      description: job.description || "",
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = jobForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingJob) {
        await api.put(`/api/job/${editingJob.id}`, {
          ...jobForm,
          Company: jobForm.company,
          skills: skillsArray,
        });
        showToast("success", `Job opening "${jobForm.title}" updated successfully!`);
      } else {
        await api.post("/api/job/create", {
          ...jobForm,
          Company: jobForm.company,
          skills: skillsArray,
        });
        showToast("success", `Job opening "${jobForm.title}" published! Visible immediately in Explore Jobs.`);
      }
      setIsJobModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to save job opening");
    }
  };

  const handleDeleteJob = async (id: number, title: string) => {
    if (!window.confirm(`Delete job opening "${title}"?`)) return;
    try {
      await api.delete(`/api/job/${id}`);
      showToast("success", `Job "${title}" deleted.`);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete job");
    }
  };

  // ---------------- Round & Product Handlers ----------------
  const handleOpenAddRound = (company: Company) => {
    setSelectedCompanyForRound(company);
    const existingCount = company.interviewRounds?.length || 0;
    setRoundForm({
      roundNumber: existingCount + 1,
      title: `Round ${existingCount + 1}: Technical Interview`,
      description: "Data Structures & Algorithms problem solving with deep dive into complexity and system architecture.",
    });
    setIsRoundModalOpen(true);
  };

  const handleSaveRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyForRound) return;
    try {
      await api.post(`/api/company/round/create/${selectedCompanyForRound.id}`, {
        roundNumber: Number(roundForm.roundNumber),
        title: roundForm.title,
        description: roundForm.description,
      });
      showToast("success", `Interview Round added to "${selectedCompanyForRound.name}"!`);
      setIsRoundModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to add interview round");
    }
  };

  const handleOpenAddProduct = (company: Company) => {
    setSelectedCompanyForRound(company);
    setProductForm({ name: "" });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyForRound) return;
    try {
      await api.post(`/api/company/product/create/${selectedCompanyForRound.id}`, {
        name: productForm.name,
      });
      showToast("success", `Product "${productForm.name}" added to ${selectedCompanyForRound.name}!`);
      setIsProductModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to add product");
    }
  };

  // ---------------- Blog Handlers ----------------
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/blog/create", {
        ...blogForm,
        published: true,
      });
      showToast("success", `Article "${blogForm.title}" published to Interview Prep section!`);
      setIsBlogModalOpen(false);
      setBlogForm({ title: "", excerpt: "", content: "", thumbnail: "" });
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to publish article");
    }
  };

  const handleDeleteBlog = async (id: number, title: string) => {
    if (!window.confirm(`Delete article "${title}"?`)) return;
    try {
      await api.delete(`/api/blog/${id}`);
      showToast("success", `Article "${title}" removed.`);
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete article");
    }
  };

  // ---------------- Quick Seed Sample Data ----------------
  const handleSeedData = async () => {
    if (!window.confirm("Seed sample MNCs (Google, Microsoft, Amazon) and top tech jobs into your database?")) return;
    setLoading(true);
    try {
      // Create Google
      const gRes = await api.post("/api/company/create", {
        name: "Google",
        slug: "google",
        type: "Product",
        industry: "Cloud & AI",
        establishedYear: 1998,
        website: "https://about.google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        description: "Google LLC is an American multinational corporation and technology company focusing on search, cloud computing, software, and AI.",
      });

      if (gRes.data?.data?.id) {
        const gid = gRes.data.data.id;
        await api.post(`/api/company/round/create/${gid}`, {
          roundNumber: 1,
          title: "Round 1: Online Assessment (OA)",
          description: "2 algorithmic coding questions testing Graph traversal, Dynamic Programming, and Greedy techniques.",
        });
        await api.post(`/api/company/round/create/${gid}`, {
          roundNumber: 2,
          title: "Round 2: Technical DSA & Problem Solving",
          description: "45-minute live pair coding round on Google Meet focusing on clean modular code and algorithmic complexity.",
        });
        await api.post(`/api/company/round/create/${gid}`, {
          roundNumber: 3,
          title: "Round 3: Googleyness & Leadership",
          description: "Behavioral interview assessing collaboration, handling ambiguity, and customer-first engineering attitude.",
        });
        await api.post(`/api/company/product/create/${gid}`, { name: "Google Cloud Platform (GCP)" });
        await api.post(`/api/company/product/create/${gid}`, { name: "Gemini AI" });
      }

      // Create Microsoft
      const mRes = await api.post("/api/company/create", {
        name: "Microsoft",
        slug: "microsoft",
        type: "Product",
        industry: "Enterprise & Cloud",
        establishedYear: 1975,
        website: "https://microsoft.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        description: "Microsoft Corporation produces computer software, consumer electronics, personal computers, and related cloud services.",
      });

      if (mRes.data?.data?.id) {
        const mid = mRes.data.data.id;
        await api.post(`/api/company/round/create/${mid}`, {
          roundNumber: 1,
          title: "Round 1: Online Coding Test (Codility)",
          description: "3 problem tasks covering Arrays, Trees, and Hash tables with hidden corner cases.",
        });
        await api.post(`/api/company/round/create/${mid}`, {
          roundNumber: 2,
          title: "Round 2: Systems & Low-Level Design (LLD)",
          description: "Object-oriented design round (e.g. Design Parking Lot or Rate Limiter) with clean SOLID principles.",
        });
        await api.post(`/api/company/product/create/${mid}`, { name: "Microsoft Azure" });
        await api.post(`/api/company/product/create/${mid}`, { name: "GitHub" });
      }

      // Create Jobs
      await api.post("/api/job/create", {
        title: "Software Engineer - Backend (Go / Distributed Systems)",
        Company: "Google",
        location: "Bangalore, India (Hybrid)",
        jobType: "Full-Time",
        experience: "Fresher",
        salary: "₹24 - ₹32 LPA",
        skills: ["Go", "Distributed Systems", "Kubernetes", "gRPC", "PostgreSQL"],
        applyLink: "https://careers.google.com",
        description: "Join the Core Infrastructure team powering Google Search and Cloud services with millisecond latency.",
      });

      await api.post("/api/job/create", {
        title: "Software Development Engineer (SDE-1)",
        Company: "Microsoft",
        location: "Hyderabad, India",
        jobType: "Full-Time",
        experience: "0-1 Years",
        salary: "₹20 - ₹28 LPA",
        skills: ["C#", ".NET", "Azure", "React", "TypeScript"],
        applyLink: "https://careers.microsoft.com",
        description: "Building next-generation enterprise AI integrations across Microsoft 365 Copilot suite.",
      });

      showToast("success", "Sample MNCs and Jobs successfully seeded into Neon DB! View them live on the website.");
      fetchData();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to seed data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Promote to Admin ----------------
  const handleElevateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoting(true);
    try {
      const res = await api.post("/api/auth/make-admin", {
        secret: adminSecretKey,
        userId: user?.id,
      });
      if (res.data?.success) {
        showToast("success", "Your account has been elevated to Admin! Refreshing privileges...");
        await refreshUser();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Invalid Admin Secret Passkey.");
    } finally {
      setPromoting(false);
    }
  };

  // Check if non-admin is trying to access
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-lg shadow-amber-500/20">
            <Key className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
            Admin Access Required
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Only administrators can create companies, publish job openings, and manage interview rounds. Regular users have read-only access across the website.
          </p>

          <form onSubmit={handleElevateAdmin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Secret Passkey
              </label>
              <input
                type="password"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                placeholder="Enter secret passkey (e.g. rudra111)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={promoting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {promoting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Unlock Admin Control
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to Home Page
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.Company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 selection:bg-blue-500 selection:text-white relative">
      {/* Background 3D Glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Toast Alert */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
                feedbackMsg.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                  : "bg-rose-950/90 border-rose-500/50 text-rose-200"
              }`}
            >
              {feedbackMsg.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
              <span className="text-sm font-semibold">{feedbackMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/40 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Superadmin Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              Control <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Center</span>
            </h1>
            <p className="text-sm text-slate-400">
              Create, edit, and orchestrate MNC profiles, job postings, and interview rounds. Changes reflect instantly to public visitors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchData();
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-sm font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
              Refresh Sync
            </button>

            {companies.length === 0 && (
              <button
                onClick={handleSeedData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                1-Click Seed Sample MNCs
              </button>
            )}

            <button
              onClick={activeTab === "jobs" ? handleOpenCreateJob : handleOpenCreateCompany}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {activeTab === "jobs" ? "Create New Job" : "Create Company"}
            </button>
          </div>
        </div>

        {/* 3D Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "MNC Companies",
              count: companies.length,
              desc: "Verified profiles active",
              icon: Building2,
              color: "from-blue-500 to-cyan-500",
              tab: "companies",
            },
            {
              title: "Live Openings",
              count: jobs.length,
              desc: "Active jobs visible to users",
              icon: BriefcaseBusiness,
              color: "from-indigo-500 to-purple-500",
              tab: "jobs",
            },
            {
              title: "Interview Guides",
              count: blogs.length,
              desc: "Technical round breakdowns",
              icon: BookOpen,
              color: "from-emerald-500 to-teal-500",
              tab: "blogs",
            },
            {
              title: "Database Sync",
              count: "Online",
              desc: "Neon PostgreSQL Connected",
              icon: Database,
              color: "from-amber-500 to-orange-500",
              tab: "access",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4, rotateX: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setActiveTab(stat.tab as any)}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl backdrop-blur-xl cursor-pointer relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {stat.count}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            {[
              { id: "companies", label: "Companies", count: companies.length, icon: Building2 },
              { id: "jobs", label: "Job Openings", count: jobs.length, icon: BriefcaseBusiness },
              { id: "blogs", label: "Interview Blogs", count: blogs.length, icon: BookOpen },
              { id: "access", label: "Admin Access", icon: Key },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search records..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* ---------------- TAB 1: COMPANIES ---------------- */}
        {activeTab === "companies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">MNC Directory ({filteredCompanies.length})</h3>
                <p className="text-xs text-slate-400">All companies listed here reflect directly on the public directory.</p>
              </div>
              <button
                onClick={handleOpenCreateCompany}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Company
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Companies Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button below to add your first MNC or seed high-profile companies like Google & Microsoft.
                </p>
                <button
                  onClick={handleSeedData}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Seed Sample MNCs Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredCompanies.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    whileHover={{ scale: 1.005 }}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center p-2 border border-slate-700 overflow-hidden shrink-0">
                        {c.logo ? (
                          <img src={c.logo} alt={c.name} className="h-full w-full object-contain" />
                        ) : (
                          <span className="font-bold text-white text-lg">{c.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{c.name}</h4>
                          {c.type && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {c.type}
                            </span>
                          )}
                          {c.industry && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              • {c.industry}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                          {c.description || (c as any).discription || "Global tech organization."}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                          <span>Rounds: <strong className="text-slate-300">{c.interviewRounds?.length || 0}</strong></span>
                          <span>Products: <strong className="text-slate-300">{c.product?.length || 0}</strong></span>
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1"
                            >
                              Website <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Link
                        to={`/companies/${c.id}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        Live View
                      </Link>

                      <button
                        onClick={() => handleOpenAddRound(c)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        + Round
                      </button>

                      <button
                        onClick={() => handleOpenAddProduct(c)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                        + Product
                      </button>

                      <button
                        onClick={() => handleOpenEditCompany(c)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Company"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteCompany(c.id, c.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 2: JOBS ---------------- */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Job Openings ({filteredJobs.length})</h3>
                <p className="text-xs text-slate-400">Manage all live job opportunities published to applicants.</p>
              </div>
              <button
                onClick={handleOpenCreateJob}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post New Job
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                <BriefcaseBusiness className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Jobs Listed Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click below to post an opening or seed sample top-tier positions.
                </p>
                <button
                  onClick={handleOpenCreateJob}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Post First Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredJobs.map((j) => (
                  <motion.div
                    key={j.id}
                    layout
                    whileHover={{ scale: 1.005 }}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{j.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {j.Company}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                          {j.jobType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>📍 {j.location}</span>
                        <span>💰 {j.salary}</span>
                        <span>🎓 {j.exprience}</span>
                      </div>
                      {j.skills && j.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {j.skills.slice(0, 5).map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to="/jobs"
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        View Live
                      </Link>

                      <button
                        onClick={() => handleOpenEditJob(j)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Job"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(j.id, j.title)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 3: BLOGS ---------------- */}
        {activeTab === "blogs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Interview Guides & Articles ({blogs.length})</h3>
                <p className="text-xs text-slate-400">Write in-depth interview round preparation blueprints.</p>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Publish Article
              </button>
            </div>

            {blogs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-white">No Articles Published</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Publish comprehensive technical interview strategies for candidates.
                </p>
                <button
                  onClick={() => setIsBlogModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Write First Guide
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-base">{b.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.excerpt || b.content}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <span>Published</span>
                      <div className="flex items-center gap-2">
                        <Link to={`/blogs/${b.id}`} className="text-blue-400 hover:underline">
                          Read
                        </Link>
                        <button
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="text-rose-400 hover:text-rose-300 ml-2 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 4: ADMIN ACCESS ---------------- */}
        {activeTab === "access" && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Admin Privileges & Role Guard</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your account is currently running with full Administrator permissions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account User:</span>
                <strong className="text-white">{user?.username}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Registered Email:</span>
                <strong className="text-white">{user?.email}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Role:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                  {user?.role || "admin"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Driver:</span>
                <span className="text-emerald-400 font-semibold">Neon PostgreSQL (Connected)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
              💡 <strong>Security Rule Implemented:</strong> Regular users visiting <code>/jobs</code> and <code>/companies</code> cannot see create/delete buttons and will receive a 403 Forbidden if attempting API mutations. Only authenticated administrators can modify database records.
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODAL: COMPANY CREATE / EDIT ---------------- */}
      <Modal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title={editingCompany ? `Edit Company: ${editingCompany.name}` : "Create New Company"}
      >
        <form onSubmit={handleSaveCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                placeholder="e.g. Google"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Slug (URL identifier)</label>
              <input
                type="text"
                value={companyForm.slug}
                onChange={(e) => setCompanyForm({ ...companyForm, slug: e.target.value })}
                placeholder="e.g. google (auto-generated if empty)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Type</label>
              <select
                value={companyForm.type}
                onChange={(e) => setCompanyForm({ ...companyForm, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="Product">Product</option>
                <option value="Service">Service</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={companyForm.industry}
                onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                placeholder="e.g. Cloud & AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Founded Year</label>
              <input
                type="number"
                value={companyForm.establishedYear}
                onChange={(e) => setCompanyForm({ ...companyForm, establishedYear: e.target.value })}
                placeholder="e.g. 1998"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
              <input
                type="url"
                value={companyForm.website}
                onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Logo URL (Optional)</label>
              <input
                type="text"
                value={companyForm.logo}
                onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                placeholder="https://... or /logo.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={companyForm.description}
              onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
              placeholder="Overview of company culture, tech stack, and global presence..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCompanyModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25"
            >
              {editingCompany ? "Save Changes" : "Create Company"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- MODAL: JOB CREATE / EDIT ---------------- */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title={editingJob ? `Edit Job: ${editingJob.title}` : "Post New Job Opening"}
      >
        <form onSubmit={handleSaveJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g. Software Engineer (Backend)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                placeholder="e.g. Google, Microsoft, Amazon"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Job Type</label>
              <select
                value={jobForm.jobType}
                onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Experience Level</label>
              <select
                value={jobForm.experience}
                onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              >
                <option value="Fresher">Fresher</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Salary Range</label>
              <input
                type="text"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="e.g. ₹18 - ₹24 LPA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="e.g. Bangalore, India (Hybrid)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Application URL *</label>
              <input
                type="url"
                required
                value={jobForm.applyLink}
                onChange={(e) => setJobForm({ ...jobForm, applyLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={jobForm.skills}
              onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
              placeholder="React, Node.js, TypeScript, PostgreSQL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              placeholder="Role responsibilities, tech stack, and benefits..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsJobModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25"
            >
              {editingJob ? "Save Changes" : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- MODAL: INTERVIEW ROUND ---------------- */}
      <Modal
        isOpen={isRoundModalOpen}
        onClose={() => setIsRoundModalOpen(false)}
        title={`Add Interview Round for ${selectedCompanyForRound?.name || "Company"}`}
      >
        <form onSubmit={handleSaveRound} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Round Number</label>
              <input
                type="number"
                min="1"
                required
                value={roundForm.roundNumber}
                onChange={(e) => setRoundForm({ ...roundForm, roundNumber: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Round Title *</label>
              <input
                type="text"
                required
                value={roundForm.title}
                onChange={(e) => setRoundForm({ ...roundForm, title: e.target.value })}
                placeholder="e.g. Round 2: Data Structures & System Design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Round Guidelines & Topics</label>
            <textarea
              rows={4}
              value={roundForm.description}
              onChange={(e) => setRoundForm({ ...roundForm, description: e.target.value })}
              placeholder="What questions are asked, time limit, coding platforms, tips for cracking..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRoundModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/25"
            >
              Add Interview Round
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- MODAL: PRODUCT ---------------- */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={`Add Product for ${selectedCompanyForRound?.name || "Company"}`}
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ name: e.target.value })}
              placeholder="e.g. Google Cloud, GitHub, Azure, AWS EC2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/25"
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- MODAL: BLOG ---------------- */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title="Publish Interview Prep Guide"
      >
        <form onSubmit={handleSaveBlog} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Article Title *</label>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="e.g. How to Crack Google SDE-1: Round-by-Round Strategy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Short Excerpt</label>
            <input
              type="text"
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              placeholder="Brief 1-2 sentence preview for the card..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Content (Markdown supported) *</label>
            <textarea
              rows={6}
              required
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              placeholder="Complete guide text..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsBlogModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25"
            >
              Publish Guide
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminDashboard;
