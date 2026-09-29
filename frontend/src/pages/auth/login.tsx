import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // Backend login API will be connected here
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-white px-6 py-12 transition-colors duration-300 dark:bg-black lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl items-center gap-12 lg:grid-cols-2">

        <div className="hidden lg:block">
          <div className="max-w-xl">

            {/* Logo */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500">
              <BriefcaseBusiness className="h-7 w-7 text-white" />
            </div>

            <p className="mb-4 text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400">
              WELCOME BACK
            </p>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Continue your
              <span className="block text-blue-500">
                career journey.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-400">
              Sign in to discover new jobs, explore companies, read career
              insights and prepare for your next interview.
            </p>

            {/* Stats */}
            <div className="mt-10 flex gap-8">

              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  500+
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Jobs
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  100+
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Companies
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  200+
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Articles
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ================= LOGIN CARD ================= */}

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
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Sign in to your CareerHub account
              </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ================= EMAIL ================= */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-slate-600"
                  />
                  <div></div>

                </div>

              </div>

              {/* ================= PASSWORD ================= */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-400"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500"
              >
                Sign in

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>

            </form>

            {/* ================= REGISTER LINK ================= */}

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Create account
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  )
}

export default Login;