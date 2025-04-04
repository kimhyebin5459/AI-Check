package com.example.myapplication

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import com.chaquo.python.Python
import com.chaquo.python.PyObject
import org.tensorflow.lite.Interpreter
import java.io.File

class DeepVoiceDetector2(
    private val context: Context,
    private val interpreter: Interpreter
) {
    companion object {
        const val IMG_HEIGHT = 128
        const val IMG_WIDTH = 500
    }

    private fun loadImage(imagePath: String): Bitmap {
        val imgFile = File(imagePath)
        return BitmapFactory.decodeFile(imgFile.absolutePath)
    }

    private fun preprocessImage(image: Bitmap): Array<Array<Array<FloatArray>>> {
        val resizedImage = Bitmap.createScaledBitmap(image, IMG_WIDTH, IMG_HEIGHT, true)
        val inputArray = Array(1) { Array(IMG_HEIGHT) { Array(IMG_WIDTH) { FloatArray(1) } } }
        for (y in 0 until IMG_HEIGHT) {
            for (x in 0 until IMG_WIDTH) {
                val pixel = resizedImage.getPixel(x, y)
                val gray = (pixel and 0xFF).toFloat() / 255.0f
                inputArray[0][y][x][0] = gray
            }
        }
        return inputArray
    }

//    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any> {
//        val py = Python.getInstance()
//        val preprocess = py.getModule("preprocess")
//        val audioFile = File(audioFilePath)
//        val baseName = audioFile.nameWithoutExtension
//        val melImagePath = File(context.cacheDir, "${baseName}_mel.png").absolutePath // "${audioFile.parent}/$baseName" + "_mel.png"
//
//        // 🔁 1. Python 전처리 호출
//        val result: PyObject = preprocess.callAttr(
//            "process_audio_to_mel_and_features",
//            audioFilePath,
//            melImagePath
//        )
//
//        Log.d("DeepVoiceDetector", "📦 Python result: ${result.toString()}")
//
//        Log.d("DeepVoiceDetector", "📦 Python full vector result: ${result["full_vector"].toString()}")
//        Log.d("DeepVoiceDetector", "📦 Python full seg vector result: ${result["segment_vectors"].toString()}")
//        Log.d("DeepVoiceDetector", "📦 Python full full seq result: ${result["full_sequence"].toString()}")
//        Log.d("DeepVoiceDetector", "📦 Python full seg seq result: ${result["segment_sequences"].toString()}")
//
//
//        // 🔁 2. 이미지 로딩 및 TFLite 입력 형태로 변환
//        val imageBitmap = loadImage(melImagePath)
//        val imageInput = preprocessImage(imageBitmap)
////        val imageInputRaw = result["mel_image"]
////        val imageInput = Array(1) { Array(128) { Array(500) { FloatArray(1) } } }
//
////        imageInputRaw?.asList()?.let { rows ->
////            if (rows.size != 128) throw IllegalArgumentException("Invalid mel_image shape: expected 128 rows")
////
////            for (i in 0 until 128) {
////                val row = rows[i].asList()
////                if (row.size != 500) throw IllegalArgumentException("Invalid mel_image row[$i] width: expected 500")
////
////                for (j in 0 until 500) {
////                    val value = row[j].asList().getOrNull(0)?.toFloat()
////                        ?: throw IllegalStateException("Pixel at [$i][$j][0] is null")
////                    imageInput[0][i][j][0] = value
////                }
////            }
////        } ?: throw IllegalStateException("mel_image is null or unreadable")
//
//        val resultMap = result.asMap()
//
//        // 🔁 3. 전체 오디오 feature
//        val fullVector = resultMap["full_vector"]?.asList()?.map { it.toFloat() }?.toFloatArray()
//        val fullSequence = resultMap["full_sequence"]
//
//        if (fullVector == null || fullVector.isEmpty()) {
//            throw IllegalStateException("fullVector is null or empty")
//        }
//
//
//        val sequenceArray = Array(1) { Array(400) { FloatArray(128) } }
//        fullSequence?.asList()?.let { rows ->
//            for ((i, row) in rows.withIndex()) {
//                val rowList = row.asList().map { it.toFloat() }
//                sequenceArray[0][i] = rowList.toFloatArray()
//            }
//        }
//
//        val vectorArray = fullVector // Array(1) { fullVector }
//
//        // 🔁 4. 전체 추론
//        val output = Array(1) { FloatArray(2) }
//        interpreter.runForMultipleInputsOutputs(
//            arrayOf(sequenceArray, imageInput, vectorArray),
//            mapOf(0 to output)
//        )
//        val deepfakeProb = output[0][1]
//
//        // 🔁 5. Segment-level 추론 결과 수집용 변수
//        val segmentProbs = mutableListOf<Float>()
//
//        val segmentSequences = result["segment_sequences"]
//        val segmentVectors = result["segment_vectors"]
//
//        println("✅ vectorArray size: ${vectorArray?.size}")
//        println("✅ imageInput shape: [${imageInput.size}][${imageInput[0].size}][${imageInput[0][0].size}][${imageInput[0][0][0].size}]")
//        println("✅ sequenceArray shape: [${sequenceArray.size}][${sequenceArray[0].size}][${sequenceArray[0][0].size}]")
//
//
//        if (segmentSequences != null && segmentVectors != null) {
//            println("🔎 Segment-level predictions:")
//            val seqList = segmentSequences.asList()
//            val vecList = segmentVectors.asList()
//
//            for (i in seqList.indices) {
//                val segSeq = seqList[i].asList()
//                val segVec = (vecList[i].asList() as List<Number>).map { it.toFloat() }
//
//                val segSeqArray = Array(1) { Array(400) { FloatArray(128) } }
//                for ((j, row) in segSeq.withIndex()) {
//                    segSeqArray[0][j] = (row.asList() as List<Number>).map { it.toFloat() }.toFloatArray()
//                }
//
//                val segVecArray = Array(1) { segVec.toFloatArray() }
//                val segOutput = Array(1) { FloatArray(2) }
//
//                interpreter.runForMultipleInputsOutputs(
//                    arrayOf(segSeqArray, imageInput, segVecArray),
//                    mapOf(0 to segOutput)
//                )
//
//                val segProb = segOutput[0][1]
//                segmentProbs.add(segProb)
//                println("Segment #$i → Deepfake Prob: $segProb")
//            }
//        }
//
//        // 🔁 6. Segment-level 판단 기준 계산
//        val meanSegmentProb = if (segmentProbs.isNotEmpty()) segmentProbs.average().toFloat() else 0f
//        val isDeepfakeSegment = meanSegmentProb > threshold
//
//        return mapOf(
//            "basename" to baseName,
//            "true_label" to if (deepfakeProb > threshold) "‼️ Fake" else "✅ Real",
//            "segment_probs" to segmentProbs,
//            "mean_segment_prob" to meanSegmentProb,
//            "is_deepfake_segment" to isDeepfakeSegment,
//            "deepfake_prob_full" to deepfakeProb,
//            "is_deepfake_full" to (deepfakeProb > threshold)
//        )
//    }

    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any> {
        val py = Python.getInstance()
        val preprocess = py.getModule("preprocess")
        val audioFile = File(audioFilePath)
        val baseName = audioFile.nameWithoutExtension
        val melImagePath = File(context.cacheDir, "${baseName}_mel.png").absolutePath

        // 1. Python 전처리 호출
        val result: PyObject = preprocess.callAttr(
            "process_audio_to_mel_and_features",
            audioFilePath,
            melImagePath
        )

        val resultMap = result.asMap()

        // 🔍 디버깅용 로그 찍기
        for ((key, value) in resultMap) {
            Log.d("DeepVoiceDetector", "📦 key: ${key.toString()} → value type: ${value.javaClass}")
        }

        // 🔁 2. 이미지 로딩 및 TFLite 입력 변환
        val imageBitmap = loadImage(melImagePath)
        val imageInput = preprocessImage(imageBitmap)
        println(imageInput)

        // 🔁 3. 전체 오디오 feature 안전하게 추출
        val fullVectorKey = resultMap.keys.find { it.toString() == "full_vector" }
        val fullVector = fullVectorKey?.let {
            resultMap[it]?.asList()?.map { it.toFloat() }?.toFloatArray()
        }

        val fullSequenceKey = resultMap.keys.find { it.toString() == "full_sequence" }
        val fullSequence = fullSequenceKey?.let { resultMap[it] }

        val segVectorKey = resultMap.keys.find { it.toString() == "segment_vectors" }
        val segmentVectors = segVectorKey?.let { resultMap[it] }

        val segSeqKey = resultMap.keys.find { it.toString() == "segment_sequences" }
        val segmentSequences = segSeqKey?.let { resultMap[it] }

        if (fullVector == null || fullVector.isEmpty()) {
            throw IllegalStateException("fullVector is null or empty")
        }

        val sequenceArray = Array(1) { Array(400) { FloatArray(128) } }
        fullSequence?.asList()?.let { rows ->
            for ((i, row) in rows.withIndex()) {
                val rowList = row.asList().map { it.toFloat() }
                sequenceArray[0][i] = rowList.toFloatArray()
            }
        }

        val vectorArray = fullVector

        // 🔁 4. 전체 추론
        val output = Array(1) { FloatArray(2) }
        interpreter.runForMultipleInputsOutputs(
            arrayOf(sequenceArray, imageInput, vectorArray),
            mapOf(0 to output)
        )
        val deepfakeProb = output[0][1]

        // 🔁 5. Segment-level 추론
        val segmentProbs = mutableListOf<Float>()

        println("✅ vectorArray size: ${vectorArray.size}")
        println("✅ imageInput shape: [${imageInput.size}][${imageInput[0].size}][${imageInput[0][0].size}][${imageInput[0][0][0].size}]")
        println("✅ sequenceArray shape: [${sequenceArray.size}][${sequenceArray[0].size}][${sequenceArray[0][0].size}]")

        if (segmentSequences != null && segmentVectors != null) {
            println("🔎 Segment-level predictions:")
            val seqList = segmentSequences.asList()
            val vecList = segmentVectors.asList()

            for (i in seqList.indices) {
                val segSeq = seqList[i].asList()
                val segVec = vecList[i].asList().map { it.toFloat() }

                val segSeqArray = Array(1) { Array(400) { FloatArray(128) } }
                for ((j, row) in segSeq.withIndex()) {
                    segSeqArray[0][j] = row.asList().map { it.toFloat() }.toFloatArray()
                }

                val segVecArray = Array(1) { segVec.toFloatArray() }
                val segOutput = Array(1) { FloatArray(2) }

                interpreter.runForMultipleInputsOutputs(
                    arrayOf(segSeqArray, imageInput, segVecArray),
                    mapOf(0 to segOutput)
                )

                val segProb = segOutput[0][1]
                segmentProbs.add(segProb)
                println("Segment #$i → Deepfake Prob: $segProb")
            }
        }


        // 🔁 6. 최종 결과 정리
        val meanSegmentProb = if (segmentProbs.isNotEmpty()) segmentProbs.average().toFloat() else 0f
        val isDeepfakeSegment = meanSegmentProb > threshold

        return mapOf(
            "basename" to baseName,
            "true_label" to if (deepfakeProb > threshold) "‼️ Fake" else "✅ Real",
            "segment_probs" to segmentProbs,
            "mean_segment_prob" to meanSegmentProb,
            "is_deepfake_segment" to isDeepfakeSegment,
            "deepfake_prob_full" to deepfakeProb,
            "is_deepfake_full" to (deepfakeProb > threshold)
        )
    }

}
