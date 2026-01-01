import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
  videoSrc: string;
}

export function LoadingScreen({ onLoadComplete, videoSrc }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [letterIndex, setLetterIndex] = useState(0);

  const title = "ADWAITA";
  const subtitle = "Where Medicine Meets Culture";

  useEffect(() => {
    // Animate letters appearing one by one
    const letterTimer = setInterval(() => {
      setLetterIndex((prev) => {
        if (prev >= title.length) {
          clearInterval(letterTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(letterTimer);
  }, []);

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
        return prev + Math.random() * 12;
      });
    }, 200);

    // Minimum display time for the loading screen
    const minTimer = setTimeout(() => {
      minLoadTime = true;
    }, 2500);

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
        const remainingTime = 2500 - performance.now();
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
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(263,50%,15%)] to-background" />
      
      {/* Animated glow behind text */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center z-10">
        {/* Year badge */}
        <div className="mb-6 overflow-hidden">
          <span 
            className="block text-primary/60 text-sm tracking-[0.5em] font-light"
            style={{
              animation: "slideUp 0.8s ease-out forwards",
              animationDelay: "0.2s",
              opacity: 0,
              transform: "translateY(20px)",
            }}
          >
            2026
          </span>
        </div>

        {/* Main title with letter-by-letter animation */}
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider mb-4">
          {title.split("").map((letter, index) => (
            <span
              key={index}
              className="inline-block transition-all duration-500"
              style={{
                color: index < letterIndex ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.1)",
                textShadow: index < letterIndex 
                  ? "0 0 60px hsl(var(--primary) / 0.5), 0 0 100px hsl(var(--primary) / 0.3)" 
                  : "none",
                transform: index < letterIndex ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Animated underline */}
        <div className="relative h-[2px] w-48 md:w-64 mb-6 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Subtitle with fade-in */}
        <p 
          className="text-silver/70 text-sm md:text-base tracking-[0.2em] uppercase font-light"
          style={{
            animation: "fadeInUp 1s ease-out forwards",
            animationDelay: "1.2s",
            opacity: 0,
          }}
        >
          {subtitle}
        </p>

        {/* Loading indicator */}
        <div className="mt-16 flex flex-col items-center">
          {/* Minimal progress bar */}
          <div className="w-48 md:w-64 h-[1px] bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: "0 0 10px hsl(var(--primary))",
              }}
            />
          </div>
          
          {/* Loading text */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-silver/40 text-xs tracking-widest uppercase">
              {progress < 100 ? "Loading" : "Ready"}
            </span>
            {progress < 100 && (
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary/60"
                    style={{
                      animation: "bounce 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Corner accents - minimal */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-primary/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-primary/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-primary/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-primary/20" />

      {/* Inline styles for animations */}
      <style>{`
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
