import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserStats } from "@/hooks/useUserStats";
import { Header } from "@/components/Header";

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateTotalFlashcards } = useUserStats();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF files.",
        variant: "destructive",
      });
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let errorCount = 0;

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload files.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

        let fileSuccess = false;
        
        try {
          const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
          
          if (!geminiApiKey) {
            throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.');
          }

          console.log('Starting AI analysis for:', file.name);
          
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Analyze this PDF and generate 5 flashcards and 3 multiple-choice quiz questions. Return ONLY a valid JSON object with this exact structure:

{
  "flashcards": [
    {
      "question": "What is the main topic?",
      "answer": "Detailed answer here",
      "difficulty": "easy"
    }
  ],
  "quizzes": [
    {
      "question": "What is the primary focus?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Generate relevant questions and answers based on the actual PDF content. Use difficulty levels: easy, medium, hard.`,
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64
                  }
                }]
              }]
            })
          });

          console.log('Gemini API response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error response:', errorText);
            throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
          }

          const result = await response.json();
          console.log('Gemini API result:', result);
          
          const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!content) {
            console.error('No content in Gemini response:', result);
            throw new Error('No content generated by Gemini API');
          }

          console.log('Gemini generated content:', content);

          let aiData;
          try {
            aiData = JSON.parse(content);
            console.log('Parsed AI data:', aiData);
          } catch (parseError) {
            console.error('Failed to parse AI response:', content);
            throw new Error('Invalid JSON response from AI');
          }

          if (aiData.flashcards && aiData.flashcards.length > 0) {
            const flashcards = aiData.flashcards.map((card: any) => ({
              user_id: user.id,
              pdf_name: file.name,
              question: card.question,
              answer: card.answer,
              difficulty: card.difficulty || 'medium'
            }));

            const { error: insertError } = await supabase
              .from('flashcards')
              .insert(flashcards);

            if (insertError) {
              console.error('Error inserting AI-generated flashcards:', insertError);
              throw new Error(`Failed to save flashcards: ${insertError.message}`);
            } else {
              await updateTotalFlashcards(flashcards.length);
              console.log('Successfully inserted', flashcards.length, 'flashcards');
            }
          }

          if (aiData.quizzes && aiData.quizzes.length > 0) {
            const quizzes = aiData.quizzes.map((quiz: any) => ({
              user_id: user.id,
              pdf_name: file.name,
              question: quiz.question,
              options: quiz.options,
              correct: quiz.correct
            }));

            const { error: quizInsertError } = await supabase
              .from('quizzes')
              .insert(quizzes);

            if (quizInsertError) {
              console.error('Error inserting AI-generated quizzes:', quizInsertError);
            } else {
              console.log('Successfully inserted', quizzes.length, 'quizzes');
            }
          }

          fileSuccess = true;
          successCount++;

        } catch (aiError) {
          console.error('AI analysis error for', file.name, ':', aiError);
          errorCount++;
          
          toast({
            title: "AI Analysis failed",
            description: `Could not analyze ${file.name}: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
            variant: "destructive",
          });
          
          const difficulties = ['easy', 'medium', 'hard'] as const;
          const fallbackFlashcards = [
            {
              user_id: user.id,
              pdf_name: file.name,
              question: `What is the main topic discussed in ${file.name}?`,
              answer: "Unable to analyze PDF content with AI. Please check your API key or try again.",
              difficulty: difficulties[Math.floor(Math.random() * 3)]
            }
          ];

          const { error: insertError } = await supabase
            .from('flashcards')
            .insert(fallbackFlashcards);

          if (insertError) {
            console.error('Error inserting fallback flashcards:', insertError);
          } else {
            await updateTotalFlashcards(fallbackFlashcards.length);
          }
        }

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (successCount > 0 && errorCount === 0) {
        toast({
          title: "Upload successful!",
          description: `All ${successCount} PDF(s) analyzed with AI and flashcards created. Redirecting to dashboard...`,
        });
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: "Partial success",
          description: `${successCount} PDF(s) analyzed successfully, ${errorCount} failed. Check console for details.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: `All ${errorCount} PDF(s) failed to analyze. Check your API key and try again.`,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <Header backButtonText="Home" showUploadButton={false} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Upload Your PDFs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your PDF documents and let our AI create intelligent flashcards and quizzes for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Zone */}
            <Card className="shadow-green/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Drag and drop your PDF files here, or click to select files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-primary bg-primary/5 shadow-green'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    {isDragActive ? (
                      <p className="text-primary font-medium">Drop your PDFs here...</p>
                    ) : (
                      <>
                        <p className="font-medium">Drop PDFs here or click to upload</p>
                        <p className="text-sm text-muted-foreground">
                          Supports multiple files • Max 10MB per file
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium">Selected Files ({files.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-destructive" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-48">
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing files...</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={files.length === 0 || uploading}
                  className="w-full mt-6 shadow-green"
                  size="lg"
                >
                  {uploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Our AI will process your PDFs in three simple steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Text Extraction</h4>
                    <p className="text-sm text-muted-foreground">
                      We extract and analyze the text content from your PDF documents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-accent">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">AI Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI identifies key concepts and generates relevant questions and answers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Flashcard Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Your personalized flashcards and quizzes are ready for study sessions.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Supports PDFs up to 10MB</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Multiple file upload</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Intelligent content analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;