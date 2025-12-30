import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { categories } from "@/data/events";
import { ArrowLeft, Users, Clock, DollarSign, Phone, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EventRegistrationPage() {
  const { categoryId, eventId } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const event = category?.events.find((e) => e.id === eventId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Registration Successful!",
        description: `You have been registered for ${event?.title}. Check your email for confirmation.`,
      });
    }, 1500);
  };

  if (!category || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Event Not Found</h1>
          <Link to="/events" className="text-secondary hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Register for {event.title} - ADWAITA 2026</title>
        <meta name="description" content={`Register for ${event.title} at ADWAITA 2026. Entry fee: ₹${event.fee}`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <Link
              to={`/events/${categoryId}`}
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span>Back to {category.title}</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <span className="text-secondary text-sm font-medium">{category.title}</span>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mt-2">
                    {event.title}
                  </h1>
                </div>

                {/* Event Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/20">
                  <img
                    src={`/api/placeholder/800/450`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === "Open" ? "bg-secondary text-secondary-foreground" :
                      event.status === "Coming Soon" ? "bg-accent text-accent-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <DollarSign className="text-secondary mb-2" size={20} />
                    <p className="text-silver/70 text-xs">Entry Fee</p>
                    <p className="text-primary font-bold text-lg">₹{event.fee}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <Users className="text-secondary mb-2" size={20} />
                    <p className="text-silver/70 text-xs">Team Type</p>
                    <p className="text-primary font-bold text-lg">{event.teamType}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <Clock className="text-secondary mb-2" size={20} />
                    <p className="text-silver/70 text-xs">Duration</p>
                    <p className="text-primary font-bold text-lg">{event.duration}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                    <Trophy className="text-secondary mb-2" size={20} />
                    <p className="text-silver/70 text-xs">1st Prize</p>
                    <p className="text-primary font-bold text-lg">₹{event.prizes.first.toLocaleString()}</p>
                  </div>
                </div>

                {/* Rules */}
                <div className="bg-muted/20 rounded-lg p-5 border border-primary/20">
                  <h3 className="font-serif text-primary font-bold mb-3">Rules & Guidelines</h3>
                  <ul className="space-y-2">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="text-silver/80 text-sm flex items-start gap-2">
                        <span className="text-secondary mt-1">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div className="bg-secondary/10 rounded-lg p-5 border-l-4 border-secondary">
                  <p className="text-silver/70 text-xs mb-1">Event Incharge</p>
                  <p className="text-primary font-semibold">{event.incharge.name}</p>
                  <a
                    href={`tel:${event.incharge.phone}`}
                    className="text-silver text-sm flex items-center gap-2 mt-1 hover:text-secondary transition-colors"
                  >
                    <Phone size={14} />
                    {event.incharge.phone}
                  </a>
                </div>
              </div>

              {/* Registration Form */}
              <div className="bg-muted/20 rounded-xl p-6 md:p-8 border border-primary/20 h-fit lg:sticky lg:top-24">
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Register Now
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-silver">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      required
                      className="bg-background/50 border-primary/40 text-silver placeholder:text-silver/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-silver">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="bg-background/50 border-primary/40 text-silver placeholder:text-silver/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-silver">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      className="bg-background/50 border-primary/40 text-silver placeholder:text-silver/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-silver">College Name *</Label>
                    <Input
                      id="college"
                      placeholder="Enter your college name"
                      required
                      className="bg-background/50 border-primary/40 text-silver placeholder:text-silver/50"
                    />
                  </div>

                  {event.teamType !== "Individual" && (
                    <div className="space-y-2">
                      <Label htmlFor="teamName" className="text-silver">Team Name *</Label>
                      <Input
                        id="teamName"
                        placeholder="Enter your team name"
                        required
                        className="bg-background/50 border-primary/40 text-silver placeholder:text-silver/50"
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-primary/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-silver">Registration Fee</span>
                      <span className="text-primary font-bold text-xl">₹{event.fee}</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || event.status === "Closed"}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6"
                    >
                      {isSubmitting ? "Processing..." : event.status === "Closed" ? "Registration Closed" : "Complete Registration"}
                    </Button>

                    <p className="text-silver/50 text-xs text-center mt-3">
                      Deadline: {event.deadline}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
