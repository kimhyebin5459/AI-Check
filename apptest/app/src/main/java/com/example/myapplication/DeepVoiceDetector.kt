//package com.example.myapplication
//
//import android.content.Context
//import org.jtransforms.fft.FloatFFT_1D
//import org.tensorflow.lite.Interpreter
//import java.io.File
//import kotlin.math.*
//
//class DeepVoiceDetector(
//    private val context: Context,
//    private val interpreter: Interpreter
//) {
//    companion object {
//        const val MAX_LEN = 400
//        const val SAMPLE_RATE = 16000
//        const val FRAME_LENGTH = 512
//        const val FRAME_STEP = 256
//        const val N_MELS = 128
//        const val SEGMENT_DURATION = 4.0
//        const val TRIM_MARGIN_SEC = 0.0
//        const val IMG_HEIGHT = 128
//        const val IMG_WIDTH = 500
//    }
//
//    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any?> {
//        val waveform = Utils.decodeAudio(audioFilePath)
//        val segments = splitIntoSegments(waveform)
//        val segmentProbs = mutableListOf<Float>()
//        val fullVector = getVectorFeatures(waveform)
//        var fullSequence = getMelSequence(waveform)
//        fullSequence = padSequence(fullSequence, MAX_LEN)
//        val dummyImage = createDummyImage(IMG_WIDTH, IMG_HEIGHT)
//
//        if (segments.isNotEmpty()) {
//            segments.forEach { seg ->
//                val segVector = getVectorFeatures(seg)
//                var segSequence = getMelSequence(seg)
//                if (segSequence.isEmpty()) return@forEach
//                segSequence = padSequence(segSequence, MAX_LEN)
//                val segSequenceInput = arrayOf(segSequence)
//                val dummyImageInput = arrayOf(dummyImage)
//                val segVectorInput = arrayOf(segVector)
//                val inputArray = arrayOf(segSequenceInput, dummyImageInput, segVectorInput)
//                val outputBuffer = Array(1) { FloatArray(2) }
//                interpreter.runForMultipleInputsOutputs(inputArray, mapOf(0 to outputBuffer))
//                segmentProbs.add(outputBuffer[0][1])
//            }
//        }
//
//        val meanProb = if (segmentProbs.isNotEmpty()) segmentProbs.average().toFloat() else 0f
//        val isDeepfakeSegment = if (segmentProbs.isNotEmpty()) meanProb > threshold else false
//
//        val fullSequenceInput = arrayOf(fullSequence)
//        val dummyImageInput = arrayOf(dummyImage)
//        val fullVectorInput = arrayOf(fullVector)
//        val fullInputArray = arrayOf(fullSequenceInput, dummyImageInput, fullVectorInput)
//        val fullOutputBuffer = Array(1) { FloatArray(2) }
//        interpreter.runForMultipleInputsOutputs(fullInputArray, mapOf(0 to fullOutputBuffer))
//        val deepfakeProbFull = fullOutputBuffer[0][1]
//        val isDeepfakeFull = deepfakeProbFull > threshold
//
//        val basename = File(audioFilePath).name
//        val trueLabel = if (basename.lowercase().contains("real")) "✅ Real" else "‼️ Fake or Mixed"
//
//        return mapOf(
//            "basename" to basename,
//            "true_label" to trueLabel,
//            "segment_probs" to segmentProbs,
//            "mean_segment_prob" to meanProb,
//            "is_deepfake_segment" to isDeepfakeSegment,
//            "deepfake_prob_full" to deepfakeProbFull,
//            "is_deepfake_full" to isDeepfakeFull
//        )
//    }
//
//    private fun splitIntoSegments(waveform: FloatArray): List<FloatArray> {
//        val segmentSamples = (SAMPLE_RATE * SEGMENT_DURATION).toInt()
//        val marginSamples = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()
//        val totalSamples = waveform.size
//        val trimmedWaveform = if (totalSamples > 3 * marginSamples) {
//            waveform.copyOfRange(marginSamples, totalSamples - marginSamples)
//        } else waveform
//        val segments = mutableListOf<FloatArray>()
//        var start = 0
//        while (start < trimmedWaveform.size) {
//            val end = min(start + segmentSamples, trimmedWaveform.size)
//            val segment = trimmedWaveform.copyOfRange(start, end)
//            if (segment.size >= FRAME_LENGTH) segments.add(segment)
//            start += segmentSamples
//        }
//        return segments
//    }
//
//    private fun getVectorFeatures(waveform: FloatArray): FloatArray {
//        val energy = waveform.map { it * it }.average().toFloat()
//        var zeroCrossings = 0
//        for (i in 0 until waveform.size - 1) if (waveform[i] * waveform[i + 1] < 0) zeroCrossings++
//        val zcr = zeroCrossings.toFloat() / (waveform.size - 1)
//        val maxAmp = waveform.maxOrNull()?.let { abs(it) } ?: 0f
//        val meanAmp = waveform.average().toFloat()
//        val stdAmp = sqrt(waveform.map { (it - meanAmp).pow(2) }.average()).toFloat()
//        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp) + FloatArray(5) { 0f }
//    }
//
//    private fun getMelSequence(waveform: FloatArray): Array<FloatArray> {
//        val numFrames = ((waveform.size - FRAME_LENGTH) / FRAME_STEP) + 1
//        if (numFrames <= 0) return emptyArray()
//        val n_fft_bins = FRAME_LENGTH / 2 + 1
//        val melFilterBanks = computeMelFilterBanks(N_MELS, n_fft_bins, SAMPLE_RATE, FRAME_LENGTH)
//        val fft = FloatFFT_1D(FRAME_LENGTH.toLong())
//        val melSpectrogram = Array(numFrames) { FloatArray(N_MELS) { 0f } }
//
//        for (i in 0 until numFrames) {
//            val start = i * FRAME_STEP
//            val frame = if (start + FRAME_LENGTH <= waveform.size) {
//                waveform.sliceArray(start until start + FRAME_LENGTH)
//            } else {
//                FloatArray(FRAME_LENGTH) { if (it + start < waveform.size) waveform[start + it] else 0f }
//            }
//            val windowedFrame = applyHanningWindow(frame)
//            val fftData = windowedFrame.copyOf()
//            fft.realForward(fftData)
//            val magnitude = FloatArray(n_fft_bins)
//            magnitude[0] = abs(fftData[0])
//            for (k in 1 until FRAME_LENGTH / 2) {
//                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
//            }
//            magnitude[FRAME_LENGTH / 2] = abs(fftData[1])
//            for (m in 0 until N_MELS) {
//                melSpectrogram[i][m] = ln(melFilterBanks[m].mapIndexed { k, v -> magnitude[k] * v }.sum() + 1e-6f)
//            }
//        }
//        return melSpectrogram
//    }
//
//    private fun computeMelFilterBanks(n_mels: Int, n_fft_bins: Int, sampleRate: Int, frameLength: Int): Array<FloatArray> {
//        val lowFreq = 0f
//        val highFreq = sampleRate / 2f
//        fun hzToMel(hz: Float): Float = 2595f * log10(1 + hz / 700f)
//        fun melToHz(mel: Float): Float = 700f * (10f.pow(mel / 2595f) - 1)
//        val lowMel = hzToMel(lowFreq)
//        val highMel = hzToMel(highFreq)
//        val melPoints = FloatArray(n_mels + 2) { lowMel + (highMel - lowMel) * it / (n_mels + 1) }
//        val hzPoints = melPoints.map { melToHz(it) }.toFloatArray()
//        val bin = hzPoints.map { floor((n_fft_bins - 1) * it / highFreq) }.toFloatArray()
//        val filterBanks = Array(n_mels) { FloatArray(n_fft_bins) { 0f } }
//        for (m in 1..n_mels) {
//            val f_m_minus = bin[m - 1]
//            val f_m = bin[m]
//            val f_m_plus = bin[m + 1]
//            for (k in 0 until n_fft_bins) {
//                filterBanks[m - 1][k] = when {
//                    k < f_m_minus -> 0f
//                    k <= f_m -> (k - f_m_minus) / (f_m - f_m_minus + 1e-6f)
//                    k <= f_m_plus -> (f_m_plus - k) / (f_m_plus - f_m + 1e-6f)
//                    else -> 0f
//                }
//            }
//        }
//        return filterBanks
//    }
//
//    private fun applyHanningWindow(frame: FloatArray): FloatArray {
//        val N = frame.size
//        return FloatArray(N) { frame[it] * (0.5f * (1 - cos(2 * PI * it / (N - 1)).toFloat())) }
//    }
//
//    private fun padSequence(sequence: Array<FloatArray>, maxLen: Int): Array<FloatArray> {
//        if (sequence.isEmpty()) return Array(maxLen) { FloatArray(N_MELS) { 0f } }
//        val currentLen = sequence.size
//        val n_mels = sequence[0].size
//        return if (currentLen >= maxLen) {
//            sequence.sliceArray(0 until maxLen)
//        } else {
//            Array(maxLen) { if (it < currentLen) sequence[it] else FloatArray(n_mels) { 0f } }
//        }
//    }
//
//    private fun createDummyImage(width: Int, height: Int): Array<Array<FloatArray>> {
//        return Array(height) { Array(width) { floatArrayOf(0f) } }
//    }
//}

//package com.example.myapplication
//
//import android.content.Context
//import org.jtransforms.fft.FloatFFT_1D
//import org.tensorflow.lite.Interpreter
//import java.io.File
//import kotlin.math.*
//
//class DeepVoiceDetector(
//    private val context: Context,
//    private val interpreter: Interpreter
//) {
//    companion object {
//        const val SAMPLE_RATE = 16000
//        const val SEGMENT_SEC = 4.0f
//        const val TRIM_MARGIN_SEC = 0.5f
//        const val FRAME_LENGTH = 512
//        const val FRAME_STEP = 256
//        const val N_MELS = 128
//        const val SEQUENCE_LEN = 400
//        const val IMG_HEIGHT = 128
//        const val IMG_WIDTH = 500
//    }
//
//    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any?> {
//        val audioFile = File(audioFilePath)
//        val basename = audioFile.name
//        val trueLabel = when {
//            "real" in basename.lowercase() -> "✅ Real"
//            "fake" in basename.lowercase() -> "‼️ Fake"
//            "mixed" in basename.lowercase() -> "⚠️ Mixed"
//            else -> "알 수 없음"
//        }
//
//        val waveform = decodeWavMono(audioFile)
//        val segments = splitSegments(waveform)
//
//        val fullVector = extractVectorFeatures(waveform)
//        val fullSequence = padSequence(extractMelSequence(waveform))
//        val dummyImage = createDummyImage()
//
//        val segmentProbs = mutableListOf<Float>()
//        for (seg in segments) {
//            val segVector = extractVectorFeatures(seg)
//            val segSequence = padSequence(extractMelSequence(seg))
//            val prob = infer(segSequence, dummyImage, segVector)
//            segmentProbs.add(prob)
//        }
//
//        val meanSegProb = segmentProbs.average().toFloat()
//        val isDeepfakeSegment = isDeepfakeBySegments(segmentProbs)
//
//        val fullProb = infer(fullSequence, dummyImage, fullVector)
//        val isDeepfakeFull = fullProb > threshold
//
//        return mapOf(
//            "basename" to basename,
//            "true_label" to trueLabel,
//            "segment_probs" to segmentProbs,
//            "mean_segment_prob" to meanSegProb,
//            "is_deepfake_segment" to isDeepfakeSegment,
//            "deepfake_prob_full" to fullProb,
//            "is_deepfake_full" to isDeepfakeFull
//        )
//    }
//
//    private fun infer(seq: Array<Array<FloatArray>>, img: Array<Array<FloatArray>>, vec: FloatArray): Float {
//        val output = Array(128) { FloatArray(2) }
//        val inputs = arrayOf(seq, img, vec)
//
//        val outputs = mapOf(0 to output)
//        interpreter.runForMultipleInputsOutputs(inputs, outputs)
//        return output[0][1]
//    }
//
//    private fun decodeWavMono(file: File): FloatArray {
//        val input = file.inputStream().buffered()
//        val header = ByteArray(44)
//        input.read(header)
//        val data = input.readBytes()
//        val floatBuffer = FloatArray(data.size / 2)
//        var i = 0
//        while (i < data.size - 1) {
//            val low = data[i].toInt() and 0xFF
//            val high = data[i + 1].toInt()
//            val sample = (high shl 8) or low
//            floatBuffer[i / 2] = sample / 32768.0f
//            i += 2
//        }
//        return floatBuffer
//    }
//
//    private fun splitSegments(waveform: FloatArray): List<FloatArray> {
//        val segSize = (SAMPLE_RATE * SEGMENT_SEC).toInt()
//        val margin = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()
//
//        val trimmed = if (waveform.size > 3 * margin) {
//            waveform.sliceArray(margin until waveform.size - margin)
//        } else {
//            println("⚠️ Warning: Too short to trim margins. Using original waveform.")
//            waveform
//        }
//
//        val segments = mutableListOf<FloatArray>()
////        var start = 0
////        while (start < trimmed.size) {
////            val end = min(start + segSize, trimmed.size)
////            val segment = trimmed.sliceArray(start until end)
////            if (segment.size >= 256) segments.add(segment)
////            start += segSize
////        }
//
//        for (start in 0 until trimmed.size step segSize) {
//            val end = min(start + segSize, trimmed.size)
//            val segment = trimmed.sliceArray(start until end)
//            if (segment.size >= 256) segments.add(segment)  // 최소 STFT 조건 유지
//        }
//
//        return segments
//    }
//
//    private fun extractMelSequence(waveform: FloatArray): Array<FloatArray> {
//        val numFrames = ((waveform.size - FRAME_LENGTH) / FRAME_STEP) + 1
//        if (numFrames <= 0) return emptyArray()
//        val melFilters = computeMelFilters()
//        val fft = FloatFFT_1D(FRAME_LENGTH.toLong())
//        val melSpectrogram = Array(numFrames) { FloatArray(N_MELS) }
//
//        for (i in 0 until numFrames) {
//            val start = i * FRAME_STEP
//            val frame = waveform.sliceArray(start until (start + FRAME_LENGTH))
//            val windowed = applyHannWindow(frame)
//            val fftData = windowed.copyOf()
//            fft.realForward(fftData)
//            val magnitude = FloatArray(FRAME_LENGTH / 2 + 1)
//            magnitude[0] = abs(fftData[0])
//            for (k in 1 until FRAME_LENGTH / 2) {
//                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
//            }
//            magnitude[FRAME_LENGTH / 2] = abs(fftData[1])
//            for (m in 0 until N_MELS) {
//                melSpectrogram[i][m] = ln(melFilters[m].mapIndexed { k, v -> magnitude[k] * v }.sum() + 1e-6f)
//            }
//        }
//        return melSpectrogram
//    }
//
//    private fun computeMelFilters(): Array<FloatArray> {
//        fun hzToMel(hz: Float) = 2595f * log10(1 + hz / 700f)
//        fun melToHz(mel: Float) = 700f * (10f.pow(mel / 2595f) - 1)
//        val lowMel = hzToMel(0f)
//        val highMel = hzToMel(SAMPLE_RATE / 2f)
//        val melPoints = FloatArray(N_MELS + 2) { i -> lowMel + (highMel - lowMel) * i / (N_MELS + 1) }
//        val hzPoints = melPoints.map { melToHz(it) }
//        val bin = hzPoints.map { floor((FRAME_LENGTH + 1) * it / SAMPLE_RATE).toInt() }
//        val filters = Array(N_MELS) { FloatArray(FRAME_LENGTH / 2 + 1) }
//        for (m in 1 until bin.size - 1) {
//            val left = bin[m - 1]
//            val center = bin[m]
//            val right = bin[m + 1]
//            for (k in left until center) filters[m - 1][k] = (k - left).toFloat() / (center - left)
//            for (k in center until right) filters[m - 1][k] = (right - k).toFloat() / (right - center)
//        }
//        return filters
//    }
//
//    private fun extractVectorFeatures(waveform: FloatArray): FloatArray {
//        val energy = waveform.map { it * it }.average().toFloat()
//        val zcr = waveform.toList().zipWithNext().count { it.first * it.second < 0 }.toFloat() / waveform.size
//        val maxAmp = waveform.maxOrNull() ?: 0f
//        val meanAmp = waveform.average().toFloat()
//        val stdAmp = waveform.fold(0.0) { acc, f -> acc + (f - meanAmp).pow(2) }.let { sqrt(it / waveform.size).toFloat() }
//        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp, 0f, 0f, 0f, 0f, 0f)
//    }
//
////    private fun padSequence(seq: Array<FloatArray>): Array<Array<FloatArray>> {
////        val padded = Array(SEQUENCE_LEN) { FloatArray(N_MELS) { 0f } }
////        for (i in seq.indices) if (i < SEQUENCE_LEN) padded[i] = seq[i]
////        return arrayOf(padded.sliceArray(0 until SEQUENCE_LEN))  // 명시적 슬라이싱
////    }
//    private fun padSequence(seq: Array<FloatArray>): Array<Array<FloatArray>> {
//        return if (seq.size >= SEQUENCE_LEN) {
//            val trimmed = seq.sliceArray(0 until SEQUENCE_LEN)
//            arrayOf(trimmed)
//        } else {
//            val padded = Array(SEQUENCE_LEN) { FloatArray(N_MELS) { 0f } }
//            for (i in seq.indices) {
//                padded[i] = seq[i]
//            }
//            arrayOf(padded)
//        }
//    }
//
//
//
//    private fun createDummyImage(): Array<Array<FloatArray>> {
//        return Array(IMG_HEIGHT) { Array(IMG_WIDTH) { floatArrayOf(0f) } }
//    }
//
//    private fun applyHannWindow(frame: FloatArray): FloatArray {
//        return FloatArray(frame.size) { i ->
//            frame[i] * (0.5f - 0.5f * cos(2.0 * Math.PI * i / frame.size).toFloat())
//        }
//    }
//
//    private fun isFlatFake(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        val std = probs.map { (it - mean).pow(2) }.average().let { sqrt(it).toFloat() }
//        val max = probs.maxOrNull() ?: 0f
//        return mean < 0.01f && std < 0.003f && max > 0.005f
//    }
//
//    private fun isDeepfakeBySegments(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        if (mean > 0.4f) return true
//        if (probs.count { it > 0.9f } >= 2) return true
//        if (isFlatFake(probs)) return true
//        return false
//    }
//}




package com.example.myapplication

import android.content.Context
import android.graphics.Color
import org.jtransforms.fft.FloatFFT_1D
import org.tensorflow.lite.Interpreter
import java.io.File
import kotlin.math.*

class DeepVoiceDetector(
    private val context: Context,
    private val interpreter: Interpreter
) {
    companion object {
        const val SAMPLE_RATE = 16000
        const val SEGMENT_SEC = 4.0f
        const val TRIM_MARGIN_SEC = 0.0f
        const val FRAME_LENGTH = 512
        const val FRAME_STEP = 256
        const val N_MELS = 128
        const val SEQUENCE_LEN = 400
        const val IMG_HEIGHT = 128
        const val IMG_WIDTH = 500
    }

    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any?> {
        val audioFile = File(audioFilePath)
        val basename = audioFile.name
        val trueLabel = when {
            "real" in basename.lowercase() -> "✅ Real"
            "fake" in basename.lowercase() -> "‼️ Fake"
            "mixed" in basename.lowercase() -> "⚠️ Mixed"
            else -> "Unknown"
        }

        val waveform = decodeWavMono(audioFile)
        val segments = splitSegments(waveform)

        val fullVector = extractVectorFeatures(waveform)
        val fullSequence = padSequence(extractMelSequence(waveform))

        val melImageFile = File(context.cacheDir, "${basename}_mel.png")
        MelSpectrogramGenerator.generateMelImage(waveform, melImageFile)
        val fullImage = decodeMelImageAsTensor(melImageFile)

        val segmentProbs = mutableListOf<Float>()
        for (seg in segments) {
            val segVector = extractVectorFeatures(seg)
            val segSequence = padSequence(extractMelSequence(seg))
            val prob = infer(segSequence, fullImage, segVector)
            segmentProbs.add(prob)
        }

        val meanSegProb = segmentProbs.average().toFloat()
        val isDeepfakeSegment = isDeepfakeBySegments(segmentProbs)

        val fullProb = infer(fullSequence, fullImage, fullVector)
        val isDeepfakeFull = fullProb > threshold

        return mapOf(
            "basename" to basename,
            "true_label" to trueLabel,
            "segment_probs" to segmentProbs,
            "mean_segment_prob" to meanSegProb,
            "is_deepfake_segment" to isDeepfakeSegment,
            "deepfake_prob_full" to fullProb,
            "is_deepfake_full" to isDeepfakeFull
        )
    }

    private fun infer(seq: Array<Array<FloatArray>>, img: Array<Array<FloatArray>>, vec: FloatArray): Float {
        val output = Array(128) { FloatArray(2) }
        val inputs = arrayOf(seq, img, vec)
        val outputs = mapOf(0 to output)
        interpreter.runForMultipleInputsOutputs(inputs, outputs)
        return output[0][1]
    }

    private fun ByteArray.indexOf(subArray: ByteArray): Int {
        outer@ for (i in 0..this.size - subArray.size) {
            for (j in subArray.indices) {
                if (this[i + j] != subArray[j]) continue@outer
            }
            return i
        }
        return -1
    }

    private fun decodeWavMono(file: File): FloatArray {
        val wavBytes = file.readBytes()

        // 22~23: 채널 수 (Little Endian)
        val numChannels = ((wavBytes[23].toInt() and 0xFF) shl 8) or (wavBytes[22].toInt() and 0xFF)

        // 24~27: 샘플레이트
        val sampleRate = ((wavBytes[27].toInt() and 0xFF) shl 24) or
                ((wavBytes[26].toInt() and 0xFF) shl 16) or
                ((wavBytes[25].toInt() and 0xFF) shl 8) or
                (wavBytes[24].toInt() and 0xFF)
        println("📻 Sample rate: $sampleRate Hz")

        // 'data' 청크 찾기
        val dataIndex = wavBytes.indexOf("data".toByteArray())
        if (dataIndex == -1) throw IllegalArgumentException("data chunk not found")

        val dataSize = ((wavBytes[dataIndex + 7].toInt() and 0xFF) shl 24) or
                ((wavBytes[dataIndex + 6].toInt() and 0xFF) shl 16) or
                ((wavBytes[dataIndex + 5].toInt() and 0xFF) shl 8) or
                (wavBytes[dataIndex + 4].toInt() and 0xFF)

        val pcmStart = dataIndex + 8
        val pcmBytes = wavBytes.sliceArray(pcmStart until pcmStart + dataSize)

        val totalFrames = pcmBytes.size / 2 / numChannels // 2 bytes per sample
        val floatBuffer = FloatArray(totalFrames)

        // 첫 번째 채널 샘플만 추출
        for (i in 0 until totalFrames) {
            val frameStart = i * 2 * numChannels
            val lo = pcmBytes[frameStart].toInt() and 0xFF
            val hi = pcmBytes[frameStart + 1].toInt()
            val sample = (hi shl 8) or lo
            floatBuffer[i] = sample.toShort() / 32768f
        }



        println("🎧 [Fixed] Kotlin decoded waveform length: ${floatBuffer.size} samples")
//        return floatBuffer
        val resampled = resampleLinear(floatBuffer, sampleRate, SAMPLE_RATE)
        return resampled
    }

    private fun resampleLinear(waveform: FloatArray, originalRate: Int, targetRate: Int): FloatArray {
        if (originalRate == targetRate) return waveform

        val ratio = targetRate.toDouble() / originalRate
        val newLength = (waveform.size * ratio).toInt()
        val resampled = FloatArray(newLength)

        for (i in resampled.indices) {
            val srcIndex = i / ratio
            val i0 = srcIndex.toInt()
            val i1 = min(i0 + 1, waveform.size - 1)
            val frac = srcIndex - i0
            resampled[i] = (1 - frac).toFloat() * waveform[i0] + frac.toFloat() * waveform[i1]
        }

        println("🔁 Resampled from $originalRate to $targetRate → ${resampled.size} samples")
        return resampled
    }



    private fun splitSegments(waveform: FloatArray): List<FloatArray> {
        val segmentSamples = (SAMPLE_RATE * SEGMENT_SEC).toInt()
        val marginSamples = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()

        val trimmed = if (waveform.size > 3 * marginSamples) {
            waveform.sliceArray(marginSamples until waveform.size - marginSamples)
        } else {
            waveform
        }

        val segments = mutableListOf<FloatArray>()
        for (start in 0 until trimmed.size step segmentSamples) {
            val end = start + segmentSamples
            val segment = if (end <= trimmed.size) {
                trimmed.sliceArray(start until end)
            } else {
                trimmed.sliceArray(start until trimmed.size)
            }
            if (segment.size >= 256) {
                segments.add(segment)
            }
        }
        return segments
    }

    private fun extractMelSequence(waveform: FloatArray): Array<FloatArray> {
        val numFrames = ((waveform.size - FRAME_LENGTH) / FRAME_STEP) + 1
        if (numFrames <= 0) return emptyArray()
        val melFilters = computeMelFilters()
        val fft = FloatFFT_1D(FRAME_LENGTH.toLong())
        val melSpectrogram = Array(numFrames) { FloatArray(N_MELS) }

        for (i in 0 until numFrames) {
            val start = i * FRAME_STEP
            val frame = waveform.sliceArray(start until (start + FRAME_LENGTH))
            val windowed = applyHannWindow(frame)
            val fftData = windowed.copyOf()
            fft.realForward(fftData)
            val magnitude = FloatArray(FRAME_LENGTH / 2 + 1)
            magnitude[0] = abs(fftData[0])
            for (k in 1 until FRAME_LENGTH / 2) {
                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
            }
            magnitude[FRAME_LENGTH / 2] = abs(fftData[1])
            for (m in 0 until N_MELS) {
                val energy = melFilters[m].indices.fold(0f) { acc, k -> acc + magnitude[k] * melFilters[m][k] }
                melSpectrogram[i][m] = ln(energy + 1e-6f)
            }
        }
        return melSpectrogram
    }

    private fun computeMelFilters(): Array<FloatArray> {
        fun hzToMel(hz: Float) = 2595f * log10(1 + hz / 700f)
        fun melToHz(mel: Float) = 700f * (10f.pow(mel / 2595f) - 1)
        val lowMel = hzToMel(0f)
        val highMel = hzToMel(SAMPLE_RATE / 2f)
        val melPoints = FloatArray(N_MELS + 2) { i -> lowMel + (highMel - lowMel) * i / (N_MELS + 1) }
        val hzPoints = melPoints.map { melToHz(it) }
        val bin = hzPoints.map { floor((FRAME_LENGTH + 1) * it / SAMPLE_RATE).toInt() }
        val filters = Array(N_MELS) { FloatArray(FRAME_LENGTH / 2 + 1) }
        for (m in 1 until bin.size - 1) {
            val left = bin[m - 1]
            val center = bin[m]
            val right = bin[m + 1]
            for (k in left until center) filters[m - 1][k] = (k - left).toFloat() / (center - left)
            for (k in center until right) filters[m - 1][k] = (right - k).toFloat() / (right - center)
        }
        return filters
    }

    private fun extractVectorFeatures(waveform: FloatArray): FloatArray {
        val energy = waveform.map { it * it }.average().toFloat()
        var zeroCrossings = 0
        for (i in 1 until waveform.size) {
            if (waveform[i - 1] * waveform[i] < 0) {
                zeroCrossings++
            }
        }
        val zcr = zeroCrossings.toFloat() / waveform.size
        val maxAmp = waveform.maxOrNull() ?: 0f
        val meanAmp = waveform.average().toFloat()
        val stdAmp = waveform.fold(0.0) { acc, f -> acc + (f - meanAmp).pow(2) }.let { sqrt(it / waveform.size).toFloat() }
        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp, 0f, 0f, 0f, 0f, 0f)
    }

    private fun padSequence(seq: Array<FloatArray>): Array<Array<FloatArray>> {
        val padded = Array(SEQUENCE_LEN) { FloatArray(N_MELS) { 0f } }
        for (i in seq.indices) {
            if (i < SEQUENCE_LEN) {
                padded[i] = seq[i]
            }
        }
        return arrayOf(padded)
    }

    private fun decodeMelImageAsTensor(imageFile: File): Array<Array<FloatArray>> {
        val bitmap = android.graphics.BitmapFactory.decodeFile(imageFile.absolutePath)
        val height = bitmap.height
        val width = bitmap.width

        val imageTensor = Array(height) { y ->
            Array(width) { x ->
                val pixel = bitmap.getPixel(x, y)
                val r = Color.red(pixel) / 255f
                floatArrayOf(r) // 흑백이므로 하나만
            }
        }
        return imageTensor
    }


    private fun applyHannWindow(frame: FloatArray): FloatArray {
        return FloatArray(frame.size) { i -> frame[i] * (0.5f - 0.5f * cos(2.0 * Math.PI * i / frame.size).toFloat()) }
    }

    private fun isFlatFake(probs: List<Float>): Boolean {
        val mean = probs.average().toFloat()
        val std = probs.map { (it - mean).pow(2) }.average().let { sqrt(it).toFloat() }
        val max = probs.maxOrNull() ?: 0f
        return mean < 0.01f && std < 0.003f && max > 0.005f
    }

    private fun isDeepfakeBySegments(probs: List<Float>): Boolean {
        val mean = probs.average().toFloat()
        if (mean > 0.4f) return true
        if (probs.count { it > 0.9f } >= 2) return true
        if (isFlatFake(probs)) return true
        return false
    }
}





//package com.example.myapplication
//
//import android.content.Context
//import org.jtransforms.fft.FloatFFT_1D
//import org.tensorflow.lite.Interpreter
//import java.io.File
//import kotlin.math.*
//
//class DeepVoiceDetector(
//    private val context: Context,
//    private val interpreter: Interpreter
//) {
//    companion object {
//        const val SAMPLE_RATE = 16000
//        const val SEGMENT_SEC = 4.0f
//        const val TRIM_MARGIN_SEC = 0.0f
//        const val FRAME_LENGTH = 512
//        const val FRAME_STEP = 256
//        const val N_MELS = 128
//        const val SEQUENCE_LEN = 400
//        const val IMG_HEIGHT = 128
//        const val IMG_WIDTH = 500
//    }
//
//    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any?> {
//        val audioFile = File(audioFilePath)
//        val basename = audioFile.name
//        val trueLabel = when {
//            "real" in basename.lowercase() -> "✅ Real"
//            "fake" in basename.lowercase() -> "‼️ Fake"
//            "mixed" in basename.lowercase() -> "⚠️ Mixed"
//            else -> "Unknown"
//        }
//
//        val waveform = decodeWavMono(audioFile)
//        val segments = splitSegments(waveform)
//
//        val fullVector = extractVectorFeatures(waveform)
//        val fullSequence = padSequence(extractMelSequence(waveform))
//        val dummyImage = createDummyImage()
//
//        val segmentProbs = mutableListOf<Float>()
//        for (seg in segments) {
//            val segVector = extractVectorFeatures(seg)
//            val segSequence = padSequence(extractMelSequence(seg))
//            val prob = infer(segSequence, dummyImage, segVector)
//            segmentProbs.add(prob)
//        }
//
//        val meanSegProb = segmentProbs.average().toFloat()
//        val isDeepfakeSegment = isDeepfakeBySegments(segmentProbs)
//
//        val fullProb = infer(fullSequence, dummyImage, fullVector)
//        val isDeepfakeFull = fullProb > threshold
//
//        return mapOf(
//            "basename" to basename,
//            "true_label" to trueLabel,
//            "segment_probs" to segmentProbs,
//            "mean_segment_prob" to meanSegProb,
//            "is_deepfake_segment" to isDeepfakeSegment,
//            "deepfake_prob_full" to fullProb,
//            "is_deepfake_full" to isDeepfakeFull
//        )
//    }
//
//    private fun infer(seq: Array<Array<FloatArray>>, img: Array<Array<FloatArray>>, vec: FloatArray): Float {
//        val output = Array(128) { FloatArray(2) }
//        val inputs = arrayOf(seq, img, vec)
//        val outputs = mapOf(0 to output)
//        interpreter.runForMultipleInputsOutputs(inputs, outputs)
//        return output[0][1]
//    }
//
//    private fun ByteArray.indexOf(subArray: ByteArray): Int {
//        outer@ for (i in 0..this.size - subArray.size) {
//            for (j in subArray.indices) {
//                if (this[i + j] != subArray[j]) continue@outer
//            }
//            return i
//        }
//        return -1
//    }
//
////    private fun decodeWavMono(file: File): FloatArray {
////        val wavBytes = file.readBytes()
////        val dataChunkOffset = listOf("data", "DATA")
////            .map { wavBytes.indexOf(it.toByteArray()) }
////            .firstOrNull { it != -1 } ?: throw IllegalArgumentException("WAV data chunk not found")
////
////        val dataSizeStart = dataChunkOffset + 4
////        val dataSize = ((wavBytes[dataSizeStart + 3].toInt() and 0xFF) shl 24) or
////                ((wavBytes[dataSizeStart + 2].toInt() and 0xFF) shl 16) or
////                ((wavBytes[dataSizeStart + 1].toInt() and 0xFF) shl 8) or
////                (wavBytes[dataSizeStart].toInt() and 0xFF)
////
////        val pcmStart = dataChunkOffset + 8
////        val pcmBytes = wavBytes.sliceArray(pcmStart until (pcmStart + dataSize))
////
////        val sampleCount = pcmBytes.size / 2
////        val floatBuffer = FloatArray(sampleCount)
////
////        for (i in 0 until sampleCount) {
////            val low = pcmBytes[2 * i].toInt() and 0xFF
////            val high = pcmBytes[2 * i + 1].toInt()
////            val sample = (high shl 8) or low
////            floatBuffer[i] = sample.toShort() / 32768.0f
////        }
////
////        return floatBuffer
////    }
//
//    private fun decodeWavMono(file: File): FloatArray {
//        val wavBytes = file.readBytes()
//        val dataIndex = wavBytes.indexOf("data".toByteArray())
//        if (dataIndex == -1) throw IllegalArgumentException("data chunk not found")
//
//        val dataSize = ((wavBytes[dataIndex + 7].toInt() and 0xFF) shl 24) or
//                ((wavBytes[dataIndex + 6].toInt() and 0xFF) shl 16) or
//                ((wavBytes[dataIndex + 5].toInt() and 0xFF) shl 8) or
//                (wavBytes[dataIndex + 4].toInt() and 0xFF)
//
//        val pcmStart = dataIndex + 8
//        val pcmBytes = wavBytes.sliceArray(pcmStart until pcmStart + dataSize)
//
//        val floatBuffer = FloatArray(pcmBytes.size / 2)
//        for (i in floatBuffer.indices) {
//            val lo = pcmBytes[i * 2].toInt() and 0xFF
//            val hi = pcmBytes[i * 2 + 1].toInt()
//            val sample = (hi shl 8) or lo
//            floatBuffer[i] = sample.toShort() / 32768f
//        }
//
//        println("🎧 [Fixed] Kotlin decoded waveform length: ${floatBuffer.size} samples")
//        return floatBuffer
//    }
//
//
//    private fun splitSegments(waveform: FloatArray): List<FloatArray> {
//        val segmentSamples = (SAMPLE_RATE * SEGMENT_SEC).toInt()
//        val marginSamples = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()
//
//        val trimmed = if (waveform.size > 3 * marginSamples) {
//            waveform.sliceArray(marginSamples until waveform.size - marginSamples)
//        } else {
//            waveform
//        }
//
//        val segments = mutableListOf<FloatArray>()
//        for (start in 0 until trimmed.size step segmentSamples) {
//            val end = start + segmentSamples
//            val segment = if (end <= trimmed.size) {
//                trimmed.sliceArray(start until end)
//            } else {
//                trimmed.sliceArray(start until trimmed.size)
//            }
//            if (segment.size >= 256) {
//                segments.add(segment)
//            }
//        }
//        return segments
//    }
//
//    private fun extractMelSequence(waveform: FloatArray): Array<FloatArray> {
//        val numFrames = ((waveform.size - FRAME_LENGTH) / FRAME_STEP) + 1
//        if (numFrames <= 0) return emptyArray()
//        val melFilters = computeMelFilters()
//        val fft = FloatFFT_1D(FRAME_LENGTH.toLong())
//        val melSpectrogram = Array(numFrames) { FloatArray(N_MELS) }
//
//        for (i in 0 until numFrames) {
//            val start = i * FRAME_STEP
//            val frame = waveform.sliceArray(start until (start + FRAME_LENGTH))
//            val windowed = applyHannWindow(frame)
//            val fftData = windowed.copyOf()
//            fft.realForward(fftData)
//            val magnitude = FloatArray(FRAME_LENGTH / 2 + 1)
//            magnitude[0] = abs(fftData[0])
//            for (k in 1 until FRAME_LENGTH / 2) {
//                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
//            }
//            magnitude[FRAME_LENGTH / 2] = abs(fftData[1])
//            for (m in 0 until N_MELS) {
//                melSpectrogram[i][m] = ln(melFilters[m].mapIndexed { k, v -> magnitude[k] * v }.sum() + 1e-6f)
//            }
//        }
//        return melSpectrogram
//    }
//
//    private fun computeMelFilters(): Array<FloatArray> {
//        fun hzToMel(hz: Float) = 2595f * log10(1 + hz / 700f)
//        fun melToHz(mel: Float) = 700f * (10f.pow(mel / 2595f) - 1)
//        val lowMel = hzToMel(0f)
//        val highMel = hzToMel(SAMPLE_RATE / 2f)
//        val melPoints = FloatArray(N_MELS + 2) { i -> lowMel + (highMel - lowMel) * i / (N_MELS + 1) }
//        val hzPoints = melPoints.map { melToHz(it) }
//        val bin = hzPoints.map { floor((FRAME_LENGTH + 1) * it / SAMPLE_RATE).toInt() }
//        val filters = Array(N_MELS) { FloatArray(FRAME_LENGTH / 2 + 1) }
//        for (m in 1 until bin.size - 1) {
//            val left = bin[m - 1]
//            val center = bin[m]
//            val right = bin[m + 1]
//            for (k in left until center) filters[m - 1][k] = (k - left).toFloat() / (center - left)
//            for (k in center until right) filters[m - 1][k] = (right - k).toFloat() / (right - center)
//        }
//        return filters
//    }
//
//    private fun extractVectorFeatures(waveform: FloatArray): FloatArray {
//        val energy = waveform.map { it * it }.average().toFloat()
//        var zeroCrossings = 0
//        for (i in 1 until waveform.size) {
//            if (waveform[i - 1] * waveform[i] < 0) {
//                zeroCrossings++
//            }
//        }
//        val zcr = zeroCrossings.toFloat() / waveform.size
//        val maxAmp = waveform.maxOrNull() ?: 0f
//        val meanAmp = waveform.average().toFloat()
//        val stdAmp = waveform.fold(0.0) { acc, f -> acc + (f - meanAmp).pow(2) }.let { sqrt(it / waveform.size).toFloat() }
//        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp, 0f, 0f, 0f, 0f, 0f)
//    }
//
//    private fun padSequence(seq: Array<FloatArray>): Array<Array<FloatArray>> {
//        val padded = Array(SEQUENCE_LEN) { FloatArray(N_MELS) { 0f } }
//        for (i in seq.indices) {
//            if (i < SEQUENCE_LEN) {
//                padded[i] = seq[i]
//            }
//        }
//        return arrayOf(padded)
//    }
//
//    private fun createDummyImage(): Array<Array<FloatArray>> {
//        return Array(IMG_HEIGHT) { Array(IMG_WIDTH) { floatArrayOf(0f) } }
//    }
//
//    private fun applyHannWindow(frame: FloatArray): FloatArray {
//        return FloatArray(frame.size) { i -> frame[i] * (0.5f - 0.5f * cos(2.0 * Math.PI * i / frame.size).toFloat()) }
//    }
//
//    private fun isFlatFake(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        val std = probs.map { (it - mean).pow(2) }.average().let { sqrt(it).toFloat() }
//        val max = probs.maxOrNull() ?: 0f
//        return mean < 0.01f && std < 0.003f && max > 0.005f
//    }
//
//    private fun isDeepfakeBySegments(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        if (mean > 0.4f) return true
//        if (probs.count { it > 0.9f } >= 2) return true
//        if (isFlatFake(probs)) return true
//        return false
//    }
//}














//package com.example.myapplication
//
//import android.content.Context
//import org.jtransforms.fft.FloatFFT_1D
//import org.tensorflow.lite.Interpreter
//import java.io.File
//import kotlin.math.*
//
//class DeepVoiceDetector(
//    private val context: Context,
//    private val interpreter: Interpreter
//) {
//    companion object {
//        const val SAMPLE_RATE = 16000
//        const val SEGMENT_SEC = 4.0f
//        const val TRIM_MARGIN_SEC = 0.0f
//        const val FRAME_LENGTH = 512
//        const val FRAME_STEP = 256
//        const val N_MELS = 128
//        const val SEQUENCE_LEN = 400
//        const val IMG_HEIGHT = 128
//        const val IMG_WIDTH = 500
//    }
//
//    fun detect(audioFilePath: String, threshold: Float = 0.4f): Map<String, Any?> {
//        val audioFile = File(audioFilePath)
//        val basename = audioFile.name
//        val trueLabel = when {
//            "real" in basename.lowercase() -> "✅ Real"
//            "fake" in basename.lowercase() -> "‼️ Fake"
//            "mixed" in basename.lowercase() -> "⚠️ Mixed"
//            else -> "알 수 없음"
//        }
//
//        val waveform = decodeWavMono(audioFile)
//        val segments = splitSegments(waveform)
//
//        val fullVector = extractVectorFeatures(waveform)
//        val fullSequence = padSequence(extractMelSequence(waveform))
//        val dummyImage = createDummyImage()
//
//        val segmentProbs = mutableListOf<Float>()
//        for (seg in segments) {
//            val segVector = extractVectorFeatures(seg)
//            val segSequence = padSequence(extractMelSequence(seg))
//            val prob = infer(segSequence, dummyImage, segVector)
//            segmentProbs.add(prob)
//        }
//
//        val meanSegProb = segmentProbs.average().toFloat()
//        val isDeepfakeSegment = isDeepfakeBySegments(segmentProbs)
//
//        val fullProb = infer(fullSequence, dummyImage, fullVector)
//        val isDeepfakeFull = fullProb > threshold
//
//        return mapOf(
//            "basename" to basename,
//            "true_label" to trueLabel,
//            "segment_probs" to segmentProbs,
//            "mean_segment_prob" to meanSegProb,
//            "is_deepfake_segment" to isDeepfakeSegment,
//            "deepfake_prob_full" to fullProb,
//            "is_deepfake_full" to isDeepfakeFull
//        )
//    }
//
//    private fun infer(seq: Array<Array<FloatArray>>, img: Array<Array<FloatArray>>, vec: FloatArray): Float {
//        val output = Array(128) { FloatArray(2) }
//        val inputs = arrayOf(seq, img, vec)
//        val outputs = mapOf(0 to output)
//        interpreter.runForMultipleInputsOutputs(inputs, outputs)
//        return output[0][1]
//    }
////    private fun decodeWavMono(file: File): FloatArray {
////        val wavBytes = file.readBytes()
////        // WAV 포맷 기준: 데이터 시작은 항상 'data' 이후 4바이트부터 시작됨
////        val dataOffset = wavBytes.indexOf("data".toByteArray()) + 8
////        val rawData = wavBytes.sliceArray(dataOffset until wavBytes.size)
////
////        val shortBuffer = ShortArray(rawData.size / 2)
////        for (i in shortBuffer.indices) {
////            val low = rawData[i * 2].toInt() and 0xFF
////            val high = rawData[i * 2 + 1].toInt()
////            val sample = (high shl 8) or low
////            shortBuffer[i] = sample.toShort()
////        }
////
////        return shortBuffer.map { it / 32768f }.toFloatArray()
////    }
//
//    private fun ByteArray.indexOf(subArray: ByteArray): Int {
//        outer@ for (i in 0..this.size - subArray.size) {
//            for (j in subArray.indices) {
//                if (this[i + j] != subArray[j]) continue@outer
//            }
//            return i
//        }
//        return -1
//    }
//
//    private fun decodeWavMono(file: File): FloatArray {
//        val wavBytes = file.readBytes()
//        val dataIndexLower = wavBytes.indexOf("data".toByteArray())
//        val dataIndexUpper = wavBytes.indexOf("DATA".toByteArray())
//
//        println("🔍 'data' index (lowercase): $dataIndexLower")
//        println("🔍 'DATA' index (uppercase): $dataIndexUpper")
//
//        val dataChunkOffset = wavBytes.indexOf("data".toByteArray())
////            ?: throw IllegalArgumentException("❌ WAV data chunk not found")
//
//        println("🧩 dataChunkOffset = $dataChunkOffset")
//
//        val dataSizeStart = dataChunkOffset + 4
//        val dataSize = ((wavBytes[dataSizeStart + 3].toInt() and 0xFF) shl 24) or
//                ((wavBytes[dataSizeStart + 2].toInt() and 0xFF) shl 16) or
//                ((wavBytes[dataSizeStart + 1].toInt() and 0xFF) shl 8) or
//                (wavBytes[dataSizeStart].toInt() and 0xFF)
//
//        println("📦 Declared PCM data size: $dataSize bytes")
//
//        val pcmStart = dataChunkOffset + 8
//        val pcmBytes = wavBytes.sliceArray(pcmStart until (pcmStart + dataSize))
//
//        val sampleCount = pcmBytes.size / 2
//        val floatBuffer = FloatArray(sampleCount)
//
//        for (i in 0 until sampleCount) {
//            val low = pcmBytes[2 * i].toInt() and 0xFF
//            val high = pcmBytes[2 * i + 1].toInt()
//            val sample = (high shl 8) or low
//            floatBuffer[i] = sample.toShort() / 32768.0f
//        }
//
//        println("🎧 Kotlin decoded waveform length: ${floatBuffer.size} samples")
//        return floatBuffer
//    }
//
////    private fun decodeWavMono(file: File): FloatArray {
////        val wavBytes = file.readBytes()
////
////        val dataChunkOffset = listOf("data", "DATA")
////            .map { wavBytes.indexOf(it.toByteArray()) }
////            .firstOrNull { it != -1 }
////            ?: throw IllegalArgumentException("❌ WAV data chunk not found")
////
////        val dataSizeStart = dataChunkOffset + 4
////        val dataSize = ((wavBytes[dataSizeStart + 3].toInt() and 0xFF) shl 24) or
////                ((wavBytes[dataSizeStart + 2].toInt() and 0xFF) shl 16) or
////                ((wavBytes[dataSizeStart + 1].toInt() and 0xFF) shl 8) or
////                (wavBytes[dataSizeStart].toInt() and 0xFF)
////
////        println("📦 Declared PCM data size: $dataSize bytes")
////
////        val pcmStart = dataChunkOffset + 8
////        val pcmBytes = wavBytes.sliceArray(pcmStart until (pcmStart + dataSize))
////
////        // ⚠️ WAV 포맷에서 채널 수는 22번째 바이트부터 2바이트 (리틀 엔디안)
////        val numChannels = ((wavBytes[23].toInt() and 0xFF) shl 8) or (wavBytes[22].toInt() and 0xFF)
////        println("🎚 Channels: $numChannels")
////
////        val totalSamples = pcmBytes.size / 2
////        val monoSamples = totalSamples / numChannels
////        val floatBuffer = FloatArray(monoSamples)
////
////        for (i in 0 until monoSamples) {
////            var sum = 0
////            for (ch in 0 until numChannels) {
////                val idx = (i * numChannels + ch) * 2
////                val low = pcmBytes[idx].toInt() and 0xFF
////                val high = pcmBytes[idx + 1].toInt()
////                val sample = (high shl 8) or low
////                sum += sample.toShort().toInt()
////            }
////            floatBuffer[i] = (sum / numChannels).toFloat() / 32768f
////        }
////
////        println("🎧 Kotlin decoded waveform length: ${floatBuffer.size} samples")
////        return floatBuffer
////    }
//
//
//
//    private fun splitSegments(waveform: FloatArray): List<FloatArray> {
//        val segmentSamples = (SAMPLE_RATE * SEGMENT_SEC).toInt()
//        val marginSamples = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()
//        val totalSamples = waveform.size
//
//        val trimmed = if (totalSamples > 3 * marginSamples) {
//            waveform.sliceArray(marginSamples until totalSamples - marginSamples)
//        } else {
//            println("⚠️ Too short to trim margins. Using original waveform.")
//            waveform
//        }
//
//        val segments = mutableListOf<FloatArray>()
//        val trimmedSamples = trimmed.size
//
//        var start = 0
//        while (start < trimmedSamples) {
//            val end = min(start + segmentSamples, trimmedSamples)
//            val segment = trimmed.sliceArray(start until end)
//            if (segment.size >= 256) {
//                segments.add(segment)
//            }
//            start += segmentSamples
//        }
//
//        println("📦 Kotlin segment count = ${segments.size}, each up to $segmentSamples samples")
//        return segments
//    }
//
////    private fun splitSegments(waveform: FloatArray): List<FloatArray> {
////        val segmentSamples = (SAMPLE_RATE * SEGMENT_SEC).toInt()
////        val marginSamples = (SAMPLE_RATE * TRIM_MARGIN_SEC).toInt()
////        val totalSamples = waveform.size
////
////        val trimmed = if (totalSamples > 3 * marginSamples) {
////            waveform.sliceArray(marginSamples until totalSamples - marginSamples)
////        } else {
////            println("⚠️ Too short to trim margins. Using original waveform.")
////            waveform
////        }
////
////        val segments = mutableListOf<FloatArray>()
////        val trimmedSamples = trimmed.size
////
////        for (start in 0 until trimmedSamples step segmentSamples) {
////            val end = start + segmentSamples
////            if (end <= trimmedSamples) {  // ❗ Python처럼 자투리 제거
////                val segment = trimmed.sliceArray(start until end)
////                if (segment.size >= 256) {
////                    segments.add(segment)
////                }
////            }
////        }
////
////        println("📦 Kotlin segment count = ${segments.size}, each = $segmentSamples samples")
////        return segments
////    }
//
//    private fun extractMelSequence(waveform: FloatArray): Array<FloatArray> {
//        val numFrames = ((waveform.size - FRAME_LENGTH) / FRAME_STEP) + 1
//        if (numFrames <= 0) return emptyArray()
//        val melFilters = computeMelFilters()
//        val fft = FloatFFT_1D(FRAME_LENGTH.toLong())
//        val melSpectrogram = Array(numFrames) { FloatArray(N_MELS) }
//
//        for (i in 0 until numFrames) {
//            val start = i * FRAME_STEP
//            val frame = waveform.sliceArray(start until (start + FRAME_LENGTH))
//            val windowed = applyHannWindow(frame)
//            val fftData = windowed.copyOf()
//            fft.realForward(fftData)
//            val magnitude = FloatArray(FRAME_LENGTH / 2 + 1)
//            magnitude[0] = abs(fftData[0])
//            for (k in 1 until FRAME_LENGTH / 2) {
//                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
//            }
//            magnitude[FRAME_LENGTH / 2] = abs(fftData[1])
//            for (m in 0 until N_MELS) {
//                melSpectrogram[i][m] = ln(melFilters[m].mapIndexed { k, v -> magnitude[k] * v }.sum() + 1e-6f)
//            }
//        }
//        return melSpectrogram
//    }
//
//    private fun computeMelFilters(): Array<FloatArray> {
//        fun hzToMel(hz: Float) = 2595f * log10(1 + hz / 700f)
//        fun melToHz(mel: Float) = 700f * (10f.pow(mel / 2595f) - 1)
//        val lowMel = hzToMel(0f)
//        val highMel = hzToMel(SAMPLE_RATE / 2f)
//        val melPoints = FloatArray(N_MELS + 2) { i -> lowMel + (highMel - lowMel) * i / (N_MELS + 1) }
//        val hzPoints = melPoints.map { melToHz(it) }
//        val bin = hzPoints.map { floor((FRAME_LENGTH + 1) * it / SAMPLE_RATE).toInt() }
//        val filters = Array(N_MELS) { FloatArray(FRAME_LENGTH / 2 + 1) }
//        for (m in 1 until bin.size - 1) {
//            val left = bin[m - 1]
//            val center = bin[m]
//            val right = bin[m + 1]
//            for (k in left until center) filters[m - 1][k] = (k - left).toFloat() / (center - left)
//            for (k in center until right) filters[m - 1][k] = (right - k).toFloat() / (right - center)
//        }
//        return filters
//    }
//
////    private fun extractVectorFeatures(waveform: FloatArray): FloatArray {
////        val energy = waveform.map { it * it }.average().toFloat()
////        val zcr = waveform.toList().zipWithNext().count { it.first * it.second < 0 }.toFloat() / waveform.size
////        val maxAmp = waveform.maxOrNull() ?: 0f
////        val meanAmp = waveform.average().toFloat()
////        val stdAmp = waveform.fold(0.0) { acc, f -> acc + (f - meanAmp).pow(2) }.let { sqrt(it / waveform.size).toFloat() }
////        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp, 0f, 0f, 0f, 0f, 0f)
////    }
//
//
//    private fun extractVectorFeatures(waveform: FloatArray): FloatArray {
//        val energy = waveform.map { it * it }.average().toFloat()
//
//        // ❗ 메모리 효율적으로 ZCR 계산
//        var zeroCrossings = 0
//        for (i in 1 until waveform.size) {
//            if (waveform[i - 1] * waveform[i] < 0) {
//                zeroCrossings++
//            }
//        }
//        val zcr = zeroCrossings.toFloat() / waveform.size
//
//        val maxAmp = waveform.maxOrNull() ?: 0f
//        val meanAmp = waveform.average().toFloat()
//        val stdAmp = waveform.fold(0.0) { acc, f -> acc + (f - meanAmp).pow(2) }
//            .let { sqrt(it / waveform.size).toFloat() }
//
//        return floatArrayOf(energy, zcr, maxAmp, meanAmp, stdAmp, 0f, 0f, 0f, 0f, 0f)
//    }
//
//    private fun padSequence(seq: Array<FloatArray>): Array<Array<FloatArray>> {
//        val padded = Array(SEQUENCE_LEN) { FloatArray(N_MELS) { 0f } }
//        for (i in seq.indices) {
//            if (i < SEQUENCE_LEN) {
//                padded[i] = seq[i]
//            }
//        }
//        return arrayOf(padded)
//    }
//
//
//    private fun createDummyImage(): Array<Array<FloatArray>> {
//        return Array(IMG_HEIGHT) { Array(IMG_WIDTH) { floatArrayOf(0f) } }
//    }
//
//    private fun applyHannWindow(frame: FloatArray): FloatArray {
//        return FloatArray(frame.size) { i ->
//            frame[i] * (0.5f - 0.5f * cos(2.0 * Math.PI * i / frame.size).toFloat())
//        }
//    }
//
//    private fun isFlatFake(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        val std = probs.map { (it - mean).pow(2) }.average().let { sqrt(it).toFloat() }
//        val max = probs.maxOrNull() ?: 0f
//        return mean < 0.01f && std < 0.003f && max > 0.005f
//    }
//
//    private fun isDeepfakeBySegments(probs: List<Float>): Boolean {
//        val mean = probs.average().toFloat()
//        if (mean > 0.4f) return true
//        if (probs.count { it > 0.9f } >= 2) return true
//        if (isFlatFake(probs)) return true
//        return false
//    }
//}

