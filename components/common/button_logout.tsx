'use client';

// Clerk 라이브러리에서 인증 관련 훅을 가져옵니다.
import { useClerk } from '@clerk/nextjs';
// 재사용 가능한 버튼 컴포넌트를 가져옵니다.
import Button from './button';

// 사용자 정의 로그아웃 버튼 컴포넌트입니다.
const CustomLogoutButton = () => {
    // Clerk의 signOut 메서드를 사용하여 로그인 창을 엽니다.
    const { signOut } = useClerk();

    return (
        // 버튼 클릭 시 기본 동작을 방지하고 로그인 창을 엽니다.
        <Button onClick={(event) => { event.preventDefault(); signOut(); }} color="red">
            로그아웃
        </Button>
    );
};

// 이 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default CustomLogoutButton;