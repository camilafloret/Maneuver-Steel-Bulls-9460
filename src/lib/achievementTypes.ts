// Achievement System Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  requirements: AchievementRequirement;
  stakesReward: number;
  hidden?: boolean; // Hidden until unlocked
}

export interface ScouterAchievement {
  scouterName: string;
  achievementId: string;
  unlockedAt: number;
  progress?: number; // For tracking progress toward achievement
}

export type AchievementCategory = 
  | 'accuracy' 
  | 'volume' 
  | 'streaks' 
  | 'special' 
  | 'social' 
  | 'time'
  | 'improvement';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

export interface AchievementRequirement {
  type: 'exact' | 'minimum' | 'percentage' | 'streak' | 'special' | 'custom';
  value: number;
  property?: keyof Scouter | 'custom';
  customCheck?: (scouter: Scouter) => boolean;
}

// Import scouter type
import type { Scouter } from './dexieDB';

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Volume Achievements
  {
    id: 'first_prediction',
    name: 'Novato do Scouting',
    description: 'Faça sua primeira previsão',
    icon: '🎯',
    category: 'volume',
    tier: 'bronze',
    requirements: { type: 'minimum', value: 1, property: 'totalPredictions' },
    stakesReward: 5
  },
  {
    id: 'predictions_10',
    name: 'Primeiros Passos',
    description: 'Faça 10 previsões',
    icon: '📊',
    category: 'volume',
    tier: 'bronze',
    requirements: { type: 'minimum', value: 10, property: 'totalPredictions' },
    stakesReward: 10
  },
  {
    id: 'predictions_50',
    name: 'Scout Ativo',
    description: 'Faça 50 previsões',
    icon: '📈',
    category: 'volume',
    tier: 'silver',
    requirements: { type: 'minimum', value: 50, property: 'totalPredictions' },
    stakesReward: 25
  },
  {
    id: 'predictions_100',
    name: 'Scout Dedicado',
    description: 'Faça 100 previsões',
    icon: '💪',
    category: 'volume',
    tier: 'gold',
    requirements: { type: 'minimum', value: 100, property: 'totalPredictions' },
    stakesReward: 50
  },
  {
    id: 'predictions_200',
    name: 'Veterano do Scouting',
    description: 'Faça 200 previsões',
    icon: '🏆',
    category: 'volume',
    tier: 'platinum',
    requirements: { type: 'minimum', value: 200, property: 'totalPredictions' },
    stakesReward: 100
  },
  {
    id: 'predictions_300',
    name: 'Lenda do Scouting',
    description: 'Faça 300 previsões',
    icon: '👑',
    category: 'volume',
    tier: 'legendary',
    requirements: { type: 'minimum', value: 300, property: 'totalPredictions' },
    stakesReward: 200
  },

  // Accuracy Achievements
  {
    id: 'accuracy_60',
    name: 'Olho Aguçado',
    description: 'Alcance 60% de precisão com pelo menos 10 previsões',
    icon: '🎯',
    category: 'accuracy',
    tier: 'bronze',
    requirements: { 
      type: 'custom', 
      value: 60,
      customCheck: (scouter) => scouter.totalPredictions >= 10 && (scouter.correctPredictions / scouter.totalPredictions * 100) >= 60
    },
    stakesReward: 20
  },
  {
    id: 'accuracy_70',
    name: 'Atirador de Elite',
    description: 'Alcance 70% de precisão com pelo menos 20 previsões',
    icon: '🏹',
    category: 'accuracy',
    tier: 'silver',
    requirements: { 
      type: 'custom', 
      value: 70,
      customCheck: (scouter) => scouter.totalPredictions >= 20 && (scouter.correctPredictions / scouter.totalPredictions * 100) >= 70
    },
    stakesReward: 40
  },
  {
    id: 'accuracy_80',
    name: 'Oráculo',
    description: 'Alcance 80% de precisão com pelo menos 30 previsões',
    icon: '🔮',
    category: 'accuracy',
    tier: 'gold',
    requirements: { 
      type: 'custom', 
      value: 80,
      customCheck: (scouter) => scouter.totalPredictions >= 30 && (scouter.correctPredictions / scouter.totalPredictions * 100) >= 80
    },
    stakesReward: 75
  },
  {
    id: 'accuracy_85',
    name: 'Profeta',
    description: 'Alcance 85% de precisão com pelo menos 50 previsões',
    icon: '✨',
    category: 'accuracy',
    tier: 'platinum',
    requirements: { 
      type: 'custom', 
      value: 85,
      customCheck: (scouter) => scouter.totalPredictions >= 50 && (scouter.correctPredictions / scouter.totalPredictions * 100) >= 85
    },
    stakesReward: 150
  },

  // Streak Achievements
  {
    id: 'streak_3',
    name: 'Sequência Quente',
    description: 'Acertar 3 previsões seguidas',
    icon: '🔥',
    category: 'streaks',
    tier: 'bronze',
    requirements: { type: 'minimum', value: 3, property: 'longestStreak' },
    stakesReward: 15
  },
  {
    id: 'streak_5',
    name: 'Em Chamas',
    description: 'Acertar 5 previsões seguidas',
    icon: '🔥🔥',
    category: 'streaks',
    tier: 'silver',
    requirements: { type: 'minimum', value: 5, property: 'longestStreak' },
    stakesReward: 30
  },
  {
    id: 'streak_10',
    name: 'Imparável',
    description: 'Acertar 10 previsões seguidas',
    icon: '🔥🔥🔥',
    category: 'streaks',
    tier: 'gold',
    requirements: { type: 'minimum', value: 10, property: 'longestStreak' },
    stakesReward: 60
  },
  {
    id: 'streak_20',
    name: 'Sequência Lendária',
    description: 'Acertar 20 previsões seguidas',
    icon: '⚡',
    category: 'streaks',
    tier: 'platinum',
    requirements: { type: 'minimum', value: 20, property: 'longestStreak' },
    stakesReward: 120
  },
  {
    id: 'streak_50',
    name: 'Divino',
    description: 'Acertar 50 previsões seguidas',
    icon: '👑⚡',
    category: 'streaks',
    tier: 'legendary',
    requirements: { type: 'minimum', value: 50, property: 'longestStreak' },
    stakesReward: 300
  },

  // Stakes from Predictions Achievements
  {
    id: 'stakes_100',
    name: 'Construtor de Stakes',
    description: 'Ganhar 100 stakes com previsões',
    icon: '💰',
    category: 'volume',
    tier: 'bronze',
    requirements: { type: 'minimum', value: 100, property: 'stakesFromPredictions' },
    stakesReward: 20
  },
  {
    id: 'stakes_300',
    name: 'Mestre dos Stakes',
    description: 'Ganhar 300 stakes com previsões',
    icon: '💎',
    category: 'volume',
    tier: 'silver',
    requirements: { type: 'minimum', value: 300, property: 'stakesFromPredictions' },
    stakesReward: 50
  },
  {
    id: 'stakes_600',
    name: 'Magnata dos Stakes',
    description: 'Ganhar 600 stakes com previsões',
    icon: '💍',
    category: 'volume',
    tier: 'gold',
    requirements: { type: 'minimum', value: 600, property: 'stakesFromPredictions' },
    stakesReward: 100
  },
  {
    id: 'stakes_1000',
    name: 'Imperador dos Stakes',
    description: 'Ganhar 1000 stakes com previsões',
    icon: '👑💎',
    category: 'volume',
    tier: 'platinum',
    requirements: { type: 'minimum', value: 1000, property: 'stakesFromPredictions' },
    stakesReward: 200
  },

  // Special Achievements
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Acertar 5 previsões consecutivas',
    icon: '💯',
    category: 'special',
    tier: 'gold',
    requirements: { 
      type: 'minimum',
      value: 5,
      property: 'longestStreak'
    },
    stakesReward: 100,
    hidden: true
  },
  {
    id: 'high_roller',
    name: 'Grande Apostador',
    description: 'Ganhar 1000 stakes no total (previsões + conquistas)',
    icon: '🎲',
    category: 'special',
    tier: 'platinum',
    requirements: { 
      type: 'minimum',
      value: 1000,
      property: 'stakesFromPredictions'
    },
    stakesReward: 200,
    hidden: true
  },
  {
    id: 'steady_hand',
    name: 'Mão Firme',
    description: 'Manter 75% de precisão com pelo menos 40 previsões',
    icon: '🎯',
    category: 'special',
    tier: 'silver',
    requirements: { 
      type: 'custom',
      value: 75,
      customCheck: (scouter) => scouter.totalPredictions >= 40 && (scouter.correctPredictions / scouter.totalPredictions * 100) >= 75
    },
    stakesReward: 75,
    hidden: true
  }
];

// Helper functions for achievement checking
export const checkAchievement = (achievement: Achievement, scouter: Scouter): boolean => {
  const { requirements } = achievement;
  
  switch (requirements.type) {
    case 'minimum':
      if (requirements.property && requirements.property in scouter) {
        return (scouter[requirements.property as keyof Scouter] as number) >= requirements.value;
      }
      return false;
      
    case 'exact':
      if (requirements.property && requirements.property in scouter) {
        return (scouter[requirements.property as keyof Scouter] as number) === requirements.value;
      }
      return false;
      
    case 'percentage':
      if (requirements.property && requirements.property in scouter) {
        const value = scouter[requirements.property as keyof Scouter] as number;
        const total = scouter.totalPredictions;
        return total > 0 && (value / total * 100) >= requirements.value;
      }
      return false;
      
    case 'custom':
      return requirements.customCheck ? requirements.customCheck(scouter) : false;
      
    case 'special':
      // Special achievements need custom logic in the achievement system
      return false;
      
    default:
      return false;
  }
};

export const getAchievementProgress = (achievement: Achievement, scouter: Scouter): number => {
  const { requirements } = achievement;
  
  switch (requirements.type) {
    case 'minimum':
    case 'exact':
      if (requirements.property && requirements.property in scouter) {
        const current = scouter[requirements.property as keyof Scouter] as number;
        return Math.min(100, (current / requirements.value) * 100);
      }
      return 0;
      
    case 'percentage':
      if (requirements.property && requirements.property in scouter) {
        const value = scouter[requirements.property as keyof Scouter] as number;
        const total = scouter.totalPredictions;
        if (total === 0) return 0;
        const currentPercentage = (value / total) * 100;
        return Math.min(100, (currentPercentage / requirements.value) * 100);
      }
      return 0;
      
    case 'custom':
      // Custom achievements can define their own progress calculation
      if (checkAchievement(achievement, scouter)) return 100;
      // For custom achievements, we'll need specific progress logic
      return 0;
      
    default:
      return 0;
  }
};

// Achievement tier styling
export const ACHIEVEMENT_TIERS = {
  bronze: {
    color: '#CD7F32',
    bgColor: 'bg-amber-100 dark:bg-amber-950',
    borderColor: 'border-amber-300 dark:border-amber-700',
    textColor: 'text-amber-800 dark:text-amber-200'
  },
  silver: {
    color: '#C0C0C0',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-800 dark:text-gray-200'
  },
  gold: {
    color: '#FFD700',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  },
  platinum: {
    color: '#E5E4E2',
    bgColor: 'bg-blue-100 dark:bg-blue-950',
    borderColor: 'border-blue-300 dark:border-blue-700',
    textColor: 'text-blue-800 dark:text-blue-200'
  },
  legendary: {
    color: '#9932CC',
    bgColor: 'bg-purple-100 dark:bg-purple-950',
    borderColor: 'border-purple-300 dark:border-purple-700',
    textColor: 'text-purple-800 dark:text-purple-200'
  }
} as const;

// Get achievements grouped by category
export const getAchievementsByCategory = (): { [key: string]: Achievement[] } => {
  const categories: { [key: string]: Achievement[] } = {};
  
  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    if (!categories[achievement.category]) {
      categories[achievement.category] = [];
    }
    categories[achievement.category].push(achievement);
  }

  return categories;
};
