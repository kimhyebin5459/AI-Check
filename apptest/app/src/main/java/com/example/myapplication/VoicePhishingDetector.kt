package com.example.myapplication

import android.content.Context
import org.tensorflow.lite.Interpreter
import java.io.File
import java.nio.ByteBuffer  // 추가
import java.nio.ByteOrder  // 추가

class VoicePhishingDetector(
    private val context: Context,
    private val interpreterSTT: Interpreter,
    private val interpreterVoicePhishing: Interpreter,
    private val wordToIndex: Map<String, Int>,
    private val maxLength: Int = 5962
) {

    fun detect(audioPath: String): Pair<String, String> {
        val transcribedText = transcribeAudio(audioPath)
        val tokens = transcribedText.trim().split(" ").filter { it.isNotBlank() }.take(maxLength)
        val sequence = tokens.map { wordToIndex[it] ?: 0 }
        val paddedSequence = Utils.padSequence(sequence, maxLength)
        val inputBuffer = Utils.convertSequenceToByteBuffer(paddedSequence, maxLength)
        val outputBuffer = Array(1) { FloatArray(2) }
        interpreterVoicePhishing.run(inputBuffer, outputBuffer)
        val prediction = outputBuffer[0]
        val result = if (prediction[0] > prediction[1]) "정상" else "보이스피싱"
        return Pair(result, transcribedText)
    }

    private fun transcribeAudio(audioPath: String): String {
        val waveform = Utils.decodeAudio(audioPath)
        val inputSamples = if (waveform.size >= 768) {
            waveform.sliceArray(0 until 768)
        } else {
            FloatArray(768).apply { waveform.copyInto(this) }
        }
        val inputBuffer = ByteBuffer.allocateDirect(4 * 768).order(ByteOrder.nativeOrder())
        inputSamples.forEach { inputBuffer.putFloat(it) }
        inputBuffer.rewind()
        val outputBuffer = Array(1) { Array(2) { FloatArray(56) } }
        interpreterSTT.run(inputBuffer, outputBuffer)
        return decodeCTC(outputBuffer[0])
    }

    private fun decodeCTC(output: Array<FloatArray>): String {
        // 'index' 대신 'it' 사용
        val argmax = output.map { probs -> probs.indices.maxByOrNull { probs[it] } ?: 0 }
        val decoded = mutableListOf<Int>()
        var prev = -1
        argmax.forEach { idx ->
            if (idx != 0 && idx != prev) decoded.add(idx)
            prev = idx
        }
        val inverseWordToIndex = wordToIndex.entries.associate { it.value to it.key }
        return decoded.map { inverseWordToIndex[it] ?: "" }.joinToString(" ")
    }
}