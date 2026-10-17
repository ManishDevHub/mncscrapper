import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  PlusCircle,
  ChevronRight,
  Layers,
  Award,
  CheckCircle,
} from "lucide-react";
import api, { type Company } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";

export const CompanyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Add Company Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(searchParams.get("create") === "true");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    establishedYear: "2000",
    type: "Product",
    industry: "Technology",
    website: "https://",
    logo: "",
    description: "",
  });

  const industries = ["All", "Technology", "Cloud & SaaS", "Fintech", "Consulting", "E-Commerce", "AI"];
  const companyTypes = ["All", "Product", "Service", "Enterprise"];

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedIndustry !== "All") params.industry = selectedIndustry;
      if (selectedType !== "All") params.type = selectedType;

      const res = await api.get("/api/company", { params });
      if (res.data && res.data.data) {
        setCompanies(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch companies", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [selectedIndustry, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      const res = await api.post("/api/company/create", formData);
      if (res.data.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setIsAddModalOpen(false);
          setFormSuccess(false);
          setFormData({
            name: "",
            establishedYear: "2000",
            type: "Product",
            industry: "Technology",
            website: "https://",
            logo: "",
            description: "",
          });
          fetchCompanies();
        }, 1200);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to add company.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <Building2 className="w-4 h-4" />
              Global Tech Directory
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore MNCs & Hiring Patterns
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Learn company products, interview difficulty, and round-by-round requirements.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/login");
              } else {
                setIsAddModalOpen(true);
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all self-start md:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add Company
          </button>
        </div>

        {/* Search & Filters */}
        <div className="py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MNC by name, industry, or domain..."
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

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mr-1">Industry:</span>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedIndustry === ind
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mr-1">Type:</span>
              {companyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedType === type
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="pt-2">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-52 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 animate-pulse" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {companies.map((company) => (
                  <motion.div
                    layout
                    key={company.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-700 text-xl font-bold text-slate-800 dark:text-white">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="h-8 w-8 object-contain rounded" />
                          ) : (
                            company.name.charAt(0)
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {company.type && (
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                              {company.type}
                            </span>
                          )}
                          {company.industry && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              {company.industry}
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {company.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                        {company.description || company.discription || "Leading global organization with competitive hiring bars and tech innovation."}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          {company._count?.product || company.product?.length || 0} Products
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Award className="w-3.5 h-3.5 text-indigo-500" />
                          {company._count?.interviewRounds || company.interviewRounds?.length || 0} Rounds
                        </span>
                      </div>

                      <Link
                        to={`/companies/${company.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-1.5 transition-all"
                      >
                        Explore
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No companies found</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                Try searching for another name or add a new company to the directory.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD COMPANY MODAL ================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add MNC to Directory"
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Company added successfully! Refreshing...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Netflix, Stripe, Oracle"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Established Year
              </label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                placeholder="e.g. 1998"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Company Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="Product">Product</option>
                <option value="Service">Service</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Startup">Startup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Technology, Cloud Computing, Fintech"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://company.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Logo Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://logo.clearbit.com/company.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              About the Company
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of mission, tech stack, and engineering culture..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              {formSubmitting ? "Saving..." : "Add Company"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyPage;