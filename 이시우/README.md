
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