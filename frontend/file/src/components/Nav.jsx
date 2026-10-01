import React, { useState, useEffect, useContext } from 'react';
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Heart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { total, user, wishdata, handleUserLogout } = useContext(GlobalContext);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 bg-[#FAFAF8] ${
      isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-b border-[#E8E6DF]' : 'border-b border-[#EFECE6]'
    }`}>
      
      {/* Top Banner: Editorial Announcement */}
      <aside aria-label="Announcement" className="bg-[#1B3821] text-white text-[11px] font-medium py-2 px-4 tracking-wider text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C4DFC7]" />
        <span>Morning harvest dispatch cut-off: order by <strong>9:00 PM</strong> for <strong>6:30 AM</strong> delivery.</span>
      </aside>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#161B16] hover:text-[#1B3821] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex flex-col select-none group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#161B16] leading-none group-hover:text-[#1B3821] transition">
                VEDA
              </span>
              <span className="text-[9px] font-semibold tracking-[0.35em] text-[#1B3821] uppercase mt-0.5">
                Organics
              </span>
            </Link>
          </div>

          {/* Right: Actions (Nav Links, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#3C423C] mr-2">
              <Link to="/shop" className="hover:text-[#1B3821] transition">Shop Harvest</Link>
              <Link to="/subscription" className="hover:text-[#1B3821] transition">Milk Plan</Link>
              <Link to="/purity" className="hover:text-[#1B3821] transition">Lab Reports</Link>
            </nav>

            <div className="h-5 w-[1px] bg-[#DDD9CE] hidden xl:block" />

            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-[#464D46] hover:text-[#1B3821] transition rounded-full hover:bg-[#F2EFE9] hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishdata && wishdata.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </Link>

            {/* User Account / Auth Toggle */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#F2EFE9] transition text-[#161B16] text-xs font-medium cursor-pointer">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Avatar" 
                      className="w-7 h-7 rounded-full object-cover border border-[#C5D8C7]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1B3821] text-white flex items-center justify-center font-bold text-xs">
                      {user.name?.[0] || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline font-sans text-xs">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A827A]" />
                </button>

                {/* Account Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E6E4DD] shadow-lg rounded-none py-2 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-1 z-50">
                  <div className="px-4 py-2 border-b border-[#F0EEE8]">
                    <p className="text-xs font-bold text-[#161B16]">{user.name}</p>
                    <p className="text-[10px] text-[#7A827A] truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">ADMIN</span>
                    )}
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-[#F8F7F3]">Admin Dashboard</Link>
                  )}
                  <Link to="/orders" className="block px-4 py-2 text-xs text-[#3C423C] hover:bg-[#F8F7F3]">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-xs text-[#3C423C] hover:bg-[#F8F7F3]">My Wishlist</Link>
                  <button 
                    onClick={async () => {
                      if (handleUserLogout) await handleUserLogout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-[#F8F7F3] border-t border-[#F0EEE8] mt-1 cursor-pointer font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-xs font-semibold tracking-wider uppercase px-3 py-2 text-[#242A24] hover:text-[#1B3821] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center justify-center bg-[#1B3821] hover:bg-[#122817] text-white text-[11px] font-semibold uppercase tracking-widest px-4 py-2 transition"
                >
                  Join Circle
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link 
              to="/cart" 
              className="relative flex items-center gap-2.5 bg-[#E8EFE8] hover:bg-[#DCE6DC] text-[#1B3821] px-3.5 py-2 rounded-full transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold tracking-wide">Basket</span>
              {total > 0 && (
                <span className="flex items-center justify-center bg-[#1B3821] text-[#E8EFE8] text-[10px] font-bold w-5 h-5 rounded-full ring-2 ring-[#FAFAF8]">
                  {total}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-28 bg-black/40 z-50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm h-full bg-[#FAFAF8] p-6 shadow-2xl flex flex-col justify-between border-r border-[#E6E4DD]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              
              {/* Account Quick Status */}
              {!user && (
                <div className="pb-4 border-b border-[#E6E4DD]">
                  <p className="text-xs text-[#6F756F]">Welcome to Mindful Eating</p>
                  <div className="mt-2 flex gap-3">
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex-1 text-center py-2 bg-[#1B3821] text-white text-xs font-semibold tracking-wider uppercase"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex-1 text-center py-2 border border-[#1B3821] text-[#1B3821] text-xs font-semibold tracking-wider uppercase"
                    >
                      Join
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4 text-sm font-semibold tracking-wider uppercase text-[#161B16]">
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B3821]">Shop Harvest</Link>
                <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B3821]">Daily Milk Delivery</Link>
                <Link to="/purity" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B3821]">Lab Purity Reports</Link>
                <Link to="/our-story" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B3821]">Our Partner Farms</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#1B3821]">Saved Favourites</Link>
              </nav>
            </div>

            {/* Bottom Support Callout */}
            <div className="pt-6 border-t border-[#E6E4DD] text-xs text-[#6F756F]">
              <p className="font-semibold text-[#161B16]">Morning Drop Hotline</p>
              <p className="text-[11px] mt-0.5">+91 78468 13554 (5:30 AM - 10:00 PM)</p>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}