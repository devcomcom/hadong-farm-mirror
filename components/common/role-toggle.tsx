"use client"

import { useAuthStore } from "@/stores/auth";

// 누락된 컴포넌트들을 import 합니다.
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";  // 컴포넌트가 정의된 경로로 수정하세요.
import { Button } from "@/components/ui/button";  // 컴포넌트가 정의된 경로로 수정하세요.

const RoleToggle: React.FC = () => {
    // useAuthStore를 사용하여 현재 역할 상태를 관리합니다.
    const { userRole, setRole } = useAuthStore();

    return (
        <div className="flex items-center space-x-2">
            <span className="font-medium">현재 역할:</span>
            <span className="text-blue-600 font-bold">{userRole}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">역할 전환</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setRole("FARMER")}>농장주</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRole("WORKER")}>근로자</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default RoleToggle; 