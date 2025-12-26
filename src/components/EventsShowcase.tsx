import { Link } from "react-router-dom";
import { CategoryCard } from "./CategoryCard";
import { ArrowRight } from "lucide-react";

import culturalsImg from "@/assets/category-culturals.jpg";
import sportsImg from "@/assets/category-sports.jpg";

const featuredCategories = [
  {
    id: "culturals",
    title: "Culturals",
    description:
      "From soul-stirring melodies to electrifying dance battles—experience the heartbeat of artistic expression across solo and group performances.",
    eventCount: 6,
    prizePool: "₹50K+",
    accentColor: "gold" as const,
    image: culturalsImg,
    featured: true,
  },
  {
    id: "sports",
    title: "Sports",
    description:
      "Compete in high-intensity sporting events. From cricket to chess, prove your athletic prowess.",
    eventCount: 6,
    prizePool: "₹75K+",
    accentColor: "orange" as const,
    image: sportsImg,
    featured: true,
  },
];

export function EventsShowcase() {
  return (
    <section id="events" className="py-20 gradient-stats">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-secondary text-sm font-medium uppercase tracking-widest mb-3">
            Explore Categories
          </p>
          <h2 className="font-serif text-primary text-3xl md:text-5xl font-bold mb-6">
            50+ Events Across 8 Domains
          </h2>
          <p className="text-silver/80 text-lg leading-relaxed">
            Whether you're a performer, athlete, artist, or innovator—there's a stage waiting
            for you. Click on any category to discover all events and register.
          </p>
        </div>

        {/* Featured Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 border border-primary/30 rounded-lg text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          >
            View All Categories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
