'use server'

import { revalidatePath } from "next/cache";

export async function createReviewAction(formData: FormData){

    const bookId = formData.get("bookId")?.toString();
    const content = formData.get("content")?.toString();
    const author = formData.get("author")?.toString();

    console.log(bookId, content, author);

    if(!content || !author){
      return;
    }

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`, {
        method: "POST",
        body: JSON.stringify({bookId, content, author})
      });

      console.log(response.status);
    //   revalidatePath(`/book/${bookId}`);    //재검증 -> 풀 라우트 캐시, 데이터 캐시 purge(숙청) 됨
    }catch(error){
      console.log(error);
    }

  }