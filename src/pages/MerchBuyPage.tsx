import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import {
  ArrowLeft, ShoppingBag, Check, Star, Sparkles,
  ChevronRight, Shield, Truck, Zap,
} from "lucide-react";
import { merchItems } from "@/data/merch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const MerchBuyPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const item = useMemo(() => merchItems.find((m) => m.id === itemId), [itemId]);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      toast({ title: "Select a size", description: "Please choose a size to continue", variant: "destructive" });
      return;
    }
    if (!formData.name || !formData.phone) {
      toast({ title: "Missing details", description: "Please fill in your name and phone", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate order
    await new Promise((r) => setTimeout(r, 1500));
    setIsOrdered(true);
    setIsSubmitting(false);
  };

  if (isOrdered) {
    return (
      <>
        <Helmet><title>Order Confirmed | ADWAITA 2026 Merch</title></Helmet>
        <div className="min-h-screen concert-bg-animated">
          <Navbar />
          <main className="relative pt-20 pb-20 overflow-hidden">
            <div className="fixed inset-0 concert-bg-animated -z-10" />
            <div className="container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
              <div className="glass-card rounded-3xl p-8 md:p-12 max-w-lg w-full text-center stagger-fade-in" style={{ boxShadow: `0 0 60px ${item.accentColor}20` }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.accentColor}, #3D2862)` }}>
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Order Placed!</h2>
                <p className="text-gray-400 mb-6">Your {item.name} ({selectedSize}) will be ready for pickup at ADWAITA 2026</p>
                <div className="glass-card rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Item</span><span className="text-white">{item.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Size</span><span className="text-white">{selectedSize}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Qty</span><span className="text-white">{quantity}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold"><span className="text-gray-300">Total</span><span style={{ color: item.accentColor }}>₹{totalPrice}</span></div>
                </div>
                <p className="text-xs text-gray-500 mb-6">Payment to be made at the merch counter during the fest.</p>
                <Link
                  to="/merch"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${item.accentColor}, #3D2862)` }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

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

          {/* Gradient orbs */}
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

              {/* Right: Details + Form */}
              <div className="stagger-fade-in space-y-6">
                {/* Category */}
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

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black" style={{ color: item.accentColor }}>₹{item.price}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">{item.description}</p>

                {/* Features */}
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

                {/* Order form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="glass-card rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-gray-300 tracking-wider uppercase flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" style={{ color: item.accentColor }} />
                      Your Details
                    </h3>
                    <div>
                      <Label className="text-gray-400 text-xs">Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl input-glow"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Phone *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your phone number"
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl input-glow"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Email (optional)</Label>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl input-glow"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-black text-lg tracking-wide text-white relative overflow-hidden group transition-all duration-300 disabled:opacity-50 btn-morph"
                    style={{
                      background: `linear-gradient(135deg, ${item.accentColor}, #3D2862, ${item.accentColor === "#FF1B9F" ? "#00FFD9" : "#FF1B9F"})`,
                      backgroundSize: "200% 200%",
                      animation: "gradientShift 4s ease infinite",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Pre-Order · ₹{totalPrice}
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Pay at the merch counter · Pickup at ADWAITA 2026
                  </p>
                </form>

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
