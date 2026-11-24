import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Costume from '../services/costume.js';
import { GlobalContext } from '../context/Usecontext.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { admins, curr_user } = useContext(GlobalContext);

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = data;
  const { loading, handleLogin } = Costume();

  function handleItem(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleForm(e) {
    e.preventDefault();
    try {
      const res = await handleLogin(data);
      if (res) {
        if (admins) await admins();
        if (curr_user) await curr_user();
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Responsive background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute -top-24 -left-24 sm:-top-40 sm:-left-40 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[90px] sm:blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 sm:-bottom-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/10 rounded-full blur-[90px] sm:blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[360px] sm:max-w-md bg-[#111827]/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Admin Login</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Enter your credentials to access the portal</p>
        </div>

        <form onSubmit={handleForm} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleItem}
              required
              placeholder="admin@domain.com"
              className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleItem}
              required
              placeholder="••••••••"
              className="w-full bg-[#161f30] border border-slate-700/80 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;