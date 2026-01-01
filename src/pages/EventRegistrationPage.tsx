import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Upload, Users, IndianRupee, Trophy, Clock, Phone, X, CheckCircle2, Loader2, QrCode, Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/events";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import paymentQR from "@/assets/payment-qr.jpg";

interface TeamMember {
  name: string;
  phone: string;
  year: string;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const EventRegistrationPage = () => {
  const { categoryId, eventId } = useParams<{ categoryId: string; eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Support brochure-friendly category slugs (aliases)
  const CATEGORY_SLUG_ALIASES: Record<string, string> = {
    "literature-and-debate": "literature",
    "other-events": "other",
    graphics: "graphix",
  };

  const resolvedCategoryId = categoryId ? (CATEGORY_SLUG_ALIASES[categoryId] ?? categoryId) : undefined;

  // Find the event from categories data
  const category = categories.find((c) => c.id === resolvedCategoryId);
  const eventInfo = category?.events.find((e) => e.id === eventId);

  // Parse team size from teamType
  const getTeamSize = () => {
    if (!eventInfo) return 1;
    const teamTypeMatch = eventInfo.teamType.match(/\d+/);
    if (teamTypeMatch) return parseInt(teamTypeMatch[0]);
    if (eventInfo.teamType.toLowerCase().includes("individual")) return 1;
    return 1;
  };

  const teamSize = getTeamSize();

  const [members, setMembers] = useState<TeamMember[]>([{ name: "", phone: "", year: "" }]);
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [participantCategory, setParticipantCategory] = useState("student");
  const [delegateId, setDelegateId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  // Initialize team members based on event team size
  useEffect(() => {
    if (teamSize > 1) {
      const initialMembers: TeamMember[] = [];
      for (let i = 0; i < teamSize; i++) {
        initialMembers.push({ name: "", phone: "", year: "" });
      }
      setMembers(initialMembers);
    }
  }, [teamSize]);

  // Handle 404 if event not found
  if (!eventInfo || !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-primary mb-4">Event Not Found</h1>
          <p className="text-silver mb-8">The event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/events")} variant="outline">
            Browse All Events
          </Button>
        </div>
      </div>
    );
  }

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

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

  const validateForm = () => {
    // Validate all team members
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) {
        toast({
          title: "Missing information",
          description: `Please enter name for ${teamSize > 1 ? `Team Member ${i + 1}` : "yourself"}`,
          variant: "destructive",
        });
        return false;
      }
      if (!members[i].phone.trim()) {
        toast({
          title: "Missing information",
          description: `Please enter phone number for ${teamSize > 1 ? `Team Member ${i + 1}` : "yourself"}`,
          variant: "destructive",
        });
        return false;
      }
      if (!members[i].year) {
        toast({
          title: "Missing information",
          description: `Please select year of study for ${teamSize > 1 ? `Team Member ${i + 1}` : "yourself"}`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (!email.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!institution.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your institution name",
        variant: "destructive",
      });
      return false;
    }

    // Payment screenshot required for paid events
    if (eventInfo.fee > 0 && !paymentScreenshot) {
      toast({
        title: "Payment screenshot required",
        description: "Please upload your payment screenshot to complete registration",
        variant: "destructive",
      });
      return false;
    }

    // Delegate ID validation for events requiring it
    if (eventInfo.fee > 0 && !delegateId.trim()) {
      toast({
        title: "Delegate ID required",
        description: "Please enter your delegate ID. Get one from the Delegate Pass page.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate registration ID
      const regId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Upload payment screenshot if exists
      let paymentScreenshotUrl = null;
      if (paymentScreenshot) {
        const fileExt = paymentScreenshot.name.split('.').pop();
        const fileName = `${regId}_${Date.now()}.${fileExt}`;

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
      }

      // Save registration to database
      const { error } = await supabase.from('registrations').insert({
        registration_id: regId,
        event_id: eventInfo.id,
        event_name: eventInfo.title,
        category_name: category.title,
        name: members[0].name.trim(),
        email: email.trim().toLowerCase(),
        phone: members[0].phone.trim(),
        year: members[0].year,
        institution: institution.trim(),
        participant_category: participantCategory,
        team_members: members as unknown as Json,
        fee_amount: eventInfo.fee,
        payment_screenshot_url: paymentScreenshotUrl,
        delegate_id: delegateId.trim() || null,
        coupon_code: coupon.trim() || null,
      });

      if (error) {
        console.error('Error saving registration:', error);
        throw error;
      }

      setRegistrationId(regId);
      setIsSuccess(true);
      
      toast({
        title: "Registration successful!",
        description: `Your registration ID is ${regId}`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Registration Successful | {eventInfo.title} | ADWAITA 2026</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
              <div className="bg-card border border-gold/30 rounded-3xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-charcoal" />
                </div>
                <h1 className="font-heading text-3xl text-foreground mb-4">Registration Successful!</h1>
                <p className="text-silver mb-6">You have successfully registered for {eventInfo.title}</p>
                
                <div className="bg-background/50 border border-gold/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-silver/70 mb-1">Your Registration ID</p>
                  <p className="text-2xl font-heading text-gold">{registrationId}</p>
                </div>

                <p className="text-sm text-silver/60 mb-8">
                  Please save this ID for future reference. A confirmation email will be sent to {email}.
                </p>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/")} variant="outline">
                    Back to Home
                  </Button>
                  <Button onClick={() => navigate("/events")} className="bg-gradient-to-r from-gold to-primary text-charcoal">
                    Browse More Events
                  </Button>
                </div>
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
        <title>Register for {eventInfo.title} | ADWAITA 2026</title>
        <meta name="description" content={`Register for ${eventInfo.title} at ADWAITA 2026. ${eventInfo.description}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <Link
              to={`/events/${categoryId}`}
              className="inline-flex items-center gap-2 text-silver/70 hover:text-gold transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to {category.title}</span>
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Event Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-card/80 border border-gold/30 rounded-2xl overflow-hidden">
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-gold/20 via-primary/10 to-teal/20 p-6 border-b border-gold/20">
                      <span className="text-xs text-gold uppercase tracking-widest">{category.title}</span>
                      <h1 className="font-heading text-2xl text-foreground mt-2">{eventInfo.title}</h1>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-silver/70 text-sm leading-relaxed">{eventInfo.description}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/50 rounded-xl p-3 text-center">
                          <IndianRupee className="w-5 h-5 text-gold mx-auto mb-1" />
                          <p className="text-lg font-heading text-foreground">₹{eventInfo.fee}</p>
                          <p className="text-xs text-silver/50">Entry Fee</p>
                        </div>
                        <div className="bg-background/50 rounded-xl p-3 text-center">
                          <Users className="w-5 h-5 text-teal mx-auto mb-1" />
                          <p className="text-lg font-heading text-foreground">{eventInfo.teamType}</p>
                          <p className="text-xs text-silver/50">Team Type</p>
                        </div>
                        <div className="bg-background/50 rounded-xl p-3 text-center">
                          <Calendar className="w-5 h-5 text-secondary mx-auto mb-1" />
                          <p className="text-sm font-medium text-foreground">{eventInfo.day}</p>
                          <p className="text-xs text-silver/50">Event Day</p>
                        </div>
                        <div className="bg-background/50 rounded-xl p-3 text-center">
                          <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
                          <p className="text-sm font-medium text-foreground">{eventInfo.duration}</p>
                          <p className="text-xs text-silver/50">Duration</p>
                        </div>
                      </div>

                      {/* Prizes */}
                      <div className="bg-gradient-to-br from-gold/10 to-primary/5 border border-gold/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy className="w-5 h-5 text-gold" />
                          <span className="font-heading text-foreground">Prize Pool</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="text-gold font-bold">₹{eventInfo.prizes.first.toLocaleString()}</p>
                            <p className="text-xs text-silver/50">1st</p>
                          </div>
                          <div>
                            <p className="text-silver font-bold">₹{eventInfo.prizes.second.toLocaleString()}</p>
                            <p className="text-xs text-silver/50">2nd</p>
                          </div>
                          <div>
                            <p className="text-amber-700 font-bold">₹{eventInfo.prizes.third.toLocaleString()}</p>
                            <p className="text-xs text-silver/50">3rd</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl">
                        <Phone className="w-4 h-4 text-teal" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{eventInfo.incharge.name}</p>
                          <a href={`tel:${eventInfo.incharge.phone}`} className="text-xs text-teal hover:underline">
                            {eventInfo.incharge.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Team Members */}
                  <div className="bg-card/80 border border-gold/30 rounded-2xl p-6">
                    <h2 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold" />
                      {teamSize > 1 ? "Team Members" : "Your Details"}
                    </h2>

                    <div className="space-y-6">
                      {members.map((member, index) => (
                        <div key={index} className="bg-background/50 border border-gold/10 rounded-xl p-4">
                          {teamSize > 1 && (
                            <p className="text-sm font-medium text-gold mb-4">
                              {index === 0 ? "Team Leader" : `Member ${index + 1}`}
                            </p>
                          )}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-silver/70">Full Name <span className="text-accent">*</span></Label>
                              <Input
                                value={member.name}
                                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                placeholder="Enter full name"
                                className="bg-background/50 border-gold/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-silver/70">Phone <span className="text-accent">*</span></Label>
                              <Input
                                value={member.phone}
                                onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                                className="bg-background/50 border-gold/20"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-silver/70">Year <span className="text-accent">*</span></Label>
                              <Select value={member.year} onValueChange={(val) => handleMemberChange(index, "year", val)}>
                                <SelectTrigger className="bg-background/50 border-gold/20">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1st Year">1st Year</SelectItem>
                                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                                  <SelectItem value="Final Year">Final Year</SelectItem>
                                  <SelectItem value="Intern">Intern</SelectItem>
                                  <SelectItem value="PG">PG</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Institution */}
                  <div className="bg-card/80 border border-gold/30 rounded-2xl p-6">
                    <h2 className="font-heading text-xl text-foreground mb-6">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-silver/70">Email <span className="text-accent">*</span></Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="bg-background/50 border-gold/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-silver/70">Institution <span className="text-accent">*</span></Label>
                        <Input
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="Your college/university name"
                          className="bg-background/50 border-gold/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-silver/70">Participant Category</Label>
                        <Select value={participantCategory} onValueChange={setParticipantCategory}>
                          <SelectTrigger className="bg-background/50 border-gold/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="alumni">Alumni</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {eventInfo.fee > 0 && (
                        <div className="space-y-2">
                          <Label className="text-silver/70">
                            Delegate ID <span className="text-accent">*</span>
                          </Label>
                          <Input
                            value={delegateId}
                            onChange={(e) => setDelegateId(e.target.value)}
                            placeholder="DEL-XXXXXX"
                            className="bg-background/50 border-gold/20"
                          />
                          <p className="text-xs text-silver/50">
                            Don't have one? <Link to="/delegate-pass" className="text-teal hover:underline">Get Delegate Pass</Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Section */}
                  {eventInfo.fee > 0 && (
                    <div className="bg-card/80 border border-gold/30 rounded-2xl p-6">
                      <h2 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-gold" />
                        Payment Details
                      </h2>

                      <div className="bg-gradient-to-r from-gold/10 to-teal/10 border border-gold/20 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-silver">Registration Fee</span>
                          <span className="text-2xl font-heading text-gold">₹{eventInfo.fee}</span>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="bg-background/50 border border-gold/20 rounded-xl p-6 mb-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="flex items-center gap-2 mb-4">
                            <QrCode className="w-5 h-5 text-gold" />
                            <span className="text-sm font-medium text-foreground">Scan to Pay</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl shadow-lg mb-4">
                            <img src={paymentQR} alt="Payment QR Code" className="w-48 h-48 object-contain" />
                          </div>
                          <p className="text-xs text-silver/60">Scan this QR code with any UPI app</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-silver/70">Coupon Code</Label>
                          <Input
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            placeholder="Enter coupon code"
                            className="bg-background/50 border-gold/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-silver/70">Payment Screenshot <span className="text-accent">*</span></Label>
                          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-background/50 border border-dashed border-gold/30 rounded-xl cursor-pointer hover:border-gold/50 transition-colors">
                            {paymentScreenshot ? (
                              <div className="flex items-center gap-2 text-teal">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm truncate max-w-[150px]">{paymentScreenshot.name}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPaymentScreenshot(null);
                                  }}
                                  className="text-silver/50 hover:text-red-400"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-silver/50" />
                                <span className="text-silver/50 text-sm">Upload screenshot</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || eventInfo.status === "Closed"}
                    className="w-full py-6 bg-gradient-to-r from-gold to-primary text-charcoal font-semibold text-lg hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Registering...
                      </div>
                    ) : eventInfo.status === "Closed" ? (
                      "Registration Closed"
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EventRegistrationPage;
