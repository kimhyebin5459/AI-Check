pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
        maven {
            name = "ChaquoPlugin"
            url = uri("https://chaquo.com/maven")
        }
    }
    plugins {
        id("com.chaquo.python") version "16.0.0"
    }
}


//pluginManagement {
//    repositories {
//        google {
//            content {
//                includeGroupByRegex("com\\.android.*")
//                includeGroupByRegex("com\\.google.*")
//                includeGroupByRegex("androidx.*")
//            }
//        }
//        mavenCentral()
//        gradlePluginPortal()
//        maven {
//            name = "ChaquoPlugin"
//            url = uri("https://chaquo.com/maven")
//            content {
//                includeGroup("com.chaquo.gradle.plugin")
//            }
//        }
//    }
//    plugins {
//        id("com.chaquo.python") version "12.1.0"
//    }
//}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}

rootProject.name = "My Application"
include(":app")
 