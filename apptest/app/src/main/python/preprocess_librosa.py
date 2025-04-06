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
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image  # ✅ TensorFlow 없이 이미지 처리

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

# def extract_log_mel_spec(signal, sr=16000, n_fft=400, hop_length=160, n_mels=128):
#     mel_spec = librosa.feature.melspectrogram(y=signal, sr=sr, n_fft=n_fft,
#                                               hop_length=hop_length, n_mels=n_mels)
#     log_mel_spec = librosa.power_to_db(mel_spec, ref=np.max)
#     return log_mel_spec

def extract_log_mel_spec(signal, sr=16000, n_fft=400, hop_length=160, n_mels=128):
    mel_spec = librosa.feature.melspectrogram(
        y=signal, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels, power=1.0
    )
    mel_spec = np.maximum(mel_spec, 1e-6)  # Avoid log(0)
    log_mel_spec = np.log(mel_spec)        # TensorFlow 방식과 같게
    return log_mel_spec


def save_mel_spectrogram_image(wav_path, out_path,
                               sr=16000, n_fft=400, hop_length=160, n_mels=128, pre_emphasis_coef=0.97):
    y, _ = librosa.load(wav_path, sr=sr)
    if len(y) == 0:
        print(f"[Warning] Empty audio: {wav_path}")
        return
    y_emphasized = np.append(y[0], y[1:] - pre_emphasis_coef * y[:-1])
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
    return mel_spec.T  # shape: (time, 128)

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
    with Image.open(image_path).convert("L") as img:  # L = grayscale
        resized = img.resize((width, height))
        img_array = np.array(resized).astype(np.float32) / 255.0  # Normalize to 0-1
        img_array = img_array.reshape((height, width, 1))  # Add channel dim
    return img_array  # shape: (128, 500, 1)

# ----------- Kotlin 호출용 엔트리 포인트 -----------
def process_audio_to_mel_and_features(audio_path, output_image_path):
    waveform = decode_audio_wave(audio_path)

    # 1. mel 이미지 저장
    save_mel_spectrogram_image(audio_path, output_image_path)

    # 2. mel 이미지 numpy로 로딩 (PIL 방식)
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
