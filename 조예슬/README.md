# 0304 TIL: [논문 요약] 딥 보이스 탐지 성능향상을 위한 오인률 기반 가중치 앙상블 기법

> *Error Rate-Based Weighted Ensemble Method for Improving the Performance of Deep Voice Detection*

## 1. 연구 의의
### ⭐ 배경
- AI 기반 음성 합성 기술(Deep Voice)의 발전으로 **보이스 피싱 범죄 증가**.
- 딥 보이스를 탐지하는 기술의 중요성이 대두됨.

### ⭐ 기존 문제점
- 기존 딥 보이스 탐지 모델은 **정확도(Accuracy) 기반의 가중치 앙상블 기법** 사용.
- 하지만, **오인률(Deep Voice Error Rate, DE)과 실제 음성 오인률(Real Voice Error Rate, RE)을 충분히 반영하지 못하는 한계**가 있음.

### ⭐ 연구 목적
- 기존 방식의 한계를 보완하기 위해 **오인률을 반영한 가중치 앙상블 기법**을 제안.
- 딥 보이스 탐지 성능을 개선하고, 다양한 음성 합성 기술에도 적용 가능하도록 함.


## 2. 주요 개념
- **Deep Voice Error Rate (DE)**: 딥 보이스를 실제 음성으로 오인하는 비율.
- **Real Voice Error Rate (RE)**: 실제 음성을 딥 보이스로 오인하는 비율.
- **기존 기법(Accuracy 기반 앙상블 기법)**: 모델의 정확도만을 기준으로 가중치를 설정.
- **제안 기법(오인률 기반 가중치 앙상블 기법)**: 각 모델의 DE와 RE 차이를 반영하여 가중치 설정.


## 3. 모델 구조

### 3-1. 데이터 처리 과정
1. **음성 데이터 수집**
   - Kaggle 데이터셋(`Real-time Detection of AI-Generated Speech`) 활용.
   - **실제 음성과 AI 생성 음성(RVC, Tacotron2 기반) 데이터 사용**.

2. **음성 특징 추출**
   - **Mel-Spectrogram** → CNN 모델(Simple CNN, ResNet-50)에 사용.
   - **MFCC(Mel-Frequency Cepstral Coefficients)** → BiLSTM, Transformer에 사용.

3. **딥러닝 모델 구성**
   - **Mel-Spectrogram 입력** → CNN (Simple CNN, ResNet-50)
   - **MFCC 입력** → BiLSTM, Transformer

4. **앙상블 기법 적용**
   - 기존 Accuracy 기반 방식과 비교하여 **오인률(DE, RE) 기반 가중치 적용**.


### 3-2. 제안된 오인률 기반 가중치 앙상블 기법
- 기존 방식: **Accuracy를 기준으로 가중치를 적용**.
- 제안 방식: **DE와 RE를 활용한 가중치 계산**.

#### 📌 가중치 계산 공식
\[
\alpha_{DE} = 1 - \frac{DE_A}{DE_A + DE_B}
\]
\[
\alpha_{RE} = 1 - \frac{RE_A}{RE_A + RE_B}
\]
\[
FinalWeight = \alpha_{DE} + \alpha_{RE}
\]

- **오인률이 낮은 모델에 더 높은 가중치를 부여**하여 최종 탐지 성능을 향상.


## 4. 실험 및 결과
- **비교 실험 진행:**  
  - 기존 **Accuracy 기반 가중치 앙상블 기법** vs. **제안된 오인률 기반 가중치 앙상블 기법**.
- **사용 데이터:**  
  - Tacotron2 변환 딥 보이스 데이터.
  - RVC 변환 딥 보이스 데이터.

### 4-1. 단일 모델 성능 (Accuracy, DE, RE)

| Model       | Accuracy(%) | DE(%) | RE(%) |
|------------|------------|-------|-------|
| Simple CNN | 88.65      | 14.00 | 7.86  |
| ResNet-50  | 90.00      | 12.86 | 7.29  |
| BiLSTM     | 91.57      | 11.14 | 5.71  |
| Transformer| 92.50      | 9.86  | 5.14  |

### 4-2. 앙상블 기법 비교

| **Ensemble Model** | **Accuracy(%)** | **DE(%)** | **RE(%)** |
|--------------------|----------------|------------|------------|
| **기존 Accuracy 기반** | 96.50 | 3.43 | 3.57 |
| **제안된 오인률 기반** | **97.14** | **3.29** | **2.57** |

### ⭐ 결과 분석
- **Accuracy가 약 1.2% 증가**.
- **DE(딥 보이스 오인률)과 RE(실제 음성 오인률)가 각각 0.8%, 1.6% 감소**.
- 기존 방식보다 **오탐률이 줄어들어 안정적인 탐지 가능성 증가**.



## 5. 결론 및 의의
### ✅ 기존 방식(Accuracy 기반)의 한계점
- **탐지 오류 발생 가능성 높음**: Accuracy 중심의 가중치 설정 방식이 DE/RE를 반영하지 않아 오탐 발생.
- 특정 클래스에만 집중하여 성능이 불균형해질 가능성이 있음.

### ✅ 제안 기법(오인률 기반 가중치 앙상블)의 장점
- **탐지 성능 향상**: 기존 기법보다 높은 정확도(97.14%) 기록.
- **오탐률 감소**: DE(3.29%), RE(2.57%)로 낮아짐.
- **새로운 음성 합성 기술에도 적용 가능**: Tacotron2, RVC 데이터를 사용했음에도 높은 성능 유지.

### ✅ 향후 연구 방향
- 다양한 음성 데이터(전화 음성, 녹음된 메시지, 배경 소음 포함 음성) 확장 적용.
- 실제 보이스 피싱 탐지 기술에 적용 가능성 검토.



## 6. 전체적인 플로우
1. **음성 데이터 수집**
   - 실제 음성과 딥 보이스(합성 음성) 확보.
2. **음성 특징 추출**
   - Mel-Spectrogram(CNN 계열), MFCC(BiLSTM, Transformer 계열) 활용.
3. **개별 모델 학습 및 성능 평가**
   - CNN, ResNet-50, BiLSTM, Transformer 모델 실험.
4. **앙상블 기법 적용**
   - 기존 Accuracy 기반 vs. 제안된 오인률 기반 방식 비교.
5. **실험 및 성능 분석**
   - Accuracy 증가(1.2%), DE/RE 감소(0.8%, 1.6%).
6. **결론 및 향후 연구 방향**
   - 보이스 피싱 방지 기술로 발전 가능성 검토.


## 7. 논문이 갖는 의의
- AI 기반 **보이스 피싱 탐지의 중요한 연구**로, 기존보다 정밀한 탐지 성능을 구현.
- 기존 방식의 문제점을 분석하고, **보다 안정적인 탐지 모델을 제안**.
- **음성 합성 기술이 발전해도 적용 가능한 모델을 설계**하여 실질적인 보안 향상 가능.

---

# 0305 TIL: [논문 요약] 통화 내용 분석을 통한 보이스피싱 범죄 탐지를 위한 인공지능적 접근법

> An Artificial Intelligent Approach To Detect Voice Phishing Crime By Analyzing The Call Content  

> *A Case Study on Voice Phishing Crime in South Korea*  

-  **Author**: MOUSSAVOU BOUSSOUGOU MILANDU KEITH  
- **Publication Date**: 2020.12.18  
🔗 [논문 원문 링크](https://research.ebsco.com/linkprocessor/plink?id=570225f8-d6be-3c47-8375-d8f42254549a)


## 1. 연구 의의
### ⭐ 배경
- 보이스 피싱 범죄는 **금융 및 사회적 문제를 초래하는 심각한 문제**로, 매년 많은 고객들이 피해를 보고 있음.
- **사용자들의 낮은 인식**과 **효율적인 대응 연구 부족**이 범죄 증가의 주요 원인으로 지목됨.

### ⭐ 연구 목적
- **AI 기술을 활용하여 보이스 피싱 탐지 모델을 개발**하고, 실험적으로 평가.
- **KorCCVid (Korean Call Content Vishing Dataset)** 구축 → **최초의 한국어 보이스 피싱 탐지용 라벨링 데이터셋**.
- **모바일 보이스 피싱 탐지 애플리케이션을 위한 증명 개념(Proof of Concept) 제시**.


## 2. 주요 개념 및 데이터셋 (KorCCVid)
### **KorCCVid 데이터셋 소개**
- **Korean Call Content Vishing Dataset(KorCCVid)**: 한국어 음성 통화 데이터를 **이진 분류(Binary Classification) 문제**로 다룰 수 있도록 정제한 데이터셋.
- **특징**:
  - 한국어로 된 **보이스 피싱 및 정상 통화 데이터** 포함.
  - **텍스트 기반 데이터셋** (음성에서 텍스트 변환 후 사용).
  - **라벨링된 데이터**: 피싱 여부(1: 보이스 피싱, 0: 정상 통화) 포함.


## 3. 모델 구조 및 실험 방법
### **3-1. 데이터 처리 과정**
1. **음성 데이터 수집 및 전처리**
   - 보이스 피싱 범죄 사례에서 확보한 한국어 음성 통화 데이터를 활용.
   - **텍스트 변환 후 TF-IDF 및 FastText 임베딩을 적용**.

2. **머신러닝 및 딥러닝 모델 학습**
   - **Shallow 모델 (기존 머신러닝 기법)**:
     - Random Forest, Linear SVC, LGBM 등 사용.
   - **딥러닝 모델 (신경망 기반 기법)**:
     - RNN, BiLSTM 활용.


### **3-2. 실험 결과**
- 여러 모델을 실험한 결과, **머신러닝 기반 Shallow 모델이 딥러닝보다 더 높은 성능을 보임**.
- 가장 우수한 성능을 보인 모델: **LGBM (LightGBM)**
  - **정확도(Accuracy) & F1-Score: 99%**
  - **속도 면에서도 가장 빠름**.
- 기존 유사 연구와 비교했을 때, **데이터셋 크기가 작음에도 불구하고 높은 성능을 기록**.


## 4. 결론 및 의의
### ✅ 연구의 주요 성과
- **KorCCVid 데이터셋을 구축**하여 보이스 피싱 탐지 연구에 기여.
- **텍스트 기반 보이스 피싱 탐지 모델을 구현**하고, 실험적으로 성능을 입증.
- 머신러닝 모델이 딥러닝 모델보다 더 우수한 성능을 보였음.
- LGBM 모델을 활용하면 **정확하고 빠른 탐지가 가능**함을 확인.

### ✅ 향후 연구 방향
- **더 다양한 보이스 피싱 데이터 확보 및 모델 성능 개선**.
- **음성 직접 분석 가능하도록 확장 (STT 기술 개선, 음성 특성 추가 분석)**.
- **실제 금융기관 및 모바일 보이스 피싱 방지 시스템에 적용 가능성 탐색**.


## 5. 전체적인 플로우
1. **음성 데이터 수집 및 라벨링** (KorCCVid 구축)
2. **텍스트 변환 및 전처리** (TF-IDF, FastText 사용)
3. **머신러닝 & 딥러닝 모델 학습**
4. **성능 평가 및 비교 분석**
5. **LGBM 모델이 최적 모델로 선정됨**
6. **향후 연구 방향 및 실제 시스템 적용 가능성 논의**



## 6. 논문의 의미
- **최초의 한국어 보이스 피싱 탐지용 데이터셋(KorCCVid) 구축**.
- **보이스 피싱 탐지를 위한 AI 모델 연구에 기여**.
- **빠르고 효과적인 탐지 성능을 입증하여 실제 금융 보안 시스템에 적용 가능**.

=> 스크립트 기반의 음성 탐지 모델 및 데이터셋 확인


---

# 0306 TIL: [논문 요약] KoBERT 기반의 통화내용 분석을 통한 보이스피싱 예방 서비스 개발 및 활용

> **KoBERT 기반의 통화내용 분석을 통한 보이스피싱 예방 서비스 개발 및 활용**

> *Development and Utilization of a Voice Phishing Prevention Service Through Call Content Analysis Using KoBERT*

- **Authors**: 양지훈(Jihoon Yang), 이충훈(Choonghoon Lee), 김성백(Seong Baeg Kim)  
- **Published in**: 정보과학회 컴퓨팅의 실제 논문지  
- **Publication Date**: 2023.05.31  
- **논문 링크**: [🔗 원문 링크](https://doi.org/10.5626/KTCP.2023.29.5.205)  


## **1. 연구 의의**
### ⭐ 배경
- **보이스피싱 범죄가 지속적으로 증가**하고 있으며, 탐지 및 예방을 위한 연구가 필요함.
- 기존 보이스피싱 탐지 기법은 **단순 패턴 매칭이나 음성적 특징을 분석하는 수준**에 머물러 있음.
- 최근 **보이스피싱 기법이 AI(딥페이크, 딥보이스 등)를 활용하여 지능화됨**.
- 피해자들이 정상 통화와 보이스피싱을 **구분하기 어려운 현실적 문제**가 있음.

### ⭐ 연구 목적
- **딥러닝 기반 KoBERT 모델을 활용한 보이스피싱 탐지 모델 개발**.
- **통화 내용을 분석하여 보이스피싱 위험도를 평가하는 시스템 구축**.
- **보이스피싱 예방 교육 콘텐츠를 함께 제공하여 사용자의 인지 능력 향상**.
- **탐지 시스템과 예방 교육을 결합한 새로운 서비스 제안**.


## **2. 주요 개념 및 데이터셋**
### **KoBERT란?**
- **KoBERT(Korean BERT)**: SK T-Brain에서 개발한 한국어 자연어 처리(NLP) 특화 딥러닝 모델.
- 기존 BERT 모델을 한국어 데이터로 추가 학습하여 **한국어 텍스트 분석 성능을 향상**.
- **보이스피싱 탐지에 적용하여 통화 내용을 분석하고 위험도를 평가하는 데 활용**.

### **데이터셋**
- **금융감독원 보이스피싱 범죄 통화 녹음 데이터** (412건)
  - **수사기관 사칭형 (227건)**: 검찰, 경찰, 금융감독원 등을 사칭하는 유형.
  - **대출 사기형 (185건)**: 저금리 대출을 미끼로 한 사기 유형.
- **AI Hub 상담 음성 데이터셋** (총 3,000시간)
  - **교육(1,000시간)**, **금융(1,000시간)**, **통신판매(1,000시간)** 분야 포함.
  - STT(Speech-to-Text)를 적용하여 텍스트 데이터로 변환 후 사용.



## **3. 모델 구조 및 실험 방법**
### **3-1. 데이터 처리 과정**
1. **음성 데이터 전처리**
   - **Sample Rate Conversion**: FFmpeg를 사용하여 샘플 레이트를 16kHz로 변환.
   - **Clip Segmentation**: STT API가 20초 단위 변환을 지원하므로, 20초 단위로 나눔.
   - **STT 변환**: ETRI AI API를 이용하여 음성을 텍스트로 변환.
   - **텍스트 전처리**:
     - 불필요한 특수 문자 제거 (Data Cleaning)
     - 문장 단위 분할 (Sentence Segmentation, KSS 활용)
     - 텍스트 병합 및 CSV 변환 (Data Merging)

2. **모델 학습**
   - **데이터셋 구성**:
     - 금융감독원 보이스피싱 통화 데이터: 15,078개 문장
     - AI Hub 일반 대화 데이터: 15,635개 문장
     - **총 30,713개 문장을 ‘보이스피싱(1)’과 ‘일반 대화(0)’로 라벨링**
   - **데이터 분할**:
     - **80% (24,570개) → 학습 데이터**
     - **20% (6,143개) → 테스트 데이터**
   - **KoBERT 모델을 기반으로 전이 학습(Fine-Tuning) 수행**.



### **3-2. 실험 결과**
- **KoBERT 모델 학습 후 성능 평가**
  - **Epoch 10에서 최고 정확도(97.87%) 달성**
  - **Loss 값(오차율) 0.00008로 안정적인 학습 확인**
  - **과적합 방지를 위해 Epoch 10을 최적값으로 설정**
  
| **모델 학습 파라미터** | **설정값** |
|----------------|------------|
| max_len | 64 |
| batch_size | 64 |
| warmup_ratio | 0.1 |
| num_epochs | 10 |
| max_grad_norm | 1 |
| log_interval | 200 |
| learning_rate | 5e-5 |



### **3-3. 보이스피싱 위험도 분석**
- **모델이 탐지한 보이스피싱 문장의 비율을 기반으로 위험도 계산**
  - 전체 문장 개수: \\( N_1 \\)
  - 보이스피싱으로 판별된 문장 개수: \\( N_2 \\)
  - **위험도(P) 공식**:
    \[
    P = \frac{N_2}{N_1}
    \]
- **위험도 범위에 따라 보이스피싱 경고 제공**
  - **0% ~ 60%** → "보이스피싱 안전 대화"
  - **60% ~ 80%** → "보이스피싱 주의 대화"
  - **80% ~ 100%** → "보이스피싱 위험 대화"



### **3-4. API 서버 및 서비스 개발**
- **Flask 기반 API 서버 구축**
  - 사용자의 음성 파일을 업로드 → STT 변환 → KoBERT 모델 적용 → 보이스피싱 위험도 분석
- **보이스피싱 예방 서비스 개발**
  - **보이스피싱 탐지 결과 제공 (확률 기반)**
  - **금융감독원의 보이스피싱 예방 교육 자료 제공**
  - **보이스피싱 피해 신고 주요 연락처 안내**
  - **보이스피싱 시뮬레이션(퀴즈 형식) 기능 추가**



## **4. 결론 및 의의**
### ✅ 연구의 주요 성과
- **KoBERT 기반 보이스피싱 탐지 모델을 개발**하여 실질적인 보이스피싱 탐지 성능을 입증.
- **보이스피싱 위험도 평가 기능을 추가하여 실시간 탐지 가능**.
- **탐지 시스템과 예방 교육을 결합하여 피해 예방 가능성 증대**.

### ✅ 향후 연구 방향
- **보이스피싱 데이터셋을 확장하여 모델의 범용성을 높이는 연구** 진행.
- **음성 분석을 포함하여 보이스피싱 탐지 정확도를 향상**.
- **실제 금융기관 및 통신사와 협력하여 실시간 탐지 시스템 구축 가능성 검토**.


## **5. 전체적인 플로우**
1. **음성 데이터를 수집하고 STT를 통해 텍스트로 변환**.
2. **KoBERT 모델을 학습시켜 보이스피싱 탐지 모델 개발**.
3. **통화 내용을 분석하여 보이스피싱 위험도를 평가**.
4. **탐지 모델과 예방 교육 콘텐츠를 결합한 서비스 제공**.
5. **보이스피싱 탐지 성능을 평가하고 개선 방향 제시**.


=> 한국어 보이스피싱 음성 데이터셋 확인

---

# 0307 TIL: [모델 경량화] 양자화, 가중치 프루닝 & 저수준 최적화

## 1. 양자화 (Quantization)
양자화는 모델의 **가중치(Weights)와 연산(Activations)을 낮은 비트수로 변환**하여 크기와 연산량을 줄이는 기법이다.

### 1.1 양자화 종류
1. **Post-training Quantization (PTQ)**
   - 학습이 끝난 후 모델을 변환하는 방식.
   - **적용 가능 유형**
     - `Dynamic Range Quantization` → 가중치만 8-bit 변환 (CPU 속도 향상)  
     - `Full Integer Quantization` → 가중치와 활성화 함수(Activations)까지 8-bit 변환 (속도 극대화)  
     - `Float16 Quantization` → 가중치를 Float16으로 변환 (GPU 가속 지원)

2. **Quantization-aware Training (QAT)**
   - 학습 과정에서 양자화를 고려하여 훈련.
   - PTQ보다 정확도 저하가 적음.
   - 특히 CNN, RNN과 같은 모델에서 효과적.

### 1.2 양자화 적용 방법
#### TensorFlow Lite (TFLite)
```python
import tensorflow as tf

converter = tf.lite.TFLiteConverter.from_saved_model('model_path')
converter.optimizations = [tf.lite.Optimize.DEFAULT]  # 기본 양자화 적용
tflite_model = converter.convert()

with open("quantized_model.tflite", "wb") as f:
    f.write(tflite_model)
```

#### PyTorch → ONNX → TFLite 변환
```python
import torch
model = torch.load('model.pth')
model.eval()
model.qconfig = torch.quantization.get_default_qconfig("fbgemm")  # 양자화 설정
torch.quantization.prepare(model, inplace=True)
torch.quantization.convert(model, inplace=True)
torch.jit.save(torch.jit.script(model), 'quantized_model.pt')
```

#### ONNX Runtime을 활용한 가속화
```python
import onnxruntime as ort
ort_session = ort.InferenceSession("quantized_model.onnx", providers=["CPUExecutionProvider"])
```

---

## 2. 가중치 프루닝 & 저수준 최적화 (Weight Pruning & Low-Level Optimization)
가중치 프루닝과 최적화를 통해 **모델의 크기를 줄이고 속도를 향상**할 수 있다.

### 2.1 가중치 프루닝 (Weight Pruning)
- 모델의 **중요하지 않은 가중치를 제거**하여 계산량을 줄이는 기법.
- 주요 기법:
  - **Unstructured Pruning**: 작은 가중치를 선택적으로 제거 (압축 효과 큼, 가속기 활용 어려움)
  - **Structured Pruning**: 특정 필터, 채널, 뉴런 단위로 제거 (모바일 친화적)
  - **Global Pruning**: 전체 네트워크에서 불필요한 가중치 제거

#### PyTorch에서 가중치 프루닝 적용
```python
import torch
import torch.nn.utils.prune as prune

model = torch.load('model.pth')
for name, module in model.named_modules():
    if isinstance(module, torch.nn.Conv2d) or isinstance(module, torch.nn.Linear):
        prune.l1_unstructured(module, name="weight", amount=0.3)  # 30% 가중치 제거
torch.save(model.state_dict(), 'pruned_model.pth')
```

---

### 2.2 저수준 최적화 (Low-Level Optimization)
모델 실행 시 연산을 줄이고 최적화하는 기법.

#### 1. 연산 최적화
- **Batch Normalization Folding**  
  - Conv2D + BatchNorm을 하나의 연산으로 합쳐 속도 향상  
  ```python
  import tensorflow_model_optimization as tfmot

  model = tf.keras.models.load_model('model.h5')
  model = tfmot.clustering.keras.strip_clustering(model)
  ```

- **Operator Fusion**  
  - 여러 개의 연산을 하나로 묶어 실행 속도를 높이는 기법 (TensorRT, ONNX Runtime 적용 가능)

#### 2. 프레임워크 기반 최적화
- **TensorRT (NVIDIA GPU 가속)**
  ```python
  import tensorrt as trt
  TRT_LOGGER = trt.Logger(trt.Logger.WARNING)
  builder = trt.Builder(TRT_LOGGER)
  ```

- **NNAPI (Android Neural Networks API)**
  - Android에서 TFLite 모델 실행 시 가속기 활용 가능
  ```python
  import tflite_runtime.interpreter as tflite
  interpreter = tflite.Interpreter(model_path="model.tflite")
  interpreter.allocate_tensors()
  ```

## 📌 정리
| 방법                                  | 설명                             | 장점                      | 단점               |
| ------------------------------------- | -------------------------------- | ------------------------- | ------------------ |
| **Post-training Quantization (PTQ)**  | 학습 후 모델을 8-bit 정수로 변환 | 모델 크기 감소, 속도 향상 | 정확도 감소 가능   |
| **Quantization-aware Training (QAT)** | 학습 중 양자화를 반영            | 정확도 유지               | 구현 난이도 높음   |
| **Pruning (Unstructured)**            | 작은 가중치 제거                 | 모델 크기 대폭 축소       | 가속기 사용 어려움 |
| **Pruning (Structured)**              | 채널, 뉴런 단위 제거             | 모바일 친화적             | 정확도 감소 가능   |
| **BatchNorm Folding**                 | BN + Conv 통합                   | 속도 향상                 | 모델 수정 필요     |


## 🎯 시도할 방법
1. **Post-training Quantization (PTQ) 적용**  
   → 처음엔 PTQ로 쉽게 크기를 줄여보고, 필요하면 QAT 적용
2. **Structured Pruning 사용**  
   → 모바일 친화적인 구조로 가중치 제거
3. **BatchNorm Folding, Operator Fusion 적용**  
   → 실행 속도를 최적화