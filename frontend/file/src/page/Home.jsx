import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  ArrowRight, 
  Star, 
  Plus, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles, 
  Heart,
  ChevronRight,
  VolumeX,
  Volume2,
  Check,
  Leaf,
  Award,
  Users,
  HandHeart,
  Gift,
  Wheat
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Nav.jsx';
import { GlobalContext } from '../context/Usecontext.jsx';
import Costume from '../services/costume.js';

const CATEGORIES = [
  { id: 'all', name: 'All Daily Staples', icon: '🌾' },
  { id: 'dairy', name: 'Desi Cow Dairy & Ghee', icon: '🥛' },
  { id: 'vegetables', name: 'Farm-Direct Vegetables', icon: '🥬' },
  { id: 'fruits', name: 'Naturally Ripened Fruits', icon: '🥭' },
  { id: 'beverages', name: 'Pure Beverages & Juices', icon: '🧃' },
  { id: 'snacks', name: 'Artisanal Snacks', icon: '🫙' }
];

const PRODUCTS = [
  {
    id: 1,
    name: 'A2 Gir Cow Farm Fresh Raw Milk',
    unit: '1 Litre Glass Bottle',
    category: 'dairy',
    price: 110,
    originalPrice: 130,
    rating: 4.9,
    reviews: 420,
    tag: 'Delivered by 6 AM',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    name: 'Naturally Ripened Ratnagiri Alphonso',
    unit: '1 Dozen (approx. 2.8kg)',
    category: 'fruits',
    price: 1250,
    originalPrice: 1499,
    rating: 5.0,
    reviews: 184,
    tag: 'GI Tagged',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    name: 'Stone-Ground Sharbati Whole Wheat Atta',
    unit: '5 kg Eco Cloth Bag',
    category: 'snacks',
    price: 340,
    originalPrice: null,
    rating: 4.8,
    reviews: 312,
    tag: 'Cold Milled',
    badgeColor: 'bg-stone-100 text-stone-900 border-stone-300',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    name: 'Hydroponic Tender Baby Spinach & Methi',
    unit: '250g Fresh Bundle',
    category: 'vegetables',
    price: 65,
    originalPrice: 85,
    rating: 4.7,
    reviews: 95,
    tag: 'Harvested Today',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    name: 'Wood Cold-Pressed Yellow Mustard Oil',
    unit: '1 Litre Tin',
    category: 'snacks',
    price: 285,
    originalPrice: 320,
    rating: 4.9,
    reviews: 512,
    tag: 'Kachi Ghani',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    name: 'Organic Desi Danedar Bilona Ghee',
    unit: '500ml Glass Jar',
    category: 'dairy',
    price: 890,
    originalPrice: null,
    rating: 5.0,
    reviews: 640,
    tag: 'Hand-Churned',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 7,
    name: 'Pesticide-Free Vine Tomatoes & Desi Kheera',
    unit: '1 kg Combo Pack',
    category: 'vegetables',
    price: 75,
    originalPrice: 95,
    rating: 4.6,
    reviews: 140,
    tag: 'Fresh Harvest',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 8,
    name: 'Crisp Royal Gala Apples (Himachal)',
    unit: '1 kg Pack (approx. 4-5 pcs)',
    category: 'fruits',
    price: 240,
    originalPrice: 280,
    rating: 4.8,
    reviews: 219,
    tag: 'Orchard Direct',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80'
  }
];

export default function HomePage() {
  const { product, fetchCart, getWishlist } = useContext(GlobalContext);
  const { handleCart, handleWish } = Costume();

  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay deferred by browser policy:", err);
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleWishlist = async (prod) => {
    const id = prod._id || prod.id;
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
    if (prod._id) {
      try {
        await handleWish(prod._id);
        if (getWishlist) await getWishlist();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddToCart = async (prod) => {
    const id = prod._id || prod.id;
    setAddedItems(prev => ({ ...prev, [id]: true }));
    try {
      if (prod._id) {
        await handleCart(prod._id);
        if (fetchCart) await fetchCart();
      } else {
        // Find matching product in backend catalog
        const match = (product || []).find(p =>
          p.name?.toLowerCase().includes(prod.name?.slice(0, 8).toLowerCase())
        );
        if (match) {
          await handleCart(match._id);
          if (fetchCart) await fetchCart();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [id]: false }));
      }, 1200);
    }
  };

  const displayList = product && product.length > 0 ? product : PRODUCTS;

  const filteredProducts = activeCategory === 'all'
    ? displayList
    : displayList.filter(item => {
        const cat = (item.category || '').toLowerCase();
        if (activeCategory === 'dairy') return cat.includes('dairy');
        if (activeCategory === 'vegetables') return cat.includes('vegetable') || cat.includes('produce');
        if (activeCategory === 'fruits') return cat.includes('fruit');
        if (activeCategory === 'beverages') return cat.includes('beverage');
        if (activeCategory === 'snacks') return cat.includes('snack') || cat.includes('pantry');
        return cat === activeCategory.toLowerCase();
      });

  return (
    <main className="w-full bg-[#FAFAF8] text-[#1E221E] font-sans antialiased selection:bg-[#1B3821] selection:text-white">
      <Navbar />

      {/* COMMUNITY IMPACT TICKER */}
      <div className="bg-[#122817] text-[#D8E6D9] py-2.5 px-4 text-xs tracking-wide text-center font-medium border-b border-[#23422A] flex items-center justify-center gap-2">
        <HandHeart className="w-4 h-4 text-emerald-400" />
        <span><strong>1 Order = 1 Wholesome Meal Shared.</strong> Every basket you buy helps fund rations for rural primary schools.</span>
      </div>

      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-[#E6E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#F2F5ED] text-[#2C482C] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#DFE5D7]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Pure Soil to Table • Direct Farmer Pay • Community First
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#161B16] leading-[1.12]">
                Groceries that nourish your home and empower local farming families.
              </h1>

              <p className="text-[#565E56] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Source unadulterated Gir cow milk, stone-ground flours, and zero-carbide vegetables directly from Indian khets. Zero middleman cuts mean farmers receive honest livable rates.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a 
                  href="/shop"
                  className="px-8 py-4 bg-[#1B3821] hover:bg-[#122817] text-white font-semibold text-xs uppercase tracking-wider transition duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Shop Today's Harvest
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#community-cause"
                  className="px-8 py-4 bg-[#FAFAF8] hover:bg-[#F0EFEA] text-[#161B16] font-semibold text-xs uppercase tracking-wider border border-[#DDD9CE] transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-emerald-800" />
                  Our Community Mission
                </a>
              </div>

              {/* Real Value Stats */}
              <div className="pt-8 border-t border-[#EAE8E0] grid grid-cols-3 gap-6">
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#161B16]">100%</span>
                  <span className="text-xs text-[#6E756E]">Direct khet purchase</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#161B16]">1,200+</span>
                  <span className="text-xs text-[#6E756E]">Farmer families supported</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#161B16]">35,000+</span>
                  <span className="text-xs text-[#6E756E]">Meals shared to date</span>
                </div>
              </div>
            </div>

            {/* Visual Highlight Card with Looping Video */}
            <div className="lg:col-span-5">
              <div className="border border-[#E2DFD4] bg-white p-3 shadow-[0_10px_35px_rgba(0,0,0,0.06)] group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#161B16]">
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    poster="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"
                    className="w-full h-full object-cover brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                  >
                    <source
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      type="video/mp4"
                    />
                  </video>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-[#E1EFE1] px-3 py-1 text-[10px] font-mono tracking-widest uppercase border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live Khet Stream</span>
                    </div>

                    <button 
                      onClick={toggleMute}
                      aria-label="Toggle Sound"
                      className="inline-flex items-center gap-1 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/90 px-2.5 py-1 text-[10px] font-mono border border-white/20 transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/50 backdrop-blur-md border border-white/15 text-white">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#A5D6A7] block font-semibold">
                      Farm Co-op • Village Mandi
                    </span>
                    <p className="text-xs font-serif font-normal mt-0.5">
                      Direct proceeds fund local irrigation and grain storage.
                    </p>
                  </div>
                </div>

                <a 
                  href="/shop?category=produce"
                  className="p-4 bg-white flex justify-between items-center border-t border-[#EAE8E0] mt-3 hover:bg-[#F9F8F5] transition group/basket"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#161B16] group-hover/basket:text-[#1B3821] flex items-center gap-1">
                      Support A Farming Village Basket
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover/basket:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-[#6E756E]">Seasonal staples picked this morning</p>
                  </div>
                  <span className="text-base font-bold text-[#1B3821]">₹480</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUES */}
      <section className="bg-[#F7F6F1] border-b border-[#E6E4DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex gap-4 items-center bg-white p-5 border border-[#E4E1D7] shadow-xs">
              <div className="p-3 bg-[#F2F5ED] text-[#1B3821] rounded-xs">
                <HandHeart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#161B16]">No Middleman Cut</h4>
                <p className="text-xs text-[#6E756E] mt-0.5">Up to 40% higher earnings directly deposited to rural growers.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-white p-5 border border-[#E4E1D7] shadow-xs">
              <div className="p-3 bg-[#F2F5ED] text-[#1B3821] rounded-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#161B16]">Native Seed Preservation</h4>
                <p className="text-xs text-[#6E756E] mt-0.5">We help preserve indigenous heirloom seeds, heritage grains, and desi cows.</p>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-white p-5 border border-[#E4E1D7] shadow-xs">
              <div className="p-3 bg-[#F2F5ED] text-[#1B3821] rounded-xs">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#161B16]">School Grain Sharing</h4>
                <p className="text-xs text-[#6E756E] mt-0.5">Surplus produce and whole grains are delivered to neighborhood midday meals.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="harvest-catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E6E4DD] pb-6 mb-8 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B3821]">Community Harvest</span>
            <h2 className="text-3xl font-serif font-bold text-[#161B16] mt-1">Daily Harvest & Staples</h2>
            <p className="text-xs text-[#6E756E] mt-1">Click on any product image or title to explore all options in our Shop.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#1B3821] text-white shadow-sm'
                    : 'bg-white text-[#4D534D] border border-[#DDD9CE] hover:border-[#1B3821] hover:text-[#161B16]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod, idx) => {
            const pId = prod._id || prod.id || idx;
            return (
              <div 
                key={pId}
                className="bg-white border border-[#E6E4DD] hover:border-[#1B3821] flex flex-col justify-between transition-all duration-200 hover:shadow-md group rounded-xs"
              >
                <div>
                  {/* Photo Linking directly to Shop */}
                  <Link 
                    to="/shop"
                    title={`View ${prod.name} in shop`}
                    className="block relative aspect-square w-full bg-[#F4F3EE] overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={prod.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"} 
                      alt={prod.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {prod.category && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border shadow-2xs bg-white text-[#1B3821] border-[#E4E1D7]">
                        {prod.category}
                      </span>
                    )}

                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(prod);
                      }}
                      aria-label="Save to favorites"
                      className="absolute top-3 right-3 p-1.5 bg-white text-[#6E756E] hover:text-red-500 border border-[#E4E1D7] transition shadow-xs cursor-pointer z-10"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlist[pId] ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 backdrop-blur-xs text-[#161B16] text-[11px] font-bold px-3 py-1 uppercase tracking-wider border border-[#DDD9CE]">
                        View in Shop
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1 text-[#C48C24] text-xs font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{prod.rating || 4.9}</span>
                      <span className="text-[#8B918B] font-normal">({prod.reviews || 120})</span>
                    </div>

                    <Link 
                      to="/shop" 
                      className="block font-serif font-semibold text-base text-[#161B16] leading-snug hover:text-[#1B3821] transition line-clamp-1"
                    >
                      {prod.name}
                    </Link>
                    
                    <p className="text-xs text-[#737A73] line-clamp-1">{prod.unit || prod.description || "Fresh harvest"}</p>
                  </div>
                </div>

                {/* Price & Add Action */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#F0EFEA] flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-[#161B16]">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-[#9DA39D] line-through">₹{prod.originalPrice}</span>
                      )}
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className={`px-4 py-2 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition cursor-pointer rounded-xs ${
                        addedItems[pId] 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-[#1B3821] hover:bg-[#122817] text-white'
                      }`}
                    >
                      {addedItems[pId] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          ADDED
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          ADD
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/shop" 
            className="inline-flex items-center gap-2 border-b-2 border-[#1B3821] pb-1 text-sm font-bold tracking-wider text-[#1B3821] hover:text-[#122817] uppercase transition"
          >
            Explore All 140+ Farm Staples In Shop
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 4. HOW YOUR PURCHASE HELPS OTHERS (NEW SECTION) */}
      <section id="community-cause" className="bg-[#122817] text-white py-16 lg:py-20 border-t border-[#23422A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#1B3821] text-[#A2C7A7] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#2B5433]">
                <HandHeart className="w-4 h-4" />
                Community Grain Bank Initiative
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                Good food shouldn't be a privilege. Together, we share the harvest.
              </h2>

              <p className="text-[#CFDBCF] text-base leading-relaxed">
                When you choose natural, unadulterated food from our collective, a portion of every rupee directly funds grain packets, nutrition milk, and cold-pressed cooking oils for underserved rural children and destitute families.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-emerald-800 text-emerald-300 mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">1 Order = 1 Nutrition Kit</h4>
                    <p className="text-xs text-[#B2C5B2] mt-0.5">Every cart value over ₹499 sends 1kg of fortified whole grain to community kitchens.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-emerald-800 text-emerald-300 mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Emergency Farmer Medical Contingency</h4>
                    <p className="text-xs text-[#B2C5B2] mt-0.5">2% of our gross revenue is retained in an interest-free emergency healthcare fund for our partner kisan families.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-emerald-800 text-emerald-300 mt-1">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Food Waste Distribution</h4>
                    <p className="text-xs text-[#B2C5B2] mt-0.5">Fresh produce that doesn't meet aesthetic cosmetic grading is delivered before nightfall to local shelters.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#122817] hover:bg-[#F2F0E8] font-bold text-xs uppercase tracking-wider transition shadow-md"
                >
                  Shop To Support A Family
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1B3821] p-6 border border-[#2B5433] rounded-xs space-y-2">
                <Wheat className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-serif font-bold text-white block">48,200 kg</span>
                <h4 className="text-sm font-bold text-emerald-200">Grains Distributed</h4>
                <p className="text-xs text-[#A2BAA2]">Donated to 14 rural tribal schools across Maharashtra and MP.</p>
              </div>

              <div className="bg-[#1B3821] p-6 border border-[#2B5433] rounded-xs space-y-2">
                <Users className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-serif font-bold text-white block">1,240+</span>
                <h4 className="text-sm font-bold text-emerald-200">Farmers Empowered</h4>
                <p className="text-xs text-[#A2BAA2]">Guaranteed minimum forward prices that protect against crop price crashes.</p>
              </div>

              <div className="bg-[#1B3821] p-6 border border-[#2B5433] rounded-xs space-y-2">
                <Award className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-serif font-bold text-white block">100%</span>
                <h4 className="text-sm font-bold text-emerald-200">Transparent Fund Audit</h4>
                <p className="text-xs text-[#A2BAA2]">Open-source monthly ledger accessible publicly with photos & farmer signatures.</p>
              </div>

              <div className="bg-[#1B3821] p-6 border border-[#2B5433] rounded-xs space-y-2">
                <Leaf className="w-8 h-8 text-emerald-400" />
                <span className="text-3xl font-serif font-bold text-white block">3,400 Acres</span>
                <h4 className="text-sm font-bold text-emerald-200">Chemical-Free Land</h4>
                <p className="text-xs text-[#A2BAA2]">Regenerative organic acreage restored to healthy, live soil.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}