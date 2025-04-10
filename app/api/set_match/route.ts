import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { matches } from "@/db/schema/schema_matches"; // Matches 스키마 가져오기

export async function POST(request: Request) {
    try {
        const { jobPostingId, farmerId, workerId } = await request.json();

        // 필수 항목 검증
        if (!jobPostingId || !farmerId || !workerId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 새 매칭 객체 생성
        const newMatch = {
            jobPostingId,
            farmerId,
            workerId,
            status: "PENDING", // 초기 상태는 PENDING
            workerScore: null, // 초기 점수는 null
            workerComment: null, // 초기 코멘트는 null
            farmerScore: null, // 초기 점수는 null
            farmerComment: null, // 초기 코멘트는 null
            appliedAt: new Date(), // 지원 날짜
            updatedAt: new Date(), // 업데이트 날짜
            completedAt: null, // 완료 날짜는 null
        };

        // Drizzle ORM을 사용하여 데이터베이스에 새 매칭 추가
        await db.insert(matches).values(newMatch);

        return NextResponse.json(
            { message: "Match created successfully." },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error creating match:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
