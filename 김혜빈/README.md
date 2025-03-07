### 0305 TIL

# Page Router

Next.js의 Page Router는 파일 시스템 기반 라우팅 방식을 사용한다. 폴더와 파일 이름을 기반으로 애플리케이션의 경로가 결정된다.

## 기본 라우팅 원리

- `pages` 디렉토리의 파일 구조가 URL 경로와 직접 매핑된다.
- 예: `pages/about.js` 파일은 `/about` URL에 매핑된다.

## 동적 라우팅

특정 패턴의 경로를 하나의 페이지로 처리할 수 있다:

- 대괄호(`[]`)를 사용하여 동적 경로 세그먼트를 정의한다.
- 예를 들어, `search/1`로 이동하려면 `pages/search/[id].js` 파일을 생성한다.

## 동적 라우팅 파라미터 접근 방법

동적 URL 파라미터에 접근하는 여러 방법이 있다:

```jsx
// pages/search/[id].js
import { useRouter } from 'next/router';

function SearchPage() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Search ID: {id}</div>;
}

export default SearchPage;

```

## 중첩 동적 라우팅

더 복잡한 경로도 처리할 수 있다:

- `pages/products/[category]/[item].js` 형태로 중첩 동적 라우팅을 구현할 수 있다.
- 이 경우 `/products/electronics/laptop`과 같은 URL에 매핑된다.

## 선택적 캐치올 라우트

- `pages/[[...slug]].js`처럼 선택적 캐치올 라우트를 구현할 수 있다.
- 이렇게 하면 `/`, `/about`, `/products` 등 다양한 경로를 하나의 페이지에서 처리할 수 있다.

## 쿼리 파라미터 방식

Next.js에서는 URL의 쿼리 파라미터를 활용한 라우팅도 지원한다:

- `pages` 디렉토리에 일반 페이지(예: `search/index.js`)를 생성하고 URL 쿼리 문자열을 통해 데이터를 전달할 수 있다.
- 이 방식은 `?key=value` 형태로 여러 파라미터를 전달할 때 유용하다.
- `useRouter` 훅의 `router.query` 객체를 통해 쿼리 파라미터에 접근할 수 있다.

```jsx
// pages/search/index.js
import { useRouter } from 'next/router';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;  // URL이 /search?q=nextjs일 경우, q는 'nextjs'

  return <div>검색어: {q}</div>;
}

```

## 쿼리 파라미터 vs 동적 라우트

- 쿼리 파라미터: `/search?q=nextjs&page=1` 형태로 여러 파라미터를 전달할 때 적합
- 동적 라우트: `/search/nextjs` 같이 URL 경로 자체가 중요할 때 적합

### 쿼리 파라미터의 장점

- 검색, 필터링, 페이지네이션과 같이 여러 파라미터를 조합해야 할 때 유용하다.
- SEO나 URL 구조가 중요하지 않은 경우 더 간단하게 구현할 수 있다.
- 파라미터 변경 시 페이지 전체를 다시 로드하지 않고도 상태를 업데이트할 수 있다.

# Prefetch

Next.js는 성능 최적화를 위해 기본적으로 페이지 프리페칭 기능을 제공한다.

## 프리페칭이란?

프리페칭은 현재 페이지에서 연결될 가능성이 있는 페이지의 JavaScript 번들을 미리 로드하는 기술이다. 이를 통해 사용자가 링크를 클릭했을 때 페이지 로딩 시간을 크게 단축할 수 있다.

## 프리페칭이 필요한 이유

Next.js는 성능 최적화를 위해 현재 필요한 페이지의 JavaScript 번들만 로드한다. 프리페칭 없이는 사용자가 새 페이지로 이동할 때 해당 페이지의 번들을 그때서야 다운로드하게 되어 로딩 지연이 발생한다.

## 프리페칭 작동 방식

- Next.js는 `<Link>` 컴포넌트가 뷰포트에 나타나면 자동으로 해당 링크의 페이지를 프리페치한다.
- 프로덕션 빌드에서만 작동하며, 개발 모드에서는 프리페칭이 적용되지 않는다.

## 확인 방법

- 개발 모드(`npm run dev`)에서는 프리페치 동작을 확인할 수 없다.
- 프로덕션 빌드 후 실행해야 프리페치 동작을 확인할 수 있다:
    
    ```bash
    npm run buildnpm run start
    
    ```
    
- 브라우저 개발자 도구의 네트워크 탭에서 프리페치된 JavaScript 파일을 확인할 수 있다.

## 자동 vs 수동 프리페칭

- `<Link>` 컴포넌트는 자동으로 프리페칭을 처리한다:
    
    ```jsx
    import Link from 'next/link';
    
    function NavLinks() {
      return (
        <nav>
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
        </nav>
      );
    }
    ```
    
- `router.push()`와 같은 JavaScript 함수로 라우팅을 구현한 경우에는 프리페칭이 자동으로 이루어지지 않는다. 이런 경우 `router.prefetch()`를 사용해 수동으로 프리페칭을 구현해야 한다:
    
    ```jsx
    import { useRouter } from 'next/router';
    import { useEffect } from 'react';
    
    function MyComponent() {
      const router = useRouter();
    
      useEffect(() => {
        router.prefetch('/test');
      }, []);
    
      return (
        <button onClick={() => router.push('/test')}>
          Go to Test Page
        </button>
      );
    }
    ```
    

## 프리페칭 비활성화

필요한 경우 `<Link>` 컴포넌트의 프리페칭을 비활성화할 수 있다:

```jsx
<Link href="/about" prefetch={false}>About</Link>
```

## 프리페칭 제한 사항

- 프리페칭은 프로덕션 환경에서만 작동한다.
- 사용자가 느린 연결이나 데이터 절약 모드를 사용하는 경우 브라우저가 프리페칭을 제한할 수 있다.
- 모바일 장치에서는 배터리 절약 등의 이유로 프리페칭이 제한될 수 있다.

# API Route

Next.js의 API Route는 서버리스 함수를 쉽게 만들 수 있는 기능이다.

## 기본 사용법

- `pages/api` 폴더에 파일을 만들어 API 엔드포인트를 정의한다.
- 예: `pages/api/hello.js` 파일은 `/api/hello` URL에 매핑된다.

```jsx
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}
```

## HTTP 메서드 처리

```jsx
jsx
Copy
export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET': res.status(200).json({ users: ['John', 'Jane'] }); break;
    case 'POST': res.status(201).json({ message: '사용자 생성 완료' }); break;
    default: res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

## 동적 API 라우트

- `pages/api/users/[id].js` 형식으로 동적 라우트를 만들 수 있다.
- URL 파라미터는 `req.query`로 접근한다.

## API Route의 장점

- 별도의 백엔드 서버가 필요 없다.
- API 키 같은 민감한 정보를 안전하게 사용할 수 있다.
- 프론트엔드와 백엔드를 한 프로젝트에서 관리할 수 있다.

### 0304 TIL

# CSS 모듈화

Next.js는 스타일 충돌을 방지하기 위해 CSS를 다루는 방식이 특별하다.

## 글로벌 스타일의 제한

- Next.js는 `app.tsx` 외의 컴포넌트에서 `style.tsx`를 직접 import하는 것을 불허한다.
- 사유: 글로벌 스타일만 특정 위치에서 허용하고, 그 외에서는 스타일 충돌을 방지하기 위함이다.

## CSS 모듈 사용법

- CSS를 모듈화하여 컴포넌트별로 분리해서 사용한다.
- 예시:

```jsx
jsx
Copy
// index.module.css 파일 생성
// 컴포넌트에서 모듈 import
import style from "./index.module.css"

// JSX에서 클래스 적용
<h1 className={style.h1}>인덱스</h1>

```

## 장점

- 유니크한 클래스명이 자동으로 생성되어 스타일이 충돌하지 않는다.
- 컴포넌트 단위로 스타일을 관리할 수 있다.
- 코드 유지보수가 쉬워진다.

### 0306 TIL

# Next.js의 레이아웃 구현 방법

Next.js에서는 레이아웃을 효과적으로 구현하기 위한 다양한 패턴이 있다. 레이아웃은 여러 페이지에서 공통으로 사용되는 UI 요소를 효율적으로 관리할 수 있게 해준다.

## GlobalLayout

글로벌 레이아웃은 애플리케이션의 모든 페이지에 적용되는 공통 레이아웃이다. 주로 네비게이션 바, 푸터 등과 같이 모든 페이지에서 일관되게 표시되어야 하는 요소들을 포함한다.

### 구현 방법

글로벌 레이아웃은 `_app.tsx` 파일을 통해 구현할 수 있다:

```jsx
// components/global-layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

```

```jsx
// pages/_app.tsx
import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalLayout>
      <Component {...pageProps} />
    </GlobalLayout>
  );
}

```

이 방식의 장점:

- 전체 애플리케이션에 일관된 UI를 제공한다.
- 공통 요소(네비게이션, 푸터 등)의 중복 코드를 제거할 수 있다.
- 전역 상태나 테마 컨텍스트를 모든 페이지에 제공하기 용이하다.

## PageLayout

페이지별 레이아웃은 특정 페이지나 페이지 그룹에만 적용되는 레이아웃이다. 예를 들어, 대시보드 페이지들은 사이드바가 필요하지만 랜딩 페이지는 다른 레이아웃이 필요할 수 있다.

### 구현 방법

페이지별 레이아웃은 각 페이지 컴포넌트에 `getLayout` 함수를 추가하여 구현할 수 있다:

```jsx
// components/dashboard-layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">{children}</div>
    </div>
  );
}

```

```jsx
// pages/dashboard.tsx
import DashboardLayout from '@/components/dashboard-layout';
import { ReactNode } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>
      {/* 페이지 콘텐츠 */}
    </div>
  );
}

// getLayout 함수 정의
DashboardPage.getLayout = function getLayout(page: ReactNode) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

```

이 패턴을 지원하려면 `_app.tsx`를 다음과 같이 수정해야 한다:

```jsx
// pages/_app.tsx
import GlobalLayout from "@/components/global-layout";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const getLayout =
    Component.getLayout ?? ((page: ReactNode) => page);

  return (
    <GlobalLayout>
      {getLayout(<Component {...pageProps} />)}
    </GlobalLayout>
  );
}

```

이 방식의 장점:

- 페이지별로 다른 레이아웃을 적용할 수 있다.
- 레이아웃 컴포넌트를 재사용하면서도 페이지마다 유연하게 조합할 수 있다.
- 중첩된 레이아웃을 쉽게 구현할 수 있다.

### 중첩 레이아웃 예시

여러 레이아웃을 중첩하여 사용하는 방법:

```jsx
// pages/dashboard/settings.tsx
import DashboardLayout from '@/components/dashboard-layout';
import SettingsLayout from '@/components/settings-layout';
import { ReactNode } from 'react';

export default function SettingsPage() {
  return (
    <div>
      <h2>설정</h2>
      {/* 설정 페이지 콘텐츠 */}
    </div>
  );
}

// 중첩된 레이아웃 적용
SettingsPage.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <SettingsLayout>{page}</SettingsLayout>
    </DashboardLayout>
  );
};

```

## 주의사항

- Page Router 방식에서는 위 패턴을 사용해야 하지만, App Router 방식에서는 레이아웃을 더 쉽게 구현할 수 있다.
- 페이지별 레이아웃을 사용할 때, TypeScript를 사용한다면 타입 확장이 필요하다(예시처럼 `NextPageWithLayout` 타입 정의).
- 레이아웃 컴포넌트는 가능한 순수하게 유지하고, 데이터 fetching 로직은 페이지 컴포넌트에 두는 것이 좋다.
