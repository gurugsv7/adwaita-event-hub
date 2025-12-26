import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilterBar } from "@/components/SearchFilterBar";
import { CategorySection } from "@/components/CategorySection";
import { StatisticsSection } from "@/components/StatisticsSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";
import { categories } from "@/data/events";
import { Helmet } from "react-helmet";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    fee: "All",
    type: "All",
    status: "All",
  });

  const filteredCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      events: category.events.filter((event) => {
        // Search filter
        const matchesSearch =
          searchQuery === "" ||
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Fee filter
        let matchesFee = true;
        if (filters.fee !== "All") {
          if (filters.fee === "Free") matchesFee = event.fee === 0;
          else if (filters.fee === "₹100-200")
            matchesFee = event.fee >= 100 && event.fee <= 200;
          else if (filters.fee === "₹200-500")
            matchesFee = event.fee > 200 && event.fee <= 500;
          else if (filters.fee === "₹500+") matchesFee = event.fee > 500;
        }

        // Type filter
        const matchesType =
          filters.type === "All" || event.teamType === filters.type;

        // Status filter
        const matchesStatus =
          filters.status === "All" ||
          (filters.status === "Open" && event.status === "Open") ||
          (filters.status === "Coming Soon" && event.status === "Coming Soon") ||
          (filters.status === "Closed" && event.status === "Closed");

        return matchesSearch && matchesFee && matchesType && matchesStatus;
      }),
    })).filter((category) => category.events.length > 0);
  }, [searchQuery, filters]);

  return (
    <>
      <Helmet>
        <title>ADWAITA 2026 | Where Medicine Meets Culture</title>
        <meta
          name="description"
          content="Join ADWAITA 2026, the grandest inter-college cultural extravaganza with 50+ events, ₹5,50,000 prize pool, and participants from 100+ colleges."
        />
        <meta
          name="keywords"
          content="ADWAITA 2026, medical college fest, cultural fest, college events, India"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <SearchFilterBar
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
        />

        <main id="events" className="bg-background">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <CategorySection
                key={category.id}
                emoji={category.emoji}
                title={category.title}
                secretary={category.secretary}
                events={category.events}
                borderColor={category.borderColor}
              />
            ))
          ) : (
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-silver text-lg">
                No events found matching your criteria.
              </p>
              <p className="text-silver/60 text-sm mt-2">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </main>

        <StatisticsSection />
        <FAQAccordion />
        <Footer />
      </div>
    </>
  );
};

export default Index;
