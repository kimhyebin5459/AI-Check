package com.example.myapplication

import org.tensorflow.lite.flex.FlexDelegate
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import org.tensorflow.lite.Interpreter
import kotlinx.serialization.json.Json
import java.io.File
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel

class MainActivity : AppCompatActivity() {
    private lateinit var voicePhishingDetector: VoicePhishingDetector
    private lateinit var deepVoiceDetector: DeepVoiceDetectorWithChaquopy
    private lateinit var urlDetector: UrlDetector
    private lateinit var ortEnv: OrtEnvironment
    private lateinit var ortSession: OrtSession
    private lateinit var wordToIndex: Map<String, Int>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }

        try {
//            val fileName = "real 이시우 95님과 통화 3" //
//            val fileName = "realyu" //
            val fileName = "mixed_siu" //
//            val fileName = "fake 사탄" //
//            val fileName = "deep KsponSpeech_0023_KsponSpeech_022578_fake" //
//            val fileName = "fake generated_K05741143-AMG23-L1N2D1-E-K0KK-00555023" //
//            val fileName = "real K0001A013-BMG20-L1N2D1-E-K0KK-04705616" //
//            val fileName = "real K0001A013-BMG20-L1N2D1-E-K0KK-04705619"
            // 오디오 파일 복사
            copyAudioFileToInternalStorage("${fileName}.wav")

            // 모델 로드
            val interpreterDeepVoice = Interpreter(loadModelFile("deepvoice_model.tflite"))
            val interpreterVoicePhishing = Interpreter(loadModelFile("model2.tflite"))
            val interpreterSTT = Interpreter(loadModelFile("stt_float36.tflite"))

            // vocab.json 로드
            val vocabJson = assets.open("vocab.json").bufferedReader().use { it.readText() }
            wordToIndex = Json.decodeFromString(vocabJson)

            // URL 탐지 데이터 로드
            val keywordListJson = assets.open("keyword_list.json").bufferedReader().use { it.readText() }
            val keywordList = Json.decodeFromString<List<String>>(keywordListJson)
            val vocabUrlJson = assets.open("vectorizer_vocab.json").bufferedReader().use { it.readText() }
            val vocabUrl = Json.decodeFromString<Map<String, Int>>(vocabUrlJson)
            val scalerParamsJson = assets.open("scaler_params.json").bufferedReader().use { it.readText() }
            val scalerParams = Json.decodeFromString<ScalerParams>(scalerParamsJson)

            // ONNX 모델 로드
            val onnxModelPath = copyModelToInternalStorage("tfidf_1000_xgb_2000_2025_04_01_07_11_17_acc_9336_xgboost (1).onnx")
            ortEnv = OrtEnvironment.getEnvironment()
            ortSession = ortEnv.createSession(onnxModelPath, OrtSession.SessionOptions())

            // 탐지기 초기화
            voicePhishingDetector = VoicePhishingDetector(this, interpreterSTT, interpreterVoicePhishing, wordToIndex)
            deepVoiceDetector = DeepVoiceDetectorWithChaquopy(this, interpreterDeepVoice)
            urlDetector = UrlDetector(
                ortSession = ortSession,    // OrtSession
                ortEnv = ortEnv,            // OrtEnvironment
                keywordList = keywordList,  // List<String>
                vocab = vocabUrl,           // Map<String, Int>
                scalerParams = scalerParams // ScalerParams
            )

            // UI 요소
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
                    copyAudioFileToInternalStorage(audioFileName)
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
                    tvResult.text = """
                        
                        
                        
                        
                        
                        
                        보이스피싱 예측 결과: $result\n텍스트: $transcribedText""".trimIndent()
                } catch (e: Exception) {
                    Log.e("MainActivity", "보이스피싱 탐지 오류", e)
                    tvResult.text = "오류: ${e.message}"
                }
            }

            btnCheckUrl.setOnClickListener {
                val url = etUrlInput.text.toString().trim()
                if (url.isEmpty()) {
                    tvUrlResult.text = "URL을 입력하세요."
                    return@setOnClickListener
                }
                try {
                    val result = urlDetector.detect(url)
                    tvUrlResult.text = result
                } catch (e: Exception) {
                    Log.e("UrlTest", "URL 검사 중 오류", e)
                    tvUrlResult.text = "오류: ${e.message}"
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
        val mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
        mappedByteBuffer.order(ByteOrder.nativeOrder())
        inputStream.close()
        fileChannel.close()
        return mappedByteBuffer
    }

    private fun copyAudioFileToInternalStorage(fileName: String) {
        val outFile = File(filesDir, fileName)
        if (!outFile.exists()) {
            assets.open(fileName).use { input ->
                outFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
    }

    private fun copyModelToInternalStorage(modelFileName: String): String {
        val outFile = File(filesDir, modelFileName)
        if (!outFile.exists()) {
            assets.open(modelFileName).use { input ->
                outFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
        return outFile.absolutePath
    }
}