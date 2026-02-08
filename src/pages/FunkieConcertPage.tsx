import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft, Music, Calendar, MapPin, Clock,
  User, Mail, Phone, Upload, X, CheckCircle2,
  Sparkles, Ticket, Zap, Guitar
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import paymentQR from "@/assets/payment-qr.jpg";
import funkiePoster from "@/assets/funkie-concert.jpg";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const TICKET_PRICE = 499;

// Equalizer bars component
const EqualizerBars = ({ count = 20 }: { count?: number }) => (
  <div className="flex items-end justify-center gap-[3px] h-8">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-[3px] rounded-full"
        style={{
          height: `${20 + Math.random() * 80}%`,
          background: `linear-gradient(to top, #6366F1, #06B6D4)`,
          animation: `eqBounce ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.05}s`,
        }}
      />
    ))}
  </div>
);

// Floating note particles
const FloatingNotes = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);
  const notes = ['♪', '♫', '♬', '♩', '🎵'];
  const count = isMobile ? 6 : 14;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute text-indigo-400/30 select-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${14 + Math.random() * 20}px`,
            animation: `floatNote ${6 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        >
          {notes[i % notes.length]}
        </div>
      ))}
    </div>
  );
};

// Countdown to Feb 13
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-02-13T18:00:00').getTime();
    const timer = setInterval(() => {
      const diff = targetDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.mins, label: 'Mins' },
        { value: timeLeft.secs, label: 'Secs' },
      ].map((item, i) => (
        <div key={i} className="funkie-glass rounded-xl p-3 md:p-4 text-center min-w-[60px] md:min-w-[70px]">
          <span className="block text-2xl md:text-3xl font-bold text-cyan-400" style={{ textShadow: '0 0 12px #06B6D4' }}>
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
};


const FunkieConcertPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    bookingId: string;
    name: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({ title: "Invalid phone", description: "Please enter a valid phone number", variant: "destructive" });
      return;
    }

    if (!paymentScreenshot) {
      toast({ title: "Payment screenshot required", description: "Please upload your payment screenshot", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = `FUNKIE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `funkie_${bookingId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, paymentScreenshot);

      if (uploadError) throw new Error('Failed to upload payment screenshot');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const paymentScreenshotUrl = `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${fileName}`;

      const { error } = await supabase
        .from('concert_bookings')
        .insert({
          booking_id: bookingId,
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          institution: formData.institution.trim() || 'N/A',
          ticket_type: 'funkie-general',
          ticket_price: TICKET_PRICE,
          payment_status: 'pending',
          payment_screenshot_url: paymentScreenshotUrl,
        });

      if (error) throw error;

      setBookingDetails({
        bookingId,
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast({ title: "Booking failed", description: error.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── SUCCESS SCREEN ───
  if (isSuccess && bookingDetails) {
    return (
      <>
        <Helmet>
          <title>Booking Confirmed | FUNKIE Live | ADWAITA 2026</title>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Helmet>
        <div className="min-h-screen funkie-bg">
          <Navbar />
          <main className="relative pt-20 pb-16 overflow-hidden">
            <FloatingNotes />
            <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-[80vh]">
              <div className="max-w-xl w-full stagger-fade-in">
                <div className="funkie-glass rounded-[32px] overflow-hidden" style={{ boxShadow: '0 0 80px rgba(99,102,241,0.3)' }}>
                  <div className="relative p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.2))' }}>
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-1 rounded-full bg-[#0A0A1B] flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px #06B6D4)' }} />
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">BOOKING CONFIRMED!</span>
                    </h1>
                    <p className="text-gray-400">Get ready for an electrifying night! 🎸</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="text-center p-6 rounded-2xl" style={{ background: 'rgba(6,182,212,0.1)', boxShadow: '0 0 15px rgba(6,182,212,0.3), inset 0 0 15px rgba(6,182,212,0.1)' }}>
                      <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your Booking ID</p>
                      <p className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono tracking-wider" style={{ textShadow: '0 0 20px #06B6D4' }}>
                        {bookingDetails.bookingId}
                      </p>
                    </div>

                    <div className="funkie-glass rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500">
                            <Ticket className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">General Entry</p>
                            <p className="text-sm text-gray-400">FUNKIE Live Band</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-400" style={{ textShadow: '0 0 10px #F59E0B' }}>₹{TICKET_PRICE}</p>
                      </div>
                      <div className="border-t border-dashed border-gray-700 pt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{bookingDetails.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{bookingDetails.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: Calendar, label: 'Date', value: 'Feb 13, 2026', color: '#6366F1' },
                        { icon: Clock, label: 'Time', value: '6:00 PM', color: '#06B6D4' },
                        { icon: MapPin, label: 'Venue', value: 'OAT, IGMC&RI', color: '#F59E0B' },
                      ].map((item, i) => (
                        <div key={i} className="funkie-glass rounded-xl p-4 text-center">
                          <item.icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className="text-sm text-white font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }}>
                      <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <p className="text-sm text-gray-300">Payment verification in progress. You'll receive confirmation shortly.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link to="/" className="flex-1">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-indigo-500/50 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-all">
                          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Button>
                      </Link>
                      <Link to="/events" className="flex-1">
                        <Button className="w-full h-12 rounded-xl text-white font-semibold border-0" style={{ background: 'linear-gradient(135deg, #6366F1, #06B6D4)' }}>
                          <Music className="w-4 h-4 mr-2" /> Explore Events
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // ─── MAIN PAGE ───
  return (
    <>
      <Helmet>
        <title>FUNKIE Live Band | February 13 | ADWAITA 2026</title>
        <meta name="description" content="Book your tickets for FUNKIE Live Band at ADWAITA 2026. February 13th, OAT IGMC&RI. Entry ₹499." />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen funkie-bg">
        <Navbar />
        <main className="relative pt-20 pb-16 overflow-hidden">
          {/* Background effects */}
          <div className="fixed inset-0 funkie-bg -z-10" />
          <FloatingNotes />
          <div className="hidden md:block fixed top-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-600/10 rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="hidden md:block fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '10s' }} />

          <div className="container mx-auto px-4 relative z-10">
            {/* Back */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all mb-8 group funkie-glass px-4 py-2 rounded-full">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>

            {/* ─── HERO ─── */}
            <section className="stagger-fade-in mb-16">
              {/* Live badge */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="funkie-glass px-5 py-2 rounded-full flex items-center gap-3" style={{ boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                  <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase">Live Band</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center mb-3">
                <span
                  className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    background: 'linear-gradient(135deg, #818CF8 0%, #06B6D4 40%, #F59E0B 70%, #818CF8 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    animation: 'holographicShimmer 4s linear infinite',
                    textShadow: 'none',
                  }}
                >
                  FUNKIE
                </span>
                <span className="block text-lg md:text-xl text-gray-400 mt-3 tracking-[0.3em] uppercase">
                  Live at ADWAITA '26
                </span>
              </h1>

              {/* Equalizer */}
              <div className="flex justify-center mb-6">
                <EqualizerBars count={24} />
              </div>

              {/* Countdown */}
              <div className="flex justify-center mb-10">
                <CountdownTimer />
              </div>

              {/* Hero grid */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Poster */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-cyan-500/15 to-amber-500/20 rounded-[40px] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60" />
                  <div className="relative overflow-hidden rounded-[30px] border-2 border-indigo-500/30 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(99,102,241,0.2)' }}>
                    <img src={funkiePoster} alt="FUNKIE Band Poster" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A1B]/90 via-[#0A0A1B]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex flex-wrap gap-3">
                        {[
                          { icon: Calendar, text: 'Feb 13, 2026', color: '#6366F1' },
                          { icon: Clock, text: '6:00 PM', color: '#06B6D4' },
                          { icon: MapPin, text: 'OAT, IGMC&RI', color: '#F59E0B' },
                        ].map((item, i) => (
                          <div key={i} className="funkie-glass inline-flex items-center gap-2 px-4 py-2 rounded-full">
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                            <span className="text-sm font-medium text-gray-200">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Band & Price */}
                <div className="flex flex-col justify-center space-y-6">

                  {/* Price card */}
                  <div className="funkie-glass rounded-2xl p-6 flex items-center justify-between relative overflow-hidden" style={{ boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-cyan-500/10" />
                    <div className="relative flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                        <Ticket className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm block">General Entry</span>
                        <span className="text-3xl font-bold text-cyan-400" style={{ textShadow: '0 0 15px #06B6D4' }}>₹{TICKET_PRICE}</span>
                      </div>
                    </div>
                    <div className="relative px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40">
                      <span className="text-amber-400 text-sm font-bold">PER PERSON</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── BOOKING FORM ─── */}
            <section className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Payment QR */}
                <div className="stagger-fade-in">
                  <div className="funkie-glass rounded-[24px] p-6" style={{ boxShadow: '0 0 30px rgba(6,182,212,0.15)' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Payment QR Code</h3>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                      <div className="relative qr-scan-border p-2 rounded-2xl" style={{ border: '2px solid #6366F1' }}>
                        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 30px rgba(99,102,241,0.3)' }} />
                        <img src={paymentQR} alt="Payment QR Code" className="relative w-44 h-44 rounded-xl" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-300 text-lg mb-1">
                          Pay <span className="text-cyan-400 font-bold text-2xl" style={{ textShadow: '0 0 12px #06B6D4' }}>₹{TICKET_PRICE}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Scan to pay • Upload screenshot below</p>
                      </div>
                    </div>

                    {/* Event highlights */}
                    <div className="mt-8 space-y-3">
                      {[
                        '🎸 Full band live performance',
                        '🎤 Multiple vocalists on stage',
                        '🎹 Keyboard & percussion showcase',
                        '🔥 High-energy setlist',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                          <span className="text-sm text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="stagger-fade-in">
                  <div className="funkie-glass rounded-[30px] overflow-hidden" style={{ boxShadow: '0 0 50px rgba(99,102,241,0.15)' }}>
                    <div className="relative p-6 md:p-8" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
                          <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Book Your Ticket</h2>
                          <p className="text-sm text-gray-400">Fill in your details below</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm text-gray-400 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          Full Name <span className="text-indigo-400">*</span>
                        </Label>
                        <Input id="fullName" name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange}
                          className="h-12 bg-[#0A0A1B]/80 border-2 border-indigo-500/30 rounded-xl text-white placeholder:text-gray-600 focus:border-cyan-400 transition-all duration-300" style={{ boxShadow: 'none' }} />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-gray-400 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-400" />
                          Email Address <span className="text-indigo-400">*</span>
                        </Label>
                        <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange}
                          className="h-12 bg-[#0A0A1B]/80 border-2 border-indigo-500/30 rounded-xl text-white placeholder:text-gray-600 focus:border-cyan-400 transition-all duration-300" />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-gray-400 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-indigo-400" />
                          Phone Number <span className="text-indigo-400">*</span>
                        </Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleInputChange}
                          className="h-12 bg-[#0A0A1B]/80 border-2 border-indigo-500/30 rounded-xl text-white placeholder:text-gray-600 focus:border-cyan-400 transition-all duration-300" />
                      </div>

                      {/* Institution */}
                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm text-gray-400 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          College / Institution <span className="text-gray-600 text-xs">(optional)</span>
                        </Label>
                        <Input id="institution" name="institution" type="text" placeholder="Your college or institution" value={formData.institution} onChange={handleInputChange}
                          className="h-12 bg-[#0A0A1B]/80 border-2 border-indigo-500/30 rounded-xl text-white placeholder:text-gray-600 focus:border-cyan-400 transition-all duration-300" />
                      </div>

                      {/* Price summary */}
                      <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-semibold">Total Amount</span>
                          <span className="text-cyan-400 font-bold text-xl" style={{ textShadow: '0 0 12px #06B6D4' }}>₹{TICKET_PRICE}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Entry for 1 person</div>
                      </div>

                      {/* Payment Screenshot */}
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-400 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-indigo-400" />
                          Payment Screenshot <span className="text-indigo-400">*</span>
                        </Label>
                        {!paymentScreenshot ? (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-500/30 rounded-2xl cursor-pointer bg-[#0A0A1B]/50 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all duration-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-indigo-400/60" />
                              <p className="text-sm text-gray-400">Click to upload screenshot</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 4MB</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                        ) : (
                          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300 flex-1 truncate">{paymentScreenshot.name}</span>
                            <button type="button" onClick={() => setPaymentScreenshot(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl text-white font-bold text-lg border-0 relative overflow-hidden group"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #06B6D4)' }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Ticket className="w-5 h-5" />
                              Book Now — ₹{TICKET_PRICE}
                              <Sparkles className="w-5 h-5" />
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>

                      <p className="text-xs text-gray-500 text-center mt-3">
                        By booking, you agree to the event terms. No refunds after payment verification.
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FunkieConcertPage;
