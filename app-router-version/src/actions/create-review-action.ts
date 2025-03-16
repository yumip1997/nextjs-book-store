'use server'

import { revalidateTag } from "next/cache";

export async function createReviewAction(formData: FormData){

    const bookId = formData.get("bookId")?.toString();
    const content = formData.get("content")?.toString();
    const author = formData.get("author")?.toString();

    if(!content || !author){
      return;
    }

    try{
      await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`, {
        method: "POST",
        body: JSON.stringify({bookId, content, author})
      });

      // review-[bookId]를 태그 값으로 갖는 모든 fetch 재검증
      revalidateTag(`review-${bookId}`);
    }catch(error){
      console.log(error);
    }

  }