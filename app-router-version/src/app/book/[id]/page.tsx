import NotFound from "@/app/not-found";
import style from "./page.module.css";
import Image from "next/image"  

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

// 도서 상세 페이지 (Dynamic Page) 
export default async function Page({ 
  params, 
}: { 
  params: Promise<{ id: string | string[] }> 
}) {
  
  const { id } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`)

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
    <div className={style.container}>
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
    </div>
  );
}
