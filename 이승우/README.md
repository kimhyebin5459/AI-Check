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
