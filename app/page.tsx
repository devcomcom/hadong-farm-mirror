import Button from "@/components/common/button";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 text-center p-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                환영합니다, 품앗이
            </h1>
            <p className="text-lg md:text-2xl text-white mb-8">
                당신의 농장과 일자리를 연결해드립니다.
            </p>
            <div className="flex space-x-4">
                <Link href="/job_feed">
                    <Button
                        color="blue"
                    >구해요 피드 보기</Button>
                </Link>
            </div>
        </div>
    );
}