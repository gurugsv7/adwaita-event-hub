import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Events", href: "#events" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <nav className="sticky top-0 z-50 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-primary font-serif font-bold text-lg">
            ADWAITA 2026
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveItem(item.label)}
                className={`text-sm transition-colors duration-200 ${
                  activeItem === item.label
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-silver hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Register Button */}
          <Link
            to="/categories"
            className="hidden md:block btn-gold text-sm py-2 px-4 rounded"
          >
            Register Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-silver hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.label);
                    setIsOpen(false);
                  }}
                  className={`text-sm py-2 transition-colors duration-200 ${
                    activeItem === item.label
                      ? "text-primary border-l-2 border-primary pl-4"
                      : "text-silver hover:text-primary pl-4"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/categories"
                className="btn-gold text-sm py-3 px-4 rounded text-center mt-2"
                onClick={() => setIsOpen(false)}
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
