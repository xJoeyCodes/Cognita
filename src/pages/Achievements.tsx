import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Target, 
  Star, 
  Calendar, 
  Brain, 
  Zap, 
  Crown,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useUserStats } from "@/hooks/useUserStats";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'streak' | 'score' | 'study' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  gradient: string;
}

const Achievements = () => {
  const { stats } = useUserStats();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAchievements();
  }, [stats]);

  const generateAchievements = () => {
    const allAchievements: Achievement[] = [
      // Study Streak Achievements
      {
        id: 'first_streak',
        title: 'First Steps',
        description: 'Complete your first study session',
        icon: Flame,
        category: 'streak',
        requirement: 1,
        current: stats?.study_streak || 0,
        unlocked: (stats?.study_streak || 0) >= 1,
        rarity: 'common',
        gradient: 'from-green-400 to-green-600'
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 5-day study streak',
        icon: Calendar,
        category: 'streak',
        requirement: 5,
        current: stats?.study_streak || 0,
        unlocked: (stats?.study_streak || 0) >= 5,
        rarity: 'rare',
        gradient: 'from-blue-400 to-blue-600'
      },
      {
        id: 'two_week_champion',
        title: 'Two-Week Champion',
        description: 'Achieve a 15-day study streak',
        icon: Crown,
        category: 'streak',
        requirement: 15,
        current: stats?.study_streak || 0,
        unlocked: (stats?.study_streak || 0) >= 15,
        rarity: 'epic',
        gradient: 'from-purple-400 to-purple-600'
      },
      {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day study streak',
        icon: Trophy,
        category: 'streak',
        requirement: 30,
        current: stats?.study_streak || 0,
        unlocked: (stats?.study_streak || 0) >= 30,
        rarity: 'legendary',
        gradient: 'from-yellow-400 to-orange-500'
      },

      // Score-Based Achievements
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 90% average score for 7 days',
        icon: Target,
        category: 'score',
        requirement: 90,
        current: stats?.average_score || 0,
        unlocked: (stats?.average_score || 0) >= 90,
        rarity: 'epic',
        gradient: 'from-pink-400 to-rose-600'
      },
      {
        id: 'excellent_student',
        title: 'Excellent Student',
        description: 'Maintain 80% average score for 14 days',
        icon: Star,
        category: 'score',
        requirement: 80,
        current: stats?.average_score || 0,
        unlocked: (stats?.average_score || 0) >= 80,
        rarity: 'rare',
        gradient: 'from-indigo-400 to-indigo-600'
      },
      {
        id: 'good_progress',
        title: 'Good Progress',
        description: 'Achieve 70% average score',
        icon: TrendingUp,
        category: 'score',
        requirement: 70,
        current: stats?.average_score || 0,
        unlocked: (stats?.average_score || 0) >= 70,
        rarity: 'common',
        gradient: 'from-teal-400 to-teal-600'
      },

      // Study Volume Achievements
      {
        id: 'flashcard_master',
        title: 'Flashcard Master',
        description: 'Create 100 flashcards',
        icon: Brain,
        category: 'study',
        requirement: 100,
        current: stats?.total_flashcards || 0,
        unlocked: (stats?.total_flashcards || 0) >= 100,
        rarity: 'epic',
        gradient: 'from-cyan-400 to-cyan-600'
      },
      {
        id: 'knowledge_builder',
        title: 'Knowledge Builder',
        description: 'Create 50 flashcards',
        icon: BookOpen,
        category: 'study',
        requirement: 50,
        current: stats?.total_flashcards || 0,
        unlocked: (stats?.total_flashcards || 0) >= 50,
        rarity: 'rare',
        gradient: 'from-emerald-400 to-emerald-600'
      },
      {
        id: 'getting_started',
        title: 'Getting Started',
        description: 'Create your first 10 flashcards',
        icon: Zap,
        category: 'study',
        requirement: 10,
        current: stats?.total_flashcards || 0,
        unlocked: (stats?.total_flashcards || 0) >= 10,
        rarity: 'common',
        gradient: 'from-lime-400 to-lime-600'
      },

      // Special Achievements
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Study before 8 AM for 5 consecutive days',
        icon: Clock,
        category: 'special',
        requirement: 5,
        current: 0, // This would need special tracking
        unlocked: false,
        rarity: 'rare',
        gradient: 'from-amber-400 to-amber-600'
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Study after 10 PM for 5 consecutive days',
        icon: Star,
        category: 'special',
        requirement: 5,
        current: 0, // This would need special tracking
        unlocked: false,
        rarity: 'rare',
        gradient: 'from-violet-400 to-violet-600'
      }
    ];

    setAchievements(allAchievements);
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return Flame;
      case 'score': return Target;
      case 'study': return Brain;
      case 'special': return Award;
      default: return Trophy;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-black mb-4">Achievements</h1>
          <p className="text-gray-600 text-lg mb-6">
            Unlock badges and achievements as you progress in your learning journey
          </p>
          
          {/* Progress Overview */}
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {unlockedCount} / {totalCount}
                </span>
              </div>
              <Progress 
                value={(unlockedCount / totalCount) * 100} 
                className="h-2"
              />
              <div className="flex justify-center mt-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="ml-2 text-sm text-gray-600">
                  {Math.round((unlockedCount / totalCount) * 100)}% Complete
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            const CategoryIcon = getCategoryIcon(achievement.category);
            const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'ring-2 ring-yellow-400 shadow-lg' 
                    : 'hover:shadow-md'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.gradient} ${
                        achievement.unlocked ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        {achievement.unlocked && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <CardTitle className={`text-lg ${achievement.unlocked ? 'text-black' : 'text-gray-500'}`}>
                      {achievement.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {achievement.current} / {achievement.requirement}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          <span className="capitalize">{achievement.category}</span>
                        </div>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
