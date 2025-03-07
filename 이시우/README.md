### 25.03.04 딥보이스 탐지 방법 학습

# 딥보이스 탐지 시스템 학습 README

이 문서는 **소리(음성)를 이미지(멜 스펙트로그램)로 변환**하고, 이를 기반으로 딥 러닝 모델을 활용하여 딥 보이스를 판별하는 기술의 개요와 학습 방법에 대해 간략하게 정리한 자료입니다.

## 개요

- **목적:**  
  딥러닝을 활용하여 딥 보이스(딥러닝 기반 음성 합성)와 일반 음성을 구별하는 시스템 개발

- **핵심 아이디어:**
    - **특징 추출:** 음성 데이터를 Mel-Spectrogram과 MFCC로 변환
    - **모델 구성:**
        - **CNN (VGG-19):** Mel-Spectrogram 이미지를 통한 주파수 특징 학습
        - **BiLSTM:** 음성의 시계열(파형) 특징을 학습
    - **앙상블:** 소프트 보팅 방식을 통해 두 모델의 예측 결과를 결합하여 최종 판별 수행

## 주요 구성 요소

1. **데이터 전처리 및 특징 추출**
    - **Mel-Spectrogram:**
        - 음성 신호에 Short Time Fourier Transform(STFT)을 적용 후, Mel Scale로 변환하여 이미지로 표현
        - 저음역과 고음역의 표현을 효과적으로 구분
    - **MFCC (Mel Frequency Cepstral Coefficient):**
        - 음성 신호의 주파수 정보를 사람의 청각 특성에 맞게 수치화
        - 주로 13개 이상의 계수를 사용하여 특징 벡터 생성

2. **모델 아키텍처**
    - **CNN (VGG-19):**
        - 이미지 데이터를 활용하여 음성의 주파수 특징을 추출
        - 사전 학습된 가중치로 초기화 후, 최상위 계층을 재구성하여 분류에 활용
    - **BiLSTM:**
        - 음성 데이터의 시계열 정보를 반영하여 시간적 패턴 학습
        - 양방향 LSTM을 사용하여 과거와 미래의 정보를 모두 고려
    - **앙상블 (Soft Voting):**
        - 두 모델의 예측 결과를 평균 내어 최종 클래스를 결정
        - 각 모델의 강점을 효과적으로 결합하여 높은 정확도와 신뢰성 확보

## 개발 환경 및 의존성

- **언어 및 프레임워크:**
    - Python 3
    - TensorFlow / Keras
    - Flask (서버 및 애플리케이션 연동 시)

- **라이브러리:**
    - Librosa (음성 데이터 전처리 및 특징 추출)
    - Sklearn (평가 지표 계산 및 데이터 분할 등)

- **하드웨어:**
    - GPU (예: NVIDIA GeForce RTX 시리즈)
    - 충분한 메모리 (예: 32GB 이상 권장)

## 사용 방법

1. **데이터 준비:**
    - AI-HUB 등의 데이터셋을 활용하여 딥 보이스와 일반 음성 데이터를 준비
    - 음성 파일을 16kHz 등 일정한 샘플링 레이트로 변환

2. **특징 추출:**
    - **Mel-Spectrogram:** Librosa를 이용해 음성 파일을 이미지 형태로 변환
      ```python
      import librosa
      import librosa.display
      import matplotlib.pyplot as plt
 
      # 음성 파일 로드
      y, sr = librosa.load('audio_file.wav', sr=16000)
 
      # Mel-Spectrogram 생성
      S = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=400, hop_length=160, n_mels=128)
      S_dB = librosa.power_to_db(S, ref=np.max)
 
      # 시각화 및 저장
      plt.figure(figsize=(10, 4))
      librosa.display.specshow(S_dB, sr=sr, hop_length=160, x_axis='time', y_axis='mel')
      plt.colorbar(format='%+2.0f dB')
      plt.title('Mel-Spectrogram')
      plt.tight_layout()
      plt.savefig('mel_spectrogram.png')
      ```
    - **MFCC:**
        - MFCC 벡터를 계산하여 모델 입력용 수치 데이터 생성

3. **모델 학습:**
    - CNN (VGG-19)와 BiLSTM 모델 각각을 학습
    - 학습 시, Dropout 및 Optimizer(Adam)를 적용하여 과적합 방지 및 성능 최적화
    - 두 모델의 예측 결과를 소프트 보팅 방식으로 결합하여 최종 판별 수행

4. **평가 및 배포:**
    - 혼동 행렬, Precision, Recall, F1-Score, Accuracy 등 평가 지표를 활용하여 성능 검증
    - 서버(Flask)와 모바일 애플리케이션(React Native) 연동으로 실시간 딥 보이스 탐지 시스템 구현

## 성능 요약

- **CNN 단독 모델:**
    - 높은 재현율과 전반적인 분류 정확도
- **BiLSTM 단독 모델:**
    - 상대적으로 높은 정밀도, 다만 재현율은 다소 낮음
- **Ensemble (CNN + BiLSTM):**
    - 정밀도, 재현율, F1-Score, 정확도 모두 우수한 성능을 보이며 실제 응용에 적합

## 참고 자료

- 음성 전처리 및 특징 추출 기법 관련 학술 자료
- CNN, VGG-19, BiLSTM 등 딥러닝 모델 관련 연구 논문
### 25.03.05 테스트모델 생성

# DeepVoice Detection Test Model

이 프로젝트는 실제 음성과 딥보이스(합성 음성)를 구분하기 위해, 오디오 파일로부터 Mel-Spectrogram 이미지를 생성하고, AutoKeras를 활용해 이미지 분류 모델을 학습한 테스트 모델을 구축하는 방법을 보여줍니다.

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [데이터 전처리](#데이터-전처리)
- [모델 학습](#모델-학습)
- [모델 내보내기 및 저장](#모델-내보내기-및-저장)
- [모델 사용 및 배포](#모델-사용-및-배포)
- [주의사항 및 개선점](#주의사항-및-개선점)

## 프로젝트 개요

이 테스트 모델은 다음과 같은 순서로 구축되었습니다.

1. **오디오 데이터 전처리**
    - 실제 음성과 딥보이스 음성 파일(.wav)을 `data/real`과 `data/deepvoice` 폴더에 정리
    - Librosa를 사용하여 각 오디오 파일로부터 Mel-Spectrogram 및 MFCC를 추출
    - 추출된 특징을 이미지 파일(PNG)로 저장 (예: `output/real` 및 `output/deepvoice`)

2. **모델 학습**
    - 저장된 Mel-Spectrogram 이미지를 기반으로 AutoKeras의 `ImageClassifier`를 사용하여 모델 학습
    - 학습 시 여러 Trial을 진행하여 최적의 모델 아키텍처와 하이퍼파라미터를 자동 탐색

3. **모델 내보내기**
    - 학습 완료 후, AutoKeras가 선택한 최적 모델을 Keras 모델 형식으로 내보내고, `deepvoice.h5` 파일로 저장

4. **모델 배포 및 테스트**
    - 저장된 모델을 불러와 새로운 데이터에 대해 예측을 수행
    - Flask API를 통해 실시간 예측 서비스를 제공할 수 있도록 구현 가능

## 데이터 전처리

- **데이터 수집 및 라벨링:**  
  실제 음성과 딥보이스 음성 파일은 각각 `data/real` 및 `data/deepvoice` 폴더에 저장합니다.  
  라벨은 실제 음성은 `0`, 딥보이스는 `1`로 지정하여 CSV 파일 또는 별도의 데이터 구조에 저장합니다.

- **특징 추출 및 이미지 저장:**  
  `build_dataset.py` 스크립트를 통해 각 오디오 파일을 Librosa로 로드하고, Pre-Emphasis 필터를 적용한 후 Mel-Spectrogram 및 MFCC를 추출합니다.  
  추출된 Mel-Spectrogram 이미지는 `output/real` 및 `output/deepvoice` 폴더에 PNG 파일로 저장됩니다.

## 모델 학습

- **데이터셋 구성:**  
  저장된 이미지 파일들을 AutoKeras를 사용하여 NumPy 배열로 불러오고, 각 이미지에 대한 라벨 정보를 함께 구성합니다.  
  예를 들어, 폴더 구조가 `output/real`과 `output/deepvoice`로 구분되어 있으며, 이를 기반으로 `load_images_from_folder()` 함수를 작성하여 데이터를 로드합니다.

- **AutoKeras ImageClassifier:**  
  AutoKeras의 `ImageClassifier`를 사용하여 모델을 학습합니다.  
  학습 시 최대 10개의 Trial을 진행하며, 각 Trial에서 다양한 CNN 아키텍처 및 하이퍼파라미터 조합을 실험합니다.

- **학습 결과:**  
  로그를 보면 검증셋에 대해 거의 100%에 가까운 정확도와 매우 낮은 검증 손실(val_loss)을 기록하였습니다.  
  이는 모델이 학습 데이터와 검증 데이터에 대해 높은 성능을 보였음을 나타내지만, 과적합 여부에 대한 추가 평가가 필요할 수 있습니다.

## 모델 내보내기 및 저장

학습이 완료된 후, 최적 모델은 다음과 같이 내보내어 저장합니다.

```python
# AutoKeras 모델 내보내기 및 저장 예시
model = clf.export_model()
model.save("deepvoice.h5")
print("모델이 'deepvoice.h5'로 저장되었습니다.")
```

이렇게 저장된 모델은 나중에 불러와 예측 및 배포에 활용할 수 있습니다.

## 모델 사용 및 배포

- **모델 불러오기:**  
  저장된 모델은 다음과 같이 불러올 수 있습니다.

  ```python
  from tensorflow.keras.models import load_model
  import autokeras as ak

  model = load_model("deepvoice.h5", custom_objects=ak.CUSTOM_OBJECTS)
  ```

- **예측 수행:**  
  불러온 모델에 전처리된 이미지를 입력하여 예측을 수행합니다.

  ```python
  from tensorflow.keras.preprocessing.image import load_img, img_to_array
  import numpy as np

  def prepare_image(image_path, target_size=(128, 128)):
      img = load_img(image_path, target_size=target_size)
      img = img_to_array(img) / 255.0
      return np.expand_dims(img, axis=0)

  test_img = prepare_image("path/to/test_image.png")
  predictions = model.predict(test_img)
  predicted_label = int(np.argmax(predictions, axis=1)[0])
  print("예측된 클래스:", predicted_label)
  ```

- **Flask API 배포:**  
  Flask를 이용하여 REST API 서버를 구성하면, 외부 애플리케이션에서 실시간 예측 서비스를 호출할 수 있습니다. (예제는 별도 Flask 스크립트 참고)

## 주의사항 및 개선점

- **과적합 검사:**  
  검증셋과 별도의 테스트셋에서 모델의 일반화 성능을 재평가해야 합니다.
- **데이터 다양성:**  
  더 다양한 환경의 데이터를 포함하거나 데이터 증강 기법을 적용하여 모델 성능을 개선할 수 있습니다.
- **추가 최적화:**  
  실제 배포 전 모델 추론 속도 및 메모리 최적화를 고려할 수 있습니다.

---

### 25.03.06 이상거래탐지에 대한 기술학습
# 이상 거래 탐지 최신 논문 및 기술 보고서 학습 README

이 문서는 금융 및 전자상거래 등 다양한 분야에서 발생하는 이상 거래(비정상 거래)를 탐지하기 위한 최신 연구 동향과 기술 보고서를 학습하기 위한 가이드입니다. 주요 최신 논문과 기술 보고서에서 다루는 방법론, 데이터 처리, 모델링 기법 및 시스템 구현 방법 등을 정리하였습니다.

## 1. 개요

- **목적:**  
  이상 거래 탐지에 관한 최신 연구 및 기술 보고서를 이해하고, 이를 바탕으로 효과적인 이상 거래 탐지 시스템을 설계 및 구현하기 위한 기초 자료 마련

- **중요성:**  
  금융 범죄, 사기 거래, 부정 거래 등으로 인한 피해를 줄이기 위해 실시간 이상 거래 탐지가 점점 더 중요해지고 있음

## 2. 최신 연구 동향

- **딥러닝 기반 접근:**
    - **Autoencoder, GAN:** 비지도 학습을 통한 이상치(Anomaly) 탐지
    - **LSTM, CNN:** 시계열 데이터와 거래 패턴의 특징을 학습하여 이상 거래를 탐지
- **앙상블 및 하이브리드 모델:**
    - 여러 모델의 예측 결과를 결합하여 보다 높은 정확도와 신뢰도를 달성
- **그래프 신경망 (GNN) 활용:**
    - 거래 네트워크의 구조적 특성을 반영하여 이상 거래 탐지에 적용
- **비지도 및 준지도 학습:**
    - 레이블이 부족한 환경에서 정상 거래 패턴을 학습하고 이상치를 탐지하는 방법론

## 3. 기술 보고서 주요 내용

- **데이터 전처리 및 특징 추출:**
    - 거래 데이터의 정제, 결측치 및 이상치 처리
    - 도메인 특화 특징(예: 거래 금액, 시간, 빈도 등) 및 통계적 특징 추출
- **모델 설계 및 구현:**
    - 다양한 머신러닝/딥러닝 알고리즘 비교
    - 하이퍼파라미터 튜닝, 교차 검증, 앙상블 기법 적용
- **실시간 처리 및 시스템 통합:**
    - Apache Kafka, Spark Streaming 등 스트리밍 데이터 처리 프레임워크 활용
    - REST API 및 대시보드를 통한 실시간 모니터링

## 4. 참고 데이터 및 평가 지표

- **데이터셋:**
    - 공개 신용카드 거래 데이터셋, 금융 거래 로그 데이터 등
    - 자체 구축 데이터 또는 시뮬레이션 데이터 활용
- **평가 지표:**
    - 혼동 행렬, Precision, Recall, F1-Score, AUC-ROC 등
    - 실시간 시스템의 응답 시간 및 처리량

## 5. 개발 및 연구 환경

- **프로그래밍 언어:** Python
- **주요 라이브러리 및 프레임워크:**
    - 데이터 처리: Pandas, NumPy
    - 머신러닝: scikit-learn, XGBoost
    - 딥러닝: TensorFlow, PyTorch
    - 스트리밍 처리: Apache Kafka, Spark Streaming
- **하드웨어:**
    - GPU 서버 (딥러닝 모델 학습용)
    - 클라우드 인프라 (AWS, GCP, Azure 등)

## 6. 학습 및 실험 방법

1. **문헌 조사:**
    - 최신 학술 논문(IEEE, ACM, KDD 등)과 기술 보고서(기업 백서, 연구소 보고서)를 분석하여 최신 동향 및 사례 파악
2. **데이터 준비 및 전처리:**
    - 실제 거래 데이터셋을 확보하고, 데이터 클렌징 및 특징 추출 작업 진행
3. **모델 개발:**
    - 여러 모델(딥러닝, 머신러닝, 앙상블 기법 등)을 구현하여 성능 비교 분석
4. **실험 평가:**
    - 각 모델의 성능을 평가 지표(Precision, Recall, F1-Score 등)로 측정하고, 실시간 처리 시스템의 응답 시간 분석
5. **결과 분석 및 개선:**
    - 실험 결과를 기반으로 모델의 성능 및 실시간 탐지 시스템의 개선 방향 도출

## 7. 향후 연구 방향

- **모델의 일반화 및 확장성 강화:**
    - 다양한 산업 및 거래 유형에 적용 가능한 범용 이상 거래 탐지 모델 개발
- **실시간 탐지 성능 최적화:**
    - 대용량 거래 데이터의 실시간 처리 및 응답 최적화
- **설명 가능한 AI (XAI) 적용:**
    - 모델의 결정 과정을 설명하고 해석 가능한 방법론 연구

## 8. 참고 자료 및 문헌 예시

- **논문 및 학술 자료:**
    - "Deep Learning for Fraud Detection: A Survey"
    - "Anomaly Detection in Financial Transactions Using Graph Neural Networks"
    - "Real-Time Fraud Detection in Streaming Data with Apache Kafka and Spark Streaming"
- **기술 보고서:**
    - 주요 금융 기관 및 IT 기업의 이상 거래 탐지 관련 백서 및 기술 보고서