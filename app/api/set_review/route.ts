import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const { jobId, review, userId } = await request.json(); // userId 추가
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        // 해당 jobId에 대한 매칭 데이터 찾기
        const match = mockData.matches.find(
            (match: any) => match.jobPostingId === jobId
        );

        if (!match) {
            return NextResponse.json(
                { error: "매칭 데이터를 찾을 수 없습니다." },
                { status: 405 }
            );
        }

        const user = mockData.users.find((user: any) => user.email === userId);

        // 역할에 따라 후기를 저장
        if (match.farmerId === user.id) {
            match.farmerComment = review; // 근로자의 후기를 저장
            console.log(match);
        } else if (match.workerId === user.id) {
            match.workerComment = review; // 농장주의 후기를 저장
        }

        console.log(match);
        mockData.matches.map((matchItem: any) => {
            if (matchItem.jobPostingId === jobId) {
                matchItem = match;
            }
        });

        // console.log(mockData.matches);

        // 수정된 데이터를 mock_data.json 파일에 저장
        fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2));

        return NextResponse.json(
            { message: "후기가 성공적으로 제출되었습니다." },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
