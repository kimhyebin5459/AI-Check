package com.example.aicheck.call;

import android.os.FileObserver;
import android.util.Log;
import com.example.aicheck.WavConverter2;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;

public class CallRecordingFileObserver extends FileObserver {
    private static final String TAG = "CallRecordingObserver";
    private final File observedDirectory;
    private long lastFileSize = 0;
    private long lastSentTime = 0;
    private static final long INTERVAL_MS = 3 * 1000; // 3초 기준
    private static final long MIN_SIZE_TO_SEND = 512 * 1024; // 512KB (옵션: 크기 기준 전송)

    public CallRecordingFileObserver(String path) {
        super(path, FileObserver.CREATE | FileObserver.MODIFY | FileObserver.CLOSE_WRITE);
        this.observedDirectory = new File(path);
    }

    @Override
    public void onEvent(int event, String fileName) {
        if (fileName == null) return;

        File newFile = new File(observedDirectory, fileName);

        switch (event) {
            case FileObserver.CREATE:
                Log.d(TAG, "📌 새로운 녹음 파일 감지됨: " + newFile.getAbsolutePath());
                lastFileSize = 0;
                lastSentTime = System.currentTimeMillis();
                break;

            case FileObserver.MODIFY:
                Log.d(TAG, "🎤 녹음 파일 변경됨: " + newFile.getAbsolutePath());
                processNewData(newFile);
                break;

            case FileObserver.CLOSE_WRITE:
                Log.d(TAG, "✅ 녹음 완료됨: " + newFile.getAbsolutePath());
                saveDebugWav(newFile); // 🔥 디버깅용 WAV 파일 저장
                break;
        }
    }

    private void processNewData(File file) {
        if (!file.exists()) return;

        long currentSize = file.length();
        long currentTime = System.currentTimeMillis();

        if ((currentTime - lastSentTime >= INTERVAL_MS) || (currentSize - lastFileSize >= MIN_SIZE_TO_SEND)) {
            try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
                raf.seek(lastFileSize);
                byte[] newData = new byte[(int) (currentSize - lastFileSize)];
                raf.readFully(newData);

                // 🔥 디버깅용 데이터 저장
                saveDebugFile(newData);

                // 🔥 AI 모델에 전송
                sendToAI(newData, file);

                lastFileSize = currentSize;
                lastSentTime = currentTime;
            } catch (Exception e) {
                Log.e(TAG, "❌ 파일 읽기 오류: " + e.getMessage());
            }
        }
    }

    private void sendToAI(byte[] audioData, File originalFile) {
        Log.d(TAG, "🚀 AI 모델에 데이터 전송: " + audioData.length + " 바이트");

        // 🔥 FFmpeg를 이용한 `.m4a` → `.wav` 변환 후 전송
        File wavFile = new File(observedDirectory, "output.wav");
        convertM4AToWav(originalFile, wavFile);

        // 🔥 AI 모델에 WAV 파일 전송
        sendWavToAI(wavFile);
    }

    private void saveDebugFile(byte[] audioData) {
        try {
            File debugFile = new File(observedDirectory, "debug_audio.raw");
            FileOutputStream fos = new FileOutputStream(debugFile, true);
            fos.write(audioData);
            fos.close();
            Log.d(TAG, "✅ 디버깅용 오디오 파일 저장 완료: " + debugFile.getAbsolutePath());

            // 🔥 저장 후 즉시 `.wav`로 변환
            File wavFile = new File(observedDirectory, "debug_audio.wav");
            checkAudioFormat(new File(observedDirectory, "debug_audio.raw"));
//            WavConverter2.convertRawToWav(debugFile, wavFile);
            saveDebugFile2(audioData);
        } catch (IOException e) {
            Log.e(TAG, "❌ 디버깅용 파일 저장 실패: " + e.getMessage());
        }
    }

    public void convertM4AToWav(File inputFile, File outputFile) {
        String command = "-i " + inputFile.getAbsolutePath() + " -acodec pcm_s16le -ar 16000 -ac 1 -f wav " + outputFile.getAbsolutePath();
//        .execute(command);
        Log.d(TAG, "✅ FFmpegKit 변환 완료: " + outputFile.getAbsolutePath());
    }


    private void sendWavToAI(File wavFile) {
        Log.d(TAG, "🚀 AI 모델에 WAV 파일 전송: " + wavFile.getAbsolutePath());
        // AI 모델로 전송하는 로직 추가 (예: HTTP POST)
    }

    private void saveDebugWav(File inputFile) {
        File debugWavFile = new File(observedDirectory, "debug_audio.wav");
        convertM4AToWav(inputFile, debugWavFile);
        Log.d(TAG, "✅ 디버깅용 WAV 파일 저장 완료: " + debugWavFile.getAbsolutePath());
    }

    private void saveDebugFile2(byte[] audioData) {
        try {

            // 🔥 byte[]를 직접 WAV 변환하여 저장
            File rawFile = new File(observedDirectory, "debug_audio.raw");
            File wavFile = new File(observedDirectory, "debug_audio_fixed.wav");
            WavConverter2.addWavHeader(rawFile, wavFile, 16000, 1, 16);
            Log.d(TAG, "✅ WAV 파일 변환 완료: " + wavFile.getAbsolutePath());

        } catch (Exception e) {
            Log.e(TAG, "❌ WAV 변환 실패: " + e.getMessage());
        }
    }

    private void checkAudioFormat(File file) {
        try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
            byte[] header = new byte[12];  // WAV 또는 MP3 파일의 첫 12바이트 읽기
            raf.read(header);

            String format = new String(header, 0, 4);  // "RIFF"인지 확인 (WAV 파일인지 체크)
            Log.d(TAG, format);
            Log.d(TAG, String.valueOf(file.length()));
            if (format.equals("RIFF")) {
                Log.d(TAG, "✅ WAV 포맷 확인됨!");
            } else if (format.equals("ID3")) {
                Log.d(TAG, "❌ MP3/AAC 포맷 감지됨. 변환 필요!");
            } else {
                Log.d(TAG, "⚠️ 알 수 없는 오디오 포맷입니다.");
            }

        } catch (IOException e) {
            Log.e(TAG, "❌ 오디오 포맷 확인 실패: " + e.getMessage());
        }
    }



}
