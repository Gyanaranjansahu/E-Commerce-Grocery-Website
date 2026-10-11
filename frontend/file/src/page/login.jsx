import React, { useState, useContext } from 'react';
import Costume from '../services/costume.js';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext.jsx';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

/* Tokens (shared with HomePage and SignupUI)
   ink #112018 · forest #17402A · leaf #3E7D52 · marigold #F0B429 · mist #F2F5EE */

const field =
  "w-full bg-white text-[#112018] text-base sm:text-[15px] py-3.5 rounded-xl border border-[#17402A]/15 " +
  "focus:border-[#17402A] focus:ring-4 focus:ring-[#17402A]/10 outline-none transition placeholder:text-[#9AA79D]";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, handleLogin } = Costume();
  const { curr_user, admins, fetchCart, getWishlist } = useContext(GlobalContext);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPass, setShowPass] = useState(false);

  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      return;
    }

    try {
      const res = await handleLogin(credentials);
      if (res) {
        if (curr_user) await curr_user();
        if (admins) await admins();
        if (fetchCart) await fetchCart();
        if (getWishlist) await getWishlist();

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  }

  return (
    <div className="lg min-h-screen bg-[#F2F5EE] text-[#112018] antialiased selection:bg-[#17402A] selection:text-white flex items-center justify-center px-3 py-6 sm:px-6 sm:py-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        .lg { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .lg .display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.02em; }
        .lg a:focus-visible, .lg button:focus-visible { outline: 2px solid #F0B429; outline-offset: 3px; }
        @keyframes lg-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .lg .rise { animation: lg-rise .8s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .lg .rise { animation: none; } }
      `}</style>

      <div className="rise w-full max-w-5xl grid md:grid-cols-2 rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden bg-white shadow-[0_40px_90px_-40px_rgba(17,32,24,0.45)] ring-1 ring-[#17402A]/10">

        {/* Brand panel: full on tablet and up, compact banner on phones */}
        <aside className="relative text-white overflow-hidden bg-[#0F2D1D]">
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F2D1D]/70 via-[#0F2D1D]/80 to-[#0F2D1D]" />

          <div className="relative h-full flex flex-col justify-between gap-10 p-6 sm:p-10 lg:p-12">
            <div>
              <Link to="/" className="inline-block group">
                <span className="display text-3xl sm:text-4xl font-medium tracking-[0.18em] group-hover:opacity-85 transition-opacity">VEDA</span>
                <span className="block text-sm text-[#BFE3C7] mt-0.5">Organics</span>
              </Link>

              <h2 className="display mt-6 md:mt-14 text-[1.7rem] sm:text-3xl lg:text-[2.5rem] font-medium leading-[1.1] max-w-sm">
                Your morning basket is waiting.
              </h2>
            </div>

            <ul className="hidden md:block space-y-4">
              {[
                'Fresh milk and staples delivered by 6:30 AM',
                'Reorder your usual basket in one tap',
                'Every order shares one meal with a rural school'
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[15px] text-[#CFDBCF] leading-relaxed">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#F0B429] text-[#112018] flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Form */}
        <div className="p-5 sm:p-10 lg:p-14 flex flex-col justify-center">
          <header className="mb-8">
            <h1 className="display text-3xl sm:text-4xl font-medium">Welcome back</h1>
            <p className="mt-2 text-[#5E6D62] text-[15px] leading-relaxed">
              Log in to see your basket, favourites and orders.
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[13px] font-semibold text-[#34443A] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={credentials.email}
                  onChange={handleInput}
                  placeholder="name@example.com"
                  className={`${field} pl-10 pr-3`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[13px] font-semibold text-[#34443A]">
                  Password
                </label>
                <Link to="/forgot" className="text-[13px] font-semibold text-[#17402A] underline underline-offset-4 hover:text-[#0F2D1D]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={handleInput}
                  placeholder="Enter your password"
                  className={`${field} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-[#7C8B80] hover:text-[#112018] transition cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={credentials.remember}
                onChange={handleInput}
                className="w-5 h-5 rounded-md accent-[#17402A] cursor-pointer"
              />
              <label htmlFor="remember" className="text-[15px] text-[#5E6D62] cursor-pointer select-none">
                Keep me logged in
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className={`group w-full py-4 rounded-full bg-[#17402A] text-white font-semibold text-base transition flex items-center justify-center gap-2 shadow-[0_16px_34px_-14px_rgba(23,64,42,0.8)] ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0F2D1D] cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Redirect to Sign Up */}
            <p className="text-center text-[15px] text-[#5E6D62] pt-1">
              New to VEDA?{' '}
              <Link to="/register" className="font-semibold text-[#17402A] underline underline-offset-4 hover:text-[#0F2D1D]">
                Create an account
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}