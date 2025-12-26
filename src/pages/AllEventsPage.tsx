import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";

import culturalsImg from "@/assets/category-culturals.jpg";
import sportsImg from "@/assets/category-sports.jpg";
import fineArtsImg from "@/assets/category-finearts.jpg";
import literatureImg from "@/assets/category-literature.jpg";
import academicImg from "@/assets/category-academic.jpg";
import photographyImg from "@/assets/category-photography.jpg";
import technicalImg from "@/assets/category-technical.jpg";
import otherImg from "@/assets/category-other.jpg";

const allCategories = [
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
  },
  {
    id: "fine-arts",
    title: "Fine Arts",
    description:
      "Unleash your creativity through painting, rangoli, mehendi, and more visual artistry.",
    eventCount: 4,
    prizePool: "₹15K+",
    accentColor: "gold" as const,
    image: fineArtsImg,
  },
  {
    id: "literature",
    title: "Literature",
    description:
      "Debate, write, recite—where words become weapons and eloquence wins the day.",
    eventCount: 5,
    prizePool: "₹20K+",
    accentColor: "teal" as const,
    image: literatureImg,
  },
  {
    id: "academic",
    title: "Academic",
    description:
      "Showcase your medical knowledge through paper presentations, quizzes, and case studies.",
    eventCount: 3,
    prizePool: "₹25K+",
    accentColor: "gold" as const,
    image: academicImg,
  },
  {
    id: "photography",
    title: "Photography",
    description:
      "Capture moments that tell stories. From still shots to reels, frame your perspective.",
    eventCount: 3,
    prizePool: "₹15K+",
    accentColor: "teal" as const,
    image: photographyImg,
  },
  {
    id: "technical",
    title: "Technical",
    description:
      "Code, design, innovate. Build solutions that could transform healthcare.",
    eventCount: 3,
    prizePool: "₹40K+",
    accentColor: "orange" as const,
    image: technicalImg,
    featured: true,
  },
  {
    id: "other",
    title: "Special Events",
    description:
      "Treasure hunts, gaming, stand-up comedy, and the prestigious Mr. & Ms. ADWAITA title.",
    eventCount: 4,
    prizePool: "₹35K+",
    accentColor: "teal" as const,
    image: otherImg,
  },
];

export default function AllEventsPage() {
  return (
    <>
      <Helmet>
        <title>All Events | ADWAITA 2026</title>
        <meta
          name="description"
          content="Explore all 50+ events across 8 categories at ADWAITA 2026 - Culturals, Sports, Fine Arts, Literature, Academic, Photography, Technical, and Special Events."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="py-16 gradient-stats">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Link
                to="/"
                className="text-secondary text-sm font-medium uppercase tracking-widest mb-3 inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
              <h1 className="font-serif text-primary text-4xl md:text-6xl font-bold mb-6">
                All Event Categories
              </h1>
              <p className="text-silver/80 text-lg leading-relaxed">
                Discover 50+ events across 8 exciting domains. Whether you're a
                performer, athlete, artist, or innovator—find your stage and
                register now.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 gradient-stats min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
              {allCategories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
