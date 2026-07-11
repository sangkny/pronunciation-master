import React from 'react';
import { ThumbsUp, AlertCircle, Scale, Target, Lock, Crown } from 'lucide-react';

const ROLES = [
  {
    key: 'advocate',
    label: 'Advocate',
    labelKo: '긍정 피드백',
    icon: ThumbsUp,
    colorClass: 'border-advocate/50 bg-advocate/10',
    textClass: 'text-advocate',
    iconBg: 'bg-advocate/20',
    delay: '0ms',
  },
  {
    key: 'opposite',
    label: 'Opposite',
    labelKo: '비판 피드백',
    icon: AlertCircle,
    colorClass: 'border-opposite/50 bg-opposite/10',
    textClass: 'text-opposite',
    iconBg: 'bg-opposite/20',
    delay: '150ms',
  },
  {
    key: 'meditator',
    label: 'Meditator',
    labelKo: '균형 조언',
    icon: Scale,
    colorClass: 'border-meditator/50 bg-meditator/10',
    textClass: 'text-meditator',
    iconBg: 'bg-meditator/20',
    delay: '300ms',
  },
  {
    key: 'decisioner',
    label: 'Decisioner',
    labelKo: '행동 계획',
    icon: Target,
    colorClass: 'border-decisioner/50 bg-decisioner/10',
    textClass: 'text-decisioner',
    iconBg: 'bg-decisioner/20',
    delay: '450ms',
  },
];

export default function AOMDFeedbackPanel({
  advocate,
  opposite,
  meditator,
  decisioner,
  tier = 'Free',
  word,
  score,
  onUpgrade,
}) {
  const feedbackMap = { advocate, opposite, meditator, decisioner };
  const isPro = tier === 'Pro' || tier === 'Enterprise';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          AOMD 피드백 — <span className="text-purple-300">{word}</span>
        </h3>
        <span className="text-2xl font-bold text-green-400">{score}%</span>
      </div>

      {!isPro && (
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 rounded-lg px-3 py-2">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span>Free 티어: Advocate만 표시. <button onClick={onUpgrade} className="text-purple-400 hover:underline">Pro 업그레이드</button>로 4가지 피드백을 모두 확인하세요.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map(role => {
          const content = feedbackMap[role.key];
          const isLocked = !isPro && role.key !== 'advocate';
          const Icon = role.icon;

          return (
            <div
              key={role.key}
              className={`rounded-xl border p-4 transition-all duration-500 animate-fade-in ${
                isLocked
                  ? 'border-white/10 bg-white/5 opacity-40'
                  : role.colorClass
              }`}
              style={{ animationDelay: isLocked ? '0ms' : role.delay }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isLocked ? 'bg-white/10' : role.iconBg}`}>
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Icon className={`w-4 h-4 ${role.textClass}`} />
                  )}
                </div>
                <div>
                  <span className={`text-sm font-bold ${isLocked ? 'text-gray-500' : role.textClass}`}>
                    {role.label}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{role.labelKo}</span>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isLocked ? 'text-gray-600' : 'text-gray-200'}`}>
                {isLocked
                  ? 'Pro 업그레이드 필요'
                  : content || '피드백 없음'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
