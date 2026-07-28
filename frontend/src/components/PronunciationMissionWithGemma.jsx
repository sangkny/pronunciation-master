import React, { useState, useRef, useCallback } from 'react';
import { Mic, Volume2, Cpu, Cloud } from 'lucide-react';
import audioService, { isWebGPUEnabled } from '../services/audioService.js';

/**
 * 발음 미션 (Gemma 4 오디오 분석)
 * 1. WebGPU 브라우저 추론 (선호) → 프라이버시 + 빠름
 * 2. 백엔드 폴백 (네트워크 불안정) → 안정성
 */
export default function PronunciationMissionWithGemma({
  word = 'equipment',
  correctPronunciation = 'ih-KWIP-muhnt',
  userLevel = 'beginner',
  ipaChart = null,
  onAnalysisComplete,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [useWebGPU, setUseWebGPU] = useState(isWebGPUEnabled());
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const canvasRef = useRef(null);

  const analyzeWithGemma = useCallback(async (audioBlob) => {
    setIsAnalyzing(true);
    setError('');

    const context = {
      word,
      correctPronunciation,
      userLevel,
      ipaChart,
    };

    const canvas = canvasRef.current || document.createElement('canvas');
    if (!canvasRef.current) {
      canvas.width = 400;
      canvas.height = 100;
    }

    try {
      const result = await audioService.analyzeAudio(
        audioBlob,
        context,
        canvas,
        useWebGPU
      );
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err.message);
      if (useWebGPU) {
        setUseWebGPU(false);
        try {
          const fallback = await audioService.analyzeWithBackend(audioBlob, context);
          setAnalysis(fallback);
          onAnalysisComplete?.(fallback);
        } catch (fallbackErr) {
          setError(fallbackErr.message);
        }
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [word, correctPronunciation, userLevel, ipaChart, useWebGPU, onAnalysisComplete]);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        await analyzeWithGemma(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('마이크 접근 실패: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeakFeedback = () => {
    if (analysis?.result) {
      audioService.speakAnalysis(analysis.result);
    }
  };

  return (
    <div className="pronunciation-mission-gemma bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-400/30 rounded-xl p-5 space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Gemma 4 오디오 분석
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-purple-600/30 text-purple-200">
          {useWebGPU ? 'WebGPU 우선' : 'Backend 폴백'}
        </span>
      </div>

      <div className="text-sm space-y-1">
        <p id="word" className="font-semibold text-white">{word}</p>
        <p id="ipa" className="text-purple-300">{correctPronunciation}</p>
      </div>

      <div className="recording-section">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          } disabled:opacity-50`}
        >
          <Mic className="w-5 h-5" />
          {isRecording ? '녹음 중지' : 'Gemma 4 녹음 시작'}
        </button>
        {recordedAudio && !isAnalyzing && (
          <p className="text-green-300 text-sm mt-2 text-center">✅ 녹음 완료</p>
        )}
      </div>

      {isAnalyzing && (
        <div className="analyzing text-center py-3">
          <p className="text-purple-200 animate-pulse">
            🤖 {useWebGPU ? 'WebGPU' : '백엔드'}에서 Gemma 4로 분석 중...
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full animate-pulse w-2/3" />
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {analysis && !isAnalyzing && (
        <div className="analysis-result bg-black/30 rounded-lg p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-purple-300">
              {analysis.privacy === 'local-only' ? (
                <><Cpu className="w-4 h-4" /> {analysis.method}</>
              ) : (
                <><Cloud className="w-4 h-4" /> {analysis.method}</>
              )}
            </span>
            <span className="text-xs text-gray-400">
              {analysis.privacy === 'local-only' ? '🔒 기기 내 처리' : '☁️ 서버 처리'}
            </span>
          </div>
          <div className="aomd-feedback text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
            {analysis.result}
          </div>
          <button
            type="button"
            onClick={handleSpeakFeedback}
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200"
          >
            <Volume2 className="w-4 h-4" />
            AOMD 피드백 음성으로 듣기
          </button>
        </div>
      )}

      <canvas ref={canvasRef} width={400} height={100} className="hidden" aria-hidden="true" />
    </div>
  );
}
