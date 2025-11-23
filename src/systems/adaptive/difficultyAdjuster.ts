/**
 * 적응형 난이도 조절 시스템
 * ZPD(근접 발달 영역) 이론 기반
 */

import type { DifficultyLevel } from '../../types';

interface DifficultyAdjustmentParams {
  currentDifficulty: DifficultyLevel;
  totalAttempts: number;
  totalCorrect: number;
  recentAttempts: boolean[]; // 최근 시도 결과 (true = 정답, false = 오답)
}

interface DifficultyAdjustmentResult {
  newDifficulty: DifficultyLevel;
  reason: string;
}

/**
 * 적응형 난이도 조절 알고리즘
 *
 * 규칙:
 * 1. 정답률 80% 이상 (3번 이상 시도) -> 난이도 +1
 * 2. 정답률 50% 이하 (3번 이상 시도) -> 난이도 -1
 * 3. 최근 5문제 중 4개 이상 정답 -> 즉시 난이도 +1
 * 4. 최근 5문제 중 4개 이상 오답 -> 즉시 난이도 -1
 * 5. 난이도 범위: 1~5
 */
export function adjustDifficulty(
  params: DifficultyAdjustmentParams
): DifficultyAdjustmentResult {
  const { currentDifficulty, totalAttempts, totalCorrect, recentAttempts } = params;

  // 최소 시도 횟수 (3번) 이전에는 조정하지 않음
  if (totalAttempts < 3) {
    return {
      newDifficulty: currentDifficulty,
      reason: '데이터 수집 중 (최소 3문제 필요)',
    };
  }

  // 전체 정답률 계산
  const overallAccuracy = (totalCorrect / totalAttempts) * 100;

  // 최근 5문제 분석 (있는 경우)
  if (recentAttempts.length >= 5) {
    const recentCorrect = recentAttempts.slice(-5).filter((r) => r).length;

    // 최근 5문제 중 4개 이상 정답 -> 난이도 증가
    if (recentCorrect >= 4 && currentDifficulty < 5) {
      return {
        newDifficulty: (currentDifficulty + 1) as DifficultyLevel,
        reason: `최근 성취도가 높습니다 (${recentCorrect}/5 정답)`,
      };
    }

    // 최근 5문제 중 4개 이상 오답 -> 난이도 감소
    if (recentCorrect <= 1 && currentDifficulty > 1) {
      return {
        newDifficulty: (currentDifficulty - 1) as DifficultyLevel,
        reason: `현재 난이도가 높습니다 (${recentCorrect}/5 정답)`,
      };
    }
  }

  // 전체 정답률 기반 조정
  if (overallAccuracy >= 80 && totalAttempts >= 5) {
    // 정답률 80% 이상 -> 난이도 증가
    if (currentDifficulty < 5) {
      return {
        newDifficulty: (currentDifficulty + 1) as DifficultyLevel,
        reason: `정답률이 우수합니다 (${overallAccuracy.toFixed(0)}%)`,
      };
    }
  } else if (overallAccuracy <= 50 && totalAttempts >= 5) {
    // 정답률 50% 이하 -> 난이도 감소
    if (currentDifficulty > 1) {
      return {
        newDifficulty: (currentDifficulty - 1) as DifficultyLevel,
        reason: `복습이 필요합니다 (정답률 ${overallAccuracy.toFixed(0)}%)`,
      };
    }
  }

  // 조정 불필요
  return {
    newDifficulty: currentDifficulty,
    reason: `현재 난이도가 적절합니다 (정답률 ${overallAccuracy.toFixed(0)}%)`,
  };
}

/**
 * 추천 문제 난이도 계산
 * ZPD 이론: 혼자서는 어렵지만 도움이 있으면 풀 수 있는 수준
 */
export function getRecommendedProblemDifficulty(
  _currentPlayerLevel: number,
  currentDifficulty: DifficultyLevel,
  accuracy: number
): { min: DifficultyLevel; max: DifficultyLevel } {
  // 정답률에 따라 범위 조정
  if (accuracy >= 80) {
    // 높은 정답률 -> 현재~다음 난이도
    return {
      min: currentDifficulty,
      max: Math.min(5, currentDifficulty + 1) as DifficultyLevel,
    };
  } else if (accuracy <= 50) {
    // 낮은 정답률 -> 이전~현재 난이도
    return {
      min: Math.max(1, currentDifficulty - 1) as DifficultyLevel,
      max: currentDifficulty,
    };
  } else {
    // 중간 정답률 -> 이전~다음 난이도 (넓은 범위)
    return {
      min: Math.max(1, currentDifficulty - 1) as DifficultyLevel,
      max: Math.min(5, currentDifficulty + 1) as DifficultyLevel,
    };
  }
}
