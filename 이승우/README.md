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

----
### 25.03.07 안드로이드에서 전화 감지
CallReceiver
```kotlin
public class CallReceiver extends BroadcastReceiver {
    private static final String TAG = "CallReceiver";
    private static String lastState = "";  // 🔥 static 변수로 변경 (앱이 살아있는 동안 유지)

    @Override
    public void onReceive(Context context, Intent intent) {

        if (TelephonyManager.ACTION_PHONE_STATE_CHANGED.equals(intent.getAction())) {
            String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);

            if (state == null || state.equals(lastState)) {
                // 🔥 상태가 변하지 않았으면 무시
                return;
            }
            lastState = state;  // 🔥 상태 업데이트

            Log.d(TAG, "📞 전화 상태 변경 감지됨: " + state);

            if (TelephonyManager.EXTRA_STATE_RINGING.equals(state)) {
                handleRingingCall(context);
            } else if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(state)) {
                Log.d(TAG, "📲 통화 중!");
            } else if (TelephonyManager.EXTRA_STATE_IDLE.equals(state)) {
                Log.d(TAG, "❌ 통화 종료됨!");
            }
        }
    }

    private void handleRingingCall(Context context) {
        String phoneNumber = getLastIncomingNumber(context);
        Log.d(TAG, "☎️ 전화가 오고 있음! 번호: " + phoneNumber);
    }

    private String getLastIncomingNumber(Context context) {
        Uri callUri = CallLog.Calls.CONTENT_URI;
        Cursor cursor = context.getContentResolver().query(
                callUri,
                null,
                null,
                null,
                CallLog.Calls.DATE + " DESC"
        );

        if (cursor != null && cursor.moveToFirst()) {
            int numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER);
            String lastCallNumber = cursor.getString(numberIndex);
            cursor.close();
            return lastCallNumber;
        }
        return "알 수 없음";
    }
}
```
Manifest
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- 전화 상태 읽기 및 오디오 녹음 권한 -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE"/>
    <uses-permission android:name="android.permission.READ_CALL_LOG"/>
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Test"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Test">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".CallReceiver"
            android:permission="android.permission.BIND_TELECOM_CONNECTION_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.PHONE_STATE" />
            </intent-filter>
        </receiver>


        <!-- 오디오 캡처 서비스 (통화 감지 시 실행) -->
<!--        <service android:name=".AudioCaptureService"-->
<!--            android:foregroundServiceType="phoneCall"-->
<!--            android:exported="false"-->
<!--            tools:ignore="ForegroundServicePermission" />-->
    </application>
</manifest>
```
MainActivity
```kotlin
package com.example.test

import android.Manifest
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Bundle
import android.telephony.TelephonyManager
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.content.ContextCompat
import com.example.test.ui.theme.TestTheme

class MainActivity : ComponentActivity() {
    private var callReceiver: CallReceiver? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            TestTheme {
                Greeting("Android!!!!!!")
            }
        }

        Log.d("MainActivity", "onCreate 호출됨!")

        // 📌 `READ_PHONE_STATE` & `READ_CALL_LOG` 권한 체크 및 요청
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions()
        } else {
            registerCallReceiver()
        }
    }

    private fun requestPermissions() {
        val requestPermissionLauncher = registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { permissions ->
            val phoneStateGranted = permissions[Manifest.permission.READ_PHONE_STATE] ?: false
            val callLogGranted = permissions[Manifest.permission.READ_CALL_LOG] ?: false

            if (phoneStateGranted && callLogGranted) {
                Log.d("MainActivity", "권한이 허용됨!")
                registerCallReceiver()
            } else {
                Log.d("MainActivity", "권한이 거부됨!")
            }
        }

        requestPermissionLauncher.launch(
            arrayOf(
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.READ_CALL_LOG
            )
        )
    }

    private fun registerCallReceiver() {
        callReceiver = CallReceiver()
        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        registerReceiver(callReceiver, filter)
        Log.d("MainActivity", "CallReceiver 등록됨!")
    }

    override fun onDestroy() {
        super.onDestroy()
        if (callReceiver != null) {
            unregisterReceiver(callReceiver)
            Log.d("MainActivity", "CallReceiver 해제됨!")
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    TestTheme {
        Greeting("Android")
    }
}
```