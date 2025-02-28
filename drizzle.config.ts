import { config } from "dotenv";
config();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: [
        "./lib/schema_job_postings.ts",
        "./lib/schema_users.ts",
        "./lib/schema_farms.ts",
        "./lib/schema_matches.ts",
    ], // 스키마 파일 경로
    out: "./lib/migrations", // 마이그레이션 파일 저장 경로
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
