**URL 정보 받기**

1. **쿼리 스트링  → `searchParams` 사용**
    - `?key=value` 형태의 쿼리 스트링 값을 가져올 때 사용
    - 서버 컴포넌트에서 props로 전달됨
    - 예시 : `/search?q=nextjs` → `searchParams.q === "nextjs"`
    
    ```tsx
    export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
      return (
        <div>
          <h1>검색 결과</h1>
          <p>검색어: {searchParams.q}</p>
        </div>
      );
    }
    ```
    
2. **동적 경로 → `params` 사용**
    - `[slug]` 같은 동적 경로(segment) 값을 가져올 때 사용
    - 서버 컴포넌트에서 props로 전달됨
    - 파일 경로 예시 : `/app/post/[id]/page.tsx`
    - url 예시 : `/post/123` → `params.id === "123"`
    
    ```tsx
    export default function PostPage({ params }: { params: { id: string } }) {
      return (
        <div>
          <h1>게시글 ID: {params.id}</h1>
        </div>
      );
    }
    ```
    

### 데이터 패칭

---

1. **App Router의 데이터 패칭**
    
    Next.js App Router에서는 데이터 페칭이 서버 컴포넌트와 클라이언트 컴포넌트로 나뉘며, 각각의 특성에 따라 다른 방식으로 처리됩니다. 서버 컴포넌트는 정적 생성과 캐싱을 활용해 성능을 최적화하고, 클라이언트 컴포넌트는 동적 데이터와 사용자 인터랙션을 처리합니다.
    
2. **서버 컴포넌트에서 데이터 패칭** (기본 방식)
    
    서버에서 데이터를 가져오고 렌더링하는 방식으로, `async` 함수를 활용하여 데이터를 불러옵니다. Next.js는 서버 컴퍼넌트에서 호출된 `fetch` 요청을 기본적으로 정적 생성 방식으로 빌드 시점에 캐싱합니다.
    
    - 특징
        - 서버에서 데이터와 HTML을 미리 생성.
        - 기본적으로 캐싱되어 성능 최적화.
    - 예제: 서버에서 직접 데이터 가져오기
        
        ```tsx
        async function getPosts() {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts');
          return res.json();
        }
        
        export default async function PostsPage() {
          const posts = await getPosts();
        
          return (
            <div>
              <h1>Posts</h1>
              <ul>
                {posts.map((post: any) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          );
        }
        ```
        
    
3.  **클라이언트 컴포넌트에서 데이터 패칭** (useEffect 활용)
    
    서버에서 미리 데이터를 가져오는 것이 아니라, 브라우저에서 fetch 요청을 실행합니다.
    
    - 특징
        - 사용자 인터랙션이나 실시간 데이터에 적합.
        - 클라이언트에서 실행되므로 서버 부하 감소.
    - 예제: 클라이언트에서 데이터 가져오기
        
        ```tsx
        import { useEffect, useState } from "react";
        
        export default function PostsClient() {
          const [posts, setPosts] = useState<any[]>([]);
        
          useEffect(() => {
            fetch("https://jsonplaceholder.typicode.com/posts")
              .then((res) => res.json())
              .then((data) => setPosts(data));
          }, []);
        
          return (
            <div>
              <h1>Posts</h1>
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          );
        }
        ```
        
    - 사용자 인터랙션이 필요하거나 실시간 데이터가 필요한 경우 사용
    - 클라이언트에서만 실행되므로 초기 로딩이 느릴 수 있음
    

**4. 데이터 캐싱**

Next.js App Router에서 fetch는 기본적으로 데이터를 캐싱하여 성능을 최적화합니다. 두 번째 파라미터를 설정하지 않으면 { cache: "force-cache" }가 적용되어 빌드 시 정적 데이터로 저장됩니다.

- **캐싱 제어 방법:**
    - `{ cache: 'force-cache' }` (기본값): 요청 결과를 캐싱하여 재사용합니다.
    - `{ cache: 'no-store' }`: 캐싱을 비활성화하고 매 요청마다 새로운 데이터를 가져옵니다.
    - `{ next: { revalidate: 60 } }`: ISR(Incremental Static Regeneration)처럼 지정된 초 단위로 데이터를 갱신합니다.
- 예제
    
    ```tsx
    // 기본적으로 fetch 요청은 캐싱됨
    const data = await fetch('https://api.example.com/data').then(res => res.json());
    
    // 캐싱을 비활성화하고 항상 최신 데이터 가져오기
    const freshData = await fetch('https://api.example.com/data', { cache: 'no-store' }).then(res => res.json());
    
    // 60초마다 새로운 데이터를 가져오도록 설정 (ISR 방식)
    const revalidatedData = await fetch('https://api.example.com/data', { next: { revalidate: 60 } }).then(res => res.json());
    
    ```
    

1. **Request Memoization**
    
    Next.js는 서버 컴포넌트에서 동일한 URL과 옵션으로 호출된 `fetch` 요청을 **메모이제이션**하여 중복 실행을 방지합니다.
    
    - 특징
        - 동일한 URL과 옵션의 fetch 요청은 한 번만 실행.
        - 결과는 컴포넌트 간에 공유됨.
        - { cache: 'no-store' }를 사용할 경우 메모이제이션이 적용되지 않음.
        - 메모이제이션은 서버 컴포넌트에만 적용되며, 클라이언트 컴포넌트에서는 동작하지 않습니다.
    - 예제
        
        ```tsx
        const data1 = await fetch('https://api.example.com/data').then(res => res.json());
        const data2 = await fetch('https://api.example.com/data').then(res => res.json());
        
        // ✅ 위 두 개의 fetch는 동일한 요청이므로 Next.js가 내부적으로 memoization 하여 한 번만 요청이 발생
        ```
        

### Full Route Cache와 클라이언트 라우터 캐시

---

1. **Full Route Cache란?**
    
    **Full Route Cache**는 서버 측에서 생성된 페이지나 경로의 출력물(HTML과 데이터)을 캐싱하여 성능을 최적화하는 메커니즘입니다. 이는 기본적으로 **정적 생성(Static Generation)**을 지원하며, 빌드 시점에 캐시를 생성해 요청 시 빠르게 응답을 제공합니다.
    
    - **주요 특징**:
        - 빌드 시 경로별로 HTML과 데이터를 미리 생성 및 저장.
        - 서버에서 매번 렌더링하지 않고 캐시된 결과를 반환.
        - 동적 데이터가 필요할 경우 캐싱 설정을 조정 가능.
    
2. **Full Route Cache 적용 기준**
    
    Full Route Cache는 페이지가 **정적 페이지**일 때 기본적으로 적용됩니다. 이를 구분하기 위해 정적 페이지와 동적 페이지의 차이를 알아야 합니다.
    
    - **정적 페이지**:
        - 동적 데이터나 사용자 요청에 따라 내용이 변하지 않는 페이지.
        - Full Route Cache가 기본적으로 적용됨.
    - **동적 페이지**:
        - 접속 요청마다 데이터가 갱신되거나 변화가 필요한 페이지.
        - Full Route Cache가 적용되지 않음.
        - **동적 페이지로 간주되는 조건**:
            1. 캐시되지 않은 데이터 페칭({ cache: 'no-store' })을 사용하는 컴포넌트 포함
            2. 동적 함수(cookies(), headers(), searchParams)를 사용하는 경우
        
3.  **generateStaticParams를 이용한 동적 경로 캐싱**
    
    동적 경로(예: [id], [slug])를 가진 페이지를 정적 페이지로 캐싱하려면 generateStaticParams를 사용합니다.
    
    - 기본 개념
        - generateStaticParams는 빌드 시 동적 파라미터 목록을 반환하며, 해당 경로를 정적으로 생성합니다.
        - 생성된 경로는 Full Route Cache에 저장되어 성능이 최적화됩니다.
        - 동적 경로에서도 정적 생성을 가능하게 함.
    - 예제
        
        ```tsx
        // /app/posts/[id]/page.tsx
        import { notFound } from "next/navigation";
        
        async function getPost(id: string) {
          const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
          if (!res.ok) return null;
          return res.json();
        }
        
        export async function generateStaticParams() {
          return [
            { id: "1" },
            { id: "2" },
            { id: "3" },
          ];
        }
        
        export default async function PostPage({ params }: { params: { id: string } }) {
          const post = await getPost(params.id);
        
          if (!post) {
            notFound();
          }
        
          return (
            <div>
              <h1>{post.title}</h1>
              <p>{post.body}</p>
            </div>
          );
        }
        ```
        
        - **generateStaticParams**: 빌드 시 호출되며, /posts/1, /posts/2, /posts/3 경로를 생성.
        - **Full Route Cache**: 생성된 경로의 HTML과 데이터가 캐싱됨.
        - **제한**: 정의되지 않은 경로(예: /posts/4)는 동적으로 렌더링되며 캐싱되지 않음.

1. **라우트 세그먼트 옵션**
    
    페이지의 캐싱 동작을 개발자가 직접 제어할 수 있는 옵션입니다. 파일 상단에 export const dynamic와 같은 변수를 선언해 설정합니다.
    
    - **옵션 종류**:
        1. **auto** (기본값): 페이지 내용에 따라 자동으로 정적/동적 결정.
        2. **force-static**: 페이지를 강제로 정적 페이지로 생성, Full Route Cache 적용.
        3. **force-dynamic**: 페이지를 강제로 동적 페이지로 설정, 캐싱 비활성화.
        4. **error**: 정적 페이지로 설정하면 안 되는 경우 빌드 시 에러 발생.
    - **예제**
        
        ```tsx
        export const dynamic = "force-static";
        
        export default async function StaticPage() {
          const data = await fetch("https://api.example.com/data").then((res) => res.json());
          return <div>{data.title}</div>;
        }
        ```
        

1. **클라이언트 라우터 캐시 (Client-Side Router Cache)**
    
    클라이언트 라우터 캐시는 서버 측 Full Route Cache와 달리, **클라이언트 측에서 동작**하며 Next.js의 next/link를 통해 페이지 간 이동 시 데이터를 캐싱합니다.
    
    - 기본 개념
        - 클라이언트 측에서 방문한 페이지의 데이터와 React Server Component Payload를 메모리에 저장.
        - 페이지 이동 시 네트워크 요청 없이 캐시된 데이터를 재사용해 빠른 내비게이션을 제공.
    - 동작 방식
        - **캐싱 대상**: 서버 컴포넌트의 렌더링 결과와 fetch 데이터.
        - **유지 기간**: 브라우저 세션 동안 유지되며, 새로고침 시 초기화됨.
        - **제한**: 동적 데이터({ cache: 'no-store' })는 캐싱되지 않음.
    - 예제
        
        ```tsx
        // /app/client-page/page.tsx
        "use client";
        import Link from "next/link";
        
        export default function ClientPage() {
          return (
            <div>
              <h1>Client Page</h1>
              <Link href="/posts/1">Go to Post 1</Link>
            </div>
          );
        }
        ```
        
        - /posts/1로 이동 후 뒤로 가기를 하면, 클라이언트 라우터 캐시 덕분에 즉시 이전 페이지가 표시됨.
    - 캐시 제어
        - **revalidatePath 또는 revalidateTag**: 서버에서 캐시를 갱신하면 클라이언트 캐시도 업데이트 가능.
        - **새로고침**: 캐시를 무효화하고 서버에서 새 데이터를 가져옴.

### 스트리밍

1. 페이지 스트리밍
    
    서버에서 클라이언트로 HTML을 점진적으로 전송하는 기능입니다. 특히 비동기 데이터 fetching이 완료되기 전에 기본 UI를 먼저 렌더링 할 수 있습니다.
    
    - 스트리밍 설정 방법
        - page.tsx와 같은 경로에 loading.tsx 추가
        - loading.tsx: 비동기 작업이 완료될 때까지 표시될 로딩 상태 정의
        - page.tsx가 async 함수로 되어있어야 스트리밍 동작
    - 예제
        
        ```tsx
        // app/dashboard/page.tsx
        export default async function DashboardPage() {
          const data = await fetch("https://api.example.com/data").then(res => res.json());
          return <div>{data.message}</div>;
        }
        
        // app/dashboard/loading.tsx
        export default function Loading() {
          return <div>로딩 중...</div>;
        }
        ```
        
        - /dashboard 경로에 접근하면 데이터가 로드되기 전 "로딩 중..."이 먼저 표시
        - 데이터가 준비되면 페이지 콘텐츠로 대체
    - 주의사항
        - 컴퍼넌트 별 세밀한 스트리밍 불가: 페이지 단위로만 적용 → 개별 컴퍼넌트에 세밀한 로딩 상태를 제어하려면 Suspense 사용 필요
        - 하위 페이지에도 자동으로 적용: 상위 경로에 loading.tsx가 있으면 하위 경로에도 자동 적용
        - async가 붙은 페이지만 적용
        - 쿼리 스트링 변경 시 미적용: URL의 쿼리 스트링만 변경되는 경우 스트리밍이 트리거 되지 않음
    
2. 컴퍼넌트 스트리밍
    
    React의 Suspense를 활용해 개별 컴포넌트의 비동기 로딩을 관리하는 방법입니다. 페이지 전체가 아닌 특정 컴포넌트의 데이터 fetching을 기다리는 동안 대체 Skeleton과 같은 대체 UI를 표시할 수 있습니다.
    
    - 설정 방법
        - Suspense 컴포넌트로 로딩을 적용하고 싶은 컴포넌트 깜싸기
        - fallback 속서에 로딩 중 표시될 UI(보통 Skeleton) 정의
3. 에러 핸들링
    
    페이지나 컴포넌트에서 발생한 예외를 잡아 사용자에게 적절한 에러 UI 표시
    
    - 설정 방법
        - error.tsx 파일을 페이지와 동일한 경로에 추가
    - 주의 사항
        - error.tsx는 클라이언트 컴포넌트여야함 → “use client” 지시어 추가 필요
        - 하위 페이지에도 자동 적용:  위 경로의 error.tsx가 하위 경로에도 적용 → 하위 경로에 별도의 error.tsx를 추가하면 커스텀 핸들링 가능
        - 레이아웃 범위 제한: 에러 핸들링은 같은 경로에 있는 layout.tsx 까지만 영향
        - 현재 자기와 같은 경로에 있는 layout 까지만 error 핸들링함

### 서버 액션

1. 서버액션
    
    클라이언트에서 서버 측 로직을 직접 호출할 수 있도록 해주는 매커니즘입니다. 별도의 API end-point를 만들지 않고도 서버에서 실행되는 함수를 정의하고 호출할 수 있습니다. 주로 formData 제출, 인증 처리 등에 활용됩니다. 
    
    - 설정 방법
        - 파일 또는 함수에 `use server` 추가
    - 예제
        
        ```tsx
        'use server'
        
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
        ```
        
        ```tsx
        export default function ReviewEditor({ bookId }: { bookId: string }) {
          return (
            <section>
              <form
                className={style.form_container}
                action={createReviewAction}
              >
                <input name="bookId" value={bookId} hidden readOnly/>
                <textarea required name="content" placeholder="리뷰 내용" />
                <div className={style.submit_container}>
                  <input required name="author" placeholder="작성자" />
                  <button type="submit">작성하기</button>
                </div>
              </form>
            </section>
          );
        }
        ```
        

2. 재검증

캐시된 데이터를 갱신하는 매커니즘으로 `revalidatePath` 또는 `revalidateTag`로 이루어집니다.

- revalidatePath 기반 유형
    
    revalidatePath는 주로 풀라우트 캐시(Full Route Cache)에 영향을 주며, 경로 단위로 캐시를 무효화합니다.
    
    - **특정 주소의 페이지만 재검증**
        - `revalidatePath('/blog/post-1')` : /blog/post-1 경로의 풀라우트 캐시가 무효화 →  다음 요청 시 새로 생성
    - **특정 경로의 모든 동적 페이지를 재검증**
        - `revalidatePath('/blog/[slug]', 'page')`
    - **특정 레이아웃을 갖는 모든 페이지 재검증**
        - `revalidatePath('/', 'layout')`
    - 전체 페이지 대상 재검증
        - `revalidatePath('/', 'page')` : 모든 경로의 풀라우트 캐시가 무효화
- revalidateTag 기반 유형
    
    revalidateTag는 데이터 캐시(Data Cache)에 영향을 주며, 태그 단위로 캐시를 무효화합니다. 풀라우트 캐시에는 영향을 주지 않기에 페이지 자체는 갱신되지 않을 수 있습니다.
    
    ```tsx
    // 데이터 페칭 시 태그 지정
    await fetch('https://api.example.com/data', {
      cache: 'force-cache',
      next: { tags: ['posts'] },
    });
    
    // 태그로 재검증
    revalidateTag('posts');
    ```
    
    - posts 태그가 붙은 데이터 캐시가 무효화되고, 다음 요청 시 새 데이터로 갱신
