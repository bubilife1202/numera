/**
 * 상호작용 상태 관리 스토어
 */

import { create } from 'zustand';
import type { MathProblem } from '../types';

interface InteractionStore {
  // 현재 상호작용 가능한 NPC/오브젝트
  nearbyInteractable: {
    id: string;
    type: 'npc' | 'object';
    name: string;
    position: { x: number; y: number; z: number };
  } | null;

  // 현재 표시 중인 수학 문제
  currentProblem: MathProblem | null;

  // 현재 활성화된 퀘스트 ID
  activeQuestId: string | null;

  // Actions
  setNearbyInteractable: (interactable: InteractionStore['nearbyInteractable']) => void;
  showProblem: (problem: MathProblem) => void;
  closeProblem: () => void;
  setActiveQuest: (questId: string | null) => void;
}

export const useInteractionStore = create<InteractionStore>((set) => ({
  nearbyInteractable: null,
  currentProblem: null,
  activeQuestId: null,

  setNearbyInteractable: (interactable) =>
    set({ nearbyInteractable: interactable }),

  showProblem: (problem) =>
    set({ currentProblem: problem }),

  closeProblem: () =>
    set({ currentProblem: null }),

  setActiveQuest: (questId) =>
    set({ activeQuestId: questId }),
}));
