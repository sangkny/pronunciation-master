import React from 'react';
import { Crown, Check, X } from 'lucide-react';
import apiClient from '../services/apiClient.js';

const TIERS = [
  {
    id: 'Free',
    name: 'Free',
    price: '$0',
    period: '/월',
    features: ['일일 5회 연습', 'Advocate 피드백', '기본 진도 추적', '점수 7일 보관'],
    color: 'border-gray-400/40',
    buttonClass: 'bg-gray-600 cursor-default',
    buttonText: '현재 플랜',
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: '$9.99',
    period: '/월',
    features: ['무제한 연습', '4가지 AOMD 피드백', '상세 진도 추적', '주간 리포트', '무제한 점수 보관'],
    color: 'border-purple-400/60 ring-2 ring-purple-400/30',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    buttonText: 'Pro 업그레이드',
    popular: true,
  },
  {
    id: 'Enterprise',
    name: 'Enterprise',
    price: '$299',
    period: '/월',
    features: ['Pro 모든 기능', '팀 관리', 'API 접근', '고급 분석', '전담 지원'],
    color: 'border-yellow-400/40',
    buttonClass: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
    buttonText: 'Enterprise 문의',
  },
];

export default function SubscriptionModal({ isOpen, onClose, currentTier, onUpgrade }) {
  const [upgrading, setUpgrading] = React.useState(null);

  if (!isOpen) return null;

  const handleUpgrade = async (tierId) => {
    if (tierId === 'Free' || tierId === currentTier) return;
    setUpgrading(tierId);
    try {
      const result = await apiClient.post('/api/subscription/upgrade', { tier: tierId });
      if (result.success) {
        onUpgrade(result.tier);
        onClose();
      }
    } catch (error) {
      alert(`업그레이드 실패: ${error.message}`);
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            구독 플랜
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map(tier => (
            <div
              key={tier.id}
              className={`relative rounded-xl border p-5 space-y-4 ${tier.color} ${
                currentTier === tier.id ? 'bg-white/5' : 'bg-white/3'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-xs px-3 py-1 rounded-full font-semibold">
                  인기
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-gray-400 text-sm">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-2">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(tier.id)}
                disabled={tier.id === currentTier || tier.id === 'Free' || upgrading === tier.id}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 ${tier.buttonClass}`}
              >
                {upgrading === tier.id ? '처리 중...'
                  : currentTier === tier.id ? '현재 플랜'
                  : tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
