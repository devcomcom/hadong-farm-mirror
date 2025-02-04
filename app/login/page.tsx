"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";

// UI 컴포넌트들 (shadcn/ui 또는 프로젝트 커스텀 컴포넌트)
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const { signIn } = useSignIn();

    // 로그인 폼 제출 처리 함수
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault(); // 기본 폼 제출 동작 방지
    //     setLoading(true); // 로딩 상태 설정
    //     setError(null); // 에러 초기화

    //     try {
    //         // const response = await fetch("/api/auth/login", {
    //         //     method: "POST",
    //         //     headers: {
    //         //         "Content-Type": "application/json",
    //         //     },
    //         //     body: JSON.stringify({ email, password, rememberMe }), // 로그인 정보 전송
    //         // });

    //         // const data = await response.json();

    //         // if (data.success) {
    //         //     router.push("/dashboard"); // 로그인 성공 시 대시보드로 이동
    //         // } else {
    //         //     setError(data.error || "로그인에 실패했습니다."); // 에러 메시지 설정
    //         // }
    //     } catch (err) {
    //         setError("서버 에러가 발생했습니다."); // 서버 에러 처리
    //     }
    //     setLoading(false); // 로딩 상태 해제
    // };

    // // 소셜 로그인 버튼 컴포넌트
    // const SocialLoginButtons = () => {
    //     return (
    //         <div className="grid gap-2">
    //             <Button variant="outline" onClick={async () => {
    //                 if (signIn) {
    //                     await signIn.authenticateWithRedirect({
    //                         strategy: "oauth_google",
    //                         redirectUrl: "/dashboard",
    //                     });
    //                 } else {
    //                     console.error("signIn is undefined");
    //                 }
    //             }}>
    //                 {/* 필요시 아이콘 컴포넌트 추가 */}
    //                 <Button variant="outline" onClick={async () => {
    //                     if (signIn) {
    //                         await signIn.authenticateWithRedirect({
    //                             strategy: "oauth_google",
    //                             redirectUrl: "/dashboard",
    //                         });
    //                     } else {
    //                         console.error("signIn is undefined");
    //                     }
    //                 }}>
    //                     Google로 로그인
    //                 </Button>
    //                 <Button variant="outline" onClick={async () => {
    //                     if (signIn) {
    //                         await signIn.authenticateWithRedirect({
    //                             strategy: "oauth_kakao",
    //                             redirectUrl: "/dashboard",
    //                         });
    //                     } else {
    //                         console.error("signIn is undefined");
    //                     }
    //                 }}>
    //                     카카오로 로그인
    //                 </Button>
    //             </Button>
    //         </div>
    //     );
    // };

    return (
        <div className="container max-w-md mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit="" className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                이메일
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // 이메일 입력 처리
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                비밀번호
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 처리
                                required
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* <Checkbox
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} // 로그인 상태 유지 체크박스 처리
                            /> */}
                            <label htmlFor="rememberMe" className="text-sm">
                                로그인 상태 유지
                            </label>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>} {/* 에러 메시지 표시 */}

                        <Button type="submit" disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"} {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
                        </Button>
                    </form>

                    {/* <Separator className="my-4" /> */}

                    {/* <SocialLoginButtons /> 소셜 로그인 버튼 컴포넌트 */}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Link href="/signup" className="text-blue-500 text-sm">
                        회원가입
                    </Link>
                    <Link href="/forgot-password" className="text-blue-500 text-sm">
                        비밀번호 찾기
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
} 