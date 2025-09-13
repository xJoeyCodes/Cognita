import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: string;
  pdf_name: string | null;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  created_at: string;
}

interface StudySessionProps {
  flashcards: Flashcard[];
  onComplete: () => void;
}

export function StudySession({ flashcards, onComplete }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const { completeStudySession } = useUserStats();
  const { toast } = useToast();

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
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-blue-100 text-blue-800";
      case 3: return "bg-yellow-100 text-yellow-800";
      case 4: return "bg-orange-100 text-orange-800";
      case 5: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      case 4: return "Expert";
      case 5: return "Master";
      default: return "Unknown";
    }
  };

  if (sessionComplete) {
    const finalScore = (sessionResults.correct / sessionResults.total) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
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
                <Button onClick={onComplete}>
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
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Study Session</h2>
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {flashcards.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="max-w-4xl mx-auto">
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-xs">
                  {currentCard.pdf_file_name}
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
                    <div className="p-6 bg-secondary/50 rounded-lg">
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
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="px-8"
                  >
                    Show Answer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
