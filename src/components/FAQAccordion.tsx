import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "General Rules",
    items: [
      {
        question: "Who can participate in ADWAITA 2026?",
        answer: "All bonafide students from recognized medical and dental colleges across India are eligible to participate. A valid college ID is mandatory for registration and participation.",
      },
      {
        question: "Can we participate in multiple events?",
        answer: "Yes, participants can register for multiple events across different categories. However, ensure there are no time clashes between events you register for.",
      },
    ],
  },
  {
    title: "Registration",
    items: [
      {
        question: "How do I register for events?",
        answer: "Registration is done through our official website. Select your events, fill in the required details, and complete the payment through the payment gateway. You'll receive a confirmation email upon successful registration.",
      },
      {
        question: "Is there a refund policy?",
        answer: "Refunds are not available once registration is confirmed. However, you may transfer your registration to another eligible participant with prior approval from the organizing committee.",
      },
    ],
  },
  {
    title: "Judging",
    items: [
      {
        question: "Who will judge the events?",
        answer: "All events will be judged by a panel of qualified professionals and experts in their respective fields. Their decisions will be final and binding.",
      },
      {
        question: "What are the judging criteria?",
        answer: "Judging criteria vary by event and will be shared with participants before the event. Generally, creativity, technique, presentation, and adherence to rules are evaluated.",
      },
    ],
  },
  {
    title: "Important Dates",
    items: [
      {
        question: "When is the registration deadline?",
        answer: "Early bird registration closes on January 15, 2026. Regular registration closes on February 1, 2026. Some events may have earlier deadlines - check individual event pages for details.",
      },
      {
        question: "When will the fest take place?",
        answer: "ADWAITA 2026 will be held from February 15-17, 2026. Detailed schedules will be shared with registered participants one week before the event.",
      },
    ],
  },
  {
    title: "FAQs",
    items: [
      {
        question: "Is accommodation provided?",
        answer: "Yes, accommodation can be arranged for outstation participants at nominal charges. Please indicate your accommodation requirement during registration.",
      },
      {
        question: "How do I reach the venue?",
        answer: "The venue is well-connected by road, rail, and air. Detailed directions and pickup services will be shared with registered participants.",
      },
    ],
  },
];

export function FAQAccordion() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="faqs" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-primary text-2xl md:text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <div className="section-underline mx-auto"></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqSections.map((section) => (
            <div key={section.title} className="border border-primary/40 rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-4 bg-muted/30 text-card-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-sm text-primary">{section.title}</span>
                {openSections[section.title] ? (
                  <ChevronDown size={18} className="text-primary" />
                ) : (
                  <ChevronRight size={18} className="text-primary" />
                )}
              </button>

              {/* Section Content */}
              {openSections[section.title] && (
                <div className="bg-card divide-y divide-primary/20">
                  {section.items.map((item, index) => {
                    const itemKey = `${section.title}-${index}`;
                    return (
                      <div key={itemKey}>
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/10 transition-colors"
                        >
                          <span className="text-sm text-card-foreground font-medium pr-4">
                            {item.question}
                          </span>
                          {openItems[itemKey] ? (
                            <ChevronDown size={16} className="text-secondary flex-shrink-0" />
                          ) : (
                            <ChevronRight size={16} className="text-secondary flex-shrink-0" />
                          )}
                        </button>
                        {openItems[itemKey] && (
                          <div className="px-4 pb-4 border-t border-primary/20 pt-3">
                            <p className="text-silver text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
