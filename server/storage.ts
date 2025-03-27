import { users, type User, type InsertUser, events, type Event, type InsertEvent, categories, type Category, type InsertCategory, bookings, type Booking, type InsertBooking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(limit?: number, offset?: number): Promise<Event[]>;
  getFeaturedEvents(limit?: number): Promise<Event[]>;
  getEventsByCategory(categoryId: number): Promise<Event[]>;
  searchEvents(query: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Category methods
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByEvent(eventId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  deleteBooking(id: number): Promise<boolean>;
  
  // Session store for auth
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private categories: Map<number, Category>;
  private bookings: Map<number, Booking>;
  private userIdCounter: number;
  private eventIdCounter: number;
  private categoryIdCounter: number;
  private bookingIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.categories = new Map();
    this.bookings = new Map();
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.categoryIdCounter = 1;
    this.bookingIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with some categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Music", icon: "music", color: "primary" },
      { name: "Movies", icon: "film", color: "secondary" },
      { name: "Food & Drink", icon: "utensils", color: "accent" },
      { name: "Sports", icon: "zap", color: "green" },
      { name: "Education", icon: "book-open", color: "yellow" },
      { name: "Business", icon: "briefcase", color: "red" }
    ];
    
    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEvents(limit: number = 100, offset: number = 0): Promise<Event[]> {
    const events = Array.from(this.events.values());
    return events.slice(offset, offset + limit);
  }

  async getFeaturedEvents(limit: number = 6): Promise<Event[]> {
    const featuredEvents = Array.from(this.events.values())
      .filter(event => event.isFeatured)
      .slice(0, limit);
    return featuredEvents;
  }

  async getEventsByCategory(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.categoryId === categoryId
    );
  }

  async searchEvents(query: string): Promise<Event[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.events.values()).filter(
      event => 
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery)
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async getBookingsByEvent(eventId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.eventId === eventId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingDate: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }
}

export const storage = new MemStorage();
