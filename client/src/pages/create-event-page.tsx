import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertEventSchema, Category } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Create event form schema
const createEventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  imageUrl: z.string().url("Please enter a valid image URL"),
  date: z.date({
    required_error: "Please select a date and time",
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  categoryId: z.number({
    required_error: "Please select a category",
  }),
  isFeatured: z.boolean().default(false),
  organizerId: z.number(),
  organizerName: z.string(),
  organizerImage: z.string().url("Please enter a valid organizer image URL"),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [datePickerValue, setDatePickerValue] = useState<Date>();

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormValues) => {
      const res = await apiRequest("POST", "/api/events", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setLocation("/admin/events");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form with validation
  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      location: "",
      price: 0,
      capacity: 50,
      isFeatured: false,
      // Set user ID as the organizer ID
      organizerId: user?.id || 0,
      organizerName: user?.name || "",
      organizerImage: "https://randomuser.me/api/portraits/lego/1.jpg", // Default organizer image
    },
  });

  // Handle form submission
  const onSubmit = (data: CreateEventFormValues) => {
    // Convert price from dollars to cents for database storage
    const eventData = {
      ...data,
      price: Math.round(data.price * 100),
    };
    createEventMutation.mutate(eventData);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Event</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Enter the details for your new event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the title of your event"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be the main title displayed for your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event in detail"
                            className="min-h-32 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide all the important details about your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a URL for the event banner image.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value, 10))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCategories ? (
                                <SelectItem value="loading" disabled>
                                  Loading categories...
                                </SelectItem>
                              ) : (
                                categories?.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the category that best fits your event.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date and Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP p")
                                  ) : (
                                    <span>Pick a date and time</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  setDatePickerValue(date);
                                  if (date) {
                                    // Preserve the current time if a date is already set
                                    const newDate = new Date(date);
                                    if (field.value) {
                                      newDate.setHours(field.value.getHours());
                                      newDate.setMinutes(field.value.getMinutes());
                                    } else {
                                      // Default to noon if no time set yet
                                      newDate.setHours(12);
                                      newDate.setMinutes(0);
                                    }
                                    field.onChange(newDate);
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <div className="grid gap-2">
                                  <div className="grid grid-cols-2 gap-2">
                                    <Select
                                      onValueChange={(value) => {
                                        if (!field.value) return;
                                        const newDate = new Date(field.value);
                                        newDate.setHours(parseInt(value, 10));
                                        field.onChange(newDate);
                                      }}
                                      value={field.value ? field.value.getHours().toString() : undefined}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Hour" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                          <SelectItem key={i} value={i.toString()}>
                                            {i.toString().padStart(2, "0")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Select
                                      onValueChange={(value) => {
                                        if (!field.value) return;
                                        const newDate = new Date(field.value);
                                        newDate.setMinutes(parseInt(value, 10));
                                        field.onChange(newDate);
                                      }}
                                      value={field.value ? field.value.getMinutes().toString() : undefined}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Minute" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                          (minute) => (
                                            <SelectItem
                                              key={minute}
                                              value={minute.toString()}
                                            >
                                              {minute.toString().padStart(2, "0")}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Select when your event will take place.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the event location"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Where will the event be held?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                $
                              </span>
                              <Input
                                type="number"
                                placeholder="0.00"
                                className="pl-7"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === "" ? 0 : parseFloat(value)
                                  );
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Set the ticket price (0 for free events).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? 0 : parseInt(value, 10)
                                );
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of attendees.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="organizerImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/organizer.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL for the organizer's profile image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Event</FormLabel>
                          <FormDescription>
                            Featured events are highlighted on the homepage.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/admin/events")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createEventMutation.isPending}
                    >
                      {createEventMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your event details will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  {form.watch("imageUrl") ? (
                    <img
                      src={form.watch("imageUrl")}
                      alt="Event preview"
                      className="aspect-video w-full object-cover"
                      onError={(e) => {
                        // Set a fallback image if the URL is invalid
                        e.currentTarget.src = "https://via.placeholder.com/400x200?text=Event+Image";
                      }}
                    />
                  ) : (
                    <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      Event Image Preview
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {form.watch("title") || "Event Title"}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      {form.watch("date") ? (
                        format(form.watch("date"), "EEEE, MMMM d, yyyy • h:mm a")
                      ) : (
                        "Date and Time"
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {form.watch("location") || "Event Location"}
                    </div>
                    <div className="mt-3 text-sm">
                      {form.watch("description")
                        ? form.watch("description").substring(0, 150) +
                          (form.watch("description").length > 150 ? "..." : "")
                        : "Event description will appear here."}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-medium text-primary">
                        ${form.watch("price") || "0.00"}
                      </span>
                      <Button size="sm" disabled>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  {form.watch("organizerImage") ? (
                    <img
                      src={form.watch("organizerImage")}
                      alt="Organizer"
                      className="h-12 w-12 rounded-full object-cover"
                      onError={(e) => {
                        // Set a fallback image if the URL is invalid
                        e.currentTarget.src = "https://via.placeholder.com/100?text=Organizer";
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-xl font-medium">
                        {user?.name?.charAt(0) || "O"}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {user?.name || "Organizer Name"}
                    </div>
                    <div className="text-sm text-gray-500">Event Organizer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help & Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use a high-quality image for better visibility</li>
                  <li>• Be specific with your event location</li>
                  <li>• Include all important details in the description</li>
                  <li>• Set a realistic capacity for your venue</li>
                  <li>• Featured events get more attention</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
