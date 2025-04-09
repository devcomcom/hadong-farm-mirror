import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const mockDataPath = path.join(process.cwd(), "util", "mock_data.json");
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));

        mockData.users.forEach((user) => {
            user.isActive = false; // 모든 유저의 isActive를 false로 설정
        });
        // 사용자 인증
        const user = mockData.users.find(
            (user) => user.email === email && user.password === password
        );

        if (!user) {
            return NextResponse.json(
                { error: "이메일이나 비밀번호가 일치하지 않습니다." },
                { status: 401 }
            );
        }

        user.isActive = true; // 로그인한 사용자의 isActive 변수를 true로 설정

        fs.writeFileSync(mockDataPath, JSON.stringify(mockData, null, 2)); // 수정된 유저 데이터를 mock_data.json 파일에 반영

        // 로그인 성공 시 사용자 정보 반환
        return NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
