import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Upload, FileText, BookOpen, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStats } from "@/hooks/useUserStats";
import { Header } from "@/components/Header";

interface Flashcard {
  id: string;
  pdf_file_name: string;
  question: string;
  answer: string;
  difficulty: number;
  created_at: string;
}

const Dashboard = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const { stats, loading: statsLoading, updateTotalFlashcards, updateTotalFlashcardsToCount, syncTotalFlashcards } = useUserStats();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your flashcards.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFlashcards(data || []);
      
      // Sync total flashcards count with actual count
      await syncTotalFlashcards();
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to load flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFlashcards(prev => prev.filter(card => card.id !== id));
      
      // Update total flashcards count in stats to match actual count
      const newCount = flashcards.length - 1;
      await updateTotalFlashcardsToCount(newCount);

      toast({
        title: "Success",
        description: "Flashcard deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard. Please try again.",
        variant: "destructive",
      });
    }
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <Header backButtonText="Home" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Study Dashboard</h2>
          <p className="text-muted-foreground">
            Track your learning progress and manage your flashcards.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-blue/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Flashcards</CardTitle>
              <div className="text-2xl font-bold">{stats.totalFlashcards}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Across all your uploaded PDFs
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-purple/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Studied Today</CardTitle>
              <div className="text-2xl font-bold">{stats.studiedToday}</div>
            </CardHeader>
            <CardContent>
              <Progress value={stats.progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(stats.progressPercentage)}% of daily goal ({stats.dailyGoal} cards)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-blue/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Keep it up! You're doing great
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-purple/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <div className="text-2xl font-bold">{stats.streakDays} days</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Don't break the chain!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button size="lg" className="h-20 shadow-blue" asChild>
            <Link to="/upload" className="flex-col">
              <Upload className="h-6 w-6 mb-2" />
              Upload New PDFs
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 border-accent/50 hover:bg-accent/10"
            onClick={() => navigate('/study-session')}
            disabled={flashcards.length === 0}
          >
            <div className="flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Start Study Session
            </div>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-20 border-accent/50 hover:bg-accent/10"
            onClick={() => navigate('/quiz')}
            disabled={flashcards.length === 0}
          >
            <div className="flex-col">
              <Brain className="h-6 w-6 mb-2" />
              Practice Quiz
            </div>
          </Button>
        </div>

        {/* Flashcards List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Flashcards
            </CardTitle>
            <CardDescription>
              {flashcards.length === 0 
                ? "Upload your first PDF to start creating flashcards!" 
                : `${flashcards.length} flashcards ready for study`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading || statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading flashcards...</div>
              </div>
            ) : flashcards.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                  Upload your first PDF document to start creating AI-powered flashcards.
                </p>
                <Button asChild>
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDFs
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {flashcards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {card.pdf_file_name}
                          </Badge>
                          <Badge className={getDifficultyColor(card.difficulty)}>
                            {getDifficultyLabel(card.difficulty)}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-2">{card.question}</h4>
                        <p className="text-sm text-muted-foreground">{card.answer}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteFlashcard(card.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(card.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;