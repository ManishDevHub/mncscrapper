import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/signup", {
        username: name,
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        login(res.data.token, res.data.user);
        navigate("/jobs");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try a different email or username.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-[calc(100vh-72px)] bg-white px-6 py-12 transition-colors duration-300 dark:bg-black lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* ================= LEFT SECTION ================= */}

        <div className="hidden lg:block">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl p-1 bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-500/40 shadow-lg shadow-blue-500/25 overflow-hidden">
              <img
                src="/logo.png"
                alt="CareerHub Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.6)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images (1).png";
                }}
              />
            </div>

            <p className="mb-4 text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400">
              JOIN CAREERHUB
            </p>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Build your
              <span className="block text-blue-500">career with us.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-400">
              Create your account and get access to jobs, companies, interview
              preparation and career resources.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">
              {/* Feature 1 */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Discover opportunities
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Find jobs that match your skills.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Explore companies
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Learn how companies hire.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Prepare for interviews
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Prepare for every interview round.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REGISTER CARD ================= */}

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-950 sm:p-10">
            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
                <BriefcaseBusiness className="h-7 w-7 text-white" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create account
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Start your career journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-slate-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-500"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* ================= TERMS ================= */}

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-500"
                />

                <label
                  htmlFor="terms"
                  className="text-sm leading-6 text-slate-500 dark:text-slate-400"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            </form>

            {/* ================= LOGIN LINK ================= */}

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
