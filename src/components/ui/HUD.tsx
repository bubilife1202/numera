/**
 * HUD (Heads-Up Display) 컴포넌트
 * 플레이어의 체력, XP, 화폐, 레벨 등을 표시
 */

import { useGameStore } from '../../stores/gameStore';
import { Coins, Star, TrendingUp } from 'lucide-react';

export default function HUD() {
  const { player, progress } = useGameStore();

  // XP 진행률 계산 (현재 레벨 기준)
  const currentLevelXP = (player.level - 1) ** 2 * 100;
  const nextLevelXP = player.level ** 2 * 100;
  const xpProgress = ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  // 정확도 계산
  const accuracy = player.stats.totalProblemsAttempted > 0
    ? Math.round((player.stats.totalCorrect / player.stats.totalProblemsAttempted) * 100)
    : 0;

  return (
    <div className="hud-container">
      {/* 상단 좌측: 플레이어 정보 */}
      <div className="absolute top-4 left-4 hud-element">
        <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-primary/30">
          {/* 플레이어 이름 & 레벨 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              {player.level}
            </div>
            <div>
              <h2 className="game-title text-lg text-white">{player.name}</h2>
              <p className="text-xs text-gray-400">로직 키퍼</p>
            </div>
          </div>

          {/* XP 바 */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>경험치</span>
              <span>{player.xp} / {nextLevelXP}</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="stat-bar h-full transition-all duration-500"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* 화폐 */}
          <div className="flex items-center gap-2 text-warning">
            <Coins size={16} />
            <span className="font-semibold">{player.currency.toLocaleString()}</span>
            <span className="text-xs text-gray-400">뉴런</span>
          </div>
        </div>
      </div>

      {/* 상단 우측: 통계 */}
      <div className="absolute top-4 right-4 hud-element">
        <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-secondary/30 min-w-[200px]">
          {/* 정확도 */}
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-success" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>정확도</span>
                <span>{accuracy}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* 문제 풀이 수 */}
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-gray-300">
              {player.stats.totalCorrect} / {player.stats.totalProblemsAttempted}
            </span>
            <span className="text-xs text-gray-400">문제 풀이</span>
          </div>
        </div>
      </div>

      {/* 하단 중앙: 조작 가이드 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hud-element">
        <div className="bg-surface/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-primary/20">
          <div className="flex gap-6 text-sm text-gray-300">
            <div>
              <span className="text-primary font-semibold">WASD</span> 이동
            </div>
            <div>
              <span className="text-primary font-semibold">E</span> 상호작용
            </div>
            <div>
              <span className="text-primary font-semibold">ESC</span> 메뉴
            </div>
          </div>
        </div>
      </div>

      {/* 현재 난이도 */}
      <div className="absolute bottom-4 right-4 hud-element">
        <div className="bg-surface/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-warning/30">
          <div className="text-xs text-gray-400">난이도</div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-4 rounded ${
                  level <= progress.difficultyLevel
                    ? 'bg-warning'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 게임 타이틀 (처음 로드 시) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <h1 className="game-title text-6xl text-white mb-2 drop-shadow-lg">
          누메라
        </h1>
        <p className="text-gray-400 text-lg">잃어버린 논리의 세계</p>
      </div>
    </div>
  );
}
