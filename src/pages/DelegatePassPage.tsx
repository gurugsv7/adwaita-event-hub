import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Crown, Star, Zap, Music, Disc3, Users, Check, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet";

const passes = [
  {
    id: "platinum",
    name: "PLATINUM",
    price: 850,
    tagline: "Top Tier Access",
    icon: Crown,
    color: "gold",
    gradient: "from-gold via-primary to-gold",
    borderColor: "border-gold",
    features: [
      "Access to Pro-Show",
      "Access to Pro-Band performance",
      "Access to all three DJ nights",
      "All event participation included",
      "Priority entry to all venues",
    ],
    popular: true,
  },
  {
    id: "gold",
    name: "GOLD",
    price: 450,
    tagline: "Premium Experience",
    icon: Star,
    color: "teal",
    gradient: "from-teal via-secondary to-teal",
    borderColor: "border-teal",
    features: [
      "Access to one Pro-Band performance",
      "Access to Day 1 & Day 2 DJ nights",
      "All event participation included",
      "Standard entry to all venues",
    ],
    popular: false,
  },
  {
    id: "silver",
    name: "SILVER",
    price: 250,
    tagline: "Essential Access",
    icon: Zap,
    color: "silver",
    gradient: "from-muted-foreground via-silver to-muted-foreground",
    borderColor: "border-muted-foreground/50",
    features: [
      "Participate in all events",
      "Access to Day 1 DJ night",
      "Entry to all event venues",
    ],
    popular: false,
  },
];

const DelegatePassPage = () => {
  return (
    <>
      <Helmet>
        <title>Delegate Pass | ADWAITA 2026</title>
        <meta
          name="description"
          content="Get your delegate pass for ADWAITA 2026. Choose from Platinum, Gold, or Silver passes for exclusive access to pro-shows, DJ nights, and events."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="relative pt-24 pb-16 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[5%] w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-[10%] w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            
            {/* Geometric patterns */}
            <div className="absolute top-32 left-[8%] w-20 h-20 border border-gold/10 rotate-45" />
            <div className="absolute top-48 right-[12%] w-16 h-16 border border-teal/10 rotate-12" />
            <div className="absolute bottom-40 right-[25%] w-24 h-24 border border-primary/10 -rotate-12" />
            
            {/* Floating music notes decorative */}
            <Music className="absolute top-36 right-[20%] w-8 h-8 text-gold/10 animate-bounce" style={{ animationDelay: "0.5s" }} />
            <Disc3 className="absolute bottom-32 left-[15%] w-10 h-10 text-teal/10 animate-spin" style={{ animationDuration: "8s" }} />
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

            {/* Header section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-gold tracking-wide uppercase">Choose Your Experience</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                DELEGATE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-teal">
                  PASSES
                </span>
              </h1>
              
              <p className="text-lg text-silver/70 max-w-2xl mx-auto">
                Your gateway to the ultimate ADWAITA 2026 experience. Select the pass that matches your vibe.
              </p>
            </div>

            {/* Passes grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {passes.map((pass, index) => {
                const IconComponent = pass.icon;
                return (
                  <div
                    key={pass.id}
                    className="relative group animate-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Popular badge */}
                    {pass.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <div className="px-4 py-1 bg-gradient-to-r from-gold to-primary rounded-full text-xs font-bold text-charcoal uppercase tracking-wider shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-b ${pass.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                    {/* Card */}
                    <div className={`relative h-full bg-card/60 backdrop-blur-sm border-2 ${pass.borderColor} ${pass.popular ? "border-opacity-100" : "border-opacity-30"} rounded-2xl overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300`}>
                      {/* Top gradient bar */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${pass.gradient}`} />

                      {/* Inner content */}
                      <div className="p-6 lg:p-8">
                        {/* Icon and name */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${pass.gradient} shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-charcoal" />
                          </div>
                          <div>
                            <h3 className="font-heading text-xl text-foreground tracking-wider">{pass.name}</h3>
                            <p className="text-xs text-silver/60 uppercase tracking-wide">{pass.tagline}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl text-silver/60">₹</span>
                            <span className={`text-5xl lg:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r ${pass.gradient}`}>
                              {pass.price}
                            </span>
                          </div>
                          <p className="text-sm text-silver/50 mt-1">per person</p>
                        </div>

                        {/* Divider */}
                        <div className={`h-px w-full bg-gradient-to-r from-transparent via-${pass.color}/30 to-transparent mb-6`} />

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                          {pass.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${pass.gradient}`}>
                                <Check className="w-3 h-3 text-charcoal" />
                              </div>
                              <span className="text-sm text-silver/80">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                          className={`w-full py-4 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                            pass.popular
                              ? "bg-gradient-to-r from-gold to-primary text-charcoal hover:shadow-lg hover:shadow-gold/25"
                              : "bg-muted/50 border border-muted-foreground/20 text-foreground hover:bg-muted hover:border-gold/50"
                          }`}
                        >
                          Get {pass.name} Pass
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom info section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-teal/20 to-gold/20 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-card/40 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold/10 rounded-xl">
                      <Users className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg text-foreground mb-2">Group Registrations</h4>
                      <p className="text-silver/70 text-sm leading-relaxed">
                        Planning to come with friends? Contact our team for special group discounts on bulk pass purchases. 
                        Reach out to us at <span className="text-teal">delegates@adwaita2026.in</span> for more information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-sm text-silver/40 mt-8 italic">
                Abstract submissions for Scientific Events and Online Literary Events do not require a delegate pass.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DelegatePassPage;
