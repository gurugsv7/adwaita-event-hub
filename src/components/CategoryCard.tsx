import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
  eventCount: number;
  prizePool: string;
  accentColor: "gold" | "teal" | "orange";
  featured?: boolean;
}

const accentStyles = {
  gold: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    text: "text-primary",
    hover: "group-hover:bg-primary",
  },
  teal: {
    border: "border-l-secondary",
    bg: "bg-secondary/5",
    text: "text-secondary",
    hover: "group-hover:bg-secondary",
  },
  orange: {
    border: "border-l-accent",
    bg: "bg-accent/5",
    text: "text-accent",
    hover: "group-hover:bg-accent",
  },
};

export function CategoryCard({
  id,
  emoji,
  title,
  description,
  eventCount,
  prizePool,
  accentColor,
  featured = false,
}: CategoryCardProps) {
  const styles = accentStyles[accentColor];

  return (
    <Link
      to={`/events/${id}`}
      className={`group relative block overflow-hidden rounded-2xl bg-card border-l-4 ${styles.border} transition-all duration-300 hover:shadow-card-hover ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 ${styles.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className={`relative p-6 ${featured ? "md:p-10" : ""} h-full flex flex-col`}>
        {/* Emoji & Title */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={`text-3xl ${featured ? "md:text-5xl" : ""} block mb-3`}>
              {emoji}
            </span>
            <h3
              className={`font-serif font-bold ${styles.text} ${
                featured ? "text-2xl md:text-4xl" : "text-xl"
              } leading-tight`}
            >
              {title}
            </h3>
          </div>
          <div
            className={`w-10 h-10 rounded-full border-2 ${styles.border} flex items-center justify-center transition-all duration-300 ${styles.hover} group-hover:border-transparent`}
          >
            <ArrowRight
              className={`w-5 h-5 ${styles.text} transition-colors duration-300 group-hover:text-card`}
            />
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-card-foreground/70 ${
            featured ? "text-base md:text-lg" : "text-sm"
          } leading-relaxed mb-6 flex-grow`}
        >
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-border/30">
          <div>
            <p className={`${styles.text} font-bold ${featured ? "text-2xl" : "text-lg"}`}>
              {eventCount}
            </p>
            <p className="text-card-foreground/50 text-xs uppercase tracking-wide">
              Events
            </p>
          </div>
          <div className="w-px h-8 bg-border/30" />
          <div>
            <p className={`${styles.text} font-bold ${featured ? "text-2xl" : "text-lg"}`}>
              {prizePool}
            </p>
            <p className="text-card-foreground/50 text-xs uppercase tracking-wide">
              Prize Pool
            </p>
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div
        className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full ${styles.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
      />
    </Link>
  );
}
