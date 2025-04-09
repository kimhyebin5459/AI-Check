//package com.example.myapplication
//
//import org.tensorflow.lite.flex.FlexDelegate
//import ai.onnxruntime.OrtEnvironment
//import ai.onnxruntime.OrtSession
//import android.os.Bundle
//import android.util.Log
//import android.widget.Button
//import android.widget.EditText
//import android.widget.TextView
//import androidx.appcompat.app.AppCompatActivity
//import com.chaquo.python.Python
//import com.chaquo.python.android.AndroidPlatform
//import org.tensorflow.lite.Interpreter
//import kotlinx.serialization.json.Json
//import java.io.File
//import java.io.FileInputStream
//import java.nio.ByteBuffer
//import java.nio.ByteOrder
//import java.nio.channels.FileChannel
//
//class MainActivity : AppCompatActivity() {
//    private lateinit var voicePhishingDetector: VoicePhishingDetector
//    private lateinit var deepVoiceDetector: DeepVoiceDetectorWithChaquopy
//    private lateinit var urlDetector: UrlDetector
//    private lateinit var ortEnv: OrtEnvironment
//    private lateinit var ortSession: OrtSession
//    private lateinit var wordToIndex: Map<String, Int>
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_main)
//
//        if (!Python.isStarted()) {
//            Python.start(AndroidPlatform(this))
//        }
//
//        try {
////            val fileName = "real 이시우 95님과 통화 3" //
////            val fileName = "realyu" //
//            val fileName = "mixed_siu" //
////            val fileName = "fake 사탄" //
////            val fileName = "deep KsponSpeech_0023_KsponSpeech_022578_fake" //
////            val fileName = "fake generated_K05741143-AMG23-L1N2D1-E-K0KK-00555023" //
////            val fileName = "real K0001A013-BMG20-L1N2D1-E-K0KK-04705616" //
////            val fileName = "real K0001A013-BMG20-L1N2D1-E-K0KK-04705619"
//            // 오디오 파일 복사
//            copyAudioFileToInternalStorage("${fileName}.wav")
//
//            // 모델 로드
//            val interpreterDeepVoice = Interpreter(loadModelFile("deepvoice_model.tflite"))
//            val interpreterVoicePhishing = Interpreter(loadModelFile("model2.tflite"))
//            val interpreterSTT = Interpreter(loadModelFile("stt_float36.tflite"))
//            // 악성 url 모델
//            val onnxModelPath = copyModelToInternalStorage("tfidf_1000_xgb_2000_2025_04_01_07_11_17_acc_9336_xgboost (1).onnx")
//
//            // vocab.json 로드
//            val vocabJson = assets.open("vocab.json").bufferedReader().use { it.readText() }
//            wordToIndex = Json.decodeFromString(vocabJson)
//
//            // URL 탐지 데이터 로드
//            val keywordListJson = assets.open("keyword_list.json").bufferedReader().use { it.readText() }
//            val keywordList = Json.decodeFromString<List<String>>(keywordListJson)
//            val vocabUrlJson = assets.open("vectorizer_vocab.json").bufferedReader().use { it.readText() }
//            val vocabUrl = Json.decodeFromString<Map<String, Int>>(vocabUrlJson)
//            val scalerParamsJson = assets.open("scaler_params.json").bufferedReader().use { it.readText() }
//            val scalerParams = Json.decodeFromString<ScalerParams>(scalerParamsJson)
//
//
//            ortEnv = OrtEnvironment.getEnvironment()
//            ortSession = ortEnv.createSession(onnxModelPath, OrtSession.SessionOptions())
//
//
//            // 1. 보이스피싱 탐지
//            // 1-1. 통화 내용 기반 탐지
//            voicePhishingDetector = VoicePhishingDetector(this, interpreterSTT, interpreterVoicePhishing, wordToIndex)
//            // 1-2. 딥보이스 포함 탐지
//            deepVoiceDetector = DeepVoiceDetectorWithChaquopy(this, interpreterDeepVoice)
//
//            // 2. 악성 url 탐지
//            urlDetector = UrlDetector(
//                ortSession = ortSession,    // OrtSession
//                ortEnv = ortEnv,            // OrtEnvironment
//                keywordList = keywordList,  // List<String>
//                vocab = vocabUrl,           // Map<String, Int>
//                scalerParams = scalerParams // ScalerParams
//            )
//
//            // UI 요소
//            val btnPredictDeepVoice = findViewById<Button>(R.id.btnPredictDeepVoice)
//            val btnPredictVoicePhishing = findViewById<Button>(R.id.btnPredictVoicePhishing)
//            val btnCheckUrl = findViewById<Button>(R.id.btnCheckUrl)
//            val tvResult = findViewById<TextView>(R.id.tvResult)
//            val etUrlInput = findViewById<EditText>(R.id.etUrlInput)
//            val tvUrlResult = findViewById<TextView>(R.id.tvUrlResult)
//
//            val etAudioFilename = findViewById<EditText>(R.id.etAudioFilename)
//            btnPredictDeepVoice.setOnClickListener {
//                val userInput = etAudioFilename.text.toString().trim()
//                if (userInput.isEmpty()) {
//                    tvResult.text = "⚠️ 파일명을 입력하세요 (예: real_sample1)"
//                    return@setOnClickListener
//                }
//
//                try {
//                    val audioFileName = "$userInput.wav"
//                    copyAudioFileToInternalStorage(audioFileName)
//                    val audioPath = "${filesDir.absolutePath}/$audioFileName"
//                    val result = deepVoiceDetector.detect(audioPath)
//
//                    val resultText = """
//
//
//
//
//
//🎧 딥 보이스 탐지 결과
//
//📁 파일 이름: ${result["basename"]}
//🏷️ 실제 라벨: ${result["true_label"]}
//
//📊 세그먼트 확률:
//${result["segment_probs"]}
//
//🌐 전체 딥페이크 확률: ${result["deepfake_prob_full"]}
//✅ 전체 딥페이크 여부: ${result["is_deepfake_full"]}
//
//📈 평균 세그먼트 확률: ${result["mean_segment_prob"]}
//🧠 세그먼트/최종 딥페이크 여부: ${result["is_deepfake_segment"]}
//        """.trimIndent()
//
//                    tvResult.text = resultText
//                } catch (e: Exception) {
//                    Log.e("MainActivity", "딥 보이스 탐지 오류", e)
//                    tvResult.text = "❌ 오류 발생: ${e.message}"
//                }
//            }
//
//            btnPredictVoicePhishing.setOnClickListener {
//                try {
//                    val audioPath = "${filesDir.absolutePath}/${fileName}.wav"
//                    val (result, transcribedText) = voicePhishingDetector.detect(audioPath)
//                    tvResult.text = """
//
//
//
//
//
//
//                        보이스피싱 예측 결과: $result\n텍스트: $transcribedText""".trimIndent()
//                } catch (e: Exception) {
//                    Log.e("MainActivity", "보이스피싱 탐지 오류", e)
//                    tvResult.text = "오류: ${e.message}"
//                }
//            }
//
////            btnCheckUrl.setOnClickListener {
////                val url = etUrlInput.text.toString().trim()
////                if (url.isEmpty()) {
////                    tvUrlResult.text = "URL을 입력하세요."
////                    return@setOnClickListener
////                }
////                try {
////                    val result = urlDetector.detect(url)
////                    tvUrlResult.text = result
////                } catch (e: Exception) {
////                    Log.e("UrlTest", "URL 검사 중 오류", e)
////                    tvUrlResult.text = "오류: ${e.message}"
////                }
////            }
//            // url detect model : mlp-256-128-64-v6-auc-2-1_epoch_50_lr_0.001_batch_32_none_final_2025-04-09_00-17-44
//            btnCheckUrl.setOnClickListener {
//                val url = etUrlInput.text.toString().trim()
//                if (url.isEmpty()) {
//                    tvUrlResult.text = "URL을 입력하세요."
//                    return@setOnClickListener
//                }
//
//                try {
//                    val python = Python.getInstance()
//                    val pyModule = python.getModule("extractor_url") // extractor.py 에 정의된 함수
//
//                    // 1. 특징 추출 및 스케일링
//                    val result = pyModule.callAttr("extract_and_scale", url)
//                    val featureVector = result.asList().map { it.toJava(Float::class.java) }.toFloatArray()
//
//                    // 2. TFLite 입력 준비
//                    val inputBuffer = ByteBuffer.allocateDirect(4 * featureVector.size)
//                    inputBuffer.order(ByteOrder.nativeOrder())
//                    featureVector.forEach { inputBuffer.putFloat(it) }
//                    inputBuffer.rewind()
//
//                    // 3. 출력 버퍼 설정 (1개의 float 확률값)
//                    val outputBuffer = ByteBuffer.allocateDirect(4)
//                    outputBuffer.order(ByteOrder.nativeOrder())
//
//                    // 4. 추론
//                    interpreterVoicePhishing.run(inputBuffer, outputBuffer)  // 👈 여기서 URL 전용 interpreter로 바꿔야 함
//                    val resultProb = outputBuffer.float
//
//                    // 5. 결과 출력
//                    val label = if (resultProb >= 0.5f) "⚠️ 악성 URL 의심됨" else "✅ 정상 URL"
//                    tvUrlResult.text = """
//            📌 입력 URL: $url
//            📊 악성 확률: ${"%.4f".format(resultProb)}
//            $label
//        """.trimIndent()
//
//                } catch (e: Exception) {
//                    Log.e("UrlCheck", "🔍 URL 검사 중 오류", e)
//                    tvUrlResult.text = "❌ 오류 발생: ${e.message}"
//                }
//            }
//
//        } catch (e: Exception) {
//            Log.e("MainActivity", "초기화 오류", e)
//            findViewById<TextView>(R.id.tvResult).text = "초기화 오류: ${e.message}"
//        }
//    }
//
//    private fun loadModelFile(modelFileName: String): ByteBuffer {
//        val fileDescriptor = assets.openFd(modelFileName)
//        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
//        val fileChannel = inputStream.channel
//        val startOffset = fileDescriptor.startOffset
//        val declaredLength = fileDescriptor.declaredLength
//        val mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
//        mappedByteBuffer.order(ByteOrder.nativeOrder())
//        inputStream.close()
//        fileChannel.close()
//        return mappedByteBuffer
//    }
//
//    private fun copyAudioFileToInternalStorage(fileName: String) {
//        val outFile = File(filesDir, fileName)
//        if (!outFile.exists()) {
//            assets.open(fileName).use { input ->
//                outFile.outputStream().use { output ->
//                    input.copyTo(output)
//                }
//            }
//        }
//    }
//
//    private fun copyModelToInternalStorage(modelFileName: String): String {
//        val outFile = File(filesDir, modelFileName)
//        if (!outFile.exists()) {
//            assets.open(modelFileName).use { input ->
//                outFile.outputStream().use { output ->
//                    input.copyTo(output)
//                }
//            }
//        }
//        return outFile.absolutePath
//    }
//}


package com.example.myapplication

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import kotlinx.serialization.json.Json
import org.tensorflow.lite.Interpreter
import java.io.File
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel

class MainActivity : AppCompatActivity() {
    private lateinit var voicePhishingDetector: VoicePhishingDetector
    private lateinit var deepVoiceDetector: DeepVoiceDetectorWithChaquopy
    private lateinit var interpreterUrlDetector: Interpreter  // ✅ URL 탐지용 TFLite 모델

    private lateinit var wordToIndex: Map<String, Int>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }

        try {
            val fileName = "mixed_siu"
            copyAssetToInternalStorage("$fileName.wav")

            // ✅ 모델 로드
            val interpreterDeepVoice = Interpreter(loadModelFile("deepvoice_model.tflite"))
            val interpreterVoicePhishing = Interpreter(loadModelFile("model2.tflite"))
            val interpreterSTT = Interpreter(loadModelFile("stt_float36.tflite"))
            interpreterUrlDetector = Interpreter(loadModelFile("mlp-256-128-64-v6-auc-2-1_epoch_50_lr_0.001_batch_32_none_final_2025-04-09_00-17-44.tflite"))  // ✅ URL 모델

            // ✅ vocab.json
            val vocabJson = assets.open("vocab.json").bufferedReader().use { it.readText() }
            wordToIndex = Json.decodeFromString(vocabJson)

            // ✅ 탐지기 구성
            voicePhishingDetector = VoicePhishingDetector(this, interpreterSTT, interpreterVoicePhishing, wordToIndex)
            deepVoiceDetector = DeepVoiceDetectorWithChaquopy(this, interpreterDeepVoice)

            // ✅ UI 구성
            val btnPredictDeepVoice = findViewById<Button>(R.id.btnPredictDeepVoice)
            val btnPredictVoicePhishing = findViewById<Button>(R.id.btnPredictVoicePhishing)
            val btnCheckUrl = findViewById<Button>(R.id.btnCheckUrl)
            val tvResult = findViewById<TextView>(R.id.tvResult)
            val etUrlInput = findViewById<EditText>(R.id.etUrlInput)
            val tvUrlResult = findViewById<TextView>(R.id.tvUrlResult)
            val etAudioFilename = findViewById<EditText>(R.id.etAudioFilename)

            btnPredictDeepVoice.setOnClickListener {
                val userInput = etAudioFilename.text.toString().trim()
                if (userInput.isEmpty()) {
                    tvResult.text = "⚠️ 파일명을 입력하세요 (예: real_sample1)"
                    return@setOnClickListener
                }
                try {
                    val audioFileName = "$userInput.wav"
                    copyAssetToInternalStorage(audioFileName)
                    val audioPath = "${filesDir.absolutePath}/$audioFileName"
                    val result = deepVoiceDetector.detect(audioPath)
                    val resultText = """
                        
                        
                        
                        
                        
                        
🎧 딥 보이스 탐지 결과
📁 파일 이름: ${result["basename"]}
🏷️ 실제 라벨: ${result["true_label"]}
📊 세그먼트 확률:
${result["segment_probs"]}

🌐 전체 딥페이크 확률: ${result["deepfake_prob_full"]}
✅ 전체 딥페이크 여부: ${result["is_deepfake_full"]}

📈 평균 세그먼트 확률: ${result["mean_segment_prob"]}
🧠 세그먼트/최종 딥페이크 여부: ${result["is_deepfake_segment"]}
                    """.trimIndent()
                    tvResult.text = resultText
                } catch (e: Exception) {
                    Log.e("MainActivity", "딥 보이스 탐지 오류", e)
                    tvResult.text = "❌ 오류 발생: ${e.message}"
                }
            }

            btnPredictVoicePhishing.setOnClickListener {
                try {
                    val audioPath = "${filesDir.absolutePath}/${fileName}.wav"
                    val (result, transcribedText) = voicePhishingDetector.detect(audioPath)
                    tvResult.text = "보이스피싱 예측 결과: $result\n텍스트: $transcribedText"
                } catch (e: Exception) {
                    Log.e("MainActivity", "보이스피싱 탐지 오류", e)
                    tvResult.text = "❌ 오류: ${e.message}"
                }
            }

            // ✅ URL 탐지 버튼
            btnCheckUrl.setOnClickListener {
                val url = etUrlInput.text.toString().trim()
                if (url.isEmpty()) {
                    tvUrlResult.text = "URL을 입력하세요."
                    return@setOnClickListener
                }

                try {
                    val python = Python.getInstance()
                    val scalerPath = copyAssetToInternalStorage("scaler_params_v6.json")
                    val pyModule = python.getModule("extractor_url")

                    val result = pyModule.callAttr("extract_and_scale", url, scalerPath)
                    val featureVector = result.asList().map { it.toJava(Float::class.java) }.toFloatArray()

                    val inputBuffer = ByteBuffer.allocateDirect(4 * featureVector.size)
                    inputBuffer.order(ByteOrder.nativeOrder())
                    featureVector.forEach { inputBuffer.putFloat(it) }
                    inputBuffer.rewind()

                    val outputBuffer = ByteBuffer.allocateDirect(4)
                    outputBuffer.order(ByteOrder.nativeOrder())

                    // ✅ 실제 URL 모델로 추론
                    interpreterUrlDetector.run(inputBuffer, outputBuffer)
                    outputBuffer.rewind()
                    val resultProb = outputBuffer.float

                    val label = if (resultProb >= 0.5f) "⚠️ 악성 URL 의심됨" else "✅ 정상 URL"
                    tvUrlResult.text = """   
📌 입력 URL: $url
📊 악성 확률: ${"%.4f".format(resultProb)}
$label
""".trimIndent()

                } catch (e: Exception) {
                    Log.e("UrlCheck", "🔍 URL 검사 중 오류", e)
                    tvUrlResult.text = "❌ 오류 발생: ${e.message}"
                }
            }

        } catch (e: Exception) {
            Log.e("MainActivity", "초기화 오류", e)
            findViewById<TextView>(R.id.tvResult).text = "초기화 오류: ${e.message}"
        }
    }

    private fun loadModelFile(modelFileName: String): ByteBuffer {
        val fileDescriptor = assets.openFd(modelFileName)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength).apply {
            order(ByteOrder.nativeOrder())
        }
    }

    private fun copyAssetToInternalStorage(fileName: String): String {
        val outFile = File(filesDir, fileName)
        if (!outFile.exists()) {
            assets.open(fileName).use { input ->
                outFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
        return outFile.absolutePath
    }


    // ✅ 더 이상 사용하지 않음 (ONNX 제거됨)
    // private fun copyModelToInternalStorage(modelFileName: String): String { ... }
}
