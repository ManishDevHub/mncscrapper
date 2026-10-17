import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  BriefcaseBusiness,
  AlertCircle,
} from "lucide-react";
import api, { Blog } from "../services/api";

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/api/blog/${id}`);
        if (res.data && res.data.data) {
          setBlog(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-slate-50/50 dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-slate-50/50 dark:bg-black text-center px-4">
        <div className="max-w-md p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 mb-5">{error || "The requested article does not exist."}</p>
          <Link to="/blogs" className="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white">
            Back to Prep Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>

        {/* Article Container */}
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 sm:p-12 shadow-xl shadow-blue-500/5 space-y-8"
        >
          {/* Header */}
          <div className="space-y-4 border-b border-slate-100 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <BookOpen className="w-3.5 h-3.5" />
              Interview Preparation
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-lg text-slate-600 dark:text-zinc-300 font-normal leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Published {new Date(blog.createAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {Math.max(2, Math.ceil(blog.content.split(/\s+/).length / 200))} min read
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="text-slate-700 dark:text-zinc-200 text-base leading-8 whitespace-pre-line space-y-4">
            {blog.content}
          </div>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Preparing for your upcoming interview?
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Explore live openings matching this preparation guide.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
            >
              <BriefcaseBusiness className="w-4 h-4" />
              Find Open Jobs
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
