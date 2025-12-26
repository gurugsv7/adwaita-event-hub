import { EventCard, Event } from "./EventCard";

interface CategorySectionProps {
  emoji: string;
  title: string;
  secretary: {
    name: string;
    phone: string;
  };
  events: Event[];
  borderColor: string;
}

export function CategorySection({
  emoji,
  title,
  secretary,
  events,
  borderColor,
}: CategorySectionProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="font-serif text-primary text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span>{emoji}</span>
            <span>{title}</span>
          </h2>
          <div className="section-underline mt-3 mb-4"></div>
          <div className="border-l-4 border-secondary pl-3">
            <p className="text-silver text-sm">
              Secretary: <span className="font-medium">{secretary.name}</span> |{" "}
              <a
                href={`tel:${secretary.phone}`}
                className="hover:text-secondary transition-colors"
              >
                {secretary.phone}
              </a>
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} borderColor={borderColor} />
          ))}
        </div>
      </div>
    </section>
  );
}
