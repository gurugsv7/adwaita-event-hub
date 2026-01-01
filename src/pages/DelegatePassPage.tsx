import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowLeft, Crown, Star, Zap, Check, Mail, Phone, 
  CreditCard, FileCheck, Send, Sparkles, AlertTriangle,
  Building2, User, ChevronRight, QrCode
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import paymentQR from "@/assets/payment-qr.jpg";

const passes = [
  {
    id: "platinum",
    name: "PLATINUM",
    price: 850,
    tagline: "Top Tier Access",
    icon: Crown,
    gradient: "from-gold via-primary to-gold",
    features: [
      "Access to Pro-Show",
      "Access to Pro-Band performance",
      "Access to all three DJ nights",
      "All event participation included",
      "Priority entry to all venues",
    ],
  },
  {
    id: "gold",
    name: "GOLD",
    price: 450,
    tagline: "Premium Experience",
    icon: Star,
    gradient: "from-teal via-secondary to-teal",
    features: [
      "Access to one Pro-Band performance",
      "Access to Day 1 & Day 2 DJ nights",
      "All event participation included",
      "Standard entry to all venues",
    ],
  },
  {
    id: "silver",
    name: "SILVER",
    price: 250,
    tagline: "Essential Access",
    icon: Zap,
    gradient: "from-muted-foreground via-silver to-muted-foreground",
    features: [
      "Participate in all events",
      "Access to Day 1 DJ night",
      "Entry to all event venues",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Fill the Form",
    description: "Complete your delegate registration details below",
    icon: FileCheck,
  },
  {
    number: "02",
    title: "Make Payment",
    description: "Pay via the provided link or scan the QR code",
    icon: CreditCard,
  },
  {
    number: "03",
    title: "Get Your Pass",
    description: "Receive confirmation email and digital pass",
    icon: Send,
  },
];

const DelegatePassPage = () => {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedPass = passes.find((p) => p.id === selectedTier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.institution || !selectedTier) {
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

    // Validate phone (basic validation for Indian numbers)
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique delegate ID
      const delegateId = `DEL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Save to database
      const { error } = await supabase
        .from('delegates')
        .insert({
          delegate_id: delegateId,
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          institution: formData.institution.trim(),
          tier: selectedTier,
          tier_price: selectedPass?.price || 0,
          payment_status: 'pending',
        });

      if (error) {
        console.error('Error saving delegate registration:', error);
        throw error;
      }

      toast({
        title: "Registration successful!",
        description: `Your Delegate ID: ${delegateId}. Please proceed to payment for your ${selectedPass?.name} pass (₹${selectedPass?.price}).`,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
      });
      setSelectedTier("");
      
    } catch (error: any) {
      console.error('Delegate registration error:', error);
      toast({
        title: "Registration failed",
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
        <title>Delegate Pass | ADWAITA 2026</title>
        <meta
          name="description"
          content="Register for your delegate pass for ADWAITA 2026. Choose from Platinum, Gold, or Silver passes for exclusive access."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="relative pt-24 pb-16 overflow-hidden">
          {/* Dynamic background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Mesh gradient orbs */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-gold/8 via-primary/5 to-transparent rounded-full blur-3xl" />
              <div className="absolute top-[30%] right-[0%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-gradient-to-bl from-teal/8 via-secondary/5 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] bg-gradient-to-tr from-primary/6 to-transparent rounded-full blur-3xl" />
            </div>
            
            {/* Geometric accents */}
            <svg className="absolute top-20 left-[10%] w-24 h-24 text-gold/5" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <svg className="absolute bottom-40 right-[15%] w-32 h-32 text-teal/5" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="absolute top-[60%] left-[8%] w-16 h-16 border border-gold/10 rotate-45" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-silver/70 hover:text-gold transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            {/* Hero Section - Asymmetric layout */}
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
              {/* Left side - Title & Info */}
              <div className="lg:col-span-2 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-full mb-6 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs font-medium text-gold tracking-widest uppercase">ADWAITA 2026</span>
                </div>

                <h1 className="font-heading text-4xl md:text-5xl xl:text-6xl text-foreground mb-6 leading-[1.1]">
                  Delegate{" "}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-teal">
                    Registration
                  </span>
                </h1>

                <p className="text-silver/70 text-lg mb-8 leading-relaxed">
                  Secure your access to the ultimate college fest experience. Your delegate pass is your gateway to performances, competitions, and unforgettable memories.
                </p>

                {/* Important notice */}
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium mb-1">Important Notice</p>
                      <p className="text-xs text-silver/70 leading-relaxed">
                        Delegate pass is mandatory for all participants except for certain presentations. 
                        <span className="text-accent font-medium"> Registration is non-refundable.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <p className="text-xs text-silver/50 uppercase tracking-widest">Need help?</p>
                  <div className="flex flex-col gap-2">
                    <a href="mailto:striatum.3.igmcri@gmail.com" className="inline-flex items-center gap-2 text-teal hover:text-gold transition-colors text-sm">
                      <Mail className="w-4 h-4" />
                      striatum.3.igmcri@gmail.com
                    </a>
                    <a href="tel:+919597080710" className="inline-flex items-center gap-2 text-teal hover:text-gold transition-colors text-sm">
                      <Phone className="w-4 h-4" />
                      +91 95970 80710
                    </a>
                  </div>
                </div>
              </div>

              {/* Right side - How to Buy steps */}
              <div className="lg:col-span-3">
                <div className="relative">
                  {/* Connecting line */}
                  <div className="hidden md:block absolute top-1/2 left-[calc(16.67%-20px)] right-[calc(16.67%-20px)] h-px bg-gradient-to-r from-gold/30 via-teal/30 to-gold/30 -translate-y-1/2 z-0" />
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={step.number} className="relative z-10 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="bg-card/60 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 h-full hover:border-gold/50 transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-teal/20 flex items-center justify-center group-hover:from-gold/30 group-hover:to-teal/30 transition-all">
                                <IconComponent className="w-5 h-5 text-gold" />
                              </div>
                              <span className="text-3xl font-heading text-gold/30 group-hover:text-gold/50 transition-colors">{step.number}</span>
                            </div>
                            <h3 className="text-lg font-heading text-foreground mb-2">{step.title}</h3>
                            <p className="text-sm text-silver/60 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content - Two columns */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Registration Form */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-transparent to-teal/20 rounded-3xl blur-xl opacity-50" />
                  <div className="relative bg-card/80 backdrop-blur-md border border-gold/30 rounded-3xl overflow-hidden">
                    {/* Form header */}
                    <div className="bg-gradient-to-r from-gold/10 via-primary/5 to-teal/10 border-b border-gold/20 px-6 py-5">
                      <h2 className="font-heading text-xl text-foreground">Delegate Registration Form</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm text-silver/80 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name <span className="text-accent">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="bg-background/50 border-gold/20 focus:border-gold placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-silver/80 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address <span className="text-accent">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-background/50 border-gold/20 focus:border-gold placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-silver/80 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number <span className="text-accent">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-background/50 border-gold/20 focus:border-gold placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-sm text-silver/80 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Institution <span className="text-accent">*</span>
                        </Label>
                        <Input
                          id="institution"
                          name="institution"
                          type="text"
                          placeholder="Your college/university name"
                          value={formData.institution}
                          onChange={handleInputChange}
                          className="bg-background/50 border-gold/20 focus:border-gold placeholder:text-silver/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-silver/80 flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Select Tier <span className="text-accent">*</span>
                        </Label>
                        <Select value={selectedTier} onValueChange={setSelectedTier}>
                          <SelectTrigger className="bg-background/50 border-gold/20 focus:border-gold">
                            <SelectValue placeholder="Choose your pass tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {passes.map((pass) => (
                              <SelectItem key={pass.id} value={pass.id}>
                                <span className="flex items-center gap-2">
                                  <pass.icon className="w-4 h-4" />
                                  {pass.name} - ₹{pass.price}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Selected pass preview */}
                      {selectedPass && (
                        <div className="bg-background/30 border border-gold/20 rounded-xl p-4 animate-fade-in">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <selectedPass.icon className="w-5 h-5 text-gold" />
                              <span className="font-heading text-foreground">{selectedPass.name}</span>
                            </div>
                            <span className="text-2xl font-heading text-gold">₹{selectedPass.price}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {selectedPass.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-silver/70">
                                <Check className="w-3 h-3 text-teal" />
                                {feature}
                              </li>
                            ))}
                            {selectedPass.features.length > 3 && (
                              <li className="text-xs text-silver/50">+{selectedPass.features.length - 3} more benefits</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Payment QR Code */}
                      <div className="bg-background/30 border border-gold/20 rounded-xl p-5">
                        <div className="flex flex-col items-center text-center">
                          <div className="flex items-center gap-2 mb-4">
                            <QrCode className="w-5 h-5 text-gold" />
                            <span className="text-sm font-medium text-foreground">Scan to Pay</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl shadow-lg mb-4">
                            <img 
                              src={paymentQR} 
                              alt="Payment QR Code" 
                              className="w-40 h-40 object-contain"
                            />
                          </div>
                          <p className="text-xs text-silver/60">
                            Scan this QR code with any UPI app to make payment
                          </p>
                          {selectedPass && (
                            <p className="text-sm text-gold font-medium mt-2">
                              Amount: ₹{selectedPass.price}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 bg-gradient-to-r from-gold to-primary text-charcoal font-semibold text-base hover:opacity-90 transition-opacity group"
                      >
                        {isSubmitting ? (
                          "Processing..."
                        ) : (
                          <>
                            Proceed to Payment
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right - Pass tiers showcase */}
              <div className="order-1 lg:order-2 space-y-4">
                <h2 className="font-heading text-2xl text-foreground mb-6">Choose Your Experience</h2>
                
                {passes.map((pass, index) => {
                  const IconComponent = pass.icon;
                  const isSelected = selectedTier === pass.id;
                  
                  return (
                    <button
                      key={pass.id}
                      type="button"
                      onClick={() => setSelectedTier(pass.id)}
                      className={`w-full text-left animate-fade-in transition-all duration-300 ${
                        isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                        isSelected 
                          ? "border-gold bg-card/80 shadow-lg shadow-gold/10" 
                          : "border-gold/20 bg-card/40 hover:border-gold/40"
                      }`}>
                        {/* Selection indicator */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${pass.gradient} transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} />
                        
                        <div className="p-5 pl-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${pass.gradient} shadow-lg`}>
                                <IconComponent className="w-5 h-5 text-charcoal" />
                              </div>
                              <div>
                                <h3 className="font-heading text-lg text-foreground">{pass.name}</h3>
                                <p className="text-xs text-silver/60">{pass.tagline}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-heading text-foreground">₹{pass.price}</div>
                              <p className="text-xs text-silver/50">per person</p>
                            </div>
                          </div>
                          
                          {/* Expanded features when selected */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-gold/20 animate-fade-in">
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {pass.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-silver/80">
                                    <Check className="w-4 h-4 text-teal flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Disclaimer */}
                <div className="mt-8 p-4 bg-muted/30 border border-muted-foreground/20 rounded-xl">
                  <p className="text-xs text-silver/60 leading-relaxed">
                    <span className="text-silver font-medium">Note:</span> Presentations and abstract submissions for Scientific Events and Online Literary Events do not require a delegate pass.
                  </p>
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

export default DelegatePassPage;
