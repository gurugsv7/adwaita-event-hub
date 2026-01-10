import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Phone, DollarSign, Users, Clock, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Event {
  id: string;
  title: string;
  category: string;
  fee: number;
  teamType: "Individual" | "Team" | "Group";
  duration: string;
  status: "Open" | "Coming Soon" | "Closed";
  deadline: string;
  incharge: {
    name: string;
    phone: string;
  };
  prizes: {
    first: number;
    second: number;
    third: number;
  };
  rules: string[];
  description?: string;
  image?: string;
}

interface EventCardProps {
  event: Event;
  borderColor?: string;
  categoryId: string;
}

// Generate a placeholder gradient based on event title
const getEventGradient = (title: string) => {
  const colors = [
    "from-primary/40 to-secondary/20",
    "from-secondary/40 to-accent/20",
    "from-accent/40 to-primary/20",
    "from-primary/30 to-accent/30",
    "from-secondary/30 to-primary/30",
  ];
  const index = title.length % colors.length;
  return colors[index];
};

export function EventCard({ event, borderColor = "border-gold", categoryId }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-secondary text-secondary-foreground";
      case "Coming Soon":
        return "bg-accent text-accent-foreground";
      case "Closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDeadlineColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-secondary";
      case "Coming Soon":
        return "text-accent";
      case "Closed":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className={`group bg-muted/30 backdrop-blur-sm rounded-xl border ${borderColor} event-card overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]`}
    >
      {/* Event Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getEventGradient(event.title)}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 ${getStatusColor(event.status)} text-xs px-3 py-1 rounded-full font-medium`}
        >
          {event.status}
        </span>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif font-bold text-primary text-xl leading-tight drop-shadow-lg">
            {event.title}
          </h3>
          <p className="text-silver/80 text-sm mt-1 line-clamp-2">
            {event.description || `Showcase your talent in ${event.title.toLowerCase()} and win exciting prizes!`}
          </p>
        </div>
      </div>

      <div className="p-5">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-background/30 rounded-lg">
            <DollarSign size={16} className="text-secondary mx-auto mb-1" />
            <span className="text-silver text-sm font-semibold block">₹{event.fee}</span>
            <span className="text-silver/50 text-xs">Fee</span>
          </div>
          <div className="text-center p-2 bg-background/30 rounded-lg">
            <Users size={16} className="text-secondary mx-auto mb-1" />
            <span className="text-silver text-sm font-semibold block">{event.teamType}</span>
            <span className="text-silver/50 text-xs">Type</span>
          </div>
          <div className="text-center p-2 bg-background/30 rounded-lg">
            <Trophy size={16} className="text-secondary mx-auto mb-1" />
            {(categoryId === 'culturals' || categoryId === 'sports') ? (
              <>
                <span className="text-silver text-sm font-semibold block">Pool</span>
                <span className="text-silver/50 text-xs">From Category</span>
              </>
            ) : (
              <>
                <span className="text-silver text-sm font-semibold block">₹{(event.prizes.first / 1000).toFixed(0)}K</span>
                <span className="text-silver/50 text-xs">1st Prize</span>
              </>
            )}
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="link-teal text-sm font-medium flex items-center gap-1 mb-4"
        >
          {isExpanded ? "Hide Details" : "View Details"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Register Button */}
        <Button 
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold group/btn"
          disabled={event.status === "Closed"}
          onClick={() => navigate(`/${categoryId}/${event.id}`)}
        >
          {event.status === "Closed" ? "Registration Closed" : "Register Now"}
          {event.status !== "Closed" && (
            <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          )}
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-dashed border-primary/40 p-5 space-y-4 animate-fade-in bg-background/30">
          {/* Duration & Deadline */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-secondary" />
              <span className="text-silver/70">Duration:</span>
              <span className="text-silver font-semibold">{event.duration}</span>
            </div>
            <p className={`font-medium ${getDeadlineColor(event.status)}`}>
              Closes: {event.deadline}
            </p>
          </div>

          {/* Incharge */}
          <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r">
            <p className="text-xs text-silver/70 mb-1">Event Incharge</p>
            <p className="text-primary font-semibold text-sm">{event.incharge.name}</p>
            <a
              href={`tel:${event.incharge.phone}`}
              className="text-silver text-xs flex items-center gap-1 mt-1 hover:text-secondary transition-colors"
            >
              <Phone size={12} />
              {event.incharge.phone}
            </a>
          </div>

          {/* Prizes */}
          <div className="bg-primary/10 p-3 rounded">
            <p className="text-xs text-silver/70 mb-2">Prize Money</p>
            {(categoryId === 'culturals' || categoryId === 'sports') ? (
              <div className="text-center">
                <p className="text-gold font-bold">
                  ₹{categoryId === 'culturals' ? '1,00,000' : '2,00,000'}
                </p>
                <p className="text-xs text-silver/50 mt-1">
                  Total Category Prize Pool (prizes funded from this pool)
                </p>
              </div>
            ) : (
              <div className="flex justify-between text-silver text-sm">
                <span>🥇 ₹{event.prizes.first.toLocaleString()}</span>
                <span>🥈 ₹{event.prizes.second.toLocaleString()}</span>
                <span>🥉 ₹{event.prizes.third.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Rules */}
          <div>
            <p className="text-xs text-silver/70 mb-2">Rules</p>
            <ul className="space-y-1">
              {event.rules.map((rule, index) => (
                <li key={index} className="text-silver/80 text-xs flex items-start gap-2">
                  <span className="text-secondary">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
