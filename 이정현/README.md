# [3/4 TIL] 프론트엔드 테스팅 도구

### 단위 테스트 (Unit Testing) : 개별 함수, 모듈, 컴포넌트 단위의 테스트

- **Jest**

  - 가장 널리 쓰이는 Javascript 테스트 프레임워크
  - 내장된 Mock 기능을 통해 각 컴포넌트나 함수의 동작을 쉽게 테스트할 수 있음

  ```jsx
  /* Jest로 테스트 코드 작성하기 */

  /* add.js 파일 예시 */

  const add = (a, b) => a + b;

  export default add;
  ```

  ```jsx
  /* add.test.js 파일 예시 */

  import add from './add';

  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  ```

  ```jsx
  /* Input 컴포넌트 테스트 예시 */

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import 'jest-styled-components';

  import { Input } from 'Components/Input';

  describe('<input />', () => {
    it('render component correctly', () => {
      const { container } = render(<Input value="default value" />);
      // 1
      const input = screen.getByDisplayValue('default value');
      // 2
      expect(input).toBeInTheDocument();

      expect(container).toMatchSnapshot();
    });
  });
  ```

### 1. **기본 구조**

Jest에서는 **`describe`**, **`it`** (혹은 **`test`**)를 사용하여 테스트를 구성

- **`describe`**: 테스트 스위트
  테스트 그룹을 묶는 용도로 사용, 여러 개의 테스트를 그룹화할 때 유용함
- **`it`** (혹은 **`test`**): 개별 테스트
  하나의 테스트 케이스를 정의하는 함수

### 2. **매처(Matcher)**

Jest는 **`expect`** 구문과 함께 **매처**를 사용하여 예상되는 값을 비교

- **`toBe()`**: 값이 정확히 일치하는지 확인 (`===` 비교)
- **`toEqual()`**: 값이 동일한지 비교 (주로 객체나 배열 비교 시 사용)
- **`toBeTruthy()` / `toBeFalsy()`**: 값이 **truthy**나 **falsy**인지 확인
- **`toBeNull()`**: 값이 `null`인지 확인
- **`toBeUndefined()`**: 값이 `undefined`인지 확인
- **`toBeGreaterThan()`** / **`toBeLessThan()`**: 값이 특정 범위 내에 있는지 확인

### 3. **비동기 테스트**

`done` 콜백 등을 사용하여 비동기 코드를 테스트

```jsx
it('비동기 호출 테스트', async () => {
  const data = await fetchData();
  expect(data).toEqual({ name: 'John', age: 30 });
});
```

```jsx
it('콜백 기반 비동기 테스트', (done) => {
  fetchDataWithCallback((data) => {
    expect(data).toEqual({ name: 'John', age: 30 });
    done();
  });
});
```

### 컴포넌트 테스트 (Component Testing) : UI 컴포넌트 테스트

- **React Testing Library**

  - DOM 조작 기반 사용자 관점에서 컴포넌트 테스트
  - Jest와 함께 사용

  ```jsx
  /* 버튼을 누르면 값이 증가, 감소하는 기능을 가진 Counter컴포넌트의 테스트 */

  const Counter = () => {
    const [number, setNumber] = useState(0);

    const onIncrease = useCallback(() => {
      setNumber(number + 1);
    }, [number]);

    const onDecrease = useCallback(() => {
      setNumber(number - 1);
    }, [number]);

    return (
      <div>
        <h2>{number}</h2>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
      </div>
    );
  };

  export default Counter;
  ```

  ```jsx
  describe('<Counter />', () => {
    it('스냅샷 테스팅', () => {
      const utils = render(<Counter />);
      expect(utils.container).toMatchSnapshot();
    });

    it('버튼과 숫자가 있는지 확인하는 테스트', () => {
      const { getByText } = render(<Counter />);
      expect(getByText('0')).toBeTruthy();
      expect(getByText('+1')).toBeTruthy();
      expect(getByText('-1')).toBeTruthy();
    });

    it('plus 버튼 기능 테스트', () => {
      const utils = render(<Counter />);
      const number = utils.getByText('0');
      const plusButton = utils.getByText('+1');
      // 클릭 이벤트 두 번 발생시키기
      fireEvent.click(plusButton);
      fireEvent.click(plusButton);

      expect(number).toHaveTextContent('2'); // jest-dom 확장 matcher 사용
      expect(number.textContent).toBe('2'); // textContent를 직접 비교
    });

    it('minus 버튼 기능 테스트', () => {
      const utils = render(<Counter />);
      const number = utils.getByText('0');
      const minusButton = utils.getByText('-1');
      // 클릭 이벤트 두 번 발생시키기
      fireEvent.click(minusButton);
      fireEvent.click(minusButton);
      expect(number).toHaveTextContent('-2');
    });
  });
  ```

### 엔드 투 엔드 테스트 (E2E Testing) : 실제 사용자 흐름을 시뮬레이션하여 전체 애플리케이션을 테스트

- **Playwright**
  - 크로스 브라우저 테스트 도구
  - 여러 브라우저에서 자동 테스트 지원
  - 모바일 시뮬레이션 및 성능 테스트 가능

```jsx
// tests/e2e/login.test.js
const { test, expect } = require('@playwright/test');

test('로그인 테스트', async ({ page }) => {
  // 1. 로그인 페이지로 이동
  await page.goto('https://example.com/login');

  // 2. 로그인 정보 입력
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');

  // 3. 로그인 버튼 클릭
  await page.click('#login-button');

  // 4. 로그인 후 대시보드 페이지로 리디렉션되는지 확인
  await expect(page).toHaveURL('https://example.com/dashboard');
  await expect(page.locator('h1')).toHaveText('Welcome to your dashboard');
});
```

<br><br><br><br><br>

# [3/5 TIL] Mock Service Worker

### MSW(Mock Service Worker)란?

서비스 워커(Service Worker)를 사용하여 네트워크 호출을 가로채는 API 모킹(mocking) 라이브러리

➡ 백엔드 API인 척하면서 가짜 데이터를 응답

- API 개발과 UI 개발이 동시에 진행되는 경우, 백엔드 API 구현이 완료될 때까지 프론트엔드 팀에서 사용하기 위한 가짜 API를 서비스 워커로 돌림
- 테스트 실행 시 실제 API에 네트워크 호출을 하는 대신 훨씬 빠르고 안정적인 가짜 API 서버를 구축하기 위해서도 사용
- 모킹이 네트워크 단에서 일어나기 때문에 실제 API와 통신하는 것과 크게 다르지 않다
  ⇒ 실제 API로 대체하는 것이 쉽다

### Service Worker

브라우저로부터 나가는 요청이나 들어오는 응답을 중간에서 감시하거나 변조, 캐싱과 같은 기존에 웹에서 할 수 없었던 부가적인 작업들을 할 수 있다.

## 1. 요청 핸들러 작성

- 모킹 관련 코드는 mocks 폴더 아래에
- 모킹 시 msw 모듈의 rest 객체 사용

```jsx
/* /src/mocks/handler.js */

import { rest } from 'msw';

const todos = ['먹기', '자기', '놀기'];

export const handlers = [
  // 할일 목록
  rest.get('/todos', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todos));
  }),

  // 할일 추가
  rest.post('/todos', (req, res, ctx) => {
    todos.push(req.body);
    return res(ctx.status(201));
  }),
];
```

## **2. 서비스 워커 생성**

- msw 모듈에서 제공하는 `setupWorker()` 함수를 사용해서 서비스 워커를 생성
- 핸들러 코드를 `setupWorker()` 의 인자로 넘겨줌

```jsx
/* /src/mocks/worker.js */

import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

## **3. 서비스 워커 삽입**

- entrtpoint에 서비스 워커 구동 코드를 삽입

```jsx
/* /src/index.js */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { worker } from './mocks/worker';
if (process.env.NODE_ENV === 'development') {
  worker.start();
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## **4. 서비스 워커 테스트**

- API 요청 테스트 (예시: fetch())

```jsx
fetch('/todos')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

<br><br><br><br><br>

# [3/6 TIL] 코드 스플리팅(Code Splitting)

> 애플리케이션 JacaScript 번들을 여러 개의 작은 청크로 나눠 로딩 성능을 개선하는 기술

- 초기 로딩 시간 줄임
- 필요할 때만 필요한 코드를 동적으로 불러옴

# Why?

1. 초기 로딩 속도 개선
   - 애플리케이션이 커질수록 큰 번들 파일로 모든 코드를 로드하는 것은 페이지 로딩 시간을 길게 만듬
   - 필요한 코드만 먼저 로딩하고, 나머지 코드는 나중에 로드할 수 있게 되어 첫 화면 렌더링 시간을 단축할 수 있음
2. 더 나은 사용자 경험
   - 필요하지 않은 코드를 처음부터 로드하지 않고 사용자가 실제로 요청한 페이지, 기능에 필요한 코드만 로드하여, 불필요한 네트워크 대역폭을 줄이고 애플리케이션 반응성을 높임

## 1. 엔트리 포인트 기반 코드 스플리팅 (Entry Points)

- 애플리케이션의 각 엔트리 포인트에 대해 번들을 나누는 방식
- 홈 페이지, 프로필 페이지가 각각 다른 엔트리 포인트를 가지면, 각 페이지에 필요한 코드만 로드

```jsx
// webpack.config.js
module.exports = {
  entry: {
    home: './src/home.js',
    dashboard: './src/dashboard.js',
  },
};
```

## 2. 동적 임포트 (Dynamic Import)

- Javascript의 import() 함수를 사용하여 필요한 시점에만 모듈을 동적으로 불러오는 방식
  - SPA에서 주로 사용
- 페이지나 컴포넌트가 렌더링될 때만 코드 청크를 로딩하도록

```jsx
import React, { Suspense, lazy } from 'react';

const MyComponent = lazy(() => import('./MyComponent'));

const App = () => (
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  </div>
);
```

## 3. 경로 기반 코드 스플리팅 (Route-based Splitting)

- React Router와 같은 라우팅 라이브러리와 함께 사용
- 사용자가 특정 경로로 접근할 때만 해당 경로에 필요한 코드가 로드

```jsx
/* React Router + React Lazy */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const HomePage = lazy(() => import('./HomePage'));
const DashboardPage = lazy(() => import('./DashboardPage'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path="/dashboard" component={DashboardPage} />
      </Switch>
    </Suspense>
  </Router>
);
```

## 4. 라이브러리 코드 분할 (Vendor Code Splitting)

- 종속 라이브러리나 서드파티 패키지를 별도로 분할 → 애플리케이션 코드와 라이브러리 코드를 분할
- 라이브러리가 변경되지 않으면 브라우저가 캐시된 라이브러리 코드를 재사용하도록 하여 불필요한 리소스 로딩 방지

```jsx
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

## 5. 공유 코드 분할 (Shared Chunk)

- 여러 페이지나 모듈에서 공통으로 사용되는 코드를 별도의 청크로 분할
- 해당 코드가 여러 번 로드되지 않도록 → 중복된 코드 제거

```jsx
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'shared',
    },
  },
};
```

<br><br><br><br><br>

# [3/7 TIL] Next.js

## Page Router

> pages 폴더 내 파일명 기반 페이지 라우팅

- 동적 경로 대응
  - 📂item
    - index.js
    - `[id].js` 👉 하나의 아이디에 대응
    - Catch All Segment: `[…id].js` 👉 여러 개의 아이디에 대응
    - Optional Catch All Segment: `[[…id]].tsx` 👉 경로가 없을 때도 대응을 하고 싶다

### 페이지 이동 방식

- Link
  - a 태그와 사용법 동일
  - CSR 방식으로 이동
- Programmatic Navigation
  - 버튼이 클릭되거나 특정 조건이 만족했을 경우
  ```tsx
  import { useRouter } from 'next/router';

  export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const onClinkButton = () => {
      router.push('/test');
    };
  ```
  - replace: 뒤로가기를 방지하며 페이지 이동
  - back: 페이지 뒤로 이동

# 프리페칭

> 현재 페이지에서 이동 가능한 모든 링크의 데이터를 사전에 미리 다 불러와두는 기능

⇒ 페이지 이동을 매우 빠르게!

- 서버에서 JS Bundle을 요청하는 과정에서 현재 페이지에 필요한 JS Bundle만 전달된다
  - 모든 페이지의 Bundle 파일을 전달할 경우 용량이 너무 커지게 되면 하이드레이션이 늦어짐
  - TTI(유저가 상호작용할 수 있게 되는 시간)이 늦어짐
- 그렇게 되면 다른 페이지로 이동 시 또 JS Bundle을 요청하게 되어 시간이 걸리게 된다
- 위 문제를 개선하고자, 이동 가능한 페이지들의 자바스크립트 코드를 미리 사전에 다 불러와둠

1. 초기 요청 페이지의 JS Bundle을 받아 빠르게 하이드레이션
2. Pre Fetching으로 다른 페이지 이동까지 빠르게 처리

**주의사항**

- npm run dev 개발모드로 가동 시에는 프리패칭이 동작하지 않음
- 따라서 빌드에서 실행하는 프로덕션 모드로 실행해야 함

빌드하면 JS Bundle 용량 확인이 가능하다 (Splitting)

- Link만 프리패칭이 된다 (Programmatic❌)
  - Programmatic Navigation을 프리패칭 하는 법: 컴포넌트 마운트 시 `router.prefetch`
  ```tsx
  useEffect(() => {
    router.prefetch('/test');
  }, []);
  ```
- 자주 사용하지 않을 페이지라 프리패칭하고싶지 않다면? Link의 `prefetch` 옵션을 false로
  ```tsx
  <Link href={'/search'} prefetch={false}>
    search
  </Link>
  ```

# API Routes

> api 폴더 안의 api 응답을 정의하는 파일

```tsx
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const date = new Date();
  res.json({ time: date.toLocaleString() });
}
```

# CSS module

> 클래스 이름을 자동으로 유니크한 이름으로 파일마다 변환시켜주는 기능

- Next.js에서 글로벌 CSS 파일은 App컴포넌트가 아닌 곳에서는 불러올 수 없다
- 브라우저에서 여러개의 css 파일을 불러오게 되어 충돌이 날 수 있기 때문에 컴포넌트에서 css import 불가
  ⇒ CSS module을 이용하여 해결
- `index.css` 파일명을 `index.module.css` 로 변경 후 아래와 같이 import

```tsx
import style from './index.module.css';

export default function Home() {
  return <h1 className={style.h1}>인덱스</h1>;
}
```

유니크한 클래스네임으로 변경된 것이 확인 가능하다.
