import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background"
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.3)' }}
      >
        <source src="/Untitled video - Made with Clipchamp.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in relative z-10 px-4">
        <h1 className="font-serif font-bold text-primary text-4xl md:text-5xl lg:text-6xl mb-4 drop-shadow-[0_0_40px_hsl(45,70%,53%,0.4)]">
          ADWAITA 2026
        </h1>
        <p className="text-silver text-lg md:text-xl mb-6 font-light">
          Where Medicine Meets Culture
        </p>
        <p className="text-silver/80 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join us for the grandest inter-college cultural extravaganza featuring 50+ events, 
          ₹5,50,000 prize pool, and participants from 100+ colleges across the nation.
        </p>
        <a
          href="#events"
          className="btn-gold inline-block text-base md:text-lg"
        >
          Explore Events
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-silver/60 flex flex-col items-center gap-2 z-10">
        <span className="text-xs">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </section>
  );
}
