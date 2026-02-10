import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { merchItems } from "@/data/merch";
import hoodieOutside from "@/assets/merch-hoodie-outside.png";
import { Zap } from "lucide-react";

const MerchPage = () => {
  const heroItem = merchItems[0]; // Hoodie
  const gridItems = merchItems.slice(1);

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

          {/* Bottom section */}
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-[1px]" style={{ background: "linear-gradient(to right, transparent, #22d3ee, transparent)" }} />
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase" style={{ color: "#64748b" }}>
              Secured Transaction
            </p>
            <h3 className="text-xl font-bold text-white opacity-40 italic" style={{ fontFamily: "'Syncopate', sans-serif" }}>
              ADWAITA LEGACY 2026
            </h3>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MerchPage;
