import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

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
                {/* <ClerkProvider> */}
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold">My Application</h1>
                    </div>
                </header>
                <main className="container mx-auto p-6">
                    {children}
                </main>
                <footer className="bg-white shadow mt-8">
                    <div className="container mx-auto px-4 py-6">
                        <p>© {currentYear} My Application. All rights reserved.</p>
                    </div>
                </footer>
                {/* </ClerkProvider> */}
            </body>
        </html>
    );
}


