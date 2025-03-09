import BookItem from "@/components/book-item";
import style from "./page.module.css";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";

// 특정 페이지의 유형을 강제로 static, dynamic으로 지정할 수 있다.
// 1. auto - 기본값 (아무것도 강제하지 않은)
// 2. force-static - 해당 페이지를 강제로 정적으로 생성
// 3. force-dynamic - 해당 페이지를 강제로 동적으로 생성
// 4. error - 페이지를 강제로 static 페이지로 설정 (static 페이지로 설정하면 안되는 경우 빌드 시점 에러를 발생시킨다.)
// export const dynamic = "force-static";
export const dynamic = "force-dynamic";

async function AllBooks(){
  await delay(1500);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
    , {cache: "force-cache"});  // 최초로 한번 요청 후 캐시에 저장 -> 캐시 데이터만 사용

  if(!response.ok){
    return <div>오류가 발생했습니다...</div>
  }

  const allBooks: BookData[] = await response.json();

  return <div>
    {allBooks.map((book) => (
      <BookItem key={book.id} {...book} />
    ))}
  </div>
}

async function RecoBooks(){
  await delay(3000);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`,
    {next: {revalidate: 3}}
  );

  if(!response.ok){
    return <div>오류가 발생했습니다...</div>
  }

  const recoBooks: BookData[] = await response.json();

  return <div>
    {recoBooks.map((book) => (
      <BookItem key={book.id} {...book} />
    ))}
  </div>
}


export default async function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <Suspense fallback={<BookListSkeleton count={3} />}>
          <RecoBooks />
        </Suspense>
      </section>
      <section>
        <h3>등록된 모든 도서</h3> 
        <Suspense fallback={<BookListSkeleton count={10} />}>
          <AllBooks />
        </Suspense>
      </section>
    </div>
  );
}
