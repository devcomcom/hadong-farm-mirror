"use client"

import RoleToggle from "@/components/common/role_toggle";
import { useEffect } from "react";

const Header = () => {
    const checkUserStatus = async () => {
        const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/'; // 현재 페이지가 로그인 페이지 또는 루트 페이지인지 확인
        if (!isLoginPage) {
            const response = await fetch('/api/get_auth'); // 사용자 정보를 가져오는 API 호출
            if (response.ok) {
                const userData = await response.json();
                if (!userData.isActive) {
                    alert("로그아웃 상태입니다."); // 로그아웃 상태 메시지 출력
                    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                }
            }
        }
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    return (
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
                        <li>
                            <button
                                onClick={async () => {
                                    const response = await fetch('/api/logout', {
                                        method: 'POST',
                                    });
                                    if (response.ok) {
                                        // 로그아웃 성공 시 리다이렉트 또는 상태 업데이트
                                        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                                    } else {
                                        alert("로그아웃 중 오류가 발생했습니다.");
                                    }
                                }}
                                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                로그아웃
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
