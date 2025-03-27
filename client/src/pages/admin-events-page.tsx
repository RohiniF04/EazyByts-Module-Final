import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { Event } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/dashboard-layout";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronDown,
  Edit,
  ExternalLink,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Star,
  Trash,
} from "lucide-react";

export default function AdminEventsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch events
  const {
    data: events,
    isLoading,
    error,
    refetch,
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      setIsDeleting(eventId);
      await apiRequest("DELETE", `/api/events/${eventId}`);
    },
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsDeleting(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(null);
    },
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ eventId, isFeatured }: { eventId: number; isFeatured: boolean }) => {
      await apiRequest("PUT", `/api/events/${eventId}`, { isFeatured });
    },
    onSuccess: () => {
      toast({
        title: "Event Updated",
        description: "Featured status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update event status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  // Filter events based on search query
  const filteredEvents = events
    ? events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Upcoming and past events
  const now = new Date();
  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < now);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Events</h1>
            <p className="text-gray-500">Create, edit, and manage your events</p>
          </div>
          <Button asChild>
            <Link href="/admin/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Events Dashboard</CardTitle>
            <CardDescription>
              View and manage all events on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mb-6">
              <Input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading events. Please try again.</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No events found</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery
                    ? `No events matching "${searchQuery}"`
                    : "Create your first event to get started"}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/events/create">Create New Event</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-3">Upcoming Events</h2>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingEvents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No upcoming events
                            </TableCell>
                          </TableRow>
                        ) : (
                          upcomingEvents
                            .sort(
                              (a, b) =>
                                new Date(a.date).getTime() - new Date(b.date).getTime()
                            )
                            .map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  {event.title}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(event.date), "MMM d, yyyy")}
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(event.date), "h:mm a")}
                                  </div>
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>${(event.price / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                  {event.isFeatured ? (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                                  ) : (
                                    <Badge variant="outline">Active</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/events/${event.id}`}>
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          View Event
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/admin/events/${event.id}/edit`}>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit Event
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          toggleFeaturedMutation.mutate({
                                            eventId: event.id,
                                            isFeatured: !event.isFeatured,
                                          })
                                        }
                                      >
                                        <Star className="mr-2 h-4 w-4" />
                                        {event.isFeatured
                                          ? "Remove Featured"
                                          : "Make Featured"}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="text-red-600"
                                          >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete Event
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete this event? This action cannot be undone
                                              and will also remove all bookings associated with this event.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => deleteEventMutation.mutate(event.id)}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              {isDeleting === event.id ? (
                                                <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Deleting...
                                                </>
                                              ) : (
                                                "Delete Event"
                                              )}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-3">Past Events</h2>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastEvents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No past events
                            </TableCell>
                          </TableRow>
                        ) : (
                          pastEvents
                            .sort(
                              (a, b) =>
                                new Date(b.date).getTime() - new Date(a.date).getTime()
                            )
                            .map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium max-w-xs truncate">
                                  {event.title}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(event.date), "MMM d, yyyy")}
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(event.date), "h:mm a")}
                                  </div>
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>${(event.price / 100).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-gray-100">
                                    Completed
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">Open menu</span>
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/events/${event.id}`}>
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          View Event
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            className="text-red-600"
                                          >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete Event
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete this event? This action
                                              cannot be undone and will also remove all bookings
                                              associated with this event.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => deleteEventMutation.mutate(event.id)}
                                              className="bg-red-600 hover:bg-red-700"
                                            >
                                              {isDeleting === event.id ? (
                                                <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Deleting...
                                                </>
                                              ) : (
                                                "Delete Event"
                                              )}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
