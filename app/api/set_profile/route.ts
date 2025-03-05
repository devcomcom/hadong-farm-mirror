import { supabase } from "@/lib/supabase/supabase_client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.formData(); // FormData로 요청 본문을 파싱
        const userId = body.get("userId"); // userId 가져오기
        const profileImage = body.get("profileImage"); // profileImage 가져오기

        // profileImage가 File 객체인지 확인
        if (!profileImage || !(profileImage instanceof File)) {
            return NextResponse.json(
                { error: "Invalid profile image" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase.storage
            .from("hadong-farm")
            .upload(`profile/${userId}/${profileImage.name}`, profileImage);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
