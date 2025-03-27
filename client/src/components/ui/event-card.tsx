import { Event } from "@shared/schema";
import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="h-48 w-full object-cover"
        />
        {event.isFeatured && (
          <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-xs font-medium text-primary">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{format(new Date(event.date), "MMMM d, yyyy • h:mm a")}</span>
        </div>
        
        <Link href={`/events/${event.id}`}>
          <a className="block mt-2">
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <p className="mt-1 text-gray-500 line-clamp-2">{event.description}</p>
          </a>
        </Link>
        
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <div 
              className="h-10 w-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.organizerImage})` }}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{event.organizerName}</p>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary font-semibold">${(event.price / 100).toFixed(2)}</span>
          <Link href={`/events/${event.id}`}>
            <Button size="sm">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
