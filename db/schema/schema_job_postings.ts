import {
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    jsonb,
    decimal,
} from "drizzle-orm/pg-core";

// Job 테이블 정의
export const jobPostings = pgTable("job_postings", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    farmId: integer("farm_id"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    location: jsonb("location").notNull(), // 주소, 위도, 경도 포함
    workStartDate: timestamp("work_start_date").notNull(),
    workEndDate: timestamp("work_end_date").notNull(),

    paymentAmount: decimal("payment_amount").notNull(),
    paymentUnit: text("payment_unit").notNull(),

    quota: integer("quota").notNull(),
    status: text("status").notNull().default("OPEN"),

    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertJobPosting = typeof jobPostings.$inferInsert;
export type SelectJobPosting = typeof jobPostings.$inferSelect;
