import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const { jobPostingId, workerId } = await request.json(); // 요청 본문에서 jobPostingId와 workerId 가져오기
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        // matches 배열에 새로운 매칭 추가
        const newMatch = {
            id: `match${mockData.matches.length + 1}`, // 새로운 매칭 ID 생성
            jobPostingId,
            formerId: mockData.jobPostings.find(
                (job) => job.id === jobPostingId
            )?.userId, // 구인 게시물의 작성자 ID
            workerId,
            status: "PENDING", // 초기 상태는 PENDING
            workerScore: null, // 초기 점수는 null
            farmerScore: null, // 초기 점수는 null
            appliedAt: new Date().toISOString(), // 지원 날짜
            updatedAt: new Date().toISOString(), // 업데이트 날짜
            completedAt: null, // 완료 날짜는 null
        };

        mockData.matches.push(newMatch); // 새로운 매칭 추가
        fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2)); // mock_data.json 파일에 저장

        return NextResponse.json(
            { message: "지원이 성공적으로 추가되었습니다." },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
