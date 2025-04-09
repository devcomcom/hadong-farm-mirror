CREATE TABLE IF NOT EXISTS "job_postings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"farm_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" jsonb NOT NULL,
	"work_start_date" timestamp NOT NULL,
	"work_end_date" timestamp NOT NULL,
	"payment_amount" numeric NOT NULL,
	"payment_unit" text NOT NULL,
	"quota" integer NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
