"use client";

import RoleToggle from "@/components/common/role_toggle";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import Text from "@/components/common/text";
import CustomLogoutButton from "@/components/common/button_logout";
import CustomLoginButton from "@/components/common/button_login";
import { useAuth, useUser } from "@clerk/nextjs";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const Header = () => {
    const [userRoleLocal, setUserRoleLocal] = useState<string | null>(null); // 사용자 역할 상태 관리
    const { setRole, setUserId } = useAuthStore(); // Zustand 스토어에서 setRole 함수 가져오기
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const checkUserStatus = async () => {
        const isLoginPage = window.location.pathname === "/"; // 현재 페이지가 홈 페이지인지 확인

        if (!isLoginPage && isSignedIn) {
            const email = user?.emailAddresses[0].emailAddress; // 이메일을 파라미터로 추가
            const response = await fetch(`/api/get_auth?email=${encodeURIComponent(email as string)}`); // 사용자 정보를 가져오는 API 호출


            if (response.ok) {
                const userData = await response.json();
                if (!userData) {
                    alert("로그아웃 상태입니다."); // 로그아웃 상태 메시지 출력
                    window.location.href = "/"; // 홈으로 리다이렉트
                }
                if (userData.user.roles.length > 0) {
                    setRole(userData.user.roles[0].role);
                    setUserRoleLocal(userData.user.roles[0].role);
                    setUserId(userData.user.id);
                } else {
                    alert("사용자의 역할을 찾을 수 없습니다.");
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUserStatus();
    }, [isSignedIn]);

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">품앗이</h1>
                {loading ? (
                    <div className="loader">로딩 중...</div>
                ) : (
                    userRoleLocal && (
                        <p className="text-sm text-gray-600">
                            로그인 상태의 유저 역할: {userRoleLocal}
                        </p>
                    )
                )}
                <NavigationMenu>
                    <NavigationMenuList className="flex space-x-4 items-center">
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md transition duration-200 ease-in-out">
                                <Text>홈</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/job_feed" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md">
                                <Text>구해요 피드</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/worker_feed" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md">
                                <Text>갈게요 피드</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/new" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md">
                                <Text>게시물 작성</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/signup" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md">
                                <Text>회원가입</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/meta_data" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:shadow-md">
                                <Text>메타데이터 확인</Text>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            {isSignedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                                        <span className="flex items-center justify-center text-xl text-gray-500">
                                            {user?.emailAddresses[0].emailAddress.charAt(0)}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                                            <Text>내 프로필</Text>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <CustomLogoutButton aria-label="로그아웃" />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            ) : (
                                <CustomLoginButton aria-label="로그인" />
                            )}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
};

export default Header;
