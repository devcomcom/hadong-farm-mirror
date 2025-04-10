import { NextResponse } from "next/server";
import mockData from "../../../util/mock_data.json";

export async function GET() {
    try {
        return NextResponse.json(mockData);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || "Error fetching dummy data" },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
