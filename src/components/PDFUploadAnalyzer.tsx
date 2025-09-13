import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, FileText, Brain, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Flashcard {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  pdf_name: string | null;
  created_at: string;
}

interface Quiz {
  id: string;
  user_id: string;
  question: string;
  options: string[];
  correct: number;
  pdf_name: string | null;
  created_at: string;
}

interface PDFUploadAnalyzerProps {
  onFlashcardsUpdated: () => void;
}

const PDFUploadAnalyzer = ({ onFlashcardsUpdated }: PDFUploadAnalyzerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentFlashcards, setRecentFlashcards] = useState<Flashcard[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a PDF smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setIsAnalyzing(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const fileName = `${user.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data, error: analysisError } = await supabase.functions.invoke('analyze-pdf', {
        body: {
          pdfData: base64,
          pdfName: file.name,
          userId: user.id
        }
      });

      if (analysisError) {
        throw new Error(`Analysis failed: ${analysisError.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setRecentFlashcards(data.flashcards || []);
      setRecentQuizzes(data.quizzes || []);

      onFlashcardsUpdated();

      toast({
        title: "PDF analyzed successfully!",
        description: `Generated ${data.flashcards?.length || 0} flashcards and ${data.quizzes?.length || 0} quizzes.`,
      });

    } catch (error) {
      console.error('PDF analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : 'An error occurred while analyzing the PDF.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  }, [toast, onFlashcardsUpdated]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading || isAnalyzing
  });

  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecentFlashcards(prev => prev.filter(card => card.id !== id));
      onFlashcardsUpdated();

      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been removed.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete the flashcard.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New PDFs
          </CardTitle>
          <CardDescription>
            Upload a PDF document to automatically generate flashcards and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isUploading ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading PDF...</p>
                <Skeleton className="h-2 w-32 mx-auto" />
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-2">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                <p className="text-sm font-medium">Analyzing your PDF...</p>
                <p className="text-xs text-muted-foreground">This may take a few moments</p>
                <Skeleton className="h-2 w-48 mx-auto" />
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PDF files up to 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Flashcards */}
      {recentFlashcards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recently Generated Flashcards
            </CardTitle>
            <CardDescription>
              Flashcards created from your latest PDF upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFlashcards.map((card) => (
                <div key={card.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{card.question}</p>
                      <p className="text-sm text-muted-foreground">{card.answer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {card.difficulty}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFlashcard(card.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {format(new Date(card.created_at), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>From: {card.pdf_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Quizzes */}
      {recentQuizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recently Generated Quizzes
            </CardTitle>
            <CardDescription>
              Multiple-choice quizzes created from your latest PDF upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <p className="font-medium">{quiz.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quiz.options.map((option, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded ${
                            index === quiz.correct
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {format(new Date(quiz.created_at), 'MMM d, yyyy')}</span>
                    <span>•</span>
                    <span>From: {quiz.pdf_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFUploadAnalyzer;

