import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";
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

const formatPrize = (amount: number) => {
  if (amount >= 1000) {
    return `₹${amount / 1000}K`;
  }
  return `₹${amount}`;
};

interface EventCardProps {
  event: {
    id: string;
    title: string;
    fee: number;
    teamType: string;
    status: string;
    prizes: { first: number; second: number; third: number };
  };
  categoryId: string;
  index: number;
}

function EventCard({ event, categoryId, index }: EventCardProps) {
  return (
    <div
      className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Event Header */}
      <div className="p-5 pb-4 border-b border-border/30">
        <h3 className="font-serif font-bold text-foreground text-lg group-hover:text-primary transition-colors">
          {event.title}
        </h3>
      </div>

      {/* Event Details */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-silver/70 text-sm">Fee:</span>
          <span className="text-foreground font-medium">
            {event.fee === 0 ? "Free" : `₹${event.fee}`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-silver/70 text-sm">Type:</span>
          <span className="text-foreground font-medium">{event.teamType}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-silver/70 text-sm">Prize:</span>
          <span className="text-primary font-semibold">
            {formatPrize(event.prizes.first)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-silver/70 text-sm">Status:</span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* Register Button */}
      <div className="p-5 pt-3">
        <Link
          to={`/events/${categoryId}/${event.id}/register`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-medium rounded-lg transition-all duration-300 group/btn"
        >
          <span>Register Now</span>
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

  const filteredSubCategories = useMemo(() => {
    if (!category) return [];

    if (searchQuery === "") {
      return category.subCategories;
    }

    return category.subCategories
      .map((subCat) => ({
        ...subCat,
        events: subCat.events.filter((event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((subCat) => subCat.events.length > 0);
  }, [category, searchQuery]);

  const totalEvents = useMemo(() => {
    if (!category) return 0;
    return category.subCategories.reduce((acc, sub) => acc + sub.events.length, 0);
  }, [category]);

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
          content={`Explore ${category.title} events at ADWAITA 2026. ${totalEvents} events with exciting prizes.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Header */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/#events"
              className="inline-flex items-center gap-2 text-silver/70 hover:text-silver transition-colors mb-8 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to All Categories</span>
            </Link>

            <div className="flex items-start gap-6">
              <span className="text-5xl md:text-7xl">{category.emoji}</span>
              <div>
                <h1 className="font-serif font-bold text-primary text-3xl md:text-5xl mb-3">
                  {category.title}
                </h1>
                <div className="border-l-4 border-secondary pl-4">
                  <p className="text-silver text-sm md:text-base">
                    Secretary:{" "}
                    <span className="font-medium">{category.secretary.name}</span>
                    <span className="mx-2">|</span>
                    <a
                      href={`tel:${category.secretary.phone}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {category.secretary.phone}
                    </a>
                  </p>
                </div>
                <p className="text-silver/60 text-sm mt-3">
                  {totalEvents} events available
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="sticky top-16 z-40 gradient-stats border-b border-primary/30 py-4">
          <div className="container mx-auto px-4">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary/40 rounded-lg bg-background/50 text-foreground placeholder:text-silver/50 input-teal focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Events by Sub-Category */}
        <main className="py-12 gradient-stats">
          <div className="container mx-auto px-4">
            {filteredSubCategories.length > 0 ? (
              <div className="space-y-12">
                {filteredSubCategories.map((subCategory, subIndex) => (
                  <section
                    key={subCategory.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${subIndex * 100}ms` }}
                  >
                    {/* Sub-Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">{subCategory.icon}</span>
                      <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground">
                        {subCategory.name}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent ml-4" />
                      <span className="text-silver/60 text-sm">
                        {subCategory.events.length} events
                      </span>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {subCategory.events.map((event, eventIndex) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          categoryId={category.id}
                          index={eventIndex}
                        />
                      ))}
                    </div>
                  </section>
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
