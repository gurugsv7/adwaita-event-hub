import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft, Heart, Music, Calendar, MapPin, Clock,
  User, Mail, Phone, Building2, Upload, X, CheckCircle2,
  Sparkles, Users, Ticket
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

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ticketTypes = [
  {
    id: "stag",
    name: "Stag Entry",
    price: 699,
    tagline: "Solo Experience",
    icon: User,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    features: [
      "Full concert access",
      "Live performance by Krishh",
      "Performances by Ramya Ram C, Soundarya & Malavika Rajesh",
      "Band performance",
    ],
  },
  {
    id: "couple",
    name: "Couple Entry",
    price: 1099,
    tagline: "Valentine's Special",
    icon: Heart,
    gradient: "from-rose-400 via-pink-500 to-purple-500",
    features: [
      "Entry for 2 persons",
      "Full concert access",
      "Valentine's Day special experience",
      "Live performance by Krishh & Band",
      "Performances by Ramya Ram C, Soundarya & Malavika Rajesh",
    ],
    badge: "Save ₹299!",
  },
];

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
  const { toast } = useToast();

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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Validate phone
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    // For couple ticket, validate partner details
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

    // Validate payment screenshot
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
      // Generate a unique booking ID
      const bookingId = `KRISHH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Upload payment screenshot
      let paymentScreenshotUrl = null;
      const fileExt = paymentScreenshot.name.split('.').pop();
      const fileName = `concert_${bookingId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, paymentScreenshot);

      if (uploadError) {
        console.error('Error uploading payment screenshot:', uploadError);
        throw new Error('Failed to upload payment screenshot');
      }

      const { data: urlData } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      paymentScreenshotUrl = urlData.publicUrl;

      // Save to database
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

      // Send confirmation email
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

      toast({
        title: "Booking successful! 🎉",
        description: `Your Booking ID: ${bookingId}. Get ready for an unforgettable Valentine's night!`,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        partnerName: "",
        partnerPhone: "",
      });
      setSelectedTicket("");
      setPaymentScreenshot(null);

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

  return (
    <>
      <Helmet>
        <title>Krishh Live Concert | Valentine's Day | ADWAITA 2026</title>
        <meta
          name="description"
          content="Book your tickets for Krishh Live Concert on Valentine's Day, February 14th at IGMC&RI. Stag ₹699, Couple ₹1099."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="relative pt-24 pb-16 overflow-hidden">
          {/* Valentine's themed background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating hearts animation */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-pink-500/20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                  }}
                >
                  ♥
                </div>
              ))}
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-[5%] left-[0%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-gradient-to-br from-pink-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-bl from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-[0%] left-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-rose-500/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-silver/70 hover:text-pink-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              {/* Left - Poster */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/30 via-rose-500/30 to-purple-500/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative overflow-hidden rounded-2xl border-2 border-pink-500/30 shadow-2xl">
                  <img
                    src={concertPoster}
                    alt="Krishh Concert Poster"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  
                  {/* Event details overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 backdrop-blur-sm border border-pink-500/40 rounded-full">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span className="text-sm font-medium text-pink-200">Feb 14, 2026</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 backdrop-blur-sm border border-pink-500/40 rounded-full">
                        <Clock className="w-4 h-4 text-pink-400" />
                        <span className="text-sm font-medium text-pink-200">7:00 PM</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 backdrop-blur-sm border border-pink-500/40 rounded-full">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        <span className="text-sm font-medium text-pink-200">IGMC&RI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Event Info */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 rounded-full mb-6 w-fit">
                  <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
                  <span className="text-sm font-medium text-pink-300 tracking-widest uppercase">Valentine's Special</span>
                </div>

                <h1 className="font-heading text-4xl md:text-5xl xl:text-6xl text-foreground mb-4 leading-[1.1]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400">
                    Krishh
                  </span>{" "}
                  <span className="block text-2xl md:text-3xl text-silver/80 mt-2">Live in Concert</span>
                </h1>

                <p className="text-silver/70 text-lg mb-6 leading-relaxed">
                  Experience an unforgettable Valentine's night with the mesmerizing voice of <span className="text-pink-400 font-semibold">Krishh</span> and his incredible band.
                </p>

                {/* Featured Artists */}
                <div className="bg-card/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="w-5 h-5 text-pink-400" />
                    <h3 className="font-heading text-lg text-foreground">Featured Artists</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-silver/80">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Ramya Ram C</span>
                    </div>
                    <div className="flex items-center gap-2 text-silver/80">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>Soundarya</span>
                    </div>
                    <div className="flex items-center gap-2 text-silver/80">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Malavika Rajesh</span>
                    </div>
                    <div className="flex items-center gap-2 text-silver/80">
                      <Music className="w-4 h-4 text-pink-400" />
                      <span>Full Band</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Preview */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-transparent border border-pink-500/30 rounded-xl">
                    <User className="w-5 h-5 text-pink-400" />
                    <span className="text-silver/80">Stag:</span>
                    <span className="font-heading text-xl text-pink-400">₹699</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500/10 to-purple-500/10 border border-rose-500/30 rounded-xl">
                    <Heart className="w-5 h-5 text-rose-400" />
                    <span className="text-silver/80">Couple:</span>
                    <span className="font-heading text-xl text-rose-400">₹1099</span>
                    <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full">Save ₹299</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Selection & Form */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Ticket Selection */}
              <div>
                <h2 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-pink-400" />
                  Select Your Ticket
                </h2>

                <div className="space-y-4">
                  {ticketTypes.map((ticket) => {
                    const IconComponent = ticket.icon;
                    const isSelected = selectedTicket === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket.id)}
                        className={`relative cursor-pointer group transition-all duration-300 ${
                          isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                        }`}
                      >
                        {/* Glow effect */}
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-r ${ticket.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                            isSelected ? "opacity-50" : ""
                          }`}
                        />

                        <div
                          className={`relative bg-card/80 backdrop-blur-sm border-2 rounded-2xl p-5 transition-all duration-300 ${
                            isSelected
                              ? "border-pink-500 shadow-lg shadow-pink-500/20"
                              : "border-pink-500/20 hover:border-pink-500/50"
                          }`}
                        >
                          {/* Badge */}
                          {ticket.badge && (
                            <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                              {ticket.badge}
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            <div
                              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ticket.gradient} flex items-center justify-center flex-shrink-0`}
                            >
                              <IconComponent className="w-7 h-7 text-white" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-heading text-xl text-foreground">{ticket.name}</h3>
                                <span className="font-heading text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                                  ₹{ticket.price}
                                </span>
                              </div>
                              <p className="text-sm text-pink-400/80 mb-3">{ticket.tagline}</p>

                              <ul className="space-y-1.5">
                                {ticket.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm text-silver/70">
                                    <Heart className="w-3 h-3 text-pink-400 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Selection indicator */}
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-pink-500 bg-pink-500"
                                  : "border-silver/30"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment QR */}
                <div className="mt-8 bg-card/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6">
                  <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    Payment QR Code
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded-xl blur" />
                      <img
                        src={paymentQR}
                        alt="Payment QR Code"
                        className="relative w-40 h-40 rounded-lg border border-pink-500/30"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-silver/80 text-sm mb-2">
                        Scan to pay <span className="text-pink-400 font-semibold">₹{selectedTicketInfo?.price || '---'}</span>
                      </p>
                      <p className="text-xs text-silver/50">
                        Upload payment screenshot after completing payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Booking Form */}
              <div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-card/80 backdrop-blur-md border border-pink-500/30 rounded-3xl overflow-hidden">
                    {/* Form header */}
                    <div className="bg-gradient-to-r from-pink-500/20 via-rose-500/15 to-purple-500/20 border-b border-pink-500/20 px-6 py-5">
                      <h2 className="font-heading text-xl text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        Book Your Tickets
                      </h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm text-silver/80 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name <span className="text-pink-400">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-silver/80 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address <span className="text-pink-400">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-silver/80 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number <span className="text-pink-400">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm text-silver/80 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Institution <span className="text-pink-400">*</span>
                        </Label>
                        <Input
                          id="institution"
                          name="institution"
                          type="text"
                          placeholder="Your college/institution name"
                          value={formData.institution}
                          onChange={handleInputChange}
                          className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                        />
                      </div>

                      {/* Partner details for couple ticket */}
                      {selectedTicket === "couple" && (
                        <div className="space-y-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                          <div className="flex items-center gap-2 text-rose-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">Partner Details</span>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="partnerName" className="text-sm text-silver/80">
                              Partner's Name <span className="text-pink-400">*</span>
                            </Label>
                            <Input
                              id="partnerName"
                              name="partnerName"
                              type="text"
                              placeholder="Enter partner's full name"
                              value={formData.partnerName}
                              onChange={handleInputChange}
                              className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="partnerPhone" className="text-sm text-silver/80">
                              Partner's Phone <span className="text-pink-400">*</span>
                            </Label>
                            <Input
                              id="partnerPhone"
                              name="partnerPhone"
                              type="tel"
                              placeholder="+91 XXXXX XXXXX"
                              value={formData.partnerPhone}
                              onChange={handleInputChange}
                              className="bg-background/50 border-pink-500/20 focus:border-pink-500 placeholder:text-silver/40"
                            />
                          </div>
                        </div>
                      )}

                      {/* Payment Screenshot Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm text-silver/80 flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Payment Screenshot <span className="text-pink-400">*</span>
                        </Label>

                        {!paymentScreenshot ? (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-500/30 rounded-xl cursor-pointer bg-background/30 hover:bg-pink-500/5 hover:border-pink-500/50 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-pink-400/60" />
                              <p className="text-sm text-silver/60">
                                <span className="font-semibold text-pink-400">Click to upload</span> payment screenshot
                              </p>
                              <p className="text-xs text-silver/40 mt-1">PNG, JPG up to 4MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        ) : (
                          <div className="relative flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0" />
                            <span className="text-sm text-silver/80 truncate flex-1">
                              {paymentScreenshot.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setPaymentScreenshot(null)}
                              className="p-1 hover:bg-pink-500/20 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-silver/60" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting || !selectedTicket}
                        className="w-full h-14 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Booking...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Book Now {selectedTicketInfo ? `• ₹${selectedTicketInfo.price}` : ""}
                          </div>
                        )}
                      </Button>

                      <p className="text-xs text-center text-silver/50">
                        By booking, you agree to receive confirmation via email
                      </p>
                    </form>
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
};

export default KrishhConcertPage;