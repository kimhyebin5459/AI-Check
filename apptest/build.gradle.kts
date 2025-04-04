plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.10" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.0"

    // ❌ 기존: version 명시하면서 apply false (이 방식은 pluginManagement에서 잘 안 먹힘)
    // id("com.chaquo.python") version "12.1.0" apply false

    // ✅ 변경: version 생략 (Chaquopy는 반드시 `app` 모듈에서 명시적으로 적용해야 함)
    id("com.chaquo.python") apply false
}
