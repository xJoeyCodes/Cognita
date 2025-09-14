import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Brain,
  Clock,
  Trophy,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStats } from "@/hooks/useUserStats";
import { useAchievements } from "@/hooks/useAchievements";
import { Header } from "@/components/Header";

interface Flashcard {
  id: string;
  pdf_name: string | null;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  created_at: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard' | null;
  pdf_name: string | null;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: string; correct: string }[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStudySession, refreshStats } = useUserStats();
  useAchievements(); // Initialize achievement checking

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
          description: "Please sign in to start a quiz.",
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
          description: "Upload a PDF first to create flashcards for quizzing.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      const quizQuestions = data.map(flashcard => {
        const otherAnswers = data
          .filter(f => f.id !== flashcard.id)
          .map(f => f.answer)
          .slice(0, 3); // Take 3 other answers
        
        const shuffledWrong = otherAnswers.sort(() => Math.random() - 0.5);
        const wrongAnswers = shuffledWrong.slice(0, 3);
        
        const allOptions = [flashcard.answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        return {
          id: flashcard.id,
          question: flashcard.question,
          correctAnswer: flashcard.answer,
          options: allOptions,
          difficulty: flashcard.difficulty,
          pdf_name: flashcard.pdf_name
        };
      });

      const numQuestions = Math.min(Math.max(5, Math.floor(quizQuestions.length * 0.7)), 10);
      const selectedQuestions = quizQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, numQuestions);

      setQuestions(selectedQuestions);
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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const newAnswer = {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correctAnswer
    };
    
    setUserAnswers(prev => [...prev, newAnswer]);

    if (currentIndex === questions.length - 1) {
      const correctAnswers = [...userAnswers, newAnswer].filter(
        answer => answer.selected === answer.correct
      ).length;
      
      const score = (correctAnswers / questions.length) * 100;
      completeStudySession(score, questions.length);
      if (score >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      setQuizComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setQuizComplete(false);
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

  const getQuizDuration = () => {
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
            <div className="text-muted-foreground">Loading quiz questions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const correctAnswers = userAnswers.filter(answer => answer.selected === answer.correct).length;
    const finalScore = (correctAnswers / questions.length) * 100;
    const isHighScore = finalScore >= 80;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
        <Header backButtonText="Dashboard" />
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="text-4xl animate-pulse mt-2">✨</div>
              <div className="text-5xl animate-ping mt-1">🌟</div>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {isHighScore ? (
                  <Trophy className="h-12 w-12 text-yellow-500" />
                ) : (
                  <Target className="h-12 w-12 text-primary" />
                )}
              </div>
              <CardTitle className={`text-3xl font-bold ${isHighScore ? 'text-yellow-600' : 'text-green-600'}`}>
                {isHighScore ? 'Excellent Work!' : 'Quiz Complete!'}
              </CardTitle>
              <CardDescription className="text-lg">
                {isHighScore ? 'Outstanding performance!' : 'Great job completing the quiz'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isHighScore ? 'text-yellow-600' : 'text-primary'}`}>
                  {Math.round(finalScore)}%
                </div>
                <p className="text-muted-foreground">
                  You got {correctAnswers} out of {questions.length} correct
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Quiz duration: {getQuizDuration()}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Accuracy</span>
                  <span className="font-medium">{Math.round(finalScore)}%</span>
                </div>
                <Progress value={finalScore} className="h-2" />
              </div>

              {isHighScore && (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">🎉 High Score! You're on fire!</p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
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
              <Brain className="h-6 w-6" />
              Practice Quiz
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {getQuizDuration()}
              </div>
              <div>
                {currentIndex + 1} of {questions.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.pdf_name || 'Unknown PDF'}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {getDifficultyLabel(currentQuestion.difficulty)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={`w-full h-auto p-6 text-left justify-start text-wrap ${
                      selectedAnswer === option 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="font-bold text-lg flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm leading-relaxed break-words">
                        {option}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="px-8"
                >
                  {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
