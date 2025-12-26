const categoryLinks = [
  {
    emoji: "🎤",
    title: "Culturals",
    links: ["Singing", "Dance", "Fashion", "Drama", "Music"],
  },
  {
    emoji: "🏃",
    title: "Sports",
    links: ["Cricket", "Football", "Badminton", "Chess", "Athletics"],
  },
  {
    emoji: "🎨",
    title: "Fine Arts",
    links: ["Painting", "Sketching", "Sculpture", "Craft", "Rangoli"],
  },
];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Stats Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-primary font-bold text-lg">ADWAITA 2026</h3>
            <div className="space-y-2">
              <p className="text-primary font-bold text-lg">50+ Events</p>
              <p className="text-primary font-bold text-lg">₹5,50,000 Prize Pool</p>
              <p className="text-silver text-sm">100+ Colleges</p>
            </div>
          </div>

          {/* Category Links */}
          {categoryLinks.map((category) => (
            <div key={category.title} className="space-y-3">
              <h4 className="text-primary font-semibold text-sm flex items-center gap-2">
                <span>{category.emoji}</span>
                {category.title}
              </h4>
              <ul className="space-y-1">
                {category.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-silver text-xs hover:text-primary hover:underline transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts Column */}
          <div className="space-y-3">
            <h4 className="text-primary font-semibold text-sm flex items-center gap-2">
              <span>📞</span>
              Contact Us
            </h4>
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li key={contact.role} className="text-silver text-xs">
                  <span className="font-medium">{contact.role}:</span>
                  <br />
                  {contact.name}
                  <br />
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\s/g, "").replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                  >
                    {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-6 text-center">
          <p className="text-silver text-xs">
            © 2025 ADWAITA 2026 | Organized by Government Medical College
          </p>
        </div>
      </div>
    </footer>
  );
}
