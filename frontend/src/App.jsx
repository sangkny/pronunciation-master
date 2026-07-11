import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Volume2, CheckCircle, SkipForward, Home, Settings, BarChart3, 
  AlertCircle, Repeat2, Zap, BookOpen, Target, Edit2, Sparkles,
  Play, Pause, Download, Upload, X, ArrowLeft, ChevronRight,
  Lock, Unlock, GraduationCap, ListOrdered
} from 'lucide-react';
import apiClient from './services/apiClient.js';

const DIFFICULTY_OPTIONS = [
  { id: 'beginner', label: 'Beginner', labelKo: '초급', desc: '기초 개념부터 차근차근', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', labelKo: '중급', desc: '실무 수준의 개념 학습', emoji: '📈' },
  { id: 'advanced', label: 'Advanced', labelKo: '고급', desc: '전문가 수준의 심화 학습', emoji: '🎯' },
];

const CATEGORIES = [
  { id: 'medical', name: '의료기기 (Medical Devices)', emoji: '🏥', shortName: 'Medical' },
  { id: 'telecom', name: '통신기술 (Telecommunications)', emoji: '📡', shortName: 'Telecom' },
  { id: 'finance', name: '금융 (Finance)', emoji: '💰', shortName: 'Finance' },
  { id: 'tech', name: '기술 (Technology)', emoji: '💻', shortName: 'Technology' },
  { id: 'automotive', name: '자동차 (Automotive)', emoji: '🚗', shortName: 'Automotive' },
];

const CATEGORY_STYLES = {
  medical: {
    card: 'bg-gradient-to-br from-blue-600/25 to-blue-900/15 border-blue-400/40 hover:border-blue-400/70 hover:shadow-blue-500/25',
    panel: 'border-blue-400/30',
    overlay: 'group-hover:from-blue-500/15 group-hover:to-blue-600/10',
    title: 'group-hover:text-blue-300',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 border-blue-400/40 text-blue-200',
    button: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
    quickStart: 'hover:bg-blue-500/20 hover:text-blue-200',
    ring: 'ring-blue-400/50',
  },
  telecom: {
    card: 'bg-gradient-to-br from-orange-600/25 to-orange-900/15 border-orange-400/40 hover:border-orange-400/70 hover:shadow-orange-500/25',
    panel: 'border-orange-400/30',
    overlay: 'group-hover:from-orange-500/15 group-hover:to-orange-600/10',
    title: 'group-hover:text-orange-300',
    accent: 'text-orange-400',
    badge: 'bg-orange-500/20 border-orange-400/40 text-orange-200',
    button: 'from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
    quickStart: 'hover:bg-orange-500/20 hover:text-orange-200',
    ring: 'ring-orange-400/50',
  },
  finance: {
    card: 'bg-gradient-to-br from-green-600/25 to-green-900/15 border-green-400/40 hover:border-green-400/70 hover:shadow-green-500/25',
    panel: 'border-green-400/30',
    overlay: 'group-hover:from-green-500/15 group-hover:to-green-600/10',
    title: 'group-hover:text-green-300',
    accent: 'text-green-400',
    badge: 'bg-green-500/20 border-green-400/40 text-green-200',
    button: 'from-green-600 to-green-700 hover:from-green-500 hover:to-green-600',
    quickStart: 'hover:bg-green-500/20 hover:text-green-200',
    ring: 'ring-green-400/50',
  },
  tech: {
    card: 'bg-gradient-to-br from-purple-600/25 to-purple-900/15 border-purple-400/40 hover:border-purple-400/70 hover:shadow-purple-500/25',
    panel: 'border-purple-400/30',
    overlay: 'group-hover:from-purple-500/15 group-hover:to-purple-600/10',
    title: 'group-hover:text-purple-300',
    accent: 'text-purple-400',
    badge: 'bg-purple-500/20 border-purple-400/40 text-purple-200',
    button: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
    quickStart: 'hover:bg-purple-500/20 hover:text-purple-200',
    ring: 'ring-purple-400/50',
  },
  automotive: {
    card: 'bg-gradient-to-br from-red-600/25 to-red-900/15 border-red-400/40 hover:border-red-400/70 hover:shadow-red-500/25',
    panel: 'border-red-400/30',
    overlay: 'group-hover:from-red-500/15 group-hover:to-red-600/10',
    title: 'group-hover:text-red-300',
    accent: 'text-red-400',
    badge: 'bg-red-500/20 border-red-400/40 text-red-200',
    button: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
    quickStart: 'hover:bg-red-500/20 hover:text-red-200',
    ring: 'ring-red-400/50',
  },
};

const SAMPLE_MISSIONS = {
  medical: [
    { id: 1, sentence: "This advanced imaging system provides real-time diagnostic capabilities.", focusPoints: ['imaging', 'diagnostic', 'capabilities'], difficulty: 'medium' },
    { id: 2, sentence: "The patient monitoring device transmits vital signs continuously.", focusPoints: ['monitoring', 'transmits', 'vital'], difficulty: 'medium' },
  ],
  telecom: [
    { id: 1, sentence: "The 5G network infrastructure enables faster data transmission.", focusPoints: ['infrastructure', 'enables', 'transmission'], difficulty: 'medium' },
  ],
  finance: [
    { id: 1, sentence: "Portfolio diversification is essential for risk management.", focusPoints: ['diversification', 'essential', 'management'], difficulty: 'hard' },
  ],
  tech: [
    { id: 1, sentence: "Cloud computing revolutionized our infrastructure architecture.", focusPoints: ['computing', 'revolutionized', 'architecture'], difficulty: 'hard' },
  ],
  automotive: [
    { id: 1, sentence: "Advanced safety systems minimize collision risks.", focusPoints: ['advanced', 'minimize', 'collision'], difficulty: 'medium' },
  ],
};

export default function EnhancedPronunciationMasterApp() {
  // ==================== 상태 관리 ====================
  const [appState, setAppState] = useState('home'); // home, difficulty-select, learning-path, concept-detail, scenario-input, mission, stats
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userLevel, setUserLevel] = useState('beginner');
  const [learningPath, setLearningPath] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [conceptDetail, setConceptDetail] = useState(null);
  const [completedConcepts, setCompletedConcepts] = useState([]);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [userScenario, setUserScenario] = useState('');
  const [generatedMissions, setGeneratedMissions] = useState([]);
  const [scenarioMessages, setScenarioMessages] = useState([]);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  
  // 음성 관련 상태
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, processing, complete
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [userTranscript, setUserTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isPlayingAI, setIsPlayingAI] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  
  // 미션 진행 상태
  const [missionProgress, setMissionProgress] = useState({
    attempts: 0,
    maxAttempts: 5,
    focusPointsCompleted: [],
    status: 'in-progress',
  });
  
  const [completedMissions, setCompletedMissions] = useState([]);
  const [skippedMissions, setSkippedMissions] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    completedToday: 0,
    totalTime: 0,
    accuracyScore: 0,
  });
  
  // TTS & 음성 재생
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ==================== TTS 함수 ====================
  
  /**
   * 텍스트를 음성으로 변환 및 재생
   */
  const speakText = async (text, language = 'en-US', rate = 1.0) => {
    if (!ttsEnabled) return;

    try {
      setIsPlayingAI(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate; // 0.5-2.0
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsPlayingAI(false);
      };

      utterance.onerror = (event) => {
        console.error('TTS 오류:', event.error);
        setIsPlayingAI(false);
      };

      window.speechSynthesis.cancel(); // 이전 재생 취소
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS 실패:', error);
      setIsPlayingAI(false);
    }
  };

  /**
   * 녹음된 사용자 음성 재생
   */
  const playUserRecording = () => {
    if (recordedAudio) {
      setIsPlayingUser(true);
      const url = URL.createObjectURL(recordedAudio);
      const audio = new Audio(url);
      
      audio.onended = () => {
        setIsPlayingUser(false);
      };
      
      audio.play().catch(err => {
        console.error('재생 실패:', err);
        setIsPlayingUser(false);
      });
    }
  };

  /**
   * TTS 속도 제어
   */
  const speakTextWithSpeed = (text, speed = 'normal') => {
    const rateMap = {
      slow: 0.7,
      normal: 1.0,
      fast: 1.3
    };
    speakText(text, 'en-US', rateMap[speed] || 1.0);
  };

  // ==================== 상황 기반 콘텐츠 생성 ====================

  /**
   * 사용자 상황에 맞는 미션 생성 (AI)
   */
  const generateScenarioBasedMissions = async () => {
    if (!userScenario.trim()) {
      alert('상황을 입력해주세요.');
      return;
    }

    setIsGeneratingScenario(true);
    setScenarioMessages(prev => [...prev, {
      type: 'user',
      text: userScenario
    }]);

    try {
      // 1단계: 상황 분석 및 미션 생성 요청
      const analysisMessage = {
        type: 'assistant',
        text: '상황을 분석하고 있습니다...'
      };
      setScenarioMessages(prev => [...prev, analysisMessage]);

      // API 호출 (백엔드에서 구현)
      const response = await fetch('http://localhost:5000/api/mission/generate-by-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: userScenario,
          category: selectedCategory,
          count: 5
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 생성된 미션 저장
      setGeneratedMissions(data.missions || []);
      
      // 응답 메시지 업데이트
      setScenarioMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          type: 'assistant',
          text: `✅ "${userScenario}"에 관련된 ${data.missions.length}개의 연습을 생성했습니다!\n\n생성된 콘텐츠:\n${data.missions.map((m, i) => `${i + 1}. ${m.sentence}`).join('\n')}`
        };
        return updated;
      });

      // 첫 번째 미션 자동 로드
      if (data.missions.length > 0) {
        loadGeneratedMission(data.missions[0]);
      }

      setUserScenario('');
    } catch (error) {
      console.error('미션 생성 실패:', error);
      setScenarioMessages(prev => [...prev, {
        type: 'error',
        text: `❌ 오류: ${error.message}`
      }]);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  /**
   * 생성된 미션 로드
   */
  const loadGeneratedMission = (mission) => {
    setCurrentMission(mission);
    setMissionProgress({
      attempts: 0,
      maxAttempts: 5,
      focusPointsCompleted: [],
      status: 'in-progress',
    });
    setRecordedAudio(null);
    setUserTranscript('');
    setFeedback(null);
    setAppState('mission');
  };

  // ==================== 음성 녹음 ====================

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        simulateAIPronunciationCheck();
      };

      mediaRecorder.start();
      setRecordingState('recording');
    } catch (error) {
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

  // ==================== AI 발음 분석 ====================

  const simulateAIPronunciationCheck = () => {
    setTimeout(() => {
      const focusWords = currentMission.focusPoints;
      const completedPoints = focusWords.slice(0, Math.floor(Math.random() * 3) + 1);
      const remainingPoints = focusWords.filter(w => !completedPoints.includes(w));
      const newProgress = missionProgress.attempts + 1;
      const isCompleted = newProgress >= 2 || completedPoints.length === focusWords.length;

      setFeedback({
        overallScore: Math.floor(Math.random() * 40) + 60,
        completedPoints,
        remainingPoints,
        suggestions: [
          `"${remainingPoints[0]}" 발음을 더 명확하게`,
          '단어 간의 연음이 자연스럽습니다',
          '문장의 강세를 조금 더 명확히',
        ],
        isPerfect: isCompleted,
      });

      setMissionProgress(prev => ({
        ...prev,
        attempts: newProgress,
        focusPointsCompleted: completedPoints,
        status: isCompleted ? 'completed' : 'in-progress',
      }));

      setRecordingState('complete');
    }, 2000);
  };

  // ==================== 미션 완료 및 스킵 ====================

  const completeMission = () => {
    const missionData = {
      categoryId: selectedCategory,
      sentence: currentMission.sentence,
      completedAt: new Date().toISOString(),
      attempts: missionProgress.attempts,
      score: feedback?.overallScore || 0,
      focusAreas: missionProgress.focusPointsCompleted,
      isGeneratedFromScenario: currentMission.isGenerated || false,
    };

    setCompletedMissions([...completedMissions, missionData]);
    if (currentMission?.id && !completedConcepts.includes(currentMission.id)) {
      setCompletedConcepts(prev => [...prev, currentMission.id]);
    }
    setDailyStats(prev => ({
      ...prev,
      completedToday: prev.completedToday + 1,
      totalTime: prev.totalTime + (missionProgress.attempts * 2),
      accuracyScore: Math.floor((prev.accuracyScore + (feedback?.overallScore || 0)) / 2),
    }));

    // 다음 미션 로드
    if (generatedMissions.length > 0) {
      const currentIndex = generatedMissions.findIndex(m => m.id === currentMission.id);
      if (currentIndex < generatedMissions.length - 1) {
        loadGeneratedMission(generatedMissions[currentIndex + 1]);
      } else {
        setAppState('home');
      }
    } else {
      setAppState('home');
    }
  };

  const skipMission = () => {
    const missionData = {
      categoryId: selectedCategory,
      sentence: currentMission.sentence,
      skippedAt: new Date().toISOString(),
      attempts: missionProgress.attempts,
      focusAreas: currentMission.focusPoints,
      isGeneratedFromScenario: currentMission.isGenerated || false,
    };

    setSkippedMissions([...skippedMissions, missionData]);
    
    // 다음 미션으로
    if (generatedMissions.length > 0) {
      const currentIndex = generatedMissions.findIndex(m => m.id === currentMission.id);
      if (currentIndex < generatedMissions.length - 1) {
        loadGeneratedMission(generatedMissions[currentIndex + 1]);
      } else {
        setAppState('home');
      }
    } else {
      setAppState('home');
    }
  };

  // ==================== UI 렌더링 ====================

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory);
  const selectedStyle = selectedCategory ? CATEGORY_STYLES[selectedCategory] : null;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setAppState('difficulty-select');
  };

  const handleDifficultySelect = async (level) => {
    setUserLevel(level);
    setIsLoadingPath(true);
    try {
      const data = await apiClient.getLearningPath(selectedCategory, level);
      setLearningPath(data);
      setAppState('learning-path');
    } catch (error) {
      console.error('학습 경로 로드 실패:', error);
      alert('학습 경로를 불러올 수 없습니다. 서버를 확인해주세요.');
    } finally {
      setIsLoadingPath(false);
    }
  };

  const handleConceptSelect = async (conceptId) => {
    try {
      const data = await apiClient.getConcept(conceptId);
      setSelectedConcept(conceptId);
      setConceptDetail(data.concept);
      setAppState('concept-detail');
    } catch (error) {
      console.error('개념 로드 실패:', error);
      alert('개념 정보를 불러올 수 없습니다.');
    }
  };

  const startConceptMission = () => {
    if (!conceptDetail?.vocabulary?.length) return;
    const vocab = conceptDetail.vocabulary[0];
    const mission = {
      id: conceptDetail.id,
      sentence: vocab.examples?.[0] || `Practice the word: ${vocab.word}`,
      focusPoints: conceptDetail.vocabulary.slice(0, 3).map(v => v.word),
      difficulty: conceptDetail.difficulty,
      isGenerated: true,
      conceptName: conceptDetail.name,
    };
    loadGeneratedMission(mission);
  };

  const handleBackToCategories = () => {
    setAppState('home');
    setLearningPath(null);
    setConceptDetail(null);
  };

  const handleBackToDifficulty = () => {
    setAppState('difficulty-select');
    setLearningPath(null);
  };

  const handleBackToLearningPath = () => {
    setAppState('learning-path');
    setConceptDetail(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-['Segoe UI']">
      {/* 상단 바 */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setAppState('home')}
            className="flex items-center gap-2 hover:text-purple-400 transition-colors"
          >
            <Zap className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Pronunciation Master</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Volume2 className="w-4 h-4" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ttsEnabled}
                  onChange={(e) => setTtsEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">TTS</span>
              </label>
            </div>
            <button
              onClick={() => setAppState('stats')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ==================== HOME 화면 ==================== */}
        {appState === 'home' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 px-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                오늘의 발음 수련
              </h1>
              <p className="text-gray-300 text-base sm:text-lg">분야를 선택하거나 상황을 입력해서 맞춤 연습을 시작하세요</p>
            </div>

            {/* 분야 선택 */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">분야 선택</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map(category => {
                  const style = CATEGORY_STYLES[category.id];
                  return (
                  <div key={category.id} className="space-y-2">
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full group relative overflow-hidden rounded-xl p-5 sm:p-6 border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] ${style.card}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent transition-all duration-300 ${style.overlay}`} />
                      <div className="relative z-10 flex flex-col items-start text-left">
                        <div className="text-3xl sm:text-4xl mb-3">{category.emoji}</div>
                        <h3 className={`text-base sm:text-lg font-bold transition-colors ${style.title}`}>
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                          상황 기반 맞춤 연습
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                      </div>
                    </button>

                    {/* 빠른 시작 버튼 */}
                    <button
                      onClick={() => {
                        setSelectedCategory(category.id);
                        const mission = SAMPLE_MISSIONS[category.id]?.[0];
                        if (mission) {
                          loadGeneratedMission(mission);
                        }
                      }}
                      className={`w-full py-2 bg-white/10 rounded-lg text-sm transition-colors ${style.quickStart}`}
                    >
                      빠른 시작
                    </button>
                  </div>
                );
                })}
              </div>
            </div>

            {/* 통계 요약 */}
            {(completedMissions.length > 0 || skippedMissions.length > 0) && (
              <div className="grid grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{completedMissions.length}</div>
                  <p className="text-sm text-gray-400 mt-2">완료한 미션</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{skippedMissions.length}</div>
                  <p className="text-sm text-gray-400 mt-2">스킵한 미션</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{dailyStats.accuracyScore}%</div>
                  <p className="text-sm text-gray-400 mt-2">평균 정확도</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 난이도 선택 화면 ==================== */}
        {appState === 'difficulty-select' && selectedCategoryData && selectedStyle && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${selectedStyle.badge}`}>
              <span className="text-lg">{selectedCategoryData.emoji}</span>
              <span>{selectedCategoryData.name}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <GraduationCap className={`w-6 h-6 ${selectedStyle.accent}`} />
                난이도 선택
              </h2>
              <p className="text-gray-400 text-sm">수준에 맞는 학습 경로가 자동으로 생성됩니다</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleDifficultySelect(opt.id)}
                  disabled={isLoadingPath}
                  className={`p-5 rounded-xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 ${selectedStyle.card}`}
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold">{opt.labelKo}</h3>
                  <p className="text-xs text-gray-400 mt-1">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-2">{opt.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setAppState('scenario-input'); }}
              className={`w-full py-2 text-sm rounded-lg transition-colors ${selectedStyle.quickStart}`}
            >
              또는 상황 직접 입력하기 →
            </button>

            <button onClick={handleBackToCategories} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 이전 (분야 선택)
            </button>
          </div>
        )}

        {/* ==================== 학습 경로 화면 ==================== */}
        {appState === 'learning-path' && learningPath && selectedStyle && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <ListOrdered className={`w-6 h-6 ${selectedStyle.accent}`} />
                  학습 경로
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {learningPath.domainName} · {userLevel} · {learningPath.totalConcepts}개 개념
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {learningPath.path.map((item, idx) => {
                const isCompleted = completedConcepts.includes(item.conceptId);
                const isLocked = item.status === 'locked';
                const isAvailable = item.status === 'available' && !isCompleted;

                return (
                  <button
                    key={item.conceptId}
                    onClick={() => !isLocked && handleConceptSelect(item.conceptId)}
                    disabled={isLocked}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                      isCompleted ? 'bg-green-500/10 border-green-400/40' :
                      isAvailable ? `${selectedStyle.panel} hover:bg-white/10 cursor-pointer` :
                      'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted ? 'bg-green-500/30 text-green-300' :
                      isAvailable ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                       isLocked ? <Lock className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.difficulty} · {item.vocabularyCount}개 어휘
                        {isCompleted && ' · ✅ 완료'}
                        {isLocked && ' · 🔒 선행 개념 필요'}
                      </p>
                    </div>
                    {isAvailable && <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button onClick={handleBackToDifficulty} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 이전 (난이도 선택)
            </button>
          </div>
        )}

        {/* ==================== 개념 상세 화면 ==================== */}
        {appState === 'concept-detail' && conceptDetail && selectedStyle && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${selectedStyle.badge}`}>
              {conceptDetail.difficulty}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{conceptDetail.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{conceptDetail.domainName}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className={`w-5 h-5 ${selectedStyle.accent}`} />
                핵심 어휘 ({conceptDetail.vocabulary?.length || 0})
              </h3>
              {conceptDetail.vocabulary?.map((vocab, idx) => (
                <div key={idx} className={`p-4 rounded-xl border bg-white/5 ${selectedStyle.panel}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-lg">{vocab.word}</span>
                      <span className="text-sm text-gray-400 ml-2">{vocab.pronunciation}</span>
                    </div>
                    <button
                      onClick={() => speakText(vocab.word)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"
                      title="발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">{vocab.definition}</p>
                  {vocab.examples?.map((ex, i) => (
                    <p key={i} className="text-xs text-gray-400 mt-1 pl-2 border-l-2 border-white/20">
                      {ex}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <button
              onClick={startConceptMission}
              className={`w-full py-3 bg-gradient-to-r rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${selectedStyle.button}`}
            >
              <Target className="w-5 h-5" />
              이 개념으로 발음 연습 시작
            </button>

            <button onClick={handleBackToLearningPath} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> 학습 경로로 돌아가기
            </button>
          </div>
        )}

        {/* ==================== 상황 입력 화면 ==================== */}
        {appState === 'scenario-input' && selectedCategoryData && selectedStyle && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 선택된 분야 표시 */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${selectedStyle.badge}`}>
              <span className="text-lg">{selectedCategoryData.emoji}</span>
              <span>{selectedCategoryData.name}</span>
            </div>

            <div className={`bg-gradient-to-br from-white/10 to-white/5 border rounded-xl p-6 sm:p-8 space-y-6 ${selectedStyle.panel}`}>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Sparkles className={`w-6 h-6 ${selectedStyle.accent}`} />
                  상황 기반 연습 만들기
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  당신이 경험하고 싶은 상황을 설명하면, AI가 맞춤형 연습을 생성합니다.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    상황 입력 (예: "의사와의 첫 진료 상담")
                  </label>
                  <textarea
                    value={userScenario}
                    onChange={(e) => setUserScenario(e.target.value)}
                    placeholder="예: 기술 컨퍼런스에서 제품을 영어로 소개하는 상황&#10;예: 해외 은행과의 금융 계약 협상&#10;예: 자동차 판매원과의 상담..."
                    rows={5}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none text-white placeholder-gray-500 transition-colors focus:ring-2 ${selectedStyle.ring}`}
                  />
                </div>

                <button
                  onClick={generateScenarioBasedMissions}
                  disabled={isGeneratingScenario || !userScenario.trim()}
                  className={`w-full py-3 bg-gradient-to-r disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${selectedStyle.button}`}
                >
                  <Sparkles className="w-5 h-5" />
                  {isGeneratingScenario ? '생성 중...' : '맞춤 연습 생성'}
                </button>
              </div>

              {/* 상황 기반 대화 */}
              {scenarioMessages.length > 0 && (
                <div className="space-y-3 bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {scenarioMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`text-sm whitespace-pre-wrap ${
                        msg.type === 'user'
                          ? 'text-right text-purple-300'
                          : msg.type === 'error'
                          ? 'text-red-300'
                          : 'text-green-300'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}

              {/* 생성된 미션 미리보기 */}
              {generatedMissions.length > 0 && (
                <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="font-semibold text-purple-300">생성된 연습</h3>
                  <div className="space-y-2">
                    {generatedMissions.map((mission, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadGeneratedMission(mission)}
                        className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors line-clamp-2"
                      >
                        {idx + 1}. {mission.sentence}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleBackToDifficulty}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 (난이도 선택)
            </button>
          </div>
        )}

        {/* ==================== MISSION 화면 ==================== */}
        {appState === 'mission' && currentMission && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 진행도 */}
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
                  style={{
                    width: `${(missionProgress.attempts / missionProgress.maxAttempts) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* 원문 문장 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-purple-400/30 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">읽어야 할 문장</h2>
              <p className="text-2xl font-semibold text-purple-200 leading-relaxed">
                {currentMission.sentence}
              </p>

              {/* 음성 제어 버튼 */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => speakText(currentMission.sentence, 'en-US', 1.0)}
                  disabled={isPlayingAI}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  {isPlayingAI ? '재생 중...' : '정상 속도'}
                </button>

                <button
                  onClick={() => speakTextWithSpeed(currentMission.sentence, 'slow')}
                  disabled={isPlayingAI}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  느리게
                </button>

                <button
                  onClick={() => speakTextWithSpeed(currentMission.sentence, 'fast')}
                  disabled={isPlayingAI}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  빠르게
                </button>
              </div>

              {/* 포커스 영역 */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-300">집중할 단어들:</p>
                <div className="flex flex-wrap gap-2">
                  {currentMission.focusPoints.map((point, idx) => (
                    <button
                      key={idx}
                      onClick={() => speakText(point)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        missionProgress.focusPointsCompleted.includes(point)
                          ? 'bg-green-500/30 border border-green-500/50 text-green-200 hover:bg-green-500/40'
                          : 'bg-orange-500/20 border border-orange-500/30 text-orange-200 hover:bg-orange-500/30'
                      }`}
                      title="클릭해서 발음 듣기"
                    >
                      {point}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 음성 녹음 섹션 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-purple-400/30 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold">당신의 발음 녹음</h2>

              {!recordedAudio ? (
                <button
                  onClick={recordingState === 'recording' ? stopRecording : startRecording}
                  disabled={recordingState === 'processing'}
                  className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                    recordingState === 'recording'
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : recordingState === 'processing'
                      ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  {recordingState === 'recording'
                    ? '녹음 중지'
                    : recordingState === 'processing'
                    ? 'AI가 분석 중...'
                    : '음성 녹음 시작'}
                </button>
              ) : (
                <button
                  onClick={playUserRecording}
                  disabled={isPlayingUser}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {isPlayingUser ? (
                    <>
                      <Pause className="w-4 h-4" />
                      재생 중...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      녹음된 음성 재생
                    </>
                  )}
                </button>
              )}

              {/* AI 피드백 */}
              {feedback && (
                <div className="space-y-4 bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">발음 정확도</span>
                    <span className="text-2xl font-bold text-green-400">{feedback.overallScore}%</span>
                  </div>

                  {feedback.completedPoints.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-300">✅ 잘한 부분:</p>
                      <div className="space-y-1">
                        {feedback.completedPoints.map((point, idx) => (
                          <p key={idx} className="text-sm text-green-200 ml-2">• {point}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.remainingPoints.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-orange-300">⚠️ 개선할 부분:</p>
                      {feedback.suggestions.map((suggestion, idx) => (
                        <p key={idx} className="text-sm text-orange-200 ml-2">• {suggestion}</p>
                      ))}
                    </div>
                  )}

                  {feedback.isPerfect && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded p-3">
                      <p className="text-green-200 font-semibold">🎉 완벽합니다! 다음 미션으로 진행하세요.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              {missionProgress.status === 'completed' ? (
                <button
                  onClick={completeMission}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  완료 후 다음 미션
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setRecordedAudio(null);
                      setFeedback(null);
                    }}
                    disabled={!recordedAudio || recordingState !== 'idle'}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Repeat2 className="w-4 h-4" />
                    다시 시도
                  </button>

                  <button
                    onClick={skipMission}
                    className="flex-1 py-3 bg-orange-600/50 hover:bg-orange-600/70 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <SkipForward className="w-4 h-4" />
                    스킵
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ==================== STATS 화면 ==================== */}
        {appState === 'stats' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              학습 통계
            </h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400">{completedMissions.length}</div>
                <p className="text-sm text-gray-400 mt-2">완료한 미션</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-400">{skippedMissions.length}</div>
                <p className="text-sm text-gray-400 mt-2">스킵한 미션</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400">{dailyStats.accuracyScore}%</div>
                <p className="text-sm text-gray-400 mt-2">평균 정확도</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">{dailyStats.totalTime}</div>
                <p className="text-sm text-gray-400 mt-2">총 학습 시간 (분)</p>
              </div>
            </div>

            <button
              onClick={() => setAppState('home')}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
