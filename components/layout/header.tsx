"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import CustomLogoutButton from "@/components/common/button_logout";
import CustomLoginButton from "@/components/common/button_login";
import { useAuth, useUser } from "@clerk/nextjs";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { Home, Search, User, LogOut, Pickaxe, Tractor } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"; // Dialog 컴포넌트 임포트
import UserRegistrationForm from "@/components/layout/_components/user_registration_form"; // 유저 등록 폼 컴포넌트 임포트
import FarmRegistrationForm from "@/components/layout/_components/farm_registration_form"; // 농장 등록 폼 컴포넌트 임포트
import { Menu } from "lucide-react";

const Header = () => {
    const [userRoleLocal, setUserRoleLocal] = useState<string | null>(null);
    const { setRole, setUserId } = useAuthStore();
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false); // 유저 등록 다이얼로그 상태 관리
    const [isFarmDialogOpen, setIsFarmDialogOpen] = useState(false); // 농장 등록 다이얼로그 상태 관리

    const checkUserStatus = async () => {
        const isLoginPage = pathname === "/";

        if (isSignedIn) {
            try {
                const email = user?.emailAddresses[0].emailAddress;
                const response = await fetch(
                    `/api/get_auth?email=${encodeURIComponent(email as string)}`
                );

                if (response.ok) {
                    const userData = await response.json();
                    if (!isLoginPage && !userData) {
                        alert("로그아웃 상태입니다.");
                        router.push("/");
                        return;
                    }
                    if (userData.user.role !== null) {
                        setRole(userData.user.role);
                        setUserRoleLocal(userData.user.role);
                        setUserId(userData.user.id);
                    }
                }
            } catch (error) {
                console.error("사용자 상태 확인 중 오류:", error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUserStatus();
    }, [isSignedIn]);

    const menuItems = [
        { href: "/", label: "홈", icon: <Home className="w-4 h-4" /> },
        {
            href: "/job_feed",
            label: "구해요",
            icon: <Search className="w-4 h-4" />,
        },
        {
            href: "/worker_feed",
            label: "갈게요",
            icon: <Search className="w-4 h-4" />,
        },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <div
                        className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => router.push("/")}
                    >
                        품앗이
                    </div>

                    {/* 네비게이션 메뉴 */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="flex space-x-1">
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink
                                        href={item.href}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
                                            ${pathname === item.href
                                                ? "bg-blue-50 text-blue-600"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* 사용자 메뉴 */}
                    <div className="flex items-center space-x-4">
                        {!loading && userRoleLocal && (
                            <span className="hidden md:block text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {userRoleLocal === "FARMER"
                                    ? "농장주"
                                    : userRoleLocal === "WORKER"
                                        ? "일꾼"
                                        : "신규 회원"}
                            </span>
                        )}

                        {/* 모바일 네비게이션 버튼 */}
                        <div className="md:hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className="flex items-center justify-center w-10 h-10 "
                                >
                                    <Menu className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-36"
                                >
                                    {menuItems.map((item) => (
                                        <DropdownMenuItem
                                            className="flex items-center space-x-2 cursor-pointer"
                                            onClick={() => router.push(item.href)}
                                            key={item.href}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {isSignedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
                                    bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity"
                                >
                                    <span className="text-lg font-medium">
                                        {user?.emailAddresses[0].emailAddress
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-36"
                                >
                                    <DropdownMenuItem
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => router.push("/profile")}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>프로필</span>
                                    </DropdownMenuItem>
                                    {userRoleLocal === "ROLELESS" && (
                                        <DropdownMenuItem
                                            className="flex items-center space-x-2 cursor-pointer"
                                            onClick={() =>
                                                setIsUserDialogOpen(true)
                                            } // 유저 등록 다이얼로그 열기
                                        >
                                            <Pickaxe className="w-4 h-4" />
                                            <span>일꾼 등록</span>
                                        </DropdownMenuItem>
                                    )}
                                    {userRoleLocal === "WORKER" && (
                                        <DropdownMenuItem
                                            className="flex items-center space-x-2 cursor-pointer"
                                            onClick={() =>
                                                setIsFarmDialogOpen(true)
                                            } // 농장 등록 다이얼로그 열기
                                        >
                                            <Tractor className="w-4 h-4" />
                                            <span>농장 등록</span>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center space-x-2 text-red-500">
                                        <LogOut className="w-4 h-4" />
                                        <CustomLogoutButton />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <CustomLoginButton className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" />
                        )}
                    </div>
                </div>
            </div>

            {/* 유저 등록 다이얼로그 */}
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent>
                    <DialogTitle>일꾼 등록</DialogTitle>
                    <DialogDescription>
                        아래 정보를 입력하여 일꾼으로 등록하세요.
                    </DialogDescription>
                    <UserRegistrationForm
                        onClose={() => {
                            setIsUserDialogOpen(false);
                            checkUserStatus();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* 농장 등록 다이얼로그 */}
            <Dialog open={isFarmDialogOpen} onOpenChange={setIsFarmDialogOpen}>
                <DialogContent>
                    <DialogTitle>농장 등록</DialogTitle>
                    <DialogDescription>
                        아래 정보를 입력하여 농장을 등록하세요.
                    </DialogDescription>
                    <FarmRegistrationForm
                        onClose={() => {
                            setIsFarmDialogOpen(false);
                            checkUserStatus();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* 모바일 네비게이션 */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="grid grid-cols-3 gap-1 p-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`flex flex-col items-center justify-center p-2 rounded-md
                                ${pathname === item.href
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
