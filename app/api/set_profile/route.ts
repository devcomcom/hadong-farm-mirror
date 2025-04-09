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

        // 기존 프로필 이미지 삭제
        await deleteFilesInFolder("hadong-farm", `profile/${userId}`);

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

/**
 * 특정 폴더 내 모든 파일 삭제 함수
 * @param folderPath 삭제할 폴더 경로 (예: "profile/user_2tKZqR3wlgWnWDJORKi5YiEHAM1")
 */
async function deleteFilesInFolder(bucketName: string, folderPath: string) {
    // 1️⃣ 폴더 내 파일 목록 가져오기
    const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath);

    if (error) {
        console.error("파일 목록을 가져오는 데 실패했습니다:", error.message);
        return false;
    }

    console.log("bucketName", bucketName);
    console.log("folderPath", folderPath);
    console.log("data", data);

    if (!data || data.length === 0) {
        console.log("삭제할 파일이 없습니다.");
        return true;
    }

    // 2️⃣ 파일 경로 목록 생성
    const filePaths = data.map((file) => `${folderPath}/${file.name}`);

    // 3️⃣ 파일 삭제 요청
    const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

    if (deleteError) {
        console.error("파일 삭제 실패:", deleteError.message);
        return false;
    }

    console.log(`${folderPath} 내 모든 파일 삭제 완료`);
    return true;
}
