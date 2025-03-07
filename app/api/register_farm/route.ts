import { NextResponse } from "next/server";
import { db } from "@/db"; // 데이터베이스 연결
import { farms } from "@/db/schema/schema_farms"; // 농장 스키마
import { users } from "@/db/schema/schema_users"; // 유저 스키마
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { name, description, ownerId } = await req.json(); // 입력 데이터 유효성 검사

        if (!name || !ownerId) {
            return NextResponse.json(
                { error: "모든 필드를 입력해야 합니다." },
                { status: 400 }
            );
        } // 농장 등록

        await db.insert(farms).values({
            name,
            description,
            ownerId,
        });

        await db
            .update(users)
            .set({
                role: "FARMER",
            })
            .where(eq(users.id, ownerId));

        return NextResponse.json(
            { message: "농장 등록이 완료되었습니다." },
            { status: 201 }
        );
    } catch (error) {
        console.error("농장 등록 중 오류 발생:", error);
        return NextResponse.json(
            { error: "농장 등록에 실패했습니다." },
            { status: 500 }
        );
    }
}
