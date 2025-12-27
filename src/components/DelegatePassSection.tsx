import { Link } from "react-router-dom";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";

export const DelegatePassSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background with gradient mesh effect */}
      <div className="absolute inset-0 gradient-stats" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,hsl(var(--primary)/0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,hsl(var(--gold)/0.1),transparent)]" />
      
      {/* Floating geometric accents */}
      <div className="absolute top-10 left-[10%] w-32 h-32 border border-primary/20 rotate-45 animate-pulse" />
      <div className="absolute bottom-10 right-[15%] w-24 h-24 border border-gold/20 rotate-12" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main card with glassmorphism */}
          <div className="relative group">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-gold/20 to-teal/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            <div className="relative bg-muted/40 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 md:p-12 overflow-hidden">
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
              
              {/* Content grid */}
              <div className="relative grid md:grid-cols-[1fr,auto] gap-8 items-center">
                {/* Left content */}
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 rounded-full">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-gold tracking-wide uppercase">Essential Access</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                    Your Gateway to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-primary to-teal">
                      ADWAITA 2026
                    </span>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-lg text-silver/80 leading-relaxed max-w-xl">
                    Unlock access to all on-ground events, workshops, and exclusive experiences. 
                    The Delegate Pass is your key to the complete ADWAITA journey.
                  </p>
                  
                  {/* Disclaimer */}
                  <p className="text-sm text-silver/50 italic border-l-2 border-gold/40 pl-4">
                    Abstract submissions for Scientific Events and Online Literary Events do not require a delegate pass.
                  </p>
                </div>
                
                {/* Right side - Pass visual */}
                <div className="relative flex flex-col items-center gap-6">
                  {/* Stylized pass card */}
                  <div className="relative w-48 h-64 group/pass cursor-pointer">
                    {/* Card glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/40 to-primary/40 rounded-xl blur-lg opacity-60 group-hover/pass:opacity-100 transition-opacity" />
                    
                    {/* Card itself */}
                    <div className="relative h-full bg-gradient-to-br from-charcoal via-muted to-charcoal border border-gold/50 rounded-xl p-4 flex flex-col items-center justify-between transform group-hover/pass:scale-105 transition-transform duration-300">
                      {/* Top accent line */}
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
                      
                      {/* Icon */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="relative">
                          <Ticket className="w-16 h-16 text-gold" strokeWidth={1.5} />
                          <div className="absolute inset-0 animate-ping">
                            <Ticket className="w-16 h-16 text-gold/30" strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Pass text */}
                      <div className="text-center space-y-1">
                        <p className="text-xs text-silver/60 uppercase tracking-widest">Delegate</p>
                        <p className="text-lg font-heading text-gold tracking-wide">PASS</p>
                      </div>
                      
                      {/* Bottom accent */}
                      <div className="w-12 h-1 bg-gold/60 rounded-full" />
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Link 
                    to="/delegate-pass"
                    className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold via-gold to-primary text-charcoal font-semibold rounded-full hover:shadow-[0_0_30px_hsl(var(--gold)/0.5)] transition-all duration-300"
                  >
                    <span>Get Your Pass</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
