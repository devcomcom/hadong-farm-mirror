// app/api/set_match/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { matches } from "@/db/schema/schema_matches"; // Matches 스키마 가져오기
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
    const { jobId, applicantId, action } = await request.json(); // 요청 본문에서 jobId와 action을 가져옵니다.

    // action이 'ACCEPTED' 또는 'REJECTED'인지 확인
    if (
        action !== "ACCEPTED" &&
        action !== "REJECTED" &&
        action !== "WAITLIST"
    ) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // 데이터베이스에서 해당 jobId와 applicantId를 가진 매치를 찾습니다.
    const match = await db
        .select()
        .from(matches)
        .where(
            and(
                eq(matches.jobPostingId, jobId),
                eq(matches.workerId, applicantId)
            )
        )
        .execute();

    if (match.length === 0) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // 매치의 상태를 업데이트합니다.
    await db
        .update(matches)
        .set({ status: action })
        .where(
            and(
                eq(matches.jobPostingId, jobId),
                eq(matches.workerId, applicantId)
            )
        )
        .execute();

    return NextResponse.json({
        message: "Match status updated successfully",
        match: { ...match[0], status: action }, // 업데이트된 매치 정보 반환
    });
}
