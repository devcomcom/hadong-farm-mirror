'use client';

import { Input as ShadcnInput } from "@/components/ui/input";
import classNames from "classnames";

// 입력 필드의 속성을 정의하는 인터페이스입니다.
interface Props extends React.ComponentPropsWithoutRef<'input'> {
    /**
     * 입력 필드의 크기를 지정합니다. (기본값: 'md')
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * 입력 필드의 색상을 지정합니다. (기본값: 'black')
     */
    color?: 'black' | 'grey' | 'red' | 'white';
    /**
     * 입력 필드가 비활성화 상태인지 여부를 지정합니다.
     */
    disabled?: boolean;
    /**
     * input width: 100%여야 하는 경우 사용합니다
     */
    fullWidth?: boolean;
}

/**
 * 입력 필드를 표시하기 위한 컴포넌트
 */
export default function Input({
    size = 'md',
    color = 'black',
    disabled = false,
    fullWidth = false,
    className,
    ...props
}: Props) {
    return (
        <ShadcnInput
            {...props}
            disabled={disabled}
            className={classNames(
                className,
                fullWidth ? 'w-full' : '',
                {
                    'border-gray-300': color === 'grey',
                    'border-red-500': color === 'red',
                    'border-black': color === 'black',
                    'bg-white': color === 'white',
                },
                {
                    'h-8 text-sm': size === 'sm',
                    'h-9 text-base': size === 'md',
                    'h-10 text-lg': size === 'lg',
                }
            )}
        />
    );
}
