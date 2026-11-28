import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Camera, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Loader2,
  Leaf
} from 'lucide-react';
import Costume from '../services/costume.js';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupUI() {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    name: "",
    email: "",
    profileImage: null,
    phone: "",
    password: "",
    flat: "",
    landmark: "",
    city: "Bhubaneswar",
    pin: "",
    agree: false
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPass, setShowpass] = useState(false);
  const { handleSignup, loading } = Costume();
  const { name, email, profileImage, phone, password, flat, landmark, city, pin, agree } = details;

  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profileImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  function InputHandle(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setDetails(prev => ({ ...prev, [name]: files[0] || null }));
    } else if (type === 'checkbox') {
      setDetails(prev => ({ ...prev, [name]: checked }));
    } else {
      setDetails(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handle(e) {
    e.preventDefault();

    if (!agree) {
      console.warn("User must agree to the Terms of Service.");
      return;
    }

    if (handleSignup) {
      try {
        const successMessage = await handleSignup(details);
        console.log("Signup success:", successMessage);
        navigate("/login", { replace: true });
      } catch (err) {
        console.error("Signup error:", err.message);
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FDFCF9] text-[#191919] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased overflow-hidden selection:bg-[#1C281D] selection:text-white">
      
      {/* Subtle Ambient Grain & Light Gradient Blurs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-[#E8EFE8] rounded-full blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-[#F3EFE6] rounded-full blur-3xl opacity-80" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8 sm:mb-10 transition-all duration-700 ease-out">
          <Link to="/" className="inline-flex flex-col items-center group">
            <span className="font-serif text-3xl sm:text-4xl font-light tracking-[-0.02em] text-[#151915] group-hover:opacity-85 transition-opacity">
              V E D A
            </span>
            <span className="text-[8px] font-mono font-semibold tracking-[0.45em] text-[#2C4A31] uppercase mt-1">
              Sanctuary Organics
            </span>
          </Link>
          <h1 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-[#171B17]">
            Begin Your Farm-to-Kitchen Journal
          </h1>
          <p className="mt-1.5 text-xs text-stone-500 max-w-md mx-auto font-light leading-relaxed">
            Reserved allocations for fresh unpasteurized A2 milk, cold-press oils, and dawn-harvested staples.
          </p>
        </div>

        {/* Card Shell */}
        <div className="bg-white border border-[#EAE6DD] shadow-[0_12px_48px_-16px_rgba(20,24,20,0.06)] grid lg:grid-cols-12 overflow-hidden transition-all duration-500 hover:border-[#DFDAD0]">
          
          {/* Left Column: Brand Pillars */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#172418] text-[#FAF8F5] p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-[#223324]">
            
            {/* Ambient Leaf Glow */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Leaf className="w-48 h-48 stroke-[0.75]" />
            </div>

            <div className="space-y-7 relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#233525] text-[#C9DEC9] px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase border border-[#304732]">
                <Sparkles className="w-3 h-3 text-[#A9CFA9]" />
                Estate Member Privileges
              </div>

              <h2 className="font-serif text-2xl font-light leading-snug tracking-tight text-[#FAF8F5]">
                Purity delivered before the city stirs awake.
              </h2>

              <ul className="space-y-4 text-xs text-[#CFDBCF] font-light leading-relaxed pt-2">
                <li className="flex items-start gap-3 group">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#233525] flex items-center justify-center text-[#A9CFA9] shrink-0 border border-[#344D36]">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>Direct dawn doorstep drops completed by <strong>06:30 AM</strong>.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#233525] flex items-center justify-center text-[#A9CFA9] shrink-0 border border-[#344D36]">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>Uncensored access to weekly third-party pesticide & chemical lab audits.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#233525] flex items-center justify-center text-[#A9CFA9] shrink-0 border border-[#344D36]">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>Zero landfill glass bottle collection with automatic sanitization cycles.</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-[#233525] flex items-center justify-center text-[#A9CFA9] shrink-0 border border-[#344D36]">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>Flexible cadence: pause, modify quantity, or skip on one touch.</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 border-t border-[#253826] text-[10px] font-mono tracking-wider uppercase text-[#96AC98] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A9CFA9]" />
              <span>Certified 256-bit Encrypted Member Record</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-[#FCFBF8]">
            <form className="space-y-6" onSubmit={handle}>
              
              {/* Profile Avatar Uploader */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#EFEBE0]">
                <div className="relative group">
                  <div className="w-20 h-20 bg-[#F4F1EA] border border-[#DDD8CB] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#1E2E1F]">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <User className="w-7 h-7 text-stone-400 stroke-[1.25]" />
                    )}
                  </div>
                  
                  <label 
                    htmlFor="profileImage" 
                    className="absolute -bottom-1 -right-1 bg-[#172418] hover:bg-black text-[#FAF8F5] p-1.5 cursor-pointer shadow-md transition-all duration-200 hover:scale-105"
                    title="Upload Member Portrait"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input 
                    id="profileImage" 
                    name="profileImage" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={InputHandle}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#151915]">
                    Member Portrait
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1 font-light leading-normal">
                    Optional photo for swift courier handover and gated community access.
                  </p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={InputHandle}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full bg-white text-[#161B16] text-xs py-3 pl-9 pr-3 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email"
                      name="email"
                      required
                      value={email}
                      onChange={InputHandle}
                      placeholder="radhika@example.com"
                      className="w-full bg-white text-[#161B16] text-xs py-3 pl-9 pr-3 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                    />
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Phone (Dawn Dispatch SMS)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-mono bg-[#F2EFE8] border border-r-0 border-[#DDD8CB] text-stone-600">
                      +91
                    </span>
                    <input 
                      type="tel"
                      name="phone"
                      required
                      value={phone}
                      onChange={InputHandle}
                      maxLength={10}
                      placeholder="98765 43210"
                      className="w-full bg-white text-[#161B16] text-xs py-3 px-3 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Password with View Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Account Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"}
                      name="password"
                      required
                      value={password}
                      onChange={InputHandle}
                      placeholder="••••••••"
                      className="w-full bg-white text-[#161B16] text-xs py-3 pl-9 pr-9 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                    />
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition cursor-pointer p-1"  
                      onClick={() => setShowpass(!showPass)}
                      aria-label="Toggle password view"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Address Fields */}
              <div className="pt-5 border-t border-[#EFEBE0] space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2C4A31]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#161B16]">
                    Morning Drop Destination
                  </span>
                </div>

                <div>
                  <input 
                    type="text"
                    name="flat"
                    value={flat}
                    onChange={InputHandle}
                    placeholder="Flat / Villa / House No., Apartment or Gated Society"
                    className="w-full bg-white text-[#161B16] text-xs py-3 px-3.5 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text"
                    name="landmark"
                    value={landmark}
                    onChange={InputHandle}
                    placeholder="Area / Prominent Landmark"
                    className="bg-white text-[#161B16] text-xs py-3 px-3.5 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                  />

                  <select
                    name="city"
                    value={city}
                    onChange={InputHandle}
                    className="bg-white text-[#161B16] text-xs py-3 px-3 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 cursor-pointer"
                  >
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Berhampur">Berhampur</option>
                    <option value="Puri">Puri</option>
                    <option value="Ganjam">Ganjam</option>
                  </select>

                  <input 
                    type="text"
                    name="pin"
                    value={pin}
                    onChange={InputHandle}
                    maxLength={6}
                    placeholder="PIN Code"
                    className="bg-white text-[#161B16] text-xs py-3 px-3.5 border border-[#DDD8CB] focus:border-[#172418] focus:ring-1 focus:ring-[#172418] outline-none transition duration-200 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input 
                  type="checkbox"
                  id="agree"
                  name="agree"
                  checked={Boolean(agree)}
                  onChange={InputHandle}
                  className="mt-0.5 accent-[#172418] w-3.5 h-3.5 rounded-none cursor-pointer"
                />
                <label htmlFor="agree" className="text-[11px] text-stone-500 font-light leading-snug cursor-pointer select-none">
                  I agree to receive dawn dispatch updates and accept the{' '}
                  <Link to="/terms" className="underline text-stone-800 hover:text-black transition">Terms of Service</Link> &{' '}
                  <Link to="/privacy" className="underline text-stone-800 hover:text-black transition">Privacy Charter</Link>.
                </label>
              </div>

              {/* Animated Submit CTA */}
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-[#172418] text-[#FAF8F5] font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm ${
                  loading 
                    ? "opacity-75 cursor-not-allowed" 
                    : "hover:bg-black cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Inscribing Member Ledger...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Registration & Access Harvest</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </>
                )}
              </button>

              {/* Sign-in Switch */}
              <div className="text-center pt-2">
                <p className="text-xs text-stone-500 font-light">
                  Already hold an estate subscription?{' '}
                  <Link to="/login" className="font-medium text-[#172418] hover:underline underline-offset-4">
                    Access Account
                  </Link>
                </p>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}