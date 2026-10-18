import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  KeyRound, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from "lucide-react";
import { sendOtp, resetPassword } from "../services/api.js";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Multi-step State: 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resend OTP Cooldown Timer
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(cleanEmail);
      setStep(2);
      setCooldown(60); // 60s cooldown
    } catch {
      // toast error already handled in api.js
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP in Step 2
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    try {
      await sendOtp(email.trim().toLowerCase());
      setCooldown(60);
      toast.success("A fresh verification code has been sent!");
    } catch {
      // toast error handled in api.js
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Submit OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 4) {
      toast.error("Please enter the verification code sent to your email");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase(), cleanOtp, newPassword);
      setStep(3); // Go to Success Screen
    } catch {
      // toast error handled in api.js
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-6 sm:p-8 shadow-sm rounded-none">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <span className="font-serif text-2xl font-bold tracking-tight text-emerald-950 group-hover:text-emerald-900 transition">
              VEDA
            </span>
            <span className="text-[10px] tracking-widest text-emerald-800 uppercase block font-semibold">
              Organics
            </span>
          </Link>
          <h1 className="text-xl font-semibold mt-2">Account Recovery</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {step === 1 && "Reset your password with email verification"}
            {step === 2 && "Enter verification code and choose a new password"}
            {step === 3 && "Password updated successfully"}
          </p>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full text-xs p-2.5 pl-9 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950 transition" 
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                We will email you a secure 6-digit OTP code to verify your identity.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-900"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1.5 text-xs text-emerald-950 font-semibold hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-sm flex items-start justify-between">
              <div>
                <p className="font-semibold">Code sent to:</p>
                <p className="font-mono text-[11px] text-emerald-800 break-all">{email}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-emerald-900 underline font-semibold hover:text-emerald-700 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={cooldown > 0 || loading}
                  className={`text-[11px] font-semibold ${
                    cooldown > 0 
                      ? "text-stone-400 cursor-not-allowed" 
                      : "text-emerald-950 hover:underline cursor-pointer"
                  }`}
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456" 
                  className="w-full text-center tracking-[8px] font-mono font-bold text-sm p-2.5 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950 transition" 
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters" 
                  className="w-full text-xs p-2.5 pl-9 pr-9 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950 transition" 
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password" 
                  className="w-full text-xs p-2.5 pl-9 pr-9 bg-stone-50 border border-stone-300 outline-none focus:border-emerald-950 transition" 
                />
                <ShieldCheck className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-900"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Confirm & Reset Password</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Cancel and start over
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Password Successfully Reset
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Your password has been securely updated. You can now log into your account with your new credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

