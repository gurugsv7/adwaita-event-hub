import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(263,40%,12%)] to-background" />
        
        {/* Animated stars/particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-silver/30 animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's',
              }}
            />
          ))}
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-teal/10 blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-gold/10 blur-2xl animate-float-fast" />

        {/* Portal container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-primary/20 animate-portal-pulse" />
          
          {/* Portal rings */}
          <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border-2 border-gold/30 animate-spin-slow" 
            style={{ animationDuration: '30s' }} />
          <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-teal/20 animate-spin-reverse"
            style={{ animationDuration: '25s' }} />
          <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-2 border-primary/40 animate-spin-slow"
            style={{ animationDuration: '20s' }} />
          
          {/* Inner portal core */}
          <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full bg-gradient-radial from-gold/20 via-primary/30 to-transparent animate-portal-breathe" />
          
          {/* Energy arcs */}
          <svg className="absolute w-[500px] h-[500px] md:w-[650px] md:h-[650px] animate-spin-slow" style={{ animationDuration: '40s' }}>
            <defs>
              <linearGradient id="arcGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="arcGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="50%" cy="50%" rx="45%" ry="20%" fill="none" stroke="url(#arcGradient1)" strokeWidth="2" transform="rotate(45 325 325)" className="animate-pulse" />
            <ellipse cx="50%" cy="50%" rx="40%" ry="15%" fill="none" stroke="url(#arcGradient2)" strokeWidth="1.5" transform="rotate(-30 325 325)" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>

          {/* Floating particles around portal */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full animate-orbit"
              style={{
                background: i % 3 === 0 ? 'hsl(45, 70%, 53%)' : i % 3 === 1 ? 'hsl(162, 72%, 46%)' : 'hsl(263, 47%, 58%)',
                boxShadow: `0 0 10px ${i % 3 === 0 ? 'hsl(45, 70%, 53%)' : i % 3 === 1 ? 'hsl(162, 72%, 46%)' : 'hsl(263, 47%, 58%)'}`,
                animationDuration: (8 + i * 2) + 's',
                animationDelay: (i * 0.5) + 's',
                transformOrigin: `${200 + i * 15}px center`,
              }}
            />
          ))}
        </div>

        {/* Mystic mist layers */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="text-center max-w-3xl mx-auto animate-fade-in relative z-10 px-4">
        <h1 className="font-serif font-bold text-primary text-4xl md:text-5xl lg:text-6xl mb-4 drop-shadow-[0_0_30px_hsl(45,70%,53%,0.3)]">
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
