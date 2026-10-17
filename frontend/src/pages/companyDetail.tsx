import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Calendar,
  Layers,
  Award,
  PlusCircle,
  ArrowLeft,
  ExternalLink,
  BriefcaseBusiness,
  AlertCircle,
} from "lucide-react";
import api, { type Company } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productError, setProductError] = useState("");

  // Add Round Modal
  const [isAddRoundOpen, setIsAddRoundOpen] = useState(false);
  const [roundNumber, setRoundNumber] = useState("1");
  const [roundTitle, setRoundTitle] = useState("");
  const [roundDescription, setRoundDescription] = useState("");
  const [roundSubmitting, setRoundSubmitting] = useState(false);
  const [roundError, setRoundError] = useState("");

  const fetchCompany = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/company/${id}`);
      if (res.data && res.data.data) {
        setCompany(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setProductSubmitting(true);
    setProductError("");

    try {
      await api.post(`/api/company/product/create/${company.id}`, {
        name: productName,
      });
      setProductName("");
      setIsAddProductOpen(false);
      fetchCompany();
    } catch (err: any) {
      setProductError(err.response?.data?.message || "Failed to add product");
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleAddRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setRoundSubmitting(true);
    setRoundError("");

    try {
      await api.post(`/api/company/round/create/${company.id}`, {
        roundNumber: Number(roundNumber),
        title: roundTitle,
        description: roundDescription,
      });
      setRoundTitle("");
      setRoundDescription("");
      setIsAddRoundOpen(false);
      fetchCompany();
    } catch (err: any) {
      setRoundError(err.response?.data?.message || "Failed to add interview round");
    } finally {
      setRoundSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-slate-50/50 dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-slate-50/50 dark:bg-black text-center px-4">
        <div className="max-w-md p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 mb-5">{error || "The requested MNC profile does not exist."}</p>
          <Link to="/companies" className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white">
            Back to MNC Directory
          </Link>
        </div>
      </div>
    );
  }

  const interviewRounds = company.interviewRounds || [];
  const products = company.product || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back navigation */}
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MNC Directory
        </Link>

        {/* Company Overview Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl shadow-blue-500/5 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-bold shadow-md shadow-blue-500/25 shrink-0">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-12 w-12 object-contain rounded-lg" />
                ) : (
                  company.name.charAt(0)
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {company.name}
                  </h1>
                  {company.type && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      {company.type}
                    </span>
                  )}
                  {company.industry && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                      {company.industry}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                  {company.establishedYear && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Founded in {company.establishedYear}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {company.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <Link
              to={`/jobs?search=${encodeURIComponent(company.name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all shrink-0 self-start"
            >
              <BriefcaseBusiness className="w-4 h-4" />
              View Open Jobs
            </Link>
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About Organization
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {company.description || company.discription || "Leading technology multinational known for building scalable platforms and hiring high-performing engineers."}
            </p>
          </div>
        </motion.div>

        {/* ================= INTERVIEW ROUNDS BREAKDOWN ================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <Award className="w-4 h-4" />
                Hiring Process
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Step-by-Step Interview Rounds
              </h2>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                } else {
                  setRoundNumber(String((interviewRounds.length || 0) + 1));
                  setIsAddRoundOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Interview Round
            </button>
          </div>

          {interviewRounds.length > 0 ? (
            <div className="relative pl-6 md:pl-8 border-l-2 border-indigo-200 dark:border-indigo-900/60 space-y-8 ml-3">
              {interviewRounds.map((round) => (
                <motion.div
                  key={round.id || round.roundNumber}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Timeline Badge Dot */}
                  <div className="absolute -left-[35px] md:-left-[43px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold ring-4 ring-white dark:ring-black">
                    {round.roundNumber}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:border-indigo-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Round {round.roundNumber}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {round.title}
                    </h3>

                    {round.description && (
                      <p className="text-sm text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed whitespace-pre-line">
                        {round.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
              <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                No interview rounds added yet
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 mb-4">
                Share your interview experience to help fellow engineers prepare!
              </p>
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate("/login");
                  else setIsAddRoundOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
              >
                Add First Round
              </button>
            </div>
          )}
        </section>

        {/* ================= PRODUCTS & PLATFORMS SECTION ================= */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                <Layers className="w-4 h-4" />
                Engineering Ecosystem
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Products & Platforms Built Here
              </h2>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                } else {
                  setIsAddProductOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center gap-3 shadow-sm hover:border-blue-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {product.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    {product.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
              <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                No products recorded yet
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 mb-4">
                Add main products and services associated with this company.
              </p>
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate("/login");
                  else setIsAddProductOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white"
              >
                Add First Product
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title={`Add Product for ${company.name}`}
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          {productError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {productError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Product / Platform Name *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Google Cloud, Gmail, Android"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={productSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              {productSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= ADD ROUND MODAL ================= */}
      <Modal
        isOpen={isAddRoundOpen}
        onClose={() => setIsAddRoundOpen(false)}
        title={`Add Interview Round for ${company.name}`}
      >
        <form onSubmit={handleAddRound} className="space-y-4">
          {roundError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {roundError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Round # *
              </label>
              <input
                type="number"
                min="1"
                required
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Round Title *
              </label>
              <input
                type="text"
                required
                value={roundTitle}
                onChange={(e) => setRoundTitle(e.target.value)}
                placeholder="e.g. Technical Round 1: DSA & Problem Solving"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Round Description, Questions & Tips
            </label>
            <textarea
              rows={4}
              value={roundDescription}
              onChange={(e) => setRoundDescription(e.target.value)}
              placeholder="What questions were asked? What topics (DSA, System Design, STAR Behavioral) to focus on?"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddRoundOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={roundSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 disabled:opacity-50"
            >
              {roundSubmitting ? "Saving..." : "Add Round"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyDetail;
