import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Event, Category } from "@shared/schema";
import MainLayout from "@/components/layouts/main-layout";
import EventCard from "@/components/ui/event-card";
import CategoryCard from "@/components/ui/category-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search, Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EventsPage() {
  const [location, setLocation] = useLocation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
    setSelectedCategory(params.get("category") || "");
  }, [location]);

  // Fetch events based on filters
  const eventsQueryUrl = selectedCategory 
    ? `/api/events?category=${selectedCategory}` 
    : searchQuery 
    ? `/api/events?search=${encodeURIComponent(searchQuery)}` 
    : "/api/events";

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: [eventsQueryUrl],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/events?search=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation("/events");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setLocation(`/events?category=${categoryId}`);
    } else {
      setLocation("/events");
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <MainLayout>
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <p className="mt-2 text-primary-100">Discover and book amazing events near you</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, venues, cities..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={toggleFilters}>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="weekend">This Weekend</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="low">$0 - $25</SelectItem>
                    <SelectItem value="mid">$25 - $50</SelectItem>
                    <SelectItem value="high">$50+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Date (Newest)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-asc">Date (Soonest)</SelectItem>
                    <SelectItem value="date-desc">Date (Latest)</SelectItem>
                    <SelectItem value="price-asc">Price (Lowest)</SelectItem>
                    <SelectItem value="price-desc">Price (Highest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" className="mr-2">
                Reset
              </Button>
              <Button size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Categories section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {isLoadingCategories ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full mb-3" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
        
        {/* Events list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? `Search results for "${searchQuery}"` : 
             selectedCategory ? `Events in selected category` : 
             "All Events"}
          </h2>
          
          {isLoadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
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
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? `No events matching "${searchQuery}"` : "No events available at the moment."}
              </p>
              <div className="mt-6">
                <Button onClick={() => setLocation("/events")}>View All Events</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
