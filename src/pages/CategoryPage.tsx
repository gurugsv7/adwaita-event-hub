import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, ArrowRight, Calendar, IndianRupee } from "lucide-react";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { categories } from "@/data/events";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Coming Soon":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Closed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted/20 text-muted-foreground border-muted/30";
  }
};

interface EventCardProps {
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

function EventCard({ event, categoryId, index, borderColor }: EventCardProps) {
  const getBorderColorClass = () => {
    switch (borderColor) {
      case "border-gold":
        return "border-l-primary";
      case "border-orange":
        return "border-l-orange-500";
      case "border-teal":
        return "border-l-secondary";
      default:
        return "border-l-primary";
    }
  };

  return (
    <div
      className={`group bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50 animate-fade-in border-l-4 ${getBorderColorClass()}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Event Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif font-bold text-foreground text-lg md:text-xl group-hover:text-primary transition-colors leading-tight">
            {event.title}
          </h3>
          <span
            className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* Event Description */}
      <div className="px-5 pb-4">
        <p className="text-silver/80 text-sm leading-relaxed line-clamp-3">
          {event.description}
        </p>
      </div>

      {/* Event Meta */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-silver/70">
            <IndianRupee size={14} className="text-primary" />
            <span className="font-medium text-foreground">
              {event.fee === 0 ? "Free" : `₹${event.fee}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-silver/70">
            <Calendar size={14} className="text-secondary" />
            <span>{event.day}</span>
          </div>
          <div className="text-silver/60 text-xs bg-background/40 px-2 py-1 rounded">
            {event.teamType}
          </div>
        </div>
      </div>

      {/* Register Button */}
      <div className="p-5 pt-2 border-t border-border/20">
        <Link
          to={`/events/${categoryId}/${event.id}/register`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-medium rounded-lg transition-all duration-300 group/btn"
        >
          <span>View Details & Register</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const category = categories.find((c) => c.id === categoryId);

  const filteredEvents = useMemo(() => {
    if (!category) return [];

    if (searchQuery === "") {
      return category.events;
    }

    return category.events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [category, searchQuery]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-silver text-xl mb-4">Category not found</p>
          <Link to="/#events" className="text-secondary hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.title} | ADWAITA 2026</title>
        <meta
          name="description"
          content={`Explore ${category.title} events at ADWAITA 2026. ${category.events.length} events with exciting prizes.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Header */}
        <section className="gradient-hero py-12 md:py-20">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <Link
              to="/#events"
              className="inline-flex items-center gap-2 text-silver/70 hover:text-silver transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Events</span>
            </Link>

            {/* Centered Category Title */}
            <div className="text-center mb-8">
              <h1 className="font-serif font-bold text-primary text-3xl md:text-5xl lg:text-6xl tracking-wider">
                {category.displayTitle}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
            </div>

            {/* Secretary Info */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-silver/80 text-sm md:text-base bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
                <span>Secretary:</span>
                <span className="font-medium text-foreground">{category.secretary.name}</span>
                <span className="text-primary/50">|</span>
                <a
                  href={`tel:${category.secretary.phone}`}
                  className="hover:text-secondary transition-colors"
                >
                  {category.secretary.phone}
                </a>
              </div>
              <p className="text-silver/50 text-sm mt-4">
                {category.events.length} events available
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="sticky top-16 z-40 gradient-stats border-b border-primary/30 py-4">
          <div className="container mx-auto px-4">
            <div className="relative w-full max-w-md mx-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-primary/40 rounded-lg bg-background/50 text-foreground placeholder:text-silver/50 input-teal focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Events List */}
        <main className="py-12 gradient-stats">
          <div className="container mx-auto px-4">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    categoryId={category.id}
                    index={index}
                    borderColor={category.borderColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-silver text-lg">
                  No events found matching your search.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-secondary hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
