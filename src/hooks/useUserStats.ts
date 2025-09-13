import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserStats {
  id: string;
  user_id: string;
  total_flashcards: number;
  studied_today: number;
  average_score: number;
  study_streak: number;
  last_streak_date: string | null;
  daily_goal: number;
  created_at: string;
  updated_at: string;
}

export interface StudyStats {
  totalFlashcards: number;
  studiedToday: number;
  averageScore: number;
  streakDays: number;
  dailyGoal: number;
  progressPercentage: number;
}

const DEFAULT_STATS: StudyStats = {
  totalFlashcards: 0,
  studiedToday: 0,
  averageScore: 0,
  streakDays: 0,
  dailyGoal: 10,
  progressPercentage: 0,
};

export function useUserStats() {
  const [stats, setStats] = useState<StudyStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        setLoading(false);
        return;
      }
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setStats(DEFAULT_STATS);
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (existingStats) {
        const progressPercentage = (existingStats as any).daily_goal > 0 
          ? Math.min(((existingStats as any).studied_today / (existingStats as any).daily_goal) * 100, 100)
          : 0;

        setStats({
          totalFlashcards: (existingStats as any).total_flashcards,
          studiedToday: (existingStats as any).studied_today,
          averageScore: Math.round((existingStats as any).average_score),
          streakDays: (existingStats as any).study_streak,
          dailyGoal: (existingStats as any).daily_goal,
          progressPercentage,
        });
      } else {
        const { data: newStats, error: initError } = await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            total_flashcards: 0,
            studied_today: 0,
            average_score: 0.0,
            study_streak: 0,
            daily_goal: 10,
          } as any)
          .select()
          .single();

        if (initError) throw initError;

        setStats(DEFAULT_STATS);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast({
        title: "Error",
        description: "Failed to load your stats. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateTotalFlashcards = useCallback(async (increment: number = 1) => {
    if (!user) return;

    try {
      setStats(prev => ({
        ...prev,
        totalFlashcards: prev.totalFlashcards + increment,
      }));

      const { error: rpcError } = await supabase.rpc('increment_total_flashcards', {
        user_uuid: user.id,
        increment_amount: increment
      } as any);

      if (rpcError) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ 
            total_flashcards: stats.totalFlashcards + increment,
            updated_at: new Date().toISOString()
          } as any)
          .eq('user_id', user.id);

        if (updateError) {
          setStats(prev => ({
            ...prev,
            totalFlashcards: prev.totalFlashcards - increment,
          }));
          throw updateError;
        }
      }
    } catch (error) {
      console.error('Error updating total flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to update flashcard count.",
        variant: "destructive",
      });
    }
  }, [user, toast, stats.totalFlashcards]);

  const updateTotalFlashcardsToCount = useCallback(async (newCount: number) => {
    if (!user) return;

    try {
      setStats(prev => ({
        ...prev,
        totalFlashcards: newCount,
      }));

      const { error } = await supabase
        .from('user_stats')
        .update({ 
          total_flashcards: newCount,
          updated_at: new Date().toISOString()
        } as any)
        .eq('user_id', user.id);

      if (error) {
        setStats(prev => ({
          ...prev,
          totalFlashcards: stats.totalFlashcards,
        }));
        throw error;
      }
    } catch (error) {
      console.error('Error updating total flashcards count:', error);
      toast({
        title: "Error",
        description: "Failed to update flashcard count.",
        variant: "destructive",
      });
    }
  }, [user, toast, stats.totalFlashcards]);

  const syncTotalFlashcards = useCallback(async () => {
    if (!user) return;

    try {
      const { count: actualCount, error: countError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;

      await updateTotalFlashcardsToCount(actualCount || 0);
    } catch (error) {
      console.error('Error syncing flashcard count:', error);
    }
  }, [user, updateTotalFlashcardsToCount]);

  const updateStudiedToday = useCallback(async (increment: number = 1) => {
    if (!user) return;

    try {
      setStats(prev => {
        const newStudiedToday = prev.studiedToday + increment;
        const progressPercentage = prev.dailyGoal > 0 
          ? Math.min((newStudiedToday / prev.dailyGoal) * 100, 100)
          : 0;
        
        return {
          ...prev,
          studiedToday: newStudiedToday,
          progressPercentage,
        };
      });

      const { error: rpcError } = await supabase.rpc('increment_studied_today', {
        user_uuid: user.id,
        increment_amount: increment
      } as any);

      if (rpcError) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ 
            studied_today: stats.studiedToday + increment,
            updated_at: new Date().toISOString()
          } as any)
          .eq('user_id', user.id);

        if (updateError) {
          setStats(prev => {
            const newStudiedToday = prev.studiedToday - increment;
            const progressPercentage = prev.dailyGoal > 0 
              ? Math.min((newStudiedToday / prev.dailyGoal) * 100, 100)
              : 0;
            
            return {
              ...prev,
              studiedToday: newStudiedToday,
              progressPercentage,
            };
          });
          throw updateError;
        }
      }
    } catch (error) {
      console.error('Error updating studied today:', error);
      toast({
        title: "Error",
        description: "Failed to update study progress.",
        variant: "destructive",
      });
    }
  }, [user, toast, stats.studiedToday, stats.dailyGoal]);

  const updateAverageScore = useCallback(async (newScore: number) => {
    if (!user) return;

    try {
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('average_score, studied_today')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentAverage = (currentStats as any)?.average_score || 0;
      const totalSessions = (currentStats as any)?.studied_today || 0;
      
      const newAverage = totalSessions === 0 
        ? newScore 
        : ((currentAverage * (totalSessions - 1)) + newScore) / totalSessions;

      setStats(prev => ({
        ...prev,
        averageScore: Math.round(newAverage),
      }));

      const { error } = await supabase
        .from('user_stats')
        .update({ average_score: newAverage } as any)
        .eq('user_id', user.id);

      if (error) {
        await fetchUserStats();
        throw error;
      }
    } catch (error) {
      console.error('Error updating average score:', error);
      toast({
        title: "Error",
        description: "Failed to update average score.",
        variant: "destructive",
      });
    }
  }, [user, toast, fetchUserStats]);

  const updateStudyStreak = useCallback(async () => {
    if (!user) return;

    try {
      const { error: rpcError } = await supabase.rpc('update_study_streak', {
        user_uuid: user.id
      } as any);

      if (rpcError) {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: currentStats, error: fetchError } = await supabase
          .from('user_stats')
          .select('study_streak, last_streak_date')
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;

        const currentStreak = (currentStats as any)?.study_streak || 0;
        const lastStreakDate = (currentStats as any)?.last_streak_date;
        
        let newStreak = currentStreak;
        
        if (!lastStreakDate) {
          newStreak = 1;
        } else {
          const lastDate = new Date(lastStreakDate);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((Number(todayDate.getTime()) - Number(lastDate.getTime())) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 0) {
            return;
          } else if (daysDiff === 1) {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 1;
          }
        }

        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ 
            study_streak: newStreak,
            last_streak_date: today,
            updated_at: new Date().toISOString()
          } as any)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      await fetchUserStats();
    } catch (error) {
      console.error('Error updating study streak:', error);
      toast({
        title: "Error",
        description: "Failed to update study streak.",
        variant: "destructive",
      });
    }
  }, [user, toast, fetchUserStats]);

  const completeStudySession = useCallback(async (score: number, cardsStudied: number = 1) => {
    if (!user) return;

    try {
      await updateStudiedToday(cardsStudied);
      
      await updateAverageScore(score);
      
      await updateStudyStreak();

      toast({
        title: "Great job!",
        description: `You studied ${cardsStudied} card${cardsStudied > 1 ? 's' : ''} and scored ${Math.round(score)}%`,
      });
    } catch (error) {
      console.error('Error completing study session:', error);
    }
  }, [user, updateStudiedToday, updateAverageScore, updateStudyStreak, toast]);

  const resetDailyStats = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({ studied_today: 0 } as any)
        .eq('user_id', user.id);

      if (error) throw error;

      setStats(prev => ({
        ...prev,
        studiedToday: 0,
        progressPercentage: 0,
      }));
    } catch (error) {
      console.error('Error resetting daily stats:', error);
      toast({
        title: "Error",
        description: "Failed to reset daily stats.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  return {
    stats,
    loading,
    user,
    updateTotalFlashcards,
    updateTotalFlashcardsToCount,
    syncTotalFlashcards,
    updateStudiedToday,
    updateAverageScore,
    updateStudyStreak,
    completeStudySession,
    resetDailyStats,
    refreshStats: fetchUserStats,
  };
}
