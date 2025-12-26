import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  eventCount: number;
  prizePool: string;
  accentColor: "gold" | "teal" | "orange";
  image: string;
  featured?: boolean;
}

const accentStyles = {
  gold: {
    glow: "group-hover:shadow-[0_0_60px_rgba(212,175,55,0.3)]",
    border: "border-primary/30 group-hover:border-primary",
    text: "text-primary",
    badge: "bg-primary/20 text-primary",
  },
  teal: {
    glow: "group-hover:shadow-[0_0_60px_rgba(32,201,151,0.3)]",
    border: "border-secondary/30 group-hover:border-secondary",
    text: "text-secondary",
    badge: "bg-secondary/20 text-secondary",
  },
  orange: {
    glow: "group-hover:shadow-[0_0_60px_rgba(249,115,22,0.3)]",
    border: "border-accent/30 group-hover:border-accent",
    text: "text-accent",
    badge: "bg-accent/20 text-accent",
  },
};

export function CategoryCard({
  id,
  title,
  description,
  eventCount,
  prizePool,
  accentColor,
  image,
  featured = false,
}: CategoryCardProps) {
  const styles = accentStyles[accentColor];

  return (
    <Link
      to={`/events/${id}`}
      className={`group relative block overflow-hidden rounded-xl md:rounded-2xl border ${styles.border} ${styles.glow} transition-all duration-500 active:scale-[0.98] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient - darker on mobile for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-charcoal/60 md:from-charcoal md:via-charcoal/80 md:to-charcoal/40 group-hover:via-charcoal/70 group-hover:to-charcoal/30 transition-all duration-500" />
      </div>

      {/* Content - Compact on mobile */}
      <div
        className={`relative h-full flex flex-col justify-end p-4 md:p-6 ${
          featured ? "md:p-10" : ""
        } min-h-[120px] md:min-h-[280px] ${featured ? "md:min-h-[400px]" : ""}`}
      >
        {/* Arrow indicator - visible on mobile, enhanced on hover for desktop */}
        <div
          className={`absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-charcoal/50 backdrop-blur-sm flex items-center justify-center opacity-70 md:opacity-0 group-hover:opacity-100 transition-all duration-300 md:translate-x-2 md:group-hover:translate-x-0 ${styles.border}`}
        >
          <ArrowUpRight className={`w-4 h-4 md:w-5 md:h-5 ${styles.text}`} />
        </div>

        {/* Stats badges - Compact on mobile */}
        <div className="flex gap-1.5 md:gap-2 mb-2 md:mb-4">
          <span
            className={`${styles.badge} text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm`}
          >
            {eventCount} Events
          </span>
          <span
            className={`${styles.badge} text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm hidden sm:block`}
          >
            {prizePool}
          </span>
        </div>

        {/* Title - Smaller on mobile */}
        <h3
          className={`font-serif font-bold text-silver ${
            featured ? "text-lg md:text-3xl lg:text-5xl" : "text-base md:text-2xl"
          } mb-1 md:mb-3 leading-tight group-hover:${styles.text} transition-colors duration-300`}
        >
          {title}
        </h3>

        {/* Description - Hidden on small mobile, truncated on larger */}
        <p
          className={`text-silver/70 text-xs md:text-sm ${
            featured ? "md:text-base lg:text-lg" : ""
          } leading-relaxed line-clamp-1 md:line-clamp-2 group-hover:text-silver/90 transition-colors duration-300`}
        >
          {description}
        </p>

        {/* Explore link - Hidden on mobile, visible on hover for desktop */}
        <div
          className={`mt-2 md:mt-4 hidden md:flex items-center gap-2 ${styles.text} text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}
        >
          <span>Explore Events</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
