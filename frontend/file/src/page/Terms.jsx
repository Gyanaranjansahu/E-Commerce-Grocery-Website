import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Leaf, Clock, Truck, RefreshCw, FileText } from 'lucide-react';
import Navbar from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';

// =========================================================================
// APPROACH:
// Terms of Service Page for VEDA Organics.
// Provides a transparent, clean, and comprehensive breakdown of platform
// terms, delivery schedules, subscription rules, and purity guarantees.
// Styled seamlessly with the brand aesthetic (#FAFAF8, #1B3821, serif headers).
// =========================================================================

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-900 flex flex-col font-sans antialiased">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        {/* Title Header */}
        <header className="border-b border-stone-200 pb-8 mb-8">
          <div className="flex items-center gap-2 text-emerald-900 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-950 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Last Updated: November 24, 2026 • Effective Immediately for All VEDA Organics Customers
          </p>
        </header>

        {/* Terms Content Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">

          {/* Section 1 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-900" />
              1. Acceptance of Terms & Organic Covenant
            </h2>
            <p>
              By accessing, browsing, or placing an order through <strong>VEDA Organics</strong> (website and digital services), 
              you agree to be legally bound by these Terms of Service. Our commitment is to bring wholesome, unadulterated, 
              direct-from-farm produce to your doorstep under stringent organic standards.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-900" />
              2. Lab Purity Guarantee & Quality Standards
            </h2>
            <p className="mb-3">
              Every batch of A2 Desi Cow Milk, cold-pressed oils, grains, and seasonal vegetables undergoes comprehensive 
              third-party lab testing. We guarantee zero synthetic hormones (oxytocin-free), zero chemical pesticides, and zero artificial preservatives.
            </p>
            <p>
              You can review public purity reports directly on our <Link to="/purity" className="text-emerald-950 font-semibold underline">Lab Purity Reports</Link> page anytime.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-900" />
              3. Morning Harvest & Delivery Schedules
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Daily Cut-off:</strong> Orders placed before <strong>9:00 PM</strong> are harvested at dawn and delivered to your doorstep by <strong>6:30 AM</strong> the following morning.
              </li>
              <li>
                <strong>Contactless Delivery:</strong> Produce and glass-bottled milk are placed outside your door or in your designated insulated cooling pouch.
              </li>
              <li>
                <strong>Delivery Charges:</strong> Free delivery applies to orders above ₹500 or active milk subscription plans. Standard delivery is ₹40 for smaller individual orders.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-900" />
              4. Subscription & Modification Rules
            </h2>
            <p>
              Subscribers can pause, modify quantities, or temporarily hold morning deliveries directly through their account 
              dashboard before 8:00 PM the evening prior. Modifications made after 8:00 PM cannot be applied for the next morning's harvest.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-900" />
              5. Replacements, Refunds & Damaged Goods
            </h2>
            <p>
              Because our harvest is 100% natural and free of preservatives, perishables must be inspected upon delivery. If any product arrives damaged, broken (glass bottles), or compromised in freshness, report it with a photo within 4 hours for an immediate full credit refund or replacement delivery.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3">
              6. Account Responsibility & Security
            </h2>
            <p>
              You are responsible for keeping your login credentials confidential. Do not share your OTP codes with anyone. 
              VEDA Organics representatives will never ask for your password or one-time codes over the phone or email.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs rounded-none">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-3">
              7. Contact & Support
            </h2>
            <p>
              For grievances, feedback, or subscription inquiries, contact our Morning Drop Hotline:
            </p>
            <div className="mt-3 p-4 bg-stone-50 border border-stone-200 text-xs">
              <p><strong>Hotline:</strong> +91 78468 13554 (Available 5:30 AM - 10:00 PM)</p>
              <p className="mt-1"><strong>Email:</strong> support@vedaorganics.com</p>
              <p className="mt-1"><strong>Registered Office:</strong> Veda Organics Agro Products Pvt. Ltd., Bhubaneswar, Odisha 751024</p>
            </div>
          </section>

        </div>

        {/* Bottom Actions */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap justify-between items-center gap-4 text-xs">
          <Link to="/login" className="text-emerald-950 font-bold hover:underline">
            ← Proceed to Sign In
          </Link>
          <Link to="/register" className="text-stone-600 hover:text-emerald-950">
            Create an Account
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
