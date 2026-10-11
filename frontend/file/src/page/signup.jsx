import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, MapPin, Camera, Eye, EyeOff, ArrowRight,
  Check, ShieldCheck, Loader2, Phone, Home
} from 'lucide-react';
import Costume from '../services/costume.js';
import { useNavigate, Link } from 'react-router-dom';

/* Tokens (shared with HomePage)
   ink #112018 · forest #17402A · leaf #3E7D52 · marigold #F0B429 · mist #F2F5EE */

const PERKS = [
  <>Doorstep delivery completed by <strong className="font-semibold text-white">6:30 AM</strong>.</>,
  'Open access to weekly third-party pesticide and chemical lab reports.',
  'Zero-landfill glass bottle pickup, sanitised and reused.',
  'Pause, change quantity or skip a delivery in one tap.'
];

const field =
  "w-full bg-white text-[#112018] text-base sm:text-[15px] py-3.5 rounded-xl border border-[#17402A]/15 " +
  "focus:border-[#17402A] focus:ring-4 focus:ring-[#17402A]/10 outline-none transition placeholder:text-[#9AA79D]";

const label = "block text-[13px] font-semibold text-[#34443A] mb-1.5";

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
    <div className="su min-h-screen bg-[#F2F5EE] text-[#112018] antialiased selection:bg-[#17402A] selection:text-white flex items-center justify-center px-3 py-6 sm:px-6 sm:py-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        .su { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
        .su .display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.02em; }
        .su a:focus-visible, .su button:focus-visible, .su label:focus-within { outline: 2px solid #F0B429; outline-offset: 3px; }
        @keyframes su-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .su .rise { animation: su-rise .8s cubic-bezier(.2,.7,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .su .rise { animation: none; } }
      `}</style>

      <div className="rise w-full max-w-6xl grid lg:grid-cols-12 rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden bg-white shadow-[0_40px_90px_-40px_rgba(17,32,24,0.45)] ring-1 ring-[#17402A]/10">

        {/* Brand panel: full on desktop, compact banner on mobile */}
        <aside className="relative lg:col-span-5 text-white overflow-hidden bg-[#0F2D1D]">
          <img
            src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F2D1D]/70 via-[#0F2D1D]/80 to-[#0F2D1D]" />

          <div className="relative h-full flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-12">
            <div>
              <Link to="/" className="inline-block group">
                <span className="display text-3xl sm:text-4xl font-medium tracking-[0.18em] group-hover:opacity-85 transition-opacity">VEDA</span>
                <span className="block text-sm text-[#BFE3C7] mt-0.5">Sanctuary Organics</span>
              </Link>

              <h2 className="display mt-6 lg:mt-14 text-[1.7rem] sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.1] max-w-md">
                Purity at your door before the city wakes.
              </h2>
              <p className="mt-3 text-[#BFD0C3] text-[15px] leading-relaxed max-w-sm lg:hidden">
                Fresh A2 milk, cold-pressed oils and dawn-harvested staples, reserved for you.
              </p>

              <ul className="hidden lg:block mt-10 space-y-5">
                {PERKS.map((p, i) => (
                  <li key={i} className="flex gap-3.5 text-[15px] text-[#CFDBCF] leading-relaxed">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#F0B429] text-[#112018] flex items-center justify-center">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:flex items-center gap-2.5 pt-6 border-t border-white/10 text-sm text-[#A4B8A9]">
              <ShieldCheck className="w-5 h-5 text-[#F0B429]" />
              Your details are stored with 256-bit encryption.
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 xl:p-14">
          <header className="mb-8">
            <h1 className="display text-3xl sm:text-4xl font-medium">Create your account</h1>
            <p className="mt-2 text-[#5E6D62] text-[15px] leading-relaxed">
              Set up your profile and delivery address to start ordering farm-fresh food.
            </p>
          </header>

          <form className="space-y-8" onSubmit={handle}>

            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E6EFE4] ring-4 ring-white shadow-[0_10px_25px_-10px_rgba(17,32,24,0.4)] flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#7C8B80]" strokeWidth={1.5} />
                  )}
                </div>
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#17402A] hover:bg-[#0F2D1D] text-white flex items-center justify-center cursor-pointer ring-2 ring-white transition-colors"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={InputHandle}
                />
              </div>
              <div>
                <h3 className="font-semibold">Profile photo</h3>
                <p className="text-sm text-[#6B7A6F] mt-0.5 leading-snug">
                  Optional. Helps our delivery partner hand over your order.
                </p>
              </div>
            </div>

            {/* Personal details */}
            <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              <legend className="sr-only">Personal details</legend>

              <div>
                <label htmlFor="name" className={label}>Full name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="name" type="text" name="name" required autoComplete="name"
                    value={name} onChange={InputHandle}
                    placeholder="Radhika Sharma"
                    className={`${field} pl-10 pr-3`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={label}>Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email" type="email" name="email" required autoComplete="email"
                    value={email} onChange={InputHandle}
                    placeholder="radhika@example.com"
                    className={`${field} pl-10 pr-3`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={label}>Phone number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[15px] font-medium text-[#34443A] pr-2.5 border-r border-[#17402A]/15">+91</span>
                  <input
                    id="phone" type="tel" name="phone" required inputMode="numeric" autoComplete="tel-national"
                    value={phone} onChange={InputHandle} maxLength={10}
                    placeholder="98765 43210"
                    className={`${field} pl-[5.5rem] pr-3`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={label}>Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password" type={showPass ? "text" : "password"} name="password" required autoComplete="new-password"
                    value={password} onChange={InputHandle}
                    placeholder="Create a password"
                    className={`${field} pl-10 pr-12`}
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg text-[#7C8B80] hover:text-[#112018] transition cursor-pointer"
                    onClick={() => setShowpass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </fieldset>

            {/* Address */}
            <fieldset className="space-y-4 pt-8 border-t border-[#17402A]/10">
              <legend className="flex items-center gap-2 text-lg display font-medium -mb-1 float-left w-full">
                <span className="w-8 h-8 rounded-full bg-[#E6EFE4] text-[#17402A] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </span>
                Delivery address
              </legend>

              <div className="clear-both pt-1">
                <label htmlFor="flat" className={label}>Flat, house or society</label>
                <div className="relative">
                  <Home className="w-4 h-4 text-[#7C8B80] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="flat" type="text" name="flat" autoComplete="address-line1"
                    value={flat} onChange={InputHandle}
                    placeholder="Flat / Villa / House no., apartment or society"
                    className={`${field} pl-10 pr-3`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="sm:col-span-3">
                  <label htmlFor="landmark" className={label}>Area or landmark</label>
                  <input
                    id="landmark" type="text" name="landmark" autoComplete="address-line2"
                    value={landmark} onChange={InputHandle}
                    placeholder="Near Master Canteen"
                    className={`${field} px-3.5`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className={label}>City</label>
                  <select
                    id="city" name="city" value={city} onChange={InputHandle}
                    className={`${field} px-3 cursor-pointer`}
                  >
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Berhampur">Berhampur</option>
                    <option value="Puri">Puri</option>
                    <option value="Ganjam">Ganjam</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="pin" className={label}>PIN code</label>
                  <input
                    id="pin" type="text" name="pin" inputMode="numeric" autoComplete="postal-code"
                    value={pin} onChange={InputHandle} maxLength={6}
                    placeholder="751001"
                    className={`${field} px-3.5`}
                  />
                </div>
              </div>
            </fieldset>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={Boolean(agree)}
                onChange={InputHandle}
                className="mt-0.5 w-5 h-5 shrink-0 rounded-md accent-[#17402A] cursor-pointer"
              />
              <label htmlFor="agree" className="text-sm text-[#5E6D62] leading-relaxed cursor-pointer select-none">
                I agree to receive delivery updates and accept the{' '}
                <Link to="/terms" className="font-semibold text-[#17402A] underline underline-offset-2 hover:text-[#0F2D1D]">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="font-semibold text-[#17402A] underline underline-offset-2 hover:text-[#0F2D1D]">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <div className="space-y-5">
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
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-[15px] text-[#5E6D62]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#17402A] underline underline-offset-4 hover:text-[#0F2D1D]">
                  Log in
                </Link>
              </p>

              <p className="lg:hidden flex items-center justify-center gap-2 text-xs text-[#7C8B80]">
                <ShieldCheck className="w-4 h-4 text-[#3E7D52]" />
                Your details are stored with 256-bit encryption.
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}