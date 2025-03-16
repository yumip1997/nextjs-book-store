import NotFound from "@/app/not-found";
import style from "./page.module.css";
import Image from "next/image"  
import { ReviewData } from "@/types";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";

// 동적 파라미터를 사용하지 않는다.
// export const dynamicParams = false;

// 정적인 파라미터를 생성하는 함수 - 1,2,3번 도서 상세 페이지를 만든다.
// 이 함수는 빌드 시점에 실행되어 정적인 파라미터를 생성한다.
export function generateStaticParams(){
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ]
}

async function BookDetail({bookId}: {bookId: string}){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`)

  if(!response.ok){
    if(response.status === 404){
      return NotFound();
    }

    return <div>오류가 발생했습니다...</div>
  }

  const book = await response.json();
  
  const {
    coverImgUrl,
    title,
    subTitle,
    author,
    publisher,
    description
  } = book
  
  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image src={coverImgUrl} alt={title} width={300} height={400} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`, {
    next: {
      tags: [`review-${bookId}`]
    }
  });
  
  if(!response.ok){
    throw new Error(`Review fetch failed :  ${response.statusText}`);
  }

  const reviews: ReviewData[] = await response.json();

  return <section>
    {reviews.map((review) => (
      <ReviewItem  key={`review-item-id=${review.id}`} {...review}/>
    ))}
  </section>
}

// 도서 상세 페이지 (Dynamic Page) 
export default async function Page({ 
  params, 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  const { id } = await params;

  return <div className={style.container}>
    <BookDetail bookId={id} />
    <ReviewEditor bookId={id}/>
    <ReviewList bookId={id} />
  </div>
 
}
