import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  BookOpen,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStats } from "@/hooks/useUserStats";
import { Header } from "@/components/Header";

interface Flashcard {
  id: string;
  pdf_name: string | null;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  created_at: string;
}

const StudySession = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStudySession, refreshStats } = useUserStats();

  useEffect(() => {
    fetchFlashcards();
    setStartTime(new Date());
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to start a study session.",
          variant: "destructive",
        });
        navigate('/home');
        return;
      }

      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "No flashcards found",
          description: "Upload a PDF first to create flashcards for studying.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setFlashcards(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to load flashcards. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleAnswer = (isCorrect: boolean) => {
    const newAnswers = [...userAnswers, isCorrect];
    setUserAnswers(newAnswers);
    
    setSessionResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (currentIndex === flashcards.length - 1) {
      const score = (newAnswers.filter(Boolean).length / newAnswers.length) * 100;
      completeStudySession(score, flashcards.length);
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionResults({ correct: 0, total: 0 });
    setSessionComplete(false);
    setUserAnswers([]);
    setStartTime(new Date());
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
    switch (difficulty) {
      case 'easy': return "bg-green-100 text-green-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'hard': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
    switch (difficulty) {
      case 'easy': return "Easy";
      case 'medium': return "Medium";
      case 'hard': return "Hard";
      default: return "Unknown";
    }
  };

  const getSessionDuration = () => {
    if (!startTime) return "0:00";
    const duration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
        <Header backButtonText="Dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading flashcards...</div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const finalScore = (sessionResults.correct / sessionResults.total) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
        <Header backButtonText="Dashboard" />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">Session Complete!</CardTitle>
              <CardDescription className="text-lg">
                Great job studying your flashcards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(finalScore)}%
                </div>
                <p className="text-muted-foreground">
                  You got {sessionResults.correct} out of {sessionResults.total} correct
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Session duration: {getSessionDuration()}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Accuracy</span>
                  <span className="font-medium">{Math.round(finalScore)}%</span>
                </div>
                <Progress value={finalScore} className="h-2" />
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetSession} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Study Again
                </Button>
                <Button onClick={() => {
                  refreshStats();
                  navigate('/dashboard');
                }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <Header backButtonText="Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Study Session
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {getSessionDuration()}
              </div>
              <div>
                {currentIndex + 1} of {flashcards.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="max-w-4xl mx-auto">
          <Card className="min-h-[400px] hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-xs">
                  {currentCard.pdf_name || 'Unknown PDF'}
                </Badge>
                <Badge className={getDifficultyColor(currentCard.difficulty)}>
                  {getDifficultyLabel(currentCard.difficulty)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6">
                  {currentCard.question}
                </h3>
                
                {showAnswer ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-secondary/50 rounded-lg border-2 border-dashed border-primary/20">
                      <p className="text-lg">{currentCard.answer}</p>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => handleAnswer(false)}
                        variant="destructive"
                        size="lg"
                        className="px-8"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Got it Wrong
                      </Button>
                      <Button
                        onClick={() => handleAnswer(true)}
                        size="lg"
                        className="px-8"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Got it Right
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowAnswer(true)}
                      size="lg"
                      className="px-8"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Show Answer
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Click to reveal the answer, then rate your performance
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
