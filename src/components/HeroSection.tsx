import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background"
    >
      {/* Animated Mystic Portal Background */}
      <div className="absolute inset-0">
        {/* Deep gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(263,50%,8%)] via-background to-[hsl(263,50%,8%)]" />
        
        {/* Central Portal */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Portal glow backdrop */}
          <div className="absolute w-[350px] h-[480px] md:w-[400px] md:h-[550px] rounded-[50%] bg-gradient-to-b from-gold/20 via-primary/30 to-teal/20 blur-3xl animate-portal-breathe" />
          
          {/* Main portal oval */}
          <div className="absolute w-[300px] h-[420px] md:w-[320px] md:h-[450px] rounded-[50%] border-[3px] border-gold/60 shadow-[0_0_60px_hsl(45,70%,53%,0.4),inset_0_0_60px_hsl(45,70%,53%,0.2)] animate-portal-pulse">
            {/* Inner portal gradient */}
            <div className="absolute inset-2 rounded-[50%] bg-gradient-to-b from-primary/40 via-[hsl(263,60%,20%)] to-teal/30 animate-swirl" />
            
            {/* Portal inner glow ring */}
            <div className="absolute inset-4 rounded-[50%] border border-teal/40 shadow-[0_0_30px_hsl(162,72%,46%,0.3)]" />
            
            {/* Mystical swirl inside portal */}
            <div className="absolute inset-0 rounded-[50%] overflow-hidden">
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,hsl(45,70%,53%,0.1),transparent,hsl(162,72%,46%,0.1),transparent)] animate-spin-slow" style={{ animationDuration: '15s' }} />
            </div>
          </div>
          
          {/* Energy ripples emanating from portal */}
          <div className="absolute w-[420px] h-[580px] md:w-[500px] md:h-[700px] rounded-[50%] border border-gold/20 animate-ripple-1" />
          <div className="absolute w-[520px] h-[720px] md:w-[650px] md:h-[900px] rounded-[50%] border border-primary/15 animate-ripple-2" />
          <div className="absolute w-[620px] h-[860px] md:w-[800px] md:h-[1100px] rounded-[50%] border border-teal/10 animate-ripple-3" />
        </div>

        {/* Floating mystical runes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {['✧', '◈', '❖', '✦', '◇', '⬡'].map((rune, i) => (
            <span
              key={i}
              className="absolute text-gold/40 animate-float-rune"
              style={{
                fontSize: `${20 + i * 4}px`,
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 3) * 15}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i}s`,
              }}
            >
              {rune}
            </span>
          ))}
          {['◈', '✧', '✦', '◇', '❖'].map((rune, i) => (
            <span
              key={`r-${i}`}
              className="absolute text-teal/30 animate-float-rune"
              style={{
                fontSize: `${16 + i * 3}px`,
                right: `${15 + i * 10}%`,
                top: `${25 + (i % 4) * 12}%`,
                animationDelay: `${i * 0.6 + 0.3}s`,
                animationDuration: `${5 + i}s`,
              }}
            >
              {rune}
            </span>
          ))}
        </div>

        {/* Energy wisps */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wispGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(45, 70%, 53%)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wispTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(162, 72%, 46%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Animated energy paths */}
          <path d="M 10 50 Q 30 30, 50 50 T 90 50" fill="none" stroke="url(#wispGold)" strokeWidth="0.3" className="animate-wisp-1" />
          <path d="M 15 60 Q 35 80, 50 55 T 85 45" fill="none" stroke="url(#wispTeal)" strokeWidth="0.2" className="animate-wisp-2" />
          <path d="M 20 40 Q 40 20, 55 45 T 80 55" fill="none" stroke="url(#wispGold)" strokeWidth="0.25" className="animate-wisp-3" />
        </svg>

        {/* Ambient light orbs */}
        <div className="absolute top-1/4 left-1/6 w-4 h-4 rounded-full bg-gold/50 blur-sm animate-pulse-glow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/5 w-3 h-3 rounded-full bg-teal/50 blur-sm animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-5 h-5 rounded-full bg-primary/40 blur-sm animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full bg-gold/40 blur-sm animate-pulse-glow" style={{ animationDelay: '0.5s' }} />

        {/* Bottom mist */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

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
