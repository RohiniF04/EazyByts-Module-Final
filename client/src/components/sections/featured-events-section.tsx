import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import EventCard from "@/components/ui/event-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedEventsSection() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events/featured"],
  });

  if (error) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load featured events. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Events</h2>
          <Link href="/events">
            <span className="text-primary hover:text-primary-700 font-medium cursor-pointer">
              View all events <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center mt-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Render actual events
            events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
          
          {/* If no featured events are available */}
          {!isLoading && events?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No featured events available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
