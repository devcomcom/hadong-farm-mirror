import { NextResponse } from "next/server";
import mockData from "@/util/mock_data";

export async function GET() {
    try {
        return NextResponse.json(mockData);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Error fetching dummy data" },
            { status: 500 }
        );
    }
}
