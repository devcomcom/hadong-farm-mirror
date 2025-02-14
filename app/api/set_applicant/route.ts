// app/api/set_match/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    const { jobId, action } = await request.json(); // 요청 본문에서 jobId와 action을 가져옵니다.
    const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

    // action이 'ACCEPTED' 또는 'REJECTED'인지 확인
    if (action !== "ACCEPTED" && action !== "REJECTED") {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // matches에서 해당 jobId를 가진 매치를 찾습니다.
    const matchIndex = mockData.matches.findIndex(
        (match: any) => match.jobPostingId === jobId
    );

    if (matchIndex === -1) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // 매치의 상태를 업데이트하고 파일에 반영합니다.
    mockData.matches[matchIndex].status = action;
    fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2)); // mock_data.json 파일에 저장

    return NextResponse.json({
        message: "Match status updated successfully",
        match: mockData.matches[matchIndex],
    });
}
