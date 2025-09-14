import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserStats } from './useUserStats';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  rarity: string;
}

export function useAchievements() {
  const { stats } = useUserStats();
  const { toast } = useToast();
  const [previousStats, setPreviousStats] = useState<any>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const checkAchievements = useCallback(() => {
    if (!stats || !previousStats) return;

    const achievements: Achievement[] = [
      // Study Streak Achievements
      {
        id: 'first_streak',
        title: 'First Steps',
        description: 'Complete your first study session',
        category: 'streak',
        requirement: 1,
        current: stats.study_streak || 0,
        unlocked: (stats.study_streak || 0) >= 1,
        rarity: 'common'
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 5-day study streak',
        category: 'streak',
        requirement: 5,
        current: stats.study_streak || 0,
        unlocked: (stats.study_streak || 0) >= 5,
        rarity: 'rare'
      },
      {
        id: 'two_week_champion',
        title: 'Two-Week Champion',
        description: 'Achieve a 15-day study streak',
        category: 'streak',
        requirement: 15,
        current: stats.study_streak || 0,
        unlocked: (stats.study_streak || 0) >= 15,
        rarity: 'epic'
      },
      {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day study streak',
        category: 'streak',
        requirement: 30,
        current: stats.study_streak || 0,
        unlocked: (stats.study_streak || 0) >= 30,
        rarity: 'legendary'
      },
      // Score-Based Achievements
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% on a quiz',
        category: 'score',
        requirement: 100,
        current: Math.round(stats.averageScore || 0),
        unlocked: (stats.averageScore || 0) >= 100,
        rarity: 'legendary'
      },
      {
        id: 'excellent_student',
        title: 'Excellent Student',
        description: 'Maintain 90% average score',
        category: 'score',
        requirement: 90,
        current: Math.round(stats.averageScore || 0),
        unlocked: (stats.averageScore || 0) >= 90,
        rarity: 'epic'
      },
      {
        id: 'good_student',
        title: 'Good Student',
        description: 'Maintain 80% average score',
        category: 'score',
        requirement: 80,
        current: Math.round(stats.averageScore || 0),
        unlocked: (stats.averageScore || 0) >= 80,
        rarity: 'rare'
      },
      {
        id: 'passing_grade',
        title: 'Passing Grade',
        description: 'Maintain 70% average score',
        category: 'score',
        requirement: 70,
        current: Math.round(stats.averageScore || 0),
        unlocked: (stats.averageScore || 0) >= 70,
        rarity: 'common'
      },
      // Study Volume Achievements
      {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Create your first 10 flashcards',
        category: 'study',
        requirement: 10,
        current: stats.total_flashcards || 0,
        unlocked: (stats.total_flashcards || 0) >= 10,
        rarity: 'common'
      },
      {
        id: 'knowledge_builder',
        title: 'Knowledge Builder',
        description: 'Create 50 flashcards',
        category: 'study',
        requirement: 50,
        current: stats.total_flashcards || 0,
        unlocked: (stats.total_flashcards || 0) >= 50,
        rarity: 'rare'
      }
    ];

    // Check for newly unlocked achievements
    const newlyUnlockedAchievements = achievements.filter(achievement => {
      const wasUnlocked = getPreviousAchievementStatus(achievement.id);
      const isNowUnlocked = achievement.unlocked;
      return !wasUnlocked && isNowUnlocked;
    });

    if (newlyUnlockedAchievements.length > 0) {
      setNewlyUnlocked(newlyUnlockedAchievements);
      
      // Show notifications for each newly unlocked achievement
      newlyUnlockedAchievements.forEach(achievement => {
        const rarityEmoji = {
          common: '🥉',
          rare: '🥈',
          epic: '🥇',
          legendary: '💎'
        }[achievement.rarity] || '🏆';

        toast({
          title: `${rarityEmoji} Achievement Unlocked!`,
          description: `${achievement.title}: ${achievement.description}`,
          duration: 5000,
        });
      });
    }
  }, [stats, previousStats, toast]);

  const getPreviousAchievementStatus = (achievementId: string): boolean => {
    if (!previousStats) return false;

    const previousAchievements: Achievement[] = [
      {
        id: 'first_streak',
        title: 'First Steps',
        description: 'Complete your first study session',
        category: 'streak',
        requirement: 1,
        current: previousStats.study_streak || 0,
        unlocked: (previousStats.study_streak || 0) >= 1,
        rarity: 'common'
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 5-day study streak',
        category: 'streak',
        requirement: 5,
        current: previousStats.study_streak || 0,
        unlocked: (previousStats.study_streak || 0) >= 5,
        rarity: 'rare'
      },
      {
        id: 'two_week_champion',
        title: 'Two-Week Champion',
        description: 'Achieve a 15-day study streak',
        category: 'streak',
        requirement: 15,
        current: previousStats.study_streak || 0,
        unlocked: (previousStats.study_streak || 0) >= 15,
        rarity: 'epic'
      },
      {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day study streak',
        category: 'streak',
        requirement: 30,
        current: previousStats.study_streak || 0,
        unlocked: (previousStats.study_streak || 0) >= 30,
        rarity: 'legendary'
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% on a quiz',
        category: 'score',
        requirement: 100,
        current: Math.round(previousStats.averageScore || 0),
        unlocked: (previousStats.averageScore || 0) >= 100,
        rarity: 'legendary'
      },
      {
        id: 'excellent_student',
        title: 'Excellent Student',
        description: 'Maintain 90% average score',
        category: 'score',
        requirement: 90,
        current: Math.round(previousStats.averageScore || 0),
        unlocked: (previousStats.averageScore || 0) >= 90,
        rarity: 'epic'
      },
      {
        id: 'good_student',
        title: 'Good Student',
        description: 'Maintain 80% average score',
        category: 'score',
        requirement: 80,
        current: Math.round(previousStats.averageScore || 0),
        unlocked: (previousStats.averageScore || 0) >= 80,
        rarity: 'rare'
      },
      {
        id: 'passing_grade',
        title: 'Passing Grade',
        description: 'Maintain 70% average score',
        category: 'score',
        requirement: 70,
        current: Math.round(previousStats.averageScore || 0),
        unlocked: (previousStats.averageScore || 0) >= 70,
        rarity: 'common'
      },
      {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Create your first 10 flashcards',
        category: 'study',
        requirement: 10,
        current: previousStats.total_flashcards || 0,
        unlocked: (previousStats.total_flashcards || 0) >= 10,
        rarity: 'common'
      },
      {
        id: 'knowledge_builder',
        title: 'Knowledge Builder',
        description: 'Create 50 flashcards',
        category: 'study',
        requirement: 50,
        current: previousStats.total_flashcards || 0,
        unlocked: (previousStats.total_flashcards || 0) >= 50,
        rarity: 'rare'
      }
    ];

    const achievement = previousAchievements.find(a => a.id === achievementId);
    return achievement ? achievement.unlocked : false;
  };

  // Update previous stats when current stats change
  useEffect(() => {
    if (stats) {
      setPreviousStats(stats);
    }
  }, [stats]);

  // Check for achievements when stats change
  useEffect(() => {
    if (stats && previousStats) {
      checkAchievements();
    }
  }, [stats, previousStats, checkAchievements]);

  return {
    newlyUnlocked,
    checkAchievements
  };
}
