import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Helmet } from "react-helmet";
import { merchItems } from "@/data/merch";
import hoodieOutside from "@/assets/merch-hoodie-outside.png";
import { ShoppingBag, Loader2, Instagram, Phone, Info } from "lucide-react";
import { useMerchCart } from "@/contexts/MerchCartContext";
import vinceOutletsLogo from "@/assets/vince-outlets-logo.jpeg";

const MerchPage = () => {
  const { cartCount } = useMerchCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allSrcs = [hoodieOutside, ...merchItems.slice(1).map(m => m.image)];
    let loaded = 0;
    const total = allSrcs.length;

    const checkDone = () => {
      loaded++;
      if (loaded >= total) setIsLoading(false);
    };

    allSrcs.forEach(src => {
      const img = new Image();
      img.src = typeof src === 'string' ? src : src;
      if (img.complete) {
        checkDone();
      } else {
        img.onload = checkDone;
        img.onerror = checkDone;
      }
    });

    const timer = setTimeout(() => setIsLoading(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const heroItem = merchItems[0];
  const gridItems = merchItems.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#0d041a" }}>
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(34,211,238,0.3)" }}>
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#22d3ee" }} />
          </div>
        </div>
        <p className="text-xs font-bold tracking-[0.4em] uppercase animate-pulse"
          style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee" }}>
          LOADING RELICS
        </p>
      </div>
    );
  }

  const displayNames: Record<string, { line1: string; line2: string; subtitle?: string }> = {
    "hoodie-unisex": { line1: "HOODIE", line2: "", subtitle: "Unisex" },
    "sweatshirt-unisex": { line1: "SWEAT", line2: "SHIRT", subtitle: "Unisex" },
    "oversized-tshirt": { line1: "OVERSIZED", line2: "T-SHIRT", subtitle: "Unisex" },
    "regularfit-tshirt": { line1: "REGULAR FIT", line2: "T-SHIRT" },
    "crop-top": { line1: "CROP", line2: "TOP" },
  };

  const typeColors = ["#ec4899", "#22d3ee", "#8b5cf6", "#ec4899"];

  return (
    <>
      <Helmet>
        <title>Official Merch | ADWAITA 2026</title>
        <meta name="description" content="Shop the official ADWAITA 2026 merchandise collection. Limited edition futuristic streetwear." />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: "#0d041a", color: "#e2e8f0" }}>
        <Navbar />

        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="fixed top-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full blur-[120px] z-0" style={{ background: "rgba(139,92,246,0.3)" }} />
        <div className="fixed bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[150px] z-0" style={{ background: "rgba(236,72,153,0.2)" }} />

        {/* Particles */}
        {[10, 40, 70, 90].map((top, i) => (
          <div key={i} className="fixed w-[2px] h-[2px] bg-white rounded-full pointer-events-none opacity-30 z-0"
            style={{ top: `${top}%`, left: `${[20, 80, 15, 60][i]}%` }}
          />
        ))}

        <main className="relative z-10 px-5 pt-24 pb-32 space-y-12 max-w-2xl mx-auto">

          {/* Page Title */}
          <section className="text-center space-y-3 pt-4">
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase" style={{ color: "#22d3ee", fontFamily: "'Syncopate', sans-serif" }}>
              ADWAITA'26 — OFFICIAL
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Syncopate', sans-serif" }}>
              RELICS
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: "#94a3b8" }}>
              Wear the legacy. Each piece is forged in the spirit of the phoenix — where ancient mysticism meets modern craft.
            </p>
            <div className="w-24 h-[1px] mx-auto" style={{ background: "linear-gradient(to right, transparent, #22d3ee, transparent)" }} />
          </section>

          {/* Hero Card — Hoodie */}
          <section className="relative">
            <div
              className="rounded-[2.5rem] overflow-hidden relative"
              style={{
                background: "rgba(25,10,50,0.45)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 30px rgba(34,211,238,0.2), inset 0 0 20px rgba(139,92,246,0.1)",
              }}
            >
              {/* Glitch border glow */}
              <div className="absolute -inset-[2px] -z-10 rounded-[2.5rem] opacity-50 blur-[5px]"
                style={{ background: "linear-gradient(45deg, #22d3ee, transparent, #ec4899)" }}
              />


              <div className="relative py-6 px-6 flex flex-col items-center">
                <img
                  alt={heroItem.name}
                  src={hoodieOutside}
                  loading="eager"
                  className="w-[120%] max-w-none h-auto object-contain relative z-10"
                  style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8))" }}
                />



                {/* Info + CTA */}
                <div className="mt-8 w-full space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                        {displayNames[heroItem.id]?.line1}
                      </h3>
                      <p className="text-xs tracking-widest uppercase" style={{ color: "#94a3b8" }}>
                        {displayNames[heroItem.id]?.subtitle}
                      </p>
                    </div>
                    <p className="text-3xl font-bold" style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee", textShadow: "0 0 8px rgba(34,211,238,0.6)" }}>
                      ₹{heroItem.price}
                    </p>
                  </div>
                  <Link
                    to={`/merch/${heroItem.id}`}
                    className="block w-full py-5 rounded-xl text-white text-xs font-bold tracking-[0.3em] uppercase text-center transition-all duration-300 hover:scale-[0.98] active:scale-95"
                    style={{
                      fontFamily: "'Syncopate', sans-serif",
                      background: "linear-gradient(90deg, #111, #222)",
                      border: "1px solid #22d3ee",
                      boxShadow: "0 0 15px rgba(34,211,238,0.3)",
                    }}
                  >
                    ACQUIRE
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Cards */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-12">
            {gridItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              const typeNum = String(index + 2).padStart(2, "0");
              const typeColor = typeColors[index] || "#8b5cf6";
              const names = displayNames[item.id];

              return (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-[2rem] ${isLeft ? "mt-4" : "-translate-y-4"}`}
                  style={{
                    background: "rgba(25,10,50,0.45)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transform: `perspective(1000px) rotateY(${isLeft ? "8deg" : "-8deg"}) rotateX(4deg) ${!isLeft ? "translateY(-1rem)" : ""}`,
                  }}
                >
                  {/* Type label */}
                  <div className={`absolute -top-6 z-20 ${isLeft ? "-left-2" : "-right-2 text-right"}`}>
                    <span
                      className="text-[8px] font-bold tracking-widest uppercase px-2 py-1"
                      style={{
                        fontFamily: "'Syncopate', sans-serif",
                        color: typeColor + "cc",
                        background: "rgba(13,4,26,0.8)",
                        border: `1px solid ${typeColor}4d`,
                      }}
                    >
                      {typeNum}. TYPE
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative h-52 mb-4 flex items-center justify-center">
                    <img
                      alt={item.name}
                      src={item.image}
                      loading="eager"
                      className={`max-w-none object-contain ${item.id === 'sweatshirt-unisex' ? 'h-[110%]' : 'h-[110%]'}`}
                      style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.5))", background: "transparent" }}
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <h4
                      className="text-[11px] font-bold text-white uppercase leading-tight"
                      style={{ fontFamily: "'Syncopate', sans-serif" }}
                    >
                      {names?.line1}<br />{names?.line2}
                    </h4>
                    <p className="text-[9px] tracking-widest uppercase" style={{ color: "#94a3b8" }}>
                      {item.tagline}
                    </p>
                    <p className="text-xl font-bold" style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee", textShadow: "0 0 8px rgba(34,211,238,0.6)" }}>
                      ₹{item.price}
                    </p>
                    <Link
                      to={`/merch/${item.id}`}
                      className="block w-full py-3 rounded-lg text-[9px] font-bold uppercase tracking-widest text-center text-white transition-all duration-300 hover:scale-[0.98] active:scale-95 active:text-black"
                      style={{
                        background: "linear-gradient(90deg, #111, #222)",
                        border: "1px solid #22d3ee",
                        boxShadow: "0 0 15px rgba(34,211,238,0.3)",
                      }}
                    >
                      ACQUIRE
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Collection Notice */}
          <div className="mt-12 rounded-2xl p-5 md:p-6 max-w-2xl mx-auto"
            style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#22d3ee" }} />
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#22d3ee", fontFamily: "'Syncopate', sans-serif" }}>
                  IMPORTANT
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}>
                  If your ordered size is available, you can <span className="font-bold" style={{ color: "#22d3ee" }}>collect it on the day of order</span>.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}>
                  If not, the merchandise can be collected <span className="font-bold" style={{ color: "#22d3ee" }}>3 days after booking</span> from the <span className="font-bold" style={{ color: "#22d3ee" }}>Registration Desk</span> by showing your order copy / payment proof.
                </p>
              </div>
            </div>
          </div>

          {/* Queries Contact */}
          <div className="mt-12 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl mx-auto"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#22d3ee" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "#64748b", fontFamily: "'Syncopate', sans-serif" }}>Queries</span>
            <span className="w-[1px] h-4" style={{ background: "rgba(255,255,255,0.15)" }} />
            <a href="https://wa.me/919345831990" target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity"
              style={{ color: "#22d3ee", fontFamily: "'Space Grotesk', sans-serif" }}>
              Lalithkumar — +91 93458 31990
            </a>
          </div>

          {/* Merchandise Partner */}
          <div className="py-20 flex flex-col items-center text-center space-y-5">
            <div className="w-24 h-[1px]" style={{ background: "linear-gradient(to right, transparent, #22d3ee, transparent)" }} />
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase" style={{ color: "#64748b", fontFamily: "'Syncopate', sans-serif" }}>
              MERCHANDISE PARTNER
            </p>
            <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/10"
              style={{ background: "rgba(25,10,50,0.6)", boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}>
              <img src={vinceOutletsLogo} alt="Vince Outlets" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Syncopate', sans-serif" }}>
              VINCE OUTLETS
            </h3>
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#94a3b8", fontFamily: "'Space Grotesk', sans-serif" }}>Wear Awesome</p>
            <a
              href="https://www.instagram.com/vince_outlets/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium tracking-wide transition-colors hover:opacity-80"
              style={{ color: "#22d3ee", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Instagram className="w-4 h-4" />
              @vince_outlets
            </a>
            <div className="w-24 h-[1px] mt-2" style={{ background: "linear-gradient(to right, transparent, #22d3ee, transparent)" }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mt-4" style={{ color: "#3f3f5a", fontFamily: "'Syncopate', sans-serif" }}>
              © ADWAITA 26 · IGMCRI
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default MerchPage;
