import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        About
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Blog
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Careers
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/press">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Press
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/help">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Help Center
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Contact Us
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Privacy
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Terms
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Events
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/events">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Browse Events
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/events?filter=categories">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Categories
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/events?filter=calendar">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Calendar
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/host">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Host an Event
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Account
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/auth">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Sign Up
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Log In
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        Dashboard
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard?tab=bookings">
                      <span className="text-base text-gray-300 hover:text-white cursor-pointer">
                        My Tickets
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Connect with us
            </h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Subscribe to our newsletter
              </h3>
              <p className="mt-4 text-base text-gray-300">
                The latest events and updates delivered to your inbox.
              </p>
              <form className="mt-4 sm:flex sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full bg-primary border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} EventHub, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
