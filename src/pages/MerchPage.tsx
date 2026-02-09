import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { ShoppingBag, Sparkles, ArrowRight, Star, Zap, Eye } from "lucide-react";
import { merchItems, type MerchItem } from "@/data/merch";

const FloatingParticles = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);
  const count = isMobile ? 6 : 15;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="floating-particle-optimized"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 4 + 6}s`,
          }}
        />
      ))}
    </div>
  );
};

const MerchCard = ({ item, index }: { item: MerchItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/merch/${item.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: "rgba(45, 27, 78, 0.5)",
          border: `1px solid ${isHovered ? item.accentColor + "80" : "rgba(255,27,159,0.15)"}`,
          boxShadow: isHovered
            ? `0 0 40px ${item.accentColor}30, 0 20px 60px rgba(0,0,0,0.5)`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* Badge */}
        {item.badge && (
          <div
            className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white"
            style={{
              background: `linear-gradient(135deg, ${item.accentColor}, ${item.accentColor}99)`,
              boxShadow: `0 0 20px ${item.accentColor}50`,
            }}
          >
            {item.badge}
          </div>
        )}

        {/* Quick view icon */}
        <div
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isHovered ? "rgba(255,255,255,0.15)" : "transparent",
            opacity: isHovered ? 1 : 0,
            backdropFilter: "blur(10px)",
          }}
        >
          <Eye className="w-4 h-4 text-white" />
        </div>

        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(180deg, transparent 40%, rgba(26,26,46,0.95) 100%)`,
              opacity: isHovered ? 0.9 : 0.7,
            }}
          />

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p
              className="text-[11px] font-bold tracking-[0.3em] uppercase mb-1"
              style={{ color: item.accentColor }}
            >
              {item.tagline}
            </p>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
              {item.name}
            </h3>
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-black"
                style={{ color: item.accentColor }}
              >
                ₹{item.price}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>

            {/* CTA that slides up on hover */}
            <div
              className="flex items-center gap-2 mt-3 transition-all duration-400"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <span className="text-xs font-semibold text-white/80 tracking-wider uppercase">
                View Details
              </span>
              <ArrowRight className="w-3 h-3 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MerchPage = () => {
  return (
    <>
      <Helmet>
        <title>Official Merch | ADWAITA 2026</title>
        <meta name="description" content="Shop the official ADWAITA 2026 merchandise collection. Limited edition futuristic streetwear — tees, hoodies, jackets & more." />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen concert-bg-animated">
        <Navbar />

        <main className="relative pt-20 pb-20 overflow-hidden">
          {/* Background layers */}
          <div className="fixed inset-0 concert-bg-animated -z-10" />
          <div className="fixed inset-0 tech-lines neon-grid -z-10 opacity-30" />
          <FloatingParticles />

          {/* Gradient orbs */}
          <div className="hidden md:block fixed top-[5%] right-[-5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-gradient-to-bl from-[#FF1B9F]/15 via-[#3D2862]/10 to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: "10s" }} />
          <div className="hidden md:block fixed bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-[#00FFD9]/10 via-transparent to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: "12s" }} />

          <div className="container mx-auto px-4 relative z-10">
            {/* Hero Section */}
            <div className="text-center pt-12 pb-16 stagger-fade-in">
              {/* Micro badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: "rgba(255,27,159,0.15)", border: "1px solid rgba(255,27,159,0.3)" }}>
                <Sparkles className="w-3.5 h-3.5 text-[#FF1B9F]" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#FF1B9F] uppercase">
                  Limited Edition Drop
                </span>
              </div>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  background: "linear-gradient(135deg, #FF1B9F 0%, #B44FFF 40%, #00FFD9 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                MERCH
              </h1>

              <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Wear the revolution. Own the night.
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-8 mt-8">
                {[
                  { icon: Zap, label: "UV Reactive", color: "#FF1B9F" },
                  { icon: Star, label: "Premium Quality", color: "#FFD700" },
                  { icon: ShoppingBag, label: "Limited Stock", color: "#00FFD9" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-xs text-gray-400 tracking-wider uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {merchItems.map((item, index) => (
                <MerchCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">
              <div className="glass-card inline-block rounded-2xl px-8 py-6" style={{ boxShadow: "0 0 40px rgba(255,27,159,0.1)" }}>
                <p className="text-gray-400 text-sm mb-1">Pick up your merch at</p>
                <p className="text-white font-bold text-lg">ADWAITA 2026 · Feb 12-14 · IGMCRI</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MerchPage;
