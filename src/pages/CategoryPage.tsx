import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModernEventCard } from "@/components/ModernEventCard";
import { categories } from "@/data/events";

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {filteredEvents.map((event, index) => (
                  <ModernEventCard
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
