import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull().default("primary"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
});

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  capacity: integer("capacity").notNull(),
  organizerId: integer("organizer_id").notNull(),
  organizerName: text("organizer_name").notNull(),
  organizerImage: text("organizer_image").notNull(),
  categoryId: integer("category_id").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  bookingDate: timestamp("booking_date").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingDate: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
