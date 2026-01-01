import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
  videoSrc: string;
}

export function LoadingScreen({ onLoadComplete, videoSrc }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Preload the video
    const video = document.createElement("video");
    video.src = videoSrc;
    video.preload = "auto";

    let progressInterval: NodeJS.Timeout;
    let minLoadTime = false;

    // Simulate progress while video loads
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Minimum display time for the loading screen
    const minTimer = setTimeout(() => {
      minLoadTime = true;
    }, 2000);

    const handleCanPlayThrough = () => {
      clearInterval(progressInterval);
      
      const finishLoading = () => {
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onLoadComplete, 800);
        }, 400);
      };

      if (minLoadTime) {
        finishLoading();
      } else {
        const remainingTime = 2000 - performance.now();
        setTimeout(finishLoading, Math.max(0, remainingTime));
      }
    };

    video.addEventListener("canplaythrough", handleCanPlayThrough);

    // Fallback if video takes too long
    const fallbackTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onLoadComplete, 800);
      }, 400);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [videoSrc, onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Mystical background layers */}
      <div className="absolute inset-0">
        {/* Deep gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(263,50%,12%)] to-[hsl(263,60%,8%)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-portal-breathe" />
      </div>

      {/* Mystical runes floating around */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 font-serif text-4xl animate-float-rune"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {["✧", "⬡", "◇", "☆", "✦", "⬢", "◈", "✴"][i]}
          </div>
        ))}
      </div>

      {/* Energy wisps */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M20,50 Q35,30 50,50 T80,50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.15"
          strokeDasharray="100"
          className="animate-wisp-1"
        />
        <path
          d="M10,60 Q40,40 60,60 T90,55"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.1"
          strokeDasharray="100"
          className="animate-wisp-2"
        />
      </svg>

      {/* Central portal container */}
      <div className="relative flex flex-col items-center">
        {/* Outer portal ring */}
        <div className="absolute w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-primary/20 animate-spin-slow" />
        <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border border-secondary/15 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
        <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDuration: "35s" }} />

        {/* Inner glowing portal */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center">
          {/* Portal glow layers */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-secondary/20 animate-portal-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-secondary/20 via-transparent to-primary/20 animate-portal-breathe" />
          <div className="absolute inset-8 rounded-full bg-background/80 backdrop-blur-sm" />

          {/* Caduceus symbol - medical mysticism */}
          <div className="relative z-10 flex flex-col items-center">
            <svg
              viewBox="0 0 64 64"
              className="w-16 h-16 md:w-20 md:h-20 text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Staff */}
              <line x1="32" y1="8" x2="32" y2="56" />
              {/* Wings */}
              <path d="M24,12 Q20,8 16,10 Q12,12 16,16 Q20,18 24,16 L32,12" />
              <path d="M40,12 Q44,8 48,10 Q52,12 48,16 Q44,18 40,16 L32,12" />
              {/* Left serpent */}
              <path d="M32,20 Q24,24 24,30 Q24,36 32,38 Q40,40 40,46 Q40,52 32,54" />
              {/* Right serpent */}
              <path d="M32,20 Q40,24 40,30 Q40,36 32,38 Q24,40 24,46 Q24,52 32,54" />
            </svg>
          </div>
        </div>

        {/* Title below portal */}
        <div className="mt-12 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)] tracking-wider">
            ADWAITA
          </h1>
          <p className="text-silver/60 text-sm md:text-base mt-2 tracking-[0.3em] uppercase">
            Awakening the Portal
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-64 md:w-80">
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-silver/40 text-xs mt-3 font-light tracking-wider">
            {progress < 100 ? "Channeling mystical energies..." : "Portal ready"}
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20" />
    </div>
  );
}
