import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft, Heart, Music, Calendar, MapPin, Clock,
  User, Mail, Phone, Building2, Upload, X, CheckCircle2,
  Sparkles, Users, Ticket, Star, Mic2, Zap
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import paymentQR from "@/assets/payment-qr.jpg";
import concertPoster from "@/assets/krishh-concert.jpg";
import { sendConcertBookingEmail } from "@/lib/emailService";
import krishhBgAudio from "@/assets/krishh-bg-audio.mp3";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ticketTypes = [
  {
    id: "stag",
    name: "Stag Entry",
    price: 699,
    tagline: "Solo Experience",
    icon: User,
    features: [
      "Full concert access",
      "Live performance by Krishh",
      "Female vocalists live",
      "Full band performance",
    ],
  },
  {
    id: "couple",
    name: "Couple Entry",
    price: 1099,
    tagline: "Valentine's Special",
    icon: Heart,
    features: [
      "Entry for 2 persons",
      "Full concert access",
      "Valentine's special experience",
      "Live performances by all artists",
    ],
    badge: "Save ₹299!",
    originalPrice: 1398,
  },
];

const artists = [
  { name: "Krishh", role: "Lead Vocalist", featured: true },
  { name: "Ramya Ram C", role: "Vocalist" },
  { name: "Soundarya", role: "Vocalist" },
  { name: "Malavika Rajesh", role: "Vocalist" },
];

// Floating particles component - optimized for mobile
const FloatingParticles = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  // Reduced particles for mobile performance
  const particleCount = isMobile ? 8 : 20;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle-optimized"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Sound wave component
const SoundWave = () => (
  <div className="sound-wave">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// Countdown timer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-02-14T19:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      
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
        <div key={i} className="glass-card rounded-xl p-3 md:p-4 text-center min-w-[60px] md:min-w-[70px]">
          <span className="block text-2xl md:text-3xl font-bold text-concert-cyan" style={{ textShadow: '0 0 10px #00FFD9' }}>
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const KrishhConcertPage = () => {
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    partnerName: "",
    partnerPhone: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    bookingId: string;
    name: string;
    email: string;
    ticketType: string;
    ticketPrice: number;
    partnerName?: string;
  } | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pre-create audio element on mount for mobile compatibility
  useEffect(() => {
    const audio = new Audio(krishhBgAudio);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Start audio when user enters - must be synchronous for mobile
  const handleEnter = () => {
    if (audioRef.current) {
      // Mobile requires play() directly in user gesture handler
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio play failed:', error);
        });
      }
    }
    setHasEntered(true);
  };

  // Entry splash screen
  if (!hasEntered) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0015 0%, #1a0a2e 50%, #0f0a1a 100%)' }}
        onClick={handleEnter}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-concert-magenta rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-concert-magenta/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-concert-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6">
          {/* Music icon with pulse effect */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-concert-magenta/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-concert-magenta to-concert-purple flex items-center justify-center">
              <Music className="w-12 h-12 text-white" />
            </div>
            {/* Sound waves */}
            <div className="absolute inset-0 rounded-full border-2 border-concert-cyan/50 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-concert-magenta/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
          </div>
          
          {/* Title */}
          <h1 
            className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-concert-magenta via-concert-purple to-concert-cyan bg-clip-text text-transparent"
            style={{ textShadow: '0 0 40px rgba(255, 0, 128, 0.5)' }}
          >
            KRISHH LIVE
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">Valentine's Day Special Concert</p>
          
          {/* Enter button */}
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-concert-magenta to-concert-cyan rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative px-10 py-4 bg-gradient-to-r from-concert-magenta to-concert-purple rounded-full text-white font-bold text-lg tracking-wider">
              TAP TO ENTER
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-6 animate-pulse">🎵 Audio experience enabled</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB",
          variant: "destructive",
        });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedTicketInfo = ticketTypes.find((t) => t.id === selectedTicket);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.institution || !selectedTicket) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (selectedTicket === "couple") {
      if (!formData.partnerName || !formData.partnerPhone) {
        toast({
          title: "Partner details required",
          description: "Please enter your partner's name and phone number",
          variant: "destructive",
        });
        return;
      }
    }

    if (!paymentScreenshot) {
      toast({
        title: "Payment screenshot required",
        description: "Please upload your payment screenshot to complete booking",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = `KRISHH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `concert_${bookingId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, paymentScreenshot);

      if (uploadError) {
        console.error('Error uploading payment screenshot:', uploadError);
        throw new Error('Failed to upload payment screenshot');
      }

      // Store file path (bucket is private, admins access via signed URLs)
      const paymentScreenshotUrl = fileName;

      const { error } = await supabase
        .from('concert_bookings')
        .insert({
          booking_id: bookingId,
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          institution: formData.institution.trim(),
          ticket_type: selectedTicket,
          ticket_price: selectedTicketInfo?.price || 0,
          partner_name: selectedTicket === "couple" ? formData.partnerName.trim() : null,
          partner_phone: selectedTicket === "couple" ? formData.partnerPhone.trim() : null,
          payment_status: 'pending',
          payment_screenshot_url: paymentScreenshotUrl,
        });

      if (error) {
        console.error('Error saving concert booking:', error);
        throw error;
      }

      sendConcertBookingEmail({
        bookingId,
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        institution: formData.institution.trim(),
        ticketType: selectedTicketInfo?.name || selectedTicket,
        ticketPrice: selectedTicketInfo?.price || 0,
        partnerName: selectedTicket === "couple" ? formData.partnerName.trim() : undefined,
        partnerPhone: selectedTicket === "couple" ? formData.partnerPhone.trim() : undefined,
      }).catch(err => console.error('Email send failed:', err));

      // Set success state with booking details
      setBookingDetails({
        bookingId,
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        ticketType: selectedTicketInfo?.name || selectedTicket,
        ticketPrice: selectedTicketInfo?.price || 0,
        partnerName: selectedTicket === "couple" ? formData.partnerName.trim() : undefined,
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Concert booking error:', error);
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (isSuccess && bookingDetails) {
    return (
      <>
        <Helmet>
          <title>Booking Confirmed | Krishh Live Concert | ADWAITA 2026</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </Helmet>

        <div className="min-h-screen concert-bg-animated">
          <Navbar />

          <main className="relative pt-20 pb-16 overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 concert-bg-animated -z-10" />
            
            {/* Tech grid overlay - hidden on mobile via CSS */}
            <div className="fixed inset-0 tech-lines neon-grid -z-10 opacity-50" />

            {/* Floating particles */}
            <FloatingParticles />

            {/* Gradient orbs - optimized for mobile */}
            <div className="hidden md:block fixed top-[10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-concert-pink/20 via-concert-purple/10 to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="hidden md:block fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-tl from-concert-cyan/15 via-concert-purple/10 to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="md:hidden fixed top-[10%] left-[-10%] w-[40vw] h-[40vw] bg-concert-pink/10 rounded-full blur-2xl -z-5" />
            <div className="md:hidden fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-concert-cyan/10 rounded-full blur-2xl -z-5" />

            <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-[80vh]">
              <div className="max-w-xl w-full stagger-fade-in">
                {/* Success Card */}
                <div className="glass-card rounded-[40px] overflow-hidden" style={{ boxShadow: '0 0 80px rgba(0,255,217,0.2), 0 0 40px rgba(255,27,159,0.15)' }}>
                  {/* Header with animated gradient */}
                  <div className="relative p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,27,159,0.3), rgba(0,255,217,0.2))' }}>
                    {/* Animated success icon */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-concert-pink to-concert-cyan animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-1 rounded-full bg-concert-deep flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-concert-cyan" style={{ filter: 'drop-shadow(0 0 10px #00FFD9)' }} />
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span className="holographic">Booking Confirmed!</span>
                    </h1>
                    <p className="text-gray-300">Get ready for an unforgettable Valentine's night! 🎤</p>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    {/* Booking ID - Prominent Display */}
                    <div className="text-center p-6 rounded-2xl neon-border-cyan" style={{ background: 'rgba(0,255,217,0.1)' }}>
                      <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Your Booking ID</p>
                      <p className="text-2xl md:text-3xl font-bold text-concert-cyan font-mono tracking-wider" style={{ textShadow: '0 0 20px #00FFD9' }}>
                        {bookingDetails.bookingId}
                      </p>
                    </div>

                    {/* Ticket Preview */}
                    <div className="glass-card rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF1B9F, #00FFD9)' }}>
                            <Ticket className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{bookingDetails.ticketType}</p>
                            <p className="text-sm text-gray-400">Krishh Live Concert</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-concert-gold" style={{ textShadow: '0 0 10px #FFD700' }}>
                            ₹{bookingDetails.ticketPrice}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-gray-600 pt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{bookingDetails.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{bookingDetails.email}</span>
                        </div>
                        {bookingDetails.partnerName && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Partner</span>
                            <span className="text-white">{bookingDetails.partnerName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="glass-card rounded-xl p-4 text-center">
                        <Calendar className="w-5 h-5 text-concert-pink mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Date</p>
                        <p className="text-sm text-white font-medium">Feb 14, 2026</p>
                      </div>
                      <div className="glass-card rounded-xl p-4 text-center">
                        <Clock className="w-5 h-5 text-concert-cyan mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Time</p>
                        <p className="text-sm text-white font-medium">7:00 PM</p>
                      </div>
                      <div className="glass-card rounded-xl p-4 text-center">
                        <MapPin className="w-5 h-5 text-concert-gold mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Venue</p>
                        <p className="text-sm text-white font-medium">IGMC&RI</p>
                      </div>
                    </div>

                    {/* Email notification */}
                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,27,159,0.1)', border: '1px solid rgba(255,27,159,0.3)' }}>
                      <Mail className="w-5 h-5 text-concert-pink flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Confirmation email sent to <span className="text-concert-pink font-medium">{bookingDetails.email}</span>
                      </p>
                    </div>

                    {/* Payment status */}
                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
                      <Sparkles className="w-5 h-5 text-concert-gold flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        Payment verification in progress. You'll receive confirmation shortly.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link to="/" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-12 rounded-xl border-2 border-concert-purple-light/50 text-gray-300 hover:border-concert-cyan hover:text-concert-cyan transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Home
                        </Button>
                      </Link>
                      <Link to="/events" className="flex-1">
                        <Button
                          className="btn-morph w-full h-12 rounded-xl text-white font-semibold border-0"
                          style={{ background: 'linear-gradient(135deg, #FF1B9F, #00FFD9)' }}
                        >
                          <Music className="w-4 h-4 mr-2" />
                          Explore Events
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative bottom text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                  See you at the concert! 🎵✨
                </p>
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
        <title>Krishh Live Concert | Valentine's Day | ADWAITA 2026</title>
        <meta
          name="description"
          content="Book your tickets for Krishh Live Concert on Valentine's Day, February 14th at IGMC&RI. Stag ₹699, Couple ₹1099."
        />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen concert-bg-animated">
        <Navbar />

        <main className="relative pt-20 pb-16 overflow-hidden">
          {/* Animated gradient background */}
          <div className="fixed inset-0 concert-bg-animated -z-10" />
          
          {/* Tech grid overlay - hidden on mobile via CSS */}
          <div className="fixed inset-0 tech-lines neon-grid -z-10 opacity-50" />

          {/* Floating particles */}
          <FloatingParticles />

          {/* Gradient orbs - optimized: smaller blur, no animation on mobile */}
          <div className="hidden md:block fixed top-[10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-concert-pink/20 via-concert-purple/10 to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="hidden md:block fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-gradient-to-tl from-concert-cyan/15 via-concert-purple/10 to-transparent rounded-full blur-3xl -z-5 animate-pulse" style={{ animationDuration: '10s' }} />
          {/* Mobile-optimized static orbs */}
          <div className="md:hidden fixed top-[10%] left-[-10%] w-[40vw] h-[40vw] bg-concert-pink/10 rounded-full blur-2xl -z-5" />
          <div className="md:hidden fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-concert-cyan/10 rounded-full blur-2xl -z-5" />

          <div className="container mx-auto px-4 relative z-10">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-concert-cyan transition-all duration-300 mb-8 group glass-card px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </Link>

            {/* HERO SECTION */}
            <section className="stagger-fade-in mb-20">
              {/* Live badge with sound wave */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="glass-card px-5 py-2 rounded-full flex items-center gap-3 neon-border-pink">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-concert-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-concert-pink"></span>
                  </span>
                  <span className="text-concert-pink font-semibold tracking-wider text-sm uppercase">Live Concert</span>
                  <SoundWave />
                </div>
              </div>

              {/* Main title with holographic effect */}
              <h1 className="text-center mb-4">
                <span className="block text-5xl md:text-7xl lg:text-8xl font-extrabold holographic" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  KRISHH
                </span>
                <span className="block text-lg md:text-xl text-gray-400 mt-3 tracking-[0.3em] uppercase">
                  Live in Concert
                </span>
              </h1>

              {/* Valentine's special badge */}
              <div className="flex justify-center mb-8">
                <div className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255,27,159,0.2), rgba(255,215,0,0.2))' }}>
                  <Heart className="w-5 h-5 text-concert-pink animate-pulse" />
                  <span className="text-white font-semibold tracking-wide">Valentine's Day Special</span>
                  <Sparkles className="w-5 h-5 text-concert-gold" />
                </div>
              </div>

              {/* Countdown timer */}
              <div className="flex justify-center mb-10">
                <CountdownTimer />
              </div>

              {/* Hero content grid */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left - Poster with glow effect */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-concert-pink/30 via-concert-cyan/20 to-concert-gold/30 rounded-[40px] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-60" />
                  <div className="relative overflow-hidden rounded-[30px] border-2 border-concert-pink/30 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(255,27,159,0.2)' }}>
                    <img
                      src={concertPoster}
                      alt="Krishh Concert Poster"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-concert-deep/90 via-concert-deep/30 to-transparent" />
                    
                    {/* Event details floating cards */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex flex-wrap gap-3">
                        {[
                          { icon: Calendar, text: 'Feb 14, 2026', color: 'pink' },
                          { icon: Clock, text: '7:00 PM', color: 'cyan' },
                          { icon: MapPin, text: 'IGMC&RI', color: 'gold' },
                        ].map((item, i) => (
                          <div 
                            key={i}
                            className="glass-card glass-card-hover inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-default"
                            style={{ borderColor: item.color === 'pink' ? '#FF1B9F40' : item.color === 'cyan' ? '#00FFD940' : '#FFD70040' }}
                          >
                            <item.icon className={`w-4 h-4 ${item.color === 'pink' ? 'text-concert-pink' : item.color === 'cyan' ? 'text-concert-cyan' : 'text-concert-gold'}`} />
                            <span className="text-sm font-medium text-gray-200">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Artists showcase */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="glass-card rounded-[30px] p-6 md:p-8" style={{ boxShadow: '0 0 40px rgba(0,255,217,0.1)' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <Mic2 className="w-6 h-6 text-concert-cyan" />
                      <h3 className="text-xl font-semibold text-white">Featured Artists</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {artists.map((artist, i) => (
                        <div
                          key={i}
                          className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-default ${
                            artist.featured 
                              ? 'bg-gradient-to-r from-concert-pink/20 to-concert-cyan/10 neon-border-pink' 
                              : 'glass-card glass-card-hover'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              artist.featured ? 'bg-concert-pink' : 'bg-concert-purple-light'
                            }`}>
                              <Music className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className={`block font-semibold ${artist.featured ? 'holographic text-lg' : 'text-white'}`}>
                                {artist.name}
                              </span>
                              <span className="text-sm text-gray-400">{artist.role}</span>
                            </div>
                          </div>
                          {artist.featured && (
                            <div className="px-3 py-1 rounded-full bg-concert-gold/20 text-concert-gold text-xs font-bold">
                              HEADLINER
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Band info */}
                    <div className="mt-6 flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-concert-cyan/10 to-concert-pink/10 border border-concert-cyan/20">
                      <Zap className="w-5 h-5 text-concert-cyan" />
                      <span className="text-gray-300">with Full Live Band Performance</span>
                    </div>
                  </div>

                  {/* Quick price preview */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="glass-card rounded-2xl p-4 flex items-center gap-3 glitch-hover">
                      <User className="w-6 h-6 text-concert-pink" />
                      <div>
                        <span className="text-gray-400 text-sm block">Stag Entry</span>
                        <span className="text-2xl font-bold text-concert-pink neon-pink">₹699</span>
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden glitch-hover">
                      <Heart className="w-6 h-6 text-concert-cyan" />
                      <div>
                        <span className="text-gray-400 text-sm block">Couple Entry</span>
                        <span className="text-2xl font-bold text-concert-cyan neon-cyan">₹1099</span>
                      </div>
                      <div className="savings-pulse absolute -top-1 -right-1 px-2 py-1 bg-concert-gold text-concert-deep text-xs font-bold rounded-full">
                        SAVE ₹299
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TICKET SELECTION & BOOKING FORM */}
            <section className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left - Ticket Selection */}
                <div className="stagger-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-concert-pink to-concert-cyan flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Select Your Pass</h2>
                    <p className="text-gray-400 text-sm">Choose your concert experience</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {ticketTypes.map((ticket) => {
                    const IconComponent = ticket.icon;
                    const isSelected = selectedTicket === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket.id)}
                        className={`relative cursor-pointer ticket-flip ${isSelected ? 'ticket-flip-selected' : ''}`}
                      >
                        {/* Savings badge for couple */}
                        {ticket.badge && (
                          <div className="savings-pulse absolute -top-3 right-6 z-10 px-4 py-1.5 bg-gradient-to-r from-concert-gold to-yellow-400 text-concert-deep text-sm font-bold rounded-full shadow-lg">
                            {ticket.badge}
                          </div>
                        )}

                        <div
                          className={`glass-card rounded-[24px] p-6 transition-all duration-500 ${
                            isSelected
                              ? 'border-concert-pink'
                              : 'border-concert-purple-light/50 hover:border-concert-pink/50'
                          }`}
                          style={{ 
                            boxShadow: isSelected ? '0 0 40px rgba(255,27,159,0.3)' : 'none',
                            border: `2px solid ${isSelected ? '#FF1B9F' : 'rgba(61,40,98,0.5)'}`,
                          }}
                        >
                          <div className="flex items-start gap-5">
                            {/* Icon */}
                            <div 
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                isSelected ? 'neon-border-pink' : ''
                              }`}
                              style={{ 
                                background: ticket.id === 'couple' 
                                  ? 'linear-gradient(135deg, #FF1B9F, #00FFD9)' 
                                  : 'linear-gradient(135deg, #FF1B9F, #3D2862)' 
                              }}
                            >
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                                <div className="text-right">
                                  {ticket.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through mr-2">₹{ticket.originalPrice}</span>
                                  )}
                                  <span className={`text-2xl font-bold ${ticket.id === 'couple' ? 'text-concert-cyan neon-cyan' : 'text-concert-pink neon-pink'}`}>
                                    ₹{ticket.price}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-concert-gold mb-4">{ticket.tagline}</p>

                              <ul className="space-y-2">
                                {ticket.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${ticket.id === 'couple' ? 'text-concert-cyan' : 'text-concert-pink'}`} />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Selection indicator */}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isSelected
                                  ? 'bg-concert-pink border-2 border-concert-pink'
                                  : 'border-2 border-gray-600'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment QR Section */}
                <div className="mt-8 glass-card rounded-[24px] p-6" style={{ boxShadow: '0 0 30px rgba(0,255,217,0.1)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-concert-cyan to-concert-pink flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Payment QR Code</h3>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* QR with animated scan border */}
                    <div className="relative qr-scan-border p-2 rounded-2xl" style={{ border: '2px solid #00FFD9' }}>
                      <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 30px rgba(0,255,217,0.3)' }} />
                      <img
                        src={paymentQR}
                        alt="Payment QR Code"
                        className="relative w-40 h-40 rounded-xl"
                      />
                    </div>

                    <div className="text-center md:text-left">
                      <p className="text-gray-300 text-lg mb-2">
                        Pay <span className="text-concert-cyan font-bold text-xl neon-cyan">₹{selectedTicketInfo?.price || '---'}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Scan to pay • Upload screenshot below
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Booking Form */}
              <div className="stagger-fade-in">
                <div className="glass-card rounded-[30px] overflow-hidden" style={{ boxShadow: '0 0 50px rgba(255,27,159,0.15)' }}>
                  {/* Form header */}
                  <div className="relative p-6 md:p-8" style={{ background: 'linear-gradient(135deg, rgba(255,27,159,0.2), rgba(0,255,217,0.1))' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-concert-pink to-concert-gold flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Book Your Tickets</h2>
                        <p className="text-sm text-gray-400">Fill in your details below</p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm text-gray-400 flex items-center gap-2">
                        <User className="w-4 h-4 text-concert-cyan" />
                        Full Name <span className="text-concert-pink">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-concert-cyan" />
                        Email Address <span className="text-concert-pink">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm text-gray-400 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-concert-cyan" />
                        Phone Number <span className="text-concert-pink">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                      />
                    </div>

                    {/* Institution */}
                    <div className="space-y-2">
                      <Label htmlFor="institution" className="text-sm text-gray-400 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-concert-cyan" />
                        Institution <span className="text-concert-pink">*</span>
                      </Label>
                      <Input
                        id="institution"
                        name="institution"
                        type="text"
                        placeholder="Your college/institution name"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                      />
                    </div>

                    {/* Partner details for couple ticket */}
                    {selectedTicket === "couple" && (
                      <div className="space-y-4 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0,255,217,0.1), rgba(255,27,159,0.1))', border: '1px solid rgba(0,255,217,0.3)' }}>
                        <div className="flex items-center gap-2 text-concert-cyan">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">Partner Details</span>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerName" className="text-sm text-gray-400">
                            Partner's Name <span className="text-concert-pink">*</span>
                          </Label>
                          <Input
                            id="partnerName"
                            name="partnerName"
                            type="text"
                            placeholder="Enter partner's full name"
                            value={formData.partnerName}
                            onChange={handleInputChange}
                            className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partnerPhone" className="text-sm text-gray-400">
                            Partner's Phone <span className="text-concert-pink">*</span>
                          </Label>
                          <Input
                            id="partnerPhone"
                            name="partnerPhone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.partnerPhone}
                            onChange={handleInputChange}
                            className="h-12 bg-concert-deep/80 border-2 border-concert-purple-light/50 rounded-xl text-white placeholder:text-gray-500 focus:border-concert-cyan input-glow transition-all duration-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment Screenshot Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-400 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-concert-cyan" />
                        Payment Screenshot <span className="text-concert-pink">*</span>
                      </Label>

                      {!paymentScreenshot ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-concert-purple-light/50 rounded-2xl cursor-pointer bg-concert-deep/50 hover:border-concert-cyan hover:bg-concert-cyan/5 transition-all duration-300">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-concert-cyan/60" />
                            <p className="text-sm text-gray-400">
                              <span className="font-semibold text-concert-cyan">Click to upload</span> payment screenshot
                            </p>
                            <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 4MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      ) : (
                        <div className="relative flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(0,255,217,0.1)', border: '1px solid rgba(0,255,217,0.3)' }}>
                          <CheckCircle2 className="w-6 h-6 text-concert-cyan flex-shrink-0" />
                          <span className="text-sm text-gray-300 truncate flex-1">
                            {paymentScreenshot.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPaymentScreenshot(null)}
                            className="p-2 hover:bg-concert-pink/20 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400 hover:text-concert-pink" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedTicket}
                      className="btn-morph w-full h-14 text-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed border-0"
                      style={{ 
                        background: 'linear-gradient(135deg, #FF1B9F, #00FFD9)',
                        boxShadow: '0 10px 40px rgba(255,27,159,0.3)',
                      }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5" />
                          Book Now {selectedTicketInfo ? `• ₹${selectedTicketInfo.price}` : ""}
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      By booking, you agree to receive confirmation via email
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

export default KrishhConcertPage;