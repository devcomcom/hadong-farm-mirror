// app/api/get_post_list/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { jobPostings } from "@/db/schema/schema_job_postings"; // Job postings 스키마 가져오기
import { matches } from "@/db/schema/schema_matches"; // Matches 스키마 가져오기
import { users } from "@/db/schema/schema_users"; // Users 스키마 가져오기
export async function GET() {
    try {
        // 데이터베이스에서 구인 게시물과 매칭 정보 가져오기
        const jobPostingsData = await db.select().from(jobPostings);
        const matchesData = await db.select().from(matches);
        const usersData = await db.select().from(users);

        return NextResponse.json({
            jobPostings: jobPostingsData,
            matches: matchesData,
            applicants: usersData,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
