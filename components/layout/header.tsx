"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import CustomLogoutButton from "@/components/common/button_logout";
import CustomLoginButton from "@/components/common/button_login";
import { useAuth, useUser } from "@clerk/nextjs";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import { Home, Search, User, LogOut } from "lucide-react";

const Header = () => {
    const [userRoleLocal, setUserRoleLocal] = useState<string | null>(null);
    const { setRole, setUserId } = useAuthStore();
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkUserStatus = async () => {
        const isLoginPage = pathname === "/";

        if (isSignedIn) {
            try {
                const email = user?.emailAddresses[0].emailAddress;
                const response = await fetch(`/api/get_auth?email=${encodeURIComponent(email as string)}`);

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
        { href: "/job_feed", label: "구해요", icon: <Search className="w-4 h-4" /> },
        { href: "/worker_feed", label: "갈게요", icon: <Search className="w-4 h-4" /> },
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
                                                : "hover:bg-gray-50"}`}
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
                                {userRoleLocal === "FARMER" ? "농장주" : "일손"}
                            </span>
                        )}

                        {isSignedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden
                                    bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90 transition-opacity">
                                    <span className="text-lg font-medium">
                                        {user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => router.push("/profile")}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>프로필</span>
                                    </DropdownMenuItem>
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

            {/* 모바일 네비게이션 */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="grid grid-cols-4 gap-1 p-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`flex flex-col items-center justify-center p-2 rounded-md
                                ${pathname === item.href
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"}`}
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
