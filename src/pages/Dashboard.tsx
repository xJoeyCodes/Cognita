import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Upload, FileText, BookOpen, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserStats } from "@/hooks/useUserStats";
import { Header } from "@/components/Header";
import PDFUploadAnalyzer from "@/components/PDFUploadAnalyzer";

interface Flashcard {
  id: string;
  pdf_name: string | null;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
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

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return "bg-green-100 text-green-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'hard': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy': return "Easy";
      case 'medium': return "Medium";
      case 'hard': return "Hard";
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload PDFs</TabsTrigger>
            <TabsTrigger value="flashcards">Your Flashcards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <PDFUploadAnalyzer onFlashcardsUpdated={fetchFlashcards} />
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Flashcards
                </CardTitle>
                <CardDescription>
                  Manage and study your flashcards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : flashcards.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload a PDF to generate flashcards automatically
                    </p>
                    <Button asChild>
                      <Link to="/upload">Upload PDF</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flashcards.map((card) => (
                      <div key={card.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{card.question}</h4>
                              {card.difficulty && (
                                <Badge className={getDifficultyColor(card.difficulty)}>
                                  {getDifficultyLabel(card.difficulty)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{card.answer}</p>
                            {card.pdf_name && (
                              <p className="text-xs text-muted-foreground">
                                From: {card.pdf_name}
                              </p>
                            )}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;