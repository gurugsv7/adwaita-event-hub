import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, DollarSign, Users, Clock } from "lucide-react";

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
}

interface EventCardProps {
  event: Event;
  borderColor?: string;
}

export function EventCard({ event, borderColor = "border-gold" }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      className={`bg-card rounded-lg border ${borderColor} event-card overflow-hidden`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-serif font-bold text-primary text-lg leading-tight">
            {event.title}
          </h3>
          <span
            className={`${getStatusColor(event.status)} text-xs px-3 py-1 rounded-full font-medium`}
          >
            {event.status}
          </span>
        </div>

        {/* Info Rows */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-silver" />
            <span className="text-silver text-xs">Fee:</span>
            <span className="text-card-foreground text-sm font-semibold">
              ₹{event.fee}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-silver" />
            <span className="text-silver text-xs">Team:</span>
            <span className="text-card-foreground text-sm font-semibold">
              {event.teamType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-silver" />
            <span className="text-silver text-xs">Duration:</span>
            <span className="text-card-foreground text-sm font-semibold">
              {event.duration}
            </span>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="link-teal text-sm font-medium flex items-center gap-1"
        >
          {isExpanded ? "Hide Details" : "View Details"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-dashed border-primary/40 p-5 space-y-4 animate-fade-in">
          {/* Incharge */}
          <div className="bg-secondary/10 border-l-4 border-secondary p-3 rounded-r">
            <p className="text-xs text-silver mb-1">Event Incharge</p>
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
            <p className="text-xs text-silver mb-2">Prize Money</p>
            <p className="text-card-foreground text-sm font-medium">
              1st: ₹{event.prizes.first.toLocaleString()} | 2nd: ₹{event.prizes.second.toLocaleString()} | 3rd: ₹{event.prizes.third.toLocaleString()}
            </p>
          </div>

          {/* Rules */}
          <div>
            <p className="text-xs text-silver mb-2">Rules</p>
            <ul className="space-y-1">
              {event.rules.map((rule, index) => (
                <li key={index} className="text-silver text-xs flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Deadline */}
          <p className={`text-sm font-medium ${getDeadlineColor(event.status)}`}>
            Closes: {event.deadline}
          </p>
        </div>
      )}
    </div>
  );
}
