/**
 * 수학 문제 풀이 UI 컴포넌트
 */

import { useState } from 'react';
import { X, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import type { MathProblem } from '../../types';

interface MathProblemProps {
  problem: MathProblem;
  onCorrect: () => void;
  onIncorrect: () => void;
  onClose: () => void;
}

export default function MathProblemUI({
  problem,
  onCorrect,
  onIncorrect,
  onClose,
}: MathProblemProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userAnswer = parseFloat(answer);
    const correctAnswer =
      typeof problem.answer === 'number' ? problem.answer : parseFloat(problem.answer);

    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01; // 소수점 오차 허용

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        onCorrect();
        onClose();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setAttempts(attempts + 1);

      // 3번 틀리면 힌트 자동 표시
      if (attempts >= 2 && !showHint) {
        setShowHint(true);
      }

      setTimeout(() => {
        setFeedback(null);
        onIncorrect();
      }, 1500);
    }
  };

  const handleNextHint = () => {
    if (hintIndex < problem.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hud-element">
      <div className="bg-surface rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-2 border-primary/30 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        {/* 난이도 표시 */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < problem.difficulty ? 'bg-warning' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* 문제 */}
        <h2 className="text-2xl font-bold text-white mb-6">{problem.question}</h2>

        {/* 답안 입력 폼 */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="number"
              step="any"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 px-4 py-3 bg-background text-white rounded-lg border border-primary/30 focus:border-primary focus:outline-none text-lg"
              placeholder="답을 입력하세요"
              autoFocus
              disabled={feedback !== null}
            />
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!answer || feedback !== null}
            >
              확인
            </button>
          </div>
        </form>

        {/* 피드백 */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-3 p-4 bg-success/20 border border-success rounded-lg mb-4">
            <CheckCircle className="text-success" size={24} />
            <div>
              <p className="text-success font-bold">정답입니다!</p>
              <p className="text-sm text-gray-300">훌륭해요! 경험치를 획득했습니다.</p>
            </div>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="flex items-center gap-3 p-4 bg-error/20 border border-error rounded-lg mb-4">
            <XCircle className="text-error" size={24} />
            <div>
              <p className="text-error font-bold">틀렸습니다</p>
              <p className="text-sm text-gray-300">다시 한 번 생각해보세요!</p>
            </div>
          </div>
        )}

        {/* 힌트 */}
        <div className="mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-warning hover:text-warning/80 transition-colors"
          >
            <Lightbulb size={20} />
            <span>{showHint ? '힌트 숨기기' : '힌트 보기'}</span>
          </button>

          {showHint && problem.hints.length > 0 && (
            <div className="mt-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-gray-300 mb-3">{problem.hints[hintIndex]}</p>
              {hintIndex < problem.hints.length - 1 && (
                <button
                  onClick={handleNextHint}
                  className="text-sm text-warning hover:underline"
                >
                  다음 힌트 →
                </button>
              )}
            </div>
          )}
        </div>

        {/* 시도 횟수 */}
        <div className="text-sm text-gray-400">
          시도: {attempts}회
          {attempts >= 3 && <span className="text-warning ml-2">조금만 더 힘내세요!</span>}
        </div>
      </div>
    </div>
  );
}
