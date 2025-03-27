import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Ticket, 
  Calendar, 
  Settings, 
  LogOut,
  Users,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAdmin = user?.isAdmin;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">EventHub</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            <Link href="/dashboard">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location === '/dashboard' 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </a>
            </Link>
            
            <Link href="/dashboard?tab=bookings">
              <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.includes('bookings') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <Ticket className="mr-3 h-5 w-5" />
                My Bookings
              </a>
            </Link>
            
            <Link href="/events">
              <a className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Calendar className="mr-3 h-5 w-5" />
                Browse Events
              </a>
            </Link>
            
            {isAdmin && (
              <>
                <div className="mt-8 mb-2 px-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin
                  </p>
                </div>
                
                <Link href="/admin">
                  <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === '/admin' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Admin Dashboard
                  </a>
                </Link>
                
                <Link href="/admin/events">
                  <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.includes('/admin/events') && !location.includes('create')
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                    <FileText className="mr-3 h-5 w-5" />
                    Manage Events
                  </a>
                </Link>
                
                <Link href="/admin/events/create">
                  <a className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === '/admin/events/create' 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}>
                    <Calendar className="mr-3 h-5 w-5" />
                    Create Event
                  </a>
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">{user?.name.charAt(0)}</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 h-16">
          <Link href="/dashboard">
            <a className={`flex flex-col items-center justify-center ${
              location === '/dashboard' ? 'text-primary-600' : 'text-gray-600'
            }`}>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
          
          <Link href="/dashboard?tab=bookings">
            <a className={`flex flex-col items-center justify-center ${
              location.includes('bookings') ? 'text-primary-600' : 'text-gray-600'
            }`}>
              <Ticket className="h-6 w-6" />
              <span className="text-xs mt-1">Bookings</span>
            </a>
          </Link>
          
          <Link href="/events">
            <a className="flex flex-col items-center justify-center text-gray-600">
              <Calendar className="h-6 w-6" />
              <span className="text-xs mt-1">Events</span>
            </a>
          </Link>
          
          {isAdmin ? (
            <Link href="/admin">
              <a className={`flex flex-col items-center justify-center ${
                location.includes('/admin') ? 'text-primary-600' : 'text-gray-600'
              }`}>
                <Users className="h-6 w-6" />
                <span className="text-xs mt-1">Admin</span>
              </a>
            </Link>
          ) : (
            <Link href="/dashboard?tab=settings">
              <a className={`flex flex-col items-center justify-center ${
                location.includes('settings') ? 'text-primary-600' : 'text-gray-600'
              }`}>
                <Settings className="h-6 w-6" />
                <span className="text-xs mt-1">Settings</span>
              </a>
            </Link>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
}
