import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertEventSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const { limit, offset, category, search } = req.query;
      
      let events = [];
      
      if (search && typeof search === 'string') {
        events = await storage.searchEvents(search);
      } else if (category && typeof category === 'string') {
        const categoryId = parseInt(category, 10);
        if (!isNaN(categoryId)) {
          events = await storage.getEventsByCategory(categoryId);
        }
      } else {
        const limitNum = limit ? parseInt(limit as string, 10) : undefined;
        const offsetNum = offset ? parseInt(offset as string, 10) : undefined;
        events = await storage.getEvents(limitNum, offsetNum);
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/featured", async (req, res) => {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string, 10) : undefined;
      const events = await storage.getFeaturedEvents(limitNum);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Only admins or the user themselves can create events
    // In a real app, you'd check if the user has organizer privileges
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Permission denied" });
    }

    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid event data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Only admins or the organizer can update the event
      if (!req.user.isAdmin && event.organizerId !== req.user.id) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const eventData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, eventData);
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid event data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const id = parseInt(req.params.id, 10);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Only admins or the organizer can delete the event
      if (!req.user.isAdmin && event.organizerId !== req.user.id) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const success = await storage.deleteEvent(id);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete event" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // If user is admin, they can see all bookings
      if (req.user.isAdmin && req.query.event) {
        const eventId = parseInt(req.query.event as string, 10);
        const bookings = await storage.getBookingsByEvent(eventId);
        return res.json(bookings);
      }
      
      // Regular users can only see their own bookings
      const bookings = await storage.getBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if the event exists
      const event = await storage.getEvent(bookingData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Verify price calculation
      if (bookingData.totalPrice !== event.price * bookingData.quantity) {
        return res.status(400).json({ message: "Invalid price calculation" });
      }
      
      // Check availability
      const existingBookings = await storage.getBookingsByEvent(bookingData.eventId);
      const bookedQuantity = existingBookings.reduce(
        (total, booking) => total + booking.quantity, 0
      );
      
      if (bookedQuantity + bookingData.quantity > event.capacity) {
        return res.status(400).json({ 
          message: "Not enough tickets available",
          available: event.capacity - bookedQuantity
        });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const id = parseInt(req.params.id, 10);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only the user who made the booking or an admin can cancel it
      if (booking.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      const success = await storage.deleteBooking(id);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to cancel booking" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
