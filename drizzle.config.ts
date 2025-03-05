import { config } from "dotenv";
config();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: [
        "./db/schema/schema_job_postings.ts",
        "./db/schema/schema_users.ts",
        "./db/schema/schema_farms.ts",
        "./db/schema/schema_matches.ts",
    ], // 스키마 파일 경로
    out: "./db/migrations", // 마이그레이션 파일 저장 경로
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
