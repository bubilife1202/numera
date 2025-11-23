/**
 * 게임 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Player, GameProgress, GameSettings, DifficultyLevel } from '../types';

interface GameStore extends GameState {
  // Actions
  updatePlayer: (updates: Partial<Player>) => void;
  addXP: (amount: number) => void;
  addCurrency: (amount: number) => void;
  spendCurrency: (amount: number) => boolean;
  completeQuest: (questId: string) => void;
  unlockRegion: (regionId: string) => void;
  updateDifficulty: (level: DifficultyLevel) => void;
  updateSettings: (updates: Partial<GameSettings>) => void;
  resetGame: () => void;
}

const initialPlayer: Player = {
  id: crypto.randomUUID(),
  name: '로직 키퍼',
  level: 1,
  xp: 0,
  currency: 0,
  position: { x: 0, y: 0, z: 0 },
  inventory: [],
  stats: {
    totalProblemsAttempted: 0,
    totalCorrect: 0,
    accuracyByTopic: {
      arithmetic: 0,
      geometry: 0,
      measurement: 0,
      patterns: 0,
      probability: 0,
    },
    playTime: 0,
  },
};

const initialProgress: GameProgress = {
  currentQuest: null,
  completedQuests: [],
  unlockedRegions: ['tutorial'],
  difficultyLevel: 1,
};

const initialSettings: GameSettings = {
  soundVolume: 70,
  musicVolume: 50,
  graphicsQuality: 'medium',
  colorBlindMode: false,
  textSize: 'medium',
};

const initialState: GameState = {
  player: initialPlayer,
  progress: initialProgress,
  settings: initialSettings,
  lastSaved: Date.now(),
};

// XP to Level 계산 함수
const calculateLevel = (xp: number): number => {
  // 레벨 공식: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updatePlayer: (updates) =>
        set((state) => ({
          player: { ...state.player, ...updates },
          lastSaved: Date.now(),
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.player.xp + amount;
          const newLevel = calculateLevel(newXP);
          return {
            player: {
              ...state.player,
              xp: newXP,
              level: newLevel,
            },
            lastSaved: Date.now(),
          };
        }),

      addCurrency: (amount) =>
        set((state) => ({
          player: {
            ...state.player,
            currency: state.player.currency + amount,
          },
          lastSaved: Date.now(),
        })),

      spendCurrency: (amount) => {
        const { player } = get();
        if (player.currency >= amount) {
          set((state) => ({
            player: {
              ...state.player,
              currency: state.player.currency - amount,
            },
            lastSaved: Date.now(),
          }));
          return true;
        }
        return false;
      },

      completeQuest: (questId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedQuests: [...state.progress.completedQuests, questId],
            currentQuest: null,
          },
          lastSaved: Date.now(),
        })),

      unlockRegion: (regionId) =>
        set((state) => {
          if (!state.progress.unlockedRegions.includes(regionId)) {
            return {
              progress: {
                ...state.progress,
                unlockedRegions: [...state.progress.unlockedRegions, regionId],
              },
              lastSaved: Date.now(),
            };
          }
          return state;
        }),

      updateDifficulty: (level) =>
        set((state) => ({
          progress: {
            ...state.progress,
            difficultyLevel: level,
          },
          lastSaved: Date.now(),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
          lastSaved: Date.now(),
        })),

      resetGame: () =>
        set({
          ...initialState,
          player: { ...initialPlayer, id: crypto.randomUUID() },
          lastSaved: Date.now(),
        }),
    }),
    {
      name: 'numera-game-storage', // LocalStorage 키
      version: 1,
    }
  )
);
