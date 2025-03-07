import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Users 테이블 정의
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password"),
    name: text("name"),
    contact: text("contact"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    role: text("role"),
    profileImage: text("profile_image"),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
