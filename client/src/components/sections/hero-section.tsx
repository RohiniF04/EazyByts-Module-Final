import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Discover Amazing Events</span>
            <span className="block text-pink-500">Book Your Experience Today</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Find and book events that match your interests, from concerts and workshops to conferences and meetups.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:space-x-3">
              <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <div className="relative rounded-md shadow-sm">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, categories, or venues"
                    className="pl-4 pr-12 py-3 focus:ring-primary-500 focus:border-primary-500 block w-full"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600 sm:w-auto"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
