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
                <a
                    href="/job_feed"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors"
                >
                    구해요 피드 보기
                </a>
                <a
                    href="/signup"
                    className="px-6 py-3 bg-white text-blue-600 rounded-md shadow-lg hover:bg-gray-100 transition-colors"
                >
                    회원가입
                </a>
            </div>
        </div>
    );
}