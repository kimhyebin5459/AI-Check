# import os
# os.environ["LIBROSA_CACHE_DIR"] = ""
# os.environ["LIBROSA_CACHE_DISABLE"] = "1"
#
# import joblib
# class FakeMemory:
#     def __init__(self, *args, **kwargs):
#         self.location = None
#     def cache(self, func): return func
#     def clear(self, *args, **kwargs): pass
# joblib.Memory = FakeMemory
#
# import librosa
# import librosa.display
# import numpy as np
# import matplotlib.pyplot as plt
# import tensorflow as tf
#
# IMG_HEIGHT = 128
# IMG_WIDTH = 500
#
# # ----------- 기본 함수들 -----------
# def decode_audio_wave(file_path, sr=16000):
#     waveform, _ = librosa.load(file_path, sr=sr, mono=True)
#     return waveform
#
# def pre_emphasis(signal, coefficient=0.97):
#     if len(signal) == 0:
#         return signal
#     return np.append(signal[0], signal[1:] - coefficient * signal[:-1])
#
# def extract_log_mel_spec(signal, sr=16000, n_fft=400, hop_length=160, n_mels=128):
#     mel_spec = librosa.feature.melspectrogram(y=signal, sr=sr, n_fft=n_fft,
#                                               hop_length=hop_length, n_mels=n_mels)
#     log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)
#     return log_mel_spec
#
# def save_mel_spectrogram_image(wav_path, out_path,
#                                sr=16000, n_fft=400, hop_length=160, n_mels=128, pre_emphasis_coef=0.97):
#     y, _ = librosa.load(wav_path, sr=sr)
#     if len(y) == 0:
#         print(f"[Warning] Empty audio: {wav_path}")
#         return
#     y_emphasized = np.append(y[0], y[1:] - pre_emphasis_coef * y[:-1])
#     mel_spec = librosa.feature.melspectrogram(y=y_emphasized, sr=sr, n_fft=n_fft,
#                                               hop_length=hop_length, n_mels=n_mels)
#     log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)
#     os.makedirs(os.path.dirname(out_path), exist_ok=True)
#     plt.figure(figsize=(10, 4))
#     librosa.display.specshow(log_mel_spec, sr=sr, hop_length=hop_length, x_axis=None, y_axis=None, cmap='gray')
#     plt.axis('off')
#     plt.tight_layout(pad=0)
#     plt.savefig(out_path, bbox_inches='tight', pad_inches=0)
#     plt.close()
#     print(f"[OK] Saved mel image → {out_path}")
#
# # ----------- Segment / Feature 관련 -----------
# def split_into_segments(waveform, sr=16000, segment_duration=4.0):
#     segment_samples = int(sr * segment_duration)
#     total_samples = len(waveform)
#     segments = []
#     for start in range(0, total_samples, segment_samples):
#         end = start + segment_samples
#         segment = waveform[start:end]
#         if len(segment) >= 256:
#             segments.append(segment)
#     return segments
#
# def get_vector_features(waveform):
#     energy = np.mean(np.square(waveform))
#     zcr = np.mean(np.abs(np.diff(np.sign(waveform)))) / 2
#     max_amp = np.max(np.abs(waveform))
#     mean_amp = np.mean(waveform)
#     std_amp = np.std(waveform)
#     return [energy, zcr, max_amp, mean_amp, std_amp] + [0.0] * 5
#
# def get_mel_sequence(waveform, sr=16000, n_mels=128, frame_length=512, frame_step=256):
#     mel_spec = extract_log_mel_spec(waveform, sr=sr, n_fft=frame_length,
#                                     hop_length=frame_step, n_mels=n_mels)
#     return mel_spec.T  # shape: (time, 128)
#
# def pad_sequence(seq, target_len=400):
#     cur_len = seq.shape[0]
#     if cur_len < target_len:
#         pad = np.zeros((target_len - cur_len, seq.shape[1]), dtype=np.float32)
#         seq = np.vstack([seq, pad])
#     else:
#         seq = seq[:target_len, :]
#     return seq
#
# # ----------- 이미지 디코딩 함수 (Tensor 반환) -----------
# def decode_image_tf(image_path, width=500, height=128):
#     image_binary = tf.io.read_file(image_path)
#     image = tf.io.decode_png(image_binary, channels=1)
#     image = tf.image.resize(image, [height, width])
#     image = tf.image.convert_image_dtype(image, tf.float32)
#     image.set_shape([height, width, 1])
#     return image.numpy()  # TFLite 입력에 사용 가능하도록 numpy로 반환
#
# # ----------- Kotlin 호출용 엔트리 포인트 -----------
# def process_audio_to_mel_and_features(audio_path, output_image_path):
#     waveform = decode_audio_wave(audio_path)
#
#     # 1. mel 이미지 저장
#     save_mel_spectrogram_image(audio_path, output_image_path)
#
#     # 2. mel 이미지 numpy로 로딩
#     mel_tensor = decode_image_tf(output_image_path)  # shape: (128, 500, 1)
#
#     # 3. 전체 features
#     full_vector = get_vector_features(waveform)
#     full_sequence = pad_sequence(get_mel_sequence(waveform))
#
#     # 4. segments
#     segments = split_into_segments(waveform)
#     segment_vectors = [get_vector_features(seg) for seg in segments]
#     segment_sequences = [pad_sequence(get_mel_sequence(seg)) for seg in segments]
#
#     return {
#         "full_vector": full_vector,
#         "full_sequence": full_sequence.tolist(),
#         "mel_image": mel_tensor.tolist(),  # 바로 TFLite에 넣을 수 있음
#         "segment_vectors": segment_vectors,
#         "segment_sequences": [seq.tolist() for seq in segment_sequences]
#     }


import os
os.environ["LIBROSA_CACHE_DIR"] = ""
os.environ["LIBROSA_CACHE_DISABLE"] = "1"

import joblib
class FakeMemory:
    def __init__(self, *args, **kwargs):
        self.location = None
    def cache(self, func): return func
    def clear(self, *args, **kwargs): pass
joblib.Memory = FakeMemory

import librosa
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import librosa.display

IMG_HEIGHT = 128
IMG_WIDTH = 500

# ----------- 기본 함수들 -----------
def decode_audio_wave(file_path, sr=16000):
    waveform, _ = librosa.load(file_path, sr=sr, mono=True)
    return waveform

def pre_emphasis(signal, coefficient=0.97):
    if len(signal) == 0:
        return signal
    return np.append(signal[0], signal[1:] - coefficient * signal[:-1])

# ----------- Mel-spectrogram 함수 (TF와 동일) -----------
def linear_to_mel(sr, n_fft, n_mels=128, fmin=0.0, fmax=None):
    if fmax is None:
        fmax = sr / 2
    def hz_to_mel(hz): return 2595.0 * np.log10(1.0 + hz / 700.0)
    def mel_to_hz(mel): return 700.0 * (10.0**(mel / 2595.0) - 1.0)

    n_freqs = n_fft // 2 + 1
    fft_freqs = np.linspace(0.0, sr / 2, n_freqs)
    mel_f = np.linspace(hz_to_mel(fmin), hz_to_mel(fmax), n_mels + 2)
    hz_f = mel_to_hz(mel_f)

    mel_bins = np.zeros((n_mels, n_freqs))
    for i in range(n_mels):
        lower = hz_f[i]
        center = hz_f[i + 1]
        upper = hz_f[i + 2]

        left = (fft_freqs - lower) / (center - lower)
        right = (upper - fft_freqs) / (upper - center)
        mel_bins[i] = np.maximum(0.0, np.minimum(left, right))

    return mel_bins.T  # (n_freqs, n_mels)


def extract_log_mel_spec(signal, sr=16000, n_fft=512, hop_length=256, n_mels=128):
    stft = librosa.stft(signal, n_fft=n_fft, hop_length=hop_length, center=True, pad_mode="reflect")
    spectrogram = np.abs(stft)  # shape: (n_freqs, time)

    mel_weights = linear_to_mel(sr, n_fft, n_mels=n_mels)  # shape: (n_freqs, n_mels)
    mel_spec = np.dot(mel_weights.T, spectrogram)  # shape: (n_mels, time)
    mel_spec = np.maximum(mel_spec, 1e-6)
    log_mel_spec = np.log(mel_spec)
    return log_mel_spec.T  # shape: (time, n_mels)


# ----------- Mel 이미지 저장용 (별도 librosa 방식 사용) -----------
def save_mel_spectrogram_image(wav_path, out_path,
                               sr=16000, n_fft=400, hop_length=160, n_mels=128, pre_emphasis_coef=0.97):
    y, _ = librosa.load(wav_path, sr=sr)
    if len(y) == 0:
        print(f"[Warning] Empty audio: {wav_path}")
        return
    y_emphasized = pre_emphasis(y, pre_emphasis_coef)
    mel_spec = librosa.feature.melspectrogram(y=y_emphasized, sr=sr, n_fft=n_fft,
                                              hop_length=hop_length, n_mels=n_mels)
    log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(log_mel_spec, sr=sr, hop_length=hop_length, x_axis=None, y_axis=None, cmap='gray')
    plt.axis('off')
    plt.tight_layout(pad=0)
    plt.savefig(out_path, bbox_inches='tight', pad_inches=0)
    plt.close()
    print(f"[OK] Saved mel image → {out_path}")

# ----------- Segment / Feature 관련 -----------
def split_into_segments(waveform, sr=16000, segment_duration=4.0):
    segment_samples = int(sr * segment_duration)
    total_samples = len(waveform)
    segments = []
    for start in range(0, total_samples, segment_samples):
        end = start + segment_samples
        segment = waveform[start:end]
        if len(segment) >= 256:
            segments.append(segment)
    return segments

def get_vector_features(waveform):
    energy = np.mean(np.square(waveform))
    zcr = np.mean(np.abs(np.diff(np.sign(waveform)))) / 2
    max_amp = np.max(np.abs(waveform))
    mean_amp = np.mean(waveform)
    std_amp = np.std(waveform)
    return [energy, zcr, max_amp, mean_amp, std_amp] + [0.0] * 5

def get_mel_sequence(waveform, sr=16000, n_mels=128, frame_length=512, frame_step=256):
    mel_spec = extract_log_mel_spec(waveform, sr=sr, n_fft=frame_length,
                                    hop_length=frame_step, n_mels=n_mels)
    return mel_spec  # (time, n_mels)

def pad_sequence(seq, target_len=400):
    cur_len = seq.shape[0]
    if cur_len < target_len:
        pad = np.zeros((target_len - cur_len, seq.shape[1]), dtype=np.float32)
        seq = np.vstack([seq, pad])
    else:
        seq = seq[:target_len, :]
    return seq

# ----------- PIL 기반 이미지 디코딩 함수 -----------
def decode_image_pil(image_path, width=500, height=128):
    with Image.open(image_path).convert("L") as img:
        resized = img.resize((width, height))
        img_array = np.array(resized).astype(np.float32) / 255.0
        img_array = img_array.reshape((height, width, 1))
    return img_array

# ----------- Kotlin 호출용 엔트리 포인트 -----------
def process_audio_to_mel_and_features(audio_path, output_image_path):
    waveform = decode_audio_wave(audio_path)

    # 1. mel 이미지 저장 (별도)
    save_mel_spectrogram_image(audio_path, output_image_path)

    # 2. mel 이미지 numpy로 로딩
    mel_tensor = decode_image_pil(output_image_path)  # shape: (128, 500, 1)

    # 3. 전체 features
    full_vector = get_vector_features(waveform)
    full_sequence = pad_sequence(get_mel_sequence(waveform))

    # 4. segments
    segments = split_into_segments(waveform)
    segment_vectors = [get_vector_features(seg) for seg in segments]
    segment_sequences = [pad_sequence(get_mel_sequence(seg)) for seg in segments]

    return {
        "full_vector": full_vector,
        "full_sequence": full_sequence.tolist(),
        "mel_image": mel_tensor.tolist(),
        "segment_vectors": segment_vectors,
        "segment_sequences": [seq.tolist() for seq in segment_sequences]
    }
