import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobPostingId, workerId } = body;

        // mock_data.json 파일 경로
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        // jobPosting과 match 데이터 찾기
        const jobPosting = mockData.jobPostings.find(
            (job: any) => job.id === jobPostingId
        );
        const match = mockData.matches.find(
            (match: any) =>
                match.jobPostingId === jobPostingId &&
                match.workerId === workerId
        );

        if (!jobPosting || !match) {
            return NextResponse.json(
                { error: "Job posting or match not found." },
                { status: 404 }
            );
        }

        // 작업 완료 상태로 변경
        jobPosting.status = "COMPLETED";
        match.status = "COMPLETED";

        // mock_data.json 파일에 업데이트된 데이터 저장
        fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2));

        return NextResponse.json({
            success: true,
            message: "Job and match status updated to completed.",
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
