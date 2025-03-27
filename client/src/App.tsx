import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import EventsPage from "@/pages/events-page";
import EventDetailsPage from "@/pages/event-details-page";
import UserDashboardPage from "@/pages/user-dashboard-page";
import AdminDashboardPage from "@/pages/admin-dashboard-page"; 
import AdminEventsPage from "@/pages/admin-events-page";
import CreateEventPage from "@/pages/create-event-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, AdminRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailsPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={UserDashboardPage} />
      
      {/* Admin routes */}
      <AdminRoute path="/admin" component={AdminDashboardPage} />
      <AdminRoute path="/admin/events" component={AdminEventsPage} />
      <AdminRoute path="/admin/events/create" component={CreateEventPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
