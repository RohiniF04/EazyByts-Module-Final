import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  rating: number;
}

export default function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "EventHub made it so easy to find and book tickets for my favorite band's concert. The whole process was smooth from start to finish!",
      author: {
        name: "Sarah Johnson",
        role: "Music enthusiast",
        image: "https://randomuser.me/api/portraits/women/18.jpg"
      },
      rating: 5
    },
    {
      id: 2,
      text: "As a business workshop organizer, this platform has helped me reach a much wider audience. The management tools are excellent.",
      author: {
        name: "Michael Brown",
        role: "Event organizer",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      rating: 5
    },
    {
      id: 3,
      text: "I've discovered so many interesting local events that I would have never found otherwise. The recommendations are spot on!",
      author: {
        name: "Emily Chen",
        role: "Regular attendee",
        image: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      rating: 4
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">What Our Users Say</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hear from people who have used our platform to discover and attend events.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`} 
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-base text-gray-500">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={testimonial.author.image} 
                      alt={testimonial.author.name} 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
