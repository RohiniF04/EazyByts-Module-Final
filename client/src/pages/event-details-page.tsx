import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Event, insertBookingSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainLayout from "@/components/layouts/main-layout";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  AlertCircle,
  Share2,
  Heart,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Booking form schema
const bookingFormSchema = z.object({
  eventId: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1").max(10, "Maximum 10 tickets per booking"),
  totalPrice: z.number().min(0),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function EventDetailsPage() {
  const [match, params] = useRoute("/events/:id");
  const eventId = params?.id ? parseInt(params.id, 10) : 0;
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch event details
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  // Booking form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      eventId: eventId,
      quantity: 1,
      totalPrice: event?.price || 0,
    },
    values: {
      eventId: eventId,
      quantity: quantity,
      totalPrice: (event?.price || 0) * quantity,
    },
  });

  // Book event mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
      });
      setBookingModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong with your booking.",
        variant: "destructive",
      });
    },
  });

  // Handle booking form submission
  const onSubmit = (data: BookingFormValues) => {
    bookingMutation.mutate(data);
  };

  // Handle quantity change
  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10);
    setQuantity(newQuantity);
    form.setValue("quantity", newQuantity);
    form.setValue("totalPrice", (event?.price || 0) * newQuantity);
  };

  // If the event is not found
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Event Not Found</h3>
            <p className="mt-1 text-base text-gray-500">
              The event you are looking for does not exist or has been removed.
            </p>
            <div className="mt-6">
              <Link href="/events">
                <Button>Browse All Events</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {isLoading ? (
        <EventDetailsSkeleton />
      ) : (
        event && (
          <div className="bg-white pb-12">
            {/* Event Hero */}
            <div className="relative h-80 bg-gray-900">
              {/* Event Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{ backgroundImage: `url(${event.imageUrl})` }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              
              {/* Back button */}
              <div className="absolute top-4 left-4 z-10">
                <Link href="/events">
                  <Button variant="ghost" className="text-white hover:bg-black/20">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                  </Button>
                </Link>
              </div>
              
              {/* Event title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {event.isFeatured && (
                    <Badge className="mb-2 bg-primary hover:bg-primary">Featured</Badge>
                  )}
                  <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-1" />
                      <span>
                        {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>{format(new Date(event.date), "h:mm a")}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Event details */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="p-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-cover bg-center mr-4" style={{ backgroundImage: `url(${event.organizerImage})` }}></div>
                          <div>
                            <h3 className="font-medium text-gray-900">Organized by</h3>
                            <p className="text-gray-500">{event.organizerName}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                      <p className="text-gray-600 whitespace-pre-line mb-8">{event.description}</p>

                      <Separator className="my-8" />

                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                            <div>
                              <h3 className="font-medium text-gray-900">Date and Time</h3>
                              <p className="text-gray-600">
                                {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                              </p>
                              <p className="text-gray-600">
                                {format(new Date(event.date), "h:mm a")}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                            <div>
                              <h3 className="font-medium text-gray-900">Location</h3>
                              <p className="text-gray-600">{event.location}</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Users className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                            <div>
                              <h3 className="font-medium text-gray-900">Capacity</h3>
                              <p className="text-gray-600">{event.capacity} attendees</p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Ticket className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                            <div>
                              <h3 className="font-medium text-gray-900">Price</h3>
                              <p className="text-gray-600">
                                ${(event.price / 100).toFixed(2)} per ticket
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Booking card */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Book Tickets</CardTitle>
                      <CardDescription>
                        Secure your spot at this event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Price</h3>
                          <p className="text-2xl font-bold text-primary">
                            ${(event.price / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">per ticket</p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Date & Time</h3>
                          <p className="text-gray-700">
                            {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-gray-700">
                            {format(new Date(event.date), "h:mm a")}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                          <p className="text-gray-700">{event.location}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      {user ? (
                        <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full">Book Now</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Book Tickets</DialogTitle>
                              <DialogDescription>
                                Complete your booking for {event.title}
                              </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                  control={form.control}
                                  name="quantity"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Number of Tickets</FormLabel>
                                      <Select
                                        value={field.value.toString()}
                                        onValueChange={handleQuantityChange}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select quantity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[...Array(10)].map((_, i) => (
                                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                              {i + 1}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        You can book up to 10 tickets per order
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="border-t border-gray-200 pt-4">
                                  <div className="flex justify-between mb-2">
                                    <span>Price per ticket:</span>
                                    <span>${(event.price / 100).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span>Quantity:</span>
                                    <span>{quantity}</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>${((event.price * quantity) / 100).toFixed(2)}</span>
                                  </div>
                                </div>

                                <Button
                                  type="submit"
                                  className="w-full"
                                  disabled={bookingMutation.isPending}
                                >
                                  {bookingMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    "Confirm Booking"
                                  )}
                                </Button>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Link href="/auth">
                          <Button className="w-full">Sign In to Book</Button>
                        </Link>
                      )}
                      <p className="text-xs text-gray-500 mt-4 text-center">
                        By booking, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </MainLayout>
  );
}

// Skeleton loader for event details
function EventDetailsSkeleton() {
  return (
    <div className="bg-white pb-12">
      {/* Hero skeleton */}
      <div className="relative h-80 bg-gray-200">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            
            <Skeleton className="h-1 w-full my-8" />
            
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex">
                <Skeleton className="h-5 w-5 mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
