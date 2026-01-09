import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Music, Heart, Sparkles, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import concertPoster from "@/assets/krishh-concert.jpg";

const KrishhConcertPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup in this session
    const dismissed = sessionStorage.getItem("krishh-popup-dismissed");
    if (dismissed) return;

    // Show floating button after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setIsVisible(false);
    sessionStorage.setItem("krishh-popup-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button - Left side, above chatbot level */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 group",
          "w-12 h-12 sm:w-14 sm:h-14 rounded-full",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110",
          "shadow-2xl",
          isOpen ? "rotate-180 scale-90" : "animate-pulse hover:animate-none"
        )}
        style={{
          background: "linear-gradient(135deg, #FF1B9F 0%, #3D2862 50%, #00FFD9 100%)",
          boxShadow: "0 0 30px rgba(255, 27, 159, 0.5), 0 0 60px rgba(0, 255, 217, 0.3)",
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <div className="relative">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <Heart 
              className="w-3 h-3 text-white absolute -top-1 -right-1 animate-bounce" 
              fill="white"
            />
          </div>
        )}
      </button>

      {/* Expanded Card */}
      <div
        className={cn(
          "fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-50",
          "w-[280px] sm:w-[320px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-500 ease-out",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        )}
      >
        <div 
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #3D2862 100%)",
            boxShadow: "0 0 40px rgba(255, 27, 159, 0.3), 0 0 80px rgba(0, 255, 217, 0.2)",
          }}
        >
          {/* Animated border glow */}
          <div 
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #FF1B9F, #00FFD9, #FFD700, #FF1B9F)",
              backgroundSize: "300% 100%",
              animation: "gradientBorder 3s linear infinite",
              padding: "2px",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Close/Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header with poster */}
          <div className="relative h-28 sm:h-32 overflow-hidden">
            <img 
              src={concertPoster} 
              alt="Krishh Concert" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1A2E]" />
            
            {/* Valentine badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#FF1B9F]/90 to-[#FF1B9F]/70 backdrop-blur-sm rounded-full">
              <Heart className="w-3 h-3 text-white" fill="white" />
              <span className="text-[10px] font-bold text-white tracking-wider">FEB 14</span>
            </div>

            {/* Artist overlay */}
            <div className="absolute bottom-2 left-3">
              <h3 
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #FF1B9F, #00FFD9)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 30px rgba(255, 27, 159, 0.5)",
                }}
              >
                KRISHH LIVE
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Sound wave decoration */}
            <div className="flex items-center justify-center gap-[2px] h-4">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full animate-pulse"
                  style={{
                    height: `${30 + Math.random() * 70}%`,
                    background: `linear-gradient(to top, #FF1B9F, #00FFD9)`,
                    animationDelay: `${i * 0.08}s`,
                    animationDuration: `${0.5 + Math.random() * 0.3}s`,
                  }}
                />
              ))}
            </div>

            {/* Tagline */}
            <p className="text-center text-xs sm:text-sm text-gray-300">
              Valentine's Day Special Concert
            </p>

            {/* Prices */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold" style={{ color: "#FF1B9F" }}>₹699</p>
                <p className="text-[10px] text-gray-400">Stag</p>
              </div>
              <div className="w-px h-6 bg-gray-600" />
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold" style={{ color: "#00FFD9" }}>₹1099</p>
                <p className="text-[10px] text-gray-400">Couple</p>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/krishh"
              onClick={() => setIsOpen(false)}
              className="block w-full py-2.5 sm:py-3 text-center font-bold text-white text-sm rounded-xl relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #FF1B9F 0%, #3D2862 50%, #00FFD9 100%)",
                backgroundSize: "200% 200%",
                animation: "gradientBorder 3s ease infinite",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Ticket className="w-4 h-4" />
                Book Now
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default KrishhConcertPopup;
