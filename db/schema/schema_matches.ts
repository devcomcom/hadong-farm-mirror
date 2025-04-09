import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// 매치 테이블 정의
export const matches = pgTable("matches", {
    id: serial("id").primaryKey(),
    jobPostingId: integer("job_posting_id").notNull(),
    farmerId: integer("farmer_id").notNull(),
    workerId: integer("worker_id").notNull(),
    status: text("status").notNull(),
    workerScore: integer("worker_score"),
    workerComment: text("worker_comment"),
    farmerScore: integer("farmer_score"),
    farmerComment: text("farmer_comment"),
    appliedAt: timestamp("applied_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    completedAt: timestamp("completed_at"),
});

export type InsertMatch = typeof matches.$inferInsert;
export type SelectMatch = typeof matches.$inferSelect;
