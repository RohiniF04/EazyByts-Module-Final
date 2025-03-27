import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-2xl font-bold text-primary">EventHub</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location === '/' 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                  Home
                </a>
              </Link>
              
              <Link href="/events">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location === '/events' 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                  Events
                </a>
              </Link>
              
              <Link href="/events?filter=categories">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.includes('categories') 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                  Categories
                </a>
              </Link>
              
              <Link href="/events?filter=about">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.includes('about') 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}>
                  About
                </a>
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">{user.name.charAt(0)}</span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user.name}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <a className="flex w-full cursor-pointer items-center">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard?tab=settings">
                        <a className="flex w-full cursor-pointer items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <a className="flex w-full cursor-pointer items-center">
                            <User className="mr-2 h-4 w-4" />
                            Admin Panel
                          </a>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="ml-4">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location === '/' 
                ? 'bg-primary-50 border-primary text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}>
              Home
            </a>
          </Link>
          
          <Link href="/events">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location === '/events' 
                ? 'bg-primary-50 border-primary text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}>
              Events
            </a>
          </Link>
          
          <Link href="/events?filter=categories">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.includes('categories') 
                ? 'bg-primary-50 border-primary text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}>
              Categories
            </a>
          </Link>
          
          <Link href="/events?filter=about">
            <a className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              location.includes('about') 
                ? 'bg-primary-50 border-primary text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}>
              About
            </a>
          </Link>
        </div>
        
        {user ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium">{user.name.charAt(0)}</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/dashboard">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Dashboard
                </a>
              </Link>
              <Link href="/dashboard?tab=settings">
                <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Settings
                </a>
              </Link>
              {user.isAdmin && (
                <Link href="/admin">
                  <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Admin Panel
                  </a>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mt-3 space-y-1">
              <Link href="/auth">
                <a className="flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Sign In
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
