import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { DelegatePassSection } from "@/components/DelegatePassSection";
import { EventsShowcase } from "@/components/EventsShowcase";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Helmet } from "react-helmet";
import EventChatbot from "@/components/EventChatbot";

const VIDEO_SRC = "/Untitled video - Made with Clipchamp.mp4";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

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

      {isLoading && (
        <LoadingScreen
          videoSrc={VIDEO_SRC}
          onLoadComplete={() => setIsLoading(false)}
        />
      )}

      <div className={`min-h-screen bg-background ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <Navbar />
        <HeroSection />
        <DelegatePassSection />
        <EventsShowcase />
        <FAQAccordion />
        <Footer />
        <EventChatbot />
      </div>
    </>
  );
};

export default Index;
