import BookItem from "@/components/book-item";
import style from "./page.module.css";
import { BookData } from "@/types";

// 특정 페이지의 유형을 강제로 static, dynamic으로 지정할 수 있다.
// 1. auto - 기본값 (아무것도 강제하지 않은)
// 2. force-static - 해당 페이지를 강제로 정적으로 생성
// 3. force-dynamic - 해당 페이지를 강제로 동적으로 생성
// 4. error - 페이지를 강제로 static 페이지로 설정 (static 페이지로 설정하면 안되는 경우 빌드 시점 에러를 발생시킨다.)
// export const dynamic = "force-static";

async function AllBooks(){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
    , {cache: "force-cache"});

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
        <RecoBooks />
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <AllBooks />
      </section>
    </div>
  );
}
