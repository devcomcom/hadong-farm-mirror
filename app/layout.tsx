import "./globals.css";

import Header from "@/components/layout/header";

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
                <Header />
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



