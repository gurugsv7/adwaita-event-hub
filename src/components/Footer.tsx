import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
const quickLinks = [{
  name: "Home",
  href: "/"
}, {
  name: "All Events",
  href: "/events"
}, {
  name: "Delegate Pass",
  href: "/delegate"
}, {
  name: "Krishh Concert",
  href: "/krishh"
}];
const competitions = [{
  name: "Culturals",
  href: "/events/culturals"
}, {
  name: "Sports",
  href: "/events/sports"
}, {
  name: "Fine Arts",
  href: "/events/fine-arts"
}, {
  name: "Literature & Debate",
  href: "/events/literature"
}, {
  name: "Academic",
  href: "/events/academic"
}, {
  name: "Technical",
  href: "/events/technical"
}, {
  name: "Photography",
  href: "/events/photography"
}, {
  name: "Graphic Designing",
  href: "/events/design"
}, {
  name: "Social Service",
  href: "/events/social-service"
}, {
  name: "Other",
  href: "/events/other"
}];
const contacts = [{
  role: "Contact",
  name: "Sanjeev",
  phone: "+91 9080617754"
}, {
  role: "Contact",
  name: "Srihariharan",
  phone: "+91 9597080710"
}];

// Animated background orb component
function GlowingOrb({
  className,
  delay = 0
}: {
  className?: string;
  delay?: number;
}) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`} style={{
    animationDelay: `${delay}s`,
    animationDuration: '4s'
  }} />;
}

// Neural network node connections
function NeuralNetwork() {
  return <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 800 400">
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
      {[{
      cx: 50,
      cy: 50
    }, {
      cx: 200,
      cy: 100
    }, {
      cx: 350,
      cy: 80
    }, {
      cx: 500,
      cy: 100
    }, {
      cx: 650,
      cy: 120
    }, {
      cx: 100,
      cy: 150
    }, {
      cx: 300,
      cy: 200
    }, {
      cx: 500,
      cy: 180
    }, {
      cx: 700,
      cy: 200
    }, {
      cx: 150,
      cy: 280
    }, {
      cx: 380,
      cy: 270
    }, {
      cx: 550,
      cy: 300
    }, {
      cx: 720,
      cy: 280
    }].map((node, i) => <circle key={i} cx={node.cx} cy={node.cy} r="3" fill="url(#nodeGradient)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>)}
    </svg>;
}
export function Footer() {
  return <footer id="contact" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] via-[#2D1B4E] to-[#1A1A2E]" />
      
      {/* Animated glowing orbs */}
      <GlowingOrb className="w-96 h-96 bg-concert-pink -left-48 top-0" delay={0} />
      <GlowingOrb className="w-80 h-80 bg-concert-cyan right-0 top-1/3" delay={1.5} />
      <GlowingOrb className="w-64 h-64 bg-concert-gold left-1/3 bottom-0" delay={3} />
      
      {/* Neural network background */}
      <NeuralNetwork />

      <div className="relative z-10">
        {/* ===== CONTENT GRID ===== */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left side - Links and Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Contact Card (Featured) */}
              <div className="sm:col-span-1">
                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 space-y-4">
                  <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-concert-gold animate-pulse" />
                    Contact Us
                  </h3>
                  
                  <div className="space-y-3">
                    <a href="mailto:adwaitaigmcri@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-concert-cyan transition-colors group">
                      <Mail className="w-5 h-5 text-concert-cyan group-hover:scale-110 transition-transform" />
                      <span className="text-sm break-all">adwaitaigmcri@gmail.com</span>
                    </a>
                    
                    <div className="flex items-start gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-concert-pink flex-shrink-0 mt-0.5" />
                      <span className="text-sm">IGMCRI, Puducherry</span>
                    </div>
                  </div>

                  {/* Contact persons */}
                  <div className="pt-2 space-y-2">
                    {contacts.map(contact => <a key={contact.role} href={`https://wa.me/${contact.phone.replace(/\s/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-concert-cyan transition-colors group">
                        <Phone className="w-3 h-3" />
                        <span>{contact.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>)}
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
                  {quickLinks.map(link => <li key={link.name}>
                      <Link to={link.href} className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-concert-gold/50 group-hover:bg-concert-cyan group-hover:shadow-lg group-hover:shadow-concert-cyan/50 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>)}
                </ul>
              </div>

              {/* Competitions - 2 column grid */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                  <span className="text-concert-pink">✦</span>
                  Competitions
                </h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {competitions.map(link => <li key={link.name}>
                      <Link to={link.href} className="group flex items-center gap-1.5 text-gray-300 hover:text-white transition-all duration-300 text-sm">
                        <span className="w-1 h-1 rounded-full bg-concert-gold/50 group-hover:bg-concert-pink group-hover:shadow-lg group-hover:shadow-concert-pink/50 transition-all flex-shrink-0" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>)}
                </ul>
              </div>
            </div>

            {/* Right side - Map */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-concert-gold flex items-center gap-2">
                <span className="text-concert-gold">✦</span>
                Find Us
              </h3>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.6257!2d79.8296!3d11.9342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361ab14cd4b5f%3A0x6a8d0a68dd6c1c6c!2sIndira%20Gandhi%20Medical%20College%20and%20Research%20Institute!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin" width="100%" height="250" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="IGMCRI Location" className="w-full h-48 sm:h-64" />
                {/* Map overlay gradient for aesthetics */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1A1A2E]/20 to-transparent" />
              </div>
              <a href="https://maps.google.com/?q=Indira+Gandhi+Medical+College+and+Research+Institute+Puducherry" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-concert-cyan transition-colors group">
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="container mx-auto px-4">
          {/* Gradient separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-concert-gold/50 to-transparent mb-6" />
          
          <div className="pb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-gray-400">© ADWAITA 26 | IGMCRI & Helios Academic Society</p>
            
            <p className="text-xs text-gray-500">
              The realm beyond waits for the brave
            </p>
          </div>
        </div>
      </div>
    </footer>;
}