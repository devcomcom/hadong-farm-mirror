import "./globals.css";

import RoleToggle from "@/components/common/role_toggle";

export const metadata = {
    title: "My Next.js App",
    description: "A Next.js app with Clerk and Tailwind CSS",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const currentYear = new Date().getFullYear();

    return (
        <html lang="ko">
            <body className="min-h-screen bg-gray-100">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold">품앗이</h1>
                        <RoleToggle />
                        <nav className="mt-4">
                            <ul className="flex space-x-4">
                                <li>
                                    <a href="/" className="text-blue-600 hover:underline">홈</a>
                                </li>
                                <li>
                                    <a href="/job_feed" className="text-blue-600 hover:underline">구해요 피드</a>
                                </li>
                                <li>
                                    <a href="/worker_feed" className="text-blue-600 hover:underline">갈게요 피드</a>
                                </li>
                                <li>
                                    <a href="/job_feed/1" className="text-blue-600 hover:underline">구해요 상세</a>
                                </li>
                                <li>
                                    <a href="/new" className="text-blue-600 hover:underline">게시물 작성</a>
                                </li>
                                <li>
                                    <a href="/signup" className="text-blue-600 hover:underline">회원가입</a>
                                </li>
                                <li>
                                    <a href="/login" className="text-blue-600 hover:underline">로그인</a>
                                </li>
                                <li>
                                    <a href="/profile" className="text-blue-600 hover:underline">프로필</a>
                                </li>
                            </ul>
                        </nav>

                    </div>
                </header>
                <main className="container mx-auto px-4">
                    {children}
                </main>
                <footer className="bg-white shadow mt-8">
                    <div className="container mx-auto px-4 py-6">
                        <p>© {currentYear} 품앗이. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}



