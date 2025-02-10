import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        // isActive가 true인 사용자 찾기
        const activeUser = mockData.users.find(
            (user) => user.isActive === true
        );

        if (!activeUser) {
            return NextResponse.json({ isActive: false }, { status: 200 });
        }

        return NextResponse.json(
            { isActive: true, user: activeUser },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
