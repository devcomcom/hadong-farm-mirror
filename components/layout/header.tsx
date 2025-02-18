"use client";

import RoleToggle from "@/components/common/role_toggle";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import Text from "@/components/common/text";
import Button from "@/components/common/button";
import CustomLogoutButton from "@/components/common/button_logout";
import CustomLoginButton from "@/components/common/button_login";
import { useAuth } from "@clerk/nextjs";

const Header = () => {
    const [userRoleLocal, setUserRoleLocal] = useState<string | null>(null); // 사용자 역할 상태 관리
    const { setRole } = useAuthStore(); // Zustand 스토어에서 setRole 함수 가져오기
    const { isSignedIn } = useAuth();

    // const checkUserStatus = async () => {
    //     const isLoginPage = window.location.pathname === "/login"; // 현재 페이지가 로그인 페이지인지 확인
    //     if (!isLoginPage) {
    //         const response = await fetch("/api/get_auth"); // 사용자 정보를 가져오는 API 호출
    //         if (response.ok) {
    //             const userData = await response.json();
    //             if (!userData.isActive) {
    //                 alert("로그아웃 상태입니다."); // 로그아웃 상태 메시지 출력
    //                 window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    //             }
    //             if (userData.user.roles.length > 0) {
    //                 console.log(userData.user.roles[0]); // 첫 번째 역할 출력

    //                 setRole(userData.user.roles[0].role); // Zustand 스토어에 사용자 역할 설정
    //                 setUserRoleLocal(userData.user.roles[0].role); // 첫 번째 역할 설정
    //             } else {
    //                 alert("사용자의 역할을 찾을 수 없습니다."); // 역할이 없을 경우 메시지 출력
    //             }
    //         }
    //     }
    // };

    // useEffect(() => {
    //     checkUserStatus();
    // }, []);

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold">품앗이</h1>
                {userRoleLocal && (
                    <p className="text-sm text-gray-600">
                        로그인 상태의 유저 역할: {userRoleLocal}
                    </p>
                )}
                {/* 유저가 농장주와 근로자 역할이 둘 다 필요할 때까지 역할 토글 주석 처리 */}
                {/* <RoleToggle /> */}
                <nav className="mt-4">
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <a
                                href="/"
                                className="text-blue-600 hover:underline"
                            >
                                <Text>홈</Text>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/job_feed"
                                className="text-blue-600 hover:underline"
                            >
                                <Text>구해요 피드</Text>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/worker_feed"
                                className="text-blue-600 hover:underline"
                            >
                                <Text>갈게요 피드</Text>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/new"
                                className="text-blue-600 hover:underline"
                            >
                                <Text>게시물 작성</Text>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/profile"
                                className="text-blue-600 hover:underline"
                            >
                                <Text>프로필</Text>
                            </a>
                        </li>
                        <li>
                            {isSignedIn ? (
                                <CustomLogoutButton />
                            ) : (
                                <CustomLoginButton />
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
