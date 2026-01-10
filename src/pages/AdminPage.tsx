import { useState } from "react";
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
import { Lock, ArrowLeft, Loader2, Users, Calendar } from "lucide-react";
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

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const { toast } = useToast();

  // Flatten all events from all categories
  const allEvents = categories.flatMap(category =>
    category.events.map(event => ({
      ...event,
      categoryTitle: category.title,
      categoryId: category.id,
    }))
  );

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
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Select an event to view registrations</p>
          </div>

          <div className="space-y-6">
            {categories.map((category) => (
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
                        <h3 className="font-medium text-foreground">{event.title}</h3>
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

  // Registrations table view
  const eventDetails = getSelectedEventDetails();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedEvent(null);
              setRegistrations([]);
            }}
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
                          <span className="text-green-600 text-sm">Uploaded</span>
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
