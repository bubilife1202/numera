/**
 * 게임 상태 및 데이터 타입 정의
 */

// 플레이어 관련 타입
export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  currency: number;
  position: Vector3D;
  inventory: Item[];
  stats: PlayerStats;
}

export interface PlayerStats {
  totalProblemsAttempted: number;
  totalCorrect: number;
  accuracyByTopic: Record<MathTopic, number>;
  playTime: number; // seconds
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// 수학 관련 타입
export type MathTopic =
  | 'arithmetic'   // 수와 연산
  | 'geometry'     // 도형
  | 'measurement'  // 측정
  | 'patterns'     // 규칙성
  | 'probability'; // 자료와 가능성

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface MathProblem {
  id: string;
  topic: MathTopic;
  difficulty: DifficultyLevel;
  question: string;
  answer: string | number;
  hints: string[];
  visualData?: any; // Three.js 시각화 데이터
}

// 아이템 관련 타입
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  icon: string;
}

export type ItemType =
  | 'tool'
  | 'consumable'
  | 'cosmetic'
  | 'knowledge_fragment';

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary';

// 퀘스트 관련 타입
export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  requiredLevel: number;
  region: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'solve_problem' | 'explore' | 'build' | 'defeat';
  target: number;
  current: number;
}

export interface QuestReward {
  xp: number;
  currency: number;
  items: Item[];
}

// 진행도 관련 타입
export interface GameProgress {
  currentQuest: string | null;
  completedQuests: string[];
  unlockedRegions: string[];
  difficultyLevel: DifficultyLevel;
}

// 설정 관련 타입
export interface GameSettings {
  soundVolume: number; // 0-100
  musicVolume: number; // 0-100
  graphicsQuality: GraphicsQuality;
  colorBlindMode: boolean;
  textSize: TextSize;
}

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type TextSize = 'small' | 'medium' | 'large';

// 전체 게임 상태
export interface GameState {
  player: Player;
  progress: GameProgress;
  settings: GameSettings;
  lastSaved: number; // timestamp
}

// NPC 관련 타입
export interface NPC {
  id: string;
  name: string;
  role: 'tutor' | 'merchant' | 'quest_giver' | 'companion';
  position: Vector3D;
  dialogues: Dialogue[];
}

export interface Dialogue {
  id: string;
  text: string;
  options?: DialogueOption[];
}

export interface DialogueOption {
  text: string;
  nextDialogueId: string;
  action?: () => void;
}
