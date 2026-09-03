import { useAuth } from '@/services/auth/hooks/useAuth';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
  TrendingUp,
  ShoppingCart,
  Box,
  Activity,
  X,
} from 'lucide-react';
import { FormEvent, useState, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { LoadingScreen } from '../common/Error/LoadingScreen';

const chartData = [35, 50, 42, 68, 55, 75, 62, 88, 72, 94, 82, 100];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password Validation Criteria Checks
  const criteria = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordStrength = useMemo(() => {
    const passedCount = Object.values(criteria).filter(Boolean).length;
    if (passedCount === 5)
      return { label: 'Very Strong', color: 'bg-emerald-500 text-emerald-400' };
    if (passedCount >= 3)
      return { label: 'Good', color: 'bg-amber-500 text-amber-400' };
    return { label: 'Weak', color: 'bg-red-500 text-red-400' };
  }, [criteria]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to dashboard...');
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Invalid email or password',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {};
  const handleMicrosoftLogin = () => {};
  const handleAppleLogin = () => {};

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-slate-100">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* =====================================================
            LEFT — PRODUCT EXPERIENCE
        ====================================================== */}
        <section className="relative hidden min-h-0 overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#090d16] to-[#0f172a]" />

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, 40, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]"
          />

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    x: [0, -35, 0],
                    y: [0, 35, 0],
                    scale: [1, 1.18, 1],
                  }
            }
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-32 right-0 h-[450px] w-[450px] rounded-full bg-indigo-600/15 blur-[140px]"
          />

          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex h-full w-full min-h-0 flex-col justify-between p-8 xl:p-12">
            {/* Logo */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: 10, scale: 1.05 }
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-colors"
              >
                <Box size={20} />
              </motion.div>
              <span className="text-xl font-bold tracking-wider text-white">
                SWIFT<span className="text-cyan-400">BUY</span>
              </span>
            </motion.div>

            {/* Hero Content */}
            <div className="my-auto max-w-2xl py-8">
              <motion.div
                initial={
                  shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }
                }
                animate={
                  shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.45 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3.5 py-1 text-[11px] font-medium text-cyan-300 backdrop-blur-md"
              >
                <Activity size={12} className="animate-pulse text-cyan-400" />
                Live store tracking is active
              </motion.div>

              <motion.h2
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 15 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-5xl"
              >
                Manage your stock.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Without the headache.
                </span>
              </motion.h2>

              <motion.p
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 max-w-lg text-sm leading-6 text-slate-400 xl:text-base"
              >
                Keep track of items, catch low stock before it runs out, and
                easily manage customer orders all in one place.
              </motion.p>

              {/* Preview Card */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 25 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3 }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -6, transition: { duration: 0.3 } }
                }
                className="group relative mt-7 max-w-xl cursor-default"
              >
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 opacity-40 blur-xl transition duration-500 group-hover:opacity-100" />

                <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 group-hover:border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium tracking-widest text-cyan-400">
                        STORE OVERVIEW
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-white">
                        Today's Summary
                      </p>
                    </div>
                    <span className="flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300 transition group-hover:bg-cyan-500/20">
                      Live <TrendingUp size={11} />
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <motion.div
                      whileHover={
                        shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }
                      }
                      className="rounded-xl border border-white/5 bg-black/40 p-3 transition-colors hover:border-cyan-500/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[9px]">Products</span>
                        <Package size={13} className="text-cyan-400" />
                      </div>
                      <p className="mt-1 text-lg font-bold text-white">1,248</p>
                    </motion.div>

                    <motion.div
                      whileHover={
                        shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }
                      }
                      className="rounded-xl border border-white/5 bg-black/40 p-3 transition-colors hover:border-amber-500/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[9px]">Low Stock</span>
                        <AlertCircle size={13} className="text-amber-400" />
                      </div>
                      <p className="mt-1 text-lg font-bold text-amber-400">
                        12
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={
                        shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }
                      }
                      className="rounded-xl border border-white/5 bg-black/40 p-3 transition-colors hover:border-emerald-500/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-[9px]">Orders</span>
                        <ShoppingCart size={13} className="text-emerald-400" />
                      </div>
                      <p className="mt-1 text-lg font-bold text-white">84</p>
                    </motion.div>
                  </div>

                  {/* Chart Graph */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-[9px] text-slate-400">
                      <span>SALES & STOCK ACTIVITY</span>
                      <span className="text-cyan-400">+12.4% this week</span>
                    </div>
                    <div className="flex h-12 items-end gap-1.5">
                      {chartData.map((height, index) => (
                        <motion.div
                          key={index}
                          initial={
                            shouldReduceMotion ? undefined : { height: 0 }
                          }
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : { height: `${height}%` }
                          }
                          transition={{
                            duration: 0.6,
                            delay: index * 0.03,
                            ease: 'easeOut',
                          }}
                          className="group/bar relative flex-1 h-full flex items-end"
                        >
                          <div className="w-full rounded-t bg-gradient-to-t from-cyan-500/40 to-cyan-300 transition-all duration-300 group-hover/bar:bg-cyan-200 group-hover/bar:shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[9px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={12} />
                      All systems running smoothly
                    </div>
                    <span>Just updated</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <p>© {new Date().getFullYear()} SwiftBuy</p>
              <p>Made for growing businesses</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT — LOGIN FORM
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center bg-[#050b14] px-5 py-8 sm:px-8 lg:h-screen lg:min-h-0">
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px] rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Mobile Logo */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex items-center gap-3 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Box size={18} />
              </div>
              <span className="text-xl font-bold text-white">SwiftBuy</span>
            </motion.div>

            {/* Header */}
            <motion.div variants={itemVariants} className="mb-6">
              <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-cyan-400">
                WELCOME BACK
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Sign in to your account
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Enter your details to access your inventory and products.
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 flex gap-3 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-red-400"
                role="alert"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Unable to sign in</p>
                  <p className="mt-0.5 text-xs text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
                  />
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 text-sm text-white placeholder-slate-600 shadow-inner outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs text-cyan-400 transition hover:text-cyan-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-12 text-sm text-white placeholder-slate-600 shadow-inner outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-0 top-0 flex h-11 w-11 cursor-pointer items-center justify-center text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Password Criteria Checklist */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-xl border border-white/5 bg-black/30 p-3 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center mb-1 pb-2 border-b border-white/5">
                      <span className="text-slate-400 text-[10px]">
                        Password strength:
                      </span>
                      <span
                        className={`font-semibold text-[10px] ${passwordStrength.color.split(' ')[1]}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 gap-1.5 text-[11px]">
                      <li
                        className={`flex items-center gap-2 transition-colors ${criteria.length ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${criteria.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                        >
                          {criteria.length ? (
                            <Check size={10} />
                          ) : (
                            <X size={10} />
                          )}
                        </span>
                        Minimum 8 characters
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-colors ${criteria.uppercase ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${criteria.uppercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                        >
                          {criteria.uppercase ? (
                            <Check size={10} />
                          ) : (
                            <X size={10} />
                          )}
                        </span>
                        At least one uppercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-colors ${criteria.lowercase ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${criteria.lowercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                        >
                          {criteria.lowercase ? (
                            <Check size={10} />
                          ) : (
                            <X size={10} />
                          )}
                        </span>
                        At least one lowercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-colors ${criteria.number ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${criteria.number ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                        >
                          {criteria.number ? (
                            <Check size={10} />
                          ) : (
                            <X size={10} />
                          )}
                        </span>
                        At least one number
                      </li>
                      <li
                        className={`flex items-center gap-2 transition-colors ${criteria.symbol ? 'text-emerald-400' : 'text-slate-500'}`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${criteria.symbol ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}
                        >
                          {criteria.symbol ? (
                            <Check size={10} />
                          ) : (
                            <X size={10} />
                          )}
                        </span>
                        At least one special character
                      </li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={
                    isSubmitting || shouldReduceMotion
                      ? undefined
                      : { scale: 1.015, brightness: 1.05 }
                  }
                  whileTap={
                    isSubmitting || shouldReduceMotion
                      ? undefined
                      : { scale: 0.98 }
                  }
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={
                          shouldReduceMotion ? undefined : { rotate: 360 }
                        }
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Signing you in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <motion.span
                        animate={
                          shouldReduceMotion ? undefined : { x: [0, 3, 0] }
                        }
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="my-5 flex items-center gap-3"
            >
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] font-semibold tracking-wider text-slate-500">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            {/* Social Logins */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2.5"
            >
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-cyan-500/30"
                aria-label="Google"
              >
                <GoogleIcon />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleMicrosoftLogin}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-cyan-500/30"
                aria-label="Microsoft"
              >
                <MicrosoftIcon />
              </motion.button>
              <motion.button
                type="button"
                onClick={handleAppleLogin}
                whileHover={
                  shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:border-cyan-500/30"
                aria-label="Apple"
              >
                <AppleIcon />
              </motion.button>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              variants={itemVariants}
              className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-500"
            >
              <ShieldCheck size={13} className="text-cyan-400" />
              Your connection is secure and private
            </motion.div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.78-.07-1.53-.22-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.4z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0 0 12 21.5z"
      />
      <path
        fill="#FBBC05"
        d="M6.53 13.59A5.85 5.85 0 0 1 6.22 12c0-.55.11-1.09.31-1.59V7.88H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.12l3.25-2.53z"
      />
      <path
        fill="#EA4335"
        d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.72 5.38l3.25 2.53C6.3 8.1 8.46 6.38 12 6.38z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <div className="grid h-[16px] w-[16px] grid-cols-2 gap-[2px]">
      <span className="bg-[#F25022]" />
      <span className="bg-[#7FBA00]" />
      <span className="bg-[#00A4EF]" />
      <span className="bg-[#FFB900]" />
    </div>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-white"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.07-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25C11.88 5.02 13.69 3.18 15.83 3c.3 2.58-2.34 4.5-3.8 4.25z" />
    </svg>
  );
}
