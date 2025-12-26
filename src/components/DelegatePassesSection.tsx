import { Link } from "react-router-dom";

const delegateTiers = [
  {
    id: "premium",
    name: "Premium Delegate",
    price: "₹850",
    description: "Top-tier access to proshow, full pro band and all three DJs.",
    bullets: [
      "Proshow + full-set pro band",
      "DJ Night Day 1, 2 & 3",
      "Best experience for cultural crowd",
    ],
  },
  {
    id: "standard",
    name: "Standard Delegate",
    price: "₹450",
    description: "Access to one pro band and Day 1 & 2 DJ nights.",
    bullets: [
      "One pro band night",
      "DJ Night Day 1 & 2",
    ],
  },
  {
    id: "participant",
    name: "Participant Delegate",
    price: "₹250",
    description: "Access to participate in all events and Day 1 DJ night.",
    bullets: [
      "Eligible for all competitions",
      "DJ Night Day 1 access",
    ],
  },
];

export function DelegatePassesSection() {
  return (
    <section className="bg-background py-6 px-4 md:py-16 md:px-10">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <h2 className="text-center font-serif font-bold text-primary text-xl md:text-3xl mb-2">
          🎟️ Delegate Passes
        </h2>
        
        {/* Subtitle */}
        <p className="text-center text-silver/80 text-xs md:text-sm mb-6 md:mb-10">
          Choose your access level for ADWAITA 2026
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {delegateTiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-gradient-to-br from-muted/40 to-background border border-primary rounded-lg p-4 md:p-6 flex flex-col shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-foreground font-bold text-sm md:text-base">
                  {tier.name}
                </h3>
                <div className="text-right">
                  <p className="text-primary font-bold text-base md:text-lg">
                    {tier.price}
                  </p>
                  <p className="text-silver text-[11px]">per person</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-silver text-xs md:text-[13px] mb-3 line-clamp-2">
                {tier.description}
              </p>

              {/* Bullets */}
              <ul className="space-y-1.5 mb-4 flex-grow">
                {tier.bullets.map((bullet, index) => (
                  <li
                    key={index}
                    className="text-silver/90 text-[11px] md:text-xs flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={`/delegate/${tier.id}`}
                className="w-full md:w-auto text-center bg-primary text-background font-bold text-[13px] md:text-sm py-2.5 px-6 rounded-full hover:bg-accent hover:text-primary transition-colors duration-300"
              >
                Get Delegate Pass
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
