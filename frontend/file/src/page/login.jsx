import React, { useState } from 'react';
import Costume from '../services/costume.js';
import { useApp } from '../context/Usecontext.jsx';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// =========================================================================
// APPROACH:
// Simple, clean login controller:
// 1. Manages credentials (email, password, remember-me) in simple local state.
// 2. Uses `loginUser(credentials)` from GlobalContext which authenticates
//    via `POST /login` and immediately populates the user and cart in context.
// 3. Clear inline error display with password visibility toggle.
// 4. Clean navigation links: "Forgot?" passes pre-filled email to `/forgot`,
//    and explicit link to `/terms` (Terms of Service).
// =========================================================================

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, handleLogin } = Costume();
  const { curr_user } = useApp();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update form inputs and clear previous error messages
  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setErrorMessage('');
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // Handle Login form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setErrorMessage('');
      const res = await handleLogin(credentials);
      if (res) {
        const currentUser = await curr_user();
        if (!currentUser) {
          setErrorMessage("Your account could not be loaded. Please try signing in again.");
          return;
        }

        const from = location.state?.from;
        const destination =
          from?.pathname?.startsWith("/") && !from.pathname.startsWith("/admin")
            ? `${from.pathname}${from.search || ""}${from.hash || ""}`
            : "/";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Invalid credentials. Please try again.");
      console.error("Login failed:", err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-emerald-950">VEDA</span>
            <span className="text-[10px] tracking-widest text-emerald-800 uppercase block font-semibold">Organics</span>
          </Link>
          <h1 className="text-xl font-semibold mt-2">Welcome Back</h1>
          <p className="text-xs text-stone-500 mt-0.5">Sign in to access your morning fresh basket</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Address */}
          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
              Email 
            </label>
            <input 
              type="email" 
              name="email"
              required
              value={credentials.email}
              onChange={handleInput}
              placeholder="name@example.com" 
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950" 
            />
          </div>

          {/* Password with Forgot Link & Show/Hide Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600">
                Password
              </label>
              <Link 
                to="/forgot" 
                state={{ email: credentials.email }}
                className="text-[11px] text-emerald-950 hover:underline font-medium"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                value={credentials.password}
                onChange={handleInput}
                placeholder="••••••••" 
                className="w-full text-xs p-2.5 pr-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="remember" 
              name="remember"
              checked={credentials.remember}
              onChange={handleInput}
              className="accent-emerald-950 cursor-pointer" 
            />
            <label htmlFor="remember" className="text-xs text-stone-600 cursor-pointer">
              Remember my login
            </label>
          </div>

          {/* Submit Sign In Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-900 cursor-pointer"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Legal / Terms of Service Notice */}
          <p className="text-center text-[11px] text-stone-500 pt-1">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-emerald-950 font-semibold underline hover:text-emerald-800">
              Terms of Service
            </Link>
          </p>

          {/* Redirect to Sign Up */}
          <p className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-950 font-bold hover:underline">
              Create One
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
