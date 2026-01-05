import { useState, useEffect } from "react";
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

  // Preload Google Maps iframe
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://www.google.com';
    document.head.appendChild(link);
    
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.3088850949747!2d79.83248557507825!3d11.933847888264066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361ab8e49cfcf%3A0xcc6bd326d2f0b04e!2sIndira%20Gandhi%20Medical%20College%20and%20Research%20Institute!5e0!3m2!1sen!2sin!4v1699900000000!5m2!1sen!2sin';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(iframe);
    };
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };
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
          onLoadComplete={handleLoadComplete}
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
