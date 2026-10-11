import React, { useState, useRef, useEffect, useContext } from 'react';

import {

  ArrowRight, Star, Plus, ShieldCheck, Heart, ChevronRight, VolumeX, Volume2,

  Check, Leaf, Award, Users, HandHeart, Gift, Wheat, FlaskConical

} from 'lucide-react';

import { Link } from 'react-router-dom';

import Footer from '../components/Footer.jsx';

import Navbar from '../components/Nav.jsx';

import { GlobalContext } from '../context/Usecontext.jsx';

import Costume from '../services/costume.js';

/* Design tokens

   ink #0B1A12 · forest #17402A · leaf #3E7D52 · gold #C9A24A · champagne #E9D8A6 · mist #F1F4EC */

const CATEGORIES = [

  { id: 'all', name: 'All staples' },

  { id: 'dairy', name: 'Dairy & ghee' },

  { id: 'vegetables', name: 'Vegetables' },

  { id: 'fruits', name: 'Fruits' },

  { id: 'beverages', name: 'Juices' },

  { id: 'snacks', name: 'Pantry' }

];

const PRODUCTS = [

  { id: 1, name: 'A2 Gir Cow Farm Fresh Raw Milk', unit: '1 Litre Glass Bottle', category: 'dairy', price: 110, originalPrice: 130, rating: 4.9, reviews: 420, tag: 'Delivered by 6 AM', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80' },

  { id: 2, name: 'Naturally Ripened Ratnagiri Alphonso', unit: '1 Dozen (approx. 2.8kg)', category: 'fruits', price: 1250, originalPrice: 1499, rating: 5.0, reviews: 184, tag: 'GI Tagged', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80' },

  { id: 3, name: 'Stone-Ground Sharbati Whole Wheat Atta', unit: '5 kg Eco Cloth Bag', category: 'snacks', price: 340, originalPrice: null, rating: 4.8, reviews: 312, tag: 'Cold Milled', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80' },

  { id: 4, name: 'Hydroponic Tender Baby Spinach & Methi', unit: '250g Fresh Bundle', category: 'vegetables', price: 65, originalPrice: 85, rating: 4.7, reviews: 95, tag: 'Harvested Today', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80' },

  { id: 5, name: 'Wood Cold-Pressed Yellow Mustard Oil', unit: '1 Litre Tin', category: 'snacks', price: 285, originalPrice: 320, rating: 4.9, reviews: 512, tag: 'Kachi Ghani', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80' },

  { id: 6, name: 'Organic Desi Danedar Bilona Ghee', unit: '500ml Glass Jar', category: 'dairy', price: 890, originalPrice: null, rating: 5.0, reviews: 640, tag: 'Hand-Churned', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80' },

  { id: 7, name: 'Pesticide-Free Vine Tomatoes & Desi Kheera', unit: '1 kg Combo Pack', category: 'vegetables', price: 75, originalPrice: 95, rating: 4.6, reviews: 140, tag: 'Fresh Harvest', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80' },

  { id: 8, name: 'Crisp Royal Gala Apples (Himachal)', unit: '1 kg Pack (approx. 4-5 pcs)', category: 'fruits', price: 240, originalPrice: 280, rating: 4.8, reviews: 219, tag: 'Orchard Direct', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80' }

];

const VALUES = [

  { icon: HandHeart, title: 'No middleman cut', text: 'Up to 40% higher earnings, paid straight to the farmer.' },

  { icon: ShieldCheck, title: 'Native seed preservation', text: 'We protect heirloom seeds, heritage grains and desi cow breeds.' },

  { icon: Gift, title: 'School grain sharing', text: 'Surplus produce goes to neighbourhood midday meal kitchens.' }

];

const IMPACT = [

  { icon: Wheat, value: '48,200 kg', label: 'Grains distributed', text: 'Donated to 14 rural tribal schools across Maharashtra and MP.' },

  { icon: Users, value: '1,240+', label: 'Farmers empowered', text: 'Guaranteed minimum prices that protect against crop price crashes.' },

  { icon: Award, value: '100%', label: 'Transparent fund audit', text: 'A public monthly ledger with photos and farmer signatures.' },

  { icon: Leaf, value: '3,400 acres', label: 'Chemical-free land', text: 'Regenerative organic acreage restored to healthy, living soil.' }

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

    <main className="hp w-full bg-[#F1F4EC] text-[#0B1A12] antialiased selection:bg-[#C9A24A] selection:text-[#0B1A12]">

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');

        .hp { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }

        .hp .display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.025em; }

        .hp .gold-text { background: linear-gradient(120deg,#E9D8A6 0%,#C9A24A 55%,#E9D8A6 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .hp .grain::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.07; mix-blend-mode:overlay;

          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        .hp .no-scrollbar { scrollbar-width: none; }

        .hp .no-scrollbar::-webkit-scrollbar { display: none; }

        .hp a:focus-visible, .hp button:focus-visible { outline: 2px solid #C9A24A; outline-offset: 3px; }

        @keyframes hp-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

        .hp .rise { animation: hp-rise 1s cubic-bezier(.2,.7,.2,1) both; }

        .hp .rise-2 { animation-delay: .18s; }

        @media (prefers-reduced-motion: reduce) { .hp .rise { animation: none; } .hp * { transition-duration: .01ms !important; } }
        .hp { scroll-behavior: smooth; }
        .hp button, .hp a { -webkit-tap-highlight-color: transparent; }
        .hp button:active, .hp a:active { transform: scale(.985); }
        .hp #harvest-catalog article {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(11,26,18,.025);
          transition: transform .45s cubic-bezier(.2,.7,.2,1), box-shadow .45s ease, border-color .3s ease;
          border: 1px solid rgba(23,64,42,.045);
        }
        .hp #harvest-catalog article:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px -30px rgba(11,26,18,.34);
          border-color: rgba(201,162,74,.32);
        }
        .hp #harvest-catalog article img { will-change: transform; }
        .hp .premium-pill { box-shadow: 0 8px 24px -16px rgba(11,26,18,.25); }
        .hp .premium-surface { box-shadow: 0 22px 65px -42px rgba(11,26,18,.28); }
        @media (prefers-reduced-motion: reduce) {
          .hp { scroll-behavior: auto; }
          .hp #harvest-catalog article, .hp #harvest-catalog article img { transition: none !important; }
          .hp #harvest-catalog article:hover { transform: none; }
        }

      `}</style>

      <Navbar />

      {/* Ticker */}

      <div className="bg-[#0B1A12] text-[#E9D8A6] py-2.5 px-4 text-[13px] text-center flex items-center justify-center gap-2 border-b border-white/10">

        <HandHeart className="w-4 h-4 text-[#C9A24A] shrink-0" />

        <span><span className="font-semibold">One order shares one wholesome meal.</span> <span className="hidden sm:inline text-[#E9D8A6]/70">Every basket helps fund rations for rural primary schools.</span></span>

      </div>

      {/* HERO */}

      <section className="grain relative overflow-hidden bg-[#0B1A12] text-white pb-24 lg:pb-32">

        <div className="pointer-events-none absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full bg-[#17402A] blur-[120px] opacity-70" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 lg:pt-24">

          <div className="grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">

            <div className="lg:col-span-7 rise">

              <p className="inline-flex items-center gap-3 text-sm font-medium text-[#E9D8A6]">

                <span className="w-10 h-px bg-[#C9A24A]" />

                Soil to table, farmers paid fairly

              </p>

              <h1 className="display mt-6 text-[2.8rem] sm:text-6xl lg:text-[5rem] font-light leading-[1.02]">

                Groceries that feed your home and the <span className="gold-text italic">families who grow them.</span>

              </h1>

              <p className="mt-7 text-[#C5D3C8] text-lg max-w-xl leading-relaxed">

                Unadulterated Gir cow milk, stone-ground flours and zero-carbide vegetables, bought straight from Indian khets. No middlemen, so farmers earn a living rate.

              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">

                <Link

                  to="/shop"

                  className="group premium-pill inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C9A24A] hover:bg-[#D8B563] text-[#0B1A12] font-semibold text-[15px] transition-colors shadow-[0_18px_40px_-14px_rgba(201,162,74,0.7)]"

                >

                  Shop today's harvest

                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

                </Link>

                <Link

                  to="/community-cause"

                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-[15px] ring-1 ring-white/25 hover:bg-white/10 transition-colors"

                >

                  <Heart className="w-4 h-4 text-[#C9A24A]" />

                  Our community mission

                </Link>

              </div>

            </div>

            {/* Arch video */}

            <div className="lg:col-span-5 rise rise-2">

              <div className="relative max-w-md mx-auto lg:ml-auto">

                <div className="absolute -inset-3 rounded-t-[999px] rounded-b-[2.25rem] ring-1 ring-[#C9A24A]/40" />

                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] bg-[#0B1A12] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] group">

                  <video

                    ref={videoRef}

                    autoPlay

                    loop

                    muted

                    playsInline

                    webkit-playsinline="true"

                    preload="auto"

                    poster="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"

                    className="w-full h-full object-cover brightness-[0.9] group-hover:scale-105 transition-transform duration-[1400ms] ease-out"

                  >

                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />

                  </video>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A12]/90 via-transparent to-transparent pointer-events-none" />

                  <button

                    onClick={toggleMute}

                    aria-label="Toggle sound"

                    className="absolute top-[18%] right-[10%] inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-medium pl-2.5 pr-3 py-1.5 rounded-full ring-1 ring-white/25 transition cursor-pointer"

                  >

                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}

                    {isMuted ? 'Muted' : 'Sound on'}

                  </button>

                  <div className="absolute bottom-5 left-5 right-5">

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E9D8A6]">

                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A] animate-pulse" />

                      Live from the village mandi

                    </span>

                    <p className="display text-lg font-light leading-snug mt-1">Proceeds fund local irrigation and grain storage.</p>

                  </div>

                </div>

                <Link

                  to="/shop?category=produce"

                  className="group/basket absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] flex items-center justify-between gap-4 bg-white/95 backdrop-blur text-[#0B1A12] rounded-2xl px-5 py-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"

                >

                  <div>

                    <h4 className="text-[15px] font-semibold flex items-center gap-1">

                      Support a farming village basket

                      <ChevronRight className="w-4 h-4 text-[#3E7D52] transition-transform group-hover/basket:translate-x-0.5" />

                    </h4>

                    <p className="text-xs text-[#5E6D62] mt-0.5">Seasonal staples picked this morning</p>

                  </div>

                  <span className="display text-xl font-medium text-[#17402A]">₹480</span>

                </Link>

              </div>

            </div>

          </div>

          {/* Stats */}

          <dl className="mt-20 lg:mt-24 grid grid-cols-3 border-t border-white/10 divide-x divide-white/10">

            {[

              ['100%', 'Direct khet purchase'],

              ['1,200+', 'Farmer families supported'],

              ['35,000+', 'Meals shared to date']

            ].map(([n, l]) => (

              <div key={l} className="pt-7 px-3 sm:px-8 first:pl-0">

                <dt className="display text-3xl sm:text-5xl font-light gold-text">{n}</dt>

                <dd className="text-xs sm:text-sm text-[#A4B8A9] mt-2 leading-snug">{l}</dd>

              </div>

            ))}

          </dl>

        </div>

      </section>

      {/* VALUES, overlapping the hero */}

      <section className="relative -mt-10 max-w-7xl mx-auto px-5 sm:px-8">

        <div className="grid md:grid-cols-3 rounded-3xl bg-white shadow-[0_30px_70px_-35px_rgba(11,26,18,0.45)] ring-1 ring-[#17402A]/10 divide-y md:divide-y-0 md:divide-x divide-[#17402A]/10">

          {VALUES.map(({ icon: Icon, title, text }) => (

            <div key={title} className="flex gap-4 p-7">

              <span className="shrink-0 w-11 h-11 rounded-full bg-[#F4EBD0] text-[#7A5C14] flex items-center justify-center">

                <Icon className="w-5 h-5" />

              </span>

              <div>

                <h4 className="text-[15px] font-semibold">{title}</h4>

                <p className="text-sm text-[#5E6D62] mt-1 leading-relaxed">{text}</p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CATALOG */}

      <section id="harvest-catalog" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">

        <div className="max-w-2xl">

          <h2 className="display text-4xl sm:text-6xl font-light leading-[1.05]">Daily harvest and staples</h2>

          <p className="text-[#5E6D62] mt-4 text-lg">Picked at dawn, delivered by morning. Tap any product to see the full range.</p>

        </div>

        <div className="mt-10 mb-12 flex gap-8 overflow-x-auto no-scrollbar border-b border-[#17402A]/15 -mx-5 px-5 sm:mx-0 sm:px-0">

          {CATEGORIES.map(cat => (

            <button

              key={cat.id}

              onClick={() => setActiveCategory(cat.id)}

              className={`shrink-0 py-3.5 -mb-px text-[15px] font-semibold border-b-2 transition-colors cursor-pointer ${

                activeCategory === cat.id

                  ? 'border-[#C9A24A] text-[#0B1A12]'

                  : 'border-transparent text-[#7C8B80] hover:text-[#0B1A12]'

              }`}

            >

              {cat.name}

            </button>

          ))}

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">

          {filteredProducts.map((prod, idx) => {

            const pId = prod._id || prod.id || idx;

            const discount = prod.originalPrice && prod.originalPrice > prod.price

              ? Math.round((1 - prod.price / prod.originalPrice) * 100)

              : 0;

            return (

              <article key={pId} className="group flex flex-col bg-white rounded-[1.75rem] p-3 ring-1 ring-[#17402A]/[0.07] hover:shadow-[0_34px_60px_-34px_rgba(11,26,18,0.4)] transition-shadow duration-500">

                <Link

                  to="/shop"

                  title={`View ${prod.name} in shop`}

                  className="relative block aspect-square w-full overflow-hidden rounded-[1.25rem] bg-[#E6EBDF] cursor-pointer"

                >

                  <img

                    src={prod.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"}

                    alt={prod.name}

                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"

                    loading="lazy"

                  />

                  <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">

                    {prod.category && (

                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[#17402A] capitalize">

                        {prod.category}

                      </span>

                    )}

                    {discount > 0 && (

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#C9A24A] text-[#0B1A12]">

                        {discount}% off

                      </span>

                    )}

                  </div>

                  <button

                    type="button"

                    onClick={(e) => {

                      e.preventDefault();

                      e.stopPropagation();

                      toggleWishlist(prod);

                    }}

                    aria-label="Save to favorites"

                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur text-[#5E6D62] hover:text-red-500 transition cursor-pointer z-10"

                  >

                    <Heart className={`w-4 h-4 ${wishlist[pId] ? 'fill-red-500 text-red-500' : ''}`} />

                  </button>

                  {prod.tag && (

                    <span className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-[#0B1A12]/75 backdrop-blur text-[#E9D8A6]">

                      {prod.tag}

                    </span>

                  )}

                </Link>

                <div className="px-2 pt-4 pb-2 flex-1 flex flex-col">

                  <div className="flex items-center gap-1 text-[13px]">

                    <Star className="w-3.5 h-3.5 fill-[#C9A24A] text-[#C9A24A]" />

                    <span className="font-semibold">{prod.rating || 4.9}</span>

                    <span className="text-[#7C8B80]">({prod.reviews || 120})</span>

                  </div>

                  <Link

                    to="/shop"

                    className="display mt-1.5 text-[1.2rem] font-normal leading-snug hover:text-[#3E7D52] transition-colors line-clamp-2"

                  >

                    {prod.name}

                  </Link>

                  <p className="text-sm text-[#6B7A6F] mt-1 line-clamp-1">{prod.unit || prod.description || "Fresh harvest"}</p>

                  <div className="mt-auto pt-5 flex items-center justify-between">

                    <div className="flex items-baseline gap-2">

                      <span className="text-xl font-bold">₹{prod.price}</span>

                      {prod.originalPrice && (

                        <span className="text-sm text-[#9AA79D] line-through">₹{prod.originalPrice}</span>

                      )}

                    </div>

                    <button

                      type="button"

                      onClick={() => handleAddToCart(prod)}

                      className={`h-10 pl-3.5 pr-4 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 transition cursor-pointer text-white ${

                        addedItems[pId] ? 'bg-[#3E7D52]' : 'bg-[#17402A] hover:bg-[#0B1A12]'

                      }`}

                    >

                      {addedItems[pId] ? (

                        <><Check className="w-4 h-4" />Added</>

                      ) : (

                        <><Plus className="w-4 h-4" />Add</>

                      )}

                    </button>

                  </div>

                </div>

              </article>

            );

          })}

        </div>

        <div className="mt-16 text-center">

          <Link

            to="/shop"

            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full ring-1 ring-[#17402A]/30 hover:bg-[#17402A] hover:text-white text-[#17402A] font-semibold text-[15px] transition-colors"

          >

            Explore all 140+ farm staples

            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />

          </Link>

        </div>

      </section>

      {/* LAB TESTED */}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">

        <div className="relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-[#17402A]/10 shadow-[0_30px_70px_-40px_rgba(11,26,18,0.4)] grid lg:grid-cols-2 gap-10 p-7 sm:p-12 lg:p-16 items-center">

          <div>

            <span className="w-12 h-12 rounded-full bg-[#17402A] text-[#E9D8A6] flex items-center justify-center">

              <FlaskConical className="w-5 h-5" />

            </span>

            <h2 className="display mt-6 text-3xl sm:text-5xl font-light leading-[1.08]">Every batch is lab-tested. Read the report before you buy.</h2>

            <p className="mt-5 text-[#5E6D62] text-lg leading-relaxed max-w-lg">

              We publish independent results for purity, adulterants, antibiotics and bacteria, so you can see exactly what is in your milk.

            </p>

            <Link

              to="/lab-report"

              className="group mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#17402A] hover:bg-[#0B1A12] text-white font-semibold text-[15px] transition-colors"

            >

              View a sample lab report

              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

            </Link>

          </div>

          <div className="relative p-1.5 bg-white shadow-[0_30px_60px_-30px_rgba(11,26,18,0.5)] ring-1 ring-[#17402A]/10 rotate-[1.5deg] max-w-md w-full mx-auto lg:ml-auto">

            <div className="border border-[#C9A24A]/60 p-6">

              <p className="text-xs font-semibold text-[#9A7A2A]">Sample certificate of analysis</p>

              <p className="display text-xl mt-1">A2 Gir Cow Raw Milk</p>

              <dl className="mt-5 divide-y divide-[#17402A]/10 text-sm">

                {[['Milk fat', '4.45%'], ['Added water', '0.0%'], ['Antibiotics', 'Not detected'], ['Coliform count', 'Absent']].map(([k, v]) => (

                  <div key={k} className="flex items-center justify-between py-2.5">

                    <dt className="text-[#5E6D62]">{k}</dt>

                    <dd className="font-semibold flex items-center gap-1.5">{v}<Check className="w-4 h-4 text-[#3E7D52]" strokeWidth={3} /></dd>

                  </div>

                ))}

              </dl>

            </div>

          </div>

        </div>

      </section>

      {/* COMMUNITY CAUSE */}

      <section id="community-cause" className="grain relative bg-[#0B1A12] text-white overflow-hidden">

        <div className="pointer-events-none absolute -bottom-48 -left-32 w-[560px] h-[560px] rounded-full bg-[#17402A] blur-[120px] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32">

          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">

            <div className="lg:col-span-6">

              <h2 className="display text-4xl sm:text-5xl lg:text-[3.6rem] font-light leading-[1.06]">

                Good food shouldn't be a privilege. <span className="gold-text italic">Together, we share the harvest.</span>

              </h2>

              <p className="mt-7 text-[#C5D3C8] text-lg leading-relaxed max-w-xl">

                A portion of every rupee you spend funds grain packets, nutrition milk and cold-pressed oils for underserved rural children and families.

              </p>

              <ul className="mt-10 space-y-6 max-w-xl">

                {[

                  ['One order, one nutrition kit', 'Every cart over ₹499 sends 1kg of fortified whole grain to community kitchens.'],

                  ['Emergency farmer medical fund', '2% of gross revenue sits in an interest-free healthcare fund for our partner kisan families.'],

                  ['Zero food waste', 'Produce that misses cosmetic grading reaches local shelters before nightfall.']

                ].map(([t, d]) => (

                  <li key={t} className="flex gap-4">

                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#C9A24A] text-[#0B1A12] flex items-center justify-center">

                      <Check className="w-3.5 h-3.5" strokeWidth={3} />

                    </span>

                    <div>

                      <h4 className="font-semibold">{t}</h4>

                      <p className="text-sm text-[#A4B8A9] mt-1 leading-relaxed">{d}</p>

                    </div>

                  </li>

                ))}

              </ul>

              <Link

                to="/shop"

                className="group mt-11 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C9A24A] hover:bg-[#D8B563] text-[#0B1A12] font-semibold text-[15px] transition-colors"

              >

                Shop to support a family

                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

              </Link>

            </div>

            <div className="lg:col-span-6 lg:pl-6">

              <div className="grid sm:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden ring-1 ring-white/10">

                {IMPACT.map(({ icon: Icon, value, label, text }) => (

                  <div key={label} className="bg-[#0F2619] p-7 sm:p-8">

                    <Icon className="w-6 h-6 text-[#C9A24A]" />

                    <p className="display mt-6 text-4xl sm:text-[2.6rem] font-light gold-text leading-none">{value}</p>

                    <p className="mt-3 text-sm font-semibold text-[#E9D8A6]">{label}</p>

                    <p className="text-sm text-[#A4B8A9] mt-2 leading-relaxed">{text}</p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </main>

  );

}
