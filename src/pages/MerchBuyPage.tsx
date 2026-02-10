import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import {
  ArrowLeft, ShoppingBag, Check, Sparkles,
  ChevronRight, Shield, Truck, Zap,
} from "lucide-react";
import { merchItems } from "@/data/merch";
import { useToast } from "@/hooks/use-toast";
import { useMerchCart } from "@/contexts/MerchCartContext";

const MerchBuyPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, cartCount } = useMerchCart();

  const item = useMemo(() => merchItems.find((m) => m.id === itemId), [itemId]);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <div className="min-h-screen concert-bg-animated flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Item not found</h1>
          <Link to="/merch" className="text-[#00FFD9] hover:underline">← Back to Merch</Link>
        </div>
      </div>
    );
  }

  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Select a size", description: "Please choose a size to continue", variant: "destructive" });
      return;
    }
    addItem(item.id, selectedSize, quantity);
    toast({ title: "Added to cart!", description: `${item.name} (${selectedSize}) × ${quantity}` });
  };

  return (
    <>
      <Helmet>
        <title>{item.name} | ADWAITA 2026 Merch</title>
        <meta name="description" content={item.description} />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen concert-bg-animated">
        <Navbar />

        <main className="relative pt-20 pb-20 overflow-hidden">
          <div className="fixed inset-0 concert-bg-animated -z-10" />
          <div className="fixed inset-0 tech-lines neon-grid -z-10 opacity-20" />

          <div className="hidden md:block fixed top-[10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-3xl -z-5 animate-pulse" style={{ background: `${item.accentColor}10`, animationDuration: "10s" }} />

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 pt-6 pb-8 text-sm">
              <Link to="/merch" className="text-gray-400 hover:text-[#00FFD9] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Merch
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-white">{item.name}</span>
            </div>

            {/* Product layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
              {/* Left: Image */}
              <div className="stagger-fade-in">
                <div
                  className="relative rounded-3xl overflow-hidden aspect-[3/4]"
                  style={{
                    border: `1px solid ${item.accentColor}30`,
                    boxShadow: `0 0 60px ${item.accentColor}15`,
                  }}
                >
                  {item.badge && (
                    <div
                      className="absolute top-5 left-5 z-10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white"
                      style={{ background: `linear-gradient(135deg, ${item.accentColor}, ${item.accentColor}99)`, boxShadow: `0 0 20px ${item.accentColor}50` }}
                    >
                      {item.badge}
                    </div>
                  )}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(26,26,46,0.6) 100%)" }} />
                </div>
              </div>

              {/* Right: Details */}
              <div className="stagger-fade-in space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: `${item.accentColor}15`, border: `1px solid ${item.accentColor}30` }}>
                  <Sparkles className="w-3 h-3" style={{ color: item.accentColor }} />
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: item.accentColor }}>{item.category}</span>
                </div>

                <div>
                  <h1
                    className="text-4xl md:text-5xl font-black tracking-tight mb-1"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      background: `linear-gradient(135deg, #fff 0%, ${item.accentColor} 100%)`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {item.name}
                  </h1>
                  <p className="text-gray-400 text-sm tracking-wider uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {item.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black" style={{ color: item.accentColor }}>₹{item.price}</span>
                </div>

                <p className="text-gray-300 leading-relaxed">{item.description}</p>

                <div className="grid grid-cols-2 gap-2">
                  {item.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.accentColor }} />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Size selector */}
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-3 block tracking-wider uppercase">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {item.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                        style={{
                          background: selectedSize === size ? item.accentColor : "rgba(255,255,255,0.05)",
                          color: selectedSize === size ? "#1A1A2E" : "#aaa",
                          border: `1px solid ${selectedSize === size ? item.accentColor : "rgba(255,255,255,0.1)"}`,
                          boxShadow: selectedSize === size ? `0 0 20px ${item.accentColor}40` : "none",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-bold text-gray-300 mb-3 block tracking-wider uppercase">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white font-bold text-lg hover:border-white/30 transition-all">−</button>
                    <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(5, quantity + 1))} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white font-bold text-lg hover:border-white/30 transition-all">+</button>
                    {quantity > 1 && (
                      <span className="text-sm text-gray-500 ml-2">Total: <span style={{ color: item.accentColor }} className="font-bold">₹{totalPrice}</span></span>
                    )}
                  </div>
                </div>

                {/* Add to Cart + Go to Checkout */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-2xl font-black text-lg tracking-wide text-white relative overflow-hidden group transition-all duration-300 btn-morph"
                    style={{
                      background: `linear-gradient(135deg, ${item.accentColor}, #3D2862, ${item.accentColor === "#FF1B9F" ? "#00FFD9" : "#FF1B9F"})`,
                      backgroundSize: "200% 200%",
                      animation: "gradientShift 4s ease infinite",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart · ₹{totalPrice}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {cartCount > 0 && (
                    <Link
                      to="/merch/checkout"
                      className="block w-full py-3 rounded-xl text-center text-sm font-bold tracking-widest uppercase transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee" }}
                    >
                      Go to Checkout ({cartCount} items)
                    </Link>
                  )}
                </div>

                <p className="text-center text-xs text-gray-500">
                  Pay online · Pickup at ADWAITA 2026
                </p>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-6 pt-4">
                  {[
                    { icon: Shield, label: "Secure" },
                    { icon: Truck, label: "On-site Pickup" },
                    { icon: Zap, label: "Limited Stock" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MerchBuyPage;
