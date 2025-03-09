"use client"

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react"

export default function Error({
    error,
    reset,
}: {
    error: Error,
    reset: () => void
}){

    const router = useRouter();
    
    useEffect(() => {
        console.log(error.message)
    }, [error]);

    return (
        <div>
            <h3>오류가 발생했습니다.</h3>
            <button onClick={() => {
                      startTransition(() => {
                        router.refresh();   // 현재 페이지에 필요한 서버 컴퍼넌트를 다시 불러옴
                        reset();    // 에러 상태를 초기화, 컴퍼넌트를 다시 랜더링
                    })
            }}>다시시도</button>
        </div>
    )
}