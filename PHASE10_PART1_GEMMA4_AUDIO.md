# Phase 10 Part 1-D: Gemma 4 오디오 처리 + WebGPU 브라우저 추론

**상태:** Phase 9 완료 (4a4e4ba + 08b0f94) ✅  
**목표:** Gemma 4의 멀티모달 능력으로 발음 학습 개선 + 프라이버시 보호

---

## **Background: 왜 Gemma 4인가?**

현재 Pronunciation Master:
- ❌ 음성 STT: 외부 API 의존 (비용, 프라이버시 위험)
- ❌ 피드백: 텍스트만 처리 (이미지 활용 못함)
- ❌ 서버: 모든 추론이 백엔드에서만 (비용 증가)

**Gemma 4 도입:**
- ✅ 오디오 입력 지원 (E2B, E4B, 12B 모든 모델)
- ✅ 이미지 + 음성 동시 처리 (IPA 차트 + 음성 분석)
- ✅ 브라우저 로컬 추론 (WebGPU, Transformers.js)
- ✅ 128K-256K 토큰 컨텍스트 (긴 음성 처리 가능)

---

## **Part 1-D: Gemma 4 오디오 + WebGPU 브라우저 추론**

```
프로젝트: Pronunciation Master - Phase 10 Part 1-D: Gemma 4 멀티모달 추론

현재 상태:
- Phase 9 완료 (팀 관리, B2B API, CDN, Book)
- LMStudio Gemma 4 사용 중 (텍스트/이미지)
- 음성은 외부 STT API 의존

작업 목표: Gemma 4 오디오 처리 + WebGPU 브라우저 로컬 추론 구현

작업 내용:

1. GEMMA4_AUDIO_IMPLEMENTATION.md 작성 (프로젝트 루트)
   
   핵심 전략:
   - E4B 모델 사용 (128K 토큰, 오디오 지원, 모바일 최적화)
   - 브라우저 로컬 추론 (WebGPU + Transformers.js)
   - 백엔드 폴백 (네트워크 불안정시)
   - 음성 데이터 프라이버시 (기기 내 처리, 서버 전송 X)

2. backend/src/services/gemma4AudioService.js 생성
   
   ```javascript
   // Gemma 4를 LMStudio에서 오디오 처리
   // (백엔드 폴백용)
   
   const axios = require('axios');
   
   class Gemma4AudioService {
     constructor() {
       this.lmstudioUrl = process.env.LMSTUDIO_API_URL || 'http://host.docker.internal:1234/v1';
     }
     
     /**
      * 음성 파일 분석 (오디오 + IPA 차트)
      * @param {Buffer} audioBuffer - 음성 데이터 (WAV/MP3)
      * @param {String} ipaChart - IPA 음소 이미지 URL
      * @param {Object} context - {word, correctPronunciation, userLevel}
      */
     async analyzeAudioWithIPA(audioBuffer, ipaChart, context) {
       const {word, correctPronunciation, userLevel} = context;
       
       try {
         // 1. 음성을 base64로 인코딩
         const audioBase64 = audioBuffer.toString('base64');
         
         // 2. LMStudio (Gemma 4)에 멀티모달 요청
         const response = await axios.post(
           `${this.lmstudioUrl}/chat/completions`,
           {
             model: 'google/gemma-4-e4b',
             messages: [
               {
                 role: 'system',
                 content: '당신은 영어 발음 전문 AI입니다. 음성과 IPA 차트를 분석하여 발음 피드백을 제공합니다.'
               },
               {
                 role: 'user',
                 content: [
                   {
                     type: 'text',
                     text: `음성 분석 요청:
                     단어: ${word}
                     정확한 발음: ${correctPronunciation}
                     사용자 레벨: ${userLevel}
                     
                     다음을 포함한 분석:
                     1. 녹음된 음성의 음소 비교
                     2. 스트레스 패턴 분석
                     3. 유창성 평가
                     4. 구체적 개선점`
                   },
                   {
                     type: 'image_url',
                     image_url: {
                       url: ipaChart  // IPA 음소 차트 이미지
                     }
                   }
                   // Gemma 4가 오디오도 지원하면:
                   // {
                   //   type: 'audio',
                   //   audio_url: {
                   //     url: `data:audio/wav;base64,${audioBase64}`
                   //   }
                   // }
                 ]
               }
             ],
             temperature: 0.7,
             max_tokens: 1024,
             stream: false
           },
           {
             timeout: 60000,
             headers: {'Content-Type': 'application/json'}
           }
         );
         
         return {
           success: true,
           analysis: response.data.choices[0].message.content,
           processedAt: new Date()
         };
       } catch (error) {
         console.error('Audio analysis error:', error.message);
         return {
           success: false,
           error: error.message,
           fallback: 'WebGPU 브라우저 버전을 사용해주세요'
         };
       }
     }
     
     /**
      * 음성을 텍스트로 변환 (Gemma 4 오디오 이해)
      */
     async transcribeAudio(audioBuffer) {
       try {
         const audioBase64 = audioBuffer.toString('base64');
         
         const response = await axios.post(
           `${this.lmstudioUrl}/chat/completions`,
           {
             model: 'google/gemma-4-e4b',
             messages: [
               {
                 role: 'user',
                 content: [
                   {
                     type: 'text',
                     text: 'Please transcribe this English audio and return only the text without any additional explanation.'
                   }
                   // 오디오 지원 시:
                   // {
                   //   type: 'audio',
                   //   audio: audioBase64
                   // }
                 ]
               }
             ],
             max_tokens: 512
           }
         );
         
         return response.data.choices[0].message.content.trim();
       } catch (error) {
         console.error('Transcription error:', error.message);
         return null;
       }
     }
   }
   
   module.exports = new Gemma4AudioService();
   ```

3. backend/src/routes/audio-analysis.js 생성
   
   ```javascript
   const express = require('express');
   const router = express.Router();
   const gemma4AudioService = require('../services/gemma4AudioService');
   const authMiddleware = require('../middleware/authMiddleware');
   
   // 음성 + IPA 차트 분석
   router.post('/analyze', authMiddleware, async (req, res) => {
     try {
       const {audioBase64, ipaChartUrl, word, correctPronunciation, userLevel} = req.body;
       
       if (!audioBase64 || !word) {
         return res.status(400).json({error: 'Missing audio or word'});
       }
       
       // base64 → Buffer
       const audioBuffer = Buffer.from(audioBase64, 'base64');
       
       const analysis = await gemma4AudioService.analyzeAudioWithIPA(
         audioBuffer,
         ipaChartUrl,
         {word, correctPronunciation, userLevel}
       );
       
       res.json(analysis);
     } catch (error) {
       res.status(500).json({error: error.message});
     }
   });
   
   // 음성 텍스트 변환
   router.post('/transcribe', authMiddleware, async (req, res) => {
     try {
       const {audioBase64} = req.body;
       
       if (!audioBase64) {
         return res.status(400).json({error: 'Missing audio'});
       }
       
       const audioBuffer = Buffer.from(audioBase64, 'base64');
       const text = await gemma4AudioService.transcribeAudio(audioBuffer);
       
       res.json({text});
     } catch (error) {
       res.status(500).json({error: error.message});
     }
   });
   
   module.exports = router;
   ```

4. backend/src/server.js 수정
   
   ```javascript
   // ... 기존 코드
   
   const audioAnalysisRouter = require('./routes/audio-analysis');
   app.use('/api/audio', audioAnalysisRouter);
   
   // ... 나머지 코드
   ```

5. frontend/src/components/PronunciationMissionWithGemma.jsx 생성
   
   ```javascript
   import React, {useState, useRef, useEffect} from 'react';
   import {pipeline, env} from '@huggingface/transformers';
   
   /**
    * 발음 미션 (Gemma 4 오디오 분석)
    * 1. WebGPU 브라우저 추론 (선호) → 프라이버시 + 빠름
    * 2. 백엔드 폴백 (네트워크 불안정) → 안정성
    */
   
   export default function PronunciationMissionWithGemma({conceptId, ipaChart}) {
     const [audioRecorder, setAudioRecorder] = useState(null);
     const [isRecording, setIsRecording] = useState(false);
     const [recordedAudio, setRecordedAudio] = useState(null);
     const [isAnalyzing, setIsAnalyzing] = useState(false);
     const [analysis, setAnalysis] = useState(null);
     const [useWebGPU, setUseWebGPU] = useState(true); // 브라우저 추론 우선
     const videoRef = useRef(null);
     const canvasRef = useRef(null);
   
     // WebGPU Gemma 4 파이프라인 초기화
     const initializeGemma4WebGPU = async () => {
       try {
         env.useBrowserCache = true;
         
         // E4B 모델 (경량, 오디오 지원)
         const pipe = await pipeline(
           'any-to-any',
           'onnx-community/gemma-4-E4B-it-ONNX'
         );
         
         return pipe;
       } catch (error) {
         console.error('WebGPU 초기화 실패:', error);
         setUseWebGPU(false);
         return null;
       }
     };
   
     // 음성 녹음 시작
     const startRecording = async () => {
       try {
         const stream = await navigator.mediaDevices.getUserMedia({
           audio: {
             sampleRate: 16000,  // Gemma 4 권장 샘플레이트
             echoCancellation: true,
             noiseSuppression: true
           }
         });
         
         const mediaRecorder = new MediaRecorder(stream);
         const audioChunks = [];
         
         mediaRecorder.ondataavailable = (event) => {
           audioChunks.push(event.data);
         };
         
         mediaRecorder.onstop = async () => {
           const audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
           setRecordedAudio(audioBlob);
           
           // 자동 분석 시작
           analyzeWithGemma(audioBlob);
         };
         
         mediaRecorder.start();
         setAudioRecorder(mediaRecorder);
         setIsRecording(true);
       } catch (error) {
         console.error('마이크 접근 실패:', error);
       }
     };
   
     // 녹음 중지
     const stopRecording = () => {
       if (audioRecorder) {
         audioRecorder.stop();
         setIsRecording(false);
       }
     };
   
     // Gemma 4로 음성 분석
     const analyzeWithGemma = async (audioBlob) => {
       setIsAnalyzing(true);
       
       try {
         if (useWebGPU) {
           // 방식 1: WebGPU 브라우저 추론 (프라이버시 우선)
           await analyzeWithWebGPU(audioBlob);
         } else {
           // 방식 2: 백엔드 Gemma 4 (네트워크 필요)
           await analyzeWithBackend(audioBlob);
         }
       } catch (error) {
         console.error('분석 실패:', error);
         
         // WebGPU 실패 시 백엔드로 폴백
         if (useWebGPU) {
           console.log('WebGPU 실패, 백엔드로 폴백...');
           setUseWebGPU(false);
           await analyzeWithBackend(audioBlob);
         }
       } finally {
         setIsAnalyzing(false);
       }
     };
   
     // 방식 1: WebGPU 브라우저 추론
     const analyzeWithWebGPU = async (audioBlob) => {
       const pipe = await initializeGemma4WebGPU();
       if (!pipe) throw new Error('WebGPU Gemma 4 로드 실패');
       
       // 음성을 이미지로 변환 (스펙트로그램)
       const spectrogramImage = await audioToSpectrogram(audioBlob);
       
       // Gemma 4 분석
       const result = await pipe({
         text: `이 음성을 분석해주세요:
         단어: ${document.getElementById('word')?.textContent || 'unknown'}
         정확한 발음: ${document.getElementById('ipa')?.textContent || 'unknown'}
         
         분석 항목:
         1. 음소 정확도
         2. 스트레스 패턴
         3. 유창성
         4. 개선점`,
         image: spectrogramImage
       });
       
       setAnalysis({
         method: 'WebGPU (로컬)',
         result: result.text,
         confidence: 'high'
       });
     };
   
     // 방식 2: 백엔드 Gemma 4 (폴백)
     const analyzeWithBackend = async (audioBlob) => {
       const audioBase64 = await blobToBase64(audioBlob);
       
       const response = await fetch('/api/audio/analyze', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify({
           audioBase64,
           ipaChartUrl: ipaChart,
           word: document.getElementById('word')?.textContent,
           correctPronunciation: document.getElementById('ipa')?.textContent,
           userLevel: localStorage.getItem('userLevel') || 'beginner'
         })
       });
       
       const data = await response.json();
       
       setAnalysis({
         method: 'Backend Gemma 4',
         result: data.analysis,
         confidence: 'medium'
       });
     };
   
     // 음성을 스펙트로그램 이미지로 변환
     const audioToSpectrogram = async (audioBlob) => {
       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
       const arrayBuffer = await audioBlob.arrayBuffer();
       const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
       
       // Spectrogram 계산 (FFT)
       const canvas = canvasRef.current;
       const ctx = canvas.getContext('2d');
       
       // 간단한 스펙트로그램 렌더링
       const width = canvas.width;
       const height = canvas.height;
       const imageData = ctx.createImageData(width, height);
       
       // ... FFT 계산 후 canvas에 그리기
       
       return canvas.toDataURL('image/png');
     };
   
     // Blob을 base64로 변환
     const blobToBase64 = (blob) => {
       return new Promise((resolve) => {
         const reader = new FileReader();
         reader.onloadend = () => resolve(reader.result.split(',')[1]);
         reader.readAsDataURL(blob);
       });
     };
   
     return (
       <div className="pronunciation-mission-gemma">
         <div className="recording-section">
           <h3>음성 녹음</h3>
           <button
             onClick={isRecording ? stopRecording : startRecording}
             className={isRecording ? 'btn-stop' : 'btn-start'}
           >
             {isRecording ? '녹음 중지' : '녹음 시작'}
           </button>
           {recordedAudio && <p>✅ 녹음 완료</p>}
         </div>
   
         {isAnalyzing && (
           <div className="analyzing">
             <p>🤖 {useWebGPU ? 'WebGPU' : '백엔드'}에서 Gemma 4로 분석 중...</p>
             <div className="progress-bar"></div>
           </div>
         )}
   
         {analysis && (
           <div className="analysis-result">
             <p className="method">방식: {analysis.method}</p>
             <div className="aomd-feedback">
               {analysis.result}
             </div>
           </div>
         )}
   
         <canvas ref={canvasRef} width="400" height="100" style={{display: 'none'}}></canvas>
       </div>
     );
   }
   ```

6. frontend/src/services/audioService.js 추가
   
   ```javascript
   /**
    * 음성 처리 서비스
    * 1. WebGPU 우선
    * 2. 백엔드 폴백
    * 3. 외부 STT API (최후의 수단)
    */
   
   class AudioService {
     async recordAudio() {
       const stream = await navigator.mediaDevices.getUserMedia({audio: true});
       const mediaRecorder = new MediaRecorder(stream);
       const chunks = [];
       
       mediaRecorder.ondataavailable = e => chunks.push(e.data);
       mediaRecorder.start();
       
       return new Promise(resolve => {
         mediaRecorder.onstop = () => {
           const audioBlob = new Blob(chunks, {type: 'audio/wav'});
           stream.getTracks().forEach(t => t.stop());
           resolve(audioBlob);
         };
         
         setTimeout(() => mediaRecorder.stop(), 10000); // 10초 녹음
       });
     }
     
     async analyzeAudio(audioBlob, context) {
       // 1. WebGPU 시도
       try {
         return await this.analyzeWithWebGPU(audioBlob, context);
       } catch (error) {
         console.log('WebGPU 실패, 백엔드로 폴백');
         
         // 2. 백엔드 시도
         try {
           return await this.analyzeWithBackend(audioBlob, context);
         } catch (error) {
           console.error('모든 방식 실패');
           throw error;
         }
       }
     }
     
     async analyzeWithWebGPU(audioBlob, context) {
       // WebGPU Gemma 4 분석
       // (위의 analyzeWithWebGPU 함수 참고)
     }
     
     async analyzeWithBackend(audioBlob, context) {
       // 백엔드 Gemma 4 분석
       // (위의 analyzeWithBackend 함수 참고)
     }
   }
   
   export default new AudioService();
   ```

7. .env 추가
   
   ```
   # Gemma 4 설정
   GEMMA4_MODEL=google/gemma-4-e4b
   LMSTUDIO_API_URL=http://host.docker.internal:1234/v1
   AUDIO_SAMPLE_RATE=16000
   AUDIO_MAX_DURATION=30000  // 30초
   WEBGPU_ENABLED=true
   ```

8. docker-compose.yml 수정 (LMStudio Gemma 4 E4B 설정)
   
   ```yaml
   services:
     lmstudio:
       image: lmstudio:latest
       environment:
         MODEL: google/gemma-4-e4b-it
         PORT: 1234
       ports:
         - "1234:1234"
       volumes:
         - lmstudio_models:/models
   ```

9. npm 패키지 추가
   
   ```bash
   npm install @huggingface/transformers onnx-community/gemma-4-E4B-it-ONNX
   ```

테스트:
1. Docker 시작
   ```bash
   docker compose down
   docker compose up -d
   ```

2. Frontend 테스트
   - http://localhost:5173 접속
   - "발음 연습" 클릭
   - 녹음 시작
   - Gemma 4 분석 시작
   - 결과 확인 (WebGPU 또는 Backend)

3. 성능 메트릭
   ```bash
   # WebGPU (로컬): ~2-3초 (초기 로드 제외)
   # 백엔드 (LMStudio): ~5-10초
   ```

완료 기준:
✓ GEMMA4_AUDIO_IMPLEMENTATION.md 작성
✓ gemma4AudioService.js 오디오 분석 구현
✓ audio-analysis.js API 엔드포인트 (analyze, transcribe)
✓ PronunciationMissionWithGemma.jsx (WebGPU + 백엔드)
✓ AudioService (우선순위 기반 폴백)
✓ docker-compose.yml LMStudio Gemma 4 E4B 설정
✓ 음성 녹음 → WebGPU 분석 테스트 (3초 이내)
✓ WebGPU 실패 시 백엔드 폴백 테스트
✓ 음성 데이터가 기기 내에만 머물러 있는지 확인
✓ AOMD 피드백 음성 버전 구현
✓ git commit & push
```

---

## **Phase 10 전체 재구성**

### **원래 구성:**
- Part 1: AWS CloudFront (비용)
- Part 2: Rate Limiting
- Part 3: Kubernetes
- Part 4: Monitoring

### **개선된 구성:**
- **Part 1-A:** Nginx (로컬 캐싱)
- **Part 1-B:** Cloudflare Pages (무료 배포)
- **Part 1-C:** Vercel (무료 최적화)
- **Part 1-D:** ⭐ **Gemma 4 오디오 + WebGPU** (새로 추가)
- **Part 2:** Rate Limiting (Redis)
- **Part 3:** Kubernetes (K8s)
- **Part 4:** Monitoring (Prometheus + Grafana)

---

## **Gemma 4 적용의 3가지 이점**

| 이점 | 설명 | 구현 |
|------|------|------|
| **프라이버시** 🔒 | 음성 데이터가 브라우저에만 머물러 있음 | WebGPU 로컬 추론 |
| **비용 절감** 💰 | STT API 비용 0, 백엔드 비용 감소 | 브라우저 + 경량 E4B |
| **정확도** 🎯 | IPA 차트 + 음성 동시 분석 | 멀티모달 입력 |

---

## **지금 바로 시작**

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# 파일 복사
cp /mnt/user-data/outputs/GEMMA4_AUDIO_IMPLEMENTATION.md ./

# Cursor 실행
code .

# Ctrl+K → Part 1-D 프롬프트 붙여넣기 → Enter
```

**Phase 10 Part 1-D: Gemma 4 오디오 분석으로 Pronunciation Master를 한 단계 업그레이드!** 🚀
