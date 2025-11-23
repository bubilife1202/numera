/**
 * 누메라 메인 애플리케이션
 */

import { useEffect, useState, useRef } from 'react';
import GameCanvas from './components/game/GameCanvas';
import HUD from './components/ui/HUD';
import MathProblemUI from './components/ui/MathProblem';
import { useInteractionStore } from './stores/interactionStore';
import { useGameStore } from './stores/gameStore';
import { adjustDifficulty } from './systems/adaptive/difficultyAdjuster';
import type { MathProblem, MathTopic } from './types';
import './App.css';

function App() {
  const { currentProblem, showProblem, closeProblem } = useInteractionStore();
  const { addXP, addCurrency, recordProblemAttempt, updateDifficulty, player, progress } = useGameStore();
  const [problemBank, setProblemBank] = useState<Record<MathTopic, MathProblem[]>>({
    arithmetic: [],
    geometry: [],
    measurement: [],
    patterns: [],
    probability: [],
  });

  // 최근 시도 결과 추적 (최대 10개)
  const recentAttempts = useRef<boolean[]>([]);

  // 문제 은행 로드
  useEffect(() => {
    fetch('/data/questions.json')
      .then((res) => res.json())
      .then((data) => setProblemBank(data))
      .catch((err) => console.error('Failed to load questions:', err));
  }, []);

  // 상호작용 이벤트 리스닝
  useEffect(() => {
    const handleInteract = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { interactable } = customEvent.detail;

      if (interactable.id === 'npc_euler') {
        // NPC 오일러와 상호작용 - 랜덤 수학 문제 제시
        const randomProblem = getRandomProblem();
        if (randomProblem) {
          showProblem(randomProblem);
        }
      }
    };

    window.addEventListener('interact', handleInteract);
    return () => window.removeEventListener('interact', handleInteract);
  }, [problemBank, showProblem]);

  // 랜덤 문제 선택 (현재 난이도에 맞춰)
  const getRandomProblem = (): MathProblem | null => {
    const availableTopics: MathTopic[] = ['arithmetic', 'geometry', 'measurement'];
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    const topicProblems = problemBank[randomTopic];

    if (!topicProblems || topicProblems.length === 0) return null;

    // 현재 난이도에 맞는 문제 필터링 (±1 난이도 허용)
    const suitableProblems = topicProblems.filter(
      (p) =>
        p.difficulty >= progress.difficultyLevel - 1 &&
        p.difficulty <= progress.difficultyLevel + 1
    );

    if (suitableProblems.length === 0) {
      // 적절한 난이도가 없으면 전체에서 랜덤
      return topicProblems[Math.floor(Math.random() * topicProblems.length)];
    }

    return suitableProblems[Math.floor(Math.random() * suitableProblems.length)];
  };

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
      {/* 3D 게임 캔버스 */}
      <GameCanvas />

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
