import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  IndianRupee, 
  Users, 
  Music, 
  Mic2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernEventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    fee: number;
    teamType: string;
    day: string;
    status: string;
  };
  categoryId: string;
  index: number;
  borderColor: string;
}

// Get event type icon based on title keywords
const getEventIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("dance") || lowerTitle.includes("music") || lowerTitle.includes("band")) {
    return Music;
  }
  if (lowerTitle.includes("singing") || lowerTitle.includes("vocal") || lowerTitle.includes("carnatic") || lowerTitle.includes("freestyle")) {
    return Mic2;
  }
  return Sparkles;
};

// Get gradient based on border color
const getGradientClass = (borderColor: string) => {
  switch (borderColor) {
    case "border-gold":
      return "from-primary/20 via-orange-500/10 to-amber-500/5";
    case "border-orange":
      return "from-orange-500/20 via-rose-500/10 to-amber-500/5";
    case "border-teal":
      return "from-secondary/20 via-cyan-500/10 to-teal-500/5";
    default:
      return "from-primary/20 via-purple-500/10 to-secondary/5";
  }
};

// Get accent gradient for the glow line
const getAccentGradient = (borderColor: string) => {
  switch (borderColor) {
    case "border-gold":
      return "from-primary via-orange-400 to-amber-300";
    case "border-orange":
      return "from-orange-500 via-rose-400 to-amber-400";
    case "border-teal":
      return "from-secondary via-cyan-400 to-teal-300";
    default:
      return "from-primary via-purple-400 to-secondary";
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Open":
      return {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        border: "border-emerald-500/40",
        glow: "shadow-emerald-500/30",
        dot: "bg-emerald-400",
        pulse: true
      };
    case "Coming Soon":
      return {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/40",
        glow: "shadow-amber-500/30",
        dot: "bg-amber-400",
        pulse: true
      };
    case "Closed":
      return {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/40",
        glow: "shadow-red-500/30",
        dot: "bg-red-400",
        pulse: false
      };
    default:
      return {
        bg: "bg-muted/20",
        text: "text-muted-foreground",
        border: "border-muted/40",
        glow: "shadow-muted/30",
        dot: "bg-muted-foreground",
        pulse: false
      };
  }
};

export function ModernEventCard({ event, categoryId, index, borderColor }: ModernEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const EventIcon = getEventIcon(event.title);
  const statusConfig = getStatusConfig(event.status);
  const gradientClass = getGradientClass(borderColor);
  const accentGradient = getAccentGradient(borderColor);

  return (
    <div
      className="group relative animate-fade-in"
      style={{ 
        animationDelay: `${index * 100}ms`,
        perspective: "1000px"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all duration-500 ease-out",
          "bg-gradient-to-br from-card via-card/95 to-card/90",
          "border border-border/30 backdrop-blur-xl",
          "hover:shadow-2xl hover:shadow-primary/20",
          "motion-safe:hover:-translate-y-2 motion-safe:hover:rotate-x-2",
          isHovered && "border-primary/40"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateX(2deg) rotateY(-1deg)" : "rotateX(0) rotateY(0)"
        }}
      >
        {/* Gradient Background Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-500",
          gradientClass,
          isHovered && "opacity-80"
        )} />

        {/* Animated Accent Line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-500",
          accentGradient,
          isHovered ? "opacity-100 shadow-lg" : "opacity-60"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r blur-sm",
            accentGradient,
            isHovered ? "opacity-100" : "opacity-0",
            "transition-opacity duration-500"
          )} />
        </div>

        {/* Background Icon Element */}
        <div className={cn(
          "absolute -right-8 -top-8 transition-all duration-700 ease-out",
          isHovered ? "opacity-20 scale-110 rotate-12" : "opacity-10 scale-100 rotate-0"
        )}>
          <EventIcon 
            size={160} 
            className="text-primary" 
            strokeWidth={0.5}
          />
        </div>

        {/* Audio Waveform Decoration */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-10 transition-opacity duration-500",
          isHovered && "opacity-20"
        )}>
          <div className="flex items-end justify-center gap-1 h-full pb-4">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 bg-gradient-to-t rounded-full transition-all duration-300",
                  accentGradient.replace("from-", "from-").replace("via-", "via-").replace("to-", "to-")
                )}
                style={{
                  height: `${Math.sin((i / 24) * Math.PI) * 100 * (0.3 + Math.random() * 0.7)}%`,
                  animationDelay: `${i * 50}ms`,
                  background: `linear-gradient(to top, var(--primary), var(--secondary))`
                }}
              />
            ))}
          </div>
        </div>

        {/* Content Container with Asymmetrical Layout */}
        <div className="relative z-10 p-6 md:p-8">
          
          {/* Top Row: Title & Status */}
          <div className="flex items-start justify-between gap-4 mb-6">
            {/* Title Section - Offset Left */}
            <div className="flex-1 pr-4">
              <h3 className={cn(
                "font-serif font-bold text-2xl md:text-3xl leading-tight tracking-tight",
                "text-foreground transition-colors duration-300",
                "group-hover:text-primary"
              )}>
                {event.title}
              </h3>
              
              {/* Category Chip */}
              <div className={cn(
                "inline-flex items-center gap-1.5 mt-3 px-3 py-1.5",
                "bg-gradient-to-r from-primary/20 to-secondary/20",
                "border border-primary/30 rounded-full",
                "text-xs font-medium text-foreground/80"
              )}>
                <EventIcon size={12} className="text-primary" />
                <span>{event.teamType}</span>
              </div>
            </div>

            {/* Animated Status Badge - Offset Right */}
            <div className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2",
              "rounded-xl border backdrop-blur-sm",
              "transition-all duration-300",
              statusConfig.bg,
              statusConfig.border,
              isHovered && `shadow-lg ${statusConfig.glow}`
            )}>
              {/* Pulsing Dot */}
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  statusConfig.dot,
                  statusConfig.pulse && "animate-ping"
                )} />
                <span className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  statusConfig.dot
                )} />
              </span>
              <span className={cn("text-sm font-semibold", statusConfig.text)}>
                {event.status}
              </span>
            </div>
          </div>

          {/* Description - Slides in on hover */}
          <div className={cn(
            "overflow-hidden transition-all duration-500 ease-out",
            isHovered ? "max-h-24 opacity-100 mb-6" : "max-h-16 opacity-80 mb-4"
          )}>
            <p className="text-silver/80 text-sm md:text-base leading-relaxed line-clamp-3">
              {event.description}
            </p>
          </div>

          {/* Metadata Grid - Modern Timeline Layout */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Fee */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5",
              "bg-background/50 backdrop-blur-sm rounded-xl",
              "border border-border/40",
              "transition-all duration-300",
              isHovered && "border-primary/40 bg-background/70"
            )}>
              <div className="p-1.5 rounded-lg bg-primary/20">
                <IndianRupee size={14} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-silver/60 uppercase tracking-wider">Fee</span>
                <span className="font-bold text-foreground">
                  {event.fee === 0 ? "Free" : `₹${event.fee}`}
                </span>
              </div>
            </div>

            {/* Day */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5",
              "bg-background/50 backdrop-blur-sm rounded-xl",
              "border border-border/40",
              "transition-all duration-300",
              isHovered && "border-secondary/40 bg-background/70"
            )}>
              <div className="p-1.5 rounded-lg bg-secondary/20">
                <Calendar size={14} className="text-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-silver/60 uppercase tracking-wider">Schedule</span>
                <span className="font-bold text-foreground">{event.day}</span>
              </div>
            </div>

            {/* Team Type */}
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5",
              "bg-background/50 backdrop-blur-sm rounded-xl",
              "border border-border/40",
              "transition-all duration-300",
              isHovered && "border-accent/40 bg-background/70"
            )}>
              <div className="p-1.5 rounded-lg bg-accent/20">
                <Users size={14} className="text-accent-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-silver/60 uppercase tracking-wider">Type</span>
                <span className="font-bold text-foreground text-sm">
                  {event.teamType.length > 12 ? event.teamType.substring(0, 12) + "..." : event.teamType}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to={`/${categoryId}/${event.id}`}
            className={cn(
              "relative flex items-center justify-center gap-3 w-full py-4 px-6",
              "bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10",
              "hover:from-primary hover:via-primary hover:to-primary",
              "text-primary hover:text-primary-foreground",
              "font-semibold text-base rounded-xl",
              "border border-primary/30 hover:border-primary",
              "transition-all duration-500 ease-out",
              "group/btn overflow-hidden",
              isHovered && "scale-[1.02] shadow-lg shadow-primary/20"
            )}
          >
            {/* Button Glow Effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary",
              "opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500",
              "blur-xl -z-10"
            )} />
            
            <span className="relative z-10">View Details & Register</span>
            <ArrowRight 
              size={18} 
              className={cn(
                "relative z-10 transition-transform duration-300",
                "group-hover/btn:translate-x-2"
              )} 
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
