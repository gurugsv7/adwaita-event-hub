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
      className={`group relative block overflow-hidden rounded-2xl border ${styles.border} ${styles.glow} transition-all duration-500 ${
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
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/40 group-hover:via-charcoal/70 group-hover:to-charcoal/30 transition-all duration-500" />
      </div>

      {/* Content */}
      <div
        className={`relative h-full flex flex-col justify-end p-6 ${
          featured ? "md:p-10" : ""
        } min-h-[280px] ${featured ? "md:min-h-[400px]" : ""}`}
      >
        {/* Arrow indicator */}
        <div
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-charcoal/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 ${styles.border}`}
        >
          <ArrowUpRight className={`w-5 h-5 ${styles.text}`} />
        </div>

        {/* Stats badges */}
        <div className="flex gap-2 mb-4">
          <span
            className={`${styles.badge} text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm`}
          >
            {eventCount} Events
          </span>
          <span
            className={`${styles.badge} text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm`}
          >
            {prizePool}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-serif font-bold text-silver ${
            featured ? "text-3xl md:text-5xl" : "text-2xl"
          } mb-3 leading-tight group-hover:${styles.text} transition-colors duration-300`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-silver/70 ${
            featured ? "text-base md:text-lg" : "text-sm"
          } leading-relaxed line-clamp-2 group-hover:text-silver/90 transition-colors duration-300`}
        >
          {description}
        </p>

        {/* Explore link */}
        <div
          className={`mt-4 flex items-center gap-2 ${styles.text} text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}
        >
          <span>Explore Events</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
