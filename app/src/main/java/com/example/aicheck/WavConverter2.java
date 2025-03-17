package com.example.aicheck;

import android.util.Log;
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class WavConverter2 {
    private static final String TAG = "WavConverter2";

    public static void addWavHeader(File rawFile, File wavFile, int sampleRate, int channels, int bitsPerSample) {
        try {
            byte[] rawData = new byte[(int) rawFile.length()];
            FileInputStream fis = new FileInputStream(rawFile);
            fis.read(rawData);
            fis.close();

            byte[] wavData = createWavHeader(rawData, sampleRate, channels, bitsPerSample);

            FileOutputStream fos = new FileOutputStream(wavFile);
            fos.write(wavData);
            fos.close();

            Log.d(TAG, "✅ WAV 헤더 추가 완료: " + wavFile.getAbsolutePath());

        } catch (IOException e) {
            Log.e(TAG, "❌ WAV 변환 실패: " + e.getMessage());
        }
    }

    private static byte[] createWavHeader(byte[] rawData, int sampleRate, int channels, int bitsPerSample) {
        int totalDataLen = rawData.length + 36;
        int byteRate = sampleRate * channels * bitsPerSample / 8;

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            baos.write(new byte[]{'R', 'I', 'F', 'F'}); // "RIFF"
            baos.write(intToByteArray(totalDataLen));  // 파일 크기
            baos.write(new byte[]{'W', 'A', 'V', 'E'}); // "WAVE"
            baos.write(new byte[]{'f', 'm', 't', ' '}); // "fmt "
            baos.write(intToByteArray(16));  // 서브 청크 크기
            baos.write(shortToByteArray((short) 1)); // PCM 포맷
            baos.write(shortToByteArray((short) channels)); // 채널 수
            baos.write(intToByteArray(sampleRate)); // 샘플 레이트
            baos.write(intToByteArray(byteRate)); // 바이트 레이트
            baos.write(shortToByteArray((short) (channels * bitsPerSample / 8))); // 블록 정렬
            baos.write(shortToByteArray((short) bitsPerSample)); // 비트 깊이
            baos.write(new byte[]{'d', 'a', 't', 'a'}); // "data"
            baos.write(intToByteArray(rawData.length)); // 데이터 크기
            baos.write(rawData); // PCM 데이터
        } catch (IOException e) {
            Log.e(TAG, "❌ WAV 헤더 추가 실패: " + e.getMessage());
        }
        return baos.toByteArray();
    }

    private static byte[] intToByteArray(int value) {
        return ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(value).array();
    }

    private static byte[] shortToByteArray(short value) {
        return ByteBuffer.allocate(2).order(ByteOrder.LITTLE_ENDIAN).putShort(value).array();
    }
}
