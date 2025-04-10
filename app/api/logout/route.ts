import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
    try {
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        // 모든 사용자의 isActive를 false로 설정
        mockData.users.forEach((user: { isActive: boolean }) => {
            user.isActive = false;
        });

        // 수정된 데이터를 mock_data.json 파일에 저장
        fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2));

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
