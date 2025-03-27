import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Ticket, 
  Clock, 
  MapPin, 
  AlertTriangle,
  Calendar,
  Loader2
} from "lucide-react";

// Types for bookings with event details
interface BookingWithEvent {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
  };
}

export default function UserDashboardPage() {
  const [, params] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user bookings
  const {
    data: bookings,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery<BookingWithEvent[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await apiRequest("DELETE", `/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.replaceState(
      null,
      "",
      value === "overview" ? "/dashboard" : `/dashboard?tab=${value}`
    );
  };

  // Group bookings by upcoming and past
  const now = new Date();
  const upcomingBookings = bookings?.filter(
    (booking) => new Date(booking.event.date) > now
  ) || [];
  const pastBookings = bookings?.filter(
    (booking) => new Date(booking.event.date) <= now
  ) || [];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome back, {user?.name}!
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingBookings ? (
                      <Skeleton className="h-8 w-8" />
                    ) : (
                      bookings?.length || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events you've booked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Events
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingBookings ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      upcomingBookings.length
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events you plan to attend
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Next Event
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <Skeleton className="h-8 w-28" />
                  ) : upcomingBookings.length > 0 ? (
                    <>
                      <div className="text-lg font-bold truncate">
                        {
                          upcomingBookings.sort(
                            (a, b) => 
                              new Date(a.event.date).getTime() - 
                              new Date(b.event.date).getTime()
                          )[0].event.title
                        }
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(
                            upcomingBookings.sort(
                              (a, b) => 
                                new Date(a.event.date).getTime() - 
                                new Date(b.event.date).getTime()
                            )[0].event.date
                          ),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No upcoming events</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Past Events
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingBookings ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      pastBookings.length
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events you've attended
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your most recent event bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-sm" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings
                      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                      .slice(0, 5)
                      .map((booking) => (
                        <div key={booking.id} className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-sm bg-cover bg-center" style={{ backgroundImage: `url(${booking.event.imageUrl})` }} />
                          <div className="space-y-1">
                            <div className="font-medium">{booking.event.title}</div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(booking.event.date), "MMM dd, yyyy • h:mm a")}
                            </div>
                          </div>
                          <div className="ml-auto text-sm font-medium">
                            ${(booking.totalPrice / 100).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Ticket className="h-10 w-10 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking an event.</p>
                    <div className="mt-6">
                      <Link href="/events">
                        <Button className="cursor-pointer">Browse Events</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>
                  Manage your event bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : bookingsError ? (
                  <div className="flex items-center justify-center py-8 flex-col">
                    <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
                    <h3 className="text-lg font-medium">Error loading bookings</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Please try refreshing the page.
                    </p>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming">
                      {upcomingBookings.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Event</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Tickets</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingBookings
                              .sort(
                                (a, b) => 
                                  new Date(a.event.date).getTime() - 
                                  new Date(b.event.date).getTime()
                              )
                              .map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="h-10 w-10 rounded-sm bg-cover bg-center hidden sm:block" 
                                        style={{ backgroundImage: `url(${booking.event.imageUrl})` }} 
                                      />
                                      <div>{booking.event.title}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(booking.event.date), "MMM dd, yyyy")}
                                    <div className="text-xs text-gray-500">
                                      {format(new Date(booking.event.date), "h:mm a")}
                                    </div>
                                  </TableCell>
                                  <TableCell>{booking.quantity}</TableCell>
                                  <TableCell>${(booking.totalPrice / 100).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          Cancel
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel your booking for {booking.event.title}? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => cancelBookingMutation.mutate(booking.id)}
                                            disabled={cancelBookingMutation.isPending}
                                          >
                                            {cancelBookingMutation.isPending && (
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Cancel Booking
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-10 w-10 mx-auto text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You don't have any upcoming events booked.
                          </p>
                          <div className="mt-6">
                            <Link href="/events">
                              <Button className="cursor-pointer">Browse Events</Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="past">
                      {pastBookings.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Event</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Tickets</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pastBookings
                              .sort(
                                (a, b) => 
                                  new Date(b.event.date).getTime() - 
                                  new Date(a.event.date).getTime()
                              )
                              .map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="h-10 w-10 rounded-sm bg-cover bg-center hidden sm:block" 
                                        style={{ backgroundImage: `url(${booking.event.imageUrl})` }} 
                                      />
                                      <div>{booking.event.title}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(booking.event.date), "MMM dd, yyyy")}
                                    <div className="text-xs text-gray-500">
                                      {format(new Date(booking.event.date), "h:mm a")}
                                    </div>
                                  </TableCell>
                                  <TableCell>{booking.quantity}</TableCell>
                                  <TableCell>${(booking.totalPrice / 100).toFixed(2)}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">Completed</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-12">
                          <Clock className="h-10 w-10 mx-auto text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No past events</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You haven't attended any events yet.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Ticket className="h-10 w-10 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking an event.</p>
                    <div className="mt-6">
                      <Link href="/events">
                        <Button className="cursor-pointer">Browse Events</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}