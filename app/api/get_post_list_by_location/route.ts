import { NextResponse } from "next/server";
import mockData from "@/util/mock_data.json";

// Haversine 공식을 사용하여 두 지점 간의 거리 계산
const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 (km)
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userLat = parseFloat(searchParams.get("latitude") || "0");
    const userLng = parseFloat(searchParams.get("longitude") || "0");

    // 10km 이내의 구인 게시물 필터링
    const nearbyJobPostings = mockData.jobPostings
        .map((job) => {
            const jobLat = job.location.latitude;
            const jobLng = job.location.longitude;
            const distance = haversineDistance(
                Number(userLat),
                Number(userLng),
                Number(jobLat),
                Number(jobLng)
            );
            return { ...job, distance }; // 거리 추가
        })
        .filter((job) => job.distance <= 10); // 10km 이내 필터링

    return NextResponse.json({ jobPostings: nearbyJobPostings });
}
