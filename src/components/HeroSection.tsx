import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useVideoCache } from "@/hooks/useVideoCache";

const VIDEO_URL = "https://tmimemaapjsjhiknnuea.supabase.co/storage/v1/object/public/site-assets/Untitled%20video%20-%20Made%20with%20Clipchamp.mp4";

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-02-12T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center mb-8">
      {timeUnits.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center bg-background/20 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-2 md:px-5 md:py-4 min-w-[60px] md:min-w-[80px]"
        >
          <span className="font-serif font-bold text-primary text-2xl md:text-4xl drop-shadow-[0_0_10px_hsl(45,70%,53%,0.5)]">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-silver/80 text-[10px] md:text-xs uppercase tracking-wider mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  const { cachedUrl } = useVideoCache(VIDEO_URL);

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
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1.3)' }}
      >
        <source src={cachedUrl} type="video/mp4" />
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
        
        {/* Countdown Timer */}
        <CountdownTimer />
        
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
