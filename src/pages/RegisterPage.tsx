import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Upload, Users, IndianRupee, Trophy, Clock, Phone, X, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/events";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import paymentQR from "@/assets/payment-qr.jpg";
import { sendEventRegistrationEmail } from "@/lib/emailService";

// Build EVENT_INFO map from categories data
interface EventInfo {
  id: string;
  name: string;
  price: number;
  prize: number;
  delegateRequired: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  isVariableTeam: boolean;
  category: string;
  categoryId: string;
  day: string;
  duration: string;
  description: string;
  incharge: { name: string; phone: string };
}

const parseTeamSize = (teamType: string): { min: number; max: number; isVariable: boolean } => {
  if (teamType.toLowerCase().includes("individual")) {
    return { min: 1, max: 1, isVariable: false };
  }
  
  // Match patterns like "Group (4-8)", "Team (2-8)", "Group (8-15)"
  const rangeMatch = teamType.match(/\((\d+)-(\d+)\)/);
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2]),
      isVariable: true
    };
  }
  
  // Match patterns like "Team (3)" or just extract first number
  const singleMatch = teamType.match(/\d+/);
  if (singleMatch) {
    const size = parseInt(singleMatch[0]);
    return { min: size, max: size, isVariable: false };
  }
  
  return { min: 1, max: 1, isVariable: false };
};

const buildEventInfoMap = (): Record<string, EventInfo> => {
  const map: Record<string, EventInfo> = {};
  categories.forEach((category) => {
    category.events.forEach((event) => {
      const { min, max, isVariable } = parseTeamSize(event.teamType);
      
      map[event.id] = {
        id: event.id,
        name: event.title,
        price: event.fee,
        prize: event.prizes.first,
        delegateRequired: event.fee > 0,
        teamSizeMin: min,
        teamSizeMax: max,
        isVariableTeam: isVariable,
        category: event.category,
        categoryId: category.id,
        day: event.day,
        duration: event.duration,
        description: event.description,
        incharge: event.incharge,
      };
    });
  });
  return map;
};

const EVENT_INFO = buildEventInfoMap();

interface TeamMember {
  name: string;
  phone: string;
  year: string;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const eventKey = searchParams.get("event") || "";
  const eventInfo = EVENT_INFO[eventKey];
  
  const [members, setMembers] = useState<TeamMember[]>([{ name: "", phone: "", year: "" }]);
  const [selectedTeamSize, setSelectedTeamSize] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [category, setCategory] = useState("student");
  const [delegateId, setDelegateId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  // Initialize team members based on event team size
  useEffect(() => {
    if (eventInfo) {
      if (eventInfo.isVariableTeam) {
        // For variable teams, start with minimum and let user select
        setSelectedTeamSize(eventInfo.teamSizeMin);
        const initialMembers: TeamMember[] = [];
        for (let i = 0; i < eventInfo.teamSizeMin; i++) {
          initialMembers.push({ name: "", phone: "", year: "" });
        }
        setMembers(initialMembers);
      } else if (eventInfo.teamSizeMin > 1) {
        setSelectedTeamSize(eventInfo.teamSizeMin);
        const initialMembers: TeamMember[] = [];
        for (let i = 0; i < eventInfo.teamSizeMin; i++) {
          initialMembers.push({ name: "", phone: "", year: "" });
        }
        setMembers(initialMembers);
      }
    }
  }, [eventInfo]);

  // Handle team size change for variable teams
  const handleTeamSizeChange = (newSize: number) => {
    setSelectedTeamSize(newSize);
    const newMembers: TeamMember[] = [];
    for (let i = 0; i < newSize; i++) {
      // Preserve existing member data if available
      if (members[i]) {
        newMembers.push(members[i]);
      } else {
        newMembers.push({ name: "", phone: "", year: "" });
      }
    }
    setMembers(newMembers);
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const validatePhone = (phone: string): boolean => {
    const pattern = /^(\+91\d{10}|\d{10})$/;
    return pattern.test(phone.replace(/\s/g, ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Payment screenshot must be less than 4MB",
          variant: "destructive",
        });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const uploadPaymentScreenshot = async (file: File, regId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${regId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(fileName, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For teams > 2: Only captain needs full details
    // For teams <= 2: All members need full details
    const requireFullDetailsForAll = selectedTeamSize <= 2;

    // Validate captain always needs full details
    if (!members[0].name || !members[0].phone || !email || !institution) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate other team members
    for (let i = 1; i < members.length; i++) {
      if (!members[i].name) {
        toast({
          title: "Missing team member name",
          description: `Please enter name for Member ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
      // For teams <= 2, validate phone for all members
      if (requireFullDetailsForAll && !members[i].phone) {
        toast({
          title: "Missing phone number",
          description: `Please enter phone for Member ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
      if (requireFullDetailsForAll && !validatePhone(members[i].phone)) {
        toast({
          title: "Invalid phone number",
          description: `Member ${i + 1}'s phone must be 10 digits or +91 followed by 10 digits`,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate captain's phone
    if (!validatePhone(members[0].phone)) {
      toast({
        title: "Invalid phone number",
        description: "Phone must be 10 digits or +91 followed by 10 digits",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Payment screenshot required for paid events
    if (eventInfo.price > 0 && !paymentScreenshot) {
      toast({
        title: "Payment screenshot required",
        description: "Please upload your payment screenshot to complete registration",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate registration ID
      const timestamp = Date.now().toString();
      const regId = `EVT-${timestamp.slice(-6)}`;

      // Upload payment screenshot if provided
      let paymentUrl: string | null = null;
      if (paymentScreenshot) {
        paymentUrl = await uploadPaymentScreenshot(paymentScreenshot, regId);
        if (!paymentUrl) {
          toast({
            title: "Upload failed",
            description: "Failed to upload payment screenshot. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Insert registration into database
      const { error: insertError } = await supabase
        .from('registrations')
        .insert({
          registration_id: regId,
          event_id: eventInfo.id,
          event_name: eventInfo.name,
          category_name: eventInfo.category,
          name: members[0].name,
          email: email,
          phone: members[0].phone,
          year: members[0].year || null,
          institution: institution,
          participant_category: category,
          team_members: members as unknown as Json,
          delegate_id: delegateId || null,
          coupon_code: coupon || null,
          payment_screenshot_url: paymentUrl,
          fee_amount: eventInfo.price,
        });

      if (insertError) {
        console.error('Error inserting registration:', insertError);
        throw new Error('Failed to save registration');
      }

      setRegistrationId(regId);
      setIsSuccess(true);

      // Send confirmation email to college
      sendEventRegistrationEmail({
        registrationId: regId,
        eventName: eventInfo.name,
        categoryName: eventInfo.category,
        captainName: members[0].name.trim(),
        captainPhone: members[0].phone.trim(),
        captainYear: members[0].year,
        email: email.trim().toLowerCase(),
        institution: institution.trim(),
        teamMembers: members,
        feeAmount: eventInfo.price,
        delegateId: delegateId.trim() || undefined,
        couponCode: coupon.trim() || undefined,
        participantCategory: category,
        payment_screenshot_url: paymentUrl || undefined,
      }).catch(err => console.error('Email send failed:', err));

      toast({
        title: "Registration Successful!",
        description: `Your registration ID is ${regId}`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Event not found
  if (!eventInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-primary mb-4">Event Not Found</h1>
          <p className="text-silver/70 mb-6">
            The event you're looking for doesn't exist or the link is invalid.
          </p>
          <Link to="/events">
            <Button className="bg-secondary hover:bg-secondary/90">
              <ArrowLeft className="mr-2" size={16} />
              Browse All Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Helmet>
          <title>Registration Successful | ADWAITA 2026</title>
        </Helmet>
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-secondary" />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">Registration Successful!</h1>
          <p className="text-silver/70 mb-6">
            You have successfully registered for <span className="text-secondary font-semibold">{eventInfo.name}</span>
          </p>
          <div className="bg-muted/30 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-silver/70 text-sm mb-1">Your Registration ID</p>
            <p className="text-2xl font-mono text-primary font-bold">{registrationId}</p>
          </div>
          <p className="text-silver/50 text-sm mb-6">
            A confirmation has been recorded for <span className="text-silver">{email}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/events">
              <Button variant="outline" className="border-primary/30">
                Browse More Events
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-secondary hover:bg-secondary/90">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Register for {eventInfo.name} | ADWAITA 2026</title>
        <meta name="description" content={`Register for ${eventInfo.name} at ADWAITA 2026. ${eventInfo.description}`} />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-primary/10">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-silver/70 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back to Events</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <p className="text-secondary text-sm font-medium mb-2">{eventInfo.category}</p>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-3">
                {eventInfo.name}
              </h1>
              <p className="text-silver/70 max-w-2xl">{eventInfo.description}</p>
            </div>

            {/* Event Quick Info */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-muted/30 border border-primary/20 rounded-lg px-4 py-2 text-center min-w-[100px]">
                <IndianRupee size={16} className="text-secondary mx-auto mb-1" />
                <p className="text-primary font-bold">₹{eventInfo.price}</p>
                <p className="text-silver/50 text-xs">Fee</p>
              </div>
              <div className="bg-muted/30 border border-primary/20 rounded-lg px-4 py-2 text-center min-w-[100px]">
                <Users size={16} className="text-secondary mx-auto mb-1" />
                <p className="text-primary font-bold">
                  {eventInfo.isVariableTeam ? `${eventInfo.teamSizeMin}-${eventInfo.teamSizeMax}` : eventInfo.teamSizeMin}
                </p>
                <p className="text-silver/50 text-xs">Team Size</p>
              </div>
              <div className="bg-muted/30 border border-primary/20 rounded-lg px-4 py-2 text-center min-w-[100px]">
                <Trophy size={16} className="text-secondary mx-auto mb-1" />
                <p className="text-primary font-bold">₹{(eventInfo.prize / 1000).toFixed(0)}K</p>
                <p className="text-silver/50 text-xs">1st Prize</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Team Members Section */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-serif text-primary mb-6 flex items-center gap-2">
                <Users size={20} className="text-secondary" />
                {selectedTeamSize > 1 ? "Team Members" : "Participant Details"}
              </h2>

              {/* Team Size Selector for variable teams */}
              {eventInfo.isVariableTeam && (
                <div className="mb-6">
                  <Label className="text-silver/70 mb-2 block">
                    How many team members? <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={selectedTeamSize.toString()}
                    onValueChange={(value) => handleTeamSizeChange(parseInt(value))}
                  >
                    <SelectTrigger className="bg-background border-primary/20 text-silver w-full max-w-xs">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: eventInfo.teamSizeMax - eventInfo.teamSizeMin + 1 },
                        (_, i) => eventInfo.teamSizeMin + i
                      ).map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} Members
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-silver/50 text-xs mt-2">
                    Team size must be between {eventInfo.teamSizeMin} and {eventInfo.teamSizeMax} members
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="bg-background/50 border border-primary/10 rounded-lg p-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="text-silver/70 text-sm mb-4">
                      {selectedTeamSize > 1 ? `Member ${index + 1}` : "Your Details"}
                      {index === 0 && selectedTeamSize > 2 && (
                        <span className="text-secondary ml-2">(Team Captain - Full Details Required)</span>
                      )}
                    </p>
                    
                    {/* For teams > 2 members: Team Captain (index 0) gets full form, others only name */}
                    {/* For teams <= 2 members: Everyone gets full form */}
                    {(index === 0 || selectedTeamSize <= 2) ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`name-${index}`} className="text-silver/70">
                            Full Name <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id={`name-${index}`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                            placeholder="Enter full name"
                            className="bg-background border-primary/20 text-silver mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${index}`} className="text-silver/70">
                            Phone <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id={`phone-${index}`}
                            value={member.phone}
                            onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                            placeholder="+91 or 10 digits"
                            className="bg-background border-primary/20 text-silver mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`year-${index}`} className="text-silver/70">
                            Year of Study
                          </Label>
                          <Select
                            value={member.year}
                            onValueChange={(value) => handleMemberChange(index, "year", value)}
                          >
                            <SelectTrigger className="bg-background border-primary/20 text-silver mt-1">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                              <SelectItem value="5">5th Year</SelectItem>
                              <SelectItem value="pg">Post Graduate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      /* Other team members only need name */
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor={`name-${index}`} className="text-silver/70">
                            Full Name <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id={`name-${index}`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                            placeholder="Enter team member's name"
                            className="bg-background border-primary/20 text-silver mt-1"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedTeamSize > 2 && (
                <p className="text-silver/50 text-xs mt-4 italic">
                  * Only the Team Captain's complete details are required. Other team members only need to provide their names.
                </p>
              )}
            </div>

            {/* Contact & Institution */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-serif text-primary mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-silver/70">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-background border-primary/20 text-silver mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="institution" className="text-silver/70">
                    Institution/College <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Enter your college name"
                    className="bg-background border-primary/20 text-silver mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-silver/70">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-background border-primary/20 text-silver mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="delegateId" className="text-silver/70">
                    Delegate ID <span className="text-silver/50">(if applicable)</span>
                  </Label>
                  <Input
                    id="delegateId"
                    value={delegateId}
                    onChange={(e) => setDelegateId(e.target.value)}
                    placeholder="Enter delegate ID"
                    className="bg-background border-primary/20 text-silver mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-serif text-primary mb-6 flex items-center gap-2">
                <IndianRupee size={20} className="text-secondary" />
                Payment Details
              </h2>

              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-silver">Registration Fee</span>
                  <span className="text-2xl font-bold text-primary">₹{eventInfo.price}</span>
                </div>
              </div>

              {/* Payment QR Code */}
              <div className="bg-background/50 border border-primary/20 rounded-xl p-6 mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode size={20} className="text-secondary" />
                    <span className="text-silver font-medium">Scan to Pay</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-lg mb-4">
                    <img 
                      src={paymentQR} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="text-xs text-silver/60">
                    Scan this QR code with any UPI app to make payment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="coupon" className="text-silver/70">
                    Coupon Code <span className="text-silver/50">(optional)</span>
                  </Label>
                  <Input
                    id="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="bg-background border-primary/20 text-silver mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="screenshot" className="text-silver/70">
                    Payment Screenshot <span className="text-accent">*</span>
                  </Label>
                  <div className="mt-1">
                    <label
                      htmlFor="screenshot"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-background border border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {paymentScreenshot ? (
                        <div className="flex items-center gap-2 text-secondary">
                          <CheckCircle2 size={16} />
                          <span className="text-sm truncate max-w-[200px]">{paymentScreenshot.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setPaymentScreenshot(null);
                            }}
                            className="text-silver/50 hover:text-red-400"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={16} className="text-silver/50" />
                          <span className="text-silver/50 text-sm">Upload screenshot (max 4MB)</span>
                        </>
                      )}
                    </label>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Incharge */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-serif text-primary mb-4">Need Help?</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="text-silver font-medium">{eventInfo.incharge.name}</p>
                  <p className="text-silver/50 text-sm">Event Incharge</p>
                  <a
                    href={`tel:${eventInfo.incharge.phone}`}
                    className="text-secondary hover:underline text-sm"
                  >
                    {eventInfo.incharge.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
