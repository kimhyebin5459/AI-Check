package com.aicheck

import android.util.Log
import java.io.*
import java.nio.ByteBuffer
import java.nio.ByteOrder

object WavConverter2 {
    private const val TAG = "WavConverter2"

    @JvmStatic
    fun addWavHeader(rawFile: File, wavFile: File, sampleRate: Int, channels: Int, bitsPerSample: Int) {
        try {
            val rawData = rawFile.readBytes()
            val wavData = createWavHeader(rawData, sampleRate, channels, bitsPerSample)
            wavFile.writeBytes(wavData)
            Log.d(TAG, "✅ WAV 헤더 추가 완료: ${wavFile.absolutePath}")
        } catch (e: IOException) {
            Log.e(TAG, "❌ WAV 변환 실패: ${e.message}")
        }
    }

    private fun createWavHeader(
        rawData: ByteArray,
        sampleRate: Int,
        channels: Int,
        bitsPerSample: Int
    ): ByteArray {
        val totalDataLen = rawData.size + 36
        val byteRate = sampleRate * channels * bitsPerSample / 8

        return try {
            ByteArrayOutputStream().apply {
                write(byteArrayOf('R'.code.toByte(), 'I'.code.toByte(), 'F'.code.toByte(), 'F'.code.toByte()))
                write(intToByteArray(totalDataLen))
                write(byteArrayOf('W'.code.toByte(), 'A'.code.toByte(), 'V'.code.toByte(), 'E'.code.toByte()))
                write(byteArrayOf('f'.code.toByte(), 'm'.code.toByte(), 't'.code.toByte(), ' '.code.toByte()))
                write(intToByteArray(16))
                write(shortToByteArray(1))
                write(shortToByteArray(channels.toShort()))
                write(intToByteArray(sampleRate))
                write(intToByteArray(byteRate))
                write(shortToByteArray((channels * bitsPerSample / 8).toShort()))
                write(shortToByteArray(bitsPerSample.toShort()))
                write(byteArrayOf('d'.code.toByte(), 'a'.code.toByte(), 't'.code.toByte(), 'a'.code.toByte()))
                write(intToByteArray(rawData.size))
                write(rawData)
            }.toByteArray()
        } catch (e: IOException) {
            Log.e(TAG, "❌ WAV 헤더 추가 실패: ${e.message}")
            ByteArray(0)
        }
    }

    private fun intToByteArray(value: Int): ByteArray =
        ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(value).array()

    private fun shortToByteArray(value: Short): ByteArray =
        ByteBuffer.allocate(2).order(ByteOrder.LITTLE_ENDIAN).putShort(value).array()

    @JvmStatic
    fun convertRawToWav(rawFile: File, wavFile: File, sampleRate: Int, channels: Int) {
        try {
            val audioLength = rawFile.length()
            val dataLength = audioLength + 36
            val byteRate = sampleRate * channels * 2

            val header = ByteArray(44)

            header[0] = 'R'.code.toByte(); header[1] = 'I'.code.toByte(); header[2] = 'F'.code.toByte(); header[3] = 'F'.code.toByte()
            header[4] = (dataLength and 0xff).toByte()
            header[5] = ((dataLength shr 8) and 0xff).toByte()
            header[6] = ((dataLength shr 16) and 0xff).toByte()
            header[7] = ((dataLength shr 24) and 0xff).toByte()
            header[8] = 'W'.code.toByte(); header[9] = 'A'.code.toByte(); header[10] = 'V'.code.toByte(); header[11] = 'E'.code.toByte()

            header[12] = 'f'.code.toByte(); header[13] = 'm'.code.toByte(); header[14] = 't'.code.toByte(); header[15] = ' '.code.toByte()
            header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0
            header[20] = 1; header[21] = 0
            header[22] = channels.toByte(); header[23] = 0
            header[24] = (sampleRate and 0xff).toByte()
            header[25] = ((sampleRate shr 8) and 0xff).toByte()
            header[26] = ((sampleRate shr 16) and 0xff).toByte()
            header[27] = ((sampleRate shr 24) and 0xff).toByte()
            header[28] = (byteRate and 0xff).toByte()
            header[29] = ((byteRate shr 8) and 0xff).toByte()
            header[30] = ((byteRate shr 16) and 0xff).toByte()
            header[31] = ((byteRate shr 24) and 0xff).toByte()
            header[32] = (channels * 2).toByte(); header[33] = 0
            header[34] = 16; header[35] = 0

            header[36] = 'd'.code.toByte(); header[37] = 'a'.code.toByte(); header[38] = 't'.code.toByte(); header[39] = 'a'.code.toByte()
            header[40] = (audioLength and 0xff).toByte()
            header[41] = ((audioLength shr 8) and 0xff).toByte()
            header[42] = ((audioLength shr 16) and 0xff).toByte()
            header[43] = ((audioLength shr 24) and 0xff).toByte()

            FileOutputStream(wavFile).use { fos ->
                FileInputStream(rawFile).use { fis ->
                    fos.write(header, 0, 44)
                    val buffer = ByteArray(1024)
                    var bytesRead: Int
                    while (fis.read(buffer).also { bytesRead = it } != -1) {
                        fos.write(buffer, 0, bytesRead)
                    }
                }
            }
            Log.d(TAG, "✅ WAV 변환 완료: ${wavFile.absolutePath}")
        } catch (e: IOException) {
            Log.e(TAG, "❌ WAV 변환 실패: ${e.message}")
        }
    }
}