import { Link } from "react-router-dom";

const contacts = [
  { role: "General Secretary", name: "Dr. Priya Sharma", phone: "+91 98765 43210" },
  { role: "Culturals", name: "Gokulakannan G", phone: "+91 63798 54373" },
  { role: "Sports", name: "Rahul Verma", phone: "+91 87654 32109" },
  { role: "Technical", name: "Sneha Patel", phone: "+91 76543 21098" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-charcoal py-12">
      <div className="container mx-auto px-4">
        {/* Contact Section */}
        <div className="mb-8">
          <h3 className="text-primary font-serif font-bold text-lg mb-6 text-center flex items-center justify-center gap-2">
            <span>📞</span>
            Contact Us
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contacts.map((contact) => (
              <div key={contact.role} className="text-center">
                <p className="text-primary font-medium text-sm mb-1">{contact.role}</p>
                <p className="text-silver text-xs mb-1">{contact.name}</p>
                <a
                  href={`https://wa.me/${contact.phone.replace(/\s/g, "").replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-silver text-xs hover:text-secondary transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/brochure-links"
              className="text-silver text-xs hover:text-primary hover:underline transition-colors"
            >
              Event registration links
            </Link>
            <a
              href="#events"
              className="text-silver text-xs hover:text-primary hover:underline transition-colors"
            >
              Explore events
            </a>
          </div>
          <p className="text-silver text-xs">
            © 2025 ADWAITA 2026 | Organized by Government Medical College
          </p>
        </div>
      </div>
    </footer>
  );
}
