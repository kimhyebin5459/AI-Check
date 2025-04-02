package com.example.myapplication

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import ai.onnxruntime.extensions.OrtxPackage
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import org.tensorflow.lite.Interpreter
import kotlinx.serialization.json.Json
import java.io.File
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel
import java.nio.FloatBuffer

class MainActivity : AppCompatActivity() {

    // 기존 음성 기반 모델 Interpreter
    private lateinit var interpreterDeepVoice: Interpreter
    private lateinit var interpreterVoicePhishing: Interpreter
    private lateinit var interpreterSTT: Interpreter
    private lateinit var aiTest: AiTest

    // STT 모델의 CTC 디코딩용 vocab
    private lateinit var wordToIndex: Map<String, Int>
    // 보이스피싱 모델 입력 시퀀스 최대 길이 (float32[1,5962])
    private val maxLength = 5962

    // URL 검사용 ONNX Runtime 변수
    private lateinit var ortEnv: OrtEnvironment
    private lateinit var ortSession: OrtSession

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        try {
            // 오디오 파일 복사 (assets/raw 에 있는 파일)
            copyAudioFileToInternalStorage("test_audio.wav")
            copyAudioFileToInternalStorage("test_audio21.wav")

            // 기존 TFLite 모델 로드
            interpreterDeepVoice = Interpreter(loadModelFile("model.tflite"))
            interpreterVoicePhishing = Interpreter(loadModelFile("model2.tflite"))
            interpreterSTT = Interpreter(loadModelFile("stt_float36.tflite"))

            // vocab.json 로드 (STT용)
            val vocabJson = assets.open("vocab.json").bufferedReader().use { it.readText() }
            wordToIndex = Json.decodeFromString(vocabJson)
            aiTest = AiTest(this)

            // 기존 버튼 초기화 (딥보이스, 보이스피싱 결과 표시)
            val btnPredictDeepVoice = findViewById<Button>(R.id.btnPredictDeepVoice)
            val btnPredictVoicePhishing = findViewById<Button>(R.id.btnPredictVoicePhishing)
            val tvResult = findViewById<TextView>(R.id.tvResult)

            btnPredictDeepVoice.setOnClickListener {
                try {
                    val audioPath = "${filesDir.absolutePath}/test_audio.wav"
                    val result = aiTest.predictMultimodalTfliteSegmented(audioPath, interpreterDeepVoice)
                    val resultText = """
                        Deep Voice Detection:
                        Basename: ${result["basename"]}
                        True Label: ${result["true_label"]}
                        Segment Probs: ${result["segment_probs"]}
                        Mean Segment Prob: ${result["mean_segment_prob"]}
                        Is Deepfake Segment: ${result["is_deepfake_segment"]}
                        Deepfake Prob Full: ${result["deepfake_prob_full"]}
                        Is Deepfake Full: ${result["is_deepfake_full"]}
                    """.trimIndent()
                    tvResult.text = resultText
                } catch (e: Exception) {
                    Log.e("MainActivity", "Deep Voice Detection error: ${e.message}")
                    tvResult.text = "Error: ${e.message}"
                }
            }

            btnPredictVoicePhishing.setOnClickListener {
                try {
                    val audioPath = "${filesDir.absolutePath}/test_audio21.wav"
                    val transcribedText = transcribeAudioWithTflite(audioPath)
                    Log.d("Debug", "transcribedText: $transcribedText")
                    // STT 결과를 공백 기준으로 토큰화하고 최대 maxLength(5962)개로 제한
                    val tokens = transcribedText.trim().split(" ").filter { it.isNotBlank() }.take(maxLength)
                    Log.d("Debug", "tokens.size: ${tokens.size}")
                    val sequence = tokens.map { wordToIndex[it] ?: 0 }
                    val paddedSequence = padSequence(sequence, maxLength)
                    Log.d("Debug", "paddedSequence.size: ${paddedSequence.size}")
                    val inputBuffer = convertSequenceToByteBuffer(paddedSequence, maxLength)
                    Log.d("Debug", "inputBuffer.capacity(): ${inputBuffer.capacity()}") // 예상: 23848 (4 * 5962)
                    val outputBuffer = Array(1) { FloatArray(2) }
                    interpreterVoicePhishing.run(inputBuffer, outputBuffer)
                    val prediction = outputBuffer[0]
                    val predictedClass = if (prediction[0] > prediction[1]) "정상" else "보이스피싱"
                    tvResult.text = "보이스피싱 예측 결과: $predictedClass\n텍스트: $transcribedText"
                } catch (e: Exception) {
                    Log.e("MainActivity", "Voice Phishing Detection error: ${e.message}")
                    tvResult.text = "Error: ${e.message}"
                }
            }

            // URL 검사 UI 요소 초기화
            val etUrlInput = findViewById<EditText>(R.id.etUrlInput)
            val btnCheckUrl = findViewById<Button>(R.id.btnCheckUrl)
            val tvUrlResult = findViewById<TextView>(R.id.tvUrlResult)

            // ONNX Runtime 초기화 및 ORT 모델 로드 (변환된 모델: urltest.ort)
            ortEnv = OrtEnvironment.getEnvironment()
            ortSession = ortEnv.createSession(loadOnnxModel("urltest.ort"), OrtSession.SessionOptions())

            btnCheckUrl.setOnClickListener {
                val url = etUrlInput.text.toString().trim()
                if (url.isEmpty()) {
                    tvUrlResult.text = "URL을 입력하세요."
                    return@setOnClickListener
                }
                try {
                    val features = preprocessUrl(url) // FloatArray 길이 21
                    val inputShape = longArrayOf(1, 21)
                    val inputTensor = OnnxTensor.createTensor(ortEnv, FloatBuffer.wrap(features), inputShape)
                    val outputMap = ortSession.run(mapOf("input" to inputTensor))
                    // 출력 텐서: "probabilities" (float32[1,2])
                    val probabilitiesTensor = outputMap["probabilities"] as OnnxTensor
                    val probs = probabilitiesTensor.floatBuffer.array()
                    val result = if (probs[1] > probs[0]) "불법 URL" else "정상 URL"
                    tvUrlResult.text = "검사 결과: $result\n(확률: ${probs.joinToString()})"
                } catch (e: Exception) {
                    Log.e("UrlTest", "URL 검사 중 오류: ${e.message}")
                    tvUrlResult.text = "오류: ${e.message}"
                }
            }

        } catch (e: Exception) {
            Log.e("MainActivity", "Initialization error: ${e.message}")
            findViewById<TextView>(R.id.tvResult).text = "초기화 오류: ${e.message}"
        }
    }

    /**
     * STT TFLite 모델을 이용해 음성 파일(WAV)을 텍스트로 변환하는 함수.
     * 입력: float32[1,768] (오디오의 처음 768 샘플, 부족 시 0패딩)
     * 출력: float32[1,2,56]
     */
    private fun transcribeAudioWithTflite(audioPath: String): String {
        val waveform = decodeAudio(audioPath)
        val inputSamples = if (waveform.size >= 768) {
            waveform.sliceArray(0 until 768)
        } else {
            FloatArray(768).apply { waveform.copyInto(this) }
        }
        val inputBuffer = ByteBuffer.allocateDirect(4 * 768).order(ByteOrder.nativeOrder())
        for (sample in inputSamples) {
            inputBuffer.putFloat(sample)
        }
        inputBuffer.rewind()
        val outputBuffer = Array(1) { Array(2) { FloatArray(56) } }
        interpreterSTT.run(inputBuffer, outputBuffer)
        return decodeCTC(outputBuffer[0])
    }

    /**
     * CTC 디코딩 (greedy 방식)
     * 각 타임스텝의 확률 벡터에서 argmax를 계산한 후, 중복과 0(blank) 제거
     * 출력 텐서의 shape: [timeSteps, vocabSize] (여기서 vocabSize는 56)
     */
    private fun decodeCTC(output: Array<FloatArray>): String {
        val argmax = output.map { probs -> probs.indices.maxByOrNull { index -> probs[index] } ?: 0 }
        val decoded = mutableListOf<Int>()
        var prev = -1
        for (idx in argmax) {
            if (idx != 0 && idx != prev) {
                decoded.add(idx)
            }
            prev = idx
        }
        val inverseWordToIndex = wordToIndex.entries.associate { it.value to it.key }
        return decoded.map { idx -> inverseWordToIndex[idx] ?: "" }.joinToString(" ")
    }

    /** WAV 파일을 디코딩하여 FloatArray로 반환 (헤더 44바이트 건너뜀) */
    private fun decodeAudio(filePath: String): FloatArray {
        val file = File(filePath)
        val bytes = file.readBytes()
        val dataBytes = bytes.copyOfRange(44, bytes.size)
        val numSamples = dataBytes.size / 2
        val samples = FloatArray(numSamples)
        val bb = ByteBuffer.wrap(dataBytes).order(ByteOrder.LITTLE_ENDIAN)
        for (i in 0 until numSamples) {
            samples[i] = bb.short.toFloat() / 32768.0f
        }
        return samples
    }

    /** 정수 시퀀스를 ByteBuffer로 변환 (각 int는 4바이트, 총 4*maxLength 바이트) */
    private fun convertSequenceToByteBuffer(sequence: List<Int>, maxLength: Int): ByteBuffer {
        val byteBuffer = ByteBuffer.allocateDirect(4 * maxLength).order(ByteOrder.nativeOrder())
        for (value in sequence) {
            byteBuffer.putInt(value)
        }
        byteBuffer.rewind()
        return byteBuffer
    }

    /** 시퀀스 패딩: 길이가 maxLength 미만이면 뒤에 0을 채웁니다. */
    private fun padSequence(sequence: List<Int>, maxLength: Int): List<Int> {
        return if (sequence.size >= maxLength) {
            sequence.subList(0, maxLength)
        } else {
            sequence + List(maxLength - sequence.size) { 0 }
        }
    }

    /** 모델 파일 로드: assets 내 모델 파일을 MappedByteBuffer로 읽어 반환 */
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

    /** ONNX 모델 파일 로드: assets에서 urltest.ort 파일을 읽어 ByteArray로 반환 */
    private fun loadOnnxModel(modelFileName: String): ByteArray {
        val fileDescriptor = assets.openFd(modelFileName)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        val byteArray = ByteArray(declaredLength.toInt())
        fileChannel.read(ByteBuffer.wrap(byteArray))
        inputStream.close()
        fileChannel.close()
        return byteArray
    }

    /** 오디오 파일 복사: assets/raw의 오디오 파일을 내부 저장소로 복사 */
    private fun copyAudioFileToInternalStorage(fileName: String) {
        val outFile = File(filesDir, fileName)
        if (!outFile.exists()) {
            val resId = resources.getIdentifier(fileName.replace(".wav", ""), "raw", packageName)
            if (resId != 0) {
                resources.openRawResource(resId).use { input ->
                    outFile.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
            } else {
                Log.e("MainActivity", "Audio resource not found: $fileName")
            }
        }
    }

    /**
     * URL 전처리 함수
     * 단순 예제로 URL의 앞 21문자를 아스키 코드 값으로 변환하여 길이 21의 FloatArray를 생성.
     * 실제 서비스에서는 URL의 특징을 추출하는 정교한 방법을 적용해야 함.
     */
    private fun preprocessUrl(url: String): FloatArray {
        val features = FloatArray(21) { 0f }
        val chars = url.take(21)
        for (i in chars.indices) {
            features[i] = chars[i].code.toFloat()
        }
        return features
    }
}
