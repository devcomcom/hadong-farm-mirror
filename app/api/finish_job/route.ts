import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { jobPostings } from "@/db/schema/schema_job_postings"; // Job postings 스키마 가져오기
import { matches } from "@/db/schema/schema_matches"; // Matches 스키마 가져오기
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobPostingId, farmerId } = body;

        // 데이터베이스에서 jobPosting과 match 데이터 찾기
        const jobPosting = await db
            .select()
            .from(jobPostings)
            .where(eq(jobPostings.id, jobPostingId))
            .execute();

        const match = await db
            .select()
            .from(matches)
            .where(
                and(
                    eq(matches.jobPostingId, jobPostingId),
                    eq(matches.farmerId, farmerId)
                )
            )
            .execute();

        console.log(jobPosting);
        console.log(match);

        if (jobPosting.length === 0 || match.length === 0) {
            return NextResponse.json(
                { error: "Job posting or match not found." },
                { status: 404 }
            );
        }

        // 작업 완료 상태로 변경
        await db
            .update(jobPostings)
            .set({ status: "COMPLETED" })
            .where(eq(jobPostings.id, jobPostingId))
            .execute();

        await db
            .update(matches)
            .set({ status: "COMPLETED" })
            .where(
                and(
                    eq(matches.jobPostingId, jobPostingId),
                    eq(matches.farmerId, farmerId)
                )
            )
            .execute();

        return NextResponse.json({
            success: true,
            message: "Job and match status updated to completed.",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
