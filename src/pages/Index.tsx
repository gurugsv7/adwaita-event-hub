import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { EventsShowcase } from "@/components/EventsShowcase";
import { StatisticsSection } from "@/components/StatisticsSection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
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
        <EventsShowcase />
        <StatisticsSection />
        <FAQAccordion />
        <Footer />
      </div>
    </>
  );
};

export default Index;
