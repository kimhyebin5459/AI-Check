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
      const { container } = render(<Input value='default value' />);
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
