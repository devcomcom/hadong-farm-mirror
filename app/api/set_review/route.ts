import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { matches } from "@/db/schema/schema_matches"; // Matches 스키마 가져오기
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { jobId, review, userId } = await request.json(); // userId 추가

        // 데이터베이스에서 해당 jobId에 대한 매칭 데이터 찾기
        const match = await db
            .select()
            .from(matches)
            .where(eq(matches.jobPostingId, jobId))
            .execute();

        if (match.length === 0) {
            return NextResponse.json(
                { error: "매칭 데이터를 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 매칭 데이터에서 사용자 역할에 따라 후기를 저장
        const updatedMatch = match[0];

        if (updatedMatch.farmerId === userId) {
            updatedMatch.farmerComment = review; // 농장주의 후기를 저장

            // 매치의 상태를 업데이트합니다.
            await db
                .update(matches)
                .set({
                    farmerComment: updatedMatch.farmerComment,
                })
                .where(eq(matches.id, updatedMatch.id))
                .execute();
        } else if (updatedMatch.workerId === userId) {
            updatedMatch.workerComment = review; // 근로자의 후기를 저장

            // 매치의 상태를 업데이트합니다.
            await db
                .update(matches)
                .set({
                    workerComment: updatedMatch.workerComment,
                })
                .where(eq(matches.id, updatedMatch.id))
                .execute();
        }

        return NextResponse.json(
            { message: "후기가 성공적으로 제출되었습니다." },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
