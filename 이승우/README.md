### 25.03.04 MSA 환경에서 테스트 코드 작성 가이드

## 📌 MSA에서 테스트 코드 작성 개요
MSA(Microservices Architecture) 환경에서는 각 서비스가 독립적으로 동작하며, 네트워크를 통해 통신하는 특성을 고려한 테스트 전략이 필요하다. 따라서 일반적인 단위 테스트(Unit Test)뿐만 아니라, 통합 테스트(Integration Test), 계약 테스트(Contract Test), E2E 테스트(End-to-End Test) 등을 활용하여 서비스 간의 연계성과 안정성을 검증해야 한다.

---

## 🏗️ 테스트 유형 및 전략

### 1️⃣ **단위 테스트 (Unit Test)**
- 각 마이크로서비스 내부의 개별적인 컴포넌트를 검증하는 테스트
- 데이터베이스, 네트워크 요청 등을 Mocking하여 독립적인 테스트 수행
- **사용 도구:** JUnit, Mockito, Pytest, Jest 등

#### ✅ **예제 (Spring Boot + JUnit5 + Mockito)**
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testFindUserById() {
        User mockUser = new User(1L, "Alice");
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        User user = userService.getUserById(1L);

        assertEquals("Alice", user.getName());
        verify(userRepository).findById(1L);
    }
}
```

2️⃣ 통합 테스트 (Integration Test)
마이크로서비스 내부에서 여러 모듈이 정상적으로 작동하는지 검증
실제 데이터베이스(H2, Testcontainers)와 함께 실행할 수 있음
Spring Boot 환경에서는 @SpringBootTest를 활용

✅ 예제 (Spring Boot + Testcontainers)
```
@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
class UserServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("test-db")
        .withUsername("user")
        .withPassword("password");

    @Autowired
    private UserRepository userRepository;

    @Test
    void testCreateUser() {
        User user = new User(null, "Bob");
        userRepository.save(user);
        assertNotNull(user.getId());
    }
}
```

3️⃣ 계약 테스트 (Contract Test)
API 클라이언트와 서버 간의 명세(Contract)를 미리 정의하고, 이를 기반으로 양쪽에서 독립적으로 테스트 수행
Consumer(클라이언트)와 Provider(서버)가 각각 계약을 검증
사용 도구: Spring Cloud Contract, Pact, Dredd 등
✅ 예제 (Spring Cloud Contract)
📌 Contract 정의 (src/test/resources/contracts/getUser.groovy)

```
Contract.make {
    request {
        method 'GET'
        url '/users/1'
    }
    response {
        status 200
        body(
            id: 1,
            name: 'Alice'
        )
        headers {
            contentType(applicationJson())
        }
    }
}
```

📌 Provider 테스트
```
@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@AutoConfigureStubRunner(ids = "com.example:user-service:+:stubs:8080", stubsMode = StubRunnerProperties.StubsMode.LOCAL)
class UserContractTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void validateUserContract() throws Exception {
        mockMvc.perform(get("/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("Alice"));
    }
}
```
4️⃣ E2E 테스트 (End-to-End Test)
전체적인 서비스 흐름을 검증하는 테스트
다수의 마이크로서비스가 상호작용하는 시나리오를 포함
API 호출을 실제 서버 환경에서 검증 (Docker Compose, Kubernetes 활용)
사용 도구: Selenium, Cypress, Postman, RestAssured 등
✅ 예제 (RestAssured + Testcontainers)
```
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class UserE2ETest {

    @Container
    static GenericContainer<?> appContainer = new GenericContainer<>("user-service:latest")
        .withExposedPorts(8080);

    @Test
    void testUserEndpoint() {
        given()
            .baseUri("http://localhost:" + appContainer.getMappedPort(8080))
            .when()
            .get("/users/1")
            .then()
            .statusCode(200)
            .body("name", equalTo("Alice"));
    }
}

```
---
### 25.03.05 테스트 코드 작성시 주의점
### 1️⃣ 테스트 종류 및 역할
### ✅ 1. 단위 테스트 (Unit Test)
개별 서비스 내부의 특정 모듈(클래스, 함수 등)을 검증하는 테스트
외부 서비스 의존성을 제거하기 위해 Mockito 등으로 Mocking
데이터베이스 접근을 피하기 위해 @MockBean, @DataJpaTest 등 활용

```java
@RunWith(MockitoJUnitRunner.class)
public class PartnerServiceTest {

    @Mock
    private PartnerClient partnerClient;

    @InjectMocks
    private PartnerService partnerService;

    @Test
    void 가맹점_이름_조회_테스트() {
        when(partnerClient.getPartnerName("123-45-67890"))
                .thenReturn("Mock Store");

        String name = partnerService.getPartnerName("123-45-67890");

        assertEquals("Mock Store", name);
    }
}
```

### ✅ 2. 통합 테스트 (Integration Test)
- 데이터베이스, 메시지 브로커(Kafka 등), 외부 API 연동을 포함하여 서비스가 정상 동작하는지 검증
- Testcontainers를 활용하여 DB, Redis, Kafka 등을 컨테이너로 실행

```java
@SpringBootTest
@Testcontainers
public class BusinessLicenseIntegrationTest {

    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @Autowired
    private BusinessLicenseRepository businessLicenseRepository;

    @Test
    void 사업자등록증_저장_테스트() {
        BusinessLicense license = new BusinessLicense("123-45-67890", "Test Corp");

        BusinessLicense savedLicense = businessLicenseRepository.save(license);

        assertNotNull(savedLicense.getId());
        assertEquals("123-45-67890", savedLicense.getLicenseNumber());
    }
}

```

### ✅ 3. API 테스트 (Controller Test)
- REST API의 요청 및 응답을 검증
- Mock 서버 또는 실제 서비스와 연동하여 테스트 수행
```java
@WebMvcTest(PartnerController.class)
class PartnerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PartnerService partnerService;

    @Test
    void 가맹점_조회_API_테스트() throws Exception {
        when(partnerService.getPartnerName("123-45-67890")).thenReturn("Mock Store");

        mockMvc.perform(get("/api/partners/123-45-67890"))
                .andExpect(status().isOk())
                .andExpect(content().string("Mock Store"));
    }
}
```


### ✅ 4. 계약 테스트 (Contract Test)
- MSA 환경에서 API 소비자(Consumer)와 제공자(Provider) 간의 계약을 검증
- Pact 라이브러리를 사용하여 API가 예상한 대로 동작하는지 확인
  📝 **Consumer 측 테스트 (A 서비스)**
```java
@PactTestFor(providerName = "PartnerService")
public class ConsumerPactTest {

    @Pact(provider = "PartnerService", consumer = "FranchiseService")
    public RequestResponsePact createPact(PactDslWithProvider builder) {
        return builder
                .given("가맹점이 존재할 때")
                .uponReceiving("사업자번호로 가맹점 조회 요청")
                .path("/partners/123-45-67890")
                .method("GET")
                .willRespondWith()
                .status(200)
                .body("{ \"name\": \"Mock Store\" }")
                .toPact();
    }

    @Test
    @PactTestFor(pactMethod = "createPact")
    public void testConsumer() {
        given()
            .when()
            .get("http://localhost:8080/partners/123-45-67890")
            .then()
            .statusCode(200)
            .body(equalTo("Mock Store"));
    }
}
```

### ✅ 5. 메시지 브로커 테스트 (Kafka)
- Kafka, RabbitMQ 같은 비동기 메시지 큐를 테스트할 때 Embedded Kafka 사용
```java
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = "business-license-response")
public class KafkaListenerTest {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    void 카프카_메시지_테스트() throws Exception {
        String testMessage = "사업자등록증 처리 완료";

        kafkaTemplate.send("business-license-response", testMessage);

        Consumer<String, String> consumer = createKafkaConsumer();
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(5));

        assertEquals(1, records.count());
        assertEquals(testMessage, records.iterator().next().value());
    }
}
```

### 2️⃣ MSA 테스트 코드 작성 시 주의점
### 🛑 1. 각 서비스는 독립적으로 테스트 가능해야 함
- 하나의 서비스(A)가 다른 서비스(B)를 호출할 때, B가 항상 실행 중일 필요가 없어야 함
- Mock Server(WireMock, Postman Mock Server, JSON Server)를 활용하여 B 없이 A의 테스트 수행 가능
### 🛑 2. DB, 메시지 브로커 등의 의존성을 줄이기 위해 Testcontainers 활용
- Testcontainers를 사용하면 실제 환경과 유사한 테스트 가능
- Redis, PostgreSQL, Kafka 등과 같은 서비스 의존성을 제거
### 🛑 3. API 계약을 변경할 때 Consumer와 Provider 모두 검증
- API 스펙 변경 시 Pact 또는 Spring Cloud Contract를 활용하여 기존 API 소비자와의 충돌 방지
### 🛑 4. 네트워크 장애 및 예외 상황 테스트
- WireMock을 활용해 API 응답 지연이나 서버 오류(500, 503 등)를 시뮬레이션

```java
stubFor(get(urlEqualTo("/partners/123-45-67890"))
    .willReturn(aResponse()
        .withFixedDelay(5000)  // 5초 응답 지연
        .withStatus(503)));    // Service Unavailable
```

### 🛑 5. MSA 테스트 시 실행 속도 최적화
- 통합 테스트는 실행 시간이 길기 때문에 단위 테스트와 분리하여 실행
- CI/CD에서 단위 테스트 → 통합 테스트 → 계약 테스트 순서로 실행하도록 설계