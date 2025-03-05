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
                { data: "Invalid profile image" },
                { status: 200 }
            );
        }

        const profileImageName = `${Date.now()}_${profileImage.name}`;

        // Supabase에 프로필 이미지 업로드
        const { data, error: uploadError } = await supabase.storage
            .from("hadong-farm")
            .upload(`profile/${userId}/${profileImageName}`, profileImage);

        if (uploadError) {
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            );
        }

        // 프로필 이미지 URL 생성
        const profileImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/hadong-farm/profile/${userId}/${profileImageName}`;

        // user 테이블의 profile_image 컬럼 업데이트
        const { error: updateError } = await supabase
            .from("users")
            .update({ profile_image: profileImageUrl }) // profile_image 컬럼 업데이트
            .eq("id", userId); // userId로 필터링

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            );
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
