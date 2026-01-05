import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Calendar, Trophy, Users, Sparkles, ArrowUp, ExternalLink } from "lucide-react";

const stats = [
  { icon: Sparkles, value: "50+", label: "Events" },
  { icon: Trophy, value: "₹5.5L", label: "Prize Pool" },
  { icon: Users, value: "100+", label: "Colleges" },
  { icon: Calendar, value: "Oct 8-12", label: "2026" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Events", href: "/events" },
  { name: "Delegate Pass", href: "/delegate" },
  { name: "Krishh Concert", href: "/krishh" },
];

const competitions = [
  { name: "Culturals", href: "/category/culturals" },
  { name: "Sports", href: "/category/sports" },
  { name: "Technical", href: "/category/technical" },
  { name: "Fine Arts", href: "/category/finearts" },
];

const contacts = [
  { role: "General Secretary", name: "Dr. Priya Sharma", phone: "+91 98765 43210" },
  { role: "Culturals", name: "Gokulakannan G", phone: "+91 63798 54373" },
  { role: "Sports", name: "Rahul Verma", phone: "+91 87654 32109" },
  { role: "Technical", name: "Sneha Patel", phone: "+91 76543 21098" },
];

// Animated background orb component
function GlowingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
    />
  );
}

// Neural network node connections
function NeuralNetwork() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#00FFD9" />
        </linearGradient>
      </defs>
      {/* Connection lines */}
      <path d="M50,50 Q200,100 350,80 T650,120" stroke="url(#nodeGradient)" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M100,150 Q300,200 500,180 T750,220" stroke="url(#nodeGradient)" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M30,250 Q180,300 380,270 T700,320" stroke="url(#nodeGradient)" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Nodes */}
      {[
        { cx: 50, cy: 50 }, { cx: 200, cy: 100 }, { cx: 350, cy: 80 }, { cx: 500, cy: 100 }, { cx: 650, cy: 120 },
        { cx: 100, cy: 150 }, { cx: 300, cy: 200 }, { cx: 500, cy: 180 }, { cx: 700, cy: 200 },
        { cx: 150, cy: 280 }, { cx: 380, cy: 270 }, { cx: 550, cy: 300 }, { cx: 720, cy: 280 },
      ].map((node, i) => (
        <circle key={i} cx={node.cx} cy={node.cy} r="3" fill="url(#nodeGradient)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] via-[#2D1B4E] to-[#1A1A2E]" />
      
      {/* Animated glowing orbs */}
      <GlowingOrb className="w-96 h-96 bg-concert-pink -left-48 top-0" delay={0} />
      <GlowingOrb className="w-80 h-80 bg-concert-cyan right-0 top-1/3" delay={1.5} />
      <GlowingOrb className="w-64 h-64 bg-concert-gold left-1/3 bottom-0" delay={3} />
      
      {/* Neural network background */}
      <NeuralNetwork />

      <div className="relative z-10">
        {/* ===== HOOK HEADER SECTION ===== */}
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="text-center space-y-6">
            {/* Massive gradient title */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-concert-gold via-[#F0C850] to-concert-cyan bg-clip-text text-transparent drop-shadow-lg">
                STRIATUM 3.0
              </span>
            </h2>
            
            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-xl mx-auto">
              Where Medicine Meets Culture
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/delegate"
                className="group relative px-8 py-3 bg-gradient-to-r from-concert-gold to-[#F0C850] rounded-full font-semibold text-[#1A1A2E] shadow-lg shadow-concert-gold/30 hover:shadow-concert-gold/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Register Now</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-concert-gold to-[#F0C850] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              </Link>
              
              <Link
                to="/events"
                className="group px-8 py-3 rounded-full font-semibold text-white border border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-concert-cyan/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-concert-cyan/20"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>

        {/* ===== STATS STRIP ===== */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-concert-cyan/30 transition-all duration-300 hover:bg-white/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-concert-cyan/0 to-concert-pink/0 group-hover:from-concert-cyan/10 group-hover:to-concert-pink/10 transition-all duration-300" />
                
                <div className="relative flex flex-col items-center text-center space-y-2">
                  <stat.icon className="w-6 h-6 text-concert-gold" />
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient separator */}
        <div className="container mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-concert-gold/50 to-transparent" />
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Contact Card (Featured) */}
            <div className="lg:col-span-1 md:col-span-2 lg:row-span-1">
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 space-y-4">
                <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-concert-gold animate-pulse" />
                  Contact Us
                </h3>
                
                <div className="space-y-3">
                  <a 
                    href="mailto:striatum.3.igmcri@gmail.com" 
                    className="flex items-center gap-3 text-gray-300 hover:text-concert-cyan transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-concert-cyan group-hover:scale-110 transition-transform" />
                    <span className="text-sm break-all">striatum.3.igmcri@gmail.com</span>
                  </a>
                  
                  <div className="flex items-start gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-concert-pink flex-shrink-0 mt-0.5" />
                    <span className="text-sm">IGMCRI, Puducherry</span>
                  </div>
                </div>

                {/* Contact persons grid */}
                <div className="pt-2 space-y-2">
                  {contacts.slice(0, 2).map((contact) => (
                    <a
                      key={contact.role}
                      href={`https://wa.me/${contact.phone.replace(/\s/g, "").replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-concert-cyan transition-colors group"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{contact.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                <span className="text-concert-cyan">✦</span>
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-cyan group-hover:shadow-lg group-hover:shadow-concert-cyan/50 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Competitions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                <span className="text-concert-pink">✦</span>
                Competitions
              </h3>
              <ul className="space-y-2">
                {competitions.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-pink group-hover:shadow-lg group-hover:shadow-concert-pink/50 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                <span className="text-concert-gold">✦</span>
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/brochure-links"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-gold group-hover:shadow-lg group-hover:shadow-concert-gold/50 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Registration Links
                    </span>
                  </Link>
                </li>
                <li>
                  <a
                    href="#events"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-gold group-hover:shadow-lg group-hover:shadow-concert-gold/50 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Event Brochure
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-gold group-hover:shadow-lg group-hover:shadow-concert-gold/50 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Follow Us
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="container mx-auto px-4">
          {/* Gradient separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-concert-gold/50 to-transparent mb-6" />
          
          <div className="pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">
              © 2025 <span className="text-concert-gold">STRIATUM 3.0</span> | IGMCRI & Helios Academic Society
            </p>
            
            <p className="text-xs text-gray-500">
              Connecting Knowledge, Sparking Innovation
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-concert-gold to-[#F0C850] text-[#1A1A2E] shadow-lg shadow-concert-gold/30 transition-all duration-300 hover:scale-110 hover:shadow-concert-gold/50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-concert-gold/30 animate-ping" />
      </button>
    </footer>
  );
}
