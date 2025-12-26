import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const delegateData = {
  premium: {
    name: "Premium Delegate",
    price: "₹850",
    description:
      "The Premium Delegate pass offers the ultimate ADWAITA 2026 experience. Enjoy exclusive access to the proshow, full-set performances by professional bands, and all three DJ nights. This is the best choice for those who want to immerse themselves in the complete cultural extravaganza.",
    includes: [
      "Full access to Proshow with celebrity performances",
      "Complete pro band experience with full-set performances",
      "DJ Night Day 1, 2 & 3 access",
      "Priority seating at main events",
      "Exclusive delegate merchandise",
      "Best experience for cultural enthusiasts",
    ],
  },
  standard: {
    name: "Standard Delegate",
    price: "₹450",
    description:
      "The Standard Delegate pass gives you access to key highlights of ADWAITA 2026. Enjoy one pro band night and two DJ nights while experiencing the vibrant atmosphere of our cultural fest.",
    includes: [
      "Access to one pro band night performance",
      "DJ Night Day 1 & 2 access",
      "Entry to all public events and competitions",
      "Delegate ID badge",
      "Great value for music lovers",
    ],
  },
  participant: {
    name: "Participant Delegate",
    price: "₹250",
    description:
      "The Participant Delegate pass is perfect for those who want to compete and showcase their talents. Get access to all competitions and enjoy the Day 1 DJ night.",
    includes: [
      "Eligibility for all competitions and events",
      "DJ Night Day 1 access",
      "Entry to all public areas",
      "Participant certificate",
      "Perfect for competitors and performers",
    ],
  },
};

const steps = [
  "Buy your delegate pass online.",
  "Get a unique delegate ID on your receipt / email.",
  "Show the ID at registration desk to collect physical badge.",
];

export default function DelegateDetailsPage() {
  const { tierId } = useParams<{ tierId: string }>();
  const delegate = delegateData[tierId as keyof typeof delegateData];

  if (!delegate) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-primary text-2xl font-bold mb-4">
            Delegate tier not found
          </h1>
          <Link to="/" className="text-accent hover:text-primary transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Back Link */}
          <Link
            to="/#delegates"
            className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Delegate Options
          </Link>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-muted/40 to-background border border-primary rounded-lg p-6 md:p-8 shadow-lg">
            {/* Title */}
            <h1 className="font-serif font-bold text-primary text-2xl md:text-3xl mb-2">
              {delegate.name}
            </h1>
            <p className="text-primary text-xl md:text-2xl font-bold mb-6">
              {delegate.price}
            </p>

            {/* Description */}
            <p className="text-silver text-sm md:text-base leading-relaxed mb-6">
              {delegate.description}
            </p>

            {/* Details Table */}
            <div className="bg-background/30 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-silver/70 text-xs">Delegate Type</p>
                  <p className="text-foreground font-medium">{delegate.name}</p>
                </div>
                <div>
                  <p className="text-silver/70 text-xs">Price</p>
                  <p className="text-primary font-bold">{delegate.price}</p>
                </div>
              </div>

              <div>
                <p className="text-silver/70 text-xs mb-2">Includes:</p>
                <ul className="space-y-2">
                  {delegate.includes.map((item, index) => (
                    <li
                      key={index}
                      className="text-silver text-sm flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How it works */}
            <div className="mb-8">
              <h3 className="text-foreground font-bold text-sm mb-3">
                How delegate ID works:
              </h3>
              <ol className="space-y-2">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="text-silver text-xs flex items-start gap-2"
                  >
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-primary text-background font-bold text-sm py-3 px-6 rounded-full hover:bg-accent hover:text-primary transition-colors duration-300">
                Proceed to Payment
              </button>
              <Link
                to="/#delegates"
                className="flex-1 text-center border border-accent text-accent font-bold text-sm py-3 px-6 rounded-full hover:bg-accent hover:text-background transition-colors duration-300"
              >
                Back to Delegate Options
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
