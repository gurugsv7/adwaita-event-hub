import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, ShoppingBag, Trash2, Upload, CheckCircle2, Loader2, IndianRupee, Minus, Plus, QrCode } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMerchCart } from "@/contexts/MerchCartContext";
import { supabase } from "@/integrations/supabase/client";
import paymentQR from "@/assets/payment-qr.jpg";
import { sendMerchOrderEmail } from "@/lib/emailService";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const MerchCheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, removeItem, updateQuantity, clearCart, cartTotal, cartCount } = useMerchCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <>
        <Helmet><title>Cart Empty | ADWAITA 2026 Merch</title></Helmet>
        <div className="min-h-screen" style={{ backgroundColor: "#0d041a", color: "#e2e8f0" }}>
          <Navbar />
          <main className="relative z-10 pt-28 pb-32 flex flex-col items-center justify-center min-h-[70vh] px-5">
            <ShoppingBag className="w-16 h-16 mb-4" style={{ color: "#22d3ee" }} />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Syncopate', sans-serif" }}>Cart is Empty</h2>
            <p className="mb-6" style={{ color: "#94a3b8" }}>Add some merch to your cart first!</p>
            <Link
              to="/merch"
              className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white"
              style={{ background: "linear-gradient(90deg, #111, #222)", border: "1px solid #22d3ee" }}
            >
              Browse Merch
            </Link>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "File too large", description: "Please upload an image smaller than 4MB", variant: "destructive" });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const validateForm = () => {
    if (!name.trim()) { toast({ title: "Missing info", description: "Please enter your name", variant: "destructive" }); return false; }
    if (!phone.trim()) { toast({ title: "Missing info", description: "Please enter your phone number", variant: "destructive" }); return false; }
    if (!email.trim()) { toast({ title: "Missing info", description: "Please enter your email", variant: "destructive" }); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { toast({ title: "Invalid email", description: "Please enter a valid email", variant: "destructive" }); return false; }
    if (!institution.trim()) { toast({ title: "Missing info", description: "Please enter your institution", variant: "destructive" }); return false; }
    if (!paymentScreenshot) { toast({ title: "Payment screenshot required", description: "Please upload your payment screenshot", variant: "destructive" }); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const newOrderId = `MERCH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Upload payment screenshot
      let paymentScreenshotUrl: string | null = null;
      if (paymentScreenshot) {
        const fileExt = paymentScreenshot.name.split('.').pop();
        const fileName = `${newOrderId}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('payment-screenshots').upload(fileName, paymentScreenshot);
        if (uploadError) throw new Error('Failed to upload payment screenshot');
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        paymentScreenshotUrl = `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${fileName}`;
      }

      // Save to database
      const orderItems = cartItems.map(ci => ({
        itemId: ci.itemId,
        name: ci.name,
        size: ci.size,
        quantity: ci.quantity,
        price: ci.price,
      }));

      const { error } = await supabase.from('merch_orders').insert({
        order_id: newOrderId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        institution: institution.trim(),
        items: orderItems,
        total_amount: cartTotal,
        payment_screenshot_url: paymentScreenshotUrl,
      });

      if (error) throw error;

      setOrderId(newOrderId);
      setIsSuccess(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Non-blocking email
      try {
        sendMerchOrderEmail({
          orderId: newOrderId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          institution: institution.trim(),
          items: orderItems,
          totalAmount: cartTotal,
          payment_screenshot_url: paymentScreenshotUrl || undefined,
        }).catch(() => {});
      } catch (e) { /* ignore */ }

      toast({ title: "Order placed!", description: `Your order ID is ${newOrderId}` });
    } catch (error: any) {
      console.error('Order error:', error);
      toast({ title: "Order failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <>
        <Helmet><title>Order Confirmed | ADWAITA 2026 Merch</title></Helmet>
        <div className="min-h-screen" style={{ backgroundColor: "#0d041a", color: "#e2e8f0" }}>
          <Navbar />
          <main className="relative z-10 pt-28 pb-32 px-5 max-w-lg mx-auto">
            <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(25,10,50,0.6)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Syncopate', sans-serif" }}>Order Placed!</h2>
              <p className="mb-6" style={{ color: "#94a3b8" }}>Your merch order has been registered successfully.</p>
              <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(34,211,238,0.2)" }}>
                <p className="text-sm mb-1" style={{ color: "#94a3b8" }}>Your Order ID</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee" }}>{orderId}</p>
              </div>
              <p className="text-xs mb-6" style={{ color: "#64748b" }}>
                Please save this ID for reference. Collect your merch at ADWAITA 2026.
              </p>
              <Link
                to="/merch"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
              >
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </Link>
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
        <title>Checkout | ADWAITA 2026 Merch</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen" style={{ backgroundColor: "#0d041a", color: "#e2e8f0" }}>
        <Navbar />

        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <main className="relative z-10 px-5 pt-24 pb-32 max-w-3xl mx-auto">
          {/* Back */}
          <Link to="/merch" className="inline-flex items-center gap-2 text-sm mb-8" style={{ color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Merch
          </Link>

          <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: "'Syncopate', sans-serif" }}>CHECKOUT</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cart Items */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(25,10,50,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: "#22d3ee", fontFamily: "'Syncopate', sans-serif" }}>
                Your Cart ({cartCount} items)
              </h2>
              <div className="space-y-4">
                {cartItems.map((ci, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-xl p-3" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <img src={ci.image} alt={ci.name} className="w-16 h-16 object-contain rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{ci.name}</p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>Size: {ci.size}</p>
                      <p className="text-sm font-bold" style={{ color: "#22d3ee" }}>₹{ci.price * ci.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(index, ci.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="text-sm font-bold text-white w-5 text-center">{ci.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(index, ci.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(index)} className="p-2 rounded-lg hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Total */}
              <div className="mt-4 pt-4 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="font-bold text-white">Total</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee" }}>₹{cartTotal}</span>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(25,10,50,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: "#22d3ee", fontFamily: "'Syncopate', sans-serif" }}>
                Your Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Full Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Phone *</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Email *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs" style={{ color: "#94a3b8" }}>Institution *</Label>
                  <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Your college/university"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(25,10,50,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: "#22d3ee", fontFamily: "'Syncopate', sans-serif" }}>
                <IndianRupee className="w-4 h-4" /> Payment
              </h2>

              <div className="rounded-xl p-4 mb-4 flex justify-between items-center" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                <span style={{ color: "#94a3b8" }}>Amount to Pay</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Syncopate', sans-serif", color: "#22d3ee" }}>₹{cartTotal}</span>
              </div>

              <div className="rounded-xl p-6 mb-4 flex flex-col items-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <QrCode className="w-5 h-5 mb-2" style={{ color: "#22d3ee" }} />
                <p className="text-xs mb-3" style={{ color: "#94a3b8" }}>Scan to pay ₹{cartTotal}</p>
                <img src={paymentQR} alt="Payment QR Code" className="w-48 h-48 object-contain rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs" style={{ color: "#94a3b8" }}>Payment Screenshot *</Label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="payment-ss" />
                  <label htmlFor="payment-ss"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl cursor-pointer text-sm font-medium transition-all"
                    style={{
                      background: paymentScreenshot ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${paymentScreenshot ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: paymentScreenshot ? "#22d3ee" : "#94a3b8",
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    {paymentScreenshot ? paymentScreenshot.name : "Upload payment screenshot"}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white relative overflow-hidden transition-all disabled:opacity-50"
              style={{ fontFamily: "'Syncopate', sans-serif", background: "linear-gradient(135deg, #22d3ee, #8b5cf6)", boxShadow: "0 0 30px rgba(34,211,238,0.3)" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <ShoppingBag className="w-5 h-5" /> PLACE ORDER · ₹{cartTotal}
                </span>
              )}
            </button>
          </form>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MerchCheckoutPage;
