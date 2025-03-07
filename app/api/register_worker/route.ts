import { NextResponse } from "next/server";
import { db } from "@/db"; // 데이터베이스 연결
import { users } from "@/db/schema/schema_users"; // 사용자 스키마
import { eq } from "drizzle-orm";
export async function POST(req: Request) {
    try {
        const { name, contact, userId } = await req.json();

        // 입력 데이터 유효성 검사
        if (!name || !contact) {
            return NextResponse.json(
                { error: "모든 필드를 입력해야 합니다." },
                { status: 400 }
            );
        }

        // 일꾼 등록을 위한 유저 데이터 업데이트
        await db
            .update(users)
            .set({
                name,
                contact,
                role: "WORKER", // 기본 역할을 WORKER로 설정
            })
            .where(eq(users.id, userId));

        return NextResponse.json(
            { message: "일꾼 등록이 완료되었습니다." },
            { status: 201 }
        );
    } catch (error) {
        console.error("일꾼 등록 중 오류 발생:", error);
        return NextResponse.json(
            { error: "일꾼 등록에 실패했습니다." },
            { status: 500 }
        );
    }
}
