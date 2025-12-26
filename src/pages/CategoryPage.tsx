import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { categories } from "@/data/events";

const feeOptions = ["All", "Free", "₹100-200", "₹200-500", "₹500+"];
const typeOptions = ["All", "Individual", "Team", "Group"];
const statusOptions = ["All", "Open", "Coming Soon", "Closed"];

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    fee: "All",
    type: "All",
    status: "All",
  });

  const category = categories.find((c) => c.id === categoryId);

  const filteredEvents = useMemo(() => {
    if (!category) return [];

    return category.events.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFee = true;
      if (filters.fee !== "All") {
        if (filters.fee === "Free") matchesFee = event.fee === 0;
        else if (filters.fee === "₹100-200")
          matchesFee = event.fee >= 100 && event.fee <= 200;
        else if (filters.fee === "₹200-500")
          matchesFee = event.fee > 200 && event.fee <= 500;
        else if (filters.fee === "₹500+") matchesFee = event.fee > 500;
      }

      const matchesType =
        filters.type === "All" || event.teamType === filters.type;

      const matchesStatus =
        filters.status === "All" || event.status === filters.status;

      return matchesSearch && matchesFee && matchesType && matchesStatus;
    });
  }, [category, searchQuery, filters]);

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
        <section className="gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/#events"
              className="inline-flex items-center gap-2 text-silver/70 hover:text-silver transition-colors mb-8"
            >
              <ArrowLeft size={18} />
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
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="sticky top-16 z-40 bg-card border-b-2 border-primary py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-secondary rounded-lg bg-card text-card-foreground input-teal focus:border-primary transition-colors"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-card-foreground text-sm font-medium">Fee:</span>
                  <div className="flex gap-1 flex-wrap">
                    {feeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, fee: option }))
                        }
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filters.fee === option
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-card-foreground text-sm font-medium">Type:</span>
                  <div className="flex gap-1 flex-wrap">
                    {typeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, type: option }))
                        }
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filters.type === option
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-card-foreground text-sm font-medium">
                    Status:
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, status: option }))
                        }
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filters.status === option
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <main className="py-12">
          <div className="container mx-auto px-4">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    borderColor={category.borderColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-silver text-lg">
                  No events found matching your criteria.
                </p>
                <button
                  onClick={() =>
                    setFilters({ fee: "All", type: "All", status: "All" })
                  }
                  className="mt-4 text-secondary hover:underline"
                >
                  Clear filters
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
