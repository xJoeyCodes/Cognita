import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, BookOpen, Zap, Star, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Cognita Logo" 
              className="h-12 w-10 object-contain" 
            />
            <h1 className="text-xl font-bold gradient-text-primary">Cognita</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
               Turn Any PDF into{" "}
              <span className="gradient-text-primary">Smart Flashcards Instantly</span>{" "}
              with AI
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your notes, textbooks, or slides and let AI transform them into interactive flashcards and quizzes. 
              Learn faster, remember longer, and study on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="shadow-blue animate-glow"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                asChild
              >
                <Link to="/upload">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload & Learn Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-accent/50 hover:bg-accent/10" asChild>
                <Link to="/demo">
                  <Star className="mr-2 h-5 w-5" />
                  See Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Cognita?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes studying more efficient and effective than ever before.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-blue/20 hover:shadow-blue/40 transition-all duration-300 animate-float">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Advanced AI analyzes your PDFs and creates intelligent flashcards and quizzes automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-purple/20 hover:shadow-purple/40 transition-all duration-300 animate-float [animation-delay:0.2s]">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Smarter Memory</CardTitle>
                <CardDescription>
                  Spaced repetition keeps knowledge in your brain for the long run.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-blue/20 hover:shadow-blue/40 transition-all duration-300 animate-float [animation-delay:0.4s]">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Learn Your Way</CardTitle>
                <CardDescription>
                  Quizzes, flashcards, or both — tailor studying to your style.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-purple/20 hover:shadow-purple/40 transition-all duration-300 animate-float [animation-delay:0.6s]">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Easy PDF Upload</CardTitle>
                <CardDescription>
                  Drag and drop your PDFs for instant processing. Supports all major document formats.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-blue/20 hover:shadow-blue/40 transition-all duration-300 animate-float [animation-delay:0.8s]">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Export your flashcards to Anki, Quizlet, or CSV format for use in other platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-purple/20 hover:shadow-purple/40 transition-all duration-300 animate-float [animation-delay:1s]">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Audio Support</CardTitle>
                <CardDescription>
                  Text-to-speech functionality makes learning accessible and supports auditory learners.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Study Smarter?</h3>
            <p className="text-muted-foreground mb-8">
              Join students everywhere who are using Cognita to learn faster, retain more, and ace their exams.
            </p>
            <Button size="lg" className="shadow-blue animate-glow" asChild>
              <Link to="/auth">
                Start Learning Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Cognita. Built to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;