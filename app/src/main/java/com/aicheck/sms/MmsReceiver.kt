package com.aicheck.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import android.util.Log
import com.aicheck.UrlModelManager
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import org.json.JSONObject
import java.io.IOException
import java.util.regex.Pattern

class MmsReceiver : BroadcastReceiver() {
    companion object {
        private const val TAG = "MmsReceiver"

        private val urlPattern: Pattern = Pattern.compile(
            "(https?://)?(www\\.)?[a-zA-Z0-9\\-]+\\.[a-z]{2,}(/[\\w\\-._~:/?\\[\\]\\@!$&'()*+,;=%]*)?",
            Pattern.CASE_INSENSITIVE
        )
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "📨 MMS 수신 감지됨")

        val uri: Uri = Telephony.Mms.Inbox.CONTENT_URI
        val projection = arrayOf("_id", "sub", "ct_t") // 제목, 타입
        val selection = "read = 0"
        val cursor: Cursor? = context.contentResolver.query(uri, projection, selection, null, "date DESC")

        cursor?.use {
            if (it.moveToFirst()) {
                val subject = it.getString(it.getColumnIndexOrThrow("sub")) ?: ""
                Log.d(TAG, "📩 MMS 제목: $subject")

                val matcher = urlPattern.matcher(subject)
                while (matcher.find()) {
                    var url = matcher.group()
                    Log.d(TAG, "🌐 추출된 raw URL (MMS): $url")
                    url = url.removePrefix("http://").removePrefix("https://")

                    try {
                        val maliciousProb = UrlModelManager.detectUrl(context, url)
                        Log.d(TAG, "🤖 악성 확률: $maliciousProb")
                        if (maliciousProb >= 0.5f) {
                            sendBadUrlToServer(context, url, maliciousProb)
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "🚨 URL 탐지 중 오류 (MMS)", e)
                    }
                }
            }
        }
    }

    private fun sendBadUrlToServer(context: Context, url: String, score: Float) {
        val accessToken = getAccessTokenFromPrefs(context)
        if (accessToken.isNullOrBlank()) {
            Log.e(TAG, "🚨 accessToken이 없습니다.")
            return
        }

        val json = JSONObject().apply {
            put("url", url)
            put("score", score)
        }

        val requestBody = RequestBody.create(
            "application/json; charset=utf-8".toMediaTypeOrNull(),
            json.toString()
        )

        val request = Request.Builder()
            .url("https://j12a603.p.ssafy.io/aicheck/urls")
            .addHeader("Authorization", "Bearer $accessToken")
            .post(requestBody)
            .build()

        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e(TAG, "❌ 서버 전송 실패: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    Log.d(TAG, "✅ 서버 전송 성공 (MMS)")
                } else {
                    Log.e(TAG, "⚠️ 서버 응답 오류: ${response.code}")
                }
            }
        })
    }

    private fun getAccessTokenFromPrefs(context: Context): String? {
        val prefs = context.getSharedPreferences("TokenStorage", Context.MODE_PRIVATE)
        return prefs.getString("accessToken", null)
    }
}