import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Calendar,
  Layers,
  Ticket,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";

// Types for admin dashboard data
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  isFeatured: boolean;
}

interface Booking {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  event: {
    title: string;
  };
  user: {
    name: string;
  };
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Fetch events for admin
  const {
    data: events,
    isLoading: isLoadingEvents,
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: !!user?.isAdmin,
  });

  // Fetch bookings for admin
  const {
    data: bookings,
    isLoading: isLoadingBookings,
  } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user?.isAdmin,
  });

  // Calculate dashboard statistics
  const totalEvents = events?.length || 0;
  const totalBookings = bookings?.length || 0;
  const totalTickets = bookings?.reduce((sum, booking) => sum + booking.quantity, 0) || 0;
  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.totalPrice, 0) || 0;

  // Get upcoming events (next 7 days)
  const now = new Date();
  const inOneWeek = new Date(now);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  
  const upcomingEvents = events
    ?.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now && eventDate <= inOneWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5) || [];

  // Get recent bookings
  const recentBookings = bookings
    ?.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5) || [];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button asChild>
            <Link href="/admin/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingEvents ? <Skeleton className="h-8 w-16" /> : totalEvents}
              </div>
              <p className="text-xs text-muted-foreground">
                Events created on the platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingBookings ? <Skeleton className="h-8 w-16" /> : totalBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tickets Sold
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingBookings ? <Skeleton className="h-8 w-16" /> : totalTickets}
              </div>
              <p className="text-xs text-muted-foreground">
                Total ticket sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenue
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingBookings ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `$${(totalRevenue / 100).toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total booking revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events and Recent Bookings */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Events scheduled in the next 7 days
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/events">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMMM d, yyyy • h:mm a")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.isFeatured && <Badge>Featured</Badge>}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/events/${event.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No upcoming events in the next 7 days
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest ticket purchases
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/events">
                  Manage Bookings
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingBookings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </div>
                  ))}
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-6">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{booking.user.name}</div>
                          <div className="text-sm text-gray-500">
                            {booking.event.title} ({booking.quantity} tickets)
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(booking.totalPrice / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No recent bookings
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Overview of recent events and bookings activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingBookings ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : bookings && bookings.length > 0 ? (
                  bookings
                    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                    .slice(0, 10)
                    .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user.name}</TableCell>
                        <TableCell>{booking.event.title}</TableCell>
                        <TableCell>{booking.quantity}</TableCell>
                        <TableCell>${(booking.totalPrice / 100).toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(booking.bookingDate), "MMM dd, yyyy")}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No booking activity
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
