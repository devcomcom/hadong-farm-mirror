import {
    pgTable,
    serial,
    text,
    timestamp,
    integer,
    decimal,
} from "drizzle-orm/pg-core";

// 농장 테이블 정의
export const farms = pgTable("farms", {
    id: serial("id").primaryKey(),
    ownerId: integer("owner_id").notNull(),
    name: text("name").notNull(),
    latitude: decimal("latitude", { precision: 9, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),
    address: text("address"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertFarm = typeof farms.$inferInsert;
export type SelectFarm = typeof farms.$inferSelect;
