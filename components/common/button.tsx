import { Button as ShadcnButton } from "@/components/ui/button";
import classNames from "classnames";

// 버튼의 속성을 정의하는 인터페이스입니다.
interface Props extends React.ComponentPropsWithoutRef<'button'> {
    /**
     * 버튼 색상을 지정합니다 (기본값: 'black')
     */
    color?: 'black' | 'grey' | 'orange' | 'red' | 'blue' | 'green';
    /**
     * 버튼이 width: 100%여야 하는 경우 사용합니다
     */
    fullWidth?: boolean;
    /**
     * 버튼의 모드 (기본값: 'default')
     */
    viewMode?: 'default' | 'active';
}

/**
 * 버튼을 표시하기 위한 컴포넌트
 * 기본적으로 버튼은 블랙, 버튼 크기는 md를 가짐
 */
export default function Button({
    color = 'black',
    fullWidth,
    viewMode = 'default',
    children,
    className,
    ...props
}: Props) {
    return (
        <ShadcnButton
            {...props}
            className={classNames(
                className,
                `disabled:opacity-50 ${fullWidth ? 'w-full' : ''}`
                , {
                    'text-white': true,
                    'bg-black-500 hover:bg-black-600': color === 'black' && viewMode === 'default',
                    'bg-slate-300 hover:bg-slate-400': color === 'grey' && viewMode === 'default',
                    'bg-orange-500 hover:bg-orange-600': color === 'orange' && viewMode === 'default',
                    'bg-red-500 hover:bg-red-600': color === 'red' && viewMode === 'default',
                    'bg-blue-500 hover:bg-blue-600': color === 'blue' && viewMode === 'default',
                    'bg-green-500 hover:bg-green-600': color === 'green' && viewMode === 'default',
                    'bg-blue-600 hover:bg-blue-700': color === 'grey' && viewMode === 'active', // active 모드일 때 색상 변경
                })}
        >
            {children}
        </ShadcnButton>
    )
}
