import React, { useState, useRef } from 'react';
import { Mic, Volume2, Play, Pause, Repeat2, CheckCircle, SkipForward } from 'lucide-react';
import apiClient from '../services/apiClient.js';
import aomdService from '../services/aomdService.js';
import sttService from '../services/sttService.js';
import AOMDFeedbackPanel from './AOMDFeedbackPanel.jsx';

export default function PronunciationMission({
  mission,
  conceptDetail,
  selectedCategory,
  userLevel,
  userTier = 'Free',
  onComplete,
  onSkip,
  onUpgrade,
  speakText,
  speakTextWithSpeed,
  t = (key) => key,
}) {
  const [recordingState, setRecordingState] = useState('idle');
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sttNote, setSttNote] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [aomdFeedback, setAomdFeedback] = useState(null);
  const [isLoadingAomd, setIsLoadingAomd] = useState(false);
  const [missionProgress, setMissionProgress] = useState({
    attempts: 0,
    maxAttempts: 5,
    focusPointsCompleted: [],
    status: 'in-progress',
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const sttPromiseRef = useRef(null);

  const playUserRecording = () => {
    if (recordedAudio) {
      setIsPlayingUser(true);
      const url = URL.createObjectURL(recordedAudio);
      const audio = new Audio(url);
      audio.onended = () => setIsPlayingUser(false);
      audio.play().catch(() => setIsPlayingUser(false));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setTranscript('');
      setSttNote('');

      if (sttService.isSupported()) {
        sttPromiseRef.current = sttService.recognizeSpeech({ lang: 'en-US' });
      } else {
        sttPromiseRef.current = null;
        setSttNote(t('sttFallback'));
      }

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        await analyzePronunciation();
      };

      mediaRecorder.start();
      setRecordingState('recording');
    } catch {
      alert('마이크 접근이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecordingState('processing');
    }
  };

  const analyzePronunciation = async () => {
    const focusWord = mission.focusPoints[0] || 'word';
    const vocab = conceptDetail?.vocabulary?.find(v => v.word === focusWord)
      || conceptDetail?.vocabulary?.[0];
    const correctPronunciation = vocab?.pronunciation || focusWord;

    let userPronunciation = focusWord;
    if (sttPromiseRef.current) {
      try {
        const sttResult = await sttPromiseRef.current;
        userPronunciation = sttResult.transcript || focusWord;
        setTranscript(userPronunciation);
      } catch {
        setSttNote(t('sttFallback'));
        userPronunciation = focusWord;
      }
    }

    try {
      const scoreResult = await apiClient.calculateScore({
        userPronunciation,
        correctPronunciation,
        userLevel,
        difficulty: mission.difficulty || userLevel,
      });

      const totalScore = scoreResult.totalScore || 50;
      const newProgress = missionProgress.attempts + 1;
      const isCompleted = newProgress >= 2 || totalScore >= 70;

      setFeedback({
        overallScore: totalScore,
        completedPoints: mission.focusPoints.slice(0, Math.ceil(totalScore / 40)),
        remainingPoints: mission.focusPoints.filter((_, i) => i >= Math.ceil(totalScore / 40)),
        suggestions: [`${t('recognizedText')}: "${userPronunciation}"`, `Score: ${totalScore}/100`],
        isPerfect: isCompleted,
      });

      setMissionProgress(prev => ({
        ...prev,
        attempts: newProgress,
        focusPointsCompleted: mission.focusPoints.slice(0, Math.ceil(totalScore / 40)),
        status: isCompleted ? 'completed' : 'in-progress',
      }));

      setIsLoadingAomd(true);
      const aomdData = await aomdService.fetchAOMDFeedback({
        userPronunciation,
        correctPronunciation,
        word: focusWord,
        score: totalScore,
        context: selectedCategory,
      });
      setAomdFeedback(aomdData);
    } catch (error) {
      console.error('분석 실패:', error);
      setFeedback({
        overallScore: 50,
        completedPoints: [],
        remainingPoints: mission.focusPoints,
        suggestions: [error.message],
        isPerfect: false,
      });
    } finally {
      setIsLoadingAomd(false);
      setRecordingState('complete');
      sttPromiseRef.current = null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-purple-300">
            시도: {missionProgress.attempts} / {missionProgress.maxAttempts}
          </span>
          <span className="text-sm text-gray-400">
            {missionProgress.status === 'completed' ? '✅ 완료!' : '진행 중'}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(missionProgress.attempts / missionProgress.maxAttempts) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 border border-purple-400/30 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold">읽어야 할 문장</h2>
        <p className="text-2xl font-semibold text-purple-200 leading-relaxed">{mission.sentence}</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => speakText(mission.sentence)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            <Volume2 className="w-4 h-4" /> TTS
          </button>
          <button onClick={() => speakTextWithSpeed(mission.sentence, 'slow')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            <Volume2 className="w-4 h-4" /> Slow
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {mission.focusPoints.map((point, idx) => (
            <button key={idx} onClick={() => speakText(point)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                missionProgress.focusPointsCompleted.includes(point)
                  ? 'bg-green-500/30 border border-green-500/50 text-green-200'
                  : 'bg-orange-500/20 border border-orange-500/30 text-orange-200'
              }`}>{point}</button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/10 to-white/5 border border-purple-400/30 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-bold">당신의 발음 녹음</h2>

        {!recordedAudio ? (
          <button
            onClick={recordingState === 'recording' ? stopRecording : startRecording}
            disabled={recordingState === 'processing'}
            className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 ${
              recordingState === 'recording' ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : recordingState === 'processing' ? 'bg-gray-600 opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            <Mic className="w-5 h-5" />
            {recordingState === 'recording' ? '녹음 중지'
              : recordingState === 'processing' ? 'AI가 분석 중...'
              : '음성 녹음 시작'}
          </button>
        ) : (
          <button onClick={playUserRecording} disabled={isPlayingUser}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2">
            {isPlayingUser ? <><Pause className="w-4 h-4" /> 재생 중...</> : <><Play className="w-4 h-4" /> 녹음 재생</>}
          </button>
        )}

        {transcript && (
          <p className="text-sm text-purple-200 bg-black/20 rounded-lg px-3 py-2">
            {t('recognizedText')}: <strong>"{transcript}"</strong>
          </p>
        )}
        {sttNote && <p className="text-xs text-gray-500">{sttNote}</p>}

        {feedback && (
          <div className="bg-black/30 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">발음 정확도</span>
              <span className="text-2xl font-bold text-green-400">{feedback.overallScore}%</span>
            </div>
            {feedback.isPerfect && <p className="text-green-200 font-semibold">🎉 목표 점수 달성!</p>}
          </div>
        )}

        {isLoadingAomd && <div className="text-center text-purple-300 animate-pulse py-4">AOMD 피드백 생성 중...</div>}

        {aomdFeedback && !isLoadingAomd && (
          <AOMDFeedbackPanel
            advocate={aomdFeedback.advocate}
            opposite={aomdFeedback.opposite}
            meditator={aomdFeedback.meditator}
            decisioner={aomdFeedback.decisioner}
            tier={userTier}
            word={mission.focusPoints[0]}
            score={feedback?.overallScore || 0}
            onUpgrade={onUpgrade}
          />
        )}
      </div>

      <div className="flex gap-3">
        {missionProgress.status === 'completed' ? (
          <button onClick={() => onComplete(feedback)}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> 완료 후 다음
          </button>
        ) : (
          <>
            <button onClick={() => { setRecordedAudio(null); setFeedback(null); setAomdFeedback(null); setTranscript(''); setRecordingState('idle'); }}
              disabled={!recordedAudio}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Repeat2 className="w-4 h-4" /> 다시 시도
            </button>
            <button onClick={onSkip}
              className="flex-1 py-3 bg-orange-600/50 hover:bg-orange-600/70 rounded-lg font-semibold flex items-center justify-center gap-2">
              <SkipForward className="w-4 h-4" /> 스킵
            </button>
          </>
        )}
      </div>
    </div>
  );
}
