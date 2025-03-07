# 3/4 #

# 테스트 코드 작성 방법 학습 요약

## 1. 테스트 코드의 중요성
- **품질 보증:**  
  - 기능 구현 후 버그를 미리 발견하고, 코드 변경 시 기존 기능이 정상 동작하는지 확인
- **자동화 및 CI/CD 연계:**  
  - 지속적인 통합과 배포 환경에서 자동화된 테스트는 안정성을 높임

## 2. 테스트의 종류
- **단위 테스트 (Unit Test):**  
  - 하나의 함수나 클래스처럼 작은 단위의 코드가 의도한 대로 작동하는지 검증  
  - 외부 의존성을 최소화하기 위해 Mock, Stub 등을 활용
- **통합 테스트 (Integration Test):**  
  - 여러 모듈이나 컴포넌트가 상호작용하는 과정에서 발생할 수 있는 문제점을 검증
- **기능/시스템 테스트:**  
  - 애플리케이션 전체 흐름이나 사용자 시나리오에 따라 시스템이 올바르게 동작하는지 확인

## 3. 테스트 작성 원칙
- **명확성:**  
  - 테스트 이름과 설명은 무엇을 검증하는지 명확하게 드러내야 함
- **독립성:**  
  - 각 테스트는 다른 테스트와의 의존성 없이 독립적으로 실행되어야 함
- **재현성:**  
  - 동일한 조건에서 항상 같은 결과를 내도록 테스트 환경을 구성
- **가독성:**  
  - 테스트 코드 자체도 읽기 쉽고 이해하기 쉽게 작성

## 4. 테스트 작성 방법 및 기법
- **TDD (Test-Driven Development):**  
  - 기능 구현 전, 요구사항에 맞는 테스트 코드를 먼저 작성하고 그에 따라 코드를 구현
- **Given-When-Then 패턴:**  
  - 테스트 준비(**Given**), 실행(**When**), 결과 검증(**Then**) 순으로 테스트 케이스를 구성
- **Mocking 및 Stub:**  
  - 실제 객체 대신 가짜 객체를 사용해 외부 의존성을 제거하고 테스트 대상 코드에 집중할 수 있도록 함

## 5. 주요 테스트 프레임워크와 도구 (Spring Boot 환경 기준)
- **JUnit:**  
  - Java 생태계에서 가장 널리 사용하는 단위 테스트 프레임워크
- **Mockito:**  
  - 객체의 행위를 가짜로 흉내 내어 외부 의존성 테스트를 용이하게 해주는 라이브러리
- **Spring Boot Test:**  
  - Spring 컨텍스트를 로드하여 통합 테스트를 지원하며, 웹 계층이나 데이터 계층 테스트에 활용
- **AssertJ:**  
  - 풍부하고 읽기 쉬운 단언(assertion) 메서드를 제공하여 테스트 가독성을 높임

# 3/5 #

## MSA + EDA 구조에서 ERD (Transactional Outbox 패턴, SAGA 패턴)

MSA(마이크로서비스 아키텍처)와 EDA(이벤트 기반 아키텍처) 환경에서는 각 서비스가 자신만의 데이터베이스를 소유하고 독립적으로 운영되기 때문에, 전통적인 “글로벌 ERD”보다는 각 서비스별 도메인 모델과 이벤트 처리 관련 테이블을 설계합니다. 아래는 Transactional Outbox 패턴과 SAGA 패턴을 함께 사용하는 경우의 개념적 예시입니다.

---

### 1. 주요 구성 요소

#### 도메인 엔티티 테이블 (예: Order)

- **Order 테이블**
  - `order_id` (PK): 주문의 유일한 식별자
  - `order_status`: 주문 상태
  - `order_amount`: 주문 금액
  - 기타 주문 관련 핵심 정보

#### Transactional Outbox 테이블

- **Outbox 테이블**
  - 도메인 엔티티의 변경과 함께 이벤트를 동일 트랜잭션 내에서 기록하여 데이터 일관성을 보장합니다.
- **주요 컬럼:**
  - `outbox_id`: 기본키
  - `aggregate_id`: 도메인 엔티티(예: Order)의 식별자 (Foreign Key)
  - `event_type`: 이벤트 유형 (예: 주문 생성, 주문 변경 등)
  - `payload`: 이벤트 관련 데이터 (주로 JSON 형태)
  - `created_at`: 이벤트 생성 시각
  - `processed_at`: 이벤트 처리 완료 시각 (혹은 상태 플래그)

#### SAGA 관리 테이블

- **Saga 테이블**
  - 여러 마이크로서비스 간의 분산 트랜잭션(비즈니스 프로세스)을 관리하기 위해 사용됩니다.
- **주요 컬럼:**
  - `saga_id`: 기본키
  - `order_id`: 관련 도메인 식별자 (Foreign Key, 예: Order의 식별자)
  - `saga_state`: 현재 상태 (예: 진행중, 완료, 보상 처리 중 등)
  - `current_step`: 현재 진행 단계
  - `started_at`: Saga 시작 시각
  - `completed_at`: Saga 완료 시각

---

### 2. 예시 ERD (개념적 다이어그램)

```plaintext
[Order]
  ┌─────────────────────┐
  │ order_id  (PK)      │
  │ order_status        │
  │ order_amount        │
  │ ...                 │
  └─────────────────────┘
           │ 1
           │
           │ FK (order_id)
           ▼
[Outbox]
  ┌────────────────────────────┐
  │ outbox_id     (PK)         │
  │ aggregate_id (FK: Order)   │
  │ event_type                 │
  │ payload (JSON)             │
  │ created_at                 │
  │ processed_at               │
  └────────────────────────────┘

           │ 1
           │
           │ FK (order_id)
           ▼
[Saga]
  ┌────────────────────────────┐
  │ saga_id      (PK)          │
  │ order_id     (FK: Order)   │
  │ saga_state                 │
  │ current_step               │
  │ started_at                 │
  │ completed_at               │
  └────────────────────────────┘
```
# 3/6 #

# 카페 키오스크 시스템을 가정하고 단위테스트 작성해보기 

## JUnit 5, AssertJ를 활용한 테스트 코드 작성
```
public class CafeKioskTest {

	@Test
	void add_manual_test(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		cafeKiosk.add(new Americano());

		System.out.println(">>> 담긴 음료 수 : " + cafeKiosk.getBeverages().size());
		System.out.println(">>> 담긴 음료 : " + cafeKiosk.getBeverages().get(0).getName());
	}

	@Test
	void add(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		cafeKiosk.add(new Americano());

		assertThat(cafeKiosk.getBeverages()).hasSize(1);
		assertThat( cafeKiosk.getBeverages().get(0).getName()).isEqualTo("아메리카노");
	}

	@Test
	void addSeveralBeverages(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		cafeKiosk.add(americano, 2);

		assertThat(cafeKiosk.getBeverages().get(0)).isEqualTo(americano);
		assertThat(cafeKiosk.getBeverages().get(1)).isEqualTo(americano);
	}

	@Test
	void addZeroBeverages(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		assertThatThrownBy(() -> cafeKiosk.add(americano, 0))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessage("음료는 1잔 이상 주문하실 수 있습니다.");
	}

	@Test
	void remove(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		cafeKiosk.add(americano);
		assertThat(cafeKiosk.getBeverages()).hasSize(1);

		cafeKiosk.remove(americano);
		assertThat(cafeKiosk.getBeverages()).isEmpty();
	}

	@Test
	void clear(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();
		Latte latte = new Latte();

		cafeKiosk.add(americano);
		cafeKiosk.add(latte);
		assertThat(cafeKiosk.getBeverages()).hasSize(2);

		cafeKiosk.clear();
		assertThat(cafeKiosk.getBeverages()).isEmpty();
	}

	@Test
	void createOrder(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		cafeKiosk.add(americano);

		Order order = cafeKiosk.createOrder();

		assertThat(order.getBeverages()).hasSize(1);
		assertThat(order.getBeverages().get(0).getName()).isEqualTo("아메리카노");
	}

	@Test
	void createOrderWithCurrentTime(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		cafeKiosk.add(americano);

		Order order = cafeKiosk.createOrder(LocalDateTime.of(2025, 3, 7, 14, 0));

		assertThat(order.getBeverages()).hasSize(1);
		assertThat(order.getBeverages().get(0).getName()).isEqualTo("아메리카노");
	}

	@Test
	void createOrderOutsideOpenTime(){
		CafeKiosk cafeKiosk = new CafeKiosk();
		Americano americano = new Americano();

		cafeKiosk.add(americano);

		assertThatThrownBy(() -> cafeKiosk.createOrder(LocalDateTime.of(2025, 3, 7, 9, 59)))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessage("주문 시간이 아닙니다. 관리자에게 문의하세요.");
	}
}

class AmericanoTest {

	@Test
	void getName() {
		Americano americano = new Americano();

		// assertEquals(americano.getName(), "아메리카노");
		assertThat(americano.getName()).isEqualTo("아메리카노");
	}

	@Test
	void getPrice() {
		Americano americano = new Americano();
		assertThat(americano.getPrice()).isEqualTo(4000);
	}
}
```
