package com.aicheck

import android.Manifest
import android.content.Context
import android.content.IntentFilter
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.telephony.TelephonyManager
import android.util.Log
import android.webkit.WebView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.aicheck.biometric.BiometricCallback
import com.aicheck.call.CallReceiver
import com.aicheck.permission.PermissionManager
import com.aicheck.ui.WebViewManager
import com.aicheck.biometric.BiometricHelper
import com.aicheck.fcm.FCMTokenManager

class MainActivity : FragmentActivity() {
    private var callReceiver: CallReceiver? = null
    var webView: WebView? = null
    lateinit var biometricHelper: BiometricHelper
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var permissionManager: PermissionManager
    private val REQUEST_NOTIFICATION_PERMISSION = 100
    private val SMS_PERMISSION_REQUEST_CODE = 2001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        sharedPreferences = getSharedPreferences("TokenStorage", Context.MODE_PRIVATE)

        biometricHelper = BiometricHelper(this, object : BiometricCallback {
            override fun onBiometricSuccess() {
                runOnUiThread {
                    webView?.evaluateJavascript("alert('생체 인증 성공!')", null)
                }
            }

            override fun onBiometricFailure(errorMessage: String) {
                runOnUiThread {
                    webView?.evaluateJavascript("alert('생체 인증 실패: $errorMessage')", null)
                }
            }
        })

        val webViewManager = WebViewManager(this)
        webView = webViewManager.setupWebView()
        setContentView(webView)
        Log.d("MainActivity", "onCreate 호출됨!")

        // ✅ PermissionManager 초기화
        permissionManager = PermissionManager(this)

        // ✅ 필수 권한 요청
        permissionManager.requestPermissions(
            onGranted = {
                Log.d("MainActivity", "✅ 모든 권한 허용됨!")
                registerCallReceiver()
            },
            onDenied = {
                Log.e("MainActivity", "❌ 필수 권한이 거부되었습니다.")
            }
        )
        permissionManager.requestStoragePermission()
        requestNotificationPermissionIfNeeded()
        requestSmsPermission()
    }

    private fun registerCallReceiver() {
        callReceiver = CallReceiver()
        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        registerReceiver(callReceiver, filter)
        Log.d("MainActivity", "CallReceiver 등록됨!")
    }

    override fun onDestroy() {
        super.onDestroy()
        callReceiver?.let {
            unregisterReceiver(it)
            Log.d("MainActivity", "CallReceiver 해제됨!")
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val permission = Manifest.permission.POST_NOTIFICATIONS
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, arrayOf(permission), REQUEST_NOTIFICATION_PERMISSION)
            } else {
                Log.d("FCM", "🔔 알림 권한 이미 허용됨 → FCM 토큰 발급 진행")
                requestFCMToken()
            }
        } else {
            Log.d("FCM", "🔔 Android 12 이하 → FCM 토큰 바로 발급")
            requestFCMToken()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == REQUEST_NOTIFICATION_PERMISSION) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d("FCM", "✅ 알림 권한 허용됨 → FCM 토큰 발급")
                requestFCMToken()
            } else {
                Log.e("FCM", "❌ 알림 권한 거부됨 → FCM 토큰 발급 불가")
            }
        }
    }

    private fun requestFCMToken() {
        FCMTokenManager.getFCMToken(object : FCMTokenManager.TokenCallback {
            override fun onSuccess(token: String?) {
                val prefs = getSharedPreferences("TokenStorage", Context.MODE_PRIVATE)
                prefs.edit().putString("fcmToken", token).apply()
                Log.d("FCM", "🔑 저장된 FCM Token: $token")
            }

            override fun onFailure(e: Exception?) {
                Log.e("FCM", "FCM 토큰 발급 실패", e)
            }
        })
    }

    private fun requestSmsPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECEIVE_SMS)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS),
                SMS_PERMISSION_REQUEST_CODE
            )
        }
    }
}
