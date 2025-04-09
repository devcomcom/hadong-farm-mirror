'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Button from '@/components/common/button'
import Input from '@/components/common/input'
import Text from '@/components/common/text'

export default function UnSafePage() {
    const { user } = useUser()
    const [role, setRole] = useState<string>('')

    useEffect(() => {
        if (user) {
            setRole(user.unsafeMetadata.role as string || '')
            alert(`로그인한 유저 이메일: ${user.emailAddresses[0].emailAddress}`); // 로그인한 유저 이메일 출력
        }
    }, [user])

    return (
        <div className='flex justify-center items-center h-96'>
            <div className='flex flex-col gap-2 p-6 bg-white shadow-lg rounded-lg'>
                <Text className='text-lg font-semibold'>역할(unsafeMetadata)</Text>
                <Input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className='border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200 transition'
                />
                <div className='flex justify-center items-center'>
                    <Button
                        color='blue'
                        onClick={() => {
                            user?.update({
                                unsafeMetadata: { role },
                            })
                            alert('역할 업데이트 완료');
                        }}
                        className='w-full py-2 rounded-lg hover:bg-blue-700 transition duration-200'
                    >
                        역할 업데이트
                    </Button>
                </div>
            </div>
        </div>
    )
}