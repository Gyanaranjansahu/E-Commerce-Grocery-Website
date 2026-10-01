import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  Phone
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#161B16] text-[#E5E9E5] border-t border-[#1F261F] font-sans">
      
      {/* 1. NEWSLETTER & FARM BULLETIN STRIP */}
      <div className="border-b border-[#252D25] bg-[#121612]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#97B89B] font-semibold">Weekly Harvest Letter</span>
              <h3 className="font-serif text-2xl font-medium text-white">
                Receive the Sunday Farm Crop Report & Season Updates
              </h3>
              <p className="text-xs text-[#9DA89D] max-w-md">
                No promotions or spam. Just honest notifications when Alphonso batches, winter sarson, or heirloom rice are freshly harvested.
              </p>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email"
                  placeholder="Enter your email address (e.g. priya@gmail.com)"
                  className="bg-[#1C221C] border border-[#303B30] text-white text-xs px-4 py-3.5 flex-1 focus:border-[#97B89B] outline-none placeholder:text-[#6F7A6F]"
                />
                <button 
                  type="submit"
                  className="px-6 py-3.5 bg-white text-[#161B16] hover:bg-[#E5E9E5] font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2"
                >
                  Join Circle <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand & Manifesto Column */}
          <div className="col-span-2 space-y-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none block">
                VEDA ORGANICS
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#97B89B] uppercase block mt-1">
                Khet Se Kitchen Tak
              </span>
            </div>

            <p className="text-xs text-[#A8B4A8] leading-relaxed max-w-sm">
              Dedicated to reviving regenerative farming across India. Delivering pure A2 Gir cow milk, native grains, and unadulterated produce straight to households before the sun rises.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#CFDBCF]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#97B89B]" />
                <span>Veda Central Hub, Whitefield, Bengaluru, KA 560066</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#97B89B]" />
                <span>Kisan Care Helpline: +91 (80) 4122-9090 (Mon-Sat)</span>
              </div>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-[#2B352B] pb-2">
              Produce & Dairy
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA89D]">
              <li><a href="#" className="hover:text-white transition">A2 Desi Cow Milk</a></li>
              <li><a href="#" className="hover:text-white transition">Hand-Churned Bilona Ghee</a></li>
              <li><a href="#" className="hover:text-white transition">Heirloom Vegetables</a></li>
              <li><a href="#" className="hover:text-white transition">Chemical-Free Greens</a></li>
              <li><a href="#" className="hover:text-white transition">Naturally Ripened Mangoes</a></li>
              <li><a href="#" className="hover:text-white transition">Stone-Ground Chakki Atta</a></li>
            </ul>
          </div>

          {/* Sourcing & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-[#2B352B] pb-2">
              Our Standard
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA89D]">
              <li><a href="#" className="hover:text-white transition">Lab Testing & Purity Reports</a></li>
              <li><a href="#" className="hover:text-white transition">Zero-Carbide Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Farmer Fair-Share Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Glass Bottle Return Model</a></li>
              <li><a href="#" className="hover:text-white transition">Morning 6:30 AM Cold Delivery</a></li>
            </ul>
          </div>

          {/* Help & Regional Deliveries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-[#2B352B] pb-2">
              Hubs & Support
            </h4>
            <ul className="space-y-2 text-xs text-[#9DA89D]">
              <li><a href="#" className="hover:text-white transition">Bengaluru Hubs</a></li>
              <li><a href="#" className="hover:text-white transition">Delhi-NCR Delivery Zones</a></li>
              <li><a href="#" className="hover:text-white transition">Mumbai & Pune Coverage</a></li>
              <li><a href="#" className="hover:text-white transition">Pause / Resume Subscription</a></li>
              <li><a href="#" className="hover:text-white transition">Refund & Bruised Crop Policy</a></li>
            </ul>
          </div>

        </div>

        {/* 3. CERTIFICATION & LABELS STRIP */}
        <div className="mt-14 pt-8 border-t border-[#252D25] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#9DA89D]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#97B89B]" />
            <span>FSSAI License No. 10020043000128</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#97B89B]" />
            <span>NPOP Certified Biodynamic Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#97B89B]" />
            <span>Jaivik Bharat Recognized Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#97B89B]" />
            <span>Zero Preservatives or Synthetic Hormones</span>
          </div>
        </div>

        {/* 4. COPYRIGHT & LEGAL */}
        <div className="mt-8 pt-6 border-t border-[#212821] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6E7A6E] gap-4">
          <p>© 2026 Veda Organics Agro Products Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#9DA89D] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#9DA89D] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#9DA89D] transition">Delivery & Subscription Guidelines</a>
          </div>
        </div>

      </div>

    </footer>
  );
}