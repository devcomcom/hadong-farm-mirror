import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { jobPostings } from "@/db/schema/schema_job_postings"; // Job postings 스키마 가져오기

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            jobType,
            startDate,
            endDate,
            paymentAmount,
            paymentUnit,
            address,
            latitude,
            longitude,
            quota,
        } = body;

        // 필수 항목 검증
        if (
            !title ||
            !description ||
            !jobType ||
            !startDate ||
            !endDate ||
            !paymentAmount ||
            !paymentUnit ||
            !address ||
            !quota
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 새 구인 포스트 객체 생성
        const newJobPosting = {
            userId: 1, // 실제 사용자 ID로 변경 예정
            farmId: 1, // 실제 농장 ID로 변경 예정
            title,
            description,
            location: JSON.stringify({ address, latitude, longitude }), // JSON 형식으로 변환
            workStartDate: new Date(startDate), // Date 형식으로 변환
            workEndDate: new Date(endDate), // Date 형식으로 변환
            paymentAmount,
            paymentUnit,
            quota,
            status: "OPEN",
            createdAt: new Date(), // Date 형식으로 변환
            updatedAt: new Date(), // Date 형식으로 변환
        };

        // Drizzle ORM을 사용하여 데이터베이스에 새 구인 포스트 추가
        await db.insert(jobPostings).values(newJobPosting);

        return NextResponse.json(
            { message: "Job posting created successfully." },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
