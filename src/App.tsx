/**
 * 누메라 메인 애플리케이션
 */

import { useRef } from 'react';
import PhaserGame from './components/game/PhaserGame';
import HUD from './components/ui/HUD';
import MathProblemUI from './components/ui/MathProblem';
import { useInteractionStore } from './stores/interactionStore';
import { useGameStore } from './stores/gameStore';
import { adjustDifficulty } from './systems/adaptive/difficultyAdjuster';
import './App.css';

function App() {
  const { currentProblem, closeProblem } = useInteractionStore();
  const { addXP, addCurrency, recordProblemAttempt, updateDifficulty, player, progress } = useGameStore();

  // 최근 시도 결과 추적 (최대 10개)
  const recentAttempts = useRef<boolean[]>([]);


  // 문제 정답 시 보상
  const handleCorrectAnswer = () => {
    if (!currentProblem) return;

    // 난이도에 따른 XP 보상
    const xpReward = currentProblem.difficulty * 50;
    const currencyReward = currentProblem.difficulty * 10;

    addXP(xpReward);
    addCurrency(currencyReward);
    recordProblemAttempt(currentProblem.topic, true);

    // 최근 시도 추적
    recentAttempts.current.push(true);
    if (recentAttempts.current.length > 10) {
      recentAttempts.current.shift();
    }

    // 적응형 난이도 조절
    checkAndAdjustDifficulty();

    console.log(
      `정답! XP +${xpReward}, 뉴런 +${currencyReward} (문제 난이도: ${currentProblem.difficulty})`
    );
  };

  // 문제 오답 시
  const handleIncorrectAnswer = () => {
    if (!currentProblem) return;

    recordProblemAttempt(currentProblem.topic, false);

    // 최근 시도 추적
    recentAttempts.current.push(false);
    if (recentAttempts.current.length > 10) {
      recentAttempts.current.shift();
    }

    // 적응형 난이도 조절
    checkAndAdjustDifficulty();

    console.log('오답입니다. 다시 도전해보세요!');
  };

  // 적응형 난이도 체크 및 조정
  const checkAndAdjustDifficulty = () => {
    const result = adjustDifficulty({
      currentDifficulty: progress.difficultyLevel,
      totalAttempts: player.stats.totalProblemsAttempted,
      totalCorrect: player.stats.totalCorrect,
      recentAttempts: recentAttempts.current,
    });

    if (result.newDifficulty !== progress.difficultyLevel) {
      updateDifficulty(result.newDifficulty);
      console.log(`🎯 난이도 조정: ${progress.difficultyLevel} → ${result.newDifficulty}`);
      console.log(`   이유: ${result.reason}`);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {/* 2D Phaser 게임 캔버스 */}
      <PhaserGame />

      {/* 게임 HUD (체력, XP, 화폐 등) */}
      <HUD />

      {/* 수학 문제 UI */}
      {currentProblem && (
        <MathProblemUI
          problem={currentProblem}
          onCorrect={handleCorrectAnswer}
          onIncorrect={handleIncorrectAnswer}
          onClose={closeProblem}
        />
      )}
    </div>
  );
}

export default App;
