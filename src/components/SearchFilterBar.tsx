import { useState } from "react";
import { Search } from "lucide-react";

const feeOptions = ["All", "Free", "₹100-200", "₹200-500", "₹500+"];
const typeOptions = ["All", "Individual", "Team", "Group"];
const statusOptions = ["All", "Open", "Coming Soon", "Closed"];

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { fee: string; type: string; status: string }) => void;
}

export function SearchFilterBar({ onSearch, onFilterChange }: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    fee: "All",
    type: "All",
    status: "All",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterClick = (filterType: "fee" | "type" | "status", value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="sticky top-16 z-40 bg-card border-b-2 border-primary py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border-2 border-secondary rounded-lg bg-card text-card-foreground input-teal focus:border-primary transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 flex-1">
            {/* Fee Filter */}
            <div className="flex items-center gap-2">
              <span className="text-card-foreground text-sm font-medium">Fee:</span>
              <div className="flex gap-1 flex-wrap">
                {feeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterClick("fee", option)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filters.fee === option
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-card-foreground text-sm font-medium">Type:</span>
              <div className="flex gap-1 flex-wrap">
                {typeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterClick("type", option)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filters.type === option
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-card-foreground text-sm font-medium">Status:</span>
              <div className="flex gap-1 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterClick("status", option)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filters.status === option
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/20 text-card-foreground hover:bg-primary/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
