import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  Compass, 
  Wheat, 
  Sprout, 
  ShieldCheck, 
  Sun,
  Droplets
} from 'lucide-react';
import Navbar from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';

const MILESTONES = [
  {
    year: '2019',
    tag: 'The Seed',
    title: 'A Broken Mandi System',
    description: 'Witnessing 40% crop wastage and predatory middleman commissions across western Maharashtra, we rented our first shared tractor and partnered with 7 smallholder kisan families.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80',
    stats: '7 Pioneer Farmers'
  },
  {
    year: '2021',
    tag: 'Desi Revival',
    title: 'Reviving A2 Indigenous Herds & Bilona',
    description: 'We rescued 40 Gir cows from abandoned crossbreeding clusters and re-established classical Vedic curd-churning (Bilona) using clay pots and slow neem-wood fires.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80',
    stats: '100% Native Gir Breeds'
  },
  {
    year: '2023',
    tag: 'The Cold Chain',
    title: 'Sunrise Zero-Loss Cold Network',
    description: 'Launched our decentralized farm-gate sorting pods. Vegetables harvested at 4:30 AM now reach metropolitan doorsteps untouched by chemical preservatives before 7:00 AM.',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=80',
    stats: '2.5 Hour Farm-to-Door'
  },
  {
    year: 'Today',
    tag: 'The Collective',
    title: '3,400 Living Acres & Community Bank',
    description: 'A growing federation of 1,200+ family growers who dictate their own fair floor prices, with 1 meal gifted to rural schools for every basket delivered.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
    stats: '1,200+ Kisan Families'
  }
];

const VALUES = [
  {
    icon: <Sprout className="w-6 h-6" />,
    title: 'Microbial Soil Vitality',
    text: 'We never treat soil like dirt. Our farms nourish living mycelium with fermented jeevamrit and cow dung manure, skipping synthetic NPK fertilizers forever.'
  },
  {
    icon: <Sun className="w-6 h-6" />,
    title: 'Zero Carbide Tolerance',
    text: 'Every fruit ripens strictly on trees or packed in airy paddy straw. No artificial ethylene gas or toxic calcium carbide chambers.'
  },
  {
    icon: <Droplets className="w-6 h-6" />,
    title: 'Cold Wooden Extraction',
    text: 'Our kachi ghani mustard, groundnut, and sesame oils are extracted beneath 42°C in ancient sal wood presses to protect delicate vitamin E bonds.'
  },
  {
    icon: <Wheat className="w-6 h-6" />,
    title: 'Community Grain Security',
    text: 'Every cart above ₹499 sends 1kg of stone-milled whole grain to community nutritional kitchens for underserved children in farming belts.'
  }
];

export default function OurStory() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState(0);

  // Initialize and handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

      const updateProgress = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      video.addEventListener('timeupdate', updateProgress);
      return () => video.removeEventListener('timeupdate', updateProgress);
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <main className="w-full bg-[#FAF9F5] text-[#1D211D] font-sans antialiased selection:bg-[#1B3821] selection:text-white">
      <Navbar />

      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden border-b border-[#E6E2D8]">
        <div className="absolute inset-0 bg-[radial-gradient(#27452D_1px,transparent_1px)] opacity-[0.04] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#EEF2E8] border border-[#D5DEC9] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#214328]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Rooted In The Soil Since 2019
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#141814] tracking-tight leading-[1.08]">
            Honoring the hands that till the morning soil.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5A635B] font-normal leading-relaxed">
            We began with a simple disgust for store-bought "fresh" food that tasted like cardboard and paid farmers pennies. Here is how an open-hearted kisan cooperative turned into your morning table.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-wider text-[#69726A]">
            <span>Maharashtra</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3821]" />
            <span>Madhya Pradesh</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B3821]" />
            <span>Himachal Foothills</span>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC KHETI (ORGANIC FARMING) VIDEO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20 pb-20">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#121612] border-4 sm:border-8 border-white shadow-[0_25px_60px_-15px_rgba(20,30,20,0.25)] group">
          
          {/* Main Video */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <video
              ref={videoRef}
              loop
              playsInline
              webkit-playsinline="true"
              poster="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
              className="w-full h-full object-cover brightness-[0.95] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-102"
            >
              {/* High-definition, relaxing organic countryside / farming video stream */}
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                type="video/mp4"
              />
            </video>

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Top Floating Badges */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md text-[#D8EADB] border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vedic Kheti In Action • Raigad Belt
              </span>
            </div>

            {/* Video Interactive Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col gap-3">
              
              {/* Scrub Line */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-xs">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-200" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause film' : 'Play film'}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#122817] flex items-center justify-center transition duration-200 shadow-md hover:scale-105 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono tracking-wider transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                    <span className="hidden sm:inline">{isMuted ? 'Sound Muted (Tap to hear flute & birds)' : 'Acoustic Melody Playing'}</span>
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#B4D7B8] block">Documentary Film</span>
                  <span className="text-xs sm:text-sm font-serif font-light text-white/90">The 4:00 AM Harvest Cycle</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOUNDERS' LETTER / ETHOS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white border border-[#E8E4D9] p-8 sm:p-14 shadow-xs relative">
          <div className="absolute -top-4 left-10 bg-[#1B3821] text-white px-4 py-1 text-[11px] font-mono uppercase tracking-widest font-semibold">
            Our Declaration
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#141814] leading-snug">
              "We didn't set out to build an e-commerce giant. We wanted to eat milk and wheat that felt like our grandmother's courtyard."
            </h2>

            <div className="grid sm:grid-cols-2 gap-8 text-[#545E54] text-sm sm:text-base leading-relaxed pt-2">
              <p>
                In standard commercial chains, vegetables sit through three wholesale brokers, two sorting sheds, and chemical ethylene misting chambers before sitting on a supermarket rack. By the time they enter your soup, the live prana has vanished.
              </p>
              <p>
                We bypassed the APMC monopoly completely. We established direct cooperative ties with multi-generational cultivators who practice multi-cropping, save open-pollinated desi seeds, and refuse synthetic pesticides.
              </p>
            </div>

            <div className="pt-6 border-t border-[#EAE6DD] flex items-center justify-between">
              <div>
                <span className="block font-serif font-bold text-[#1B3821] text-base">The Farmer-Consumer Council</span>
                <span className="text-xs text-[#7B857B]">Maharashtra & Malwa Organic Farming Guild</span>
              </div>
              <div className="w-20 sm:w-28 opacity-60">
                {/* Visual Stamp Icon */}
                <div className="border-2 border-dashed border-[#1B3821] rounded-full p-2 text-center text-[9px] font-mono uppercase font-bold text-[#1B3821] rotate-[-6deg]">
                  Authentic Khet
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHAPTER CHRONICLE (INTERACTIVE TIMELINE) */}
      <section className="py-16 sm:py-24 bg-[#F4F2EC] border-y border-[#E6E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1B3821] font-bold">The Journey</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#161B16] mt-1">From 7 Khets to a Food Movement</h2>
            <p className="text-sm sm:text-base text-[#626C62] mt-2">
              Explore how each milestone pushed us deeper into indigenous regeneration and farmer autonomy.
            </p>
          </div>

          {/* Milestone Tabs */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Nav */}
            <div className="lg:col-span-5 space-y-3">
              {MILESTONES.map((m, idx) => {
                const isActive = activeMilestone === idx;
                return (
                  <button
                    key={m.year}
                    onClick={() => setActiveMilestone(idx)}
                    className={`w-full text-left p-5 transition-all duration-300 border rounded-xs cursor-pointer flex flex-col gap-1 ${
                      isActive 
                        ? 'bg-white border-[#1B3821] shadow-md translate-x-2' 
                        : 'bg-[#ECE9E0]/70 hover:bg-white/80 border-[#DDD8CB] text-[#555E55]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono uppercase tracking-wider font-bold ${isActive ? 'text-[#1B3821]' : 'text-[#848E84]'}`}>
                        {m.year} • {m.tag}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-[#F2EFE8] text-[#1B3821] font-semibold">
                        {m.stats}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#161B16] mt-1">
                      {m.title}
                    </h3>
                  </button>
                );
              })}
            </div>

            {/* Right Display Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-[#DDD8CB] p-4 sm:p-6 shadow-md transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100 mb-6">
                  <img
                    src={MILESTONES[activeMilestone].image}
                    alt={MILESTONES[activeMilestone].title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#1B3821] text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">
                    Chapter {activeMilestone + 1}
                  </div>
                </div>

                <div className="space-y-3 px-2">
                  <h4 className="text-2xl font-serif font-bold text-[#161B16]">
                    {MILESTONES[activeMilestone].title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#525B52] leading-relaxed">
                    {MILESTONES[activeMilestone].description}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOUR PILLARS OF SOIL HEALTH */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1B3821] font-bold">Uncompromising Code</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141814]">How We Protect Every Single Grain</h2>
          <p className="text-sm text-[#616B61]">Every item in your delivery sack adheres to our four non-negotiable guidelines.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#E5E1D6] p-7 flex flex-col justify-between hover:border-[#1B3821] transition-all duration-300 hover:shadow-lg group"
            >
              <div>
                <div className="w-12 h-12 rounded-xs bg-[#EEF2E8] text-[#1B3821] flex items-center justify-center mb-6 group-hover:bg-[#1B3821] group-hover:text-white transition-colors duration-300">
                  {val.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-[#161B16] mb-3 leading-snug">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#616A61] leading-relaxed">
                  {val.text}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F2EFE8] flex items-center gap-1.5 text-xs font-bold text-[#1B3821] tracking-wider uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Compromise</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#1B3821] text-white p-8 sm:p-14 border border-[#142A19] relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#254A2D] text-[#BDE2C2] px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              Taste The Real Living Harvest
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Ready to taste real cow milk and chemical-free vegetables?
            </h2>

            <p className="text-[#CFDACF] text-sm sm:text-base leading-relaxed">
              Every morning delivery helps 1,200+ rural farm hands reclaim dignity and restores indigenous Indian soils to chemical-free life.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="/shop"
                className="px-8 py-4 bg-white text-[#162E1B] hover:bg-[#F2EFE8] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
              >
                Explore The Morning Harvest
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/shop?category=produce"
                className="px-6 py-4 border border-[#3E6545] text-white hover:bg-[#25462D] font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                See Seasonal Price Board
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}