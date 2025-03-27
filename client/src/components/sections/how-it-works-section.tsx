import { Search, Ticket, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorksSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Find, book, and enjoy events in just a few simple steps.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Discover Events</h3>
              <p className="mt-2 text-base text-gray-500">
                Browse upcoming events by category, location, or date to find something you'll love.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
                <Ticket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Book Tickets</h3>
              <p className="mt-2 text-base text-gray-500">
                Secure your spot with our easy booking system. Pay securely online.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mx-auto">
                <Smile className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Attend & Enjoy</h3>
              <p className="mt-2 text-base text-gray-500">
                Receive your tickets by email and get ready for an amazing experience.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/events">
            <Button size="lg" className="font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
