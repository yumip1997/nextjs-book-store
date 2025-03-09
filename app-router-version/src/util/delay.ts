export async function delay(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}  // 데이터를 불러오는 동안 지연 시간을 줄 수 있는 함수    
