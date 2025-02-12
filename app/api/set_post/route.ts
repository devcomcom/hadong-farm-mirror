import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
            !address
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));
        console.log(mockData);

        // 새 구인 포스트 객체 생성
        const newJobPosting = {
            id: `${mockData.jobPostings.length + 1}`,
            type: jobType, // "FARMER" 또는 "WORKER"
            userId: jobType === "FARMER" ? "user1" : "user2", // 예시 로직 (농장주/근로자)
            farmId: jobType === "FARMER" ? "farm1" : null,
            title,
            description,
            location: {
                address,
                latitude,
                longitude,
            },
            workDate: {
                start: startDate,
                end: endDate,
            },
            payment: {
                amount: paymentAmount,
                unit: paymentUnit,
            },
            status: "OPEN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // 더미 데이터의 jobPostings 배열에 신규 포스트 추가
        mockData.jobPostings.push(newJobPosting);

        // mock_data.json 파일에 업데이트된 데이터 저장
        const filePath = path.join(process.cwd(), "util", "mock_data.json");
        fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));

        return NextResponse.json({ success: true, jobPosting: newJobPosting });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
