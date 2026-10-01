import React, { useState, useContext } from 'react';
import Costume from '../services/costume.js';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext.jsx';

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
    <div className="min-h-screen bg-[#F9F9F7] text-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-emerald-950">VEDA</span>
            <span className="text-[10px] tracking-widest text-emerald-800 uppercase block font-semibold">Organics</span>
          </Link>
          <h1 className="text-xl font-semibold mt-2">Welcome Back</h1>
          <p className="text-xs text-stone-500 mt-0.5">Sign in to access your morning fresh basket</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600">
                Password
              </label>
              <Link to="/forgot" className="text-[11px] text-emerald-950 hover:underline">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              name="password"
              required
              value={credentials.password}
              onChange={handleInput}
              placeholder="••••••••" 
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950" 
            />
          </div>

          {/* Remember Me */}
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

          {/* Submit CTA */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-900 cursor-pointer"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Redirect to Sign Up */}
          <p className="text-center text-xs text-stone-500 pt-2">
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