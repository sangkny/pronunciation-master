# 🔊 TTS (Text-To-Speech) & 음성 기능 완벽 가이드

## 목차
- [개요](#개요)
- [TTS 구현 방식](#tts-구현-방식)
- [Web Speech API](#web-speech-api)
- [고급 TTS 서비스](#고급-tts-서비스)
- [음성 녹음 & 재생](#음성-녹음--재생)
- [사용 예제](#사용-예제)

---

## 개요

Pronunciation Master에는 **3가지 음성 기능**이 포함됩니다:

| 기능 | 설명 | 대상 |
|------|------|------|
| **AI 발음** | 학습 문장을 AI가 원어민처럼 발음 | 사용자 |
| **사용자 녹음** | 사용자의 발음을 녹음 | AI 분석 |
| **피드백 음성** | AI가 교정 사항을 음성으로 설명 | 사용자 |

---

## TTS 구현 방식

### 1️⃣ Web Speech API (기본값 - 무료)

**장점:**
- ✅ 브라우저 내장 (추가 설치 불필요)
- ✅ 완전 무료
- ✅ 인터넷 연결 선택사항
- ✅ 빠른 응답

**단점:**
- ❌ 음성 품질이 자연스럽지 않을 수 있음
- ❌ 언어 지원 제한
- ❌ 커스터마이징 제한

**구현:**
```javascript
// 이미 구현됨 - pronunciation-master-enhanced-app.jsx 참고

const speakText = (text, language = 'en-US', rate = 1.0) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = rate; // 0.5-2.0
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

// 사용
speakText("Hello, how are you?");
speakText("안녕하세요", "ko-KR");
```

### 2️⃣ Google Cloud Text-to-Speech (고급)

**장점:**
- ✅ 자연스러운 음성 (WaveNet)
- ✅ 다양한 언어 지원
- ✅ 음성 커스터마이징 가능

**단점:**
- ❌ 유료 (월 $4-16)
- ❌ API 키 필요

**설정:**
```bash
# 1. Google Cloud 프로젝트 생성
# https://console.cloud.google.com/

# 2. Text-to-Speech API 활성화

# 3. 서비스 계정 키 생성

# 4. .env 설정
echo "GOOGLE_TTS_API_KEY=xxxxx" >> .env.local
echo "GOOGLE_TTS_PROJECT_ID=xxxxx" >> .env.local
```

**백엔드 구현:**
```javascript
// backend/src/services/ttService.js
import textToSpeech from '@google-cloud/text-to-speech';

class TTSService {
  constructor(apiKey, projectId) {
    this.client = new textToSpeech.TextToSpeechClient({
      apiKey: apiKey
    });
    this.projectId = projectId;
  }

  async synthesizeSpeech(text, language = 'en-US', voiceName = 'en-US-Neural2-A') {
    const request = {
      input: { text: text },
      voice: {
        languageCode: language,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };

    const [response] = await this.client.synthesizeSpeech(request);
    return response.audioContent;
  }
}

export default TTSService;
```

### 3️⃣ AWS Polly (엔터프라이즈)

**장점:**
- ✅ 매우 자연스러운 음성
- ✅ 신경망 기반 음성
- ✅ 실시간 처리

**단점:**
- ❌ 복잡한 설정
- ❌ 상대적으로 비쌈

---

## Web Speech API

### 기본 사용법

```javascript
// 1️⃣ 텍스트 말하기 (가장 간단)
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// 2️⃣ 속도 조절
function speakWithSpeed(text, speed) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speed; // 0.5 = 느림, 1 = 정상, 2 = 빠름
  window.speechSynthesis.speak(utterance);
}

// 3️⃣ 사건 처리
function speakWithEvents(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.onstart = () => console.log('시작');
  utterance.onpause = () => console.log('일시중지');
  utterance.onresume = () => console.log('재개');
  utterance.onend = () => console.log('완료');
  utterance.onerror = (event) => console.log('오류:', event.error);
  
  window.speechSynthesis.speak(utterance);
}

// 4️⃣ 음성 선택
function getAvailableVoices() {
  return window.speechSynthesis.getVoices();
}

function speakWithVoice(text, voiceIndex) {
  const voices = window.speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceIndex];
  window.speechSynthesis.speak(utterance);
}

// 5️⃣ 중지 및 재개
window.speechSynthesis.pause();
window.speechSynthesis.resume();
window.speechSynthesis.cancel();
```

### 언어 코드

```javascript
// 자주 사용되는 언어 코드
const languages = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'ko-KR': 'Korean',
  'ja-JP': 'Japanese',
  'zh-CN': 'Chinese (Simplified)',
  'fr-FR': 'French',
  'de-DE': 'German',
  'es-ES': 'Spanish'
};
```

---

## 음성 녹음 & 재생

### 음성 녹음

```javascript
// 이미 구현됨 - pronunciation-master-enhanced-app.jsx 참고

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    // blob 처리
  };

  mediaRecorder.start();
};

const stopRecording = () => {
  mediaRecorder.stop();
};
```

### 음성 재생

```javascript
// 녹음된 음성 재생
const playRecording = (blob) => {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
};

// URL에서 재생
const playFromURL = (url) => {
  const audio = new Audio(url);
  audio.play();
};

// 재생 제어
const audio = new Audio();
audio.play();     // 재생
audio.pause();    // 일시중지
audio.currentTime = 10; // 10초로 이동
```

---

## 고급 TTS 서비스

### Microsoft Azure Speech Services

```bash
# 설치
npm install microsoft-cognitiveservices-speech-sdk

# 사용
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION
);

const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
synthesizer.speakTextAsync("Hello, world!");
```

### IBM Watson Text to Speech

```bash
# 설치
npm install ibm-watson

# 사용
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const tts = new TextToSpeechV1({
  authenticator: new IamAuthenticator({ apikey: API_KEY }),
  serviceUrl: SERVICE_URL
});

tts.synthesize({
  text: 'Hello world',
  voice: 'en-US_MichaelV3Voice',
  accept: 'audio/mp3'
});
```

---

## 사용 예제

### 예제 1: 기본 음성 재생

```jsx
import { Volume2 } from 'lucide-react';

function SimpleAudio() {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance("Hello, this is a test");
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button onClick={handleSpeak} className="flex items-center gap-2">
      <Volume2 className="w-4 h-4" />
      말하기
    </button>
  );
}
```

### 예제 2: 속도 조절

```jsx
function SpeedControl() {
  const [speed, setSpeed] = useState(1);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance("Text to speak");
    utterance.rate = speed;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
      />
      <p>속도: {(speed * 100).toFixed(0)}%</p>
      <button onClick={handleSpeak}>말하기</button>
    </div>
  );
}
```

### 예제 3: 음성 녹음 & 재생

```jsx
function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      setAudio(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const playRecording = () => {
    const url = URL.createObjectURL(audio);
    const audioElement = new Audio(url);
    audioElement.play();
  };

  return (
    <div className="space-y-2">
      {!isRecording ? (
        <button onClick={startRecording}>녹음 시작</button>
      ) : (
        <button onClick={stopRecording}>녹음 중지</button>
      )}
      {audio && <button onClick={playRecording}>재생</button>}
    </div>
  );
}
```

### 예제 4: 사용자 발음 분석

```jsx
function PronunciationAnalyzer() {
  const [recording, setRecording] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const analyzeRecording = async () => {
    const formData = new FormData();
    formData.append('audio', recording);
    formData.append('expectedSentence', "Hello, how are you?");

    const response = await fetch(
      'http://localhost:5000/api/pronunciation/analyze',
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    setFeedback(data);
  };

  return (
    <div className="space-y-4">
      {/* 녹음 컨트롤 */}
      {recording && (
        <button onClick={analyzeRecording}>
          발음 분석
        </button>
      )}
      {feedback && (
        <div>
          <p>정확도: {feedback.overallScore}%</p>
          <p>피드백: {feedback.suggestions}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 브라우저 지원

| 브라우저 | Web Speech | Recorder |
|---------|-----------|----------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |

---

## 성능 최적화

```javascript
// 1. 음성 합성 캐싱
const audioCache = new Map();

function getCachedAudio(text) {
  if (audioCache.has(text)) {
    return audioCache.get(text);
  }
  // 생성하고 캐시에 저장
}

// 2. 비동기 처리
async function speakAsync(text) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

// 3. 메모리 관리
function cleanupAudio() {
  window.speechSynthesis.cancel();
  audioCache.clear();
}
```

---

## 트러블슈팅

### 음성이 재생되지 않음
```javascript
// 1. 브라우저 콘솔에서 확인
if (!('speechSynthesis' in window)) {
  console.log('Web Speech API 미지원');
}

// 2. 음성 목록 확인
console.log(window.speechSynthesis.getVoices());

// 3. 권한 확인
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log(result.state));
```

### 녹음이 작동하지 않음
```javascript
// 1. 마이크 권한 확인
navigator.mediaDevices.getUserMedia({ audio: true })
  .catch(e => console.log('마이크 접근 거부:', e));

// 2. HTTPS 필수 (localhost 제외)
// 3. 브라우저 보안 설정 확인
```

---

## 다음 단계

1. 프론트엔드: `pronunciation-master-enhanced-app.jsx` 사용
2. 백엔드: 상황 기반 미션 생성 API 추가
3. TTS: 필요시 Google Cloud TTS 통합
4. 테스트: 다양한 브라우저에서 테스트

---

**더 자세한 정보:**
- [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
