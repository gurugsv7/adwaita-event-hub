import { useState, useEffect } from "react";
import { categories } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowLeft, Loader2, Users, Calendar, ExternalLink, Search, Music, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  registration_id: string;
  event_id: string;
  event_name: string;
  category_name: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  year: string | null;
  participant_category: string | null;
  delegate_id: string | null;
  team_members: any;
  fee_amount: number;
  coupon_code: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
}

interface ConcertBooking {
  id: string;
  booking_id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  ticket_type: string;
  ticket_price: number;
  partner_name: string | null;
  partner_phone: string | null;
  payment_screenshot_url: string | null;
  payment_status: string;
  created_at: string;
}

type ViewMode = 'events' | 'concert' | 'event_details' | 'concert_details';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [concertBookings, setConcertBookings] = useState<ConcertBooking[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [loadingConcert, setLoadingConcert] = useState(false);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [concertCount, setConcertCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('events');
  const { toast } = useToast();

  // Fetch registration counts when authenticated
  useEffect(() => {
    if (isAuthenticated && viewMode === 'events') {
      fetchEventCounts();
      fetchConcertCount();
    }
  }, [isAuthenticated, viewMode]);

  const fetchEventCounts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-registrations', {
        body: { password, action: 'counts' }
      });

      if (error) throw error;

      if (data.counts) {
        setEventCounts(data.counts);
      }
    } catch (error: any) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const fetchConcertCount = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-registrations', {
        body: { password, action: 'concert_count' }
      });

      if (error) throw error;

      if (data.count !== undefined) {
        setConcertCount(data.count);
      }
    } catch (error: any) {
      console.error('Failed to fetch concert count:', error);
    }
  };

  // Flatten all events from all categories
  const allEvents = categories.flatMap(category =>
    category.events.map(event => ({
      ...event,
      categoryTitle: category.title,
      categoryId: category.id,
    }))
  );

  // Filter events based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    events: category.events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.events.length > 0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-registrations', {
        body: { password, eventId: null }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Access Denied",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
      } else {
        setIsAuthenticated(true);
        toast({
          title: "Welcome Admin",
          description: "You now have access to registration data.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async (eventId: string) => {
    setLoadingRegistrations(true);
    setSelectedEvent(eventId);
    setViewMode('event_details');

    try {
      const { data, error } = await supabase.functions.invoke('admin-registrations', {
        body: { password, eventId }
      });

      if (error) throw error;

      if (data.registrations) {
        setRegistrations(data.registrations);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch registrations",
        variant: "destructive",
      });
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const fetchConcertBookings = async () => {
    setLoadingConcert(true);
    setViewMode('concert_details');

    try {
      const { data, error } = await supabase.functions.invoke('admin-registrations', {
        body: { password, action: 'concert_bookings' }
      });

      if (error) throw error;

      if (data.bookings) {
        setConcertBookings(data.bookings);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch concert bookings",
        variant: "destructive",
      });
    } finally {
      setLoadingConcert(false);
    }
  };

  const getSelectedEventDetails = () => {
    return allEvents.find(e => e.id === selectedEvent);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseTeamMembers = (teamMembers: any): string => {
    if (!teamMembers) return '-';
    if (Array.isArray(teamMembers) && teamMembers.length === 0) return '-';
    if (Array.isArray(teamMembers)) {
      return teamMembers.map((member: any) => 
        typeof member === 'string' ? member : member.name || JSON.stringify(member)
      ).join(', ');
    }
    return JSON.stringify(teamMembers);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setRegistrations([]);
    setConcertBookings([]);
    setViewMode('events');
    setSearchQuery("");
  };

  // Filter concert bookings based on search query
  const filteredConcertBookings = concertBookings.filter(booking =>
    booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.booking_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter the admin password to view registrations
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg"
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={isLoading || !password}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Event selection screen
  if (viewMode === 'events') {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Select an event or view concert bookings</p>
          </div>

          {/* Concert Bookings Card */}
          <Card
            className="cursor-pointer hover:border-primary transition-colors mb-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30"
            onClick={fetchConcertBookings}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      Krishh Concert Bookings
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    </h3>
                    <p className="text-muted-foreground text-sm">Valentine's Day Special - Feb 14, 2026</p>
                  </div>
                </div>
                <span className="bg-pink-500/20 text-pink-500 text-lg font-bold px-4 py-2 rounded-full">
                  {concertCount}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <span>{category.emoji}</span>
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.events.map((event) => (
                    <Card
                      key={event.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fetchRegistrations(event.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground">{event.title}</h3>
                          <span className="bg-primary/10 text-primary text-sm font-semibold px-2 py-1 rounded-full">
                            {eventCounts[event.id] || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.teamType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.day}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Concert bookings table view
  if (viewMode === 'concert_details') {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToEvents}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Music className="w-6 h-6 text-pink-500" />
                  Krishh Concert Bookings
                </h1>
                <p className="text-muted-foreground">
                  Valentine's Day Special • {concertBookings.length} Booking(s)
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar for Concert Bookings */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, institution, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {loadingConcert ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredConcertBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No bookings match your search" : "No concert bookings found"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Partner Name</TableHead>
                      <TableHead>Partner Phone</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConcertBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.booking_id}
                        </TableCell>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>{booking.institution}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.ticket_type === 'Couple' 
                              ? 'bg-pink-500/20 text-pink-500' 
                              : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {booking.ticket_type}
                          </span>
                        </TableCell>
                        <TableCell>₹{booking.ticket_price}</TableCell>
                        <TableCell>{booking.partner_name || '-'}</TableCell>
                        <TableCell>{booking.partner_phone || '-'}</TableCell>
                        <TableCell>
                          {booking.payment_screenshot_url ? (
                            <a 
                              href={booking.payment_screenshot_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-amber-600 text-sm">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.payment_status === 'confirmed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {booking.payment_status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(booking.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Registrations table view
  const eventDetails = getSelectedEventDetails();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToEvents}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {eventDetails?.title}
              </h1>
              <p className="text-muted-foreground">
                {eventDetails?.categoryTitle} • {registrations.length} Registration(s)
              </p>
            </div>
          </div>
        </div>

        {loadingRegistrations ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No registrations found for this event</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg. ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Team Members</TableHead>
                    <TableHead>Delegate ID</TableHead>
                    <TableHead>Fee (₹)</TableHead>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Registered At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-mono text-xs">
                        {reg.registration_id}
                      </TableCell>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell>{reg.institution}</TableCell>
                      <TableCell>{reg.year || '-'}</TableCell>
                      <TableCell>{reg.participant_category || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {parseTeamMembers(reg.team_members)}
                      </TableCell>
                      <TableCell>{reg.delegate_id || '-'}</TableCell>
                      <TableCell>₹{reg.fee_amount}</TableCell>
                      <TableCell>{reg.coupon_code || '-'}</TableCell>
                      <TableCell>
                        {reg.payment_screenshot_url ? (
                          <a 
                            href={reg.payment_screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-amber-600 text-sm">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(reg.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
