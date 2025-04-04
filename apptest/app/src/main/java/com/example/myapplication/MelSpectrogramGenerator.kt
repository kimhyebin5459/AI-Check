package com.example.myapplication

import android.graphics.Bitmap
import android.graphics.Color
import java.io.File
import java.io.FileOutputStream
import kotlin.math.*

object MelSpectrogramGenerator {
    private const val SAMPLE_RATE = 16000
    private const val N_MELS = 128
    private const val N_FFT = 400
    private const val HOP_LENGTH = 160
    private const val PRE_EMPHASIS = 0.97f

    fun generateMelImage(waveform: FloatArray, outputFile: File) {
        val emphasized = preEmphasis(waveform)
        val melSpec = computeMelSpectrogram(emphasized)
        val normalized = normalizeToImageRange(melSpec)
        val bitmap = convertToBitmap(normalized)
        saveBitmap(bitmap, outputFile)
    }

    private fun preEmphasis(signal: FloatArray): FloatArray {
        val output = FloatArray(signal.size)
        output[0] = signal[0]
        for (i in 1 until signal.size) {
            output[i] = signal[i] - PRE_EMPHASIS * signal[i - 1]
        }
        return output
    }

    private fun computeMelSpectrogram(signal: FloatArray): Array<FloatArray> {
        val numFrames = (signal.size - N_FFT) / HOP_LENGTH + 1
        val melFilters = computeMelFilters()
        val fft = org.jtransforms.fft.FloatFFT_1D(N_FFT.toLong())
        val melSpec = Array(N_MELS) { FloatArray(numFrames) }

        for (i in 0 until numFrames) {
            val frame = signal.sliceArray(i * HOP_LENGTH until i * HOP_LENGTH + N_FFT)
            val windowed = applyHannWindow(frame)
            val fftData = windowed.copyOf()
            fft.realForward(fftData)

            val magnitude = FloatArray(N_FFT / 2 + 1)
            magnitude[0] = abs(fftData[0])
            for (k in 1 until N_FFT / 2) {
                magnitude[k] = sqrt(fftData[2 * k].pow(2) + fftData[2 * k + 1].pow(2))
            }
            magnitude[N_FFT / 2] = abs(fftData[1])

            for (m in 0 until N_MELS) {
                val energy = melFilters[m].indices.fold(0f) { acc, k ->
                    acc + magnitude[k] * melFilters[m][k]
                }
                melSpec[m][i] = ln(energy + 1e-6f)
            }
        }

        return melSpec
    }

    private fun computeMelFilters(): Array<FloatArray> {
        fun hzToMel(hz: Float) = 2595f * log10(1 + hz / 700f)
        fun melToHz(mel: Float) = 700f * (10f.pow(mel / 2595f) - 1)

        val melPoints = FloatArray(N_MELS + 2) { i ->
            val lowMel = hzToMel(80f)
            val highMel = hzToMel(7600f)
            lowMel + (highMel - lowMel) * i / (N_MELS + 1)
        }
        val hzPoints = melPoints.map { melToHz(it) }
        val bin = hzPoints.map { floor((N_FFT + 1) * it / SAMPLE_RATE).toInt() }

        val filters = Array(N_MELS) { FloatArray(N_FFT / 2 + 1) }
        for (m in 1 until bin.size - 1) {
            val (left, center, right) = listOf(bin[m - 1], bin[m], bin[m + 1])
            for (k in left until center)
                filters[m - 1][k] = (k - left).toFloat() / (center - left)
            for (k in center until right)
                filters[m - 1][k] = (right - k).toFloat() / (right - center)
        }
        return filters
    }

    private fun applyHannWindow(frame: FloatArray): FloatArray {
        return FloatArray(frame.size) { i ->
            frame[i] * (0.5f - 0.5f * cos(2.0 * Math.PI * i / frame.size).toFloat())
        }
    }

    private fun normalizeToImageRange(mel: Array<FloatArray>): Array<FloatArray> {
        val flat = mel.flatMap { it.asList() }
        val min = flat.minOrNull() ?: 0f
        val max = flat.maxOrNull() ?: 1f
        val range = max - min
        return Array(mel.size) { i ->
            FloatArray(mel[0].size) { j ->
                ((mel[i][j] - min) / range).coerceIn(0f, 1f)
            }
        }
    }

    private fun convertToBitmap(normalized: Array<FloatArray>): Bitmap {
        val originalHeight = normalized.size
        val originalWidth = normalized[0].size

        val targetHeight = 128
        val targetWidth = 500

        val bitmap = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)

        for (y in 0 until targetHeight) {
            val srcY = (y.toFloat() / targetHeight * originalHeight).toInt().coerceIn(0, originalHeight - 1)
            for (x in 0 until targetWidth) {
                val srcX = (x.toFloat() / targetWidth * originalWidth).toInt().coerceIn(0, originalWidth - 1)
                val value = normalized[srcY][srcX].coerceIn(0f, 1f)
                val gray = (value * 255).toInt()
                val color = Color.rgb(gray, gray, gray)
                bitmap.setPixel(x, y, color)
            }
        }

        return bitmap
    }


    private fun saveBitmap(bitmap: Bitmap, outputFile: File) {
        FileOutputStream(outputFile).use { out ->
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
        }
    }
}
