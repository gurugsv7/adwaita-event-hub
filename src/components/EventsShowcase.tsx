import { CategoryCard } from "./CategoryCard";

const categoryData = [
  {
    id: "culturals",
    emoji: "🎤",
    title: "Culturals",
    description:
      "From soul-stirring melodies to electrifying dance battles—experience the heartbeat of artistic expression across solo and group performances.",
    eventCount: 6,
    prizePool: "₹50K+",
    accentColor: "gold" as const,
    featured: true,
  },
  {
    id: "sports",
    emoji: "🏃",
    title: "Sports",
    description:
      "Compete in high-intensity sporting events. From cricket to chess, prove your athletic prowess.",
    eventCount: 6,
    prizePool: "₹75K+",
    accentColor: "orange" as const,
  },
  {
    id: "fine-arts",
    emoji: "🎨",
    title: "Fine Arts",
    description:
      "Unleash your creativity through painting, rangoli, mehendi, and more visual artistry.",
    eventCount: 4,
    prizePool: "₹15K+",
    accentColor: "gold" as const,
  },
  {
    id: "literature",
    emoji: "📚",
    title: "Literature",
    description:
      "Debate, write, recite—where words become weapons and eloquence wins the day.",
    eventCount: 5,
    prizePool: "₹20K+",
    accentColor: "teal" as const,
  },
  {
    id: "academic",
    emoji: "🔬",
    title: "Academic",
    description:
      "Showcase your medical knowledge through paper presentations, quizzes, and case studies.",
    eventCount: 3,
    prizePool: "₹25K+",
    accentColor: "gold" as const,
  },
  {
    id: "photography",
    emoji: "📷",
    title: "Photography",
    description:
      "Capture moments that tell stories. From still shots to reels, frame your perspective.",
    eventCount: 3,
    prizePool: "₹15K+",
    accentColor: "teal" as const,
  },
  {
    id: "technical",
    emoji: "💻",
    title: "Technical",
    description:
      "Code, design, innovate. Build solutions that could transform healthcare.",
    eventCount: 3,
    prizePool: "₹40K+",
    accentColor: "orange" as const,
    featured: true,
  },
  {
    id: "other",
    emoji: "🎭",
    title: "Special Events",
    description:
      "Treasure hunts, gaming, stand-up comedy, and the prestigious Mr. & Ms. ADWAITA title.",
    eventCount: 4,
    prizePool: "₹35K+",
    accentColor: "teal" as const,
  },
];

export function EventsShowcase() {
  return (
    <section id="events" className="py-20 bg-background">
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
          {categoryData.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
