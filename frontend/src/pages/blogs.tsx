import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  PlusCircle,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import api, { Blog } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Modal } from "../components/Modal";

export const BlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Write Modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;

      const res = await api.get("/api/blog", { params });
      if (res.data && res.data.data) {
        setBlogs(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load blogs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const res = await api.post("/api/blog/create", {
        ...formData,
        published: true,
      });

      if (res.data.success) {
        setFormSuccess(true);
        setTimeout(() => {
          setIsWriteModalOpen(false);
          setFormSuccess(false);
          setFormData({
            title: "",
            content: "",
            excerpt: "",
            thumbnail: "",
          });
          fetchBlogs();
        }, 1200);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to publish article.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <BookOpen className="w-4 h-4" />
              Interview Prep & Career Insights
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              MNC Guides, DSA Strategies & Prep
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Deep dives into actual interview experiences, salary negotiation, and system design.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) navigate("/login");
              else setIsWriteModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all self-start md:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Write an Article
          </button>
        </div>

        {/* Search */}
        <div className="py-6">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, tech stack, or topic..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        {/* Blog Grid */}
        <div className="pt-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 animate-pulse" />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <Link to={`/blogs/${blog.id}`} className="block">
                    {/* Thumbnail banner */}
                    <div className="h-44 bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-purple-600/20 flex items-center justify-center p-6 text-center relative overflow-hidden group">
                      {blog.thumbnail ? (
                        <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-extrabold text-slate-800 dark:text-white px-4 leading-snug">
                          {blog.title}
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                        {blog.excerpt || blog.content.substring(0, 120)}...
                      </p>
                    </div>
                  </Link>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.createAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:gap-1.5 transition-all"
                    >
                      Read Guide
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No articles published yet</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                Be the first to share an interview roadmap or company preparation guide!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= WRITE ARTICLE MODAL ================= */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="Write an Interview Guide or Prep Article"
      >
        <form onSubmit={handleCreateBlog} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Article published successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. How to Crack Google L4 SDE Interview in 3 Months"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Short Summary / Excerpt
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary shown on cards..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Article Body / Content *
            </label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write detailed advice, coding questions, STAR behavioral frameworks, or interview tips..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none font-mono text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogsPage;
