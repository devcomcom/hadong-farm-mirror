import { NextResponse } from "next/server";
import { db } from "@/db"; // Drizzle ORM DB 인스턴스 가져오기
import { users } from "@/db/schema/schema_users"; // Users 스키마 가져오기
import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        // 데이터베이스에서 사용자 찾기
        const activeUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email as string))
            .execute();

        if (activeUser.length === 0) {
            return NextResponse.json({ isActive: false }, { status: 200 });
        }

        return NextResponse.json(
            { isActive: true, user: activeUser[0] },
            { status: 200 }
        );
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
