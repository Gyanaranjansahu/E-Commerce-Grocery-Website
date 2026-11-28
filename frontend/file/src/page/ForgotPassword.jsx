import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  KeyRound, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ShieldCheck 
} from 'lucide-react';
import Costume from '../services/costume.js';

// =========================================================================
// APPROACH & ARCHITECTURE:
// 1. Step-by-Step Progressive State Machine:
//    - Step 1 (Request OTP): User inputs registered email -> calls `POST /forgetPassword`.
//    - Step 2 (Verify OTP): User enters 6-digit OTP code -> calls `POST /verify`.
//      Features a 3-minute expiration timer and "Resend Code" capability.
//    - Step 3 (Set New Password): User inputs and confirms new password -> calls `PATCH /changePassword`.
//    - Step 4 (Success): Shows animated confirmation and automatically navigates back to `/login`.
// 2. Tab Switcher: Also allows "Direct Change" for quick password updates.
// 3. Simple, readable logic without third-party form dependencies or complex state machines.
// =========================================================================

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    loading, 
    handleSendOtp, 
    handleVerifyOtp, 
    handleChangePassword 
  } = Costume();

  // Mode: 'otp-flow' (default: send OTP -> verify -> reset) or 'direct' (direct change password)
  const [activeTab, setActiveTab] = useState('otp-flow');

  // Step in OTP flow: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Timer for OTP resend (180 seconds = 3 minutes)
  const [timer, setTimer] = useState(180);
  const [canResend, setCanResend] = useState(false);

  // Auto redirect countdown on success
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // If email was passed in location state (e.g. from login page)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Handle OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle redirect on success
  useEffect(() => {
    let interval = null;
    if (step === 4 && redirectCountdown > 0) {
      interval = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 4 && redirectCountdown === 0) {
      navigate('/login', { replace: true });
    }
    return () => clearInterval(interval);
  }, [step, redirectCountdown, navigate]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1: Send OTP to email
  const onSendOtp = async (e) => {
    if (e) e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      const res = await handleSendOtp(email);
      setMessage({ 
        type: 'success', 
        text: res?.message || 'Verification code sent to your email.' 
      });
      setTimer(180);
      setCanResend(false);
      setStep(2);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err?.message || 'Failed to send OTP. Please check the email and try again.' 
      });
    }
  };

  // Step 2: Verify OTP
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const trimmedOtp = otp.trim();
    if (!trimmedOtp || trimmedOtp.length < 4) {
      setMessage({ type: 'error', text: 'Please enter the complete verification code.' });
      return;
    }

    try {
      const res = await handleVerifyOtp({ email, otp: trimmedOtp });
      setMessage({ 
        type: 'success', 
        text: res?.message || 'Code verified successfully.' 
      });
      setStep(3);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err?.message || 'Invalid or expired OTP. Please try again.' 
      });
    }
  };

  // Step 3: Change Password
  const onChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      const res = await handleChangePassword({ email, newPassword });
      setMessage({ 
        type: 'success', 
        text: res?.message || 'Password updated successfully!' 
      });
      setStep(4);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err?.message || 'Failed to update password. Please try again.' 
      });
    }
  };

  // Direct Change Password (without OTP verification step)
  const onDirectChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      const res = await handleChangePassword({ email, newPassword });
      setMessage({ 
        type: 'success', 
        text: res?.message || 'Password updated successfully!' 
      });
      setStep(4);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err?.message || 'Failed to update password. Make sure user exists.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-stone-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-8 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold tracking-tight text-emerald-950">VEDA</span>
            <span className="text-[10px] tracking-widest text-emerald-800 uppercase block font-semibold">Organics</span>
          </Link>
          <h1 className="text-xl font-semibold mt-2">
            {step === 4 
              ? 'Password Reset Complete' 
              : activeTab === 'direct' 
                ? 'Change Account Password' 
                : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {step === 1 && "Enter your registered email to receive a secure OTP code"}
            {step === 2 && `Enter the 6-digit OTP code sent to ${email}`}
            {step === 3 && "Create a new strong password for your account"}
            {step === 4 && "Your security credentials have been updated successfully"}
          </p>
        </div>

        {/* Tab Switcher (OTP Flow vs Direct Password Change) */}
        {step !== 4 && (
          <div className="flex border-b border-stone-200 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('otp-flow');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-2 text-center transition border-b-2 cursor-pointer ${
                activeTab === 'otp-flow'
                  ? 'border-emerald-950 text-emerald-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              Reset with OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('direct');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 py-2 text-center transition border-b-2 cursor-pointer ${
                activeTab === 'direct'
                  ? 'border-emerald-950 text-emerald-950 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              Direct Change
            </button>
          </div>
        )}

        {/* Notification Alert */}
        {message.text && (
          <div
            className={`mb-5 p-3 text-xs flex items-start gap-2 border ${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
            )}
            <span className="leading-relaxed">{message.text}</span>
          </div>
        )}

        {/* ================= MODE: DIRECT CHANGE ================= */}
        {activeTab === 'direct' && step !== 4 && (
          <form onSubmit={onDirectChangePassword} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 pl-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                />
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs p-2.5 pl-8 pr-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                />
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full text-xs p-2.5 pl-8 pr-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                />
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-900 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        )}

        {/* ================= MODE: OTP FLOW ================= */}
        {activeTab === 'otp-flow' && (
          <>
            {/* Step Progress Bar */}
            {step < 4 && (
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= 1 ? 'bg-emerald-950 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">Email</span>
                </div>
                <div className={`h-[2px] flex-1 mx-2 ${step >= 2 ? 'bg-emerald-950' : 'bg-stone-200'}`} />
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= 2 ? 'bg-emerald-950 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">OTP</span>
                </div>
                <div className={`h-[2px] flex-1 mx-2 ${step >= 3 ? 'bg-emerald-950' : 'bg-stone-200'}`} />
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= 3 ? 'bg-emerald-950 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">Reset</span>
                </div>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={onSendOtp} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 pl-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-900 cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <div className="bg-stone-50 p-2.5 border border-stone-200 text-xs flex justify-between items-center">
                  <span className="text-stone-600 truncate max-w-[200px]">{email}</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-emerald-950 font-semibold hover:underline cursor-pointer"
                  >
                    Edit Email
                  </button>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                    Enter OTP Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full text-center tracking-[0.4em] font-mono text-base p-2.5 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                {/* Countdown & Resend */}
                <div className="flex justify-between items-center text-xs text-stone-500 pt-1">
                  <span>
                    {timer > 0 ? (
                      <>Code expires in: <strong className="text-stone-800 font-mono">{formatTimer(timer)}</strong></>
                    ) : (
                      <span className="text-rose-600 font-medium">OTP has expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={onSendOtp}
                    className={`text-xs font-semibold ${
                      canResend && !loading
                        ? 'text-emerald-950 hover:underline cursor-pointer'
                        : 'text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className={`flex-1 py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                      loading || otp.length < 4 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-900 cursor-pointer'
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {step === 3 && (
              <form onSubmit={onChangePassword} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full text-xs p-2.5 pl-8 pr-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full text-xs p-2.5 pl-8 pr-8 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950"
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-900 cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving New Password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            )}

            {/* STEP 4: Reset Success */}
            {step === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">All Set!</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Your password has been changed. You can now log in with your new credentials.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login', { replace: true })}
                    className="w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider hover:bg-emerald-900 transition cursor-pointer"
                  >
                    Go To Sign In ({redirectCountdown}s)
                  </button>
                </div>
              </div>
            )}
          </>  
        )}
                  
        {/* Footer Navigation */}
        <div className="pt-6 border-t border-stone-200 mt-6 flex justify-between items-center text-xs">
          <Link to="/login" className="text-stone-500 hover:text-emerald-950 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
          <Link to="/register" className="text-emerald-950 font-bold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
