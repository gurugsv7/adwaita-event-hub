import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Music, Heart, Sparkles, Calendar, MapPin, Mic2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import concertPoster from "@/assets/krishh-concert.jpg";

// Sound wave visualizer component
const SoundWaveVisualizer = () => (
  <div className="flex items-center justify-center gap-[3px] h-8">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="w-[3px] bg-gradient-to-t from-concert-magenta to-concert-cyan rounded-full animate-pulse"
        style={{
          height: `${Math.random() * 100}%`,
          minHeight: "20%",
          animationDelay: `${i * 0.1}s`,
          animationDuration: `${0.4 + Math.random() * 0.3}s`,
        }}
      />
    ))}
  </div>
);

// Floating music notes
const FloatingNotes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {["♪", "♫", "♬", "♩", "♪", "♫"].map((note, i) => (
      <span
        key={i}
        className="absolute text-concert-magenta/30 text-2xl animate-bounce"
        style={{
          left: `${10 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${2 + i * 0.5}s`,
        }}
      >
        {note}
      </span>
    ))}
  </div>
);

const KrishhConcertPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup in this session
    const dismissed = sessionStorage.getItem("krishh-popup-dismissed");
    if (dismissed) {
      setHasBeenDismissed(true);
      return;
    }

    // Show popup after 2 seconds delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setHasBeenDismissed(true);
    sessionStorage.setItem("krishh-popup-dismissed", "true");
  };

  if (hasBeenDismissed && !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-[101] translate-x-[-50%] translate-y-[-50%] w-[95vw] max-w-md focus:outline-none"
        >
          {/* Main container with animated border */}
          <div className="relative">
            {/* Animated glow border */}
            <div 
              className="absolute -inset-[2px] rounded-3xl opacity-75"
              style={{
                background: "linear-gradient(90deg, #FF1B9F, #00FFD9, #FFD700, #FF1B9F)",
                backgroundSize: "300% 100%",
                animation: "gradientBorder 3s linear infinite",
              }}
            />
            
            {/* Content container */}
            <div 
              className="relative rounded-3xl overflow-hidden"
              style={{ 
                background: "linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 50%, #3D2862 100%)",
              }}
            >
              {/* Floating notes background */}
              <FloatingNotes />
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header with poster */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={concertPoster} 
                  alt="Krishh Concert" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1A2E]" />
                
                {/* Floating badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-concert-magenta/80 to-concert-magenta/60 backdrop-blur-sm rounded-full">
                  <Heart className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wider">VALENTINE'S SPECIAL</span>
                </div>

                {/* Artist name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-concert-magenta to-concert-purple flex items-center justify-center">
                      <Mic2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-2xl font-black tracking-tight"
                        style={{
                          background: "linear-gradient(90deg, #FF1B9F, #00FFD9, #FFD700)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        KRISHH LIVE
                      </h3>
                      <p className="text-xs text-gray-400">IN CONCERT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-5 space-y-4">
                {/* Sound wave visualizer */}
                <div className="flex justify-center">
                  <SoundWaveVisualizer />
                </div>

                {/* Event details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-concert-magenta/20 rounded-xl p-3 text-center">
                    <Calendar className="w-5 h-5 text-concert-cyan mx-auto mb-1" />
                    <p className="text-sm font-semibold text-white">Feb 14, 2026</p>
                    <p className="text-xs text-gray-400">7:00 PM Onwards</p>
                  </div>
                  <div className="bg-white/5 border border-concert-cyan/20 rounded-xl p-3 text-center">
                    <MapPin className="w-5 h-5 text-concert-magenta mx-auto mb-1" />
                    <p className="text-sm font-semibold text-white">IGMCRI</p>
                    <p className="text-xs text-gray-400">Puducherry</p>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-center text-sm text-gray-300 leading-relaxed">
                  Experience the magic of love with <span className="text-concert-cyan font-semibold">Krishh</span> and 
                  special performers this Valentine's Day!
                </p>

                {/* Ticket prices */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-concert-magenta">₹699</p>
                    <p className="text-xs text-gray-400">Stag Entry</p>
                  </div>
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-concert-cyan">₹1099</p>
                    <p className="text-xs text-gray-400">Couple Entry</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/krishh"
                    onClick={handleClose}
                    className="block w-full py-3.5 text-center font-bold text-white rounded-xl relative overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, #FF1B9F 0%, #3D2862 50%, #00FFD9 100%)",
                      backgroundSize: "200% 200%",
                      animation: "gradientBorder 3s ease infinite",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Music className="w-4 h-4" />
                      Book Your Tickets
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 text-center text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              {/* Bottom decorative line */}
              <div 
                className="h-1"
                style={{
                  background: "linear-gradient(90deg, #FF1B9F, #00FFD9, #FFD700)",
                }}
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default KrishhConcertPopup;
